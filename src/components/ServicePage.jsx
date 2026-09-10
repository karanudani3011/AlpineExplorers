import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import TourGrid from './TourGrid'
import { serviceCategories, serviceTours } from '../data/servicesData'

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
}

export default function ServicePage() {
  const { slug } = useParams()
  const category = serviceCategories.find((c) => c.slug === slug)
  const tours = serviceTours[slug] || []

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: CREAM }}>
        <Navbar />
        <div className="text-center py-32">
          <h1 className="text-3xl font-bold mb-4" style={{ color: NAVY, ...font.vintage }}>
            Service Not Found
          </h1>
          <p className="mb-6" style={{ color: BROWN }}>
            The service category you're looking for doesn't exist.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition"
            style={{ backgroundColor: NAVY }}
          >
            Browse Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const Icon = category.icon

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[55vh] sm:h-[65vh] flex items-end overflow-hidden">
        <motion.img
          src={category.heroImage}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
              <Link to="/home" className="hover:text-white transition">Home</Link>
              <ChevronRight size={14} />
              <Link to="/services" className="hover:text-white transition">Services</Link>
              <ChevronRight size={14} />
              <span className="text-white font-medium">{category.shortName}</span>
            </nav>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4 max-w-3xl"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD.replace('#', '##')})`,
                  boxShadow: '0 4px 15px rgba(197,155,39,0.4)',
                }}
              >
                {Icon && <Icon size={24} className="text-white" />}
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: GOLD }}>
                Alpine Explorers
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
              style={{ ...font.vintage, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              {category.name}
            </h1>

            <p className="text-lg sm:text-xl text-white/85" style={{ ...font.display }}>
              {category.tagline}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm text-white/70">
                {tours.length} tour{tours.length !== 1 ? 's' : ''} available
              </span>
              <div className="h-4 w-px bg-white/30" />
              <span className="text-sm text-white/70">Dedicated concierge support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: BROWN }}>
            {category.description}
          </p>
        </motion.div>
      </section>

      {/* Tour Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {tours.length > 0 ? (
          <TourGrid tours={tours} category={category} />
        ) : (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: BROWN }}>
              Tours coming soon. Contact us for custom packages.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl text-white font-bold text-sm transition"
              style={{ backgroundColor: NAVY }}
            >
              View Other Services <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${NAVY}, #0d3a80)` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={font.vintage}>
            Can't Find What You're Looking For?
          </h2>
          <p className="text-white/70 mb-8 text-sm sm:text-base">
            Our travel experts can create a completely customized {category.shortName.toLowerCase()} experience just for you.
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
              href={`https://wa.me/1800257463?text=${encodeURIComponent(`Hello Alpine Explorers! I'm interested in ${category.name} packages. Please share more details.`)}`}
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
