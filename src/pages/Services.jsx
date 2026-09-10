import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, CheckCircle, Award, Heart, MapPin } from 'lucide-react'
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

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Services() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

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

      {/* Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              Five categories, countless memories
            </p>
            <div className="h-[1.5px] w-12" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {serviceCategories.map((cat) => {
            const Icon = cat.icon
            const tourCount = serviceTours[cat.slug]?.length || 0
            const firstTour = serviceTours[cat.slug]?.[0]

            return (
              <motion.div key={cat.id} variants={item}>
                <Link
                  to={`/services/${cat.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 h-full"
                  style={{ transform: 'none' }}
                >
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden">
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
                  <div className="p-5">
                    <h3
                      className="text-lg font-bold mb-1 group-hover:text-[#c59b27] transition-colors"
                      style={{ fontFamily: 'Cinzel, serif', color: NAVY }}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(58,42,24,0.6)' }}>
                      {cat.description}
                    </p>

                    {/* Featured tour preview */}
                    {firstTour && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl mb-3" style={{ backgroundColor: 'rgba(197,155,39,0.06)' }}>
                        <img
                          src={firstTour.image}
                          alt={firstTour.title}
                          className="w-12 h-9 rounded-lg object-cover flex-shrink-0"
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1 transition-colors" style={{ color: GOLD }}>
                        Explore Tours
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16" style={{ backgroundColor: 'rgba(0,26,77,0.03)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...font.vintage, color: NAVY }}>
              Why Choose Alpine Explorers
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: CheckCircle, title: 'Trusted Since 1998', desc: 'Over 25 years of crafting unforgettable journeys' },
              { icon: Award, title: 'Award-Winning', desc: 'Recognized for excellence in travel services' },
              { icon: Compass, title: 'Expert Guides', desc: 'Certified, multilingual, and passionate leaders' },
              { icon: Heart, title: '25,000+ Happy Travelers', desc: 'Families and adventurers who trust us' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                >
                  <feat.icon size={22} className="text-white" />
                </div>
                <h4 className="font-bold text-sm mb-1" style={{ fontFamily: 'Cinzel, serif', color: NAVY }}>
                  {feat.title}
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(58,42,24,0.6)' }}>
                  {feat.desc}
                </p>
              </motion.div>
            ))}
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
