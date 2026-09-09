import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Compass, ArrowRight, Sparkles, MapPin } from 'lucide-react'
import VintageSuitcase from '../components/vintage/VintageSuitcase'
import VintageAirplane from '../components/vintage/VintageAirplane'
import VintageCar from '../components/vintage/VintageCar'
import VintageMapPin from '../components/vintage/VintageMapPin'
import { SwissSummitStamp, AirMailSticker, PassportVisaStamp, HandDrawnRoute } from '../components/vintage/VintageStickers'

export default function Landing() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    window.scrollTo(0, 0)

    // GSAP Master Timeline for cinematic choreographed entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Newspaper/paper background slowly fades in
    tl.fromTo(
      '.paper-bg-base',
      { opacity: 0 },
      { opacity: 1, duration: 1.4, ease: 'power2.inOut' }
    )
    .fromTo(
      '.newspaper-texture-layer',
      { opacity: 0 },
      { opacity: 0.18, duration: 1.2 },
      '-=0.8'
    )

    // 2. Map appears with a smooth scale animation
    .fromTo(
      '.vintage-world-map',
      { opacity: 0, scale: 0.88 },
      { opacity: 0.35, scale: 1, duration: 1.5, ease: 'power2.out' },
      '-=0.9'
    )

    // 3. Torn paper layers slide into position from top and bottom
    .fromTo(
      '.torn-top-layer',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1 },
      '-=1.1'
    )
    .fromTo(
      '.torn-bottom-layer',
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1 },
      '<0.1'
    )

    // 4. Suitcase enters from the left with a slight rotation
    .fromTo(
      '.travel-suitcase',
      { x: -320, y: 30, rotation: -18, opacity: 0 },
      { x: 0, y: 0, rotation: -4, opacity: 1, duration: 1.3, ease: 'back.out(1.2)' },
      '-=0.8'
    )

    // 5. Vintage airplane flies from top-right toward center and moves slightly across
    .fromTo(
      '.vintage-airplane',
      { x: 380, y: -220, scale: 0.7, opacity: 0 },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' },
      '-=1.0'
    )

    // 6. Vintage car enters from the left/bottom with smooth movement
    .fromTo(
      '.vintage-car',
      { x: -350, y: 150, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1.3, ease: 'power2.out' },
      '-=0.9'
    )

    // 7. Travel map and location pin appear with a pop animation
    .fromTo(
      '.travel-map-pin',
      { scale: 0, opacity: 0, rotation: -15 },
      { scale: 1, opacity: 1, rotation: 6, duration: 0.9, ease: 'back.out(1.8)' },
      '-=0.7'
    )

    // 8. Main "Alpine Explorers" title appears using cinematic staggered text animation
    .fromTo(
      '.title-word-alpine span',
      { y: 70, opacity: 0, rotateX: 60 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(
      '.title-word-explorers span',
      { y: 70, opacity: 0, rotateX: 60 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.05, ease: 'power3.out' },
      '-=0.6'
    )

    // 9. Subtitle fades upward
    .fromTo(
      '.landing-subtitle-block',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.9 },
      '-=0.4'
    )

    // 10. Explore Now button scales from 0.8 to 1 with a smooth bounce
    .fromTo(
      '.landing-cta-btn',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1.1, 0.4)' },
      '-=0.3'
    )

    // 11. Travel stamps & stickers pop into position
    .fromTo(
      '.scrapbook-sticker',
      { opacity: 0, scale: 0.5, rotate: -20 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)' },
      '-=0.6'
    )
  }, [])

  // Mouse Parallax Effect (subtle & premium)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.height / 2) / (rect.height / 2)
    setMousePos({ x, y })

    gsap.to('.parallax-bg', {
      x: x * 10,
      y: y * 8,
      duration: 0.8,
      ease: 'power1.out',
    })
    gsap.to('.parallax-item-far', {
      x: -x * 20,
      y: -y * 15,
      duration: 1,
      ease: 'power1.out',
    })
    gsap.to('.parallax-item-mid', {
      x: x * 25,
      y: y * 20,
      duration: 0.7,
      ease: 'power1.out',
    })
    gsap.to('.parallax-item-near', {
      x: -x * 35,
      y: -y * 28,
      duration: 0.6,
      ease: 'power1.out',
    })
  }

  // Explore Now transition to /home
  const handleExploreNow = () => {
    setIsTransitioning(true)
    const tl = gsap.timeline({
      onComplete: () => navigate('/home'),
    })

    tl.to('.landing-center-content', {
      scale: 1.06,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    })
    .to(
      '.transition-paper-curtain',
      {
        scaleY: 1,
        duration: 0.6,
        ease: 'power3.inOut',
      },
      '-=0.2'
    )
  }

  const alpineChars = 'Alpine'.split('')
  const explorersChars = 'Explorers'.split('')

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden select-none bg-[#f4ebd9] text-[#2c1d11]"
      style={{ perspective: 1000 }}
    >
      {/* 1. VINTAGE PARCHMENT & AGED PAPER BACKGROUND */}
      <div
        className="paper-bg-base absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#f5ecd8',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #fbf6ec 0%, #f0e3c5 60%, #e0cda5 100%),
            radial-gradient(#c7af85 0.75px, transparent 0.75px)
          `,
          backgroundSize: '100% 100%, 28px 28px',
        }}
      />

      {/* Sepia Vignette Border */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          boxShadow: 'inset 0 0 120px rgba(78, 43, 16, 0.75)',
        }}
      />

      {/* 2. VINTAGE NEWSPAPER CLIPPINGS TEXTURE OVERLAY */}
      <div className="newspaper-texture-layer absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply overflow-hidden">
        <div className="absolute top-10 left-12 w-80 font-serif text-[11px] leading-relaxed text-amber-950/80 rotate-[-2deg]">
          <p className="font-bold uppercase tracking-widest text-xs border-b border-amber-900/30 pb-1 mb-1">
            The Continental Explorer • Vol. XLVIII
          </p>
          <p className="font-bold text-sm mb-1">Pioneering Routes Through The Swiss Massif</p>
          <p className="opacity-80">
            Reports from the high passes indicate favorable weather for the trans-alpine journey. Expedition teams have surveyed the glacier crossings from Zermatt to Chamonix with supreme success.
          </p>
        </div>

        <div className="absolute bottom-20 right-16 w-88 font-serif text-[11px] leading-relaxed text-amber-950/80 rotate-[3deg]">
          <p className="font-bold uppercase tracking-widest text-xs border-b border-amber-900/30 pb-1 mb-1">
            Wanderlust Gazette • Issue 1924
          </p>
          <p className="font-bold text-sm mb-1">Luxury Over-Mountain Touring Inaugurated</p>
          <p className="opacity-80">
            Steam locomotives, grand hotels, and private touring roadsters now connect the grandest summits of the Old World. Explorers are invited to register for upcoming guided expeditions.
          </p>
        </div>
      </div>

      {/* 3. VINTAGE WORLD MAP (Scales into place) */}
      <div className="vintage-world-map parallax-bg absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <svg
          viewBox="0 0 1200 700"
          className="w-[90%] h-[90%] max-w-6xl object-contain opacity-40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Latitude & Longitude Navigation Grid */}
          <ellipse cx="600" cy="350" rx="520" ry="280" stroke="#87582b" strokeWidth="1.2" strokeDasharray="6 4" />
          <ellipse cx="600" cy="350" rx="350" ry="280" stroke="#87582b" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="80" y1="350" x2="1120" y2="350" stroke="#87582b" strokeWidth="1.5" />
          <line x1="600" y1="70" x2="600" y2="630" stroke="#87582b" strokeWidth="1.5" />
          <line x1="80" y1="210" x2="1120" y2="210" stroke="#87582b" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="80" y1="490" x2="1120" y2="490" stroke="#87582b" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Continents outlines */}
          {/* Europe & Asia */}
          <path
            d="M520 220 Q560 180, 640 190 T750 200 T850 250 T920 330 Q880 380, 800 370 T720 330 T640 310 T560 300 Z"
            fill="#d8c5a2"
            stroke="#9c7849"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* Africa */}
          <path
            d="M540 320 Q590 310, 620 350 T640 430 T590 510 T530 460 T510 370 Z"
            fill="#d8c5a2"
            stroke="#9c7849"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* North America */}
          <path
            d="M220 180 Q320 160, 390 220 T360 310 T280 340 T200 270 Z"
            fill="#d8c5a2"
            stroke="#9c7849"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* South America */}
          <path
            d="M310 360 Q360 380, 370 440 T320 520 T270 450 Z"
            fill="#d8c5a2"
            stroke="#9c7849"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* Australia */}
          <path
            d="M840 430 Q910 420, 930 460 T870 510 T810 470 Z"
            fill="#d8c5a2"
            stroke="#9c7849"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Antique Compass Rose at corner */}
          <g transform="translate(200, 480)">
            <circle cx="0" cy="0" r="45" stroke="#9c7849" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points="0,-42 7,-10 0,-15 -7,-10" fill="#a72d1d" />
            <polygon points="0,42 7,10 0,15 -7,10" fill="#2c1d11" />
            <polygon points="42,0 10,7 15,0 10,-7" fill="#2c1d11" />
            <polygon points="-42,0 -10,7 -15,0 -10,-7" fill="#2c1d11" />
            <circle cx="0" cy="0" r="4" fill="#f4ebd9" stroke="#9c7849" strokeWidth="1.5" />
            <text x="0" y="-48" textAnchor="middle" fill="#a72d1d" fontSize="12" fontWeight="bold" fontFamily="serif">N</text>
          </g>
        </svg>
      </div>

      {/* 4. TORN PAPER EDGES (Top & Bottom) */}
      <div className="torn-top-layer absolute top-0 left-0 right-0 z-20 pointer-events-none torn-paper-edge">
        <svg viewBox="0 0 1440 65" className="w-full h-12 md:h-16 text-[#ece1ca]" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,35 Q1380,48 1320,30 T1200,42 T1080,26 T960,40 T840,24 T720,44 T600,28 T480,42 T360,25 T240,38 T120,28 T0,35 Z" />
        </svg>
      </div>

      <div className="torn-bottom-layer absolute bottom-0 left-0 right-0 z-20 pointer-events-none torn-paper-edge">
        <svg viewBox="0 0 1440 75" className="w-full h-14 md:h-20 text-[#ece1ca]" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,75 L1440,75 L1440,32 Q1360,18 1280,36 T1120,22 T960,40 T800,20 T640,38 T480,22 T320,40 T160,24 T0,36 Z" />
        </svg>
      </div>

      {/* 5. VINTAGE VOYAGE OBJECTS & ILLUSTRATIONS */}

      {/* Vintage Airplane (Top Right flying toward center) */}
      <div className="vintage-airplane parallax-item-near absolute top-12 right-6 md:top-16 md:right-28 z-20 pointer-events-none">
        <motion.div
          animate={{
            y: [-6, 8, -6],
            rotate: [-1, 2, -1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <VintageAirplane className="w-48 h-32 md:w-64 md:h-40" />
        </motion.div>
      </div>

      {/* Vintage Leather Suitcase (Left Center with slight tilt) */}
      <div className="travel-suitcase parallax-item-mid absolute bottom-28 left-4 md:bottom-32 md:left-20 z-20 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-4, -2, -4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <VintageSuitcase className="w-40 h-32 md:w-56 md:h-44" />
        </motion.div>
      </div>

      {/* Vintage Car (Bottom Left/Center) */}
      <div className="vintage-car parallax-item-near absolute bottom-8 left-1/4 md:left-[18%] z-10 pointer-events-none hidden sm:block">
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <VintageCar className="w-44 h-28 md:w-60 md:h-36" />
        </motion.div>
      </div>

      {/* Antique Folded Map & Brass Location Pin (Center Right) */}
      <div className="travel-map-pin parallax-item-mid absolute top-1/3 right-8 md:right-24 z-20 pointer-events-none hidden sm:block">
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotate: [5, 8, 5],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <VintageMapPin className="w-36 h-32 md:w-48 md:h-44" />
        </motion.div>
      </div>

      {/* 6. SCRAPBOOK TRAVEL STICKERS & POSTMARKS */}

      {/* Swiss Summit Stamp (Top Left) */}
      <div className="scrapbook-sticker parallax-item-far absolute top-16 left-8 md:top-20 md:left-28 z-10 pointer-events-none">
        <motion.div
          animate={{ rotate: [-6, -3, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="vintage-stamp"
        >
          <SwissSummitStamp className="w-24 h-24 md:w-32 md:h-32" />
        </motion.div>
      </div>

      {/* Air Mail Sticker (Bottom Right) */}
      <div className="scrapbook-sticker parallax-item-mid absolute bottom-24 right-8 md:bottom-28 md:right-32 z-20 pointer-events-none hidden sm:block">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [8, 11, 8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <AirMailSticker className="w-36 h-18 md:w-44 md:h-22" />
        </motion.div>
      </div>

      {/* Passport Visa Stamp (Top Center/Right) */}
      <div className="scrapbook-sticker parallax-item-far absolute top-24 right-1/3 z-10 pointer-events-none hidden md:block">
        <PassportVisaStamp className="w-36 h-22" />
      </div>

      {/* Hand Drawn Connecting Route in background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-10 pointer-events-none opacity-60">
        <HandDrawnRoute className="w-full max-w-5xl mx-auto" />
      </div>

      {/* 7. MAIN HERO CONTENT & VINTAGE TYPOGRAPHY */}
      <div className="landing-center-content relative z-30 min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto">
        {/* Established Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/10 border border-amber-900/20 text-amber-950 text-xs font-semibold uppercase tracking-[0.25em]"
        >
          <Compass size={14} className="text-amber-800 animate-spin" style={{ animationDuration: '14s' }} />
          <span>Curated Expeditions • Est. 1924</span>
        </motion.div>

        {/* Main Bold Title: "Alpine Explorers" */}
        <h1 className="font-vintage text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.92] mb-4 text-[#2b170a]">
          {/* Alpine Word */}
          <span className="title-word-alpine block overflow-hidden">
            {alpineChars.map((char, index) => (
              <span
                key={`alp-${index}`}
                className="inline-block vintage-letterpress bg-gradient-to-b from-[#381d0d] via-[#4d2812] to-[#251206] bg-clip-text text-transparent transform transition-transform hover:-translate-y-2 cursor-default"
              >
                {char}
              </span>
            ))}
          </span>

          {/* Explorers Word */}
          <span className="title-word-explorers block overflow-hidden mt-1 text-[#8b3d18]">
            {explorersChars.map((char, index) => (
              <span
                key={`exp-${index}`}
                className="inline-block bg-gradient-to-b from-[#9e3a15] via-[#822d0d] to-[#591b04] bg-clip-text text-transparent transform transition-transform hover:-translate-y-2 cursor-default"
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle Block with decorative brass dividers */}
        <div className="landing-subtitle-block flex flex-col items-center mt-3 mb-8 max-w-xl">
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-800/60" />
            <p className="font-display italic text-xl sm:text-2xl md:text-3xl text-amber-950 font-semibold tracking-wide">
              Travel Smarter, Travel Better
            </p>
            <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-800/60" />
          </div>

          <p className="font-body text-xs sm:text-sm md:text-base text-amber-900/80 mt-4 leading-relaxed max-w-lg font-medium">
            Immerse yourself in authentic journeys, scenic mountain passages, and handcrafted world tours curated for true adventurers.
          </p>
        </div>

        {/* 8. MAIN CTA: EXPLORE NOW BUTTON */}
        <div className="landing-cta-btn relative group">
          {/* Pulsing golden halo ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-60 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />

          <button
            onClick={handleExploreNow}
            className="relative px-10 sm:px-14 py-4 sm:py-5 bg-gradient-to-r from-[#2c170a] via-[#43230f] to-[#2c170a] text-amber-100 font-vintage font-bold text-lg sm:text-xl tracking-widest uppercase rounded-full border-2 border-[#d4af37] shadow-[0_12px_30px_rgba(44,23,10,0.45)] hover:shadow-[0_16px_40px_rgba(212,175,55,0.4)] transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
          >
            <span>Explore Now</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 flex items-center justify-center shadow-md group-hover:translate-x-1.5 transition-transform duration-300">
              <ArrowRight size={18} strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* Micro Traveler Footnote */}
        <p className="mt-8 text-[11px] sm:text-xs text-amber-950/70 font-mono tracking-wider flex items-center gap-2">
          <span>✈ 500+ Destinations</span>
          <span>•</span>
          <span>🏔️ Alpine Trails</span>
          <span>•</span>
          <span>★ 4.9/5 Explorer Rating</span>
        </p>
      </div>

      {/* 9. CINEMATIC CURTAIN PAPER TRANSITION TO /home */}
      <div
        className="transition-paper-curtain fixed inset-0 z-50 pointer-events-none bg-[#091526] origin-bottom transform scale-y-0 flex items-center justify-center text-amber-100"
        style={{ transition: 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)' }}
      >
        <div className="text-center p-6">
          <Compass size={48} className="text-amber-400 animate-spin mx-auto mb-4" />
          <h2 className="font-vintage text-3xl font-bold text-white tracking-widest uppercase">
            Entering Alpine Explorers
          </h2>
          <p className="text-sm text-blue-200 mt-2 font-body">Setting course for the grand dashboard...</p>
        </div>
      </div>
    </div>
  )
}
