import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Compass, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FamilyCustomizationForm from '../components/FamilyCustomizationForm'
import { serviceCategories, serviceTours } from '../data/servicesData'

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

const CARDS = serviceCategories.length
const PREPEND = 3
const carouselItems = [
  ...serviceCategories.slice(-PREPEND),
  ...serviceCategories,
  ...serviceCategories,
]

export default function Services() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const countRef = useRef(-1)
  const timerRef = useRef(null)
  const hoverRef = useRef(false)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })

  const [count, setCount] = useState(-1)
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(3)
  const [noTransition, setNoTransition] = useState(false)

  const activeOffset = visible === 1 ? 0 : 1
  const activeCell = (PREPEND + count + activeOffset + carouselItems.length * 2) % carouselItems.length
  const centerIndex = (((count + activeOffset) % CARDS) + CARDS) % CARDS

  const setCountBoth = useCallback((n) => {
    countRef.current = n
    setCount(n)
  }, [])

  const computeLayout = useCallback(() => {
    const vw = window.innerWidth
    const v = vw >= 1024 ? 3 : vw >= 640 ? 2 : 1
    setVisible(v)
    if (viewportRef.current) setStep(viewportRef.current.offsetWidth / v)
  }, [])

  useLayoutEffect(() => {
    computeLayout()
    const onResize = () => computeLayout()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [computeLayout])

  const next = useCallback(() => {
    const cur = countRef.current
    if (cur >= CARDS) {
      setNoTransition(true)
      setCountBoth(0)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false)
          setCountBoth(1)
        })
      })
      return
    }
    setCountBoth(cur + 1)
  }, [setCountBoth])

  const prev = useCallback(() => {
    const cur = countRef.current
    if (cur <= -1) {
      setNoTransition(true)
      setCountBoth(CARDS - 1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false)
          setCountBoth(CARDS - 2)
        })
      })
      return
    }
    setCountBoth(cur - 1)
  }, [setCountBoth])

  const goTo = useCallback((target) => {
    const cur = countRef.current
    const curCenter = (((cur + activeOffset) % CARDS) + CARDS) % CARDS
    let delta = ((target - curCenter) % CARDS + CARDS) % CARDS
    if (delta > CARDS / 2) delta -= CARDS
    setCountBoth(Math.max(-(PREPEND), Math.min(CARDS, cur + delta)))
  }, [activeOffset, setCountBoth])

  const startAuto = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!hoverRef.current) next()
    }, 4200)
  }, [next])

  useEffect(() => {
    startAuto()
    return () => clearInterval(timerRef.current)
  }, [startAuto])

  const stopAuto = useCallback(() => {
    hoverRef.current = true
    clearInterval(timerRef.current)
  }, [])

  const resumeAuto = useCallback(() => {
    hoverRef.current = false
    startAuto()
  }, [startAuto])

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=800&fit=crop"
          alt="Alpine Explorers Services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-3 max-w-3xl"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, boxShadow: '0 4px 12px rgba(197,155,39,0.4)' }}
              >
                <Compass size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: GOLD }}>
                Alpine Explorers
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight" style={font.vintage}>
              Our Services
            </h1>

            <p className="text-lg sm:text-xl text-white/80" style={{ ...font.display }}>
              From mountain peaks to tropical shores, we craft journeys that last a lifetime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories Carousel */}
      <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xl" style={{ ...font.script, color: GOLD }}>
            What we offer
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold mt-1" style={{ ...font.vintage, color: NAVY }}>
            Choose Your Journey
          </h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-[1.5px] w-12" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
            <p className="italic text-sm" style={{ ...font.display, color: 'rgba(58,42,24,0.6)' }}>
              Six categories, countless memories
            </p>
            <div className="h-[1.5px] w-12" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
          </div>
        </motion.div>

        <div className="relative" onMouseEnter={stopAuto} onMouseLeave={resumeAuto}>
          {/* Prev control */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous services"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center bg-[#faf5ea] border border-[rgba(197,155,39,0.55)] text-[#001a4d] shadow-[0_10px_24px_rgba(0,26,77,0.2)] hover:bg-[#001a4d] hover:text-[#d4af37] hover:border-[#001a4d] hover:scale-105 transition-all duration-300"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next control */}
          <button
            type="button"
            onClick={next}
            aria-label="Next services"
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center bg-[#faf5ea] border border-[rgba(197,155,39,0.55)] text-[#001a4d] shadow-[0_10px_24px_rgba(0,26,77,0.2)] hover:bg-[#001a4d] hover:text-[#d4af37] hover:border-[#001a4d] hover:scale-105 transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>

          {/* Viewport */}
          <div ref={viewportRef} className="overflow-hidden py-4">
            <div
              className="flex items-stretch"
              style={{
                transform: `translate3d(${-count * step}px, 0, 0)`,
                transition: noTransition ? 'none' : 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                willChange: 'transform',
              }}
            >
              {carouselItems.map((cat, i) => {
                const Icon = cat.icon
                const catTours = serviceTours[cat.slug] || []
                const tourCount = catTours.length
                const firstTour = catTours[0]
                const isOriginal = i >= PREPEND && i < PREPEND + CARDS
                const isActive = i === activeCell
                const cardStyle = {
                  transform: isActive ? 'scale(1.04)' : 'scale(0.95)',
                  opacity: isActive ? 1 : 0.78,
                  borderColor: isActive ? 'rgba(197,155,39,0.9)' : 'rgba(180,160,130,0.32)',
                  boxShadow: isActive
                    ? '0 26px 54px rgba(0,26,77,0.22)'
                    : '0 10px 24px rgba(60,40,20,0.1)',
                  transition: 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 700ms ease, border-color 700ms ease, box-shadow 700ms ease',
                }
                return (
                  <motion.div
                    key={`${cat.id}-${i}`}
                    className="h-full flex-shrink-0 px-2 sm:px-3"
                    style={{ flex: `0 0 ${step}px`, maxWidth: step ? `${step}px` : '100%' }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15 + (i % CARDS) * 0.07, ease: 'easeOut' }}
                    aria-hidden={!isOriginal}
                  >
                    <div className="h-full rounded-3xl border" style={cardStyle}>
                      <Link
                        to={`/services/${cat.slug}`}
                        tabIndex={isOriginal ? 0 : -1}
                        className="group relative block h-full bg-white rounded-3xl overflow-hidden flex flex-col"
                      >
                        {/* Card Image */}
                        <div className="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
                          <img
                            src={cat.heroImage}
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                          {/* Tour count badge */}
                          <div className="absolute top-3 right-3">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md"
                              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                            >
                              {tourCount} tour{tourCount !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Icon */}
                          <div className="absolute bottom-3 left-3">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                              style={{
                                background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                                boxShadow: '0 4px 12px rgba(197,155,39,0.4)',
                              }}
                            >
                              {Icon && <Icon size={22} className="text-white" />}
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3
                            className="text-lg font-bold mb-1 group-hover:text-[#c59b27] transition-colors"
                            style={{ fontFamily: 'Cinzel, serif', color: NAVY }}
                          >
                            {cat.name}
                          </h3>
                          <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'rgba(58,42,24,0.6)' }}>
                            {cat.description}
                          </p>

                          {/* Featured tour preview */}
                          {firstTour && (
                            <div className="flex items-center gap-3 p-2.5 rounded-xl mb-3 mt-auto last:mb-0" style={{ backgroundColor: 'rgba(197,155,39,0.06)' }}>
                              <img
                                src={firstTour.image}
                                alt={firstTour.title}
                                className="w-12 h-9 rounded-lg object-cover flex-shrink-0"
                                loading="lazy"
                              />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold truncate" style={{ color: NAVY }}>
                                  {firstTour.title}
                                </p>
                                <p className="text-[10px]" style={{ color: GOLD }}>
                                  Starting from ₹{new Intl.NumberFormat('en-IN').format(firstTour.price)}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center justify-between pt-2 mt-auto">
                            <span className="text-xs font-bold flex items-center gap-1 transition-colors" style={{ color: GOLD }}>
                              Explore Tours
                              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {serviceCategories.map((cat, i) => {
              const isActiveDot = i === centerIndex
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${cat.name}`}
                  className="flex items-center gap-1 p-1 rounded-full transition-transform hover:scale-110"
                >
                  <span
                    className="block h-[2px] rounded-full transition-all duration-500"
                    style={{
                      width: isActiveDot ? 28 : 12,
                      backgroundColor: isActiveDot ? GOLD : 'rgba(197,155,39,0.35)',
                    }}
                  />
                  <span
                    className="block rounded-full transition-all duration-500"
                    style={{
                      width: isActiveDot ? 11 : 7,
                      height: isActiveDot ? 11 : 7,
                      backgroundColor: isActiveDot ? NAVY : 'rgba(0,26,77,0.22)',
                      border: `2px solid ${isActiveDot ? GOLD : 'transparent'}`,
                      boxShadow: isActiveDot ? '0 0 0 2px rgba(197,155,39,0.35)' : 'none',
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Family Customization Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-xl" style={{ ...font.script, color: GOLD }}>
            Special for families
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ ...font.vintage, color: NAVY }}>
            Customize Your Family Tour
          </h2>
          <p className="text-sm mt-2" style={{ color: 'rgba(58,42,24,0.6)' }}>
            Tell us your preferences and our travel experts will create the perfect family itinerary
          </p>
        </motion.div>
        <FamilyCustomizationForm />
      </section>

      {/* Final CTA */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={font.vintage}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/70 mb-8 text-sm sm:text-base">
            Contact our travel experts today and let us plan your dream vacation
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              Contact Us <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/1800257463?text=Hello%20Alpine%20Explorers!%20I%20need%20help%20planning%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl font-bold text-sm border-2 border-white/30 text-white hover:bg-white/10 transition flex items-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
