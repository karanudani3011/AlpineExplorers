import { useState, useRef } from 'react'
import {
  Upload,
  X,
  Check,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  MapPin,
  Tag,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react'
import { uploadFile } from '../../../utils/cloudinary'
import { createGalleryImage, createGalleryImagesBatch } from '../../../services/galleryService'
import { Btn, NAVY, GOLD } from '../admin-ui'

const MAX_FILES = 20
const MAX_IMG_SIZE = 15 * 1024 * 1024 // 15MB
const MAX_VID_SIZE = 100 * 1024 * 1024 // 100MB (Cloudinary Free Plan Limit)
const CONCURRENCY_LIMIT = 3

// Helper to inspect image/video metadata in browser
function getMediaDimensions(file) {
  return new Promise((resolve) => {
    const isVid = file.type.startsWith('video/')
    const url = URL.createObjectURL(file)

    if (isVid) {
      const vid = document.createElement('video')
      vid.preload = 'metadata'
      vid.onloadedmetadata = () => {
        resolve({
          width: vid.videoWidth || 1280,
          height: vid.videoHeight || 720,
          duration: vid.duration || 0,
        })
      }
      vid.onerror = () => resolve({ width: 1280, height: 720, duration: 0 })
      vid.src = url
    } else {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth || 1200, height: img.naturalHeight || 800, duration: 0 })
      }
      img.onerror = () => resolve({ width: 1200, height: 800, duration: 0 })
      img.src = url
    }
  })
}

export default function UploadDropzone({
  categories = [],
  onUploadSuccess,
  onClose,
  addToast,
}) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  // Bulk apply controls
  const [bulkCategory, setBulkCategory] = useState('')
  const [bulkLocation, setBulkLocation] = useState('')

  const fileInputRef = useRef(null)
  const abortControllersRef = useRef({})

  const handleFilesSelected = async (filesList) => {
    const incoming = Array.from(filesList)
    if (!incoming.length) return

    if (selectedFiles.length + incoming.length > MAX_FILES) {
      addToast(`You can upload up to ${MAX_FILES} items at once.`, 'error')
      return
    }

    const validItems = []

    for (const file of incoming) {
      const isVid = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(file.name)
      const isImg =
        file.type.startsWith('image/') ||
        /\.(jpg|jpeg|png|webp|avif|heic)$/i.test(file.name)

      if (!isVid && !isImg) {
        addToast(`${file.name}: Unsupported format. Use JPG, PNG, WebP, AVIF, HEIC or MP4, MOV, WebM.`, 'error')
        continue
      }

      if (!isVid && file.size > MAX_IMG_SIZE) {
        addToast(`${file.name} exceeds 15MB limit for images.`, 'error')
        continue
      }

      if (isVid && file.size > MAX_VID_SIZE) {
        addToast(`${file.name} exceeds 100MB limit for videos (Cloudinary limit).`, 'error')
        continue
      }

      const meta = await getMediaDimensions(file)
      const preview = URL.createObjectURL(file)

      // Auto-generate title from filename
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      validItems.push({
        id: Math.random().toString(36).slice(2),
        file,
        preview,
        isVideo: isVid,
        title: cleanTitle,
        caption: '',
        location: bulkLocation || '',
        category_id: bulkCategory || categories[0]?.id || '',
        width: meta.width,
        height: meta.height,
        duration: meta.duration || 0,
        progress: 0,
        status: 'pending', // 'pending' | 'uploading' | 'done' | 'error' | 'cancelled'
        error: null,
        result: null,
      })
    }

    setSelectedFiles((prev) => [...prev, ...validItems])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files)
    }
  }

  const handleRemoveItem = (id) => {
    // If uploading, cancel first
    if (abortControllersRef.current[id]) {
      abortControllersRef.current[id].abort()
      delete abortControllersRef.current[id]
    }
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCancelItem = (id) => {
    if (abortControllersRef.current[id]) {
      abortControllersRef.current[id].abort()
      delete abortControllersRef.current[id]
    }
    setSelectedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'cancelled', error: 'Upload cancelled' } : item))
    )
  }

  const handleUpdateItem = (id, field, value) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  // Bulk Apply
  const applyCategoryToAll = () => {
    if (!bulkCategory) return
    setSelectedFiles((prev) =>
      prev.map((item) => ({ ...item, category_id: bulkCategory }))
    )
    addToast('Category applied to all selected items', 'success')
  }

  const applyLocationToAll = () => {
    if (!bulkLocation.trim()) return
    setSelectedFiles((prev) =>
      prev.map((item) => ({ ...item, location: bulkLocation.trim() }))
    )
    addToast('Location applied to all selected items', 'success')
  }

  // Retry saving a single item to the database without re-uploading to Cloudinary
  const handleRetrySave = async (item) => {
    if (!item.cloudRes) {
      handleUpdateItem(item.id, 'status', 'pending')
      return
    }

    setSelectedFiles((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: 'saving', error: null } : f))
    )

    const payload = {
      title: item.title || 'Untitled',
      caption: item.caption || '',
      image_url: item.cloudRes.secure_url,
      thumbnail_url: item.cloudRes.thumbnail_url || item.cloudRes.secure_url,
      media_type: item.cloudRes.resource_type || (item.isVideo ? 'video' : 'image'),
      resource_type: item.cloudRes.resource_type || (item.isVideo ? 'video' : 'image'),
      duration: item.cloudRes.duration || item.duration || null,
      public_id: item.cloudRes.public_id,
      width: item.cloudRes.width || item.width,
      height: item.cloudRes.height || item.height,
      category_id: item.category_id || null,
      location: item.location || '',
      is_featured: false,
      is_published: true,
      sort_order: 0,
    }

    try {
      const saved = await createGalleryImage(payload)
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'done', progress: 100, error: null, saveFailed: false, result: saved }
            : f
        )
      )
      addToast(`"${item.title}" successfully published to the gallery!`, 'success')
      onUploadSuccess()
    } catch (err) {
      console.error('[UploadDropzone] Retry save error:', err)
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'error', saveFailed: true, error: err.message || 'Database save failed' }
            : f
        )
      )
      addToast('Database save failed: ' + err.message, 'error')
    }
  }

  // Concurrency Limited Parallel Upload Queue (Limit 3)
  const handleStartUpload = async () => {
    if (!selectedFiles.length) return
    setUploading(true)

    const pendingItems = selectedFiles.filter(
      (item) => item.status === 'pending' || item.status === 'error' || item.status === 'cancelled'
    )

    if (!pendingItems.length) {
      addToast('No pending items to upload', 'info')
      setUploading(false)
      return
    }

    let savedCount = 0
    let failedCount = 0

    // Worker pool queue
    let nextIndex = 0

    const uploadWorker = async () => {
      while (nextIndex < pendingItems.length) {
        const item = pendingItems[nextIndex++]
        const controller = new AbortController()
        abortControllersRef.current[item.id] = controller

        // Mark as uploading
        setSelectedFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading', progress: 0, error: null } : f))
        )

        try {
          // 1. Cloudinary upload (skip if already uploaded)
          let cloudRes = item.cloudRes
          if (!cloudRes) {
            cloudRes = await uploadFile(item.file, {
              folder: 'alpine-explorers/gallery',
              signal: controller.signal,
              onProgress: (percent) => {
                setSelectedFiles((prev) =>
                  prev.map((f) => (f.id === item.id ? { ...f, progress: percent } : f))
                )
              },
            })
          }

          // 2. Mark as saving to database
          setSelectedFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, status: 'saving', progress: 100, cloudRes } : f))
          )

          const rowPayload = {
            title: item.title || 'Untitled',
            caption: item.caption || '',
            image_url: cloudRes.secure_url,
            thumbnail_url: cloudRes.thumbnail_url || cloudRes.secure_url,
            media_type: cloudRes.resource_type || (item.isVideo ? 'video' : 'image'),
            resource_type: cloudRes.resource_type || (item.isVideo ? 'video' : 'image'),
            duration: cloudRes.duration || item.duration || null,
            public_id: cloudRes.public_id,
            width: cloudRes.width || item.width,
            height: cloudRes.height || item.height,
            category_id: item.category_id || null,
            location: item.location || '',
            is_featured: false,
            is_published: true,
            sort_order: 0,
          }

          const savedRow = await createGalleryImage(rowPayload)
          savedCount++

          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? { ...f, status: 'done', progress: 100, error: null, saveFailed: false, result: savedRow }
                : f
            )
          )
        } catch (err) {
          if (err.message !== 'Upload cancelled' && err.message !== 'Upload cancelled by user') {
            failedCount++
            console.error(`[UploadDropzone] Process failed for ${item.file?.name}:`, err)
            // If error was in DB save (cloudRes is set), mark saveFailed: true so user can retry save only
            const hasCloudRes = Boolean(item.cloudRes || err.cloudRes)
            setSelectedFiles((prev) =>
              prev.map((f) =>
                f.id === item.id
                  ? {
                      ...f,
                      status: 'error',
                      saveFailed: hasCloudRes,
                      error: err.message || 'Operation failed',
                    }
                  : f
              )
            )
          }
        } finally {
          delete abortControllersRef.current[item.id]
        }
      }
    }

    // Launch workers up to CONCURRENCY_LIMIT (3)
    const workerPromises = Array.from(
      { length: Math.min(CONCURRENCY_LIMIT, pendingItems.length) },
      () => uploadWorker()
    )
    await Promise.all(workerPromises)

    setUploading(false)

    if (savedCount > 0) {
      addToast(
        `Successfully published ${savedCount} item${savedCount > 1 ? 's' : ''} to the gallery!`,
        'success'
      )
      onUploadSuccess()
    }

    if (failedCount > 0) {
      addToast(`${failedCount} item(s) encountered an issue. Check the list below to retry.`, 'error')
    }
  }

  const isAllUploaded =
    selectedFiles.length > 0 && selectedFiles.every((f) => f.status === 'done')

  return (
    <div className="space-y-6">
      {/* Drag & drop upload area with Mobile Camera Roll Support */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[var(--ae-gold)] bg-amber-50/50 scale-[1.01]'
            : 'border-[rgba(180,160,130,0.4)] hover:border-[var(--ae-navy)] bg-white/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
          disabled={uploading}
        />

        <div
          className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) / 0.15)', color: NAVY }}
        >
          <Upload size={24} />
        </div>

        <h4
          className="font-bold text-base sm:text-lg text-stone-900 mb-1"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Drag & Drop Photos & Videos Here
        </h4>
        <p className="text-xs text-stone-500 max-w-md mx-auto mb-3">
          Or tap to select from your Camera Roll or computer. Images (JPG, PNG, WebP up to 15MB) & Videos (MP4, MOV, WebM up to 100MB). Max {MAX_FILES} at once.
        </p>
        <span
          className="inline-block text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full text-[var(--ae-navy)]"
          style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) / 0.2)' }}
        >
          Parallel Concurrency: 3 Files
        </span>
      </div>

      {/* Bulk Apply Bar */}
      {selectedFiles.length > 1 && !isAllUploaded && (
        <div
          className="p-3.5 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-50"
          style={{ borderColor: 'rgba(180,160,130,0.3)' }}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800" style={{ fontFamily: 'Cinzel, serif' }}>
            <Sparkles size={14} style={{ color: GOLD }} />
            <span>Apply to All ({selectedFiles.length} items):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bulk Category */}
            <div className="flex items-center gap-1.5">
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="text-xs rounded-lg px-2.5 py-1.5 border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[var(--ae-gold)]"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={applyCategoryToAll}
                disabled={!bulkCategory}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-stone-800 text-white disabled:opacity-40 transition"
              >
                Apply
              </button>
            </div>

            {/* Bulk Location */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={bulkLocation}
                onChange={(e) => setBulkLocation(e.target.value)}
                placeholder="e.g. Spiti Valley"
                className="text-xs rounded-lg px-2.5 py-1.5 border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[var(--ae-gold)] w-32"
              />
              <button
                type="button"
                onClick={applyLocationToAll}
                disabled={!bulkLocation.trim()}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-stone-800 text-white disabled:opacity-40 transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Items Review Panel */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700" style={{ fontFamily: 'Cinzel, serif' }}>
              Files to Upload ({selectedFiles.length})
            </span>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
              className="text-xs text-stone-500 hover:text-red-600 disabled:opacity-40 font-semibold"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between shadow-xs"
              >
                {/* Media Thumbnail Preview */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-stone-100 flex items-center justify-center">
                  {item.isVideo ? (
                    <>
                      <video src={item.preview} className="w-full h-full object-cover" preload="metadata" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={18} className="fill-white text-white" />
                      </div>
                    </>
                  ) : (
                    <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                  )}

                  {/* Format tag */}
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[8px] font-bold bg-black/70 text-white uppercase">
                    {item.isVideo ? 'Video' : 'Photo'}
                  </span>
                </div>

                {/* Metadata Fields */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <div>
                    <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      disabled={uploading}
                      onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                      placeholder="Title"
                      className="w-full text-xs px-2.5 py-1 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[var(--ae-gold)]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Location</label>
                    <input
                      type="text"
                      value={item.location}
                      disabled={uploading}
                      onChange={(e) => handleUpdateItem(item.id, 'location', e.target.value)}
                      placeholder="e.g. Kedarkantha · Uttarakhand"
                      className="w-full text-xs px-2.5 py-1 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[var(--ae-gold)]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Category</label>
                      <select
                        value={item.category_id}
                        disabled={uploading}
                        onChange={(e) => handleUpdateItem(item.id, 'category_id', e.target.value)}
                        className="w-full text-xs px-2.5 py-1 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[var(--ae-gold)] bg-white"
                      >
                        <option value="">No Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Caption (Optional)</label>
                      <input
                        type="text"
                        value={item.caption}
                        disabled={uploading}
                        onChange={(e) => handleUpdateItem(item.id, 'caption', e.target.value)}
                        placeholder="Story or note about this moment..."
                        className="w-full text-xs px-2.5 py-1 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[var(--ae-gold)]"
                      />
                    </div>
                  </div>

                  {/* Real XHR Progress Bar */}
                  {item.status === 'uploading' && (
                    <div className="sm:col-span-2 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-600 mb-1">
                        <span>Uploading to Cloudinary...</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-150"
                          style={{
                            width: `${item.progress}%`,
                            backgroundColor: GOLD,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Saving to Database Status */}
                  {item.status === 'saving' && (
                    <div className="sm:col-span-2 pt-1 flex items-center gap-2 text-[11px] font-bold text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Saving to gallery database...
                    </div>
                  )}

                  {/* Error Message */}
                  {item.status === 'error' && (
                    <p className="sm:col-span-2 text-[10px] text-red-600 flex items-center gap-1 font-semibold">
                      <AlertCircle size={11} /> {item.error || 'Upload failed'}
                    </p>
                  )}
                </div>

                {/* Status Indicator & Cancel / Retry / Remove Buttons */}
                <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
                  {item.status === 'done' && (
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs" title="Uploaded & Saved">
                      <Check size={16} />
                    </span>
                  )}

                  {item.status === 'uploading' && (
                    <button
                      type="button"
                      onClick={() => handleCancelItem(item.id)}
                      className="px-2 py-1 rounded text-[11px] font-bold text-red-600 hover:bg-red-50 border border-red-200 transition"
                      title="Cancel this file"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Dedicated Retry Save button (if Cloudinary upload already succeeded) */}
                  {item.saveFailed && item.cloudRes && !uploading && (
                    <button
                      type="button"
                      onClick={() => handleRetrySave(item)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition"
                      title="Retry saving to database without re-uploading to Cloudinary"
                    >
                      <RotateCcw size={12} /> Retry Save
                    </button>
                  )}

                  {/* Regular Retry Upload button (if Cloudinary upload failed) */}
                  {!item.saveFailed && (item.status === 'error' || item.status === 'cancelled') && !uploading && (
                    <button
                      type="button"
                      onClick={() => handleUpdateItem(item.id, 'status', 'pending')}
                      className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition"
                      title="Retry upload"
                    >
                      <RotateCcw size={15} />
                    </button>
                  )}

                  {item.status !== 'uploading' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 transition"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <span className="text-xs text-stone-500">
              {selectedFiles.filter((f) => f.status === 'done').length} of {selectedFiles.length} uploaded
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 border border-stone-300 transition"
                >
                  Close
                </button>
              )}

              <Btn
                onClick={handleStartUpload}
                disabled={uploading || isAllUploaded}
                className="flex-1 sm:flex-initial"
              >
                {uploading ? (
                  <>Uploading ({CONCURRENCY_LIMIT} in parallel)...</>
                ) : isAllUploaded ? (
                  <>All Uploaded!</>
                ) : (
                  <>Upload {selectedFiles.length} Item{selectedFiles.length > 1 ? 's' : ''}</>
                )}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
