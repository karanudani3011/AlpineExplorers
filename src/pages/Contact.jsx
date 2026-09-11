import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePublicContent } from '../services/usePublic'
import { api } from '../services/api'
import {
  Compass, ArrowRight, MapPin, Phone, Mail, MessageCircle, Send, User,
  Trees, Tent, Mountain, Users, Calendar, CheckCircle2, Navigation, Globe,
  Route, Backpack, Award, Quote,
} from 'lucide-react'

/* ────────────────────────── Design tokens ────────────────────────── */

const NAVY = '#001a4d'
const NAVY_DARK = '#0d2137'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'
const RED = '#8b2518'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

/* ────────────────────────── Small atoms ────────────────────────── */

function PaperCard({ children, style, className = '', hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: CREAM,
        boxShadow: '0 10px 32px rgba(60,40,20,0.13), 0 2px 6px rgba(60,40,20,0.06)',
        border: '1px solid rgba(180,160,130,0.28)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

function Polaroid({ src, caption, rot = -2, className = '', aspect = 'h-40 sm:h-48' }) {
  return (
    <div
      className={`relative bg-white p-2 pb-11 rounded-sm ${className}`}
      style={{
        boxShadow: '0 10px 34px rgba(60,40,20,0.2), 2px 4px 8px rgba(60,40,20,0.1)',
        transform: `rotate(${rot}deg)`,
        maxWidth: 320,
      }}
    >
      <div
        className="absolute -top-3 left-1/2 w-14 h-5 rounded-sm opacity-55"
        style={{ backgroundColor: 'rgba(245,230,196,0.85)', transform: 'translateX(-50%) rotate(1deg)' }}
      />
      <img src={src} alt={caption} className={`w-full ${aspect} object-cover`} style={{ borderRadius: '2px' }} />
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <span className="text-sm tracking-wide" style={{ ...font.script, color: BROWN }}>{caption}</span>
      </div>
    </div>
  )
}

function HandRoute({ className = '', tone = 0.5 }) {
  return (
    <svg viewBox="0 0 500 40" className={className} fill="none" style={{ opacity: tone }}>
      <path d="M20 30 C80 5, 160 38, 250 15 S400 38, 480 12" stroke="#8c5828" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
      <circle cx="20" cy="30" r="4" fill="#ba3322" />
      <circle cx="200" cy="22" r="3.5" fill="#1e3a5f" />
      <circle cx="350" cy="18" r="3.5" fill="#1e3a5f" />
      <circle cx="480" cy="12" r="5" fill="#ba3322" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  )
}

function SectionHeading({ eyebrow, title, tagline, rotate = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <span className="text-xl tracking-wide" style={{ ...font.script, color: GOLD, transform: `rotate(${rotate}deg)`, display: 'inline-block' }}>
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-1 mb-2" style={{ ...font.vintage, color: NAVY }}>
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3">
        <div className="h-[1.5px] w-12" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
        <p className="italic text-base md:text-lg" style={{ ...font.display, color: 'rgba(58,42,24,0.7)' }}>
          {tagline}
        </p>
        <div className="h-[1.5px] w-12" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
      </div>
    </motion.div>
  )
}

function FloatingTree({ className = '', style, tone = 0.35 }) {
  return (
    <svg viewBox="0 0 60 80" className={className} style={{ opacity: tone, ...style }} fill="none">
      <path d="M30 72 V52" stroke="#5b4632" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="38" r="18" fill="#4a6741" />
      <circle cx="18" cy="46" r="12" fill="#5b7a4d" />
      <circle cx="42" cy="46" r="12" fill="#5b7a4d" />
    </svg>
  )
}

function CompassRose({ size = 90, tone = 0.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity: tone }}>
      <circle cx="50" cy="50" r="44" stroke="#8c5828" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="50" cy="50" r="34" stroke="#8c5828" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="50" y1="8" x2="50" y2="18" stroke="#b07a3f" strokeWidth="1.6"
          transform={`rotate(${a} 50 50)`} />
      ))}
      <polygon points="50,14 56,44 50,38 44,44" fill="#ba3322" />
      <polygon points="50,86 43,56 50,62 57,56" fill="#1e3a5f" />
      <circle cx="50" cy="50" r="4" fill="#c59b27" />
    </svg>
  )
}

function Stamp({ text = 'SINCE 1998', sub = 'ALPINE EXPLORERS', size = 96 }) {
  return (
    <div
      className="inline-flex flex-col items-center justify-center rounded-full"
      style={{
        width: size, height: size, border: '2px dashed rgba(139,37,24,0.7)', color: RED,
        transform: 'rotate(-8deg)', boxShadow: '0 4px 14px rgba(60,40,20,0.15)',
        backgroundColor: 'rgba(250,245,234,0.85)',
      }}
    >
      <svg width="30" height="24" viewBox="0 0 34 28" fill="none">
        <polygon points="17,4 6,24 28,24" stroke={RED} strokeWidth="2" fill="none" />
        <polygon points="17,4 15,12 19,12" fill={RED} opacity="0.3" />
      </svg>
      <span className="text-[8px] font-bold tracking-widest mt-1" style={{ fontFamily: 'serif' }}>{text}</span>
      <span className="text-[6px] tracking-[0.2em]" style={{ fontFamily: 'sans-serif' }}>{sub}</span>
    </div>
  )
}

const NavyBtn = ({ children, href, onClick, className = '', type = 'button' }) => (
  <motion.a
    href={href}
    onClick={onClick}
    type={undefined}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className={`group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-bold ${className}`}
    style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage, boxShadow: '0 8px 24px rgba(0,26,77,0.28)' }}
  >
    {children}
  </motion.a>
)

const GoldBtn = ({ children, href, onClick } = {}) => (
  <motion.a
    href={href}
    onClick={onClick}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs tracking-widest uppercase font-bold"
    style={{
      backgroundColor: GOLD, color: NAVY, ...font.vintage,
      boxShadow: '0 8px 26px rgba(197,155,39,0.4)',
      animation: 'goldGlow 3.2s ease-in-out infinite',
    }}
  >
    {children}
  </motion.a>
)

const Input = ({ label, required, icon: Icon, children, ...props }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
      {label}{required && <span style={{ color: RED }}> *</span>}
    </label>
    {Icon ? (
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: `${GOLD}` }}>
          <Icon size={16} />
        </span>
        <input {...props} className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-white border outline-none transition focus:ring-2"
          style={{ borderColor: 'rgba(180,160,130,0.45)', color: BROWN, ...font.body, boxShadow: '0 2px 8px rgba(60,40,20,0.05)' }}
          onFocus={(e) => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px rgba(197,155,39,0.18)` }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(180,160,130,0.45)'; e.target.style.boxShadow = '0 2px 8px rgba(60,40,20,0.05)' }} />
      </div>
    ) : (
      <input {...props} className="w-full px-4 py-3 rounded-xl text-sm bg-white border outline-none transition focus:ring-2"
        style={{ borderColor: 'rgba(180,160,130,0.45)', color: BROWN, ...font.body, boxShadow: '0 2px 8px rgba(60,40,20,0.05)' }}
        onFocus={(e) => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px rgba(197,155,39,0.18)` }}
        onBlur={(e) => { e.target.style.borderColor = 'rgba(180,160,130,0.45)'; e.target.style.boxShadow = '0 2px 8px rgba(60,40,20,0.05)' }} />
    )}
    {props.error && (
      <p className="text-[11px] font-semibold mt-1" style={{ color: RED, ...font.body }}>{props.error}</p>
    )}
  </div>
)

const Select = ({ label, required, children, value, onChange, error }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
      {label}{required && <span style={{ color: RED }}> *</span>}
    </label>
    <select value={value} onChange={onChange}
      className="w-full px-4 py-3 rounded-xl text-sm bg-white border outline-none cursor-pointer transition"
      style={{ borderColor: 'rgba(180,160,130,0.45)', color: value ? BROWN : 'rgba(58,42,24,0.5)', ...font.body, boxShadow: '0 2px 8px rgba(60,40,20,0.05)' }}>
      {children}
    </select>
    {error && <p className="text-[11px] font-semibold mt-1" style={{ color: RED, ...font.body }}>{error}</p>}
  </div>
)

const Textarea = ({ label, required, error, ...props }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
      {label}{required && <span style={{ color: RED }}> *</span>}
    </label>
    <textarea {...props}
      className="w-full px-4 py-3 rounded-xl text-sm bg-white border outline-none transition resize-none"
      style={{ borderColor: 'rgba(180,160,130,0.45)', color: BROWN, ...font.body, boxShadow: '0 2px 8px rgba(60,40,20,0.05)' }}
      onFocus={(e) => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px rgba(197,155,39,0.18)` }}
      onBlur={(e) => { e.target.style.borderColor = 'rgba(180,160,130,0.45)'; e.target.style.boxShadow = '0 2px 8px rgba(60,40,20,0.05)' }} />
    {error && <p className="text-[11px] font-semibold mt-1" style={{ color: RED, ...font.body }}>{error}</p>}
  </div>
)

/* ────────────────────────── Map illustration ────────────────────────── */

function StylizedMap() {
  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#efe3c7', border: '1px solid rgba(180,160,130,0.4)', boxShadow: 'inset 0 0 40px rgba(120,90,50,0.12)' }}>
      {/* faint grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(140,88,40,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(140,88,40,0.25) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      {/* hand-drawn roads */}
      <svg viewBox="0 0 600 420" className="w-full h-full" fill="none">
        <path d="M-20 340 C120 300, 200 380, 330 300 S520 250, 640 260" stroke="#b07a3f" strokeWidth="3" strokeDasharray="10 8" strokeLinecap="round" opacity="0.55" />
        <path d="M80 -20 C120 100, 60 200, 150 300 S320 430, 420 440" stroke="#b07a3f" strokeWidth="2.5" strokeDasharray="8 7" strokeLinecap="round" opacity="0.45" />
        {/* route to marker */}
        <path d="M445 350 C430 260, 350 250, 322 208 S300 150, 292 132" stroke="#ba3322" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2.4s" repeatCount="indefinite" />
        </path>
        {/* tiny hills */}
        <path d="M40 150 L80 100 L120 150 Z" fill="#b8c29b" opacity="0.6" />
        <path d="M110 180 L150 132 L190 180 Z" fill="#c3cbaa" opacity="0.5" />
        <path d="M470 90 L505 48 L540 90 Z" fill="#b8c29b" opacity="0.55" />
        <path d="M520 120 L560 76 L600 120 Z" fill="#c3cbaa" opacity="0.45" />
        {/* dotted river */}
        <path d="M40 400 C150 340, 260 390, 380 340 S540 370, 620 330" stroke="#7f9fb5" strokeWidth="4" strokeLinecap="round" opacity="0.4" strokeDasharray="2 10" />
        {/* compass */}
        <g transform="translate(528, 352) scale(0.9)">
          <circle cx="0" cy="0" r="26" stroke="#8c5828" strokeWidth="1.4" strokeDasharray="4 4" />
          <polygon points="0,-19 5,-4 0,0 -5,-4" fill="#ba3322" />
          <polygon points="0,19 -5,4 0,0 5,4" fill="#1e3a5f" />
          <circle cx="0" cy="0" r="2.5" fill="#c59b27" />
        </g>
      </svg>

      {/* destination pin */}
      <div className="absolute" style={{ left: '48%', top: '31%' }}>
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <MapPin size={46} style={{ color: RED, fill: RED }} strokeWidth={1.6} />
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-white text-[11px] font-black" style={{ fontFamily: 'serif' }}>R</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-white shadow-md" style={{ border: '1px solid rgba(180,160,130,0.35)' }}>
            <span className="text-[10px] font-bold tracking-wider" style={{ color: NAVY, ...font.vintage }}>RAJKOT · HQ</span>
          </div>
        </motion.div>
      </div>

      {/* small travel markers */}
      <div className="absolute" style={{ left: '22%', top: '66%' }}>
        <motion.div animate={{ rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ opacity: 0.7 }}>
          <Backpack size={30} style={{ color: '#8b5736' }} />
        </motion.div>
      </div>
      <div className="absolute" style={{ left: '74%', top: '52%' }}>
        <motion.div animate={{ rotate: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity }} style={{ opacity: 0.6 }}>
          <Tent size={30} style={{ color: '#8b5736' }} />
        </motion.div>
      </div>
      <div className="absolute" style={{ left: '12%', top: '18%' }}>
        <TreeIcon tone={0.4} />
      </div>
      <div className="absolute" style={{ left: '82%', top: '24%' }}>
        <TreeIcon tone={0.35} />
      </div>
    </div>
  )
}

function TreeIcon({ tone = 0.4 }) {
  return (
    <svg viewBox="0 0 60 80" width="34" height="44" fill="none" style={{ opacity: tone }}>
      <path d="M30 72 V52" stroke="#5b4632" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="38" r="18" fill="#4a6741" />
      <circle cx="18" cy="46" r="12" fill="#5b7a4d" />
      <circle cx="42" cy="46" r="12" fill="#5b7a4d" />
    </svg>
  )
}

/* ────────────────────────── Page ────────────────────────── */

const DEFAULT_CONTACT = {
  phone: '+91 99798 83339',
  whatsapp: '+91 99798 83339',
  email: 'info@alpineexplorers.com',
  address: 'B-309, The One World, Near Ayodhya Chowk, 150 Feet Ring Road, Rajkot - 360 006, Gujarat, India.',
  map_link: 'https://www.google.com/maps/search/?api=1&query=Ayodhya+Chowk+Rajkot',
  business_hours: 'Mon – Sat · 10:00 AM to 7:00 PM',
}

const TRAVEL_TYPES = ['International Tour', 'Domestic Tour', 'Trekking / Adventure', 'Camping', 'Family / Group', 'Honeymoon', 'School / College Tour', 'Cruise', 'Customized Package']

export default function Contact() {
  const { content: apiContact } = usePublicContent('contact')
  const c = { ...DEFAULT_CONTACT, ...(apiContact || {}) }

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', destination: '', travelType: '',
    travelDate: '', travelers: '2', message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    const style = document.createElement('style')
    style.textContent = `@keyframes goldGlow { 0%,100% { box-shadow: 0 8px 26px rgba(197,155,39,0.38); } 50% { box-shadow: 0 10px 34px rgba(212,175,55,0.62); } }`
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const er = {}
    if (!form.fullName.trim()) er.fullName = 'Please enter your name'
    if (!form.email.trim()) er.email = 'Please enter your email'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = 'Enter a valid email address'
    if (!form.phone.trim()) er.phone = 'Please enter your phone number'
    else if (form.phone.replace(/\D/g, '').length < 8) er.phone = 'Enter a valid phone number'
    if (!form.message.trim()) er.message = 'Please tell us about your trip'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    setSubmitError('')
    try {
      await api.post('/inquiries', {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        destination: form.destination,
        package_name: form.travelType,
        travel_date: form.travelDate,
        travelers: Number(form.travelers) || 1,
        message: form.message,
      })
      setStatus('sent')
      setForm({ fullName: '', email: '', phone: '', destination: '', travelType: '', travelDate: '', travelers: '2', message: '' })
    } catch {
      setStatus('error')
      setSubmitError('Something went wrong sending your message. Please try again or email us directly.')
    }
  }

  const infoBlocks = [
    {
      icon: GridUser, label: 'Director', title: 'Director', lines: ['Amit Lakhani'], sub: 'Pioneering adventure since 1998', href: null,
    },
    {
      icon: MapPin, label: 'Head Office Address', title: 'Head Office Address', lines: ['B-309, The One World,', 'Near Ayodhya Chowk, 150 Feet Ring Road,', 'Rajkot - 360 006, Gujarat, India.'], sub: 'Visit us in person', href: c.map_link, hrefLabel: 'View on Map',
    },
    {
      icon: Phone, label: 'Phone Numbers', title: 'Phone Numbers', lines: ['+91 99798 83339', '+91 281 2589090'], sub: 'Mon – Sat · 10 AM to 7 PM', href: null, links: true,
    },
    {
      icon: Mail, label: 'Email Support', title: 'Email Support', lines: ['info@alpineexplorers.com', 'booking@alpineexplorers.com'], sub: "We'll reply within a day", href: null, mails: true,
    },
  ]

  return (
    <div className="min-h-screen relative"
      style={{
        backgroundColor: '#f5ecd8',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, #fbf6ec 0%, #f0e3c5 60%, #e0cda5 100%),
          radial-gradient(#c7af85 0.75px, transparent 0.75px)`,
        backgroundSize: '100% 100%, 28px 28px',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      {/* ═══════════════════ 01 · HERO ═══════════════════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* decorative side trees */}
        <FloatingTree className="absolute left-3 bottom-8 w-14 pointer-events-none" />
        <FloatingTree className="absolute right-4 bottom-24 w-10 pointer-events-none" tone={0.25} />

        {/* floating stickers */}
        <motion.div className="absolute left-[6%] top-16 hidden xl:block pointer-events-none" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ opacity: 0.6 }}>
          <CompassRose size={70} />
        </motion.div>
        <motion.div className="absolute right-[8%] top-24 hidden xl:block pointer-events-none" animate={{ rotate: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity }}>
          <Stamp />
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: 'rgba(18,43,73,0.06)', border: '1px solid rgba(18,43,73,0.15)' }}>
              <Compass size={14} style={{ color: GOLD }} className="animate-spin" />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: NAVY, ...font.body }}>Contact Us</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2" style={{ ...font.vintage, color: NAVY }}>
              CONTACT US
            </h1>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[1.5px] w-20" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
              <span className="text-2xl" style={{ color: GOLD }}>✦</span>
              <div className="h-[1.5px] w-20" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ ...font.vintage, color: NAVY }}>
              Let's Plan Your Next Adventure <span className="italic" style={{ ...font.display, color: GOLD }}>Together!</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[15px] leading-relaxed" style={{ color: BROWN, ...font.body }}>
              Have a question, need help choosing a destination, or want to customize your perfect journey? Our Alpine Explorers team is ready to help.
            </p>
          </motion.div>

          {/* Hero image paper card */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-12">
            <PaperCard className="group" hover={false}>
              <div className="relative h-72 sm:h-96 md:h-[440px] overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=800&fit=crop"
                  alt="Himalayan adventure"
                  className="w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.5) 0%, transparent 45%)' }} />

                {/* corner decorations on the card */}
                <div className="absolute top-4 left-4" style={{ opacity: 0.85 }}>
                  <div className="bg-white/90 backdrop-blur-sm rounded-md px-2.5 py-1.5 rotate-[-3deg]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>
                    <span className="text-[10px] font-bold tracking-widest" style={{ color: NAVY, ...font.vintage }}>THE GREAT HIMALAYA</span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 rotate-[8deg]" style={{ opacity: 0.9 }}>
                  <div className="bg-white/85 backdrop-blur-sm rounded-full px-3 py-1.5" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>
                    <span className="text-[10px] font-bold tracking-widest" style={{ color: RED, ...font.body }}>★ TRUSTED SINCE 1998</span>
                  </div>
                </div>

                {/* CTA overlay */}
                <div className="absolute bottom-6 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                  <motion.a
                    href="#get-in-touch"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm tracking-widest uppercase font-bold"
                    style={{ backgroundColor: GOLD, color: NAVY, ...font.vintage, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'goldGlow 3.2s ease-in-out infinite' }}
                  >
                    Start Your Journey <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                  <a href="tel:+919825213245" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-bold bg-white/90 backdrop-blur-sm"
                    style={{ color: NAVY, ...font.vintage, boxShadow: '0 8px 22px rgba(0,0,0,0.22)' }}>
                    <Phone size={14} style={{ color: GOLD }} /> +91 99798 83339
                  </a>
                </div>
              </div>
            </PaperCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 02 · GET IN TOUCH ═══════════════════ */}
      <section id="get-in-touch" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Reach Out To Us" title="Get In Touch" tagline="Have a question or need help? We're here for you!" rotate={-1} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* LEFT — info card */}
            <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="lg:col-span-2">
              <PaperCard className="p-7 sm:p-8">
                {/* tape decoration */}
                <div className="absolute -top-3 left-1/2 w-16 h-5 rounded-sm opacity-60" style={{ backgroundColor: 'rgba(245,230,196,0.9)', transform: 'translateX(-50%) rotate(-1deg)' }} />

                <div className="flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.18), rgba(212,175,55,0.08))', border: '1px dashed rgba(197,155,39,0.5)' }}>
                    <Route size={22} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ ...font.vintage, color: NAVY }}>Get in Touch</h3>
                    <p className="text-xs" style={{ ...font.script, color: BROWN }}>We reply fast, we promise!</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {infoBlocks.map((b, i) => {
                    const Icon = b.icon
                    return (
                      <motion.div key={b.title} variants={item} className="flex gap-4">
                        <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(18,43,73,0.05)', border: '1px solid rgba(18,43,73,0.1)' }}>
                          <Icon size={20} style={{ color: GOLD }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GOLD, ...font.body }}>{b.label}</p>
                          <h4 className="text-sm font-bold mb-1" style={{ color: NAVY, ...font.vintage }}>{b.title}</h4>
                          {b.lines.map((ln, j) =>
                            b.links ? (
                              <a key={j} href={`tel:+${ln.replace(/\D/g, '')}`}
                                className="block text-[13px] leading-relaxed font-semibold hover:text-[#0d3a80] transition"
                                style={{ color: '#1e3a5f', ...font.body }}>
                                {ln}
                              </a>
                            ) : b.mails ? (
                              <a key={j} href={`mailto:${ln}`}
                                className="block text-[13px] leading-relaxed font-semibold hover:text-[#0d3a80] transition"
                                style={{ color: '#1e3a5f', ...font.body }}>
                                {ln}
                              </a>
                            ) : (
                              <p key={j} className="text-[13px] leading-relaxed" style={{ color: BROWN, ...font.body }}>{ln}</p>
                            )
                          )}
                          {b.href && (
                            <motion.a href={b.href} target="_blank" rel="noopener noreferrer" whileHover={{ x: 3 }}
                              className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold uppercase tracking-widest" style={{ color: NAVY, ...font.body }}>
                              {b.hrefLabel} <ArrowRight size={13} style={{ color: GOLD }} />
                            </motion.a>
                          )}
                          {b.sub && <p className="text-[11px] mt-1" style={{ color: 'rgba(58,42,24,0.6)', ...font.script }}>{b.sub}</p>}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* quote note */}
                <div className="mt-7 p-4 rounded-xl flex items-start gap-3"
                  style={{ backgroundColor: 'rgba(197,155,39,0.08)', border: '1px dashed rgba(197,155,39,0.42)' }}>
                  <Quote size={16} style={{ color: GOLD, flexShrink: 0 }} />
                  <p className="text-[12px] italic leading-relaxed" style={{ color: BROWN, ...font.display }}>
                    "A journey is best measured in friends, not miles."
                  </p>
                </div>
              </PaperCard>
            </motion.div>

            {/* RIGHT — form card */}
            <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="lg:col-span-3">
              <PaperCard className="p-7 sm:p-9" hover={false}>
                <div className="absolute -top-3 left-10 w-14 h-5 rounded-sm opacity-60" style={{ backgroundColor: 'rgba(245,230,196,0.9)', transform: 'rotate(2deg)' }} />

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.18), rgba(212,175,55,0.08))', border: '1px dashed rgba(197,155,39,0.5)' }}>
                    <Send size={20} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>Send Us a Message</h3>
                    <p className="text-xs italic" style={{ color: 'rgba(58,42,24,0.7)', ...font.display }}>
                      Tell us about your dream trip and our team will get back to you.
                    </p>
                  </div>
                </div>

                {status === 'sent' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="py-14 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mx-auto mb-5">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(197,155,39,0.12)', border: '2px dashed rgba(197,155,39,0.55)' }}>
                        <CheckCircle2 size={40} style={{ color: GOLD }} />
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2" style={{ ...font.vintage, color: NAVY }}>Thank You for Reaching Out!</h3>
                    <p className="max-w-sm mx-auto text-sm leading-relaxed" style={{ color: BROWN, ...font.body }}>
                      Our Alpine Explorers team will contact you shortly.
                    </p>
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setStatus('idle')}
                      className="mt-6 px-6 py-2.5 rounded-full text-xs uppercase font-bold tracking-widest"
                      style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage }}>
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Full Name" required icon={User} name="fullName" placeholder="Your full name"
                      value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
                    <Input label="Email Address" required icon={Mail} type="email" name="email" placeholder="you@example.com"
                      value={form.email} onChange={set('email')} error={errors.email} />
                    <Input label="Phone Number" required icon={Phone} type="tel" name="phone" placeholder="+91 9XXXX XXXXX"
                      value={form.phone} onChange={set('phone')} error={errors.phone} />
                    <Input label="Interested Destination" icon={Globe} name="destination" placeholder="e.g. Bali, Kashmir, Sasan Gir"
                      value={form.destination} onChange={set('destination')} />
                    <Select label="Travel Type" value={form.travelType} onChange={set('travelType')}>
                      <option value="">Select travel type</option>
                      {TRAVEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </Select>
                    <Input label="Preferred Travel Date" icon={Calendar} type="date" name="travelDate"
                      value={form.travelDate} onChange={set('travelDate')} />
                    <Input label="Number of Travelers" icon={Users} type="number" min="1" max="100" name="travelers"
                      value={form.travelers} onChange={set('travelers')} />
                    <div className="sm:col-span-2">
                      <Textarea label="Your Message" required name="message" placeholder="Tell us about your dream trip, group size, budget, dates…"
                        rows={5} value={form.message} onChange={set('message')} error={errors.message} />
                    </div>

                    {submitError && (
                      <div className="sm:col-span-2 p-3 rounded-xl text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(139,37,24,0.08)', border: '1px solid rgba(139,37,24,0.25)', color: RED }}>
                        {submitError}
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <motion.button
                        type="submit"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={status === 'sending'}
                        className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm tracking-widest uppercase font-bold disabled:opacity-70"
                        style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage, boxShadow: '0 10px 28px rgba(0,26,77,0.3)', animation: 'goldGlow 3.2s ease-in-out infinite' }}
                      >
                        {status === 'sending' ? (
                          <>Sending…</>
                        ) : (
                          <>Send Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </motion.button>
                      <p className="text-center text-[11px] mt-3" style={{ color: 'rgba(58,42,24,0.55)', ...font.body }}>
                        We usually reply within 24 hours.
                      </p>
                    </div>
                  </form>
                )}
              </PaperCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 04 · CONTACT OPTIONS ═══════════════════ */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionHeading eyebrow="Fastest Ways" title="Contact Options" tagline="Three quick ways to reach our travel experts" rotate={1} />

          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {/* Call */}
            <motion.div variants={item} className="h-full">
              <PaperCard className="p-7 text-center h-full flex flex-col items-center" style={{ overflow: 'visible' }}>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: NAVY, boxShadow: '0 8px 20px rgba(0,26,77,0.35)' }}>
                  <Phone size={22} style={{ color: GOLD2 }} />
                </div>
                <span className="mt-8 text-lg" style={{ ...font.script, color: GOLD }}>CALL US</span>
                <h3 className="text-xl font-bold mb-2 mt-1" style={{ ...font.vintage, color: NAVY }}>Talk to Our Experts</h3>
                <p className="text-[13px] mb-5" style={{ color: BROWN, ...font.body }}>Talk directly with our travel experts</p>
                <div className="flex-1" />
                <a href="tel:+9199798 83339" className="text-xl font-bold mb-4 break-all" style={{ color: '#1e3a5f', ...font.vintage }}>{c.phone}</a>
                <motion.a href="tel:+9199798 83339" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase font-bold tracking-widest mb-5"
                  style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage }}>
                  Call Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" style={{ color: GOLD2 }} />
                </motion.a>
              </PaperCard>
            </motion.div>

            {/* WhatsApp */}
            <motion.div variants={item} className="h-full">
              <PaperCard className="p-7 text-center h-full flex flex-col items-center" style={{ overflow: 'visible' }}>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: '#1f7a4d', boxShadow: '0 8px 20px rgba(31,122,77,0.4)' }}>
                  <MessageCircle size={22} style={{ color: '#fff' }} />
                </div>
                <span className="mt-8 text-lg" style={{ ...font.script, color: GOLD }}>WHATSAPP</span>
                <h3 className="text-xl font-bold mb-2 mt-1" style={{ ...font.vintage, color: NAVY }}>Quick Chat</h3>
                <p className="text-[13px] mb-5" style={{ color: BROWN, ...font.body }}>Quick assistance for your travel plans</p>
                <div className="flex-1" />
                <span className="text-[13px] mb-4" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>
                  Typically responds in a few minutes
                </span>
                <motion.a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase font-bold tracking-widest mb-5"
                  style={{ backgroundColor: '#1f7a4d', color: '#fff', ...font.vintage, boxShadow: '0 8px 22px rgba(31,122,77,0.3)' }}>
                  Chat With Us <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </PaperCard>
            </motion.div>

            {/* Email */}
            <motion.div variants={item} className="h-full">
              <PaperCard className="p-7 text-center h-full flex flex-col items-center" style={{ overflow: 'visible' }}>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: GOLD, boxShadow: '0 8px 20px rgba(197,155,39,0.45)' }}>
                  <Mail size={22} style={{ color: NAVY }} />
                </div>
                <span className="mt-8 text-lg" style={{ ...font.script, color: GOLD }}>EMAIL US</span>
                <h3 className="text-xl font-bold mb-2 mt-1" style={{ ...font.vintage, color: NAVY }}>Write To Us</h3>
                <p className="text-[13px] mb-5" style={{ color: BROWN, ...font.body }}>Send your travel requirements</p>
                <div className="flex-1" />
                <a href="mailto:booking@alpineexplorers.com" className="text-sm font-bold mb-4 leading-relaxed break-all" style={{ color: '#1e3a5f', ...font.body }}>booking@alpineexplorers.com</a>
                <motion.a href="mailto:booking@alpineexplorers.com" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase font-bold tracking-widest mb-5"
                  style={{ backgroundColor: GOLD, color: NAVY, ...font.vintage, boxShadow: '0 8px 22px rgba(197,155,39,0.35)' }}>
                  Email Us <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </PaperCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 05 · LOCATION / MAP ═══════════════════ */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Find Us" title="Visit Our Head Office" tagline="Drop by for a chai and a chat about your next trip" rotate={-1} />

          <PaperCard hover={false} className="p-7 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left — address */}
              <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={item} className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.18), rgba(212,175,55,0.08))', border: '1px dashed rgba(197,155,39,0.5)' }}>
                    <MapPin size={22} style={{ color: RED }} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>Alpine Explorers</h3>
                </motion.div>

                <motion.div variants={item} className="mb-7">
                  <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(18,43,73,0.04)', border: '1px solid rgba(18,43,73,0.08)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GOLD, ...font.body }}>Registered Office</p>
                    <p className="text-[15px] leading-relaxed font-medium" style={{ color: BROWN, ...font.body }}>
                      B-309, The One World,<br />
                      Near Ayodhya Chowk, 150 Feet Ring Road,<br />
                      Rajkot - 360 006, Gujarat, India.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={item} className="flex flex-wrap gap-4 mb-8">
                  <a href="tel:+919825213245" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: NAVY, ...font.body }}>
                    <Phone size={16} style={{ color: GOLD }} /> +91 99798 83339
                  </a>
                  <span className="hidden sm:inline text-sm" style={{ color: 'rgba(58,42,24,0.4)' }}>|</span>
                  <a href="mailto:info@alpineexplorers.com" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: NAVY, ...font.body }}>
                    <Mail size={16} style={{ color: GOLD }} /> info@alpineexplorers.com
                  </a>
                </motion.div>

                <motion.div variants={item}>
                  <NavyBtn href={c.map_link}>
                    Get Directions <Navigation size={15} style={{ color: GOLD2 }} />
                  </NavyBtn>
                </motion.div>
              </motion.div>

              {/* Right — stylized map */}
              <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative">
                <motion.div variants={item} className="relative">
                  <StylizedMap />
                  {/* rotation tape */}
                  <div className="absolute -top-3 left-8 w-16 h-5 rounded-sm opacity-60" style={{ backgroundColor: 'rgba(245,230,196,0.9)', transform: 'rotate(-2deg)' }} />
                  {/* polaroid caption */}
                  <div className="absolute -bottom-4 right-6 rotate-2 bg-white px-3 py-1.5 rounded-sm shadow-md">
                    <span className="text-xs" style={{ ...font.script, color: BROWN }}>Rajkot — our home base</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </PaperCard>
        </div>
      </section>

      {/* ═══════════════════ 06 · TRAVEL CTA BANNER ═══════════════════ */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, margin: '-60px' }}>
            <PaperCard hover={false} className="overflow-hidden">
              <div className="relative min-h-[380px] flex items-center justify-center">
                <motion.img
                  src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1400&h=800&fit=crop"
                  alt="Mountain adventure"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.72) 0%, rgba(0,26,77,0.35) 55%, rgba(0,26,77,0.5) 100%)' }} />

                {/* decorative overlays */}
                <CompassRose size={90} tone={0.35} className="absolute left-6 top-6 pointer-events-none hidden sm:block" />
                <motion.div className="absolute right-8 bottom-8 pointer-events-none hidden sm:block" animate={{ y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} style={{ opacity: 0.55 }}>
                  <Tent size={44} style={{ color: '#f2e6c8' }} />
                </motion.div>
                <motion.div className="absolute left-10 bottom-10 pointer-events-none hidden sm:block" animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ opacity: 0.5 }}>
                  <Backpack size={40} style={{ color: '#f2e6c8' }} />
                </motion.div>
                <FloatingTree className="absolute right-6 top-4 w-12 pointer-events-none hidden sm:block" tone={0.3} />

                <div className="relative z-10 text-center px-6 py-16 max-w-2xl mx-auto">
                  <span className="text-2xl inline-block mb-3" style={{ ...font.script, color: GOLD2 }}>Ready when you are</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white" style={{ ...font.vintage }}>
                    Your Adventure Starts With a Conversation
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: 'rgba(250,245,234,0.9)', ...font.body }}>
                    From international holidays to Himalayan expeditions and customized family adventures, we're ready to create your perfect journey.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <GoldBtn href="#get-in-touch">
                      Plan My Trip <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </GoldBtn>
                    <motion.a href="/services" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs tracking-widest uppercase font-bold"
                      style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                      Contact Us
                    </motion.a>
                  </div>
                </div>
              </div>
            </PaperCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* GridUser — person icon in a subtle frame for the Director block */
function GridUser({ size = 20, style }) {
  return <User size={size} style={style} />
}