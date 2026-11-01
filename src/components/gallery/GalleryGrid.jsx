import { useEffect, useRef } from 'react'
import { Camera, RefreshCw, ChevronDown, Sparkles, Video } from 'lucide-react'
import GalleryCard from './GalleryCard'
import GallerySkeleton from './GallerySkeleton'

const GOLD = 'var(--ae-gold)'
const NAVY = 'var(--ae-navy)'

export default function GalleryGrid({
  images = [],
  loading = false,
  loadingMore = false,
  error = null,
  hasMore = false,
  onLoadMore,
  onImageClick,
  onResetFilters,
  isFiltered = false,
}) {
  const loadMoreObserverRef = useRef(null)

  // Infinite scroll trigger via IntersectionObserver
  useEffect(() => {
    if (!hasMore || loadingMore || !loadMoreObserverRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          onLoadMore()
        }
      },
      { rootMargin: '400px' }
    )

    observer.observe(loadMoreObserverRef.current)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, onLoadMore])

  // Initial Loading state
  if (loading && images.length === 0) {
    return <GallerySkeleton count={12} />
  }

  // Error state
  if (error && images.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-3xl bg-white/60 border border-[rgba(180,160,130,0.3)] my-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <RefreshCw size={28} />
        </div>
        <h3
          className="text-xl sm:text-2xl font-bold text-stone-900 mb-2"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Unable to Load Gallery
        </h3>
        <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
          We encountered an issue fetching the gallery moments. Please check your connection and try refreshing.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-[var(--ae-navy)] shadow-md hover:shadow-lg transition duration-200"
          style={{ backgroundColor: GOLD, fontFamily: 'Cinzel, serif' }}
        >
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    )
  }

  // Empty state
  if (!loading && images.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-3xl bg-white/60 border border-[rgba(180,160,130,0.3)] my-8">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) / 0.15)', color: NAVY }}
        >
          <Camera size={28} />
        </div>
        <h3
          className="text-xl sm:text-2xl font-bold mb-2"
          style={{ fontFamily: 'Cinzel, serif', color: NAVY }}
        >
          {isFiltered ? 'No Matches Found' : 'Gallery is coming soon'}
        </h3>
        <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
          {isFiltered
            ? 'No photos or videos matched your selected category, type, or search term.'
            : 'Photos and videos will appear here.'}
        </p>
        {isFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition duration-200"
            style={{ backgroundColor: NAVY, fontFamily: 'Cinzel, serif' }}
          >
            <Sparkles size={14} style={{ color: GOLD }} /> View All Moments
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Masonry Layout via CSS columns: 1 (<480), 2 (480-1024), 3 (1024-1440), 4 (>1440) */}
      <div className="columns-1 min-[480px]:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
        {images.map((image, index) => (
          <GalleryCard
            key={image.id || `${image.title}-${index}`}
            image={image}
            index={index}
            onClick={onImageClick}
          />
        ))}
      </div>

      {/* Skeletons while loading more */}
      {loadingMore && (
        <div className="mt-6">
          <GallerySkeleton count={4} />
        </div>
      )}

      {/* Load More Trigger Button & IntersectionObserver sentinel */}
      {hasMore && (
        <div className="mt-12 text-center flex flex-col items-center">
          <div ref={loadMoreObserverRef} className="h-4 w-full" aria-hidden="true" />

          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--ae-navy)] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            style={{
              backgroundColor: GOLD,
              fontFamily: 'Cinzel, serif',
            }}
          >
            {loadingMore ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Loading More Moments...
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Load More Moments
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
