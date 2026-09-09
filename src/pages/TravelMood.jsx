import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TourCard from '../components/TourCard'
import { getCatalog } from '../services/catalog'
import { ChevronRight, ChevronLeft, Sparkles, RefreshCw, Compass, CheckCircle2, Heart, Award } from 'lucide-react'

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

export default function TravelMood() {
  const [step, setStep] = useState(1)
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [tours, setTours] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    getCatalog().then(setTours).catch(() => setTours([]))
  }, [])

  const moods = [
    { id: 'Relax', name: 'Relax', emoji: '🏖️', desc: 'Serene beaches, luxury spas, tranquil rhythms' },
    { id: 'Adventure', name: 'Adventure', emoji: '⛰️', desc: 'High alpine summits, river rafting, rugged trails' },
    { id: 'Romantic', name: 'Romantic', emoji: '💕', desc: 'Candlelit cruises, historic palaces, couples retreats' },
    { id: 'Explore', name: 'Explore', emoji: '🗺️', desc: 'Cultural treasures, ancient cities, local traditions' },
    { id: 'Solo Travelers', name: 'Solo Travelers', emoji: '🧭', desc: 'Wilderness quests, dark sky stargazing, self discovery' },
  ]

  const destinations = [
    { id: 'Beach', name: 'Beach', emoji: '🏝️', desc: 'Turquoise waters, coral reef lagoons, coastal breezes' },
    { id: 'Mountain', name: 'Mountain', emoji: '🏔️', desc: 'Glacial peaks, high-altitude chalets, panoramic views' },
    { id: 'Nature', name: 'Nature', emoji: '🌲', desc: 'Pristine national parks, canyons, roaring rivers' },
    { id: 'Heritage', name: 'Heritage', emoji: '🏛️', desc: 'Fairytale castles, ancient temples, cobblestone lanes' },
  ]

  const budgets = [
    { id: 'Budget', name: 'Budget', emoji: '💰', range: 'Under $1,000 / guest', desc: 'High-value guided expeditions' },
    { id: 'Mid Range', name: 'Mid Range', emoji: '💵', range: '$1,000 - $1,500 / guest', desc: 'Premium comfort & scenic rail' },
    { id: 'Luxury', name: 'Luxury', emoji: '💎', range: '$1,500+ / guest', desc: '5-star resorts & private concierge' },
  ]

  const getRecommendedTours = () => {
    let matches = tours.filter((tour) => {
      const moodMatch = selectedMood ? tour.mood === selectedMood.id : true
      const destMatch = selectedDestination ? tour.destinationType === selectedDestination.id : true
      const budgetMatch = selectedBudget ? tour.budgetTier === selectedBudget.id : true
      return moodMatch || destMatch || budgetMatch
    })

    if (matches.length === 0) {
      matches = tours.slice(0, 3)
    }
    return matches
  }

  const handleReset = () => {
    setStep(1)
    setSelectedMood(null)
    setSelectedDestination(null)
    setSelectedBudget(null)
    setShowResults(false)
  }

  const optionCardStyle = (isSelected) => ({
    border: `1.5px solid ${isSelected ? NAVY : 'rgba(180,160,130,0.4)'}`,
    backgroundColor: isSelected ? 'rgba(212,175,55,0.09)' : '#fffdf5',
    boxShadow: isSelected
      ? '0 0 0 3px rgba(197,155,39,0.22), 0 12px 28px rgba(60,40,20,0.14)'
      : '0 6px 16px rgba(60,40,20,0.07)',
  })

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

      {/* Hero Banner */}
      <section className="relative h-80 sm:h-96 flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundColor: NAVY }}>
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=800&fit=crop"
            alt="Travel Mood"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,9,20,0.85) 0%, rgba(0,26,77,0.45) 60%, rgba(0,26,77,0.4) 100%)' }} />

        {/* decorative compass */}
        <div className="absolute left-6 top-6 opacity-30 pointer-events-none hidden sm:block">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="4 4" />
            <polygon points="50,14 56,44 50,38 44,44" fill="#d4af37" />
            <polygon points="50,86 43,56 50,62 57,56" fill="#faf5ea" />
          </svg>
        </div>
        <div className="absolute right-8 bottom-8 opacity-25 pointer-events-none hidden sm:block">
          <svg viewBox="0 0 60 80" width="38" height="50" fill="none">
            <path d="M30 72 V52" stroke="#6b8f5b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="38" r="18" fill="#4a6741" />
            <circle cx="18" cy="46" r="12" fill="#5b7a4d" />
            <circle cx="42" cy="46" r="12" fill="#5b7a4d" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="text-xl sm:text-2xl uppercase tracking-[0.3em] block mb-2" style={{ ...font.script, color: GOLD2 }}>
            AI Travel Recommendation Engine
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 text-white" style={{ ...font.vintage }}>
            Find Your Travel Mood
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-16" style={{ background: `linear-gradient(to right, transparent, ${GOLD2})` }} />
            <Compass size={20} style={{ color: GOLD2 }} />
            <div className="h-[2px] w-16" style={{ background: `linear-gradient(to left, transparent, ${GOLD2})` }} />
          </div>
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(250,245,234,0.92)', ...font.body }}>
            Four simple selections tailored to align your mindset, ideal terrain, and budget with curated world expeditions.
          </p>
        </div>
      </section>

      {/* Quiz / Results Body */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {!showResults ? (
          <div className="relative rounded-3xl p-6 sm:p-10 border"
            style={{ backgroundColor: CREAM, borderColor: 'rgba(180,160,130,0.28)', boxShadow: '0 14px 40px rgba(60,40,20,0.15), 0 2px 6px rgba(60,40,20,0.06)' }}>
            <div className="absolute -top-3 left-10 w-14 h-5 rounded-sm opacity-60" style={{ backgroundColor: 'rgba(245,230,196,0.9)', transform: 'rotate(2deg)' }} />

            {/* Step Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: 'rgba(58,42,24,0.7)', ...font.vintage }}>
                <span className={step >= 1 ? 'text-[#c59b27]' : ''}>1. Mood</span>
                <span className={step >= 2 ? 'text-[#c59b27]' : ''}>2. Destination Type</span>
                <span className={step >= 3 ? 'text-[#c59b27]' : ''}>3. Budget</span>
                <span className={showResults ? 'text-[#c59b27]' : ''}>4. Results</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex gap-1 p-0.5" style={{ backgroundColor: '#e9dcc0' }}>
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className="h-full flex-1 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: s <= step ? GOLD : 'rgba(180,160,130,0.25)',
                      boxShadow: s <= step ? '0 2px 8px rgba(197,155,39,0.4)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Mood */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: GOLD, ...font.vintage }}>Step 1 of 3</span>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ ...font.vintage, color: NAVY }}>
                    Choose Your Travel Mood
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>What kind of emotional journey are you seeking right now?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moods.map((mood) => {
                    const isSelected = selectedMood?.id === mood.id
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood)}
                        className="p-5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between"
                        style={optionCardStyle(isSelected)}
                      >
                        <div className="text-4xl mb-3">{mood.emoji}</div>
                        <div>
                          <h4 className="font-bold text-lg" style={{ ...font.display, color: isSelected ? NAVY : BROWN }}>
                            {mood.name}
                          </h4>
                          <p className="text-xs mt-1" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>{mood.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Destination Type */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: GOLD, ...font.vintage }}>Step 2 of 3</span>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ ...font.vintage, color: NAVY }}>
                    Choose Destination Type
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>Which landscape inspires your wanderlust the most?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinations.map((dest) => {
                    const isSelected = selectedDestination?.id === dest.id
                    return (
                      <button
                        key={dest.id}
                        onClick={() => setSelectedDestination(dest)}
                        className="p-6 rounded-2xl text-left transition-all duration-200 flex items-center gap-4"
                        style={optionCardStyle(isSelected)}
                      >
                        <div className="text-5xl">{dest.emoji}</div>
                        <div>
                          <h4 className="font-bold text-xl" style={{ ...font.display, color: isSelected ? NAVY : BROWN }}>
                            {dest.name}
                          </h4>
                          <p className="text-xs mt-1" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>{dest.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: GOLD, ...font.vintage }}>Step 3 of 3</span>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ ...font.vintage, color: NAVY }}>
                    Choose Your Budget
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>Select an investment tier for your expedition.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {budgets.map((budget) => {
                    const isSelected = selectedBudget?.id === budget.id
                    return (
                      <button
                        key={budget.id}
                        onClick={() => setSelectedBudget(budget)}
                        className="p-6 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between"
                        style={optionCardStyle(isSelected)}
                      >
                        <div className="text-4xl mb-3">{budget.emoji}</div>
                        <div>
                          <h4 className="font-bold text-lg" style={{ ...font.display, color: isSelected ? NAVY : BROWN }}>
                            {budget.name}
                          </h4>
                          <span className="text-xs font-bold block mt-1" style={{ color: GOLD }}>{budget.range}</span>
                          <p className="text-[11px] mt-1" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>{budget.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Quiz Step Navigation Buttons */}
            <div className="flex gap-4 mt-10 pt-6 border-t" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                style={{ border: `1.5px solid ${NAVY}`, color: NAVY, backgroundColor: 'transparent', ...font.vintage }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = NAVY } }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !selectedMood) ||
                    (step === 2 && !selectedDestination)
                  }
                  className="flex-1 py-3 text-white font-bold rounded-full text-xs sm:text-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: NAVY, ...font.vintage, boxShadow: '0 10px 24px rgba(0,26,77,0.3)' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = NAVY_MID }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY }}
                >
                  <span>Continue</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowResults(true)}
                  disabled={!selectedBudget}
                  className="flex-1 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: GOLD, color: NAVY, ...font.vintage, boxShadow: '0 10px 26px rgba(197,155,39,0.45)' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = GOLD2 }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = GOLD }}
                >
                  <Sparkles size={16} />
                  <span>Show Results</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Step 4: Show Results */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* Selections Summary Banner */}
            <div className="relative rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
              style={{ backgroundColor: NAVY, backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(0,26,77,0) 55%)', boxShadow: '0 18px 44px rgba(0,26,77,0.35)' }}>
              <div>
                <span className="text-xl block mb-1" style={{ ...font.script, color: GOLD2 }}>
                  Your Personalized Recommendation
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white" style={{ ...font.vintage }}>
                  Matches for {selectedMood?.name} • {selectedDestination?.name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ color: NAVY, backgroundColor: GOLD2, ...font.body }}>
                    Mood: {selectedMood?.emoji} {selectedMood?.name}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ color: NAVY, backgroundColor: GOLD2, ...font.body }}>
                    Type: {selectedDestination?.emoji} {selectedDestination?.name}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ color: NAVY, backgroundColor: GOLD2, ...font.body }}>
                    Budget: {selectedBudget?.name}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition whitespace-nowrap"
                style={{ border: `1.5px dashed ${GOLD2}`, color: GOLD2, ...font.vintage }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD2; e.currentTarget.style.color = NAVY }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = GOLD2 }}
              >
                <span className="inline-flex items-center gap-1.5"><RefreshCw size={14} /> Retake Quiz</span>
              </button>
            </div>

            {/* Recommended Tour Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getRecommendedTours().map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  )
}