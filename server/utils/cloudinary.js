import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'izgswkwq',
  api_key: process.env.CLOUDINARY_API_KEY || '277647969313713',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rprGXN65QRHqrYYvlCLypArfWN4',
  secure: true,
})

/**
 * Uploads a buffer directly to Cloudinary
 * Supports both images and videos (resource_type: 'auto')
 */
export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'alpine_explorers',
        resource_type: options.resource_type || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    uploadStream.end(buffer)
  })
}

/**
 * Upload a remote URL (e.g., Unsplash) directly to Cloudinary
 */
export async function uploadUrlToCloudinary(url, options = {}) {
  return cloudinary.uploader.upload(url, {
    folder: options.folder || 'alpine_explorers',
    resource_type: options.resource_type || 'auto',
    ...options,
  })
}

export { cloudinary }
