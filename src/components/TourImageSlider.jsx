import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DEFAULT_INTERVAL = 3500

export default function TourImageSlider({
  images = [],
  alt = '',
  paused = false,
  interval = DEFAULT_INTERVAL,
}) {
  const validImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : []

  const count = validImages.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [failedImages, setFailedImages] = useState({})

  // Auto-advance only when not hovered and multiple images exist
  useEffect(() => {
    if (count <= 1 || paused || isHovered) return undefined
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count)
    }, interval)
    return () => clearInterval(timer)
  }, [count, paused, isHovered, interval])

  const handlePrev = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  const handleNext = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % count)
  }, [count])

  const handleDotClick = useCallback((e, index) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(index)
  }, [])

  const handleImageError = useCallback((index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }))
  }, [])

  if (count === 0) {
    return (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
        No Image Available
      </div>
    )
  }

  // If only 1 image, render clean single image without slider controls
  if (count === 1) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={validImages[0]}
          alt={alt}
          className="w-full h-full object-cover block"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {validImages.map((src, i) => {
          const isCurrent = i === currentIndex
          return (
            <div
              key={`${src}-${i}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                isCurrent ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={failedImages[i] ? validImages[0] : src}
                alt={isCurrent ? alt : ''}
                className="w-full h-full object-cover block"
                draggable={false}
                onError={() => handleImageError(i)}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          )
        })}
      </div>

      {/* Prev / Next Navigation Arrows (visible on hover or always subtly visible on touch) */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Image"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Image"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
        {validImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => handleDotClick(e, i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all rounded-full cursor-pointer ${
              i === currentIndex
                ? 'w-3.5 h-1.5 bg-white shadow-sm'
                : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}