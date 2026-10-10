import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InquireButton from '../components/InquireButton'
import BookNowButton from '../components/BookNowButton'
import BookingModal from '../components/BookingModal'
import TourImageSlider from '../components/TourImageSlider'
import { eventImages } from '../data/eventImages'
import { events as defaultEvents } from '../data/eventsData'
import { Calendar, Clock, MapPin, ArrowRight, Compass } from 'lucide-react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { usePublicEvents } from '../services/usePublic'

const NAVY = 'var(--ae-navy)'
const NAVY_MID = 'var(--ae-navy-mid)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'
const CREAM = 'var(--ae-cream)'
const BROWN = 'var(--ae-ink)'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

export default function UpcomingEvents() {
  const { user, openAuthModal } = useSupabaseAuth()
  const { events } = usePublicEvents(defaultEvents)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [selectedItem, setSelectedItem] = useState(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const openBooking = (item) => {
    if (user) {
      setSelectedItem(item)
      setIsBookingModalOpen(true)
    } else {
      openAuthModal({
        message: 'Login or create an account to book this event.',
        onSuccess: () => {
          setSelectedItem(item)
          setIsBookingModalOpen(true)
        },
      })
    }
  }

  const closeBooking = () => {
    setIsBookingModalOpen(false)
    setSelectedItem(null)
  }

  return (
    <div className="min-h-screen relative"
      style={{
        backgroundColor: 'var(--ae-bg-paper)',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, var(--ae-bg-glow) 0%, var(--ae-bg-mid) 60%, var(--ae-bg-edge) 100%),
          radial-gradient(#c7af85 0.75px, transparent 0.75px)`,
        backgroundSize: '100% 100%, 28px 28px',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      {/* Hero */}
      <section className="py-14 md:py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: CREAM, boxShadow: '0 12px 34px rgba(60,40,20,0.14), 0 2px 6px rgba(60,40,20,0.06)', border: '1px solid rgba(180,160,130,0.28)' }}>
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&h=700&fit=crop"
                alt="Upcoming travel events under mountain skies"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(var(--ae-navy-rgb) /0.78) 0%, rgb(var(--ae-navy-rgb) /0.25) 55%, rgba(3,9,20,0.35) 100%)' }} />

              {/* tape */}
              <div className="absolute top-4 left-5 w-16 h-5 rounded-sm opacity-70" style={{ backgroundColor: 'rgba(245,230,196,0.85)', transform: 'rotate(-3deg)' }} />
              <div className="absolute top-6 right-6 rotate-[8deg]">
                <div className="px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgb(var(--ae-gold2-rgb) /0.92)', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: NAVY, ...font.vintage }}>Mark your calendars</span>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl mb-2" style={{ ...font.script, color: GOLD2 }}>
                  Expeditions · Launches · Meetups
                </motion.span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3" style={{ ...font.vintage }}>
                  Upcoming Events
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-14" style={{ background: `linear-gradient(to right, transparent, ${GOLD2})` }} />
                  <Compass size={20} style={{ color: GOLD2 }} />
                  <div className="h-[2px] w-14" style={{ background: `linear-gradient(to left, transparent, ${GOLD2})` }} />
                </div>
                <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgb(var(--ae-cream-rgb) /0.92)', ...font.body }}>
                  Seasonal expeditions, tour launches, treks, and traveller meetups — join the Alpine Explorers family for the moments in between.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10 text-center sm:text-left"
          >
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: NAVY, ...font.vintage }}>
                Season of Adventures
              </h2>
              <p className="text-sm" style={{ color: 'rgb(var(--ae-ink-rgb) /0.7)', ...font.body }}>
                Reserve early — many events have a limited number of seats.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgb(var(--ae-gold2-rgb) /0.14)', border: '1px solid rgb(var(--ae-gold-rgb) /0.4)' }}>
              <Calendar size={16} style={{ color: GOLD }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>Oct – Dec 2026</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((ev, i) => (
              <motion.article
                key={ev.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className="group rounded-2xl overflow-hidden flex flex-col relative"
              >
                <div className="relative h-52 overflow-hidden">
                  <TourImageSlider
                    images={(() => {
                      const list = (Array.isArray(ev.gallery) && ev.gallery.length > 0)
                        ? ev.gallery
                        : (Array.isArray(ev.images) && ev.images.length > 0 ? ev.images : (eventImages[ev.id] || (ev.image ? [ev.image] : [])))
                      return Array.from(new Set(list.filter(Boolean))).slice(0, 4)
                    })()}
                    alt={ev.title}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(var(--ae-navy-rgb) /0.55) 0%, rgb(var(--ae-navy-rgb) /0.05) 60%, transparent 100%)' }} />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'rgb(var(--ae-gold2-rgb) /0.92)', color: NAVY, ...font.vintage }}>
                      {ev.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <div className="px-2.5 py-1.5 rounded-lg text-center" style={{ backgroundColor: 'rgb(var(--ae-cream-rgb) /0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                      <div className="text-sm font-black leading-none" style={{ color: NAVY, ...font.vintage }}>{ev.day}</div>
                      <div className="text-[9px] font-bold tracking-wide" style={{ color: GOLD }}>{ev.month}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-lg font-bold leading-snug mb-3 transition-colors" style={{ color: NAVY, ...font.vintage }}>
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgb(var(--ae-ink-rgb) /0.75)', ...font.body }}>
                      <Calendar size={13} style={{ color: GOLD }} />
                      <span className="font-semibold">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgb(var(--ae-ink-rgb) /0.75)', ...font.body }}>
                      <Clock size={13} style={{ color: GOLD }} />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgb(var(--ae-ink-rgb) /0.75)', ...font.body }}>
                      <MapPin size={13} style={{ color: GOLD }} />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'rgb(var(--ae-ink-rgb) /0.85)', ...font.body }}>
                    {ev.description}
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-3 flex-wrap" style={{ borderTop: '1px dashed rgba(180,160,130,0.5)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>{ev.tag}</span>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <InquireButton
                        item={ev}
                        className="group/iq px-3 py-2 rounded-lg text-xs font-bold border"
                        style={{ backgroundColor: '#ffffff', borderColor: 'rgb(var(--ae-gold-rgb) /0.6)', color: NAVY }}
                        hoverStyle={{ backgroundColor: 'rgb(var(--ae-gold2-rgb) /0.18)', borderColor: GOLD }}
                      />
                      <BookNowButton
                        item={ev}
                        onOpen={openBooking}
                        showArrow
                        className="group px-3 py-2 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: NAVY, color: CREAM }}
                        hoverStyle={{ backgroundColor: NAVY_MID }}
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14 rounded-2xl p-8 sm:p-10 text-center overflow-hidden relative"
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, boxShadow: '0 16px 40px rgb(var(--ae-navy-rgb) /0.3)' }}
          >
            <div className="absolute top-4 right-6 opacity-20 text-6xl" style={{ fontFamily: 'Caveat, cursive', color: GOLD2 }}>Join us!</div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#fff', ...font.vintage }}>
              Don&apos;t Miss the Next Departure
            </h3>
            <p className="text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed" style={{ color: 'rgb(var(--ae-cream-rgb) /0.85)', ...font.body }}>
              Subscribe to our event alerts and be the first to know about launches, early-bird pricing, and special traveller meetups.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              Get Event Alerts
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      <BookingModal
        item={selectedItem}
        isOpen={isBookingModalOpen}
        onClose={closeBooking}
      />
    </div>
  )
}