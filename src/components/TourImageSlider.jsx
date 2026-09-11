import { useCallback, useEffect, useState } from 'react'

const DEFAULT_INTERVAL = 1000
const TRANSITION_MS = 600
const TRANSITION = `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`

export default function TourImageSlider({
  images = [],
  alt = '',
  paused = false,
  interval = DEFAULT_INTERVAL,
}) {
  const realCount = images.length
  const slides = realCount > 1 ? [...images, images[0]] : images
  const total = slides.length

  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(true)
  const [failed, setFailed] = useState([])
  const [hovered, setHovered] = useState(false)

  const active = index % realCount

  useEffect(() => {
    if (paused || hovered || total < 2) return undefined
    const id = setInterval(() => {
      setAnimating(true)
      setIndex((i) => i + 1)
    }, interval)
    return () => clearInterval(id)
  }, [paused, hovered, interval, total])

  useEffect(() => {
    if (index !== total - 1) return undefined
    const t = setTimeout(() => {
      setAnimating(false)
      setIndex(0)
    }, TRANSITION_MS + 20)
    return () => clearTimeout(t)
  }, [index, total])

  useEffect(() => {
    if (animating) return undefined
    let raf
    const restore = () => {
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setAnimating(true))
      })
    }
    restore()
    return () => cancelAnimationFrame(raf)
  }, [animating])

  const handleError = useCallback((position) => {
    setFailed((prev) => (prev.includes(position) ? prev : [...prev, position]))
  }, [])

  const srcFor = (position) => {
    if (!failed.includes(position)) return slides[position]
    const fallback = slides.find((src, i) => i !== position && !failed.includes(i))
    return fallback ?? slides[position]
  }

  if (realCount < 1) return null

  const translateX = (100 * index) / total
  const slideWidth = 100 / total

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      <div
        className="flex h-full"
        style={{
          width: `${total * 100}%`,
          transform: `translate3d(${-translateX}%, 0, 0)`,
          transition: animating ? TRANSITION : 'none',
          willChange: 'transform',
        }}
      >
        {slides.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="h-full bg-gray-200"
            style={{ flex: `0 0 ${slideWidth}%`, width: `${slideWidth}%` }}
            aria-hidden={i === active ? undefined : true}
          >
            <img
              src={srcFor(i)}
              alt={i === active ? alt : ''}
              className="w-full h-full object-cover block"
              draggable={false}
              onError={() => handleError(i)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}