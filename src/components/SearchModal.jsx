import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, X, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { destinations } from '../data/data'
import { getCatalog } from '../services/catalog'

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [tours, setTours] = useState([])

  useEffect(() => { getCatalog().then(setTours).catch(() => {}) }, [])

  if (!isOpen) return null

  const filteredTours = query.trim() === ''
    ? []
    : tours.filter((tour) =>
        tour.title.toLowerCase().includes(query.toLowerCase()) ||
        tour.location.toLowerCase().includes(query.toLowerCase()) ||
        tour.category.toLowerCase().includes(query.toLowerCase())
      )

  const filteredDestinations = query.trim() === ''
    ? []
    : destinations.filter((dest) =>
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase())
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
          style={{ backgroundColor: '#faf5ea', borderColor: 'rgba(180,160,130,0.3)' }}
        >
          {/* Search Header */}
          <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
            <Search size={22} style={{ color: '#c59b27' }} />
            <input
              type="text"
              autoFocus
              placeholder="Search destinations, mountain treks, luxury retreats..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-base outline-none"
              style={{ color: '#001a4d', backgroundColor: 'transparent' }}
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
            <div className="p-6 text-sm" style={{ color: '#3a2a18' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#8c6a28' }}>Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Swiss Alps', 'Bali Retreat', 'Dubai Luxury', 'Paris Romance', 'Mountain Expedition'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition"
                    style={{ backgroundColor: 'rgba(197,155,39,0.14)', color: '#001a4d', border: '1px solid rgba(197,155,39,0.35)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#c59b27'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(197,155,39,0.14)'; e.currentTarget.style.color = '#001a4d' }}
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
              {filteredTours.length === 0 && filteredDestinations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-base font-semibold mb-1 text-[#001a4d]">No destinations found</p>
                  <p className="text-xs">Try searching for "Alps", "Bali", "Paris", or "Dubai"</p>
                </div>
              ) : (
                <>
                  {filteredTours.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400 mb-2 px-2">Matching Tours</p>
                      <div className="space-y-2">
                        {filteredTours.map((tour) => (
                          <Link
                            key={tour.id}
                            to={`/tour/${tour.id}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2 rounded-xl transition group" style={{ backgroundColor: 'transparent' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.14)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <img
                              src={tour.image}
                              alt={tour.title}
                              className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm truncate text-[#001a4d] group-hover:text-[#c59b27] transition">
                                {tour.title}
                              </h4>
                              <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(58,42,24,0.7)' }}>
                                <MapPin size={12} style={{ color: '#c59b27' }} />
                                <span>{tour.location}</span>
                                <span>•</span>
                                <span>{tour.duration}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-sm text-[#001a4d]">{tour.price > 0 ? `$${tour.price}` : 'On Request'}</span>
                              <div className="text-xs flex items-center gap-0.5 justify-end" style={{ color: 'rgba(58,42,24,0.7)' }}>
                                <span>Details</span>
                                <ArrowRight size={12} />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredDestinations.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-bold uppercase text-gray-400 mb-2 px-2">Destinations</p>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredDestinations.map((dest) => (
                          <div
                            key={dest.id}
                            className="flex items-center gap-2 p-2 rounded-lg transition cursor-pointer" style={{ backgroundColor: 'rgba(180,160,130,0.14)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.2)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(180,160,130,0.14)' }}
                            onClick={() => {
                              setQuery(dest.name)
                            }}
                          >
                            <img
                              src={dest.image}
                              alt={dest.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-bold text-xs text-[#001a4d]">{dest.name}</p>
                              <p className="text-[11px]" style={{ color: 'rgba(58,42,24,0.7)' }}>{dest.country}</p>
                            </div>
                          </div>
                        ))}
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
