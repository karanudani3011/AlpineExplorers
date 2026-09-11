import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone, MapPin, MessageCircle, Youtube, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const NAVY = '#001a4d'
const NAVY_DEEP = '#030914'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function HandRoute({ className = '', tone = 0.4 }) {
  return (
    <svg viewBox="0 0 500 40" className={className} fill="none" style={{ opacity: tone }}>
      <path d="M20 30 C80 5, 160 38, 250 15 S400 38, 480 12" stroke="#d4af37" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
      <circle cx="20" cy="30" r="4" fill="#d4af37" />
      <circle cx="200" cy="22" r="3.5" fill="#d4af37" opacity="0.6" />
      <circle cx="350" cy="18" r="3.5" fill="#d4af37" opacity="0.6" />
      <circle cx="480" cy="12" r="5" fill="#d4af37" stroke="#0a1a38" strokeWidth="1.5" />
    </svg>
  )
}

function CompassRose({ size = 76, tone = 0.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity: tone }}>
      <circle cx="50" cy="50" r="44" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="50" cy="50" r="34" stroke="#d4af37" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="50" y1="8" x2="50" y2="18" stroke="#d4af37" strokeWidth="1.6" transform={`rotate(${a} 50 50)`} />
      ))}
      <polygon points="50,14 56,44 50,38 44,44" fill="#c85d42" />
      <polygon points="50,86 43,56 50,62 57,56" fill="#faf5ea" />
      <circle cx="50" cy="50" r="4" fill="#d4af37" />
    </svg>
  )
}

function Tree({ className = '', tone = 0.28 }) {
  return (
    <svg viewBox="0 0 60 80" className={className} style={{ opacity: tone }} fill="none">
      <path d="M30 72 V52" stroke="#6b8f5b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="38" r="18" fill="#4a6741" />
      <circle cx="18" cy="46" r="12" fill="#5b7a4d" />
      <circle cx="42" cy="46" r="12" fill="#5b7a4d" />
    </svg>
  )
}

function ColumnTitle({ children }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div className="w-5 h-[1.5px]" style={{ background: GOLD2 }} />
      <h4 className="text-sm font-bold tracking-[0.18em] uppercase" style={{ ...font.vintage, color: CREAM }}>
        {children}
      </h4>
    </div>
  )
}

const socials = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', placeholder: true },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', placeholder: true },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', placeholder: true },
  
]

const quickLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Services', path: '/services' },
  { name: 'International Tours', path: '/services/international' },
  { name: 'Domestic Tours', path: '/services/domestic' },
  { name: 'Mountain Expeditions', path: '/services/mountain' },
  { name: 'Adventure Tours', path: '/services/adventure' },
  { name: 'Family Tours', path: '/services/family' },
  { name: 'Blog', path: '/blog' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
]

const services = [
  'International Tours',
  'Domestic Tours',
  'Adventure Tours',
  'Camping & Weekend Getaways',
  'Gir & Wildlife Safari',
  'Marine Tours',
  'Trekking & Hiking',
  'Corporate Outings',
  'School & College Tours',
  'Customized Tours',
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-16"
      style={{ backgroundColor: NAVY_DEEP, color: 'rgba(250,245,234,0.85)', font: font.body }}>
      {/* decorative mountain ridge along top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ opacity: 0.16 }}>
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="w-full h-24 sm:h-36" fill="none">
          <path d="M0 140 L160 70 L280 110 L440 40 L560 90 L720 20 L880 95 L1010 45 L1160 100 L1300 55 L1440 110 L1440 160 L0 160 Z" fill="#d4af37" opacity="0.5" />
          <path d="M0 160 L140 100 L300 120 L480 70 L660 120 L840 65 L1020 115 L1200 75 L1440 95 L1440 160 L0 160 Z" fill="#faf5ea" opacity="0.25" />
        </svg>
      </div>
      {/* compass corner */}
      <CompassRose size={120} tone={0.4} className="hidden lg:block absolute left-10 bottom-24 pointer-events-none" />
      {/* floating trees */}
      <Tree className="hidden lg:block absolute right-12 bottom-36 w-16 pointer-events-none" />
      <Tree className="hidden lg:block absolute right-28 bottom-14 w-12 pointer-events-none" tone={0.18} />
      {/* faint routes */}
      <HandRoute className="hidden lg:block absolute left-1/3 top-0 w-72 pointer-events-none" tone={0.22} />
      <HandRoute className="hidden lg:block absolute right-1/4 bottom-6 w-56 pointer-events-none" tone={0.15} />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <motion.div variants={item} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, boxShadow: '0 6px 18px rgba(212,175,55,0.35)' }}>
                <svg width="26" height="22" viewBox="0 0 34 28" fill="none">
                  <polygon points="17,4 6,24 28,24" stroke="#001a4d" strokeWidth="2.5" fill="none" />
                  <polygon points="17,4 15,14 20,14" fill="#001a4d" opacity="0.8" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight" style={{ ...font.vintage, color: CREAM }}>Alpine Explorers</h3>
                <span className="text-xs font-bold tracking-[0.25em]" style={{ color: GOLD2, ...font.body }}>SINCE 1998</span>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(250,245,234,0.72)' }}>
              Crafting unforgettable adventures across the world — from Himalayan treks to international holidays, the way travel should be.
            </p>

            {/* mini stamp */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ border: '1.5px dashed rgba(212,175,55,0.6)', transform: 'rotate(-2deg)', backgroundColor: 'rgba(212,175,55,0.06)' }}>
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD2, ...font.body }}>
                ★ Rajkot's Travel Experts
              </span>
            </div>

            {/* socials — Follow Our Adventures */}
            <div>
              <span className="text-lg block mb-2" style={{ ...font.script, color: GOLD2 }}>Follow our adventures</span>
              <div className="flex gap-3">
                {socials.map((s) => {
                  const Icon = s.icon
                  return (
                    <motion.a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.08 }}
                      aria-label={s.name}
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 38, height: 38,
                        backgroundColor: 'rgba(250,245,234,0.06)',
                        border: '1px solid rgba(212,175,55,0.35)',
                        color: CREAM,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(250,245,234,0.06)'; e.currentTarget.style.color = CREAM }}
                    >
                      <Icon size={17} />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <ColumnTitle>Quick Links</ColumnTitle>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.path}
                    className="group inline-flex items-center gap-1.5 text-[13px] transition-all duration-300"
                    style={{ color: 'rgba(250,245,234,0.72)' }}>
                    <span className="w-1 h-1 rounded-full transition-colors duration-300" style={{ backgroundColor: GOLD2 }} />
                    <span className="group-hover:translate-x-1 transition-transform duration-300 group-hover:text-[#f7eccf]">{l.name}</span>
                    <ArrowRight size={11} style={{ color: GOLD2 }} className="opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Services */}
          <motion.div variants={item}>
            <ColumnTitle>Our Services</ColumnTitle>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link to="/services"
                    className="group inline-flex items-center gap-1.5 text-[13px] transition-all duration-300"
                    style={{ color: 'rgba(250,245,234,0.72)' }}>
                    <span className="w-1 h-1 rounded-full transition-colors duration-300" style={{ backgroundColor: GOLD2 }} />
                    <span className="group-hover:translate-x-1 transition-transform duration-300 group-hover:text-[#f7eccf]">{s}</span>
                    <ArrowRight size={11} style={{ color: GOLD2 }} className="opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item}>
            <ColumnTitle>Contact</ColumnTitle>
            <ul className="space-y-4 text-[13px]">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)' }}>
                  <MapPin size={14} style={{ color: GOLD2 }} />
                </span>
                <span className="leading-relaxed" style={{ color: 'rgba(250,245,234,0.72)' }}>
                  B-309, The One World,<br />Near Ayodhya Chowk, 150 Feet Ring Road,<br />Rajkot - 360 006, Gujarat, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)' }}>
                  <Phone size={14} style={{ color: GOLD2 }} />
                </span>
                <div>
                  <a href="tel:+919825213245" className="block font-semibold hover:text-[#f7eccf] transition" style={{ color: CREAM }}>
                    +91 99798 83339
                  </a>
                  <a href="tel:+912812589090" className="block font-semibold hover:text-[#f7eccf] transition" style={{ color: CREAM }}>
                    +91 281 2589090
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)' }}>
                  <Mail size={14} style={{ color: GOLD2 }} />
                </span>
                <div>
                 
                  <a href="mailto:alpine_explorers@yahoo.co.in" className="block font-semibold hover:text-[#f7eccf] transition" style={{ color: CREAM }}>
                    alpine_explorers@yahoo.co.in
                  </a>
                </div>
              </li>
            </ul>

            <motion.a
              href="https://wa.me/919979883339"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: '#1f7a4d', color: '#fff', ...font.vintage, boxShadow: '0 8px 20px rgba(31,122,77,0.35)' }}
            >
              <MessageCircle size={15} /> Chat on WhatsApp
            </motion.a>
          </motion.div>
        </div>

        {/* bottom bar */}
        <div className="border-t pt-6 pb-8" style={{ borderColor: 'rgba(212,175,55,0.22)' }}>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-[12px]">
            <p className="tracking-wide" style={{ color: 'rgba(250,245,234,0.6)' }}>
              © 2026 <span className="font-bold" style={{ color: GOLD2 }}>Alpine Explorers</span>. All Rights Reserved.
            </p>
            <p className="italic text-[13px]" style={{ ...font.script, color: 'rgba(212,175,55,0.85)' }}>
              "Adventure begins where the road ends"
            </p>
            <div className="flex items-center gap-5">
              <Link to="/privacy-policy" className="hover:text-[#f7eccf] transition tracking-wide" style={{ color: 'rgba(250,245,234,0.6)' }}>
                Privacy Policy
              </Link>
              <span style={{ color: 'rgba(212,175,55,0.5)' }}>|</span>
              <Link to="/terms" className="hover:text-[#f7eccf] transition tracking-wide" style={{ color: 'rgba(250,245,234,0.6)' }}>
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}