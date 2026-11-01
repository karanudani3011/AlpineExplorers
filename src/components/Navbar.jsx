import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, User, Compass, MessageSquare, ChevronDown, Globe, Map, Mountain, Tent, Users, Backpack, Ticket, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import SearchModal from './SearchModal'
import UserProfileModal from './UserProfileModal'
import InquiryModal from './InquiryModal'
import ServicesMegaMenu from './ServicesMegaMenu'
import { serviceCategories } from '../data/servicesData'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import ThemeSwitcher from '../theme/ThemeSwitcher'

const NAVY = 'var(--ae-navy)'
const NAVY_MID = 'var(--ae-navy-mid)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'
const BROWN = 'var(--ae-ink)'

const serviceSubLinks = [
  { name: 'International', slug: 'international', icon: Globe, tagline: 'Explore the world beyond borders' },
  { name: 'Domestic', slug: 'domestic', icon: Map, tagline: 'Discover incredible India' },
  { name: 'Mountain Expedition', slug: 'mountain-expedition', icon: Mountain, tagline: 'Conquer the Himalayas with expert guides' },
  { name: 'Adventure Camp & Trek', slug: 'adventure-camp-trek', icon: Tent, tagline: 'Camping, trekking & unforgettable trails' },
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
    { name: 'Gallery', path: '/gallery' },
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

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Close menu on location change
  useEffect(() => {
    setIsOpen(false)
    setMegaOpen(false)
    setMobileServicesOpen(false)
  }, [location.pathname])

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 border-b shadow-sm backdrop-blur-md w-full"
        style={{
          backgroundColor: 'rgb(var(--ae-cream-rgb) /0.95)',
          borderColor: 'rgba(180,160,130,0.3)',
        }}
      >
        <div className="header-container max-w-7xl mx-auto">
          {/* Header Logo & Brand */}
          <Link to="/home" className="header-brand group" onClick={handleNavigate}>
            <img
              src="/alpine_logo.webp"
              alt="Alpine Explorers Rajkot Logo"
              className="header-brand-logo object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' }}
            />
            <div className="header-brand-text">
              <span
                className="header-brand-title font-vintage font-bold block leading-tight uppercase"
                style={{ color: '#C8102E', fontFamily: 'Cinzel, serif' }}
              >
                ALPINE EXPLORERS
              </span>
              <span
                className="header-brand-tagline uppercase tracking-[0.18em] font-semibold block"
                style={{ color: NAVY, fontFamily: 'Inter, sans-serif' }}
              >
                PIONEER IN ADVENTURE TOURISM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu (>= 1024px) */}
          <div className="desktop-nav hidden lg:flex items-center">
            {navLinks.map((link) => {
              const active = link.hasMega ? isServicesActive : isActive(link.path)

              if (link.hasMega) {
                return (
                  <div
                    key={link.path}
                    className="relative py-2"
                    onMouseEnter={handleMegaHoverStart}
                    onMouseLeave={handleMegaHoverEnd}
                  >
                    <Link
                      to={link.path}
                      id="services-mega-trigger"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                      className={`relative py-1 text-sm font-medium transition-colors flex items-center gap-1 ${
                        active ? 'font-bold' : ''
                      }`}
                      style={{ color: active ? NAVY : BROWN }}
                      onClick={(e) => {
                        if (!megaOpen) {
                          e.preventDefault()
                          setMegaOpen(true)
                        } else {
                          handleNavigate()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                          e.preventDefault()
                          setMegaOpen((prev) => !prev)
                        } else if (e.key === 'Escape') {
                          setMegaOpen(false)
                        }
                      }}
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

          {/* Desktop Right Action Icons & Badges (>= 1024px) */}
          <div className="header-actions hidden lg:flex items-center">
            <ThemeSwitcher />

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl transition"
              style={{ color: BROWN }}
              onMouseEnter={(e) => { e.currentTarget.style.color = NAVY; e.currentTarget.style.backgroundColor = 'rgb(var(--ae-gold-rgb) /0.12)' }}
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
              onMouseEnter={(e) => { e.currentTarget.style.color = NAVY; e.currentTarget.style.backgroundColor = 'rgb(var(--ae-gold-rgb) /0.12)' }}
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

            <a
              href="https://wa.me/919979883339?text=Hello%20Alpine%20Explorers%2C%20I%20want%20to%20know%20more%20about%20your%20tours."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="whatsapp-header whatsapp-header-desktop"
            >
              <FaWhatsapp size={20} aria-hidden="true" />
            </a>
          </div>

          {/* Mobile & Tablet Right Icons Group (< 1024px) */}
          <div className="header-mobile-actions flex lg:hidden items-center">
            {/* Search: hidden below 480px, shown 480px-1023px */}
            <button
              onClick={() => setSearchOpen(true)}
              className="header-icon-btn hidden min-[480px]:inline-flex"
              style={{ color: BROWN }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Theme switcher: hidden below 480px, shown 480px-1023px */}
            <div className="hidden min-[480px]:block">
              <ThemeSwitcher compact={true} />
            </div>

            {/* WhatsApp: always visible in mobile header */}
            <a
              href="https://wa.me/919979883339?text=Hello%20Alpine%20Explorers%2C%20I%20want%20to%20know%20more%20about%20your%20tours."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="whatsapp-header"
            >
              <FaWhatsapp size={18} aria-hidden="true" />
            </a>

            {/* Hamburger button: ALWAYS visible on mobile/tablet, never clipped */}
            <button
              className="header-icon-btn flex-shrink-0 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
              style={{ color: NAVY }}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop Services Mega Menu: centered in viewport at nav level */}
        <ServicesMegaMenu
          isOpen={megaOpen}
          onHoverStart={handleMegaHoverStart}
          onHoverEnd={handleMegaHoverEnd}
          onNavigate={handleNavigate}
          onClose={() => setMegaOpen(false)}
        />
      </motion.nav>

      {/* Mobile Menu Backdrop & Full-Width Drawer (< 1024px) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Outside click backdrop */}
            <motion.div
              key="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              style={{ top: 'var(--header-height, 64px)' }}
              aria-hidden="true"
            />

            {/* Slide-down/Slide-in full-width drawer */}
            <motion.div
              key="mobile-drawer-panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 right-0 z-50 lg:hidden border-b shadow-2xl overflow-y-auto"
              style={{
                top: 'var(--header-height, 64px)',
                maxHeight: 'calc(100vh - var(--header-height, 64px))',
                backgroundColor: 'rgb(var(--ae-cream-rgb) / 0.98)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(180, 160, 130, 0.35)',
              }}
            >
              <div
                className="px-4 py-4 space-y-1.5"
                style={{
                  paddingLeft: 'max(16px, env(safe-area-inset-left))',
                  paddingRight: 'max(16px, env(safe-area-inset-right))',
                  paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom) + 24px))',
                }}
              >
                {/* Navigation links */}
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
                            backgroundColor: isServicesActive ? 'rgb(var(--ae-gold2-rgb) /0.14)' : 'transparent',
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
                                  style={{ color: GOLD, backgroundColor: 'rgb(var(--ae-gold-rgb) /0.08)' }}
                                >
                                  Browse All Services
                                </Link>
                                {serviceCategories.map((sub) => {
                                  const SubIcon = sub.icon
                                  const thumb = sub.cardImage || sub.heroImage
                                  return (
                                    <Link
                                      key={sub.slug}
                                      to={`/services/${sub.slug}`}
                                      onClick={handleNavigate}
                                      className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm transition hover:bg-black/5"
                                      style={{ color: BROWN }}
                                    >
                                      {thumb ? (
                                        <img
                                          src={thumb}
                                          alt={sub.shortName || sub.name}
                                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-[rgba(180,160,130,0.3)]"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div
                                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                          style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                                        >
                                          {SubIcon && <SubIcon size={14} className="text-white" />}
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <span className="font-semibold text-xs block truncate" style={{ color: NAVY }}>
                                          {sub.shortName || sub.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500 line-clamp-1">
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
                        backgroundColor: isActive(link.path) ? 'rgb(var(--ae-gold2-rgb) /0.14)' : 'transparent',
                      }}
                      onClick={handleNavigate}
                    >
                      {link.name}
                    </Link>
                  )
                })}

                {/* Mobile Drawer Bottom Actions: Search, Theme Toggle, WhatsApp CTA, Profile */}
                <div className="pt-3 mt-3 border-t space-y-3" style={{ borderColor: 'rgba(180,160,130,0.3)' }}>
                  {/* Search trigger button inside drawer */}
                  <button
                    onClick={() => { setIsOpen(false); setSearchOpen(true); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition"
                    style={{
                      backgroundColor: 'rgb(var(--ae-gold-rgb) / 0.08)',
                      color: BROWN,
                      border: '1px solid rgb(var(--ae-gold-rgb) / 0.25)',
                    }}
                  >
                    <Search size={17} style={{ color: GOLD }} />
                    <span className="text-xs font-semibold">Search destinations & tours...</span>
                  </button>

                  {/* Theme Switcher block inside drawer */}
                  <div
                    className="p-3 rounded-xl border flex items-center justify-between"
                    style={{
                      backgroundColor: 'rgb(var(--ae-gold2-rgb) / 0.06)',
                      borderColor: 'rgb(var(--ae-gold-rgb) / 0.2)',
                    }}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: NAVY }}>
                      <Palette size={15} style={{ color: GOLD }} /> Color Theme
                    </span>
                    <ThemeSwitcher compact={true} />
                  </div>

                  {/* WhatsApp CTA button */}
                  <a
                    href="https://wa.me/919979883339?text=Hello%20Alpine%20Explorers%2C%20I%20want%20to%20know%20more%20about%20your%20tours."
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white shadow-md transition hover:brightness-105"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <FaWhatsapp size={20} />
                    <span>Chat with Us on WhatsApp</span>
                  </a>

                  {/* My Bookings link (if user logged in) */}
                  {user && (
                    <Link
                      to="/my-bookings"
                      onClick={handleNavigate}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition text-white"
                      style={{ backgroundColor: NAVY, border: '1px solid rgb(var(--ae-gold2-rgb) /0.4)', fontFamily: 'Cinzel, serif' }}
                    >
                      <Ticket size={14} style={{ color: GOLD2 }} /> My Bookings
                    </Link>
                  )}

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setIsOpen(false); setInquiryOpen(true); }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: GOLD, color: NAVY, fontFamily: 'Cinzel, serif' }}
                    >
                      <MessageSquare size={14} /> Quick Inquire
                    </button>
                    <button
                      onClick={() => { setIsOpen(false); setProfileOpen(true); }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: NAVY, fontFamily: 'Cinzel, serif' }}
                    >
                      <User size={14} /> {user ? 'My Profile' : 'Login / Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Modals triggered from Navbar */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <UserProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  )
}
