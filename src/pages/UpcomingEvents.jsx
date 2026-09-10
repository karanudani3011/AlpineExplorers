import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Calendar, Clock, MapPin, ArrowRight, Compass, Ticket } from 'lucide-react'

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

const events = [
  {
    id: 1,
    title: 'Himalayan Heritage Motorcycle Rally',
    date: '12 October 2026',
    month: 'OCT',
    day: '12',
    time: '6:00 AM',
    location: 'Leh · Ladakh',
    description: 'A 7-day solo-friendly rally through high mountain passes, ancient monasteries, and dramatic river valleys — riding the legendary Leh–Manali circuit with expert guides.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=700&fit=crop',
    badge: 'Adventure',
    tag: 'Go Solo · Riding',
  },
  {
    id: 2,
    title: 'Golden Hour Trekkers Meetup · Kullu',
    date: '26 October 2026',
    month: 'OCT',
    day: '26',
    time: '5:30 AM',
    location: 'Kullu Valley · Himachal',
    description: 'A sunrise group trek to a hidden alpine meadow followed by a traveller meet-and-greet, bonfire stories, and planning sessions for upcoming expeditions.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=700&fit=crop',
    badge: 'Trek',
    tag: 'Group · Beginner friendly',
  },
  {
    id: 3,
    title: 'Aegean Island Odyssey Info Evening',
    date: '08 November 2026',
    month: 'NOV',
    day: '08',
    time: '7:00 PM',
    location: 'Mumbai · Online + In-Person',
    description: 'An exclusive preview of our Greece–Turkey island sailing journey. Meet the trip leaders, taste regional cuisine, and secure early-bird pricing for the December departure.',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&h=700&fit=crop',
    badge: 'International',
    tag: 'Preview · Free entry',
  },
  {
    id: 4,
    title: 'Spiti Winter Expedition Launch',
    date: '21 November 2026',
    month: 'NOV',
    day: '21',
    time: '8:00 AM',
    location: 'Spiti Valley · Himachal',
    description: 'The season opener for our famous winter Spiti expedition — frozen rivers, snowbound villages, and star-filled skies above the highest inhabited valley in India.',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&h=700&fit=crop',
    badge: 'Mountain',
    tag: 'Winter · Expedition',
  },
  {
    id: 5,
    title: 'Family Rockies Discovery Orientations',
    date: '05 December 2026',
    month: 'DEC',
    day: '05',
    time: '11:00 AM',
    location: 'Delhi · In-Person + Live',
    description: 'Orientation for families joining our Rockies Discovery tour — itinerary walkthrough, packing guidance, and Q&A with our family-travel specialists.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=700&fit=crop',
    badge: 'Family',
    tag: 'Orientation · Q&A',
  },
  {
    id: 6,
    title: 'New Year Eve · Rishikesh Riverside Camp',
    date: '28 December 2026',
    month: 'DEC',
    day: '28',
    time: '2:00 PM',
    location: 'Rishikesh · Uttarakhand',
    description: 'Three nights of riverside camping, rafting, yoga at sunrise, and a golden bonfire gala to welcome the new year under the Garhwal sky.',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&h=700&fit=crop',
    badge: 'Camp',
    tag: 'Family · Celebration',
  },
]

export default function UpcomingEvents() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.78) 0%, rgba(0,26,77,0.25) 55%, rgba(3,9,20,0.35) 100%)' }} />

              {/* tape */}
              <div className="absolute top-4 left-5 w-16 h-5 rounded-sm opacity-70" style={{ backgroundColor: 'rgba(245,230,196,0.85)', transform: 'rotate(-3deg)' }} />
              <div className="absolute top-6 right-6 rotate-[8deg]">
                <div className="px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(212,175,55,0.92)', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
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
                <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(250,245,234,0.92)', ...font.body }}>
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
              <p className="text-sm" style={{ color: 'rgba(58,42,24,0.7)', ...font.body }}>
                Reserve early — many events have a limited number of seats.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(212,175,55,0.14)', border: '1px solid rgba(197,155,39,0.4)' }}>
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
                style={{ backgroundColor: CREAM, boxShadow: '0 10px 26px rgba(60,40,20,0.12), 0 2px 6px rgba(60,40,20,0.05)', border: '1px solid rgba(180,160,130,0.28)' }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.55) 0%, rgba(0,26,77,0.05) 60%, transparent 100%)' }} />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'rgba(212,175,55,0.92)', color: NAVY, ...font.vintage }}>
                      {ev.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <div className="px-2.5 py-1.5 rounded-lg text-center" style={{ backgroundColor: 'rgba(250,245,234,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
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
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(58,42,24,0.75)', ...font.body }}>
                      <Calendar size={13} style={{ color: GOLD }} />
                      <span className="font-semibold">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(58,42,24,0.75)', ...font.body }}>
                      <Clock size={13} style={{ color: GOLD }} />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(58,42,24,0.75)', ...font.body }}>
                      <MapPin size={13} style={{ color: GOLD }} />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'rgba(58,42,24,0.85)', ...font.body }}>
                    {ev.description}
                  </p>

                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px dashed rgba(180,160,130,0.5)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>{ev.tag}</span>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition"
                      style={{ backgroundColor: NAVY, color: CREAM }}
                    >
                      <Ticket size={13} />
                      Reserve Seat
                      <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
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
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, boxShadow: '0 16px 40px rgba(0,26,77,0.3)' }}
          >
            <div className="absolute top-4 right-6 opacity-20 text-6xl" style={{ fontFamily: 'Caveat, cursive', color: GOLD2 }}>Join us!</div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#fff', ...font.vintage }}>
              Don&apos;t Miss the Next Departure
            </h3>
            <p className="text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed" style={{ color: 'rgba(250,245,234,0.85)', ...font.body }}>
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
    </div>
  )
}