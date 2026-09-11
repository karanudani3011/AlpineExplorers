import { useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { serviceTours } from '../data/servicesData'
import { testimonials } from '../data/data'
import { ArrowRight, ArrowUpRight, MapPin, Calendar, Clock, Compass, Award, Heart, Sparkles, Quote } from 'lucide-react'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
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

function formatINR(amount) {
  if (!amount || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function findTour(id) {
  for (const category of Object.keys(serviceTours)) {
    const found = serviceTours[category].find((t) => t.id === id)
    if (found) return found
  }
  return null
}

const showcaseDestinations = [
  {
    name: 'Kashmir',
    tag: 'Valleys of Heaven',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150a32?w=1400&h=1400&fit=crop',
    to: '/services/domestic',
    layout: 'col-span-2 row-span-2',
  },
  {
    name: 'Dubai',
    tag: 'Ultra Luxury',
    image: 'https://images.unsplash.com/photo-1512453395758-6b78f76b7f0e?w=900&h=900&fit=crop',
    to: '/services/international',
    layout: 'col-span-1 row-span-1',
  },
  {
    name: 'Bali',
    tag: 'Tropical Escape',
    image: 'https://images.unsplash.com/photo-1537225228614-b2fa3a0ff0ff?w=900&h=900&fit=crop',
    to: '/services/international',
    layout: 'col-span-1 row-span-1',
  },
  {
    name: 'Switzerland',
    tag: 'Alpine Wonder',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=800&fit=crop',
    to: '/services/mountain',
    layout: 'col-span-2 row-span-1',
  },
  {
    name: 'Rajasthan',
    tag: 'Royal Heritage',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1800&h=600&fit=crop',
    to: '/services/domestic',
    layout: 'col-span-2 row-span-1',
  },
]

const escapeTiles = [
  { title: 'Adventure', tag: 'Thrill & adrenaline', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=900&h=1100&fit=crop' },
  { title: 'Relax', tag: 'Slow down & unwind', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&h=1100&fit=crop' },
  { title: 'Romantic', tag: 'For two hearts', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&h=1100&fit=crop' },
  { title: 'Wilderness', tag: 'Into the wild', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&h=1100&fit=crop' },
  { title: 'Culture', tag: 'Heritage & craft', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&h=1100&fit=crop' },
  { title: 'Solo', tag: 'Your own pace', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&h=1100&fit=crop' },
]

const featuredIds = ['mtn-1', 'int-2', 'adv-4', 'fam-1']

const upcomingEvents = [
  {
    title: 'Himalayan Heritage Motorcycle Rally',
    date: 'Oct 12 · 2026',
    location: 'Leh · Ladakh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&h=600&fit=crop',
  },
  {
    title: 'Golden Hour Trekkers Meetup',
    date: 'Oct 26 · 2026',
    location: 'Kullu Valley · Himachal',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=600&fit=crop',
  },
  {
    title: 'Aegean Island Odyssey Preview',
    date: 'Nov 08 · 2026',
    location: 'Mumbai · Online + Live',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&h=600&fit=crop',
  },
]

const whyBenefits = [
  {
    icon: Compass,
    title: 'Expertly Planned',
    text: 'Every journey is hand-crafted by destination specialists who know these landscapes personally — down to the last golden hour.',
  },
  {
    icon: Heart,
    title: 'Personal Support',
    text: 'A dedicated concierge on WhatsApp, around the clock, from your first question to the flight home.',
  },
  {
    icon: Award,
    title: 'Best Value',
    text: 'Direct partnership rates with transparent pricing — premium experiences without hidden surcharges.',
  },
  {
    icon: Sparkles,
    title: 'Memorable Experiences',
    text: 'Thoughtful small touches that turn trips into stories you will retell for years.',
  },
]

export default function Home() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 900], [0, 250])
  const heroTextY = useTransform(scrollY, [0, 700], [0, 130])
  const heroOpacity = useTransform(scrollY, [0, 620], [1, 0.12])
  const ctaY = useTransform(scrollY, [0, 1200], [0, 90])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-slate-900 overflow-x-hidden">
      <Navbar />

      {/* ===================================================================== */}
      {/* SECTION 1 — IMMERSIVE HERO                                           */}
      {/* ===================================================================== */}
      <section className="relative h-[94vh] min-h-[640px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 -bottom-24">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000&h=1300&fit=crop"
            alt="A winding mountain road at golden hour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,26,77,0.82) 0%, rgba(0,26,77,0.42) 48%, rgba(6,14,30,0.5) 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(to top, #f7f2ea 0%, rgba(247,242,234,0) 100%)' }} />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-2xl mb-4"
            style={{ ...font.script, color: GOLD2 }}
          >
            Alpine Explorers · Journeys beyond the postcard
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white uppercase leading-[1.05] tracking-wide mb-5"
            style={font.vintage}
          >
            Go somewhere
            <br />
            <span className="italic normal-case" style={{ fontFamily: 'Playfair Display, serif', color: GOLD2 }}>
              you&apos;ve never been.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white/90 max-w-xl text-sm sm:text-lg leading-relaxed mb-8"
            style={font.body}
          >
            Journeys designed for curious travelers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-[#001a4d] transition hover:-translate-y-0.5"
              style={{ backgroundColor: GOLD, fontFamily: 'Cinzel, serif' }}
            >
              Explore Tours
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(212,175,55,0.7)', backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)', fontFamily: 'Cinzel, serif' }}
            >
              Plan My Trip
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating brand details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="absolute bottom-8 left-0 right-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex flex-wrap items-center gap-3 sm:gap-6 rounded-2xl px-5 py-3 sm:px-7"
              style={{ backgroundColor: 'rgba(250,245,234,0.92)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212,175,55,0.35)', boxShadow: '0 18px 44px rgba(0,26,77,0.28)' }}>
              {[
                { value: '120+', label: 'Destinations' },
                { value: '5000+', label: 'Happy Travelers' },
                { value: 'Since', label: '1998' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3 sm:gap-6">
                  <div>
                    <div className="text-lg sm:text-2xl font-extrabold leading-none" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>{stat.value}</div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold" style={{ color: GOLD }}>{stat.label}</div>
                  </div>
                  {i < 2 && (
                    <div className="hidden sm:block w-px h-8" style={{ backgroundColor: 'rgba(197,155,39,0.4)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 2 — DESTINATIONS WORTH DISCOVERING                            */}
      {/* ===================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-2xl block mb-2" style={{ ...font.script, color: GOLD }}>Curated world wonders</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#001a4d] mb-3" style={font.vintage}>
            Destinations Worth Discovering
          </h2>
          <p className="text-gray-600 text-sm sm:text-base" style={font.body}>
            From hidden escapes to unforgettable landmarks.
          </p>
          <div className="mx-auto mt-5 flex items-center gap-3 justify-center">
            <div className="h-[2px] w-14" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
            <Compass size={18} style={{ color: GOLD }} />
            <div className="h-[2px] w-14" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[190px] sm:auto-rows-[250px] gap-3 sm:gap-5">
          {showcaseDestinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl ${dest.layout}`}
              style={{ boxShadow: '0 10px 26px rgba(60,40,20,0.16)' }}
            >
              <Link to={dest.to} className="absolute inset-0 block">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.78) 0%, rgba(0,26,77,0.12) 60%, transparent 100%)' }} />
                <div className="absolute left-4 bottom-4 right-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] font-bold mb-1 transition-all duration-500"
                    style={{ color: GOLD2, opacity: 0, transform: 'translateY(8px)' }}>
                    <span className="inline-block group-hover:opacity-100 group-hover:translate-y-0" style={{ opacity: 0, transform: 'translateY(8px)', transition: 'all 0.4s ease .05s' }}>{dest.tag}</span>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide group-hover:-translate-y-0.5 transition-transform" style={font.vintage}>
                      <span className="inline-block transition-all duration-500 group-hover:translate-x-1">{dest.name}</span>
                    </h3>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                      style={{ backgroundColor: GOLD }}>
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 3 — FIND YOUR KIND OF ESCAPE                                   */}
      {/* ===================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="text-2xl block mb-2" style={{ ...font.script, color: GOLD }}>A journey for every heart</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#001a4d] mb-3 uppercase" style={font.vintage}>
              How Do You Want to Travel?
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-md" style={font.body}>
            Six moods, six ways to see the world. Choose the escape that feels like you, and we&apos;ll design the trip around it.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {escapeTiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] transition-all duration-500 hover:scale-[1.03] hover:z-10"
              style={{ boxShadow: '0 8px 22px rgba(60,40,20,0.14)' }}
            >
              <Link to="/travel-mood" className="absolute inset-0 block">
                <img
                  src={tile.image}
                  alt={`${tile.title} travel style`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.72) 0%, rgba(0,26,77,0.05) 55%, transparent 100%)' }} />
                <div className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500"
                  style={{ color: 'rgba(212,175,55,0)', opacity: 0 }}>
                  0{i + 1}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide mb-1 transition-all duration-500 group-hover:-translate-y-1" style={font.vintage}>
                    {tile.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-12" style={{ ...font.body }}>
                    {tile.tag}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 4 — FEATURED EXPERIENCES                                      */}
      {/* ===================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#ede2d2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="text-2xl block mb-2" style={{ ...font.script, color: GOLD }}>Chosen by our travelers</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#001a4d] mb-3 uppercase" style={font.vintage}>
                Experiences You&apos;ll Remember
              </h2>
            </div>
            <Link to="/services" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest py-2.5 px-5 rounded-xl transition inline-flex"
              style={{ color: NAVY, border: `1px solid ${GOLD}`, backgroundColor: 'rgba(212,175,55,0.1)' }}>
              View All Tours
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
            {featuredIds.map((id, i) => {
              const tour = findTour(id)
              if (!tour) return null
              const price = formatINR(tour.price)
              return (
                <motion.article
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#faf5ea] border border-[#e8ded0]"
                  style={{ boxShadow: '0 10px 28px rgba(60,40,20,0.12)' }}
                >
                  <Link to={`/tour/${tour.id}`} className="block relative h-52 overflow-hidden flex-shrink-0">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.45) 0%, rgba(0,26,77,0.05) 60%, transparent 100%)' }} />
                    <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(212,175,55,0.95)', color: NAVY }}>
                      {tour.category}
                    </span>
                  </Link>

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold mb-2" style={{ color: GOLD }}>
                      <MapPin size={12} />
                      <span className="truncate uppercase tracking-wider">{tour.location}</span>
                    </div>
                    <Link to={`/tour/${tour.id}`}>
                      <h3 className="text-lg font-extrabold leading-snug mb-2 text-[#001a4d] group-hover:text-[#c59b27] transition-colors" style={font.vintage}>
                        {tour.title}
                      </h3>
                    </Link>
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-2" style={font.body}>
                      {tour.shortDescription}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 mb-4">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} style={{ color: GOLD }} /> {tour.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px dashed rgba(180,160,130,0.55)' }}>
                      <div className="flex items-baseline gap-1.5">
                        {price && (
                          <>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500">From</span>
                            <span className="text-lg font-extrabold text-[#001a4d]" style={font.vintage}>{price}</span>
                          </>
                        )}
                      </div>
                      <Link to={`/tour/${tour.id}`} className="group/btn inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                        style={{ color: NAVY }}>
                        View Experience
                        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5 — WHY ALPINE EXPLORERS                                      */}
      {/* ===================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#f5ecd8' }}>
        {/* subtle mountain line-art */}
        <svg className="absolute inset-x-0 top-6 w-full h-40 opacity-[0.12] pointer-events-none" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="0,140 180,60 300,120 460,20 560,110 720,40 880,120 1000,70 1200,130" fill="none" stroke={NAVY} strokeWidth="2.5" />
          <polyline points="0,150 220,90 340,135 520,60 640,125 800,80 940,135 1100,95 1200,145" fill="none" stroke={GOLD} strokeWidth="1.5" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-2xl block mb-2" style={{ ...font.script, color: GOLD }}>The Alpine standard</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#001a4d] mb-3" style={font.vintage}>
              Why Travel with Alpine Explorers?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base" style={font.body}>
              The quiet details matter most when the mountain is big and the plan is full of heart.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyBenefits.map((b, i) => {
              const Icon = b.icon
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className="group rounded-2xl p-8 text-center bg-[#faf5ea] hover:bg-[#fffaf0] transition-colors"
                  style={{ border: '1px solid rgba(180,160,130,0.35)', boxShadow: '0 8px 22px rgba(60,40,20,0.08)' }}
                >
                  <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{ border: `1.5px solid ${GOLD}`, color: NAVY, backgroundColor: 'rgba(212,175,55,0.1)' }}>
                    <Icon size={26} />
                  </div>
                  <h3 className="text-lg font-extrabold uppercase tracking-wide mb-2 text-[#001a4d]" style={font.vintage}>
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed" style={font.body}>
                    {b.text}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 6 — UPCOMING ADVENTURES                                       */}
      {/* ===================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-2xl block mb-2" style={{ ...font.script, color: GOLD }}>Save the date</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001a4d] uppercase" style={font.vintage}>
              Upcoming Adventures
            </h2>
          </div>
          <Link to="/upcoming-events" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#001a4d] hover:text-[#c59b27] transition">
            View All Events
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map((ev, i) => (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group flex items-center gap-4 rounded-2xl p-4 bg-[#faf5ea] hover:bg-white transition-colors"
              style={{ border: '1px solid rgba(180,160,130,0.35)', boxShadow: '0 6px 18px rgba(60,40,20,0.08)' }}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
                  <span className="inline-flex items-center gap-1"><Calendar size={11} /> {ev.date}</span>
                </div>
                <h3 className="text-sm font-extrabold leading-snug mb-1 text-[#001a4d]" style={font.vintage}>{ev.title}</h3>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <MapPin size={11} style={{ color: GOLD }} /> {ev.location}
                </p>
                <Link to="/upcoming-events" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#c59b27] hover:text-[#001a4d] transition">
                  View Event <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 7 — TRAVELER STORIES                                          */}
      {/* ===================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#ede2d2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-2xl block mb-2" style={{ ...font.script, color: GOLD }}>Real stories, real journeys</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#001a4d] mb-3" style={font.vintage}>
              Travelers Who Came Back with Stories
            </h2>
            <p className="text-gray-600 text-sm sm:text-base" style={font.body}>
              The best reviews are the ones still being told around a dinner table.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative rounded-2xl p-7 bg-[#faf5ea] flex flex-col"
                style={{ border: '1px solid rgba(180,160,130,0.35)', boxShadow: '0 10px 28px rgba(60,40,20,0.1)' }}
              >
                <Quote size={30} className="mb-4" style={{ color: GOLD, opacity: 0.55 }} />
                <blockquote className="text-sm text-gray-700 italic leading-relaxed flex-1 mb-6" style={font.body}>
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4" style={{ borderTop: '1px dashed rgba(180,160,130,0.5)' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover"
                    style={{ border: `2px solid ${GOLD}` }}
                    loading="lazy"
                  />
                  <div>
                    <div className="text-sm font-extrabold text-[#001a4d]" style={font.vintage}>{t.name}</div>
                    <div className="text-[11px] text-gray-500">{t.role.split('•').slice(-1)[0].trim()}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 8 — FINAL VISUAL CTA                                         */}
      {/* ===================================================================== */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <motion.div style={{ y: ctaY }} className="absolute inset-0 -bottom-20">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000&h=1200&fit=crop"
            alt="A canoe gliding across a calm mountain lake at sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.88) 0%, rgba(0,26,77,0.55) 60%, rgba(0,26,77,0.7) 100%)' }} />
        </motion.div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl block mb-4"
            style={{ ...font.script, color: GOLD2 }}
          >
            Adventure is closer than you think
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white uppercase leading-tight mb-5"
            style={font.vintage}
          >
            Where Will You Go Next?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/85 text-sm sm:text-lg mb-9 max-w-xl mx-auto leading-relaxed"
            style={font.body}
          >
            Your next unforgettable journey is waiting.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-[#001a4d] transition hover:-translate-y-0.5"
              style={{ backgroundColor: GOLD, fontFamily: 'Cinzel, serif' }}
            >
              Start Exploring
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}