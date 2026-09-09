import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InquiryModal from '../components/InquiryModal'
import { testimonials } from '../data/data'
import { getTour, getCatalog, formatPrice } from '../services/catalog'
import {
  Star, MapPin, Calendar, Clock, Users, CheckCircle, X,
  ChevronDown, ChevronUp, Share2, Heart, MessageSquare,
  Shield, Award, Compass, ArrowRight, CheckCircle2, Sparkles
} from 'lucide-react'

export default function TourDetails() {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  const [expandedDay, setExpandedDay] = useState(0)
  const [liked, setLiked] = useState(false)
  const [travelersCount, setTravelersCount] = useState(2)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [copiedToast, setCopiedToast] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    let mounted = true
    getTour(id).then((t) => {
      if (!mounted) return
      if (t) { setTour(t) } else {
        getCatalog().then((all) => mounted && setTour(all[0] || null))
      }
    })
    return () => { mounted = false }
  }, [id])

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading tour…</h1>
          <Link to="/home" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const discount = tour.originalPrice > tour.price ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100) : 0
  const hasPrice = tour.price > 0
  const totalPrice = hasPrice ? tour.price * travelersCount : null

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[65vh] sm:h-[75vh] flex items-end overflow-hidden">
        <motion.img
          src={tour.image}
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4 max-w-4xl"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {tour.category}
              </span>
              {tour.badge && (
                <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {tour.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                  Save {discount}% Today
                </span>
              )}
            </div>

            {/* Tour Title */}
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
              {tour.title}
            </h1>

            {/* Location, Rating, Duration */}
            <div className="flex flex-wrap items-center gap-5 text-sm sm:text-base text-blue-100 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={18} className="text-amber-400" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">{tour.rating}</span>
                <span className="opacity-75">({tour.reviews} Reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={18} className="text-teal-300" />
                <span>{tour.duration}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left / Main Details Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-2">
                <Clock size={20} className="text-blue-600 mb-1" />
                <span className="text-[11px] text-gray-500 uppercase block font-semibold">Duration</span>
                <span className="font-bold text-sm text-slate-800">{tour.duration}</span>
              </div>
              <div className="p-2">
                <Calendar size={20} className="text-blue-600 mb-1" />
                <span className="text-[11px] text-gray-500 uppercase block font-semibold">Departs</span>
                <span className="font-bold text-sm text-slate-800">
                  {new Date(tour.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="p-2">
                <Users size={20} className="text-blue-600 mb-1" />
                <span className="text-[11px] text-gray-500 uppercase block font-semibold">Group Size</span>
                <span className="font-bold text-sm text-slate-800">Small Group (6-12)</span>
              </div>
              <div className="p-2">
                <Shield size={20} className="text-blue-600 mb-1" />
                <span className="text-[11px] text-gray-500 uppercase block font-semibold">Difficulty</span>
                <span className="font-bold text-sm text-slate-800">Moderate / All Levels</span>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Tour Overview
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-normal">
                {tour.description}
              </p>
            </div>

            {/* Tour Highlights */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Tour Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/70 rounded-xl">
                    <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DAY WISE ITINERARY WITH ACCORDION ANIMATION */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    Day Wise Itinerary
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Click each day to explore scheduled highlights, accommodations, and included meals.
                  </p>
                </div>
                <button
                  onClick={() => setExpandedDay(expandedDay === null ? 0 : null)}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  {expandedDay === null ? 'Expand All' : 'Collapse All'}
                </button>
              </div>

              {/* Accordion Days List */}
              <div className="space-y-3">
                {tour.itinerary.map((day, i) => {
                  const isExpanded = expandedDay === i

                  return (
                    <div
                      key={day.day}
                      className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : i)}
                        className={`w-full p-4 sm:p-5 flex items-center justify-between text-left transition ${
                          isExpanded
                            ? 'bg-blue-50/80 border-b border-blue-200'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isExpanded
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            D{day.day}
                          </span>
                          <div>
                            <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider block">
                              Day {day.day}
                            </span>
                            <h4 className="font-display font-bold text-base sm:text-lg text-slate-900">
                              {day.title}
                            </h4>
                          </div>
                        </div>
                        <div className="text-blue-600">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-5 bg-white text-gray-700 text-sm leading-relaxed space-y-3"
                          >
                            <p>{day.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100 font-medium">
                              <span>🍽️ Breakfast & Dinner Included</span>
                              <span>•</span>
                              <span>🏨 Signature Boutique Chalet</span>
                              <span>•</span>
                              <span>🧭 Certified Guide Escort</span>
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
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Inclusions & Exclusions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                  <h3 className="font-bold text-sm uppercase text-emerald-800 tracking-wider mb-4 flex items-center gap-1.5">
                    <CheckCircle size={16} className="text-emerald-600" /> What's Included
                  </h3>
                  <ul className="space-y-2.5">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="font-bold text-sm uppercase text-rose-800 tracking-wider mb-4 flex items-center gap-1.5">
                    <X size={16} className="text-rose-600" /> Not Included
                  </h3>
                  <ul className="space-y-2.5">
                    {tour.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                        <X size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Traveler Reviews */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Verified Traveler Reviews
                </h2>
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-amber-900 text-xs font-bold">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{tour.rating} / 5.0 Rating</span>
                </div>
              </div>

              <div className="space-y-4">
                {testimonials.slice(0, 2).map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.name}
                          className="w-10 h-10 rounded-full object-cover border border-blue-400"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{rev.name}</h4>
                          <span className="text-[11px] text-gray-500">Verified Explorer</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 italic">
                      "{rev.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Booking & Inquiry Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 space-y-6">
              {/* Pricing Box */}
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold">Total Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-slate-950">{hasPrice ? `$${totalPrice}` : 'On Request'}</span>
                  {hasPrice && tour.originalPrice > tour.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${tour.originalPrice * travelersCount}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{hasPrice ? `for ${travelersCount} guest(s)` : 'Contact us for pricing'}</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  ✓ Includes all taxes, national park permits & insurance
                </p>
              </div>

              {/* Number of Travelers Counter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Number of Travelers
                </label>
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-xl bg-gray-50">
                  <button
                    onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-slate-900">
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

              {/* Action Buttons: Book Now & Inquire Now */}
              <div className="space-y-3 pt-2">
                <Link
                  to={`/booking/${tour.id}`}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <span>Proceed to Book Now</span>
                  <ArrowRight size={16} />
                </Link>

                <button
                  onClick={() => setInquiryOpen(true)}
                  className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <MessageSquare size={16} className="text-emerald-600" />
                  <span>Inquire Now via WhatsApp</span>
                </button>
              </div>

              {/* Wishlist & Share Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    liked
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={15} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
                  <span>{liked ? 'Saved' : 'Wishlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 size={15} />
                  <span>{copiedToast ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Free cancellation up to 30 days prior</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>24/7 dedicated satellite concierge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Best price guarantee with zero hidden fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* WhatsApp Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        tour={tour}
      />
    </div>
  )
}
