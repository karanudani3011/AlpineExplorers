import { useState, useRef } from 'react'
import { MapPin, Maximize2, Play, Video as VideoIcon } from 'lucide-react'
import {
  cloudinaryUrl,
  getVideoPosterUrl,
  formatDuration,
  getCloudinarySrcSet,
  GALLERY_SIZES,
} from '../../utils/cloudinary'

const GOLD = 'var(--ae-gold)'
const NAVY = 'var(--ae-navy)'

export default function GalleryCard({ image, onClick, index = 0 }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const videoPreviewRef = useRef(null)

  const {
    title = 'Alpine Journey',
    caption = '',
    image_url,
    thumbnail_url,
    media_type,
    resource_type,
    duration,
    location,
    width = 1200,
    height = 800,
    category,
    is_featured,
  } = image

  const isVideo =
    media_type === 'video' ||
    resource_type === 'video' ||
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(image_url)

  // Natural aspect ratio to reserve layout space and eliminate CLS
  const aspectRatio = width && height ? `${width} / ${height}` : isVideo ? '16 / 9' : '4 / 3'

  // Poster thumbnail for video or image thumbnail
  const posterSrc = isVideo
    ? thumbnail_url || getVideoPosterUrl(image_url, { w: 600, q: 'auto', f: 'auto' })
    : cloudinaryUrl(image_url, { w: 600, q: 'auto', f: 'auto' })

  const srcSet = !isVideo ? getCloudinarySrcSet(image_url, [400, 600, 900]) : undefined

  // Desktop hover: play muted preview if available
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (isVideo && videoPreviewRef.current) {
      videoPreviewRef.current.play().catch(() => {
        // Autoplay may be restricted by browser policy; silent catch
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (isVideo && videoPreviewRef.current) {
      videoPreviewRef.current.pause()
      videoPreviewRef.current.currentTime = 0
    }
  }

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => onClick(image, index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(image, index)
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`View ${isVideo ? 'video' : 'photo'}: ${title}${location ? ` in ${location}` : ''}`}
      className="group relative break-inside-avoid mb-4 sm:mb-6 rounded-2xl overflow-hidden cursor-pointer bg-white/70 border border-[rgba(180,160,130,0.3)] shadow-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
      style={{
        aspectRatio,
        contentVisibility: 'auto',
      }}
    >
      {/* Shimmer skeleton until poster loads */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-stone-200 animate-pulse z-10"
          style={{
            background:
              'linear-gradient(110deg, #ede7db 8%, #f8f4ec 18%, #ede7db 33%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Main Poster Thumbnail */}
      <img
        src={posterSrc}
        srcSet={srcSet}
        sizes={GALLERY_SIZES}
        alt={caption || title}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Optional Muted Video Hover Preview on Desktop */}
      {isVideo && (
        <video
          ref={videoPreviewRef}
          src={cloudinaryUrl(image_url, { w: 640 })}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      )}

      {/* Center Play Icon Overlay for Videos */}
      {isVideo && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-colors duration-300"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              border: `2px solid ${GOLD}`,
            }}
          >
            <Play size={22} className="ml-0.5 fill-white" />
          </div>
        </div>
      )}

      {/* Featured Badge */}
      {is_featured && (
        <span
          className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--ae-navy)] shadow-md"
          style={{
            backgroundColor: GOLD,
            fontFamily: 'Cinzel, serif',
          }}
        >
          Featured
        </span>
      )}

      {/* Video Duration Badge */}
      {isVideo && duration > 0 && (
        <span
          className="absolute bottom-3 right-3 z-30 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md flex items-center gap-1"
          style={{
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <VideoIcon size={10} style={{ color: GOLD }} />
          <span>{formatDuration(duration)}</span>
        </span>
      )}

      {/* Expand Icon indicator on hover */}
      {!isVideo && (
        <div
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        >
          <Maximize2 size={13} />
        </div>
      )}

      {/* Desktop Hover & Mobile Touch Gradient Overlay */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end p-4 transition-all duration-300 pointer-events-none bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
      >
        {category?.name && (
          <span
            className="text-[10px] uppercase tracking-wider font-bold mb-1 flex items-center gap-1"
            style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}
          >
            {category.name}
          </span>
        )}

        <h3
          className="text-white text-sm sm:text-base font-bold line-clamp-1 mb-0.5"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {title}
        </h3>

        {caption && (
          <p className="text-white/80 text-xs line-clamp-2 leading-relaxed mb-1 hidden sm:block">
            {caption}
          </p>
        )}

        {location && (
          <span className="text-white/75 text-[11px] flex items-center gap-1 mt-0.5 truncate">
            <MapPin size={11} style={{ color: GOLD }} />
            <span>{location}</span>
          </span>
        )}
      </div>
    </div>
  )
}
