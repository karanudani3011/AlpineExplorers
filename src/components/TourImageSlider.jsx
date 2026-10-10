import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DEFAULT_INTERVAL = 4500
const SWIPE_THRESHOLD = 40
const FALLBACK_IMAGE = '/images/tour-image-fallback.svg'

export default function TourImageSlider({
  images = [],
  alt = '',
  paused = false,
  interval = DEFAULT_INTERVAL,
  aspectRatio = 'aspect-[16/10]',
  priority = false,
}) {
  const validImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean).map((image) => typeof image === 'string' ? { url: image, alt } : image).filter((image) => image.url).filter((image, index, all) => {
      const photoId = image.sourcePhotoId || String(image.url).match(/images\.unsplash\.com\/(photo-[^/?]+)/)?.[1] || image.url
      return all.findIndex((candidate) => (candidate.sourcePhotoId || String(candidate.url).match(/images\.unsplash\.com\/(photo-[^/?]+)/)?.[1] || candidate.url) === photoId) === index
    })
    : []

  const count = validImages.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [failedImages, setFailedImages] = useState({})
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)
  const imageSetKey = validImages.map((image) => image.url).join('|')

  useEffect(() => {
    setCurrentIndex(0)
    setFailedImages({})
  }, [imageSetKey])

  // Clamp currentIndex if count changes
  useEffect(() => {
    if (currentIndex >= count && count > 0) {
      setCurrentIndex(0)
    }
  }, [count, currentIndex])

  // Auto-advance only when not hovered, not paused, and multiple images exist
  useEffect(() => {
    if (count <= 1 || paused || isHovered) return undefined
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count)
    }, interval)
    return () => clearInterval(timer)
  }, [count, paused, isHovered, interval])

  const handlePrev = useCallback((e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  const handleNext = useCallback((e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev + 1) % count)
  }, [count])

  const handleDotClick = useCallback((e, index) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(index)
  }, [])

  const handleImageError = useCallback((index) => {
    if (failedImages[index]) return
    if (import.meta.env.DEV) console.warn(`[TourImageSlider] Image failed for "${alt}": ${validImages[index]?.url}`)
    setFailedImages((prev) => ({ ...prev, [index]: true }))
    if (index === currentIndex) {
      for (let offset = 1; offset < count; offset += 1) {
        const candidate = (index + offset) % count
        if (!failedImages[candidate]) {
          setCurrentIndex(candidate)
          break
        }
      }
    }
  }, [alt, count, currentIndex, failedImages, validImages])

  // Touch swipe handling for mobile
  const handleTouchStart = (e) => {
    setIsHovered(true)
    touchStartXRef.current = e.touches[0].clientX
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsHovered(false)
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const deltaX = touchStartXRef.current - touchEndXRef.current
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) {
          // Swiped left -> next image
          handleNext()
        } else {
          // Swiped right -> previous image
          handlePrev()
        }
      }
    }
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  if (count === 0 || validImages.every((_, index) => failedImages[index])) {
    return (
      <div className={`relative w-full h-full min-h-[160px] overflow-hidden bg-slate-100 ${aspectRatio}`}>
        <img src={FALLBACK_IMAGE} alt={`${alt || 'Destination'} landscape illustration`} className="h-full w-full object-cover" loading={priority ? 'eager' : 'lazy'} />
      </div>
    )
  }

  // Single image view
  if (count === 1) {
    const photo = validImages[0]
    return (
      <div className={`relative w-full h-full overflow-hidden bg-slate-900 ${aspectRatio}`}>
        <img
          src={failedImages[0] ? undefined : photo.url}
          alt={photo.alt || alt}
          className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => handleImageError(0)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        {photo.artist && photo.pageUrl && (
          <a href={photo.pageUrl} target="_blank" rel="noopener noreferrer" title={`${photo.license || ''} — ${photo.pageUrl}`} onClick={(event) => event.stopPropagation()} className="absolute bottom-2 right-2 z-20 max-w-[55%] truncate rounded bg-black/65 px-1.5 py-1 text-[9px] text-white/90 hover:text-white">
            Photo: {photo.artist} · {photo.license || photo.source}
          </a>
        )}
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-label={`${alt || 'Destination'} photo gallery carousel`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-full overflow-hidden select-none group/slider bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${aspectRatio}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {validImages.map((src, i) => {
          const isCurrent = i === currentIndex
          const hasFailed = failedImages[i]
          const photo = src
          const displaySrc = hasFailed ? undefined : photo.url

          return (
            <div
              key={`${src}-${i}`}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                isCurrent ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={displaySrc}
                alt={isCurrent ? (photo.alt || `${alt} - photo ${i + 1} of ${count}`) : ''}
                className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
                draggable={false}
                onError={() => handleImageError(i)}
                loading={i === 0 && priority ? 'eager' : 'lazy'}
                decoding="async"
              />
              {isCurrent && photo.artist && photo.pageUrl && (
                <a href={photo.pageUrl} target="_blank" rel="noopener noreferrer" title={`${photo.license || ''} — ${photo.pageUrl}`} onClick={(event) => event.stopPropagation()} className="absolute bottom-10 right-2 z-20 max-w-[65%] truncate rounded bg-black/65 px-1.5 py-1 text-[9px] text-white/90 hover:text-white">
                  Photo: {photo.artist} · {photo.license || photo.source}
                </a>
              )}
            </div>
          )
        })}
      </div>

      {/* Prev Navigation Arrow */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-95 cursor-pointer focus:opacity-100"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Next Navigation Arrow */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-95 cursor-pointer focus:opacity-100"
      >
        <ChevronRight size={16} />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md shadow-sm">
        {validImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => handleDotClick(e, i)}
            aria-label={`Go to slide ${i + 1} of ${count}`}
            className={`transition-all rounded-full cursor-pointer focus:outline-none ${
              i === currentIndex
                ? 'w-4 h-1.5 bg-amber-400 shadow-sm'
                : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
