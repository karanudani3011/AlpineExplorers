import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MapPin,
  Tag,
  Calendar,
  Download,
  Video as VideoIcon,
} from 'lucide-react'
import { cloudinaryUrl, getVideoPosterUrl, formatDuration } from '../../utils/cloudinary'

const GOLD = 'var(--ae-gold)'
const NAVY = 'var(--ae-navy)'

export default function Lightbox({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onNavigate,
}) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const videoRef = useRef(null)

  const currentItem = images[currentIndex] || null

  const isVideo = Boolean(
    currentItem?.media_type === 'video' ||
    currentItem?.resource_type === 'video' ||
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(currentItem?.image_url || '')
  )

  // Pause video and reset zoom when navigating away
  useEffect(() => {
    setIsZoomed(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [currentIndex])

  // Pause video on close
  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    onClose()
  }, [onClose])

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  // Preload neighboring images for smooth transitions
  useEffect(() => {
    if (!isOpen || images.length <= 1) return
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    const nextIndex = (currentIndex + 1) % images.length

    const neighbors = [images[prevIndex], images[nextIndex]]
    neighbors.forEach((item) => {
      if (item && item.image_url && item.media_type !== 'video' && item.resource_type !== 'video') {
        const img = new Image()
        img.src = cloudinaryUrl(item.image_url, { w: 1600, q: 'auto', f: 'auto' })
      }
    })
  }, [currentIndex, images, isOpen])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        handleClose()
      } else if (e.key === 'ArrowRight') {
        if (videoRef.current) videoRef.current.pause()
        onNavigate((currentIndex + 1) % images.length)
      } else if (e.key === 'ArrowLeft') {
        if (videoRef.current) videoRef.current.pause()
        onNavigate((currentIndex - 1 + images.length) % images.length)
      }
    },
    [isOpen, currentIndex, images.length, handleClose, onNavigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Mobile swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
  }

  const handleTouchMove = (e) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const dx = touchStart.x - touchEnd.x
    const dy = touchStart.y - touchEnd.y

    // Ensure horizontal swipe is dominant and above 50px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (videoRef.current) videoRef.current.pause()
      if (dx > 0) {
        onNavigate((currentIndex + 1) % images.length)
      } else {
        onNavigate((currentIndex - 1 + images.length) % images.length)
      }
    }
  }

  if (!isOpen || !currentItem) return null

  const highResSrc = isVideo
    ? currentItem.image_url
    : cloudinaryUrl(currentItem.image_url, { w: 1600, q: 'auto', f: 'auto' })

  const posterSrc = isVideo
    ? currentItem.thumbnail_url || getVideoPosterUrl(currentItem.image_url, { w: 1280 })
    : undefined

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl text-white select-none overflow-hidden"
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          paddingLeft: 'max(16px, env(safe-area-inset-left))',
          paddingRight: 'max(16px, env(safe-area-inset-right))',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label="Media Lightbox"
      >
        {/* Top Bar: Counter, Title, Zoom & Close */}
        <div className="relative z-20 flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="text-xs sm:text-sm font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10"
              style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}
            >
              {currentIndex + 1} / {images.length}
            </span>

            {currentItem.category?.name && (
              <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-white/70 font-medium">
                {currentItem.category.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {!isVideo && (
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-full hover:bg-white/15 transition text-white/80 hover:text-white"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/15 transition text-white/90 hover:text-white focus:outline-none"
              title="Close (Esc)"
              aria-label="Close Lightbox"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Central Display Area: Responsive Image or Video */}
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-0">
          {/* Previous Arrow Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) videoRef.current.pause()
                onNavigate((currentIndex - 1 + images.length) % images.length)
              }}
              className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 transition-all hover:scale-105 focus:outline-none shadow-lg"
              title="Previous (Left arrow)"
              aria-label="Previous Media"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Media Player / Image Container */}
          <div className="relative max-w-full max-h-[80svh] flex items-center justify-center">
            {isVideo ? (
              <video
                key={currentItem.id || currentItem.image_url}
                ref={videoRef}
                src={highResSrc}
                poster={posterSrc}
                controls
                playsInline
                preload="metadata"
                className="max-w-full max-h-[80svh] w-auto h-auto object-contain rounded-xl shadow-2xl mx-auto focus:outline-none"
                style={{
                  maxHeight: 'min(80svh, 800px)',
                }}
              >
                Your browser does not support HTML5 video playback.
              </video>
            ) : (
              <motion.img
                key={currentItem.id || currentItem.image_url}
                initial={{ opacity: 0.4, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: isZoomed ? 1.5 : 1,
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                transition={{ duration: 0.25 }}
                src={highResSrc}
                alt={currentItem.caption || currentItem.title}
                onClick={() => setIsZoomed(!isZoomed)}
                className="max-w-full max-h-[80svh] w-auto h-auto object-contain rounded-xl shadow-2xl transition-transform duration-300"
                style={{
                  maxHeight: 'min(80svh, 860px)',
                }}
              />
            )}
          </div>

          {/* Next Arrow Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) videoRef.current.pause()
                onNavigate((currentIndex + 1) % images.length)
              }}
              className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 transition-all hover:scale-105 focus:outline-none shadow-lg"
              title="Next (Right arrow)"
              aria-label="Next Media"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Bottom Metadata Panel */}
        <div className="relative z-20 border-t border-white/10 px-4 sm:px-6 py-3 bg-black/70 backdrop-blur-md shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3
                  className="text-base sm:text-lg font-bold text-white truncate"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {currentItem.title}
                </h3>
                {isVideo && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-600/80 text-white flex items-center gap-1">
                    <VideoIcon size={10} /> Video {currentItem.duration ? `· ${formatDuration(currentItem.duration)}` : ''}
                  </span>
                )}
                {currentItem.is_featured && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-stone-900"
                    style={{ backgroundColor: GOLD, fontFamily: 'Cinzel, serif' }}
                  >
                    Featured
                  </span>
                )}
              </div>

              {currentItem.caption && (
                <p className="text-white/80 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {currentItem.caption}
                </p>
              )}
            </div>

            {currentItem.location && (
              <div className="flex items-center gap-1.5 text-xs text-white/80 shrink-0">
                <MapPin size={13} style={{ color: GOLD }} />
                <span>{currentItem.location}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
