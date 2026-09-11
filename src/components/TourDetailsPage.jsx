import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import InquiryModal from './InquiryModal'
import { serviceTours, serviceCategories } from '../data/servicesData'
import {
  Star, MapPin, Calendar, Clock, Users, CheckCircle, X,
  ChevronDown, ChevronUp, ChevronRight, Share2, Heart, MessageSquare,
  Shield, ArrowRight, CheckCircle2
} from 'lucide-react'

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
}

function formatINR(amount) {
  if (!amount || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function findTourById(id) {
  for (const category of Object.keys(serviceTours)) {
    const found = serviceTours[category].find((t) => t.id === id)
    if (found) {
      const cat = serviceCategories.find((c) => c.slug === category)
      return { tour: found, category: cat }
    }
  }
  return { tour: null, category: null }
}

export default function TourDetailsPage() {
  const { id } = useParams()
  const [expandedDay, setExpandedDay] = useState(0)
  const [liked, setLiked] = useState(false)
  const [travelersCount, setTravelersCount] = useState(2)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [copiedToast, setCopiedToast] = useState(false)

  const { tour, category } = findTourById(id)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: CREAM }}>
        <Navbar />
        <div className="text-center py-32">
          <h1 className="text-3xl font-bold mb-4" style={{ color: NAVY, ...font.vintage }}>
            Tour Not Found
          </h1>
          <p className="mb-6" style={{ color: BROWN }}>
            The tour you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{ backgroundColor: NAVY }}
          >
            Browse Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const discount = tour.originalPrice > tour.price
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : 0
  const hasPrice = tour.price > 0
  const totalPrice = hasPrice ? tour.price * travelersCount : null
  const formattedPrice = formatINR(totalPrice)
  const formattedPerPerson = formatINR(tour.price)
  const formattedOriginal = formatINR(tour.originalPrice * travelersCount)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.title,
        text: `Check out ${tour.title} on Alpine Explorers!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopiedToast(true)
      setTimeout(() => setCopiedToast(false), 3000)
    }
  }

  const whatsappMessage = `Hello Alpine Explorers!\n\nI am interested in the ${tour.title} package.\n\n📍 Location: ${tour.location}\n📅 Date: ${new Date(tour.date).toLocaleDateString('en-IN')}\n👥 Travelers: ${travelersCount}\n\nPlease share more details.`

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[55vh] sm:h-[65vh] flex items-end overflow-hidden">
        <motion.img
          src={tour.image}
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
              <Link to="/home" className="hover:text-white transition">Home</Link>
              <ChevronRight size={14} />
              <Link to="/services" className="hover:text-white transition">Services</Link>
              {category && (
                <>
                  <ChevronRight size={14} />
                  <Link to={`/services/${category.slug}`} className="hover:text-white transition">
                    {category.shortName}
                  </Link>
                </>
              )}
              <ChevronRight size={14} />
              <span className="text-white font-medium truncate max-w-[180px]">{tour.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3 max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: 'rgba(197,155,39,0.9)' }}>
                  {category.shortName}
                </span>
              )}
              {tour.badge && (
                <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {tour.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold">
                  Save {discount}%
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={font.vintage}>
              {tour.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} style={{ color: GOLD }} />
                <span>{tour.location}</span>
              </div>
              {tour.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{tour.rating}</span>
                  {tour.reviews > 0 && <span className="opacity-70">({tour.reviews})</span>}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-teal-300" />
                <span>{tour.duration}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-2">
                <Clock size={18} style={{ color: GOLD }} className="mb-1" />
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Duration</span>
                <span className="font-bold text-xs text-slate-800">{tour.duration}</span>
              </div>
              <div className="p-2">
                <Calendar size={18} style={{ color: GOLD }} className="mb-1" />
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Departs</span>
                <span className="font-bold text-xs text-slate-800">
                  {new Date(tour.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="p-2">
                <Users size={18} style={{ color: GOLD }} className="mb-1" />
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Group Size</span>
                <span className="font-bold text-xs text-slate-800">Small Group (6-12)</span>
              </div>
              <div className="p-2">
                <Shield size={18} style={{ color: GOLD }} className="mb-1" />
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Difficulty</span>
                <span className="font-bold text-xs text-slate-800">Moderate / All Levels</span>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                Tour Overview
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                Tour Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tour.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(197,155,39,0.06)' }}>
                    <CheckCircle size={16} style={{ color: GOLD }} className="flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day Wise Itinerary */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                    Day Wise Itinerary
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Click each day to explore scheduled highlights and activities.
                  </p>
                </div>
                <button
                  onClick={() => setExpandedDay(expandedDay === null ? 0 : null)}
                  className="text-[11px] font-bold hover:underline"
                  style={{ color: GOLD }}
                >
                  {expandedDay === null ? 'Expand All' : 'Collapse All'}
                </button>
              </div>

              <div className="space-y-2.5">
                {tour.itinerary.map((day, i) => {
                  const isExpanded = expandedDay === i
                  return (
                    <div
                      key={day.day}
                      className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : i)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left transition"
                        style={{
                          backgroundColor: isExpanded ? 'rgba(197,155,39,0.06)' : 'white',
                          borderBottom: isExpanded ? '1px solid rgba(197,155,39,0.15)' : 'none',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0"
                            style={{
                              background: isExpanded
                                ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})`
                                : '#f3f4f6',
                              color: isExpanded ? 'white' : '#6b7280',
                              boxShadow: isExpanded ? '0 3px 8px rgba(197,155,39,0.3)' : 'none',
                            }}
                          >
                            D{day.day}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: GOLD }}>
                              Day {day.day}
                            </span>
                            <h4 className="font-bold text-sm sm:text-base" style={{ color: NAVY }}>
                              {day.title}
                            </h4>
                          </div>
                        </div>
                        <div style={{ color: GOLD }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white text-gray-700 text-sm leading-relaxed space-y-2">
                              <p>{day.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                Inclusions & Exclusions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#166534' }}>
                    <CheckCircle size={14} className="text-emerald-600" /> What's Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#991b1b' }}>
                    <X size={14} className="text-rose-600" /> Not Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                        <X size={14} className="text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sm:p-6 space-y-5">
              {/* Pricing */}
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Total Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold" style={{ color: NAVY }}>
                    {formattedPrice || 'On Request'}
                  </span>
                  {hasPrice && formattedOriginal && tour.originalPrice > tour.price && (
                    <span className="text-sm text-gray-400 line-through">{formattedOriginal}</span>
                  )}
                </div>
                {hasPrice && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    {formattedPerPerson} × {travelersCount} traveler{travelersCount > 1 ? 's' : ''}
                  </p>
                )}
                <p className="text-[10px] text-emerald-700 font-medium mt-1">
                  ✓ Includes all applicable taxes & permits
                </p>
              </div>

              {/* Travelers Counter */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">
                  Number of Travelers
                </label>
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-xl bg-gray-50">
                  <button
                    onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm" style={{ color: NAVY }}>
                    {travelersCount} Traveler{travelersCount > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setTravelersCount(travelersCount + 1)}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Link
                  to={`/booking/${tour.id}`}
                  className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-sm"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                >
                  <span>Book Now</span>
                  <ArrowRight size={15} />
                </Link>

                <a
                  href={`https://wa.me/919979883339?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare size={15} className="text-emerald-600" />
                  <span>Inquire via WhatsApp</span>
                </a>
              </div>

              {/* Wishlist & Share */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setLiked(!liked)}
                  className="py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  style={{
                    borderColor: liked ? '#fecdd3' : '#e5e7eb',
                    backgroundColor: liked ? '#fef2f2' : 'transparent',
                    color: liked ? '#e11d48' : '#374151',
                  }}
                >
                  <Heart size={13} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
                  <span>{liked ? 'Saved' : 'Wishlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 size={13} />
                  <span>{copiedToast ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                  <span>Free cancellation up to 30 days prior</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                  <span>24/7 dedicated concierge support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                  <span>Best price guarantee — zero hidden fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        tour={tour}
      />
    </div>
  )
}
