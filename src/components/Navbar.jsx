import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, User, Compass, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import SearchModal from './SearchModal'
import UserProfileModal from './UserProfileModal'
import InquiryModal from './InquiryModal'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const BROWN = '#3a2a18'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)

  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Find Your Travel Mood', path: '/travel-mood' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

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
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition"
                style={{ background: 'linear-gradient(135deg, #001a4d, #0d3a80)', boxShadow: '0 6px 16px rgba(0,26,77,0.3)' }}>
                <Compass size={24} style={{ color: GOLD2 }} className="group-hover:rotate-45 transition duration-500" />
              </div>
              <div>
                <span className="font-vintage font-bold text-xl tracking-wider block leading-tight" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                  Alpine Explorers
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold block" style={{ color: GOLD }}>
                  Travel & Tourism
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'font-bold'
                      : ''
                  }`}
                  style={{ color: isActive(link.path) ? NAVY : BROWN }}
                  onMouseEnter={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = NAVY }}
                  onMouseLeave={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = BROWN }}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD2})` }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Action Icons & Badges */}
            <div className="hidden md:flex items-center space-x-3">
              {/* WhatsApp Quick Inquire */}
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                style={{ border: '1px solid rgba(197,155,39,0.6)', color: NAVY, backgroundColor: 'rgba(212,175,55,0.12)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.12)'; e.currentTarget.style.color = NAVY }}
                title="Open WhatsApp Inquire flow"
              >
                <MessageSquare size={14} style={{ color: GOLD }} />
                <span>Inquire</span>
              </button>

              {/* Search Icon */}
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

              {/* Profile Icon */}
              <button
                onClick={() => setProfileOpen(true)}
                className="p-2.5 rounded-xl transition"
                style={{ color: BROWN }}
                onMouseEnter={(e) => { e.currentTarget.style.color = NAVY; e.currentTarget.style.backgroundColor = 'rgba(197,155,39,0.12)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = BROWN; e.currentTarget.style.backgroundColor = 'transparent' }}
                aria-label="User Profile"
                title="User profile & saved tours"
              >
                <User size={19} />
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
                className="p-2 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-5 pt-2 border-t space-y-1"
              style={{ borderColor: 'rgba(180,160,130,0.3)' }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                    isActive(link.path) ? 'font-bold' : ''
                  }`}
                  style={{ color: isActive(link.path) ? NAVY : BROWN, backgroundColor: isActive(link.path) ? 'rgba(212,175,55,0.14)' : 'transparent' }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 grid grid-cols-2 gap-2 px-2">
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
                  <User size={14} /> My Profile
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Global Modals triggered from Navbar */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <UserProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  )
}