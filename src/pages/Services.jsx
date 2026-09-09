import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Compass, ArrowRight, Globe, MapPin, Mountain, Users, CheckCircle,
  Plane, Building2, FileCheck, Banknote, Heart, Ship, Tent, Trees,
  GraduationCap, TreePine, Waves, Phone, Award, Shield, Map, User,
} from 'lucide-react'
import { usePublicData } from '../services/usePublic'

const ICON_MAP = {
  Plane, Building2, FileCheck, Banknote, Heart, Users, Ship, Tent, Trees,
  TreePine, Mountain, GraduationCap, Globe, Compass, Shield, Award, MapPin, Waves, Map,
}

/* ────────────────────────── Helpers ────────────────────────── */

function Counter({ to, suffix = '', duration = 2500 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let startTime = null
    const step = (now) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * to))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, to, duration])

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
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

function PaperCard({ children, style, className = '', hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : undefined}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: CREAM,
        boxShadow: '0 8px 28px rgba(60,40,20,0.12), 0 2px 6px rgba(60,40,20,0.06)',
        border: '1px solid rgba(180,160,130,0.25)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

function Polaroid({ src, caption, rot = -2, className = '' }) {
  return (
    <div
      className={`relative bg-white p-2 pb-10 rounded-sm ${className}`}
      style={{
        boxShadow: '0 10px 32px rgba(60,40,20,0.2), 2px 4px 8px rgba(60,40,20,0.1)',
        transform: `rotate(${rot}deg)`,
        maxWidth: 320,
      }}
    >
      <div
        className="absolute -top-3 left-1/2 w-14 h-5 rounded-sm opacity-55"
        style={{ backgroundColor: 'rgba(245,230,196,0.85)', transform: 'translateX(-50%) rotate(1deg)' }}
      />
      <img src={src} alt={caption} className="w-full h-40 sm:h-48 object-cover" style={{ borderRadius: '2px' }} />
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

function CoinStamp({ text = 'SINCE 1998', sub = 'ALPINE EXPLORERS' }) {
  return (
    <div
      className="inline-flex flex-col items-center justify-center rounded-full"
      style={{
        width: 110, height: 110, border: '2px dashed rgba(139,37,24,0.7)', color: '#8b2518',
        transform: 'rotate(-8deg)', boxShadow: '0 4px 14px rgba(60,40,20,0.15)',
        backgroundColor: 'rgba(250,245,234,0.85)',
      }}
    >
      <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
        <polygon points="17,4 6,24 28,24" stroke="#8b2518" strokeWidth="2" fill="none" />
        <polygon points="17,4 15,12 19,12" fill="#8b2518" opacity="0.3" />
      </svg>
      <span className="text-[9px] font-bold tracking-widest mt-1" style={{ fontFamily: 'serif' }}>{text}</span>
      <span className="text-[7px] tracking-[0.2em]" style={{ fontFamily: 'sans-serif' }}>{sub}</span>
    </div>
  )
}

/* ────────────────────────── Fallback data (server offline) ────────────────────────── */

const FALLBACK_INTERNATIONAL = [
  { name: 'Thailand & Bangkok', duration: '5N/6D · 7N/8D', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=500&h=360&fit=crop', note: 'Temple trails & night markets' },
  { name: 'Exclusive Europe', duration: 'Multi-Country', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&h=360&fit=crop', note: 'Iconic capitals & heritage rail' },
  { name: 'Bali', duration: '5N/6D · 7N/8D', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&h=360&fit=crop', note: 'Island temples & Ubud valleys' },
  { name: 'Phuket & Krabi', duration: '5N/6D · 7N/8D', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=360&fit=crop', note: 'Long-tails, karsts & coral bays' },
  { name: 'Singapore & Malaysia', duration: '6N/7D · 7N/8D', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&h=360&fit=crop', note: 'Gardens, gleaming towers & straits' },
  { name: 'Sri Lanka', duration: '6N/7D · 7N/8D', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&h=360&fit=crop', note: 'Tea country & ancient cities' },
  { name: 'Maldives', duration: '4N/5D', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&h=360&fit=crop', note: 'Overwater villas & lagoons' },
  { name: 'Lakshadweep', duration: '4N/5D', img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=500&h=360&fit=crop', note: "India's untouched atolls" },
  { name: 'Vietnam', duration: '6N/7D · 9N/10D', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=500&h=360&fit=crop', note: 'Ha Long Bay & lantern towns' },
  { name: 'Baku', duration: '5N/6D · 7N/8D', img: 'https://images.unsplash.com/photo-1583577312971-b7ff2f853f20?w=500&h=360&fit=crop', note: 'Flame towers & Caspian coast' },
  { name: 'Dubai', duration: '5N/6D · 6N/7D', img: 'https://images.unsplash.com/photo-1512453395758-6b78f76b7f0e?w=500&h=360&fit=crop', note: 'Skyline, desert & souks' },
  { name: 'Bhutan', duration: '6N/7D · 9N/10D', img: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=500&h=360&fit=crop', note: "Tiger's Nest & Himalayan valleys" },
  { name: 'Cruise Line', duration: '1N/2D · 2N/3D · 3N/4D', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&h=360&fit=crop', note: 'Open-sea voyages at leisure' },
]

const INCLUSIONS = ['Air Ticket', 'Passport & Visa', 'Pickup & Drop', 'Accommodation', 'Food', 'Sightseeing', 'Guidance']

const FALLBACK_DOMESTIC = [
  { name: 'Kashmir & Himachal', duration: '6N/7D · 7N/8D', img: 'https://images.unsplash.com/photo-1583249598640-3cae04577837?w=500&h=360&fit=crop', note: 'Dal Lake & pine valleys' },
  { name: 'Goa', duration: '6N/7D · 7N/8D', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=360&fit=crop', note: 'Golden sands & old quarters' },
  { name: 'Kerala', duration: '5N/6D · 6N/7D', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=360&fit=crop', note: 'Backwaters & spice hills' },
  { name: 'Andaman', duration: '4N/5D', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=360&fit=crop', note: 'Crystal bays & coral reefs' },
  { name: 'Seven Sisters', duration: '5N/6D · 7N/8D', img: 'https://images.unsplash.com/photo-1589227365533-3f8540e87232?w=500&h=360&fit=crop', note: 'Arunachal · Assam · Meghalaya · Manipur · Mizoram · Nagaland · Tripura' },
  { name: 'Sikkim', duration: '5N/6D · 7N/8D', img: 'https://images.unsplash.com/photo-1587645585583-5b2a1e72d36a?w=500&h=360&fit=crop', note: 'Tsomgo Lake & Kanchenjunga' },
  { name: 'Rajasthan', duration: '5N/6D · 6N/7D', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=360&fit=crop', note: 'Forts, lakes & royal cities' },
  { name: 'Manali – Leh Biking', duration: '8D/7N', img: 'https://images.unsplash.com/photo-1547203664-e4b3a9d1c501?w=500&h=360&fit=crop', note: 'Delhi–Srinagar · 3 Star Hotels/Camps · Inner Line Permit' },
  { name: 'Leh – Ladakh Biking', duration: '7N/8D', img: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&h=360&fit=crop', note: 'Ex. Delhi by Flight · Apr–Oct · Camps & Permits' },
]

const FALLBACK_ADVENTURE = [
  { name: 'Brahmatal Trek', duration: '9D/8N', season: 'December – February', ex: 'Ex. Gujarat / Ex. Delhi', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=360&fit=crop', includes: ['Train', 'Accommodation', 'Food', 'Sightseeing', 'Adventure Activities'] },
  { name: 'Kedarkantha Trek', duration: '9D/8N', season: 'December – February', ex: 'Ex. Gujarat', img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&h=360&fit=crop', includes: ['Train', 'Transportation', 'Food', 'Sightseeing', 'Accommodation', 'Adventure Activities'] },
  { name: 'Chopta – Rishikesh', duration: '9D/8N', season: 'December – February', ex: 'Ex. Gujarat / Ex. Delhi', img: 'https://images.unsplash.com/photo-1506097425191-7ad538b29cef?w=500&h=360&fit=crop', includes: ['Tungnath Mahadev Temple', 'Chandrashila Peak', 'Deoria Tal Lake', 'Adventure Activities', 'Rishikesh Sightseeing'] },
  { name: 'Manali – Kasol Backpacking', duration: '10D/9N', season: 'December – March', ex: 'Ex. Gujarat', img: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=500&h=360&fit=crop', includes: ['Train Transportation', 'Accommodation', 'Food', 'Adventure', 'Sightseeing'] },
  { name: 'Winter Spiti – Himachal', duration: '10D/9N', season: 'Winter Expedition', ex: 'Ex. Delhi', img: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&h=360&fit=crop', includes: ['Transportation', 'Accommodation', 'Food', 'Cold-Desert Guide', 'Inner Line Permit'] },
]

const FALLBACK_WEEKEND = [
  { name: 'Saputara', duration: '3D/2N', tag: 'Every Weekend', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=360&fit=crop', includes: ['Adventure Activities', 'Tent Accommodation', 'Campfire', 'Trekking', 'Transportation', 'Food', 'Games'] },
  { name: 'Beyt Dwarka Marine Camp', duration: '3D/2N · 2D/1N', tag: 'Coastal Camp', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=360&fit=crop', includes: ['Boating', 'Marine Life Exploration', 'Dolphin Spotting', 'Bird Watching', 'Swimming', 'Campfire', 'Beach Trekking', 'Games', 'Star Gazing', 'Night Trekking'] },
  { name: 'Jaisalmer', duration: '4N/3D', tag: 'Ex. Ahmedabad', img: 'https://images.unsplash.com/photo-1521133573892-e44906baee46?w=500&h=360&fit=crop', includes: ['AC Transportation', 'Swiss Tent', 'Food', 'Sightseeing', 'Jeep Safari', 'Camel Safari', 'Haunted Village', 'Tanot Mata Temple', 'Campfire', 'DJ', 'Longewala Post', 'Guide Charges'] },
]

const FALLBACK_SERVICES = [
  { icon: 'Plane', title: 'Airline Booking', desc: 'Domestic & international flight reservations' },
  { icon: 'Building2', title: 'Hotel & Resort Booking', desc: 'Curated stays across every budget' },
  { icon: 'FileCheck', title: 'Passport & Visa Assistance', desc: 'Complete documentation guidance' },
  { icon: 'Banknote', title: 'Forex / Money Transfer', desc: 'Best forex rates & safe transfers' },
  { icon: 'Heart', title: 'Honeymoon Packages', desc: 'Romantic escapes crafted for two' },
  { icon: 'Users', title: 'Customized Family Packages', desc: 'Tailor-made journeys for families' },
  { icon: 'Ship', title: 'Cruise Booking', desc: 'Luxury cruise itineraries worldwide' },
]

const FALLBACK_CAMPING = [
  { name: 'Gir Lion Sanctuary', duration: '2N/3D', location: 'Sasan Gir, Gujarat', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&h=360&fit=crop', note: 'The only habitat of the Asiatic Lion', tagline: 'November – March', section: 'gir' },
  { name: 'Pirotan Island Camp', duration: '2D/1N', location: 'Jamnagar, Gujarat', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=500&h=360&fit=crop', note: 'Marine nature study across the reef flats', tagline: 'December – February', section: 'marine' },
  { name: 'Narara Island Camp', duration: '2D/1N', location: 'Jamnagar, Gujarat', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=360&fit=crop', note: 'Dolphin spotting & marine exploration', tagline: 'December – February', section: 'marine' },
  { name: 'Family Camping', duration: '1N/2D', location: 'Gujarat', img: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=380&fit=crop', note: 'One tent per family, sleeping bags & camping setup', tagline: 'All seasons', section: 'family' },
]

const familyServices = ['Family Tours', 'Family Camping', 'Weekend Camps', 'Nature Camps', 'School Tours', 'College Tours', 'Group Picnics']

/* ────────────────────────── Page ────────────────────────── */

const fallbackData = {
  international: FALLBACK_INTERNATIONAL,
  domestic: FALLBACK_DOMESTIC,
  adventure: FALLBACK_ADVENTURE,
  weekend: FALLBACK_WEEKEND,
  camping: FALLBACK_CAMPING,
  services: FALLBACK_SERVICES,
}

const mapInternational = (items) => items.map((p) => ({ name: p.destination, duration: p.duration, img: p.image, note: p.short_description }))
const mapDomestic = (items) => items.map((p) => ({ name: p.destination, duration: p.duration, img: p.image, note: p.short_description }))
const mapAdventure = (items) => items.map((p) => ({ name: p.title, duration: p.duration, season: p.season, ex: p.ex, img: p.image, includes: Array.isArray(p.includes) ? p.includes : [] }))
const mapWeekendFromCamping = (items) => {
  const weekendNames = ['Saputara', 'Beyt Dwarka', 'Jaisalmer']
  return items
    .filter((c) => weekendNames.some((n) => c.title?.includes(n)))
    .map((c) => ({ name: c.title, duration: c.duration, tag: c.season || 'Weekend', img: c.image, includes: Array.isArray(c.activities) ? c.activities : [] }))
}
const mapCampingForGirMarine = (items) => {
  const gms = ['Gir', 'Pirotan', 'Narara', 'Family']
  return items
    .filter((c) => gms.some((n) => c.title?.includes(n)))
    .map((c) => ({ name: c.title, duration: c.duration, location: c.location, img: c.image, note: c.description?.slice(0, 90), tagline: c.season, section: c.title?.includes('Gir') ? 'gir' : 'marine' }))
}
const mapServicesFromApi = (items) => items.map((s) => ({ icon: s.icon || 'Compass', title: s.title, desc: s.description }))

export default function Services() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const { data: apiData } = usePublicData(fallbackData)

  const international = mapInternational(apiData.international || fallbackData.international)
  const domestic = mapDomestic(apiData.domestic || fallbackData.domestic)
  const adventure = mapAdventure(apiData.adventure || fallbackData.adventure)
  const weekend = mapWeekendFromCamping(apiData.camping || []).length > 0
    ? mapWeekendFromCamping(apiData.camping || [])
    : fallbackData.weekend
  const camping = mapCampingForGirMarine(apiData.camping || []).length > 0
    ? mapCampingForGirMarine(apiData.camping || [])
    : fallbackData.camping
  const services = mapServicesFromApi(apiData.services || fallbackData.services)

  const girCamp = camping.find((c) => c.section === 'gir')
  const marineCamps = camping.filter((c) => c.section === 'marine')

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

      {/* Sepia vignette */}
      <div className="pointer-events-none opacity-20 mix-blend-multiply" style={{ position: 'fixed', inset: 0, boxShadow: 'inset 0 0 200px rgba(78,43,16,0.5)', zIndex: 1 }} />

      <div className="relative" style={{ zIndex: 2 }}>

        {/* ══════════════════ 01 · SERVICES HERO ══════════════════ */}
        <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <PaperCard style={{ border: '1px solid rgba(180,160,130,0.3)', boxShadow: '0 12px 40px rgba(60,40,20,0.15)' }}>
                {/* Stamps */}
                <div className="absolute -top-1 -right-1 z-10 pointer-events-none opacity-75">
                  <CoinStamp text="ALPINE 1998" sub="EXPLORERS" />
                </div>
                <div className="absolute top-8 left-8 pointer-events-none opacity-35 z-0">
                  <HandRoute className="w-44" tone={0.4} />
                </div>

                <div className="relative z-10 p-8 md:p-14 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                    style={{ backgroundColor: 'rgba(18,43,73,0.05)', border: '1px solid rgba(18,43,73,0.15)' }}
                  >
                    <Compass size={14} className="text-[#c59b27] animate-spin" style={{ animationDuration: '14s' }} />
                    <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: NAVY, ...font.body }}>
                      Alpine Explorers · Est. 1998
                    </span>
                  </div>

                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-3"
                    style={{ ...font.vintage, color: NAVY }}
                  >
                    Explore. Adventure. <span style={{ color: GOLD2 }}>Experience.</span>
                  </h1>

                  <p className="italic text-lg sm:text-xl md:text-2xl font-semibold tracking-wide mb-6" style={{ ...font.display, color: GOLD }}>
                    Discover unforgettable journeys with Alpine Explorers
                  </p>

                  <p className="text-[15px] leading-relaxed max-w-2xl mx-auto" style={{ color: BROWN, ...font.body }}>
                    From international holidays and family tours to Himalayan expeditions, adventure trekking, wildlife camps
                    and customized travel packages — Alpine Explorers has been creating memorable journeys since{' '}
                    <span className="font-bold" style={{ color: NAVY }}>1998</span>.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <a href="#international" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300"
                      style={{ background: 'linear-gradient(to right, #c59b27, #d4af37)', color: NAVY, ...font.vintage, boxShadow: '0 8px 24px rgba(197,155,39,0.35)' }}
                    >
                      <Globe size={15} /> Explore International
                    </a>
                    <a href="#domestic" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300"
                      style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage, boxShadow: '0 8px 24px rgba(0,26,77,0.3)' }}
                    >
                      <MapPin size={15} /> Explore Domestic
                    </a>
                  </div>
                </div>

                {/* Torn edge */}
                <div className="pointer-events-none">
                  <svg viewBox="0 0 1440 40" className="w-full h-8" fill="#f4ebd9" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,24 Q1380,36 1320,22 T1200,34 T1080,20 T960,32 T840,18 T720,34 T600,22 T480,34 T360,18 T240,30 T120,20 T0,28 Z" />
                  </svg>
                </div>
              </PaperCard>

              {/* Hero photo strip — Polaroids */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 -mt-6"
              >
                <Polaroid src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" caption="High-altitude mountain expeditions" rot={-4} />
                <div className="hidden md:block"><Polaroid src="https://images.unsplash.com/photo-1537225228614-b2fa3a0ff0ff?w=400&h=300&fit=crop" caption="Beach & island escapes" rot={2} /></div>
                <div className="hidden lg:block"><Polaroid src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop" caption="Adventure trekking camps" rot={-1} /></div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ 02 · INTERNATIONAL ══════════════════ */}
        <section id="international" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeading eyebrow="Go Beyond Borders" title="International Tours" tagline="Explore the World With Alpine Explorers" />

            <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
            >
              {international.map((p, i) => (
                <motion.div key={i} variants={item}>
                  <PaperCard>
                    {/* Gold top strip */}
                    <div className="h-1" style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD2}, ${GOLD})` }} />
                    <div className="relative h-40 overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 pointer-events-none" style={{ transform: 'rotate(-4deg)' }}>
                        <CoinStamp text={p.duration.split('·')[0].trim()} sub="PACKAGE" />
                        <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', marginTop: 20, marginLeft: 5 }}>
                          <CoinStamp text="INCL ALL" sub="SERVICES" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold" style={{ ...font.vintage, color: NAVY }}>{p.name}</h3>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD, ...font.body }}>{p.duration}</p>
                      <p className="text-xs mb-3" style={{ color: 'rgba(58,42,24,0.65)', ...font.body }}>{p.note}</p>
                      <ul className="space-y-1 mb-4">
                        {INCLUSIONS.map((inc) => (
                          <li key={inc} className="flex items-center gap-2 text-[12px]" style={{ color: BROWN, ...font.body }}>
                            <CheckCircle size={13} style={{ color: GOLD }} /> {inc}
                          </li>
                        ))}
                      </ul>
                      <a href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-all"
                        style={{ color: NAVY, ...font.body }}
                      >
                        View Package <ArrowRight size={14} style={{ color: GOLD }} />
                      </a>
                    </div>
                    {/* Corner fold */}
                    <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none opacity-20"
                      style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
                    />
                  </PaperCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Customized international banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="mt-10 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
              style={{ backgroundColor: '#122b49', boxShadow: '0 16px 48px rgba(0,20,60,0.25)' }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
                <svg viewBox="0 0 800 200" className="w-full h-full" fill="none">
                  <ellipse cx="400" cy="100" rx="380" ry="80" stroke="#fff" strokeWidth="0.8" strokeDasharray="4 4" />
                  <path d="M100 200 L240 110 L340 160 L400 70 L500 120 L560 60 L700 150 L800 200 Z" fill="#fff" opacity="0.15" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ ...font.vintage }}>
                  Customized International Packages Available
                </h3>
                <a href="/contact" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300 mt-5"
                  style={{ background: 'linear-gradient(to right, #c59b27, #d4af37)', color: NAVY, ...font.vintage, boxShadow: '0 8px 24px rgba(197,155,39,0.4)' }}
                >
                  Plan Your Journey <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ 03 · DOMESTIC ══════════════════ */}
        <section id="domestic" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(237,225,200,0.5), transparent)' }} />

            <div className="relative">
              <SectionHeading eyebrow="Discover India" title="Domestic Tours" tagline="India With Alpine Explorers" rotate={-1} />

              <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                {domestic.map((p, i) => (
                  <motion.div key={i} variants={item}>
                    <PaperCard>
                      <div className="h-1" style={{ background: `linear-gradient(to right, ${NAVY}, #1a3a6d, ${NAVY})` }} />
                      <div className="relative h-40 overflow-hidden">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 h-16" style={{ background: 'linear-gradient(to top, rgba(18,43,73,0.65), transparent)' }} />
                        <div className="absolute bottom-2 left-3 right-3">
                          <p className="text-xs font-semibold" style={{ color: '#fff', ...font.body }}>{p.note}</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold" style={{ ...font.vintage, color: NAVY }}>{p.name}</h3>
                        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD, ...font.body }}>{p.duration}</p>
                        <ul className="space-y-1 mb-4">
                          {INCLUSIONS.map((inc) => (
                            <li key={inc} className="flex items-center gap-2 text-[12px]" style={{ color: BROWN, ...font.body }}>
                              <CheckCircle size={13} style={{ color: GOLD }} /> {inc}
                            </li>
                          ))}
                        </ul>
                        <a href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                          style={{ color: NAVY, ...font.body }}
                        >
                          View Details <ArrowRight size={14} style={{ color: GOLD }} />
                        </a>
                      </div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none opacity-20"
                        style={{ background: 'linear-gradient(135deg, transparent 50%, #d4c3a4 50%)' }}
                      />
                    </PaperCard>
                  </motion.div>
                ))}

                {/* Featured destinations CTA card */}
                <motion.div variants={item}>
                  <PaperCard className="p-6 flex flex-col items-center justify-center text-center min-h-[300px]" style={{ backgroundColor: '#122b49' }}>
                    <Map size={34} style={{ color: GOLD2 }} />
                    <h3 className="text-xl font-bold text-white mt-4 mb-2" style={{ ...font.vintage }}>
                      Customized Domestic Packages Available
                    </h3>
                    <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.7)', ...font.body }}>
                      Goa · Kerala · Kashmir · Himachal · Andaman · Sikkim · Rajasthan — packaged your way.
                    </p>
                    <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-bold"
                      style={{ background: 'linear-gradient(to right, #c59b27, #d4af37)', color: NAVY, ...font.vintage }}
                    >
                      Plan Your Journey <ArrowRight size={14} />
                    </a>
                  </PaperCard>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ 04 · ADVENTURE TREKKING ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Dare To Win badge */}
            <div className="flex justify-center mb-6">
              <div className="px-6 py-2 rounded-full font-bold uppercase tracking-[0.3em] text-sm"
                style={{
                  backgroundColor: '#8b2518', color: '#f6eedb',
                  boxShadow: '0 6px 20px rgba(139,37,24,0.35)', transform: 'rotate(-2deg)',
                  ...font.vintage,
                }}
              >
                Dare To Win
              </div>
            </div>

            <SectionHeading eyebrow="For The Brave" title="Adventure Trekking & Expeditions" tagline="Himalayan trails for adventurers, students & trekkers" />

            <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {adventure.map((p, i) => (
                <motion.div key={i} variants={item}>
                  <PaperCard>
                    <div className="h-1" style={{ background: 'linear-gradient(to right, #8b2518, #a72d1d, #8b2518)' }} />
                    <div className="relative h-44 overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                        style={{ backgroundColor: 'rgba(18,43,73,0.85)', color: '#f6eedb', ...font.body }}
                      >
                        {p.ex}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold" style={{ ...font.vintage, color: NAVY }}>{p.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD, ...font.body }}>{p.duration}</span>
                        <span className="text-[10px]" style={{ color: 'rgba(58,42,24,0.55)', ...font.body }}>· {p.season}</span>
                      </div>
                      <ul className="space-y-1 mb-4">
                        {p.includes.map((inc) => (
                          <li key={inc} className="flex items-center gap-2 text-[12px]" style={{ color: BROWN, ...font.body }}>
                            <CheckCircle size={13} style={{ color: '#a72d1d' }} /> {inc}
                          </li>
                        ))}
                      </ul>
                      <a href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                        style={{ color: '#8b2518', ...font.body }}
                      >
                        View Package <ArrowRight size={14} style={{ color: '#a72d1d' }} />
                      </a>
                    </div>
                  </PaperCard>
                </motion.div>
              ))}

              {/* Adventure camps card */}
              <motion.div variants={item}>
                <PaperCard className="p-6 flex flex-col justify-center min-h-[300px] text-center" style={{ backgroundColor: '#122b49' }}>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Mountain size={28} style={{ color: GOLD2 }} />
                    <Tent size={28} style={{ color: GOLD2 }} />
                    <TreePine size={28} style={{ color: GOLD2 }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1" style={{ ...font.vintage }}>Adventure Trekking Camps</h3>
                  <p className="text-sm font-bold uppercase tracking-widest mt-1 mb-1" style={{ color: GOLD2, ...font.body }}>
                    Manali · Mussoorie · Dalhousie
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)', ...font.body }}>April – May</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-5">
                    {['Rock Climbing', 'Rappelling', 'Snow Craft', 'Paragliding', 'Rafting', 'Trekking', 'Sports'].map((a) => (
                      <span key={a} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                        style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', ...font.body }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="mx-auto px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.25em] text-xs"
                    style={{ backgroundColor: '#8b2518', color: '#f6eedb', transform: 'rotate(-1deg)', ...font.vintage }}
                  >
                    Dare To Win
                  </div>
                </PaperCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ 05 · FAMILY TOURS & CAMPING ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="Together Again" title="Family Adventure & Camping" tagline="Warm escapes for every generation" rotate={1} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Services chips card */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <PaperCard className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,175,55,0.10))' }}
                  >
                    <Users size={30} style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ ...font.vintage, color: NAVY }}>Our Family Services</h3>
                  <div className="flex flex-wrap gap-3">
                    {familyServices.map((s) => (
                      <span key={s} className="px-4 py-2 rounded-full text-sm font-semibold"
                        style={{ backgroundColor: 'rgba(18,43,73,0.06)', border: '1px solid rgba(18,43,73,0.12)', color: NAVY, ...font.body }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 pt-5 border-t border-dashed" style={{ borderColor: 'rgba(197,155,39,0.3)' }}>
                    <div className="flex items-start gap-3">
                      <Heart size={20} style={{ color: GOLD }} className="flex-shrink-0 mt-0.5" />
                      <p className="text-sm" style={{ color: BROWN, ...font.body }}>
                        One tent per family, sleeping bags and a comfortable camping setup — designed for families, school groups and friends alike.
                      </p>
                    </div>
                  </div>
                </PaperCard>
              </motion.div>

              {/* Family camping card */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
                <PaperCard>
                  <div className="relative h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=380&fit=crop" alt="Family camping" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                      style={{ backgroundColor: 'rgba(18,43,73,0.85)', color: '#f6eedb', ...font.body }}
                    >
                      Family Camping · 1 Night / 2 Days
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3" style={{ ...font.vintage, color: NAVY }}>Activities Included</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Lion Spotting', 'Wildlife Awareness', 'Crocodile Breeding Centre', 'Museum Visit', 'Wildlife Film Show', 'Campfire', 'Jeep Safari (optional)'].map((a) => (
                        <span key={a} className="flex items-center gap-2 text-[13px]" style={{ color: BROWN, ...font.body }}>
                          <CheckCircle size={13} style={{ color: GOLD }} /> {a}
                        </span>
                      ))}
                    </div>
                    <a href="/contact" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-bold mt-5"
                      style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage, boxShadow: '0 6px 20px rgba(0,26,77,0.25)' }}
                    >
                      Plan Your Family Adventure <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </PaperCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ 06 · NATURE & WILDLIFE (GIR) ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="Gir Lion Sanctuary" title="Nature & Wildlife Experiences" tagline={`${girCamp?.location || 'Sasan Gir'} · ${girCamp?.duration || '2 Nights / 3 Days'}`} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Photo collage */}
              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4">
                <Polaroid src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&h=360&fit=crop" caption="Only home of the Asiatic Lion" rot={-3} className="w-full max-w-md" />
                <div className="flex gap-4 w-full max-w-md justify-center">
                  <div className="w-1/2"><Polaroid src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop" caption="Jungle trek & bird watching" rot={2} /></div>
                  <div className="w-1/2"><Polaroid src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop" caption="Campfire evenings" rot={-1} /></div>
                </div>
              </motion.div>

              {/* Details card */}
              <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <PaperCard className="p-8">
                  <h3 className="text-2xl font-bold mb-3" style={{ ...font.vintage, color: NAVY }}>{girCamp?.name || 'Gir Lion Sanctuary'}</h3>
                  <p className="text-sm mb-5 leading-relaxed" style={{ color: BROWN, ...font.body }}>
                    The only habitat of the magnificent <span className="font-bold" style={{ color: NAVY }}>Asiatic Lion</span>, Sasan Gir is a paradise for nature and wildlife lovers.
                  </p>

                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD, ...font.body }}>Activities</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-5">
                    {['Lion Spotting', 'Bird Watching', 'Jungle Trek', 'Wildlife & Nature Awareness', 'Crocodile Breeding Centre', 'Museum', 'Wildlife Film Show', 'Maldhari Nes Visit', 'Local Flora & Fauna', 'Nature Quiz', 'Campfire'].map((a) => (
                      <span key={a} className="flex items-center gap-2 text-[13px]" style={{ color: BROWN, ...font.body }}>
                        <CheckCircle size={13} style={{ color: GOLD }} /> {a}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD, ...font.body }}>Accommodation & Food</p>
                  <ul className="space-y-1 mb-5 text-[13px]" style={{ color: BROWN, ...font.body }}>
                    <li>• Clean & spacious Alpine tents · 4–6 persons per tent</li>
                    <li>• Separate accommodation for girls and boys</li>
                    <li>• Sleeping bags provided</li>
                    <li>• Vegetarian, nutritious and hygienic food</li>
                  </ul>

                  <div className="p-3 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: 'rgba(197,155,39,0.08)', border: '1px dashed rgba(197,155,39,0.4)' }}
                  >
                    <Award size={20} style={{ color: GOLD }} />
                    <p className="text-sm font-semibold" style={{ color: NAVY, ...font.body }}>
                      Participants who complete the camp receive certificates of merit.
                    </p>
                  </div>
                </PaperCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ 07 · MARINE NATURE ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center mb-10">
              <span className="text-xl tracking-wide" style={{ ...font.script, color: GOLD }}>A Lifelong Marine Adventure</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-1 mb-2 text-center" style={{ ...font.vintage, color: NAVY }}>
                Marine Nature Study Camps
              </h2>
              <p className="text-sm sm:text-base font-semibold text-center" style={{ color: '#1e3a5f', ...font.body }}>
                {marineCamps.map((c) => c.name).join(' & ') || 'Pirotan Island & Narara Island'} — Jamnagar · {marineCamps[0]?.tagline || 'December – February'} · {marineCamps[0]?.duration || '2 Days / 1 Night'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="bg-[#122b49] rounded-2xl p-8 md:p-10"
                style={{ boxShadow: '0 12px 40px rgba(0,20,60,0.22)' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <Waves size={30} style={{ color: '#8ecde0' }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ ...font.vintage }}>
                  Explore the Inter-Tidal Wonderland
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Marine Life Exploration', 'Coral Observation', 'Jellyfish', 'Sea Anemones', 'Octopus', 'Turtles', 'Puffer Fish', 'Dolphins', 'Migratory Birds', 'Beach Trekking', 'Nature Study', 'Island Exploration'].map((a) => (
                    <span key={a} className="flex items-center gap-2 text-[13px]" style={{ color: '#e6f2f7', ...font.body }}>
                      <CheckCircle size={13} style={{ color: '#8ecde0' }} /> {a}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)', ...font.body }}>
                    A rare opportunity to walk the reef flats at low tide across India's Gulf of Kutch islands.
                  </p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4">
                <Polaroid src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=500&h=360&fit=crop" caption="Pirotan Island reef flats" rot={-2} className="w-full max-w-md" />
                <Polaroid src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=360&fit=crop" caption="Narara Island · Jamnagar" rot={1} className="w-full max-w-md" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ 08 · GUJARAT WEEKEND ADVENTURES ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeading eyebrow="Quick Escapes" title="Gujarat Weekend Adventures" tagline="Jungle, coast & desert — all within a weekend" rotate={-1}/>

            <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-7"
            >
              {weekend.map((p, i) => (
                <motion.div key={i} variants={item}>
                  <PaperCard>
                    <div className="relative h-44 overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                        style={{ backgroundColor: 'rgba(18,43,73,0.85)', color: '#f6eedb', ...font.body }}
                      >
                        {p.tag}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold" style={{ ...font.vintage, color: NAVY }}>{p.name}</h3>
                      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD, ...font.body }}>{p.duration}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.includes.map((inc) => (
                          <span key={inc} className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{ backgroundColor: 'rgba(18,43,73,0.05)', border: '1px solid rgba(18,43,73,0.1)', color: NAVY, ...font.body }}
                          >
                            {inc}
                          </span>
                        ))}
                        {p.name === 'Beyt Dwarka Marine Camp' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{ backgroundColor: 'rgba(139,37,24,0.08)', border: '1px solid rgba(139,37,24,0.2)', color: '#8b2518', ...font.body }}
                          >
                            Scuba Diving — excluded
                          </span>
                        )}
                      </div>
                      <a href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                        style={{ color: NAVY, ...font.body }}
                      >
                        View Package <ArrowRight size={14} style={{ color: GOLD }} />
                      </a>
                    </div>
                  </PaperCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ 09 · SCHOOL, COLLEGE & GROUP ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="For Institutions" title="Educational & Group Adventure Tours" tagline="Learning beyond the classroom" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <PaperCard className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,175,55,0.10))' }}
                  >
                    <GraduationCap size={30} style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ ...font.vintage, color: NAVY }}>School & College Picnics</h3>
                  <p className="text-sm mb-5" style={{ color: BROWN, ...font.body }}>
                    Available for <span className="font-bold" style={{ color: NAVY }}>Schools, Colleges, Institutions and Social Groups</span> — at nature destinations across Gujarat.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {['Transportation', 'Food', 'Adventure Activities', 'Nature Study', 'Trekking', 'Games', 'Camping', 'Educational Activities'].map((a) => (
                      <span key={a} className="flex items-center gap-2 text-[13px]" style={{ color: BROWN, ...font.body }}>
                        <CheckCircle size={13} style={{ color: GOLD }} /> {a}
                      </span>
                    ))}
                  </div>
                  <a href="tel:+919979883339" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-bold mt-6"
                    style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage, boxShadow: '0 6px 20px rgba(0,26,77,0.25)' }}
                  >
                    Plan a Group Trip <Phone size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </PaperCard>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4">
                <Polaroid src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=360&fit=crop" caption="Group treks & nature study" rot={-3} className="w-full max-w-md" />
                <Polaroid src="https://images.unsplash.com/photo-1543536448-1e76fc2795bf?w=500&h=360&fit=crop" caption="Adventure activities & games" rot={1} className="w-full max-w-md" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════ 10 · SPECIAL TRAVEL SERVICES ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="Everything Under One Roof" title="Complete Travel Solutions" tagline="Special travel services by Alpine Explorers" />

            <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {services.map((s, i) => {
                const SvcIcon = ICON_MAP[s.icon] || Compass
                return (
                <motion.div key={i} variants={item}>
                  <PaperCard className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-3"
                      style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,175,55,0.10))' }}
                    >
                      <SvcIcon size={26} style={{ color: GOLD }} />
                    </div>
                    <h3 className="text-sm font-bold leading-tight" style={{ ...font.vintage, color: NAVY }}>{s.title}</h3>
                    <p className="text-[11px] mt-1" style={{ color: 'rgba(58,42,24,0.65)', ...font.body }}>{s.desc}</p>
                  </PaperCard>
                </motion.div>
                )
              })}

              {/* Extra service chips */}
              <PaperCard className="p-6 text-center flex flex-col items-center justify-center">
                <Tent size={26} style={{ color: GOLD }} className="mb-2" />
                <h3 className="text-sm font-bold" style={{ ...font.vintage, color: NAVY }}>Family Tours & Camping</h3>
              </PaperCard>
              <PaperCard className="p-6 text-center flex flex-col items-center justify-center">
                <GraduationCap size={26} style={{ color: GOLD }} className="mb-2" />
                <h3 className="text-sm font-bold" style={{ ...font.vintage, color: NAVY }}>School & College Tours</h3>
              </PaperCard>
              <motion.div variants={item}>
                <PaperCard className="p-6 text-center flex flex-col items-center justify-center" style={{ backgroundColor: '#122b49' }}>
                  <Users size={26} style={{ color: GOLD2 }} className="mb-2" />
                  <h3 className="text-sm font-bold text-white" style={{ ...font.vintage }}>Group Tours</h3>
                </PaperCard>
              </motion.div>
            </motion.div>

            {/* Contact strip */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-10 rounded-2xl p-6 md:p-8 text-center"
              style={{ backgroundColor: 'rgba(197,155,39,0.10)', border: '1.5px dashed rgba(197,155,39,0.45)' }}
            >
              <p className="text-xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                Need help planning every mile?{' '}
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full ml-2 align-middle"
                  style={{ backgroundColor: NAVY, color: '#fff', ...font.body, fontSize: 13 }}
                >
                  <Phone size={13} /> M: 99798 83339
                </span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ 11 · CUSTOMIZED PACKAGE ══════════════════ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#122b49', boxShadow: '0 16px 48px rgba(0,20,60,0.28)' }}
            >
              {/* Map art bg */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
                <svg viewBox="0 0 900 300" className="w-full h-full" fill="none">
                  <ellipse cx="450" cy="150" rx="430" ry="130" stroke="#fff" strokeWidth="0.8" strokeDasharray="4 4" />
                  <line x1="30" y1="150" x2="870" y2="150" stroke="#fff" strokeWidth="0.5" />
                  <line x1="450" y1="20" x2="450" y2="280" stroke="#fff" strokeWidth="0.5" />
                  <path d="M120 300 L260 170 L370 240 L460 110 L560 180 L640 90 L760 210 L900 300 Z" fill="#fff" opacity="0.18" />
                </svg>
              </div>
              {/* Decor */}
              <div className="absolute top-6 left-6 hidden md:block" style={{ transform: 'rotate(-6deg)' }}>
                <Compass size={46} style={{ color: GOLD2, opacity: 0.8 }} />
              </div>
              <div className="absolute bottom-6 right-6 hidden md:block">
                <Plane size={40} style={{ color: GOLD2, opacity: 0.6 }} />
              </div>

              <div className="relative z-10 text-center py-14 md:py-18 px-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3" style={{ ...font.vintage }}>
                  Your Journey. <span className="italic" style={{ ...font.display }}>Your Way.</span>
                </h2>
                <p className="text-lg font-bold mb-2" style={{ color: GOLD2, ...font.body }}>Customized Packages Available</p>
                <p className="text-sm max-w-2xl mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.8)', ...font.body }}>
                  Whether you are planning a Honeymoon, Family Holiday, Adventure Expedition, International Vacation,
                  School/College Trip, Corporate/Group Tour, Weekend Camping or a Wildlife Experience — Alpine Explorers
                  can customize your journey according to your requirements.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {['Honeymoon', 'Family Holiday', 'Adventure Expedition', 'International Vacation', 'School / College Trip', 'Corporate / Group Tour', 'Weekend Camping', 'Wildlife Experience'].map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', ...font.body }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a href="/contact" className="group inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300"
                  style={{ background: 'linear-gradient(to right, #c59b27, #d4af37)', color: NAVY, ...font.vintage, boxShadow: '0 12px 30px rgba(197,155,39,0.45)' }}
                >
                  Customize My Trip
                  <div className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                    style={{ backgroundColor: NAVY, color: GOLD2 }}
                  >
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </a>
              </div>
              <div className="pointer-events-none">
                <svg viewBox="0 0 1440 40" className="w-full h-8" fill="#f0e3c5" preserveAspectRatio="none">
                  <path d="M0,0 L1440,0 L1440,24 Q1380,36 1320,22 T1200,34 T1080,20 T960,32 T840,18 T720,34 T600,22 T480,34 T360,18 T240,30 T120,20 T0,28 Z" />
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ 12 · WHY ALPINE EXPLORERS ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeading eyebrow="The Alpine Difference" title="Why Choose Alpine Explorers?" tagline="Trust, expertise and memories — since 1998" rotate={1} />

            <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7"
            >
              {[
                { icon: Shield, title: 'Trusted & Safe', desc: 'Safety-first travel experiences' },
                { icon: Award, title: '28+ Years Experience', desc: 'Serving explorers since 1998' },
                { icon: Compass, title: 'Expert Guides', desc: 'Experienced adventure and travel professionals' },
                { icon: Heart, title: 'Lifetime Memories', desc: 'Journeys designed to stay with you forever' },
              ].map((f, i) => (
                <motion.div key={i} variants={item}>
                  <PaperCard className="p-7 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto"
                      style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,175,55,0.10))' }}
                    >
                      <f.icon size={30} style={{ color: GOLD }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ ...font.vintage, color: NAVY }}>{f.title}</h3>
                    <p className="text-sm" style={{ color: BROWN, ...font.body }}>{f.desc}</p>
                    <div className="mt-4 h-[2px] w-10 mx-auto rounded-full" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
                  </PaperCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ 13 · LEGACY / CREDENTIALS ══════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <HandRoute className="w-full max-w-lg" tone={0.5} />
            </div>

            <SectionHeading eyebrow="The Story Behind The Trails" title="Since 1998" tagline="A legacy of leadership & recognition" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {/* Director card */}
              <PaperCard className="p-7 text-center flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,175,55,0.10))' }}
                >
                  <User size={28} style={{ color: GOLD }} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD, ...font.body }}>Director</p>
                <h3 className="text-xl font-bold mt-1" style={{ ...font.vintage, color: NAVY }}>Amit Lakhani</h3>
                <a href="tel:+91997983339" className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'rgba(18,43,73,0.06)', border: '1px solid rgba(18,43,73,0.15)', color: NAVY, ...font.body }}
                >
                  <Phone size={12} /> M: 99798 83339
                </a>
              </PaperCard>

              {/* Awarded By */}
              <PaperCard className="p-7 text-center flex flex-col items-center justify-center" style={{ border: '1px dashed rgba(197,155,39,0.45)' }}>
                <Award size={28} style={{ color: GOLD }} className="mb-3" />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD, ...font.body }}>Awarded By</p>
                <h3 className="text-lg font-bold mt-1 leading-snug" style={{ ...font.vintage, color: NAVY }}>
                  President Shri K.R. Narayanan
                </h3>
                <p className="text-xs my-2" style={{ color: 'rgba(58,42,24,0.5)', ...font.body }}>· and ·</p>
                <h3 className="text-lg font-bold leading-snug" style={{ ...font.vintage, color: NAVY }}>
                  Prime Minister Shri A.B. Vajpayee
                </h3>
              </PaperCard>

              {/* Instructor associations */}
              <PaperCard className="p-7 text-center flex flex-col items-center justify-center">
                <Mountain size={28} style={{ color: GOLD }} className="mb-3" />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD, ...font.body }}>
                  Instructor Associations
                </p>
                <h3 className="text-sm font-bold mt-2 leading-snug" style={{ ...font.vintage, color: NAVY }}>
                  Nehru Institute of Mountaineering — NIM, Uttarkashi
                </h3>
                <p className="text-xs my-2" style={{ color: 'rgba(58,42,24,0.5)', ...font.body }}>· and ·</p>
                <h3 className="text-sm font-bold leading-snug" style={{ ...font.vintage, color: NAVY }}>
                  Swami Vivekanand Mountaineering Institute — SVMI, Mount Abu
                </h3>
              </PaperCard>
            </div>

            {/* Floating coin stamp */}
            <div className="flex justify-center mt-10">
              <CoinStamp text="EST. 1998" sub="ALPINE EXPLORERS" />
            </div>
          </div>
        </section>

        {/* ══════════════════ 14 · FINAL CTA ══════════════════ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#122b49', boxShadow: '0 16px 48px rgba(0,20,60,0.28)' }}
            >
              {/* Scenic background */}
              <div className="absolute inset-0 opacity-15">
                <img src="https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd4?w=1400&h=500&fit=crop" alt="" className="w-full h-full object-cover" />
              </div>
              {/* Decorative travel icons */}
              <div className="absolute top-5 left-6 hidden sm:block">
                <Plane size={34} style={{ color: GOLD2, opacity: 0.7 }} />
              </div>
              <div className="absolute top-5 right-6 hidden sm:block">
                <Compass size={34} style={{ color: GOLD2, opacity: 0.7 }} />
              </div>
              <div className="absolute bottom-5 left-8 hidden sm:block">
                <Tent size={30} style={{ color: GOLD2, opacity: 0.6 }} />
              </div>
              <div className="absolute bottom-5 right-8 hidden sm:block">
                <Trees size={30} style={{ color: GOLD2, opacity: 0.6 }} />
              </div>

              <div className="relative z-10 text-center py-16 md:py-20 px-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3" style={{ ...font.vintage }}>
                  Lifetime Memories <span className="italic" style={{ ...font.display, color: GOLD2 }}>Only With Alpine Explorers</span>
                </h2>
                <p className="italic text-lg md:text-xl mb-9" style={{ ...font.display, color: 'rgba(255,255,255,0.75)' }}>
                  Your next adventure is waiting.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="#international" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-widest uppercase font-bold"
                    style={{ background: 'linear-gradient(to right, #c59b27, #d4af37)', color: NAVY, ...font.vintage, boxShadow: '0 12px 30px rgba(197,155,39,0.45)' }}
                  >
                    Explore Packages
                    <div className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                      style={{ backgroundColor: NAVY, color: GOLD2 }}
                    >
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                  </a>
                  <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm tracking-widest uppercase font-bold"
                    style={{ backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.35)', color: '#fff', ...font.vintage }}
                  >
                    <Phone size={15} /> Contact Us
                  </a>
                </div>

                <p className="mt-8 text-[11px] tracking-wider flex items-center justify-center gap-3 flex-wrap"
                  style={{ color: 'rgba(255,255,255,0.5)', ...font.body }}
                >
                  <span><Plane size={12} /> Airplane</span> ·
                  <span><Compass size={12} /> Compass</span> ·
                  <span><Mountain size={12} /> Mountains</span> ·
                  <span><Trees size={12} /> Trees</span> ·
                  <span><Tent size={12} /> Tent</span> ·
                  <span><Map size={12} /> Travel Route</span> ·
                  <span><MapPin size={12} /> Location Pins</span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final decorative footer band */}
        <div className="pb-10 flex flex-col items-center gap-3">
          <HandRoute className="w-full max-w-xl" tone={0.35} />
          <span className="text-sm tracking-[0.3em] font-bold uppercase" style={{ color: 'rgba(58,42,24,0.55)', ...font.vintage }}>
            Alpine Explorers · Since 1998
          </span>
        </div>

      </div>

      <Footer />
    </div>
  )
}