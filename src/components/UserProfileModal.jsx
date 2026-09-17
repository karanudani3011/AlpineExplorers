import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Shield, Award, Compass, LogOut, LogIn, Ticket, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, profile, signOut, openAuthModal } = useSupabaseAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const savedTours = [
    { id: 2, title: 'Alpine Adventure Trek', price: 1799, location: 'Swiss Alps, Switzerland' },
    { id: 1, title: 'Bali Luxury Retreat', price: 1299, location: 'Bali, Indonesia' },
  ]

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const handleOpenAuth = () => {
    onClose()
    openAuthModal({ message: 'Login or create an account to view your bookings and saved tours.' })
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Adventurer')
  const userInitials = displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'AE'

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-end backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(3,9,20,0.7)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 350 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 350 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
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
                className="w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
                style={{ backgroundColor: 'rgba(180,160,130,0.2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(180,160,130,0.2)'; e.currentTarget.style.color = '' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Card / Auth Prompt */}
            {user ? (
              <div
                className="mt-6 p-4 rounded-2xl shadow-lg text-white"
                style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                    style={{ backgroundColor: 'rgba(212,175,55,0.25)', border: '2px solid rgba(212,175,55,0.6)' }}
                  >
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base truncate">{displayName}</h4>
                    <p className="text-xs truncate" style={{ color: 'rgba(250,245,234,0.8)' }}>
                      {user.email}
                    </p>
                    <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: GOLD2 }}>
                      <span>Verified Explorer</span>
                      <Award size={12} />
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
                  <Link
                    to="/my-bookings"
                    onClick={onClose}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition text-white"
                    style={{ backgroundColor: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.35)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.2)'}
                  >
                    <Ticket size={13} style={{ color: GOLD2 }} />
                    <span>View My Bookings</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div
                className="mt-6 p-5 rounded-2xl shadow-md text-white text-center"
                style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.5)' }}
                >
                  <User size={22} style={{ color: GOLD2 }} />
                </div>
                <h4 className="font-bold text-base mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                  Welcome, Explorer
                </h4>
                <p className="text-xs mb-4" style={{ color: 'rgba(250,245,234,0.8)' }}>
                  Log in to manage your bookings, expedited reservations, and personalized tours.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAuth}
                  className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  style={{ backgroundColor: GOLD, color: NAVY }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = GOLD2}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = GOLD}
                >
                  <LogIn size={14} />
                  <span>Login / Sign Up</span>
                </button>
              </div>
            )}

            {/* Quick Links */}
            <div className="mt-6 space-y-2 text-sm" style={{ color: BROWN }}>
              {user && (
                <Link
                  to="/my-bookings"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl transition border font-semibold"
                  style={{ borderColor: 'rgba(180,160,130,0.3)', backgroundColor: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <span className="flex items-center gap-2" style={{ color: NAVY }}>
                    <Ticket size={16} style={{ color: GOLD }} />
                    <span>My Tour Bookings</span>
                  </span>
                  <span className="text-xs font-bold text-[#c59b27]">View</span>
                </Link>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-6 border-t" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer border"
                style={{ borderColor: 'rgba(220,38,38,0.3)', color: '#b91c1c', backgroundColor: 'rgba(220,38,38,0.06)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.06)'}
              >
                <LogOut size={14} /> Sign Out of Account
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                style={{ backgroundColor: NAVY, color: '#fff' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
              >
                Close
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}