import { useState, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, User, Compass, MessageSquare, ChevronDown, Globe, Map, Mountain, Tent, Users, Backpack, Ticket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchModal from './SearchModal'
import UserProfileModal from './UserProfileModal'
import InquiryModal from './InquiryModal'
import ServicesMegaMenu from './ServicesMegaMenu'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const BROWN = '#3a2a18'

const serviceSubLinks = [
  { name: 'International', slug: 'international', icon: Globe, tagline: 'Explore the world beyond borders' },
  { name: 'Domestic', slug: 'domestic', icon: Map, tagline: 'Discover incredible India' },
  { name: 'Mountain', slug: 'mountain', icon: Mountain, tagline: 'Higher peaks, deeper experiences' },
  { name: 'Adventure Tours & Camps', slug: 'adventure', icon: Tent, tagline: 'Thrill & unforgettable trips' },
  { name: 'Family', slug: 'family', icon: Users, tagline: 'Customize your perfect family journey' },
  { name: 'Go Solo', slug: 'solo', icon: Backpack, tagline: 'Explore the world on your own terms' },
]

export default function Navbar() {
  const { user } = useSupabaseAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const hoverTimeout = useRef(null)

  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Services', path: '/services', hasMega: true },
    { name: 'Upcoming Events', path: '/upcoming-events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Find Your Travel Mood', path: '/travel-mood' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path
  const isServicesActive = location.pathname.startsWith('/services')

  const handleMegaHoverStart = useCallback(() => {
    clearTimeout(hoverTimeout.current)
    setMegaOpen(true)
  }, [])

  const handleMegaHoverEnd = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setMegaOpen(false), 200)
  }, [])

  const handleNavigate = () => {
    setMegaOpen(false)
    setIsOpen(false)
    setMobileServicesOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 border-b shadow-sm backdrop-blur-md"
        style={{ backgroundColor: 'rgba(250,245,234,0.95)', borderColor: 'rgba(180,160,130,0.3)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Header Logo & Brand */}
            <Link to="/home" className="flex items-center space-x-3 group">
              <img
                src="/alpine_logo.png"
                alt="Alpine Explorers Rajkot Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' }}
              />
              <div>
                <span className="font-vintage font-bold text-xl sm:text-2xl tracking-wider block leading-tight uppercase" style={{ color: '#C8102E', fontFamily: 'Cinzel, serif' }}>
                  Alpine Explorers
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold block" style={{ color: NAVY, fontFamily: 'Inter, sans-serif' }}>
                  Pioneer In Adventure Tourism
                </span>
              </div>
            </Link>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const active = link.hasMega ? isServicesActive : isActive(link.path)

                if (link.hasMega) {
                  return (
                    <div
                      key={link.path}
                      className="relative"
                      onMouseEnter={handleMegaHoverStart}
                      onMouseLeave={handleMegaHoverEnd}
                    >
                      <Link
                        to={link.path}
                        className={`relative py-1 text-sm font-medium transition-colors flex items-center gap-1 ${
                          active ? 'font-bold' : ''
                        }`}
                        style={{ color: active ? NAVY : BROWN }}
                        onClick={handleNavigate}
                      >
                        {link.name}
                        <ChevronDown
                          size={14}
                          className="transition-transform duration-200"
                          style={{
                            transform: megaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: active ? GOLD : BROWN,
                          }}
                        />
                        {active && (
                          <motion.div
                            layoutId="navUnderline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                            style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD2})` }}
                          />
                        )}
                      </Link>

                      <ServicesMegaMenu
                        isOpen={megaOpen}
                        onHoverStart={handleMegaHoverStart}
                        onHoverEnd={handleMegaHoverEnd}
                        onNavigate={handleNavigate}
                      />
                    </div>
                  )
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-1 text-sm font-medium transition-colors ${
                      active ? 'font-bold' : ''
                    }`}
                    style={{ color: active ? NAVY : BROWN }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = NAVY }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = BROWN }}
                  >
                    {link.name}
                    {active && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD2})` }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Action Icons & Badges */}
            <div className="hidden md:flex items-center space-x-3">
              {/* <button
                onClick={() => setInquiryOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                style={{ border: '1px solid rgba(197,155,39,0.6)', color: NAVY, backgroundColor: 'rgba(212,175,55,0.12)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.12)'; e.currentTarget.style.color = NAVY }}
                title="Open WhatsApp Inquire flow"
              >
                <MessageSquare size={14} style={{ color: GOLD }} />
                <span>Inquire</span>
              </button> */}

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl transition"
                style={{ color: BROWN }}
                onMouseEnter={(e) => { e.currentTarget.style.color = NAVY; e.currentTarget.style.backgroundColor = 'rgba(197,155,39,0.12)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = BROWN; e.currentTarget.style.backgroundColor = 'transparent' }}
                aria-label="Search"
                title="Search destinations & tours"
              >
                <Search size={19} />
              </button>

              <button
                onClick={() => setProfileOpen(true)}
                className="p-2.5 rounded-xl transition relative"
                style={{ color: BROWN }}
                onMouseEnter={(e) => { e.currentTarget.style.color = NAVY; e.currentTarget.style.backgroundColor = 'rgba(197,155,39,0.12)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = BROWN; e.currentTarget.style.backgroundColor = 'transparent' }}
                aria-label="User Profile"
                title={user ? `Logged in as ${user.email}` : "User profile & saved tours"}
              >
                <User size={19} />
                {user && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: GOLD }}
                    title="Active session"
                  />
                )}
              </button>
            </div>

            {/* Mobile Menu & Action Buttons */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2"
                style={{ color: BROWN }}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden pb-5 pt-2 border-t space-y-1 overflow-hidden"
                style={{ borderColor: 'rgba(180,160,130,0.3)' }}
              >
                {navLinks.map((link) => {
                  if (link.hasMega) {
                    return (
                      <div key={link.path}>
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium transition ${
                            isServicesActive ? 'font-bold' : ''
                          }`}
                          style={{
                            color: isServicesActive ? NAVY : BROWN,
                            backgroundColor: isServicesActive ? 'rgba(212,175,55,0.14)' : 'transparent',
                          }}
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            size={16}
                            className="transition-transform duration-200"
                            style={{ transform: mobileServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pr-2 py-1 space-y-1">
                                <Link
                                  to={link.path}
                                  onClick={handleNavigate}
                                  className="block py-2 px-3 rounded-lg text-xs font-bold transition"
                                  style={{ color: GOLD, backgroundColor: 'rgba(197,155,39,0.08)' }}
                                >
                                  Browse All Services
                                </Link>
                                {serviceSubLinks.map((sub) => {
                                  const SubIcon = sub.icon
                                  return (
                                    <Link
                                      key={sub.slug}
                                      to={`/services/${sub.slug}`}
                                      onClick={handleNavigate}
                                      className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm transition"
                                      style={{ color: BROWN }}
                                    >
                                      <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                                      >
                                        <SubIcon size={14} className="text-white" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-xs block">{sub.name}</span>
                                        <span className="text-[10px]" style={{ color: 'rgba(58,42,24,0.5)' }}>
                                          {sub.tagline}
                                        </span>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                        isActive(link.path) ? 'font-bold' : ''
                      }`}
                      style={{
                        color: isActive(link.path) ? NAVY : BROWN,
                        backgroundColor: isActive(link.path) ? 'rgba(212,175,55,0.14)' : 'transparent',
                      }}
                      onClick={handleNavigate}
                    >
                      {link.name}
                    </Link>
                  )
                })}

                <div className="pt-3 flex flex-col gap-2 px-2">
                  {user && (
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition text-white"
                      style={{ backgroundColor: NAVY, border: '1px solid rgba(212,175,55,0.4)', fontFamily: 'Cinzel, serif' }}
                    >
                      <Ticket size={14} style={{ color: GOLD2 }} /> My Bookings
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setIsOpen(false); setInquiryOpen(true); }}
                      className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: GOLD, color: NAVY, fontFamily: 'Cinzel, serif' }}
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </button>
                    <button
                      onClick={() => { setIsOpen(false); setProfileOpen(true); }}
                      className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: NAVY, fontFamily: 'Cinzel, serif' }}
                    >
                      <User size={14} /> {user ? 'My Profile' : 'Login / Profile'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Global Modals triggered from Navbar */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <UserProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  )
}
