import { API, apiUrl } from '../services/api'

/**
 * Cloudinary URL transformation & upload utilities for Alpine Explorers
 * Supports responsive image delivery, auto format/quality, video delivery & posters,
 * and high-performance XHR uploads with real progress tracking.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'izgswkwq'

/**
 * Injects transformations into a Cloudinary secure_url.
 * If the URL is not from Cloudinary, it is returned untouched.
 *
 * @param {string} url - Original media URL
 * @param {object} options - Transformation options
 * @param {number|string} [options.w] - Target width
 * @param {number|string} [options.h] - Target height
 * @param {string} [options.q='auto'] - Quality
 * @param {string} [options.f='auto'] - Format
 * @param {string} [options.c] - Crop mode
 * @returns {string} Transformed URL
 */
export function cloudinaryUrl(url, { w, h, q = 'auto', f = 'auto', c } = {}) {
  if (!url || typeof url !== 'string') return ''
  if (!url.includes('res.cloudinary.com')) return url

  const parts = []
  if (f) parts.push(`f_${f}`)
  if (q) parts.push(`q_${q}`)
  if (c) parts.push(`c_${c}`)
  if (w) parts.push(`w_${w}`)
  if (h) parts.push(`h_${h}`)

  if (parts.length === 0) return url
  const transform = parts.join(',')

  const uploadToken = '/upload/'
  const uploadIndex = url.indexOf(uploadToken)
  if (uploadIndex === -1) return url

  const prefix = url.slice(0, uploadIndex + uploadToken.length)
  const remainder = url.slice(uploadIndex + uploadToken.length)

  // Strip existing transformation if already inserted
  const cleanedRemainder = remainder.replace(/^(?:[a-z]_[a-zA-Z0-9_.,-]+(?:\/|,)?)+\//, '')

  return `${prefix}${transform}/${cleanedRemainder}`
}

/**
 * Generates an optimized video poster thumbnail from a Cloudinary video URL.
 * Replaces video extension with .jpg and injects `so_0` (start offset 0) + auto quality/format.
 *
 * @param {string} videoUrl - Cloudinary video URL
 * @param {object} [options]
 * @param {number} [options.w=800] - Poster width
 * @returns {string} Poster image URL
 */
export function getVideoPosterUrl(videoUrl, { w = 800, q = 'auto', f = 'auto' } = {}) {
  if (!videoUrl || typeof videoUrl !== 'string') return ''
  if (!videoUrl.includes('res.cloudinary.com')) {
    // If not on Cloudinary, fallback to URL itself or empty
    return videoUrl.replace(/\.(mp4|webm|mov|m4v|mkv)$/i, '.jpg')
  }

  // Replace video file extension with .jpg
  let posterUrl = videoUrl.replace(/\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i, '.jpg')

  const uploadToken = '/upload/'
  const uploadIndex = posterUrl.indexOf(uploadToken)
  if (uploadIndex === -1) return posterUrl

  const prefix = posterUrl.slice(0, uploadIndex + uploadToken.length)
  const remainder = posterUrl.slice(uploadIndex + uploadToken.length)
  const cleanedRemainder = remainder.replace(/^(?:[a-z]_[a-zA-Z0-9_.,-]+(?:\/|,)?)+\//, '')

  // Include `so_0` to capture the first frame
  const transform = `so_0,f_${f},q_${q},w_${w}`
  return `${prefix}${transform}/${cleanedRemainder}`
}

/**
 * Formats duration in seconds into MM:SS format (e.g. 42 -> "0:42", 75 -> "1:15")
 *
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const total = Math.round(Number(seconds))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

/**
 * Generates an HTML srcset string for responsive images.
 */
export function getCloudinarySrcSet(url, widths = [400, 600, 900, 1200, 1600]) {
  if (!url || !url.includes('res.cloudinary.com')) return ''
  return widths
    .map((w) => `${cloudinaryUrl(url, { w, q: 'auto', f: 'auto' })} ${w}w`)
    .join(', ')
}

/**
 * Standard sizes attribute for the gallery masonry layout
 */
export const GALLERY_SIZES =
  '(max-width: 480px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw'

/**
 * Uploads a photo or video to Cloudinary with real-time XHR progress tracking.
 * Limits: Images max 15MB, Videos max 100MB.
 *
 * @param {File} file - File object to upload
 * @param {object} options
 * @param {function} [options.onProgress] - Callback (percent: number)
 * @param {AbortSignal} [options.signal] - AbortSignal for cancellation
 * @param {string} [options.folder='alpine-explorers/gallery'] - Destination folder
 * @returns {Promise<object>} Upload response with secure_url, public_id, resource_type, etc.
 */
export function uploadFile(file, { onProgress, signal, folder = 'alpine-explorers/gallery' } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for upload'))
    }

    const isVideo = file.type.startsWith('video/')
    const maxImgSize = 15 * 1024 * 1024 // 15MB
    const maxVidSize = 100 * 1024 * 1024 // 100MB (Cloudinary free tier limit)

    if (!isVideo && file.size > maxImgSize) {
      return reject(new Error(`${file.name} exceeds the 15MB limit for images.`))
    }
    if (isVideo && file.size > maxVidSize) {
      return reject(new Error(`${file.name} exceeds the 100MB limit for videos.`))
    }

    const xhr = new XMLHttpRequest()

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('Upload cancelled by user'))
      })
    }

    // Real progress bar handling
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.min(100, Math.round((event.loaded / event.total) * 100))
        onProgress(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText)
          // Normalize Cloudinary response attributes
          const secure_url = res.secure_url || res.url || res.media?.url
          const public_id = res.public_id || res.media?.filename || ''
          const width = res.width || (isVideo ? 1280 : 1600)
          const height = res.height || (isVideo ? 720 : 1066)
          const resource_type = res.resource_type || (isVideo ? 'video' : 'image')
          const duration = res.duration || (isVideo ? 0 : null)

          // Auto-generate video thumbnail if video
          const thumbnail_url = isVideo
            ? getVideoPosterUrl(secure_url, { w: 800 })
            : secure_url

          resolve({
            secure_url,
            public_id,
            width,
            height,
            resource_type,
            media_type: resource_type,
            duration,
            thumbnail_url,
            bytes: res.bytes || file.size,
          })
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response: ' + e.message))
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText)
          const msg = errRes.error?.message || errRes.error || `Upload failed with status ${xhr.status}`
          console.error(`[CloudinaryUpload] HTTP ${xhr.status} Error:`, errRes)
          reject(new Error(msg))
        } catch {
          console.error(`[CloudinaryUpload] HTTP ${xhr.status} Error:`, xhr.responseText)
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText || xhr.responseText}`))
        }
      }
    }

    xhr.onerror = () => {
      reject(new Error('Network error during file upload. Check your connection.'))
    }

    xhr.onabort = () => {
      reject(new Error('Upload cancelled'))
    }

    // Send via backend /api/media (which has Cloudinary API Secret and supports video/image)
    const mediaUrl = apiUrl('/media')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    fd.append('category', 'gallery')

    xhr.open('POST', mediaUrl)

    // Attach auth token using standard API.getToken()
    try {
      const token = API.getToken()
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
    } catch {
      // Ignore
    }

    xhr.send(fd)
  })
}
