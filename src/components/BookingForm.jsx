import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import MultiTravelerBooking from './MultiTravelerBooking'
import { serviceTours, serviceCategories } from '../data/servicesData'
import { ArrowLeft, Mountain } from 'lucide-react'

const NAVY = '#001a4d'
const GOLD = '#c59b27'

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
  const { tour, category } = findTourById(id)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center py-32 px-4">
          <Mountain size={48} className="mb-4" style={{ color: NAVY, opacity: 0.3 }} />
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}
          >
            Tour Not Found
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            The tour you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{ backgroundColor: NAVY }}
          >
            <ArrowLeft size={15} /> Browse Tours
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link to={`/tour/${tour.id}`} className="hover:underline" style={{ color: NAVY }}>
                ← Back to Tour
              </Link>
            </div>
            <h1
              className="text-xl sm:text-2xl font-bold"
              style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}
            >
              Book Your Adventure
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {tour.title} — Complete the application form below to secure your spot.
            </p>
          </div>
        </div>

        {/* Multi-Traveler Booking Wizard */}
        <MultiTravelerBooking tour={tour} />
      </main>

      <Footer />
    </div>
  )
}