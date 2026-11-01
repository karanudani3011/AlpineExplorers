import { useState } from 'react'
import { X, Save, Star, Eye, EyeOff, MapPin, Tag, Video as VideoIcon, Play, RefreshCw } from 'lucide-react'
import { updateGalleryImage } from '../../../services/galleryService'
import { cloudinaryUrl, getVideoPosterUrl, formatDuration } from '../../../utils/cloudinary'
import { Btn, NAVY, GOLD } from '../admin-ui'

export default function EditImageModal({
  image,
  categories = [],
  onClose,
  onSaveSuccess,
  addToast,
}) {
  const [title, setTitle] = useState(image?.title || '')
  const [caption, setCaption] = useState(image?.caption || '')
  const [location, setLocation] = useState(image?.location || '')
  const [categoryId, setCategoryId] = useState(image?.category_id || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(image?.thumbnail_url || '')
  const [isFeatured, setIsFeatured] = useState(Boolean(image?.is_featured))
  const [isPublished, setIsPublished] = useState(image?.is_published !== false)
  const [sortOrder, setSortOrder] = useState(image?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)

  if (!image) return null

  const isVideo =
    image.media_type === 'video' ||
    image.resource_type === 'video' ||
    /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(image.image_url)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updated = await updateGalleryImage(image.id, {
        title: title.trim(),
        caption: caption.trim(),
        location: location.trim(),
        category_id: categoryId || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        is_featured: isFeatured,
        is_published: isPublished,
        sort_order: Number(sortOrder) || 0,
      })

      addToast('Details updated successfully', 'success')
      onSaveSuccess(updated)
    } catch (err) {
      addToast(err.message || 'Failed to update item', 'error')
    } finally {
      setSaving(false)
    }
  }

  const previewPoster = isVideo
    ? thumbnailUrl || getVideoPosterUrl(image.image_url, { w: 600, q: 'auto', f: 'auto' })
    : cloudinaryUrl(image.image_url, { w: 600, q: 'auto', f: 'auto' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col border border-[rgba(180,160,130,0.35)] max-h-[92svh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            {isVideo ? <VideoIcon size={18} style={{ color: GOLD }} /> : null}
            <h3 className="font-bold text-base text-stone-900" style={{ fontFamily: 'Cinzel, serif', color: NAVY }}>
              {isVideo ? 'Edit Video Details' : 'Edit Photo Details'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Media Preview & Status Toggles */}
          <div className="flex flex-col sm:flex-row gap-4 items-start pb-4 border-b border-stone-200">
            {/* Thumbnail Preview Area */}
            <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100 shadow-sm relative">
              {isVideo ? (
                <video
                  src={image.image_url}
                  poster={previewPoster}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={previewPoster} alt="preview" className="w-full h-full object-cover" />
              )}
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/75 text-white">
                {isVideo && image.duration ? `${formatDuration(image.duration)} · ` : ''}
                {image.width} × {image.height}
              </div>
            </div>

            {/* Quick Visibility & Feature Toggles */}
            <div className="flex flex-col gap-3 flex-1 w-full">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 p-2 rounded-lg hover:bg-stone-50 border border-stone-100">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  {isPublished ? <Eye size={15} className="text-emerald-600" /> : <EyeOff size={15} className="text-stone-400" />}
                  <span>Published in public gallery</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 p-2 rounded-lg hover:bg-stone-50 border border-stone-100">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Star size={15} className={isFeatured ? 'fill-amber-400 text-amber-400' : 'text-stone-400'} />
                  <span>Featured in Curated Highlights</span>
                </span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Kedarkantha Sunrise Summit"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Spiti Valley · Himachal Pradesh"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
              />
            </div>
          </div>

          {/* Caption / Story */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
              Caption / Description
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Story or note about this journey moment..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
            />
          </div>

          {/* Optional Video Thumbnail URL (For replacing poster) */}
          {isVideo && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                Custom Poster Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/.../poster.jpg"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Leave empty to use Cloudinary auto-generated first-frame poster.
              </p>
            </div>
          )}

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
              Sort Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 border border-stone-300 transition"
            >
              Cancel
            </button>
            <Btn type="submit" disabled={saving} className="min-h-[44px] px-6">
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  )
}
