import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Mountain, ArrowLeft, ShieldCheck } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import MultiTravelerBooking from './MultiTravelerBooking'
import { serviceTours } from '../data/servicesData'
import { tours as dataTours } from '../data/data'
import { getCatalog } from '../services/catalog'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'

function findTourById(id) {
  if (!id) return null
  for (const cat of Object.keys(serviceTours)) {
    const found = serviceTours[cat].find((t) => String(t.id) === String(id))
    if (found) return found
  }
  const numeric = dataTours.find((t) => String(t.id) === String(id))
  return numeric || null
}

export default function BookingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile, openAuthModal } = useSupabaseAuth()

  const [tour, setTour] = useState(() => findTourById(id))
  const [tourLoading, setTourLoading] = useState(!findTourById(id))

  // Async load from catalog for DB-sourced tours (dom-*, int-*, adv-*, camp-*)
  useEffect(() => {
    const staticTour = findTourById(id)
    if (staticTour) {
      setTour(staticTour)
      setTourLoading(false)
      return
    }
    setTourLoading(true)
    getCatalog()
      .then((catalog) => {
        const found = catalog.find(
          (t) =>
            t.id === id ||
            String(t.id) === String(id) ||
            `int-${t.id}` === id ||
            `dom-${t.id}` === id ||
            `adv-${t.id}` === id ||
            `camp-${t.id}` === id
        )
        setTour(found || null)
      })
      .catch(() => setTour(null))
      .finally(() => setTourLoading(false))
  }, [id])

  useEffect(() => {
    if (!user && !tourLoading) {
      openAuthModal({
        message: 'Login or create an account to continue with your booking.',
        targetTour: tour,
        onSuccess: () => navigate(`/booking/${id}`, { replace: true }),
      })
    }
  }, [user, id, tourLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (tourLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center py-32">
          <div style={{
            width: 44,
            height: 44,
            border: '3px solid rgba(197,155,39,0.2)',
            borderTop: '3px solid var(--ae-gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p className="mt-4 text-sm" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>Loading booking details…</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center py-32 px-4">
          <Mountain size={48} className="mb-4" style={{ color: NAVY, opacity: 0.3 }} />
          <h1 className="text-2xl font-bold mb-3" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center py-32 px-4">
          <ShieldCheck size={48} className="mb-4" style={{ color: GOLD, opacity: 0.7 }} />
          <h1 className="text-xl font-bold mb-3" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
            Login Required
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Please login or sign up to continue with your booking.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal({ message: 'Login to continue with your booking.', targetTour: tour, onSuccess: () => {} })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm cursor-pointer shadow-md"
            style={{ backgroundColor: NAVY }}
          >
            Login / Sign Up
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgb(var(--ae-ink-rgb) /0.6)' }}>
          <Link to="/services" className="hover:underline font-medium" style={{ color: NAVY }}>Tours</Link>
          <span>›</span>
          <Link to={`/tour/${tour.id}`} className="hover:underline font-medium" style={{ color: NAVY }}>
            {tour.title}
          </Link>
          <span>›</span>
          <span className="font-semibold" style={{ color: NAVY }}>Book Now</span>
        </div>

        <MultiTravelerBooking tour={tour} user={user} profile={profile} />
      </main>
      <Footer />
    </div>
  )
}