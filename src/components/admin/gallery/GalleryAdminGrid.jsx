import { useState } from 'react'
import {
  Star,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  MapPin,
  Tag,
  GripVertical,
  Video as VideoIcon,
  Play,
  Camera,
} from 'lucide-react'
import { cloudinaryUrl, getVideoPosterUrl, formatDuration } from '../../../utils/cloudinary'

const GOLD = 'var(--ae-gold)'
const NAVY = 'var(--ae-navy)'

export default function GalleryAdminGrid({
  images = [],
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onEdit,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
  onReorder,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleDrop = (e, targetIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return
    onReorder(draggedIndex, targetIndex)
    setDraggedIndex(null)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {images.map((item, index) => {
        const isSelected = selectedIds.includes(item.id)
        const isVideo =
          item.media_type === 'video' ||
          item.resource_type === 'video' ||
          /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(item.image_url)

        const thumb = isVideo
          ? item.thumbnail_url || getVideoPosterUrl(item.image_url, { w: 500, q: 'auto', f: 'auto' })
          : cloudinaryUrl(item.image_url, { w: 500, q: 'auto', f: 'auto' })

        return (
          <div
            key={item.id || index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`group rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col ${
              isSelected
                ? 'ring-2 ring-[var(--ae-gold)] border-[var(--ae-gold)]'
                : 'border-stone-200'
            }`}
          >
            {/* Media Thumbnail & Overlay Area */}
            <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
              <img
                src={thumb}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                loading="lazy"
              />

              {/* Video Play Overlay */}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center shadow-md">
                    <Play size={16} className="ml-0.5 fill-white" />
                  </div>
                </div>
              )}

              {/* Selection Checkbox */}
              <div className="absolute top-2.5 left-2.5 z-20">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(item.id)}
                  className="w-4 h-4 rounded text-navy focus:ring-navy border-stone-300 bg-white/90 shadow cursor-pointer"
                  aria-label={`Select ${item.title}`}
                />
              </div>

              {/* Top Right Badges: Media Type (Photo/Video) & Featured Star */}
              <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                {/* Media Type Badge (Admin-visible) */}
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs flex items-center gap-1"
                  style={{
                    backgroundColor: isVideo ? 'rgba(107, 33, 168, 0.85)' : 'rgba(30, 58, 138, 0.85)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {isVideo ? (
                    <>
                      <VideoIcon size={10} /> Video {item.duration ? `(${formatDuration(item.duration)})` : ''}
                    </>
                  ) : (
                    <>
                      <Camera size={10} /> Photo
                    </>
                  )}
                </span>

                {/* Quick Feature Star */}
                <button
                  type="button"
                  onClick={() => onToggleFeatured(item)}
                  className={`p-1.5 rounded-lg backdrop-blur-sm transition ${
                    item.is_featured
                      ? 'bg-amber-400 text-stone-900 shadow-md'
                      : 'bg-black/40 text-white/70 hover:text-white'
                  }`}
                  title={item.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                >
                  <Star
                    size={14}
                    className={item.is_featured ? 'fill-stone-900' : ''}
                  />
                </button>
              </div>

              {/* Status Badge: Published / Draft */}
              <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onTogglePublish(item)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow flex items-center gap-1 transition ${
                    item.is_published
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                  title={item.is_published ? 'Click to Unpublish' : 'Click to Publish'}
                >
                  {item.is_published ? (
                    <>
                      <Eye size={10} /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff size={10} /> Hidden
                    </>
                  )}
                </button>
              </div>

              {/* Drag Handle Indicator */}
              <div
                className="absolute bottom-2.5 right-2.5 z-20 p-1 rounded bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 transition cursor-grab"
                title="Drag to reorder"
              >
                <GripVertical size={14} />
              </div>
            </div>

            {/* Info details */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                {item.category?.name && (
                  <span
                    className="text-[10px] uppercase tracking-wider font-bold block mb-1 truncate"
                    style={{ color: '#a88941', fontFamily: 'Cinzel, serif' }}
                  >
                    {item.category.name}
                  </span>
                )}

                <h4
                  className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 mb-1"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  title={item.title}
                >
                  {item.title}
                </h4>

                {item.location && (
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 truncate mb-2">
                    <MapPin size={11} className="shrink-0 text-stone-400" />
                    <span>{item.location}</span>
                  </p>
                )}
              </div>

              {/* Footer Actions: Reorder arrows, Edit, Delete */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-100">
                {/* Up/Down mobile reorder fallback */}
                <div className="flex items-center gap-1 text-stone-400">
                  <button
                    type="button"
                    onClick={() => onReorder(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 hover:text-stone-700 disabled:opacity-20 transition"
                    title="Move earlier"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorder(index, index + 1)}
                    disabled={index === images.length - 1}
                    className="p-1 hover:text-stone-700 disabled:opacity-20 transition"
                    title="Move later"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                {/* Edit & Delete Action Buttons (always visible on mobile, hover on desktop) */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition"
                    title="Edit details"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition"
                    title="Delete permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
