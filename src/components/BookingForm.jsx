import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import TourApplicationForm from './TourApplicationForm'
import { serviceTours, serviceCategories } from '../data/servicesData'
import { ArrowRight, CheckCircle2, X } from 'lucide-react'

const RED = '#b3211f'
const NAVY = '#001a4d'

function findTourById(id) {
  for (const category of Object.keys(serviceTours)) {
    const found = serviceTours[category].find((t) => t.id === id)
    if (found) {
      const cat = serviceCategories.find((c) => c.slug === category)
      return { tour: found, category: cat }
    }
  }
  return { tour: null, category: null }
}

export default function BookingForm() {
  const { id } = useParams()
  const { tour } = findTourById(id)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Navbar />
        <div className="text-center py-32 px-4">
          <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: NAVY }} />
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Times New Roman', Times, serif", color: NAVY }}>
            Tour Not Found
          </h1>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-white font-bold text-sm"
            style={{ backgroundColor: RED, fontFamily: "'Times New Roman', Times, serif" }}
          >
            Browse Tours <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <Navbar />
      <main className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8 flex-1">
        <div className="mb-5 px-1 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Times New Roman', Times, serif", color: NAVY }}>
              Tour Application
            </h1>
            <p className="text-[13px]" style={{ fontFamily: "'Times New Roman', Times, serif", color: '#555' }}>
              {tour.title} — complete the form below to apply for the course.
            </p>
          </div>
          <Link
            to={`/tour/${tour.id}`}
            aria-label="Close form"
            title="Close form"
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition hover:text-white"
            style={{ borderColor: RED, color: RED }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = RED }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X size={16} />
          </Link>
        </div>
        <TourApplicationForm courseName={tour.title} />
      </main>
      <Footer />
    </div>
  )
}