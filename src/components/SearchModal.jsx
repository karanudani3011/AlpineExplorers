import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, X, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { destinations, tours as staticTours, experiences, blogs, testimonials } from '../data/data'
import { serviceCategories, serviceTours } from '../data/servicesData'
import { events } from '../data/eventsData'
import { getCatalog } from '../services/catalog'

function formatPrice(p) {
  return 'On Request'
}

function buildSearchIndex(catalogTours = []) {
  const resolvesTourId = (id) => {
    const key = String(id)
    for (const cat of Object.values(serviceTours)) {
      if (cat.some((t) => String(t.id) === key)) return true
    }
    return staticTours.some((t) => String(t.id) === key)
  }

  const items = []

  // 1. Service tours (the real tour catalog rendered across the Services pages)
  for (const cat of serviceCategories) {
    const list = serviceTours[cat.slug] || []
    for (const t of list) {
      items.push({
        kind: 'tour',
        id: `svc-${cat.slug}-${t.id}`,
        href: `/tour/${t.id}`,
        title: t.title,
        category: t.category || cat.shortName,
        location: (t.location || t.destination || '').trim(),
        description: t.shortDescription || t.description || '',
        image: t.image || cat.heroImage,
        price: t.price,
        meta: t.duration || '',
        hay: [t.title, t.location, t.destination, t.category, cat.shortName, t.shortDescription, t.description, t.badge, t.mood, t.destinationType, t.tag].filter(Boolean).join(' '),
      })
    }
  }

  // 2. Static featured tours (Home page showcase)
  for (const t of staticTours) {
    items.push({
      kind: 'tour',
      id: `static-${t.id}`,
      href: `/tour/${t.id}`,
      title: t.title,
      category: t.category,
      location: (t.location || t.destination || '').trim(),
      description: t.shortDescription || t.description || '',
      image: t.image,
      price: t.price,
      meta: t.duration || '',
      hay: [t.title, t.destination, t.location, t.category, t.shortDescription, t.description, t.badge, t.mood, t.destinationType, t.tag].filter(Boolean).join(' '),
    })
  }

  // 3. API catalog (Supabase) — only entries that resolve to a real detail page
  for (const t of catalogTours || []) {
    if (!resolvesTourId(t.id)) continue
    if (items.some((it) => it.href === `/tour/${t.id}`)) continue
    items.push({
      kind: 'tour',
      id: `catalog-${t.id}`,
      href: `/tour/${t.id}`,
      title: t.title,
      category: t.category,
      location: t.location || '',
      description: t.shortDescription || t.description || '',
      image: t.image,
      price: t.price,
      meta: t.duration || '',
      hay: [t.title, t.destination, t.location, t.category, t.shortDescription, t.description, t.badge, t.mood, t.destinationType, t.tag].filter(Boolean).join(' '),
    })
  }

  // 4. Destinations — link to a matching tour if one exists, else Services
  for (const d of destinations) {
    const name = String(d.name || '').toLowerCase()
    const match = items.find((it) => {
      if (it.kind !== 'tour') return false
      return `${it.title} ${it.location} ${it.description}`.toLowerCase().includes(name)
    })
    items.push({
      kind: 'destination',
      id: `dest-${d.id}`,
      href: match ? match.href : '/services',
      title: d.name,
      category: d.tag || d.country,
      location: d.country,
      description: d.description || '',
      image: d.image,
      price: 0,
      meta: d.country,
      hay: [d.name, d.country, d.tag, d.description].filter(Boolean).join(' '),
    })
  }

  // 5. Services
  for (const c of serviceCategories) {
    items.push({
      kind: 'service',
      id: `svc-${c.slug}`,
      href: `/services/${c.slug}`,
      title: c.shortName,
      category: 'Service',
      location: '',
      description: c.description || '',
      image: c.heroImage,
      price: 0,
      meta: c.tagline || '',
      hay: [c.name, c.shortName, c.slug, c.tagline, c.description].filter(Boolean).join(' '),
    })
  }

  // 6. Travel experiences
  for (const x of experiences) {
    items.push({
      kind: 'experience',
      id: `exp-${x.id}`,
      href: '/services',
      title: x.name,
      category: 'Experience',
      location: '',
      description: x.description || '',
      image: x.image,
      price: 0,
      meta: '',
      hay: [x.name, x.description].filter(Boolean).join(' '),
    })
  }

  // 7. Traveler stories (testimonials)
  for (const ts of testimonials) {
    items.push({
      kind: 'testimonial',
      id: `ts-${ts.id}`,
      href: '/home',
      title: ts.name,
      category: 'Traveler Story',
      location: '',
      description: ts.text || '',
      image: ts.avatar,
      price: 0,
      meta: ts.role || '',
      hay: [ts.name, ts.role, ts.text].filter(Boolean).join(' '),
    })
  }

  // 8. Blog posts
  for (const b of blogs) {
    items.push({
      kind: 'blog',
      id: `blog-${b.id}`,
      href: '/blog',
      title: b.title,
      category: b.category || 'Blog',
      location: '',
      description: b.excerpt || '',
      image: b.image,
      price: 0,
      meta: b.readTime || '',
      hay: [b.title, b.category, b.excerpt, b.content, b.author].filter(Boolean).join(' '),
    })
  }

  // 9. Upcoming events
  for (const e of events) {
    items.push({
      kind: 'event',
      id: `evt-${e.id}`,
      href: '/upcoming-events',
      title: e.title,
      category: e.badge || 'Event',
      location: e.location || '',
      description: e.description || '',
      image: e.image,
      price: 0,
      meta: e.date || '',
      hay: [e.title, e.location, e.badge, e.tag, e.description, e.date].filter(Boolean).join(' '),
    })
  }

  return items
}

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [catalogTours, setCatalogTours] = useState([])

  useEffect(() => { getCatalog().then(setCatalogTours).catch(() => {}) }, [])

  const searchIndex = useMemo(() => buildSearchIndex(catalogTours), [catalogTours])

  if (!isOpen) return null

  const q = query.trim().toLowerCase()
  const matches = q === '' ? [] : searchIndex.filter((item) => item.hay.toLowerCase().includes(q))

  const filteredTours = matches.filter((m) => m.kind === 'tour')
  const filteredDestinations = matches.filter((m) => m.kind === 'destination')
  const filteredServices = matches.filter((m) => m.kind === 'service')
  const filteredExperiences = matches.filter((m) => m.kind === 'experience')
  const filteredTestimonials = matches.filter((m) => m.kind === 'testimonial')
  const filteredEvents = matches.filter((m) => m.kind === 'event')
  const filteredBlogs = matches.filter((m) => m.kind === 'blog')

  const ResultRow = ({ item }) => (
    <Link
      to={item.href}
      onClick={onClose}
      className="flex items-center gap-3 p-2 rounded-xl transition group"
      style={{ backgroundColor: 'transparent' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(var(--ae-gold2-rgb) /0.14)' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--ae-gold)' }}>{item.category}</p>
        <h4 className="font-bold text-sm truncate text-[color:var(--ae-navy)] group-hover:text-[color:var(--ae-gold)] transition">
          {item.title}
        </h4>
        {item.description && (
          <p className="text-[11px] truncate" style={{ color: 'rgb(var(--ae-ink-rgb) /0.6)' }}>{item.description}</p>
        )}
        {(item.location || item.meta) && (
          <p className="text-xs flex items-center gap-1" style={{ color: 'rgb(var(--ae-ink-rgb) /0.7)' }}>
            {item.location && (
              <>
                <MapPin size={12} style={{ color: 'var(--ae-gold)' }} />
                <span>{item.location}</span>
              </>
            )}
            {item.location && item.meta && <span>•</span>}
            {item.meta && <span>{item.meta}</span>}
          </p>
        )}
      </div>
      {item.kind === 'tour' ? (
        <div className="text-right">
          <span className="font-bold text-sm text-[color:var(--ae-navy)]">{formatPrice(item.price)}</span>
          <div className="text-xs flex items-center gap-0.5 justify-end" style={{ color: 'rgb(var(--ae-ink-rgb) /0.7)' }}>
            <span>Details</span>
            <ArrowRight size={12} />
          </div>
        </div>
      ) : (
        <ArrowRight size={16} className="opacity-40 group-hover:opacity-100 transition" style={{ color: 'var(--ae-gold)' }} />
      )}
    </Link>
  )

  const GroupLabel = ({ children }) => (
    <p className="text-xs font-bold uppercase text-gray-400 mb-2 px-2">{children}</p>
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(3,9,20,0.78)' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border"
          style={{ backgroundColor: 'var(--ae-cream)', borderColor: 'rgba(180,160,130,0.3)' }}
        >
          {/* Search Header */}
          <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
            <Search size={22} style={{ color: 'var(--ae-gold)' }} />
            <input
              type="text"
              autoFocus
              placeholder="Search destinations, mountain treks, luxury retreats..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-base outline-none"
              style={{ color: 'var(--ae-navy)', backgroundColor: 'transparent' }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
            >
              ESC
            </button>
          </div>

          {/* Quick Suggestions when empty */}
          {query.trim() === '' && (
            <div className="p-6 text-sm" style={{ color: 'var(--ae-ink)' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#8c6a28' }}>Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Swiss Alps', 'Bali Retreat', 'Dubai Luxury', 'Paris Romance', 'Mountain Expedition'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition"
                    style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) /0.14)', color: 'var(--ae-navy)', border: '1px solid rgb(var(--ae-gold-rgb) /0.35)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ae-gold)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgb(var(--ae-gold-rgb) /0.14)'; e.currentTarget.style.color = 'var(--ae-navy)' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query.trim() !== '' && (
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {matches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-base font-semibold mb-1 text-[color:var(--ae-navy)]">No destinations found</p>
                  <p className="text-xs">Try searching for Bali, Paris, Dubai, Alps, etc.</p>
                </div>
              ) : (
                <>
                  {filteredTours.length > 0 && (
                    <div>
                      <GroupLabel>Tours & Packages</GroupLabel>
                      <div className="space-y-2">
                        {filteredTours.map((item) => <ResultRow key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}

                  {filteredDestinations.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <GroupLabel>Destinations</GroupLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredDestinations.map((dest) => (
                          <Link
                            key={dest.id}
                            to={dest.href}
                            onClick={onClose}
                            className="flex items-center gap-2 p-2 rounded-lg transition cursor-pointer"
                            style={{ backgroundColor: 'rgba(180,160,130,0.14)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(var(--ae-gold2-rgb) /0.2)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(180,160,130,0.14)' }}
                          >
                            <img
                              src={dest.image}
                              alt={dest.title}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-[color:var(--ae-navy)] truncate">{dest.title}</p>
                              <p className="text-[11px] truncate" style={{ color: 'rgb(var(--ae-ink-rgb) /0.7)' }}>{dest.location}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredServices.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <GroupLabel>Services</GroupLabel>
                      <div className="space-y-2">
                        {filteredServices.map((item) => <ResultRow key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}

                  {filteredEvents.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <GroupLabel>Upcoming Events</GroupLabel>
                      <div className="space-y-2">
                        {filteredEvents.map((item) => <ResultRow key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}

                  {filteredExperiences.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <GroupLabel>Experiences</GroupLabel>
                      <div className="space-y-2">
                        {filteredExperiences.map((item) => <ResultRow key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}

                  {filteredTestimonials.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <GroupLabel>Traveler Stories</GroupLabel>
                      <div className="space-y-2">
                        {filteredTestimonials.map((item) => <ResultRow key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}

                  {filteredBlogs.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <GroupLabel>Blog Posts</GroupLabel>
                      <div className="space-y-2">
                        {filteredBlogs.map((item) => <ResultRow key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
