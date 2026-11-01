import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, Sparkles, MapPin, Play } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CategoryFilter from '../components/gallery/CategoryFilter'
import GalleryGrid from '../components/gallery/GalleryGrid'
import Lightbox from '../components/gallery/Lightbox'
import {
  getCategoriesWithCounts,
  getPublishedImages,
  getFeaturedImages,
} from '../services/galleryService'
import { cloudinaryUrl, getVideoPosterUrl } from '../utils/cloudinary'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'

export default function Gallery() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [mediaType, setMediaType] = useState('all') // 'all' | 'photos' | 'videos'
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState([])
  const [featuredList, setFeaturedList] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Document Title & SEO Meta
  useEffect(() => {
    document.title = 'Photo & Video Gallery | Alpine Explorers'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore authentic travel moments, mountain expeditions, desert safaris, and nature camps captured on Alpine Explorers tours.'
      )
    }
  }, [])

  // Load real categories and featured highlights on mount
  useEffect(() => {
    let mounted = true
    const initData = async () => {
      try {
        const [catRes, featRes] = await Promise.all([
          getCategoriesWithCounts({ filterEmpty: true }),
          getFeaturedImages(8),
        ])
        if (mounted) {
          if (catRes.data) setCategories(catRes.data)
          if (featRes.data) setFeaturedList(featRes.data)
        }
      } catch (e) {
        console.warn('[Gallery] Error loading categories/featured:', e)
      }
    }
    initData()
    return () => {
      mounted = false
    }
  }, [])

  // Load real published items from Supabase when filters change
  const loadImages = useCallback(
    async (pageToLoad = 0, isAppend = false) => {
      if (isAppend) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setError(null)
      }

      try {
        const res = await getPublishedImages({
          categorySlug: activeCategory,
          mediaType,
          search: searchQuery,
          page: pageToLoad,
          limit: 24,
        })

        if (res.error && (!res.data || res.data.length === 0)) {
          setError(res.error)
        } else {
          setImages((prev) => (isAppend ? [...prev, ...res.data] : res.data))
          setHasMore(res.hasMore)
          setTotalCount(res.total)
          setPage(pageToLoad)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [activeCategory, mediaType, searchQuery]
  )

  useEffect(() => {
    loadImages(0, false)
  }, [loadImages])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadImages(page + 1, true)
    }
  }

  const handleResetFilters = () => {
    setActiveCategory('all')
    setMediaType('all')
    setSearchQuery('')
  }

  const handleOpenLightbox = (item, index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const isFiltered = activeCategory !== 'all' || mediaType !== 'all' || Boolean(searchQuery.trim())

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--ae-cream)',
        color: 'var(--ae-ink)',
      }}
    >
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ===================================================================== */}
        {/* HERO BANNER (~40vh)                                                   */}
        {/* ===================================================================== */}
        <section className="relative min-h-[38vh] flex items-center justify-center overflow-hidden bg-stone-900 py-16 px-4">
          {/* Background image with subtle parallax & luxury gradients */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80&fit=crop"
              alt="Alpine Mountain Horizon"
              className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
              loading="eager"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(15,23,42,0.4) 0%, rgba(10,15,30,0.85) 100%)',
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{
                background:
                  'linear-gradient(to top, var(--ae-cream), transparent)',
              }}
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: GOLD2, fontFamily: 'Cinzel, serif' }}
            >
              <Camera size={15} /> Alpine Explorers Visual Odyssey
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-white font-extrabold uppercase tracking-wide leading-tight drop-shadow-md mb-3"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              }}
            >
              Our Gallery
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-white/90 text-sm sm:text-base max-w-xl mx-auto font-medium"
              style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
            >
              Moments captured on journeys beyond the postcard.
            </motion.p>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* CURATED HIGHLIGHTS STRIP (Only shown if is_featured rows exist in DB) */}
        {/* ===================================================================== */}
        {featuredList.length > 0 && activeCategory === 'all' && mediaType === 'all' && !searchQuery && (
          <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
                style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}
              >
                <Sparkles size={13} style={{ color: GOLD }} /> Curated Highlights
              </span>
              <span className="text-[11px] text-stone-500">Scroll to explore</span>
            </div>

            <div
              className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredList.map((item, fIdx) => {
                const isVid =
                  item.media_type === 'video' ||
                  item.resource_type === 'video' ||
                  /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(item.image_url)

                const thumb = isVid
                  ? item.thumbnail_url || getVideoPosterUrl(item.image_url, { w: 600 })
                  : cloudinaryUrl(item.image_url, { w: 600, q: 'auto', f: 'auto' })

                return (
                  <div
                    key={item.id || fIdx}
                    onClick={() => handleOpenLightbox(item, fIdx)}
                    className="group relative shrink-0 w-64 sm:w-72 h-44 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-[rgba(180,160,130,0.3)] bg-stone-100"
                  >
                    <img
                      src={thumb}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {isVid && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.75)',
                            border: `2px solid ${GOLD}`,
                          }}
                        >
                          <Play size={16} className="ml-0.5 fill-white" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3.5 z-10">
                      <span
                        className="text-[9px] uppercase tracking-wider font-bold mb-0.5"
                        style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}
                      >
                        {item.category?.name || (isVid ? 'Featured Video' : 'Featured')}
                      </span>
                      <h4
                        className="text-white text-xs sm:text-sm font-bold line-clamp-1"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {item.title}
                      </h4>
                      {item.location && (
                        <p className="text-white/75 text-[11px] flex items-center gap-1 mt-0.5 truncate">
                          <MapPin size={10} style={{ color: GOLD }} /> {item.location}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* STICKY CATEGORY & SEARCH BAR                                          */}
        {/* ===================================================================== */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(slug) => setActiveCategory(slug)}
          mediaType={mediaType}
          onSelectMediaType={(type) => setMediaType(type)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          totalCount={totalCount}
        />

        {/* ===================================================================== */}
        {/* MASONRY GRID                                                          */}
        {/* ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <GalleryGrid
            images={images}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onImageClick={handleOpenLightbox}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
          />
        </section>
      </main>

      {/* ===================================================================== */}
      {/* FULLSCREEN LIGHTBOX                                                   */}
      {/* ===================================================================== */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />

      <Footer />
    </div>
  )
}
