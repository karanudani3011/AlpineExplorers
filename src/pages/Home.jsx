import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DestinationCard from '../components/DestinationCard'
import ExperienceCard from '../components/ExperienceCard'
import Board3DSection from '../components/board3d/Board3DSection'
import InquiryModal from '../components/InquiryModal'
import { destinations, experiences, testimonials } from '../data/data'
import { MapPin, Calendar, Compass, Shield, Award, Heart, Sparkles, ArrowRight, Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Search } from 'lucide-react'

export default function Home() {
  const [where, setWhere] = useState('')
  const [when, setWhen] = useState('')
  const [travelType, setTravelType] = useState('all')
  const [activeFilter, setActiveFilter] = useState('All')
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const features = [
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'Exclusive partnership rates with zero hidden booking surcharges.',
      stat: '100% Match',
    },
    {
      icon: Compass,
      title: 'Expert Mountain Guides',
      description: 'Certified UIAGM and local cultural masters leading every journey.',
      stat: '50+ Guides',
    },
    {
      icon: Heart,
      title: '24/7 Dedicated Support',
      description: 'Direct WhatsApp and satellite concierge assistance anywhere on earth.',
      stat: '3 Min Response',
    },
    {
      icon: Shield,
      title: 'Safe & Certified',
      description: 'Comprehensive trip safety protocols, gear testing, and flexible policies.',
      stat: '99.8% Satisfaction',
    },
  ]

  const handleCategorySelect = (filterKey) => {
    setActiveFilter(filterKey)
    const section = document.getElementById('popular-destinations')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const section = document.getElementById('popular-destinations')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollDestinations = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-slate-900 overflow-x-hidden">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. EXACT RECREATION OF USER 3D FLOATING BOARD PRESENTATION AS HOME CENTERPIECE */}
      {/* ========================================================================= */}
      <Board3DSection
        onCategorySelect={handleCategorySelect}
        onContactClick={() => setInquiryOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 2. MODERN SEARCH / TRAVEL PLANNER DOCK (WARM SAND / CREAM AESTHETIC)       */}
      {/* ========================================================================= */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 border border-[#e8ded0]"
        >
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            {/* Where */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0e1f38] uppercase tracking-wider block flex items-center gap-1">
                <MapPin size={12} className="text-amber-500" /> Where?
              </label>
              <input
                type="text"
                placeholder="Bali, Swiss Alps, Paris..."
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#faf7f2] border border-[#e5dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-slate-800"
              />
            </div>

            {/* When */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0e1f38] uppercase tracking-wider block flex items-center gap-1">
                <Calendar size={12} className="text-amber-500" /> When?
              </label>
              <input
                type="date"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#faf7f2] border border-[#e5dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-slate-800"
              />
            </div>

            {/* Travel Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0e1f38] uppercase tracking-wider block flex items-center gap-1">
                <Compass size={12} className="text-amber-500" /> Travel Type?
              </label>
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#faf7f2] border border-[#e5dcce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-slate-800"
              >
                <option value="all">All Travel Types</option>
                <option value="international">International</option>
                <option value="domestic">Domestic</option>
                <option value="mountain">Mountain</option>
                <option value="adventure">Adventure & Camps</option>
                <option value="family">Family Tours</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#0f2342] via-[#162f56] to-[#0f2342] hover:from-[#162f56] hover:to-[#0f2342] text-amber-100 font-vintage font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm border border-amber-500/30"
              >
                <span>Find Expeditions</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR DESTINATIONS (WARM CREAM PALETTE WITH HORIZONTAL SCROLL)        */}
      {/* ========================================================================= */}
      <section id="popular-destinations" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#8b6528] uppercase tracking-widest block mb-1">
              Curated World Wonders
            </span>
            <h2 className="font-vintage text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0e1f38]">
              Popular Destinations
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl">
              From the azure cliffs of Santorini to the snowfields of Switzerland and the lush valleys of Bali.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollDestinations('left')}
              className="w-10 h-10 rounded-full border border-[#d8cdbd] bg-white hover:bg-[#faf7f2] flex items-center justify-center text-gray-700 transition shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollDestinations('right')}
              className="w-10 h-10 rounded-full border border-[#d8cdbd] bg-white hover:bg-[#faf7f2] flex items-center justify-center text-gray-700 transition shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {destinations.map((dest, index) => (
            <div key={dest.id} className="snap-start flex-shrink-0">
              <DestinationCard destination={dest} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPLORE BY EXPERIENCE SECTION                                          */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#8b6528] uppercase tracking-widest block mb-1">
            Tailored Passions
          </span>
          <h2 className="font-vintage text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0e1f38]">
            Explore by Experience
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Whether you crave heart-pumping summit adventures, fine culinary discoveries, or authentic local life.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY CHOOSE US SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0b172a] via-[#0f2342] to-[#0b1a2e] text-white relative overflow-hidden">
        {/* Glowing Ambient Light Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              The Alpine Standard
            </span>
            <h2 className="font-vintage text-3xl sm:text-4xl md:text-5xl font-bold">
              Why Travelers Choose Us
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mt-3 leading-relaxed">
              We engineer journeys that balance extraordinary wilderness encounters with uncompromising safety, comfort, and white-glove hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 mb-5 shadow-lg group-hover:scale-110 transition">
                    <Icon size={26} />
                  </div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {feat.stat}
                  </div>
                  <h3 className="font-vintage font-bold text-xl text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">{feat.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TRAVELER TESTIMONIALS                                                  */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#8b6528] uppercase tracking-widest block mb-1">
            Real Stories
          </span>
          <h2 className="font-vintage text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0e1f38]">
            Voices from the Trail
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Hear what our fellow adventurers have to say about their journeys with Alpine Explorers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-7 rounded-2xl border border-[#e8ded0] shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[#f59e0b] mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#d4af37]"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#0e1f38]">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. READY FOR YOUR NEXT ADVENTURE CALLOUT BANNER                           */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="bg-gradient-to-r from-[#0e1f38] via-[#162f56] to-[#0e1f38] rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl border border-amber-500/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-vintage text-3xl sm:text-4xl md:text-5xl font-bold">
              Ready for Your Next Great Adventure?
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed font-light">
              Take our interactive Travel Mood quiz or consult with an expedition specialist on WhatsApp to craft your custom itinerary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/travel-mood"
                className="px-8 py-3.5 bg-[#ffd778] hover:bg-[#ffcf5c] text-slate-950 font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>Find Your Travel Mood</span>
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Concierge</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Global WhatsApp Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  )
}
