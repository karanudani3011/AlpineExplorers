import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePublicContent } from '../services/usePublic'
import { Compass, ArrowRight, Shield, Award, Mountain, Users, CheckCircle, Star, MapPin, Flag, Heart, Eye, Target } from 'lucide-react'
import bniLogo from '../assets/logos/bni.png'
import lvbLogo from '../assets/logos/lvb.png'
import tosgLogo from '../assets/logos/tosg.png'
import utenLogo from '../assets/logos/uten.png'
import jtaLogo from '../assets/logos/jta.png'

function Counter({ to, suffix = '', duration = 2500 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const startTime = performance.now()
    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * to))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, to, duration])

  return (
    <span ref={ref}>
      {value.toLocaleString()}{suffix}
    </span>
  )
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const pillars = [
  {
    icon: Heart,
    title: 'Our Values',
    subtitle: 'Guided by Integrity, Driven by Adventure',
    description: 'We uphold integrity, safety, respect for nature, and a commitment to excellence in everything we do. Our values shape every journey, every decision and every relationship we build.',
    keywords: [['Integrity', 'Safety', 'Respect'], ['Excellence']],
  },
  {
    icon: Eye,
    title: 'Our Vision',
    subtitle: 'To Be a Global Leader in Adventure Tourism',
    description: 'We envision a world where more people explore, experience and connect with nature — creating a positive impact on communities, conservation and the spirit of adventure.',
    keywords: [['Explore', 'Experience', 'Empower']],
  },
  {
    icon: Target,
    title: 'Our Mission',
    subtitle: 'Create Meaningful Journeys, Lasting Impact',
    description: 'Our mission is to design and deliver safe, authentic and sustainable adventure experiences, while promoting responsible tourism, supporting local communities and preserving the natural world.',
    keywords: [['Safe', 'Sustainable', 'Responsible']],
  },
]

const memberships = [
  { abbr: 'BNI', name: 'Bharat Nirman Initiative', logo: bniLogo },
  { abbr: 'LVB', name: 'Local Vendor Bureau', logo: lvbLogo },
  { abbr: 'TOSG', name: 'Tour Operators Sustainable Group', logo: tosgLogo },
  { abbr: 'UTEN', name: 'Uttarakhand Tourism Executive Network', logo: utenLogo },
  { abbr: 'JTA', name: 'Jharkhand Tourism Association', logo: jtaLogo },
]

export default function About() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const { content: about } = usePublicContent('about')

  const FALLBACK_STATS = [
    { label: 'Years of Legacy', value: 28, icon: Flag, detail: 'Operating since 1998', photo: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&h=300&fit=crop', rot: -2.5 },
    { label: 'Happy Explorers', value: 25000, icon: Users, detail: 'Trusted legacy in Gujarat', photo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop', rot: -1 },
    { label: 'Treks & Camps', value: 1200, icon: Mountain, detail: 'From local to Himalayan peaks', photo: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop', rot: 1.5 },
  ]

  const rawStats = (about && about.statistics && about.statistics.length ? about.statistics : []).map((s) => ({
    label: s.label,
    value: typeof s.value === 'number' ? s.value : parseInt(s.value, 10) || 0,
  }))

  const displayStats = rawStats.length > 0
    ? rawStats.slice(0, 3).map((s, i) => ({
        ...s,
        suffix: s.value >= 10000 ? '+k' : '+',
        detail: s.label,
        icon: [Flag, Users, Mountain][i] || Flag,
        photo: FALLBACK_STATS[i]?.photo || FALLBACK_STATS[0].photo,
        rot: [-2.5, -1, 1.5][i] || 0,
      }))
    : FALLBACK_STATS

  const heroStats = displayStats.map((s) => ({ label: s.label, value: s.value, suffix: s.suffix, icon: s.icon }))
  const polaroidStats = displayStats.map((s) => ({ label: s.label, value: s.value, suffix: s.suffix, detail: s.detail, photo: s.photo, rot: s.rot }))

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#f5ecd8',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, #fbf6ec 0%, #f0e3c5 60%, #e0cda5 100%),
          radial-gradient(#c7af85 0.75px, transparent 0.75px)
        `,
        backgroundSize: '100% 100%, 28px 28px',
      }}
    >
      <Navbar />

      {/* Subtle dot texture overlay */}
      <div
        className="pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          position: 'fixed',
          inset: 0,
          boxShadow: 'inset 0 0 200px rgba(78,43,16,0.5)',
          zIndex: 1,
        }}
      />

      <div className="relative" style={{ zIndex: 2 }}>

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Main paper card */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: '#faf5ea',
                  boxShadow: '0 12px 40px rgba(60,40,20,0.15), 0 2px 8px rgba(60,40,20,0.08)',
                  border: '1px solid rgba(180,160,130,0.3)',
                }}
              >
                {/* Swiss stamp — top right */}
                <div className="absolute -top-1 -right-1 z-10 pointer-events-none opacity-70">
                  <svg viewBox="0 0 120 120" className="w-20 h-20 md:w-28 md:h-28" fill="none">
                    <circle cx="60" cy="60" r="54" stroke="#8b2518" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.85" />
                    <circle cx="60" cy="60" r="47" stroke="#8b2518" strokeWidth="1.2" opacity="0.75" />
                    <polygon points="60,35 44,60 76,60" fill="none" stroke="#8b2518" strokeWidth="2" />
                    <polygon points="60,35 54,45 66,45" fill="#8b2518" opacity="0.3" />
                    <polygon points="72,48 84,65 60,65" fill="none" stroke="#8b2518" strokeWidth="1.5" />
                    <path id="aCurveTop" d="M22 60 A38 38 0 0 1 98 60" fill="none" />
                    <text fill="#8b2518" fontSize="8.5" fontWeight="bold" fontFamily="serif" letterSpacing="1.5">
                      <textPath href="#aCurveTop" startOffset="50%" textAnchor="middle">ALPINE SUMMIT</textPath>
                    </text>
                    <text x="60" y="80" textAnchor="middle" fill="#8b2518" fontSize="10" fontWeight="bold" fontFamily="serif">1998</text>
                    <text x="60" y="93" textAnchor="middle" fill="#8b2518" fontSize="6" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">• EST. RAJKOT •</text>
                  </svg>
                </div>

                {/* Hand-drawn route — top left */}
                <div className="absolute top-8 left-8 pointer-events-none opacity-35 z-0">
                  <svg viewBox="0 0 200 60" className="w-44" fill="none">
                    <path d="M10 50 C40 10, 80 55, 120 20 S170 50, 190 15" stroke="#8c5828" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                    <circle cx="10" cy="50" r="3" fill="#ba3322" />
                    <circle cx="190" cy="15" r="3" fill="#1e3a5f" />
                  </svg>
                </div>

                <div className="relative z-10 p-8 md:p-14">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                    style={{ backgroundColor: 'rgba(18,43,73,0.05)', border: '1px solid rgba(18,43,73,0.15)' }}
                  >
                    <Compass size={14} className="text-[#c59b27] animate-spin" style={{ animationDuration: '14s' }} />
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#001a4d]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Est. 1998 · Rajkot, Gujarat
                    </span>
                  </div>

                  {/* Title */}
                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-2"
                    style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}
                  >
                    Our Legacy
                  </h1>

                  {/* Subtitle with gold dividers */}
                  <div className="flex items-center gap-3 mt-2 mb-8">
                    <div className="h-[1.5px] w-10" style={{ background: 'linear-gradient(to right, transparent, rgba(197,155,39,0.7))' }} />
                    <p className="italic text-lg sm:text-xl md:text-2xl font-semibold tracking-wide"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#c59b27' }}
                    >
                      Pioneers of Adventure Tourism in Gujarat
                    </p>
                    <div className="h-[1.5px] w-10" style={{ background: 'linear-gradient(to left, transparent, rgba(197,155,39,0.7))' }} />
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <p className="text-[15px] leading-relaxed" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                      Established in 1998 by pioneering adventure enthusiast{' '}
                      <span className="font-bold" style={{ color: '#001a4d' }}>Amit Lakhani</span>, Alpine Explorers was born
                      out of a profound passion for mountaineering and the great outdoors. Over the past{' '}
                      <span className="font-bold" style={{ color: '#c59b27' }}>28 years</span>, we have grown from a local
                      trekking club in Rajkot into a nationally recognized tourism brand, organizing premium high-altitude
                      expeditions, family camps, and global travel itineraries.
                    </p>
                    <p className="text-[15px] leading-relaxed" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                      We believe adventure is not just about facing the peak; it is about self-discovery, building resilience,
                      and reconnecting with nature. Our journeys are meticulously designed with a double-layered focus on safety,
                      learning, and environmental conservation, ensuring each traveler returns home transformed.
                    </p>
                  </div>

                  {/* Polaroid photo */}
                  <div className="flex justify-center mt-10">
                    <div
                      className="relative bg-white p-2 pb-10 rounded-sm max-w-sm"
                      style={{
                        boxShadow: '0 8px 28px rgba(60,40,20,0.22), 2px 3px 6px rgba(60,40,20,0.12)',
                        transform: 'rotate(-2deg)',
                      }}
                    >
                      <div className="absolute -top-3 left-1/2 w-16 h-5 rounded-sm opacity-60"
                        style={{ backgroundColor: 'rgba(245,230,196,0.8)', transform: 'translateX(-50%) rotate(-1deg)' }}
                      />
                      <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop"
                        alt="Alpine mountain expedition"
                        className="w-full h-52 sm:h-64 object-cover"
                        style={{ borderRadius: '2px' }}
                      />
                      <div className="absolute bottom-3 left-0 right-0 text-center">
                        <span className="text-base tracking-wide" style={{ fontFamily: 'Caveat, cursive', color: '#3a2a18' }}>
                          Into the mountains we go
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Torn paper bottom edge */}
                <div className="pointer-events-none">
                  <svg viewBox="0 0 1440 40" className="w-full h-8" fill="#f4ebd9" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,24 Q1380,36 1320,22 T1200,34 T1080,20 T960,32 T840,18 T720,34 T600,22 T480,34 T360,18 T240,30 T120,20 T0,28 Z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ LEGACY STATS ═══════════════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Hand-drawn divider */}
            <div className="flex justify-center mb-10 pointer-events-none opacity-45">
              <svg viewBox="0 0 500 40" className="w-full max-w-lg" fill="none">
                <path d="M20 30 C80 5, 160 38, 250 15 S400 38, 480 12" stroke="#8c5828" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" opacity="0.5" />
                <circle cx="20" cy="30" r="4" fill="#ba3322" />
                <circle cx="200" cy="22" r="3.5" fill="#1e3a5f" />
                <circle cx="350" cy="18" r="3.5" fill="#1e3a5f" />
                <circle cx="480" cy="12" r="5" fill="#ba3322" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {heroStats.map((s, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="relative rounded-2xl p-7 text-center"
                  style={{
                    backgroundColor: '#faf5ea',
                    boxShadow: '0 8px 28px rgba(60,40,20,0.12), 0 2px 6px rgba(60,40,20,0.06)',
                    border: '1px solid rgba(180,160,130,0.25)',
                  }}
                >
                  {/* Corner accent */}
                  <div className="absolute top-3 right-3 opacity-15 pointer-events-none">
                    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                      <path d="M5 35 L35 5" stroke="#8c5828" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="35" cy="5" r="2" fill="#c59b27" />
                      <circle cx="5" cy="35" r="2" fill="#c59b27" />
                    </svg>
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,175,55,0.10))' }}
                  >
                    <s.icon size={26} style={{ color: '#c59b27' }} strokeWidth={2.2} />
                  </div>

                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                    {s.label}
                  </p>

                  <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(197,155,39,0.3), transparent)' }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ CREDENTIALS & BADGES ═══════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          {/* Subtle texture band */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(237,225,200,0.4), transparent)' }}
          />

          <div className="max-w-5xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-lg tracking-wide" style={{ fontFamily: 'Caveat, cursive', color: '#c59b27' }}>
                Trusted by the Nation
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-1 mb-3"
                style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}
              >
                Credentials & Badges
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1.5px] w-12" style={{ background: 'linear-gradient(to right, transparent, rgba(197,155,39,0.6))' }} />
                <p className="italic text-base md:text-lg" style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(58,42,24,0.7)' }}>
                  National Recognition
                </p>
                <div className="h-[1.5px] w-12" style={{ background: 'linear-gradient(to left, transparent, rgba(197,155,39,0.6))' }} />
              </div>
            </motion.div>

            {/* AirMail sticker — floating */}
            <div className="absolute -top-6 -left-4 md:-left-12 pointer-events-none opacity-45 hidden lg:block"
              style={{ transform: 'rotate(-6deg)' }}
            >
              <div className="relative p-2 shadow-md rounded overflow-hidden" style={{ backgroundColor: '#fef9ee', border: '2px solid #d6cfc0' }}>
                <div
                  className="absolute inset-0 pointer-events-none opacity-70"
                  style={{
                    backgroundImage: `repeating-linear-gradient(-45deg, #1e3a8a 0px, #1e3a8a 8px, transparent 8px, transparent 13px, #b91c1c 13px, #b91c1c 21px, transparent 21px, transparent 26px)`,
                    backgroundSize: '100% 6px',
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'top, bottom',
                  }}
                />
                <div className="rounded px-2.5 py-1 text-center font-bold tracking-widest text-xs flex items-center justify-between relative"
                  style={{ backgroundColor: '#122b49', color: '#fef9ee' }}
                >
                  <span>PAR AVION</span>
                  <span className="text-[9px] opacity-75">1st CLASS</span>
                </div>
                <div className="flex items-center justify-between px-1 text-[9px] font-semibold relative"
                  style={{ fontFamily: 'monospace', color: '#44403c' }}
                >
                  <span>ALPINE EXPRESS</span>
                  <span>VIA AIR MAIL</span>
                </div>
              </div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {/* Card 1 — Presidential Honors */}
              <motion.div
                variants={item}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  backgroundColor: '#faf5ea',
                  boxShadow: '0 10px 36px rgba(60,40,20,0.13), 0 2px 8px rgba(60,40,20,0.06)',
                  border: '1px solid rgba(180,160,130,0.28)',
                }}
              >
                <div className="h-1.5" style={{ background: 'linear-gradient(to right, #c59b27, #d4af37, #c59b27)' }} />
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: 'linear-gradient(135deg, rgba(0,26,77,0.08), rgba(0,26,77,0.03))', border: '1px solid rgba(0,26,77,0.10)' }}
                  >
                    <Award size={30} style={{ color: '#001a4d' }} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-1"
                    style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}
                  >
                    Presidential Honors
                  </h3>
                  <p className="italic text-sm mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#c59b27' }}>
                    Highest National Distinction
                  </p>
                  <p className="text-[13px] md:text-[14px] leading-relaxed flex-1" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                    Awarded for pioneering achievements in adventure sports by the hands of{' '}
                    <span className="font-bold" style={{ color: '#001a4d' }}>President Shri K.R. Narayanan</span>.
                  </p>
                  <div className="mt-5 pt-4" style={{ borderTop: '1px dashed rgba(197,155,39,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(197,155,39,0.10)' }}
                      >
                        <CheckCircle size={16} style={{ color: '#c59b27' }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: 'Inter, sans-serif' }}>
                        Verified Government Recognition
                      </span>
                    </div>
                  </div>
                </div>
                {/* Corner fold */}
                <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-25"
                  style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
                />
              </motion.div>

              {/* Card 2 — Prime Ministerial Honors */}
              <motion.div
                variants={item}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  backgroundColor: '#faf5ea',
                  boxShadow: '0 10px 36px rgba(60,40,20,0.13), 0 2px 8px rgba(60,40,20,0.06)',
                  border: '1px solid rgba(180,160,130,0.28)',
                }}
              >
                <div className="h-1.5" style={{ background: 'linear-gradient(to right, #c59b27, #d4af37, #c59b27)' }} />
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: 'linear-gradient(135deg, rgba(0,26,77,0.08), rgba(0,26,77,0.03))', border: '1px solid rgba(0,26,77,0.10)' }}
                  >
                    <Flag size={30} style={{ color: '#001a4d' }} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-1"
                    style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}
                  >
                    Prime Ministerial Honors
                  </h3>
                  <p className="italic text-sm mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#c59b27' }}>
                    Highest National Distinction
                  </p>
                  <p className="text-[13px] md:text-[14px] leading-relaxed flex-1" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                    Awarded for pioneering achievements in adventure sports by the hands of{' '}
                    <span className="font-bold" style={{ color: '#001a4d' }}>Prime Minister Shri A.B. Vajpayee</span>.
                  </p>
                  <div className="mt-5 pt-4" style={{ borderTop: '1px dashed rgba(197,155,39,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(197,155,39,0.10)' }}
                      >
                        <CheckCircle size={16} style={{ color: '#c59b27' }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: 'Inter, sans-serif' }}>
                        National Appreciation
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-25"
                  style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
                />
              </motion.div>

              {/* Card 3 — NIM */}
              <motion.div
                variants={item}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  backgroundColor: '#faf5ea',
                  boxShadow: '0 10px 36px rgba(60,40,20,0.13), 0 2px 8px rgba(60,40,20,0.06)',
                  border: '1px solid rgba(180,160,130,0.28)',
                }}
              >
                <div className="h-1.5" style={{ background: 'linear-gradient(to right, #001a4d, #1a3a6d, #001a4d)' }} />
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: 'linear-gradient(135deg, rgba(0,26,77,0.08), rgba(0,26,77,0.03))', border: '1px solid rgba(0,26,77,0.10)' }}
                  >
                    <Mountain size={30} style={{ color: '#001a4d' }} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-1"
                    style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}
                  >
                    NIM
                  </h3>
                  <p className="italic text-sm mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#c59b27' }}>
                    Nehru Institute of Mountaineering
                  </p>
                  <p className="text-[13px] md:text-[14px] leading-relaxed flex-1" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                    Our treks are curated and led by veteran mountaineers certified from India&apos;s{' '}
                    <span className="font-bold" style={{ color: '#001a4d' }}>elite mountaineering institution NIM Uttarkashi</span>.
                  </p>
                  <div className="mt-5 pt-4" style={{ borderTop: '1px dashed rgba(197,155,39,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(197,155,39,0.10)' }}
                      >
                        <Shield size={16} style={{ color: '#c59b27' }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: 'Inter, sans-serif' }}>
                        Elite Mountaineering Institution
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-25"
                  style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
                />
              </motion.div>

              {/* Card 4 — SVMI Certified Guides */}
              <motion.div
                variants={item}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  backgroundColor: '#faf5ea',
                  boxShadow: '0 10px 36px rgba(60,40,20,0.13), 0 2px 8px rgba(60,40,20,0.06)',
                  border: '1px solid rgba(180,160,130,0.28)',
                }}
              >
                <div className="h-1.5" style={{ background: 'linear-gradient(to right, #001a4d, #1a3a6d, #001a4d)' }} />
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: 'linear-gradient(135deg, rgba(0,26,77,0.08), rgba(0,26,77,0.03))', border: '1px solid rgba(0,26,77,0.10)' }}
                  >
                    <Shield size={30} style={{ color: '#001a4d' }} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-1"
                    style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}
                  >
                    SVMI Certified Guides
                  </h3>
                  <p className="italic text-sm mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#c59b27' }}>
                    Swami Vivekanand Mountaineering Institute
                  </p>
                  <p className="text-[13px] md:text-[14px] leading-relaxed flex-1" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                    Our treks are curated and led by veteran mountaineers certified from India&apos;s{' '}
                    <span className="font-bold" style={{ color: '#001a4d' }}>elite mountaineering institution SVMI Mount Abu</span>.
                  </p>
                  <div className="mt-5 pt-4" style={{ borderTop: '1px dashed rgba(197,155,39,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(197,155,39,0.10)' }}
                      >
                        <CheckCircle size={16} style={{ color: '#c59b27' }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: 'Inter, sans-serif' }}>
                        Certified Professional Leadership
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-25"
                  style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ OUR VALUES, VISION & MISSION ═══════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section heading with gold lines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[180px]" style={{ background: 'linear-gradient(to right, transparent, rgba(197,155,39,0.7))' }} />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-center"
                  style={{ fontFamily: 'Cinzel, serif', color: '#0B2B5C' }}
                >
                  Our Values, Vision &amp; Mission
                </h2>
                <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[180px]" style={{ background: 'linear-gradient(to left, transparent, rgba(197,155,39,0.7))' }} />
              </div>
            </motion.div>

            {/* 3 premium cards */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {pillars.map((p) => (
                <motion.div
                  key={p.title}
                  variants={item}
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: '#faf5ea',
                    boxShadow: '0 10px 36px rgba(60,40,20,0.13), 0 2px 8px rgba(60,40,20,0.06)',
                    border: '1px solid rgba(180,160,130,0.28)',
                  }}
                >
                  <div className="h-1.5" style={{ background: 'linear-gradient(to right, #c59b27, #d4af37, #c59b27)' }} />
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                      style={{ background: 'linear-gradient(135deg, rgba(0,26,77,0.08), rgba(0,26,77,0.03))', border: '1px solid rgba(0,26,77,0.10)' }}
                    >
                      <p.icon size={30} style={{ color: '#001a4d' }} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-1"
                      style={{ fontFamily: 'Cinzel, serif', color: '#0B2B5C' }}
                    >
                      {p.title}
                    </h3>
                    <p className="italic text-sm mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#c59b27' }}>
                      {p.subtitle}
                    </p>
                    <p className="text-[14px] leading-relaxed flex-1" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                      {p.description}
                    </p>
                    <div className="mt-5 pt-4" style={{ borderTop: '1px dashed rgba(197,155,39,0.3)' }}>
                      {p.keywords.map((line, li) => (
                        <div key={li} className="flex flex-wrap items-center gap-2.5 mt-1 first:mt-0">
                          {line.map((w, wi) => (
                            <span key={w} className="flex items-center gap-2.5">
                              <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: '#001a4d', fontFamily: 'Inter, sans-serif' }}>
                                {w}
                              </span>
                              {wi < line.length - 1 && (
                                <span className="text-[11px]" style={{ color: '#c59b27' }}>•</span>
                              )}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Corner fold */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-25"
                    style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ OUR MEMBERSHIPS ═══════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section heading with gold lines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[180px]" style={{ background: 'linear-gradient(to right, transparent, rgba(197,155,39,0.7))' }} />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-center"
                  style={{ fontFamily: 'Cinzel, serif', color: '#0B2B5C' }}
                >
                  Our Memberships
                </h2>
                <div className="h-[1.5px] flex-1 max-w-[140px] sm:max-w-[180px]" style={{ background: 'linear-gradient(to left, transparent, rgba(197,155,39,0.7))' }} />
              </div>
            </motion.div>

            {/* Large premium membership container */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: '-40px' }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#faf5ea',
                boxShadow: '0 10px 36px rgba(60,40,20,0.13), 0 2px 8px rgba(60,40,20,0.06)',
                border: '1px solid rgba(180,160,130,0.28)',
              }}
            >
              <div className="h-1.5" style={{ background: 'linear-gradient(to right, #c59b27, #d4af37, #c59b27)' }} />
              <div className="p-7 md:p-10">
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* LEFT — heading + description */}
                  <div className="lg:w-[34%] lg:pr-10 lg:border-r lg:border-[rgba(197,155,39,0.22)] flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                      style={{ background: 'linear-gradient(135deg, rgba(0,26,77,0.08), rgba(0,26,77,0.03))', border: '1px solid rgba(0,26,77,0.10)' }}
                    >
                      <Award size={30} style={{ color: '#001a4d' }} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold uppercase mb-2"
                      style={{ fontFamily: 'Cinzel, serif', color: '#0B2B5C' }}
                    >
                      Our Memberships
                    </h3>
                    <p className="italic text-sm md:text-base mb-4"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#c59b27' }}
                    >
                      Associated with Prestigious National &amp; International Bodies
                    </p>
                    <p className="text-[14px] leading-relaxed max-w-md"
                      style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}
                    >
                      We are proud to be associated with leading national and international organizations,
                      which uphold the highest standards in adventure tourism, safety and conservation.
                    </p>
                  </div>

                  {/* RIGHT — 5 real logos in one row */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 lg:gap-y-4 h-full items-start">
                      {memberships.map((m, mi) => (
                        <div
                          key={m.abbr}
                          className="flex flex-col items-center justify-start text-center px-2 lg:border-l h-full"
                          style={mi > 0 ? { borderColor: 'rgba(197,155,39,0.22)' } : undefined}
                        >
                          <div className="mb-3 flex items-center justify-center w-[120px] sm:w-[135px] h-[100px] sm:h-[115px]">
                            <img
                              src={m.logo}
                              alt={`${m.abbr} logo`}
                              loading="lazy"
                              decoding="async"
                              className="max-h-[95px] sm:max-h-[110px] max-w-[120px] sm:max-w-[135px] w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <span className="text-base font-bold uppercase tracking-wide" style={{ fontFamily: 'Cinzel, serif', color: '#0B2B5C' }}>
                            {m.abbr}
                          </span>
                          <span className="text-[11px] leading-snug mt-1" style={{ color: 'rgba(58,42,24,0.65)', fontFamily: 'Inter, sans-serif' }}>
                            {m.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Elegant closing phrase */}
                <div className="border-t pt-6 mt-10 flex justify-center"
                  style={{ borderColor: 'rgba(197,155,39,0.25)' }}
                >
                  <span className="text-2xl" style={{ fontFamily: 'Caveat, cursive', color: '#c59b27' }}>
                    A Record of Trust
                  </span>
                </div>
              </div>
              {/* Corner fold */}
              <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-25"
                style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
              />
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ TRACK RECORD ═══════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-lg tracking-wide" style={{ fontFamily: 'Caveat, cursive', color: '#c59b27' }}>
                A Record of Trust
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-1 mb-3"
                style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}
              >
                Our Track Record
              </h2>
              <p className="italic text-base md:text-lg max-w-2xl mx-auto"
                style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(58,42,24,0.7)' }}
              >
                Numbers That Inspire Absolute Trust
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-14"
            >
              <p className="text-[15px] leading-relaxed" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                With nearly three decades of trekking history, we are honored to have led thousands of explorers into the
                mountains with a <span className="font-bold" style={{ color: '#001a4d' }}>pristine zero-harm record</span>.
              </p>
            </motion.div>

            {/* Polaroid stats */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {polaroidStats.map((s, i) => (
                <motion.div key={i} variants={item} className="flex flex-col items-center">
                  {/* Polaroid */}
                  <motion.div
                    whileHover={{ y: -8, rotate: 0 }}
                    className="relative bg-white p-2.5 pb-14 rounded-sm w-full max-w-[320px] mb-6 cursor-default"
                    style={{
                      boxShadow: '0 10px 32px rgba(60,40,20,0.2), 2px 4px 8px rgba(60,40,20,0.1)',
                      transform: `rotate(${s.rot}deg)`,
                    }}
                  >
                    {/* Tape */}
                    <div className="absolute -top-3 left-1/2 w-14 h-5 rounded-sm opacity-55"
                      style={{
                        backgroundColor: 'rgba(245,230,196,0.8)',
                        transform: `translateX(-50%) rotate(${i === 1 ? 2 : -1}deg)`,
                      }}
                    />
                    <img
                      src={s.photo}
                      alt={s.label}
                      className="w-full h-44 sm:h-52 object-cover"
                      style={{ borderRadius: '2px' }}
                    />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <span className="text-sm" style={{ fontFamily: 'Caveat, cursive', color: '#3a2a18' }}>
                        {s.detail}
                      </span>
                    </div>
                  </motion.div>

                  {/* Numbers */}
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'Cinzel, serif', color: '#001a4d' }}>
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#3a2a18', fontFamily: 'Inter, sans-serif' }}>
                      {s.label}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: 'Inter, sans-serif' }}>
                      {s.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Compass decoration */}
            <div className="absolute top-1/4 right-0 pointer-events-none opacity-25 hidden lg:block">
              <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
                <circle cx="40" cy="40" r="35" stroke="#87582b" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="5" x2="40" y2="75" stroke="#87582b" strokeWidth="0.8" />
                <line x1="5" y1="40" x2="75" y2="40" stroke="#87582b" strokeWidth="0.8" />
                <polygon points="40,8 43,22 37,22" fill="#a72d1d" />
                <polygon points="40,72 43,58 37,58" fill="#2c1d11" />
                <circle cx="40" cy="40" r="3" fill="#c59b27" />
              </svg>
            </div>
          </div>
        </section>

        {/* ═══════════════ ADVENTURE CTA ═══════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Hand-drawn divider */}
            <div className="flex justify-center mb-12 pointer-events-none opacity-40">
              <svg viewBox="0 0 600 40" className="w-full max-w-md" fill="none">
                <path d="M10 20 C100 5, 200 35, 300 15 S500 35, 590 20" stroke="#8c5828" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                <circle cx="10" cy="20" r="3" fill="#ba3322" />
                <circle cx="300" cy="15" r="3" fill="#1e3a5f" />
                <circle cx="590" cy="20" r="3.5" fill="#ba3322" />
              </svg>
            </div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#122b49',
                boxShadow: '0 16px 48px rgba(0,20,60,0.25), 0 4px 12px rgba(0,20,60,0.12)',
              }}
            >
              {/* Map overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
                <svg viewBox="0 0 800 300" className="w-full h-full" fill="none">
                  <ellipse cx="400" cy="150" rx="380" ry="120" stroke="#fff" strokeWidth="0.8" strokeDasharray="4 4" />
                  <line x1="20" y1="150" x2="780" y2="150" stroke="#fff" strokeWidth="0.5" />
                  <line x1="400" y1="20" x2="400" y2="280" stroke="#fff" strokeWidth="0.5" />
                  <path d="M100 280 L200 180 L300 240 L400 140 L500 200 L600 120 L700 220 L800 280 Z" fill="#fff" opacity="0.15" />
                </svg>
              </div>

              {/* Compass */}
              <div className="absolute top-6 right-8 pointer-events-none opacity-20 hidden md:block">
                <Compass size={60} className="text-white animate-spin" style={{ animationDuration: '25s' }} strokeWidth={1} />
              </div>

              <div className="relative z-10 text-center py-14 md:py-20 px-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                  style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <Star size={14} className="text-[#d4af37]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Join the Legacy
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Begin Your Adventure
                </h2>
                <p className="italic text-base md:text-lg max-w-xl mx-auto mb-10"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.7)' }}
                >
                  From the peaks of Uttarkashi to the sands of the Thar — discover journeys crafted with care, courage, and 28 years of mountain wisdom.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.a
                    href="/services"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm sm:text-base tracking-widest uppercase font-bold transition-all duration-300"
                    style={{
                      background: 'linear-gradient(to right, #c59b27, #d4af37)',
                      color: '#122b49',
                      fontFamily: 'Cinzel, serif',
                      boxShadow: '0 8px 24px rgba(197,155,39,0.35)',
                    }}
                  >
                    <span>Explore Our Tours</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300"
                      style={{ backgroundColor: '#122b49', color: '#d4af37' }}
                    >
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                  </motion.a>

                  <motion.a
                    href="/contact"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm sm:text-base tracking-widest uppercase font-bold transition-all duration-300"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid rgba(255,255,255,0.30)',
                      color: '#fff',
                      fontFamily: 'Cinzel, serif',
                    }}
                  >
                    <MapPin size={16} />
                    <span>Contact Us</span>
                  </motion.a>
                </div>

                <p className="mt-8 text-[11px] tracking-wider flex items-center justify-center gap-2 flex-wrap"
                  style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}
                >
                  <span>Zero-Harm Record</span>
                  <span>·</span>
                  <span>NIM Certified Guides</span>
                  <span>·</span>
                  <span>4.9/5 Explorer Rating</span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
