import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Map, Mountain, Tent, Users, Backpack } from 'lucide-react'
import { serviceCategories as staticCategories } from '../data/servicesData'
import { supabase } from '../services/supabaseClient'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'

const iconMap = {
  international: Globe,
  domestic: Map,
  mountain: Mountain,
  adventure: Tent,
  family: Users,
  solo: Backpack,
}

export default function ServicesMegaMenu({
  isOpen,
  onHoverStart,
  onHoverEnd,
  onNavigate,
  onClose,
}) {
  const menuRef = useRef(null)
  const [categories, setCategories] = useState(staticCategories)
  const [loading, setLoading] = useState(false)

  // 1. Data Source: Query Supabase service_categories with safe static fallback
  useEffect(() => {
    let isMounted = true

    async function fetchCategories() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) {
          console.warn('[ServicesMegaMenu] Supabase query returned error, using static fallback:', error.message)
          return
        }

        if (data && data.length > 0) {
          console.log('[ServicesMegaMenu] Successfully loaded categories from Supabase:', data.length)
          const merged = data.map((item) => {
            const fallback = staticCategories.find((s) => s.id === item.id || s.slug === item.id) || {}
            return {
              id: item.id,
              slug: fallback.slug || item.id,
              shortName: item.badge || fallback.shortName || item.title,
              name: item.title || fallback.name,
              tagline: fallback.tagline || item.description?.slice(0, 55) + '...',
              description: item.description || fallback.description,
              cardImage: fallback.cardImage || fallback.heroImage,
              heroImage: fallback.heroImage,
              icon: fallback.icon || iconMap[item.id] || Globe,
            }
          })
          if (isMounted) {
            setCategories(merged)
          }
        } else {
          console.log('[ServicesMegaMenu] No Supabase rows found, using static categories fallback.')
        }
      } catch (err) {
        console.warn('[ServicesMegaMenu] Network/runtime error fetching categories, using fallback:', err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCategories()
    return () => {
      isMounted = false
    }
  }, [])

  // 2. Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      const trigger = document.getElementById('services-mega-trigger')
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        (!trigger || !trigger.contains(e.target))
      ) {
        if (onClose) onClose()
        else if (onHoverEnd) onHoverEnd()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, onHoverEnd])

  // 3. Keyboard handler (Escape closes dropdown and returns focus to trigger)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (onClose) onClose()
        else if (onHoverEnd) onHoverEnd()
        document.getElementById('services-mega-trigger')?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onHoverEnd])

  return (
    <div
      ref={menuRef}
      className={`hidden lg:block absolute left-1/2 -translate-x-1/2 top-full z-[60] pt-2 transition-all ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        width: 'min(1200px, calc(100vw - 32px))',
        maxWidth: '1200px',
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      role="region"
      aria-label="Services Mega Menu"
    >
      {/* Invisible hover bridge spanning between navbar bottom and dropdown card */}
      <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent pointer-events-auto" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Soft decorative arrow indicator */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 rounded-sm z-10"
              style={{
                boxShadow: '-2px -2px 5px rgba(0,0,0,0.04)',
                borderLeft: '1px solid rgba(200,190,170,0.35)',
                borderTop: '1px solid rgba(200,190,170,0.35)',
              }}
            />

            {/* Main Mega Menu Card */}
            <div
              className="bg-white rounded-2xl overflow-hidden relative z-20"
              style={{
                boxShadow: '0 24px 60px rgba(10,25,60,0.14), 0 8px 24px rgba(10,25,60,0.06)',
                border: '1px solid rgba(200,190,170,0.35)',
              }}
            >
              {/* Header stripe with quick link to All Services */}
              <div
                className="px-6 py-2.5 flex items-center justify-between border-b"
                style={{
                  backgroundColor: 'rgb(var(--ae-cream-rgb) / 0.45)',
                  borderColor: 'rgba(200,190,170,0.25)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}
                  >
                    Our Curated Travel Experiences
                  </span>
                  <span className="text-[11px] text-gray-500 hidden sm:inline">
                    — Explore by journey style
                  </span>
                </div>
                <Link
                  to="/services"
                  onClick={onNavigate}
                  className="text-xs font-bold transition-colors hover:underline inline-flex items-center gap-1"
                  style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}
                >
                  View All Services →
                </Link>
              </div>

              {/* Grid: 3 columns on 1024-1279px, 6 columns on 1280px+ */}
              <div
                className="grid grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 p-5"
                style={{
                  gridTemplateColumns: 'repeat(var(--mega-cols, 3), minmax(0, 1fr))',
                }}
              >
                {/* CSS variable helper: 3 cols on lg, 6 cols on xl */}
                <style>{`
                  @media (min-width: 1024px) {
                    :root { --mega-cols: 3; }
                  }
                  @media (min-width: 1280px) {
                    :root { --mega-cols: 6; }
                  }
                `}</style>

                {loading && categories.length === 0
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="animate-pulse p-3 rounded-xl flex flex-col items-center text-center bg-gray-50/60"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-200 mb-2.5" />
                        <div className="w-full aspect-[3/2] rounded-lg bg-gray-200 mb-2.5" />
                        <div className="w-20 h-3.5 bg-gray-200 rounded mb-1.5" />
                        <div className="w-full h-3 bg-gray-100 rounded" />
                      </div>
                    ))
                  : categories.map((cat) => {
                      const Icon = cat.icon || iconMap[cat.id] || Globe
                      const imageSrc = cat.cardImage || cat.heroImage

                      return (
                        <Link
                          key={cat.id || cat.slug}
                          to={`/services/${cat.slug}`}
                          onClick={onNavigate}
                          className="group flex flex-col items-center text-center p-2.5 rounded-xl transition-all duration-200 hover:bg-[#faf7f0] border border-transparent hover:border-[rgba(200,190,170,0.3)] hover:shadow-sm"
                          style={{
                            minWidth: 0,
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                          }}
                        >
                          {/* Category Icon Badge */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid))`,
                            }}
                          >
                            <Icon size={18} className="text-white" />
                          </div>

                          {/* Image Thumbnail with natural aspect ratio */}
                          <div className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-2.5 ring-1 ring-black/5 bg-stone-100 flex-shrink-0">
                            {imageSrc && (
                              <img
                                src={imageSrc}
                                alt={cat.shortName || cat.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                            )}
                          </div>

                          {/* Category Title */}
                          <h4
                            className="text-[12px] sm:text-[13px] font-bold mb-1 transition-colors duration-200 group-hover:text-[color:var(--ae-gold)] leading-tight text-center break-words w-full"
                            style={{
                              fontFamily: 'Cinzel, serif',
                              color: NAVY,
                            }}
                          >
                            {cat.shortName || cat.name}
                          </h4>

                          {/* Category Description / Tagline */}
                          <p
                            className="text-[10.5px] sm:text-[11px] leading-[1.38] line-clamp-2 text-center w-full"
                            style={{
                              color: 'rgb(var(--ae-ink-rgb) / 0.58)',
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {cat.tagline || cat.description}
                          </p>
                        </Link>
                      )
                    })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
