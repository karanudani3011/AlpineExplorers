import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { Mountain, ArrowLeft, ShieldCheck, Lock, MessageSquare } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import MultiTravelerBooking from './MultiTravelerBooking'
import { serviceTours } from '../data/servicesData'
import { tours as dataTours } from '../data/data'
import { getCatalog } from '../services/catalog'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { api } from '../services/api'

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
  const location = useLocation()
  const { user, profile, openAuthModal } = useSupabaseAuth()

  const [tour, setTour] = useState(() => location.state?.tour || findTourById(id))
  const [tourLoading, setTourLoading] = useState(!location.state?.tour && !findTourById(id))
  const [bookingSettings, setBookingSettings] = useState({
    qr_payment_enabled: true,
    closed_message: 'Bookings are currently full. Please contact us for the next available dates.'
  })

  useEffect(() => {
    api.get('/api/public/booking-settings')
      .then((data) => {
        if (data?.settings) setBookingSettings(data.settings)
      })
      .catch(() => {})
  }, [])

  // Async load from catalog for DB-sourced tours (dom-*, int-*, adv-*, camp-*)
  useEffect(() => {
    if (location.state?.tour) {
      setTour(location.state.tour)
      setTourLoading(false)
      return
    }
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
  }, [id, location.state])

  useEffect(() => {
    if (!user && !tourLoading) {
      openAuthModal({
        message: 'Login or create an account to continue with your booking.',
        targetTour: tour,
        onSuccess: () => navigate(`/booking/${id}`, { replace: true }),
      })
    }
  }, [user, id, tourLoading]) // eslint-disable-line react-hooks/exhaustive-deps


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

  const isTourFull = tour?.booking_open === 0 || tour?.booking_open === false || (tour?.seats_total > 0 && (tour?.seats_booked || 0) >= tour?.seats_total)
  const isBookingClosed = !bookingSettings.qr_payment_enabled || isTourFull

  if (isBookingClosed) {
    const whatsappMsg = `Hello Alpine Explorers!\n\nI wanted to book the tour: ${tour?.title || 'Tour'}.\nBookings are currently full/closed. Please notify me when dates become available.`
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center py-24 px-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-amber-500/10 border border-amber-500/20 text-amber-600">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
            Bookings Currently Full
          </h1>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed bg-amber-50 border border-amber-200/80 rounded-xl p-4">
            {bookingSettings.closed_message || 'Bookings are currently full. Please contact us for the next available dates.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`https://wa.me/919979883339?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
            >
              <MessageSquare size={16} /> Contact us / WhatsApp
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft size={15} /> Browse Other Tours
            </Link>
          </div>
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
