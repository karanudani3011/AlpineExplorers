import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Info, Phone, Mail, Star, ArrowRight, X, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react'
import {
  GlobeIllustration,
  DomesticIllustration,
  MountainIllustration,
  CampIllustration,
  TouristCharacterLeft,
  TouristCharacterRight,
  VintageBrassCompass,
} from './Board3DAssets'

export default function Board3DSection({ onCategorySelect, onContactClick }) {
  const [activeCard, setActiveCard] = useState(null)
  const [compassRotation, setCompassRotation] = useState(0)
  const [guideModal, setGuideModal] = useState(null)

  const handleCompassClick = () => {
    setCompassRotation((prev) => prev + 360 + Math.floor(Math.random() * 90))
  }

  const travelGuides = [
    {
      id: 1,
      type: 'review',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
      name: 'Joen',
      rating: 5,
      title: 'Yessen Lunces',
      text: 'Exquisite alpine journeys with world-class local mountain specialists. The attention to itinerary pacing and breathtaking views exceeded all expectations.',
      fullContent: 'Our multi-day trek across the Matterhorn high pass with Alpine Explorers was seamlessly planned. The private chalets were warm and welcoming, food was incredible, and safety standards were second to none.',
    },
    {
      id: 2,
      type: 'scenic',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop',
      rating: 5,
      title: 'Peplore De Tours',
      text: 'Discover pristine coastal lagoons, secluded turquoise waters, and private catamaran expeditions along the Mediterranean and Pacific.',
      fullContent: 'From secret Greek coves to the emerald waters of Bali, Peplore De Tours brings you intimate small-group voyages with private chefs, snorkeling gear, and sunset coastal sails.',
    },
    {
      id: 3,
      type: 'review',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
      name: 'Joen',
      rating: 5,
      title: 'Yessen Lunces',
      text: 'Bespoke custom family tours and effortless transfers. Handled our luggage and reservations with absolute five-star professionalism.',
      fullContent: 'Traveling with children and grandparents was stress-free thanks to the 24/7 WhatsApp concierge. Every museum ticket, scenic rail pass, and private shuttle was ready on arrival.',
    },
  ]

  const categoryCards = [
    {
      id: 'International',
      title: 'International',
      subtitle: '(Globe)',
      desc: 'Transcontinental escapes across Europe, Asia, and the Americas.',
      component: GlobeIllustration,
      filterKey: 'International',
    },
    {
      id: 'Domestic',
      title: 'Domestic',
      subtitle: '(Map)',
      desc: 'Iconic national parks, coastal highways, and scenic canyons.',
      component: DomesticIllustration,
      filterKey: 'Domestic',
    },
    {
      id: 'Mountain',
      title: 'Mountain',
      subtitle: 'Adventures',
      desc: 'Glacial treks, alpine chalets, and guided summit ascents.',
      component: MountainIllustration,
      filterKey: 'Mountain',
    },
    {
      id: 'River & Camp',
      title: 'River & Camp',
      subtitle: '(Raft & Campfire)',
      desc: 'River rafting, safari bell glamping, and stargazing cookouts.',
      component: CampIllustration,
      filterKey: 'Adventure Tours & Camps',
    },
  ]

  return (
    <div className="relative w-full bg-[#f3ede3] text-[#12233c] py-8 sm:py-12 px-3 sm:px-6 lg:px-10 overflow-hidden select-none">
      {/* Background Soft Studio Vignette & Sandy Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, #fdfbf7 0%, #f4eee3 55%, #e8decb 100%)
          `,
        }}
      />

      {/* TOP TITLE: "HOME PAGE" in bold condensed navy sans-serif */}
      <div className="relative z-20 text-center mb-6 sm:mb-8">
        <h1 className="font-vintage text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wider text-[#0e1e38] uppercase">
          HOME PAGE
        </h1>
        <div className="w-16 h-1 bg-[#d4af37] mx-auto mt-2 rounded-full opacity-60" />
      </div>

      {/* Presentation Canvas Container */}
      <div className="relative max-w-[1360px] mx-auto z-10 flex items-center justify-center">
        {/* LEFT 3D MINIATURE TOURIST (Looking at board) */}
        <div className="hidden xl:block absolute -left-12 bottom-12 z-30 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="transform hover:scale-105 transition"
          >
            <TouristCharacterLeft className="w-24 h-44 drop-shadow-2xl" />
          </motion.div>
        </div>

        {/* RIGHT 3D MINIATURE TOURIST (Looking at board) */}
        <div className="hidden xl:block absolute -right-12 bottom-12 z-30 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="transform hover:scale-105 transition"
          >
            <TouristCharacterRight className="w-24 h-44 drop-shadow-2xl" />
          </motion.div>
        </div>

        {/* SCATTERED 3D RIVER PEBBLES & STONES */}
        {/* Left Stones */}
        <div className="hidden lg:block absolute left-8 top-1/4 z-10 pointer-events-none">
          <div className="w-9 h-6 rounded-full bg-gradient-to-br from-[#c8b7a1] to-[#8c7862] shadow-[0_8px_12px_rgba(50,40,30,0.35)] transform rotate-12" />
          <div className="w-5 h-4 rounded-full bg-gradient-to-br from-[#dfd3c1] to-[#a39480] shadow-[0_4px_6px_rgba(50,40,30,0.3)] mt-2 ml-4 -rotate-6" />
        </div>
        <div className="hidden lg:block absolute left-14 bottom-1/3 z-10 pointer-events-none">
          <div className="w-7 h-5 rounded-full bg-gradient-to-br from-[#bcae9b] to-[#807260] shadow-[0_6px_8px_rgba(50,40,30,0.3)] transform -rotate-12" />
        </div>
        {/* Right Stones */}
        <div className="hidden lg:block absolute right-8 top-1/3 z-10 pointer-events-none">
          <div className="w-8 h-5 rounded-full bg-gradient-to-br from-[#c8b7a1] to-[#8c7862] shadow-[0_8px_10px_rgba(50,40,30,0.3)] rotate-45" />
          <div className="w-4 h-3 rounded-full bg-gradient-to-br from-[#dfd3c1] to-[#a39480] shadow-[0_4px_6px_rgba(50,40,30,0.3)] mt-2 mr-2" />
        </div>
        <div className="hidden lg:block absolute right-16 bottom-1/4 z-10 pointer-events-none">
          <div className="w-6 h-4 rounded-full bg-gradient-to-br from-[#bcae9b] to-[#807260] shadow-[0_6px_8px_rgba(50,40,30,0.3)] -rotate-12" />
        </div>

        {/* ======================================================= */}
        {/* THE FLOATING 3D PRESENTATION BOARD CONTAINER           */}
        {/* ======================================================= */}
        <div className="relative w-full rounded-[36px] p-2.5 sm:p-4 bg-gradient-to-b from-[#fffefc] to-[#f8f3ea] shadow-[0_35px_80px_-15px_rgba(55,40,25,0.22),0_15px_30px_rgba(55,40,25,0.12)] border border-[#e8dfcf]/80">
          
          {/* THE GLOWING GOLDEN OUTLINE PATH */}
          <div
            className="relative rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 border-2 border-[#ffdb7d] transition-shadow duration-500"
            style={{
              boxShadow: '0 0 24px rgba(255, 205, 85, 0.65), inset 0 0 16px rgba(255, 215, 100, 0.25)',
            }}
          >
            {/* BOARD TOP HEADER */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              {/* Left Label: GENERAL INFO */}
              <div>
                <h2 className="font-vintage font-bold text-lg sm:text-2xl text-[#0d1d36] tracking-wider uppercase">
                  GENERAL INFO
                </h2>
              </div>

              {/* Right Mini Action Icons Pill */}
              <div className="flex items-center gap-1 sm:gap-2 bg-[#f2eadf] border border-[#d8cdbd] px-3 py-1.5 rounded-full shadow-inner text-[#554332]">
                <button
                  onClick={() => alert("Alpine Explorers: Curated luxury & adventure travel expeditions worldwide.")}
                  className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center transition text-xs font-bold"
                  title="General Information"
                >
                  <Info size={13} />
                </button>
                <a
                  href="tel:+18001234567"
                  className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center transition text-xs"
                  title="Call Concierge"
                >
                  <Phone size={13} />
                </a>
                <a
                  href="mailto:info@alpineexplorers.com"
                  className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center transition text-xs"
                  title="Email Concierge"
                >
                  <Mail size={13} />
                </a>
              </div>
            </div>

            {/* BOARD MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              {/* LEFT / MAIN WEBSITE AREA (8 Cols) */}
              <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                
                {/* 1. HERO BANNER WITH GOLDEN GLOWING BORDER */}
                <div
                  className="relative rounded-2xl sm:rounded-[22px] overflow-hidden border-2 border-[#ffe082] shadow-[0_0_20px_rgba(255,215,100,0.55)] h-64 sm:h-72 md:h-80 group"
                >
                  {/* Mediterranean Coastal Travel Photograph (Santorini Blue Domes & Ocean) */}
                  <img
                    src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&h=900&fit=crop"
                    alt="Santorini Mediterranean Coast"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/35" />

                  {/* Subtle Inner Navigation Bar */}
                  <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between text-white text-xs z-20">
                    <span className="font-vintage font-bold tracking-wider opacity-90">
                      home page
                    </span>

                    <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-white/90">
                      <Link to="/home" className="hover:text-amber-300 transition">Home</Link>
                      <Link to="/about" className="hover:text-amber-300 transition">About</Link>
                      <Link to="/services" className="hover:text-amber-300 transition">Services</Link>
                      <Link to="/contact" className="hover:text-amber-300 transition">Contact</Link>
                      <button
                        onClick={onContactClick}
                        className="px-3 py-1 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white text-[11px] font-semibold border border-white/30 transition shadow-sm"
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>

                  {/* Inside Hero Main Headline & Button */}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white z-10">
                    <h2 className="font-vintage text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.08] max-w-lg drop-shadow-md">
                      EXPLORE THE WORLD<br />
                      WITH US
                    </h2>

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const el = document.getElementById('trending-tours')
                          if (el) el.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="px-5 py-2 rounded-full bg-white/95 hover:bg-white text-[#0f213d] font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition transform hover:scale-105 inline-flex items-center gap-2"
                      >
                        <span>Learn more</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. FOUR TRAVEL CATEGORY CARDS HORIZONTALLY ARRANGED */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {categoryCards.map((card) => {
                    const Illustration = card.component
                    const isSelected = activeCard === card.id

                    return (
                      <button
                        key={card.id}
                        onClick={() => {
                          setActiveCard(card.id)
                          if (onCategorySelect) onCategorySelect(card.filterKey)
                        }}
                        className={`rounded-2xl p-3.5 sm:p-4 text-center transition-all duration-300 flex flex-col items-center justify-between border bg-white ${
                          isSelected
                            ? 'border-[#ffcf48] shadow-[0_12px_28px_rgba(245,185,60,0.35)] ring-2 ring-[#ffd768]'
                            : 'border-[#ede2d2] shadow-[0_6px_16px_rgba(50,35,20,0.08)] hover:shadow-[0_10px_22px_rgba(50,35,20,0.14)] hover:-translate-y-1'
                        }`}
                      >
                        {/* 3D Illustration at Top */}
                        <div className="mb-2 transform hover:scale-110 transition duration-300">
                          <Illustration className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h3 className="font-vintage font-bold text-sm sm:text-base text-[#0d1d36] leading-tight">
                            {card.title}
                          </h3>
                          <span className="text-[11px] font-semibold text-[#8b6528] block mt-0.5">
                            {card.subtitle}
                          </span>
                          <p className="text-[10px] text-gray-500 leading-snug mt-1 line-clamp-2">
                            {card.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* RIGHT SIDE SECTION: TRAVEL GUIDES (REVIEWS & BLOGS) (4 Cols) */}
              <div className="lg:col-span-4 space-y-3">
                {/* Header */}
                <div className="pb-1">
                  <h3 className="font-vintage font-bold text-base sm:text-lg text-[#0d1d36] tracking-wider uppercase leading-tight">
                    TRAVEL GUIDES<br />
                    <span className="text-xs text-[#8c6628] font-sans font-bold">
                      (REVIEWS & BLOGS)
                    </span>
                  </h3>
                </div>

                {/* 3 Stacked Rounded Review & Blog Cards */}
                <div className="space-y-3">
                  {travelGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#ede3d4] shadow-[0_6px_16px_rgba(50,35,20,0.07)] hover:shadow-lg transition flex flex-col justify-between text-left"
                    >
                      {/* Top info for review vs scenic */}
                      {guide.type === 'review' ? (
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <img
                              src={guide.avatar}
                              alt={guide.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#e2d5c3]"
                            />
                            <div>
                              <span className="font-bold text-xs text-[#0f213d] block">{guide.name}</span>
                              <div className="flex text-[#f59e0b] gap-0.5">
                                {[...Array(guide.rating)].map((_, i) => (
                                  <Star key={i} size={11} className="fill-[#f59e0b]" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <h4 className="font-display font-bold text-sm text-[#0d1d36] mb-1">
                            {guide.title}
                          </h4>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mb-2">
                            {guide.text}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                            <img
                              src={guide.image}
                              alt={guide.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1.5 left-2 flex text-amber-300 gap-0.5">
                              {[...Array(guide.rating)].map((_, i) => (
                                <Star key={i} size={11} className="fill-amber-300" />
                              ))}
                            </div>
                          </div>
                          <h4 className="font-display font-bold text-sm text-[#0d1d36] mb-1">
                            {guide.title}
                          </h4>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mb-2">
                            {guide.text}
                          </p>
                        </div>
                      )}

                      {/* Learn more button */}
                      <div className="pt-1">
                        <button
                          onClick={() => setGuideModal(guide)}
                          className="text-[11px] font-bold text-[#0d1d36] hover:text-blue-600 transition inline-flex items-center gap-1 group/lm"
                        >
                          <span>Learn more</span>
                          <ArrowRight size={11} className="group-hover/lm:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM CENTER: REALISTIC VINTAGE BRASS COMPASS ROSE */}
            <div className="relative flex justify-center -mb-9 sm:-mb-11 mt-4 z-20">
              <button
                onClick={handleCompassClick}
                className="cursor-pointer group focus:outline-none"
                title="Click to spin the vintage compass!"
              >
                <motion.div
                  animate={{ rotate: compassRotation }}
                  transition={{ type: 'spring', stiffness: 70, damping: 14 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ede4d4] p-1 border-2 border-[#ffdb7d] shadow-[0_8px_20px_rgba(50,30,10,0.3)] flex items-center justify-center transform group-hover:scale-110 transition"
                >
                  <VintageBrassCompass className="w-full h-full" />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Detail Modal */}
      <AnimatePresence>
        {guideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="bg-[#fcfaf6] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-200 shadow-2xl space-y-4 text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <h4 className="font-vintage font-bold text-lg text-slate-900">{guideModal.title}</h4>
                </div>
                <button
                  onClick={() => setGuideModal(null)}
                  className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex text-amber-500 gap-1">
                {[...Array(guideModal.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                {guideModal.fullContent}
              </p>

              <div className="pt-3 border-t border-amber-100 flex justify-end">
                <button
                  onClick={() => setGuideModal(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
