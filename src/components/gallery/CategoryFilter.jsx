import { useRef, useEffect } from 'react'
import { Search, X, Sparkles, MapPin, Camera, Video, Layers } from 'lucide-react'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'
const BROWN = 'var(--ae-ink)'

export default function CategoryFilter({
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
  mediaType = 'all',
  onSelectMediaType,
  searchQuery = '',
  onSearchChange,
  totalCount = 0,
}) {
  const scrollContainerRef = useRef(null)

  // Scroll active chip into view on mobile
  useEffect(() => {
    if (!scrollContainerRef.current) return
    const activeBtn = scrollContainerRef.current.querySelector('[data-active="true"]')
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeCategory])

  return (
    <div
      className="sticky z-30 transition-all border-b shadow-sm backdrop-blur-md"
      style={{
        top: 'var(--header-height, 64px)',
        backgroundColor: 'rgb(var(--ae-cream-rgb) / 0.95)',
        borderColor: 'rgba(180, 160, 130, 0.35)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
        {/* Top Row: Media Type Tabs (All / Photos / Videos) & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Media Type Filter Chips */}
          <div className="inline-flex items-center p-1 rounded-xl bg-white/80 border border-[rgba(180,160,130,0.3)] shadow-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onSelectMediaType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mediaType === 'all'
                  ? 'bg-[var(--ae-navy)] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <Layers size={13} style={{ color: mediaType === 'all' ? GOLD : undefined }} />
              <span>All</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMediaType('photos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mediaType === 'photos'
                  ? 'bg-[var(--ae-navy)] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <Camera size={13} style={{ color: mediaType === 'photos' ? GOLD : undefined }} />
              <span>Photos</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMediaType('videos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mediaType === 'videos'
                  ? 'bg-[var(--ae-navy)] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <Video size={13} style={{ color: mediaType === 'videos' ? GOLD : undefined }} />
              <span>Videos</span>
            </button>
          </div>

          {/* Search input with location icon */}
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, location..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-white border border-[rgba(180,160,130,0.35)] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)] shadow-xs transition"
            />
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Horizontally Scrollable Category Chips (Only categories with items > 0) */}
        {categories.length > 0 && (
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* 'All Categories' Chip */}
            <button
              type="button"
              data-active={activeCategory === 'all'}
              onClick={() => onSelectCategory('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                activeCategory === 'all'
                  ? 'text-white shadow-md shadow-navy/20 scale-[1.02]'
                  : 'text-stone-700 bg-white/80 hover:bg-white hover:text-stone-900 border border-[rgba(180,160,130,0.3)]'
              }`}
              style={{
                backgroundColor: activeCategory === 'all' ? NAVY : undefined,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Sparkles
                size={13}
                style={{ color: activeCategory === 'all' ? GOLD : '#a88941' }}
              />
              <span>All Categories</span>
              {totalCount > 0 && activeCategory === 'all' && (
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Individual Category Chips with real counts */}
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.slug
              return (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  data-active={isSelected}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-white shadow-md shadow-navy/20 scale-[1.02]'
                      : 'text-stone-700 bg-white/80 hover:bg-white hover:text-stone-900 border border-[rgba(180,160,130,0.3)]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? NAVY : undefined,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span>{cat.name}</span>
                  {typeof cat.count === 'number' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
