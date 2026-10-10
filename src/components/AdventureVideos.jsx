import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize, Play, X } from 'lucide-react'
import './adventure-videos.css'

const adventures = [
  {
    title: 'Chase Waterfalls',
    src: '/videos/waterfall-adventure.mp4',
    description: 'Discover the beauty of unforgettable nature escapes.',
    orientation: 'portrait',
  },
  {
    title: 'Ride Beyond Limits',
    src: '/videos/bike-adventure.mp4',
    description: 'Feel the freedom of the open road.',
  },
  {
    title: 'See The World Differently',
    src: '/videos/helicopter-adventure.mp4',
    description: 'Experience extraordinary views from above.',
  },
]

export default function AdventureVideos() {
  const [selected, setSelected] = useState(null)
  const [loadedPreviews, setLoadedPreviews] = useState(() => new Set())
  const [failedPreviews, setFailedPreviews] = useState(() => new Set())
  const [playbackFailed, setPlaybackFailed] = useState(false)
  const [videoRatio, setVideoRatio] = useState(null)
  const dialogRef = useRef(null)
  const playerRef = useRef(null)
  const layoutRef = useRef(null)
  const lastTriggerRef = useRef(null)
  const warnedFilesRef = useRef(new Set())

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !selected) return
    setPlaybackFailed(false)
    setVideoRatio(selected.orientation === 'portrait' ? 9 / 16 : null)
    dialog.showModal()
    playerRef.current?.play().catch(() => {})
  }, [selected])

  useEffect(() => {
    if (!selected) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selected])

  useEffect(() => {
    const layout = layoutRef.current
    if (!layout || !('IntersectionObserver' in window)) {
      setLoadedPreviews(new Set(adventures.map(({ src }) => src)))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      const visibleSources = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target.dataset.videoSrc)
      if (visibleSources.length) {
        setLoadedPreviews((previous) => new Set([...previous, ...visibleSources]))
        entries.filter((entry) => entry.isIntersecting).forEach((entry) => observer.unobserve(entry.target))
      }
    }, { rootMargin: '180px 0px' })

    layout.querySelectorAll('[data-video-src]').forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const closePlayer = useCallback(() => {
    playerRef.current?.pause()
    if (playerRef.current) playerRef.current.currentTime = 0
    if (dialogRef.current?.open) dialogRef.current.close()
    setSelected(null)
    setPlaybackFailed(false)
  }, [])

  const handleDialogClose = () => {
    playerRef.current?.pause()
    if (playerRef.current) playerRef.current.currentTime = 0
    setSelected(null)
    setPlaybackFailed(false)
    lastTriggerRef.current?.focus()
  }

  const warnMissingVideo = (video) => {
    if (warnedFilesRef.current.has(video.src)) return
    warnedFilesRef.current.add(video.src)
    console.warn(`[Alpine Explorers] Adventure video could not be loaded. Add the original file at public${video.src}.`)
  }

  const handlePreviewError = (video) => {
    warnMissingVideo(video)
    setFailedPreviews((previous) => new Set(previous).add(video.src))
  }

  const setPlayerAspectRatio = (event) => {
    const { videoWidth, videoHeight } = event.currentTarget
    if (videoWidth && videoHeight) setVideoRatio(videoWidth / videoHeight)
  }

  const enterFullscreen = () => {
    const viewer = dialogRef.current?.querySelector('.adventure-video-viewer')
    if (viewer?.requestFullscreen) viewer.requestFullscreen().catch(() => {})
  }

  return (
    <>
      <section className="adventure-videos-section" aria-labelledby="adventure-videos-title">
        <div className="adventure-videos-inner">
          <motion.header
            className="adventure-videos-heading"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
          >
            <span className="adventure-videos-eyebrow">REAL ADVENTURES</span>
            <h2 id="adventure-videos-title">Life Is Better Out There</h2>
            <p>Real moments. Extraordinary journeys. Memories that last forever.</p>
          </motion.header>

          <div className="adventure-videos-layout" ref={layoutRef}>
            {adventures.map((video, index) => (
              <motion.article
                key={video.src}
                className={`adventure-video-item adventure-video-item-${index + 1}`}
                data-video-src={video.src}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: index * 0.12 }}
              >
                <button
                  type="button"
                  className="adventure-video-trigger"
                  aria-label={`Play ${video.title}: ${video.description}`}
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget
                    setSelected(video)
                  }}
                >
                  <span className="adventure-video-media">
                    {!failedPreviews.has(video.src) ? (
                      <video
                        src={loadedPreviews.has(video.src) ? video.src : undefined}
                        muted
                        playsInline
                        preload="metadata"
                        tabIndex={-1}
                        aria-hidden="true"
                        onError={() => handlePreviewError(video)}
                      />
                    ) : (
                      <span className="adventure-video-fallback" aria-hidden="true" />
                    )}
                    <span className="adventure-video-shade" aria-hidden="true" />
                    <span className="adventure-video-play" aria-hidden="true"><Play size={22} fill="currentColor" /></span>
                    <span className="adventure-video-caption">
                      <span className="adventure-video-number">0{index + 1} / 03</span>
                      <span className="adventure-video-title">{video.title}</span>
                      <span className="adventure-video-description">{video.description}</span>
                    </span>
                  </span>
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <dialog
        className="adventure-video-dialog"
        ref={dialogRef}
        aria-label={selected ? `Video player: ${selected.title}` : 'Adventure video player'}
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === dialogRef.current) closePlayer()
        }}
      >
        {selected && (
          <div className="adventure-video-dialog-content">
            <div
              className="adventure-video-viewer"
              style={videoRatio ? { '--adventure-video-ratio': videoRatio } : undefined}
              data-orientation={videoRatio && videoRatio < 1 ? 'portrait' : 'landscape'}
            >
              <video
                ref={playerRef}
                key={selected.src}
                src={selected.src}
                controls
                playsInline
                preload="metadata"
                autoPlay
                aria-label={selected.title}
                onLoadedMetadata={setPlayerAspectRatio}
                onError={() => {
                  warnMissingVideo(selected)
                  setPlaybackFailed(true)
                }}
              />
              <button type="button" className="adventure-video-close" onClick={closePlayer} aria-label="Close video">
                <X size={23} />
              </button>
              <button type="button" className="adventure-video-fullscreen" onClick={enterFullscreen} aria-label="Enter fullscreen">
                <Maximize size={19} />
              </button>
              {playbackFailed && (
                <p className="adventure-video-error" role="alert">
                  This video could not be loaded. Add the original file at <code>public{selected.src}</code> and try again.
                </p>
              )}
            </div>
            <div className="adventure-video-dialog-title">
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
