import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Shield, Award, Compass, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

export default function UserProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const savedTours = [
    { id: 2, title: 'Alpine Adventure Trek', price: 1799, location: 'Swiss Alps, Switzerland' },
    { id: 1, title: 'Bali Luxury Retreat', price: 1299, location: 'Bali, Indonesia' },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end backdrop-blur-sm" style={{ backgroundColor: 'rgba(3,9,20,0.7)' }}>
        <motion.div
          initial={{ opacity: 0, x: 350 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 350 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l"
          style={{ backgroundColor: CREAM, borderColor: 'rgba(180,160,130,0.3)' }}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
              <div className="flex items-center gap-2">
                <Compass size={20} style={{ color: GOLD }} />
                <h3 className="font-display font-bold text-lg text-[#001a4d]">Adventurer Portal</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition"
                style={{ backgroundColor: 'rgba(180,160,130,0.2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(180,160,130,0.2)'; e.currentTarget.style.color = '' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Card */}
            <div className="mt-6 p-4 rounded-2xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #001a4d, #0d3a80)', color: '#fff' }}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: 'rgba(212,175,55,0.25)', border: '2px solid rgba(212,175,55,0.6)' }}>
                  AE
                </div>
                <div>
                  <h4 className="font-bold text-lg">Alex Explorer</h4>
                  <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(250,245,234,0.9)' }}>
                    <span>Summit Pioneer Tier</span>
                    <Award size={13} style={{ color: GOLD2 }} />
                  </p>
                  <p className="text-[11px]" style={{ color: 'rgba(212,175,55,0.85)' }}>Member since 2024</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t text-center" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
                <div>
                  <span className="block font-bold text-lg">4</span>
                  <span className="text-[10px] uppercase" style={{ color: 'rgba(250,245,234,0.8)' }}>Tours</span>
                </div>
                <div>
                  <span className="block font-bold text-lg">12</span>
                  <span className="text-[10px] uppercase" style={{ color: 'rgba(250,245,234,0.8)' }}>Countries</span>
                </div>
                <div>
                  <span className="block font-bold text-lg">1,250</span>
                  <span className="text-[10px] uppercase" style={{ color: 'rgba(250,245,234,0.8)' }}>Exp. Points</span>
                </div>
              </div>
            </div>

            {/* Saved Wishlist */}
            <div className="mt-6">
              <h4 className="font-bold text-sm text-[#001a4d] flex items-center gap-1.5 mb-3">
                <Heart size={16} className="text-red-500 fill-red-500" />
                <span>Saved Expeditions ({savedTours.length})</span>
              </h4>
              <div className="space-y-2">
                {savedTours.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs"
                    style={{ backgroundColor: 'rgba(180,160,130,0.12)', borderColor: 'rgba(180,160,130,0.25)' }}
                  >
                    <div>
                      <p className="font-bold text-[#001a4d]">{item.title}</p>
                      <p style={{ color: 'rgba(58,42,24,0.7)' }}>{item.location}</p>
                    </div>
                    <Link
                      to={`/tour/${item.id}`}
                      onClick={onClose}
                      className="px-2.5 py-1 text-white font-semibold rounded-lg text-[11px]"
                      style={{ backgroundColor: NAVY }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
                    >
                      ${item.price}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 space-y-2 text-sm" style={{ color: BROWN }}>
              <Link
                to="/travel-mood"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl transition border"
                style={{ borderColor: 'rgba(180,160,130,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.16)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span className="font-medium">🧭 Travel Mood Quiz</span>
                <span className="text-xs font-semibold text-[#c59b27]">Take Quiz</span>
              </Link>
              <Link
                to="/services"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl transition border"
                style={{ borderColor: 'rgba(180,160,130,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.16)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span className="font-medium">🗺️ Explore All 5 Services</span>
                <span className="text-xs font-semibold text-[#c59b27]">Browse</span>
              </Link>
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(212,175,55,0.14)', border: '1px dashed rgba(197,155,39,0.5)', color: '#7a5a12' }}>
                <p className="font-bold flex items-center gap-1 mb-0.5">
                  <Shield size={14} /> VIP Concierge Access
                </p>
                <p>24/7 dedicated travel advisor available via WhatsApp hotline.</p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-6 border-t" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition"
              style={{ backgroundColor: NAVY, color: '#fff' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
            >
              <LogOut size={16} /> Close Portal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}