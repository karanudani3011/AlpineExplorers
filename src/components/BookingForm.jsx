import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mountain, ArrowLeft, MapPin, Clock, Calendar, Users, CreditCard,
  Phone, Mail, User, MessageSquare, CheckCircle2, AlertCircle,
  Loader2, Ticket, ArrowRight, ShieldCheck, Edit3, Lock
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import PaymentScreen from './booking/PaymentScreen'
import { serviceTours } from '../data/servicesData'
import { tours as dataTours } from '../data/data'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { supabase } from '../services/supabaseClient'
import { api } from '../services/api'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(amount) {
  if (!amount || amount <= 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return 'Flexible / To be confirmed'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function generateBookingRef() {
  const year = new Date().getFullYear()
  const seq = String(Math.floor(10000 + Math.random() * 89999))
  return `ALP-${year}-${seq}`
}

function findTourById(id) {
  for (const cat of Object.keys(serviceTours)) {
    const found = serviceTours[cat].find((t) => t.id === id)
    if (found) return found
  }
  const numeric = dataTours.find((t) => String(t.id) === String(id))
  return numeric || null
}

// ── Input Field Component ─────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-wider mb-1.5"
        style={{ color: NAVY }}
      >
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition
          focus:ring-2 focus:ring-[#001a4d]/20 focus:border-[#001a4d]`}
        style={{ borderColor: 'rgba(180,160,130,0.45)', color: BROWN, backgroundColor: '#ffffff' }}
      />
    </div>
  )
}

// ── Booking Confirmation Screen ───────────────────────────────────────────────

function BookingConfirmation({ booking, tour, onViewMyBookings }) {
  const isPaid = booking.payment_status === 'paid'
  const isPendingVerification = booking.payment_status === 'pending_verification'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden text-center"
      style={{ border: '1px solid rgba(212,175,55,0.4)', backgroundColor: '#ffffff', boxShadow: '0 8px 30px rgba(0,26,77,0.12)' }}
    >
      {/* Success banner */}
      <div className="py-10 px-6" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(212,175,55,0.2)', border: '2px solid rgba(212,175,55,0.5)' }}
        >
          <CheckCircle2 size={36} style={{ color: GOLD2 }} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          {isPaid ? 'Booking Confirmed!' : 'Booking Request Received!'}
        </h2>
        <p className="text-sm" style={{ color: 'rgba(250,245,234,0.85)' }}>
          {isPaid
            ? 'Thank you! Your payment is confirmed and your booking is secured.'
            : isPendingVerification
            ? 'Thank you! We received your UPI payment confirmation and our team is verifying it.'
            : 'Thank you! Our team will review your booking details shortly.'}
        </p>
      </div>

      {/* Booking Reference */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
        <div
          className="inline-block px-6 py-3 rounded-2xl"
          style={{ backgroundColor: 'rgba(197,155,39,0.1)', border: '1px solid rgba(197,155,39,0.4)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: GOLD }}>
            Booking Reference
          </p>
          <p className="text-2xl font-black" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
            {booking.booking_reference || booking.booking_id}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {[
          { label: 'Tour Name', value: booking.tour_name },
          { label: 'Traveler Name', value: booking.customer_name },
          { label: 'Travel Date', value: formatDate(booking.tour_date) },
          { label: 'Total Travelers', value: `${booking.total_travelers} Guest(s)` },
          { label: 'Booking Amount', value: booking.total_amount ? formatINR(booking.total_amount) : 'On Request' },
          {
            label: 'Payment Status',
            value: isPaid ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Paid
              </span>
            ) : isPendingVerification ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                Pending Verification
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 uppercase tracking-wider">
                Pending
              </span>
            ),
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(58,42,24,0.55)' }}>{label}</p>
            <p className="text-sm font-semibold" style={{ color: NAVY }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-7 flex flex-wrap gap-3 justify-center">
        <Link
          to="/services"
          className="px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-1.5"
          style={{ color: NAVY, border: `1px solid rgba(0,26,77,0.25)`, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,26,77,0.06)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={14} /> Back to Tours
        </Link>
        <button
          type="button"
          onClick={onViewMyBookings}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
          style={{ backgroundColor: NAVY }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NAVY_MID}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = NAVY}
        >
          <Ticket size={14} /> View My Bookings
        </button>
      </div>
    </motion.div>
  )
}

// ── Main Booking Form ─────────────────────────────────────────────────────────

export default function BookingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile, openAuthModal } = useSupabaseAuth()

  const tour = findTourById(id)

  // Step management: 'form' | 'summary' | 'payment' | 'confirmed'
  const [step, setStep] = useState('form')

  // Redirect unauthenticated visitors back to auth
  useEffect(() => {
    if (!user) {
      openAuthModal({
        message: 'Login or create an account to continue with your booking.',
        targetTour: tour,
        onSuccess: () => navigate(`/booking/${id}`, { replace: true }),
      })
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { window.scrollTo(0, 0) }, [id, step])

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    whatsapp_number: '',
    sameAsPhone: false,
    adults: 1,
    children: 0,
    special_requirements: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  // Pre-fill from profile/user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customer_name: profile?.full_name || user.user_metadata?.full_name || prev.customer_name,
        customer_email: user.email || prev.customer_email,
        customer_phone: profile?.phone || prev.customer_phone,
      }))
    }
  }, [user, profile])

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const totalTravelers = Number(form.adults) + Number(form.children)
  const price = tour?.price > 0 ? tour.price : null
  const totalAmount = price ? price * Number(form.adults) : 0

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = useCallback(() => {
    const e = {}
    const phoneRegex = /^[6-9]\d{9}$/

    if (!form.customer_name.trim()) e.customer_name = 'Full name is required.'
    if (!form.customer_email.trim()) e.customer_email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email.trim())) e.customer_email = 'Please enter a valid email address.'
    if (!form.customer_phone.trim()) e.customer_phone = 'Mobile number is required.'
    else if (!phoneRegex.test(form.customer_phone.replace(/\D/g, '').replace(/^91/, ''))) e.customer_phone = 'Please enter a valid 10-digit Indian mobile number.'
    if (Number(form.adults) < 1) e.adults = 'At least 1 adult is required.'
    if (Number(form.children) < 0) e.children = 'Children count cannot be negative.'

    return e
  }, [form])

  // Step 1 -> Step 2: Show Booking Summary
  const handleProceedToSummary = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setSubmitError('Please fill all required fields correctly before proceeding.')
      return
    }
    setSubmitError('')
    setStep('summary')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Step 2 -> Step 3: Create Booking and Open Payment Screen
  const handleProceedToPayment = async () => {
    if (submitting) return // Prevent double-clicks / duplicate submissions

    setSubmitting(true)
    setSubmitError('')

    const bookingRef = confirmedBooking?.booking_reference || generateBookingRef()
    const whatsapp = form.sameAsPhone ? form.customer_phone : form.whatsapp_number

    const bookingPayload = {
      booking_reference: bookingRef,
      booking_id: bookingRef,
      user_id: user?.id || null,
      tour_id: tour?.id ? String(tour.id) : null,
      tour_name: tour?.title || 'Tour Booking',
      tour_location: tour?.location || tour?.destination || null,
      tour_date: tour?.date || null,
      duration: tour?.duration || null,
      price_per_person: price,
      adults: Number(form.adults),
      children: Number(form.children),
      total_travelers: totalTravelers,
      total_amount: totalAmount,
      customer_name: form.customer_name.trim(),
      customer_email: form.customer_email.trim().toLowerCase(),
      customer_phone: form.customer_phone.trim(),
      whatsapp_number: whatsapp ? whatsapp.trim() : null,
      special_requirements: form.special_requirements.trim() || null,
      notes: form.notes.trim() || null,
      status: 'pending',
      payment_status: 'pending',
      currency: 'INR',
      booking_status: 'pending',
    }

    try {
      // 1. Save to Supabase directly (user-linked with RLS)
      let savedSupRecord = null
      try {
        const { data: supData, error: supError } = await supabase
          .from('bookings')
          .upsert(bookingPayload, { onConflict: 'booking_reference' })
          .select()
          .maybeSingle()

        if (!supError && supData) {
          savedSupRecord = supData
        } else if (supError) {
          // If columns like payment_status don't exist yet on Supabase, fallback to basic fields
          const legacyPayload = {
            booking_reference: bookingPayload.booking_reference,
            user_id: bookingPayload.user_id,
            tour_id: bookingPayload.tour_id,
            tour_name: bookingPayload.tour_name,
            tour_location: bookingPayload.tour_location,
            tour_date: bookingPayload.tour_date,
            duration: bookingPayload.duration,
            price_per_person: bookingPayload.price_per_person,
            adults: bookingPayload.adults,
            children: bookingPayload.children,
            total_travelers: bookingPayload.total_travelers,
            total_amount: bookingPayload.total_amount,
            customer_name: bookingPayload.customer_name,
            customer_email: bookingPayload.customer_email,
            customer_phone: bookingPayload.customer_phone,
            whatsapp_number: bookingPayload.whatsapp_number,
            special_requirements: bookingPayload.special_requirements,
            notes: bookingPayload.notes,
            status: 'pending',
          }
          const { data: fallbackData } = await supabase
            .from('bookings')
            .upsert(legacyPayload, { onConflict: 'booking_reference' })
            .select()
            .maybeSingle()
          savedSupRecord = fallbackData
        }
      } catch (e) {
        console.warn('[Supabase booking save warning]:', e.message)
      }

      // 2. Sync to Express backend (for admin panel & SQLite)
      try {
        await api.post('/bookings', {
          booking_id: bookingRef,
          tour_id: bookingPayload.tour_id,
          tour_name: bookingPayload.tour_name,
          tour_category: tour?.category || 'Adventure',
          location: bookingPayload.tour_location,
          duration: bookingPayload.duration,
          travel_date: bookingPayload.tour_date,
          price_per_person: price,
          number_of_travelers: totalTravelers,
          total_amount: totalAmount,
          booking_contact_name: bookingPayload.customer_name,
          booking_contact_email: bookingPayload.customer_email,
          booking_contact_phone: bookingPayload.customer_phone,
          status: 'pending',
          payment_status: 'pending',
          travelers: [{
            fullName: bookingPayload.customer_name,
            contact: bookingPayload.customer_phone,
            participantType: 'adult',
          }],
        })
      } catch (backendErr) {
        console.warn('[Backend booking sync note]:', backendErr.message)
      }

      const activeRecord = savedSupRecord || bookingPayload
      setConfirmedBooking(activeRecord)
      setStep('payment')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong while initiating booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Guard: tour not found ────────────────────────────────────────────────────
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

  // ── Guard: not authenticated ─────────────────────────────────────────────────
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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(58,42,24,0.6)' }}>
          <Link to="/services" className="hover:underline font-medium" style={{ color: NAVY }}>Tours</Link>
          <span>›</span>
          <Link to={`/tour/${tour.id}`} className="hover:underline font-medium" style={{ color: NAVY }}>
            {tour.title}
          </Link>
          <span>›</span>
          <span className="font-semibold" style={{ color: NAVY }}>
            {step === 'form' ? 'Booking Details' : step === 'summary' ? 'Booking Summary' : step === 'payment' ? 'Payment' : 'Confirmation'}
          </span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mb-8 p-3.5 rounded-2xl bg-white border shadow-sm flex items-center justify-between text-xs" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
          {[
            { id: 'form', label: '1. Details' },
            { id: 'summary', label: '2. Summary' },
            { id: 'payment', label: '3. Payment' },
            { id: 'confirmed', label: '4. Done' },
          ].map((s, idx) => {
            const isActive = step === s.id
            const isPassed =
              (step === 'summary' && s.id === 'form') ||
              (step === 'payment' && (s.id === 'form' || s.id === 'summary')) ||
              (step === 'confirmed')

            return (
              <div key={s.id} className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition ${
                    isActive
                      ? 'bg-[#001a4d] text-white'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isPassed && !isActive ? '✓' : idx + 1}
                </span>
                <span className={`hidden sm:inline font-bold ${isActive ? 'text-[#001a4d]' : 'text-gray-500'}`}>
                  {s.label.split('. ')[1]}
                </span>
                {idx < 3 && <div className="w-6 sm:w-12 h-0.5 bg-gray-200 mx-1" />}
              </div>
            )
          })}
        </div>

        {/* ── STEP 4: FINAL CONFIRMATION SCREEN ── */}
        {step === 'confirmed' && confirmedBooking && (
          <BookingConfirmation
            booking={confirmedBooking}
            tour={tour}
            onViewMyBookings={() => navigate('/my-bookings')}
          />
        )}

        {/* ── STEP 3: PAYMENT SCREEN ── */}
        {step === 'payment' && confirmedBooking && (
          <PaymentScreen
            booking={confirmedBooking}
            tour={tour}
            onBack={() => setStep('summary')}
            onPaymentSuccess={(updated) => {
              setConfirmedBooking(updated)
              setStep('confirmed')
            }}
            onUpiSubmitted={(updated) => {
              setConfirmedBooking(updated)
              setStep('confirmed')
            }}
          />
        )}

        {/* ── STEP 2: BOOKING SUMMARY (Before Payment) ── */}
        {step === 'summary' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden shadow-xl bg-white border"
            style={{ borderColor: 'rgba(212,175,55,0.45)' }}
          >
            <div
              className="px-6 py-6 text-white text-center"
              style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, borderBottom: '2px solid rgba(212,175,55,0.4)' }}
            >
              <h2 className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
                Booking Summary
              </h2>
              <p className="text-xs mt-1" style={{ color: 'rgba(250,245,234,0.85)' }}>
                Please review your booking details before proceeding to payment.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Tour Highlight Card */}
              <div className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: '#fcfaf6', borderColor: 'rgba(180,160,130,0.35)' }}>
                {tour.image && (
                  <img src={tour.image} alt={tour.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Selected Package</span>
                  <h3 className="text-base sm:text-lg font-bold" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={12} style={{ color: GOLD }} /> {tour.location || tour.destination}</span>
                    <span className="flex items-center gap-1"><Clock size={12} style={{ color: GOLD }} /> {tour.duration}</span>
                  </div>
                </div>
              </div>

              {/* Summary Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border bg-gray-50" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Tour / Package Name</span>
                  <span className="text-sm font-semibold text-gray-900">{tour.title}</span>
                </div>
                <div className="p-3.5 rounded-xl border bg-gray-50" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Destination</span>
                  <span className="text-sm font-semibold text-gray-900">{tour.location || tour.destination || 'India'}</span>
                </div>
                <div className="p-3.5 rounded-xl border bg-gray-50" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Travel Date</span>
                  <span className="text-sm font-semibold text-gray-900">{formatDate(tour.date)}</span>
                </div>
                <div className="p-3.5 rounded-xl border bg-gray-50" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Number of Travelers</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalTravelers} Traveler(s) ({form.adults} Adult{Number(form.adults) !== 1 ? 's' : ''}{Number(form.children) > 0 ? `, ${form.children} Child` : ''})
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border bg-gray-50" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Customer Name</span>
                  <span className="text-sm font-semibold text-gray-900">{form.customer_name}</span>
                </div>
                <div className="p-3.5 rounded-xl border bg-gray-50" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Email</span>
                  <span className="text-sm font-semibold text-gray-900">{form.customer_email}</span>
                </div>
                <div className="p-3.5 rounded-xl border bg-gray-50 sm:col-span-2" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Phone Number</span>
                  <span className="text-sm font-semibold text-gray-900">{form.customer_phone}</span>
                </div>
              </div>

              {/* Prominent Booking Amount Display */}
              <div
                className="p-5 rounded-2xl text-center border"
                style={{ backgroundColor: 'rgba(197,155,39,0.1)', borderColor: 'rgba(197,155,39,0.45)' }}
              >
                <p className="text-xs uppercase font-bold tracking-widest text-amber-800 mb-1">
                  Booking Amount
                </p>
                <p className="text-3xl sm:text-4xl font-black tracking-wide" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                  {formatINR(totalAmount)}
                </p>
                {price && (
                  <p className="text-xs text-gray-600 mt-1">
                    Calculated as {formatINR(price)} × {form.adults} Adult{Number(form.adults) !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {submitError && (
                <div className="p-3 rounded-xl text-xs font-semibold text-red-700 bg-red-50 border border-red-200">
                  {submitError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition cursor-pointer"
                  style={{ borderColor: 'rgba(0,26,77,0.3)', color: NAVY }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,26,77,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Edit3 size={15} /> Edit Details
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                  onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = NAVY_MID }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Preparing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Payment</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 1: BOOKING FORM ── */}
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Main Form */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(180,160,130,0.3)', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,26,77,0.08)' }}
              >
                {/* Form Header */}
                <div
                  className="px-6 pt-6 pb-5"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, borderBottom: '2px solid rgba(212,175,55,0.45)' }}
                >
                  <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                    Book Your Adventure
                  </h1>
                  <p className="text-xs mt-1" style={{ color: 'rgba(250,245,234,0.8)' }}>
                    Complete your booking details for <strong style={{ color: GOLD2 }}>{tour.title}</strong>
                  </p>
                </div>

                <form onSubmit={handleProceedToSummary} className="px-6 py-6 space-y-6">

                  {/* Personal Information */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                      <User size={16} style={{ color: GOLD }} /> Personal Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name" required error={errors.customer_name}>
                        <Input
                          icon={User}
                          type="text"
                          value={form.customer_name}
                          onChange={(e) => set('customer_name', e.target.value)}
                          placeholder="John Doe"
                        />
                      </Field>
                      <Field label="Email Address" required error={errors.customer_email}>
                        <Input
                          icon={Mail}
                          type="email"
                          value={form.customer_email}
                          onChange={(e) => set('customer_email', e.target.value)}
                          placeholder="name@example.com"
                        />
                      </Field>
                      <Field label="Mobile Number" required error={errors.customer_phone}>
                        <Input
                          icon={Phone}
                          type="tel"
                          value={form.customer_phone}
                          onChange={(e) => set('customer_phone', e.target.value)}
                          placeholder="9876543210"
                          maxLength={10}
                        />
                      </Field>
                      <Field label="WhatsApp Number" error={errors.whatsapp_number}>
                        <div>
                          <Input
                            icon={Phone}
                            type="tel"
                            value={form.sameAsPhone ? form.customer_phone : form.whatsapp_number}
                            onChange={(e) => set('whatsapp_number', e.target.value)}
                            placeholder="WhatsApp number"
                            maxLength={10}
                            disabled={form.sameAsPhone}
                          />
                          <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.sameAsPhone}
                              onChange={(e) => set('sameAsPhone', e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#001a4d]"
                            />
                            <span className="text-xs" style={{ color: 'rgba(58,42,24,0.7)' }}>Same as mobile number</span>
                          </label>
                        </div>
                      </Field>
                    </div>
                  </div>

                  {/* Traveler Information */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                      <Users size={16} style={{ color: GOLD }} /> Traveler Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Number of Adults" required error={errors.adults}>
                        <Input
                          type="number"
                          min={1}
                          max={50}
                          value={form.adults}
                          onChange={(e) => set('adults', e.target.value)}
                        />
                      </Field>
                      <Field label="Number of Children" error={errors.children}>
                        <Input
                          type="number"
                          min={0}
                          max={50}
                          value={form.children}
                          onChange={(e) => set('children', e.target.value)}
                        />
                      </Field>
                      <Field label="Total Travelers">
                        <div
                          className="py-2.5 px-3.5 rounded-xl text-sm font-bold flex items-center gap-2"
                          style={{ border: '1px solid rgba(197,155,39,0.4)', backgroundColor: 'rgba(197,155,39,0.08)', color: NAVY }}
                        >
                          <Users size={14} style={{ color: GOLD }} />
                          {totalTravelers} Traveler{totalTravelers !== 1 ? 's' : ''}
                        </div>
                      </Field>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                      <MessageSquare size={16} style={{ color: GOLD }} /> Additional Information
                    </h2>
                    <div className="space-y-4">
                      <Field label="Special Requirements / Dietary Needs">
                        <textarea
                          value={form.special_requirements}
                          onChange={(e) => set('special_requirements', e.target.value)}
                          placeholder="Vegetarian meals, wheelchair access, allergies, etc."
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-[#001a4d]/20 focus:border-[#001a4d] resize-none"
                          style={{ borderColor: 'rgba(180,160,130,0.45)', color: BROWN }}
                        />
                      </Field>
                      <Field label="Additional Notes / Message">
                        <textarea
                          value={form.notes}
                          onChange={(e) => set('notes', e.target.value)}
                          placeholder="Any other message for the Alpine Explorers team..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-[#001a4d]/20 focus:border-[#001a4d] resize-none"
                          style={{ borderColor: 'rgba(180,160,130,0.45)', color: BROWN }}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Prominent Live Amount in Form */}
                  <div
                    className="rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{ backgroundColor: 'rgba(197,155,39,0.12)', border: '1px solid rgba(197,155,39,0.4)' }}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-800">Booking Amount</span>
                      <span className="text-xs text-gray-600">Calculated from tour price & traveler count</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                      {formatINR(totalAmount)}
                    </span>
                  </div>

                  {/* Error banner */}
                  {submitError && (
                    <div
                      className="rounded-xl px-4 py-3 text-xs font-semibold flex items-start gap-2"
                      style={{ backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', color: '#b91c1c' }}
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Proceed to Summary Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                  >
                    <Ticket size={18} />
                    Review Booking Summary
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Tour Summary Sidebar */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl overflow-hidden sticky top-24"
                style={{ border: '1px solid rgba(212,175,55,0.4)', boxShadow: '0 4px 20px rgba(0,26,77,0.1)' }}
              >
                {/* Tour Image */}
                {tour.image && (
                  <div className="h-40 overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }} className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GOLD2 }}>
                    Selected Tour
                  </p>
                  <h3 className="text-white font-bold text-sm leading-snug" style={{ fontFamily: 'Cinzel, serif' }}>
                    {tour.title}
                  </h3>
                </div>

                <div className="px-5 py-4 divide-y" style={{ backgroundColor: '#ffffff', divideColor: 'rgba(180,160,130,0.2)' }}>
                  {[
                    { icon: MapPin, label: 'Location', value: tour.location || tour.destination },
                    { icon: Clock, label: 'Duration', value: tour.duration },
                    { icon: Calendar, label: 'Date', value: formatDate(tour.date) },
                    { icon: CreditCard, label: 'Price / Person', value: price ? formatINR(price) : 'On Request' },
                  ].filter((i) => i.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="py-2.5 flex items-start gap-2.5">
                      <Icon size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(58,42,24,0.5)' }}>{label}</p>
                        <p className="text-sm font-semibold" style={{ color: NAVY }}>{value}</p>
                      </div>
                    </div>
                  ))}

                  {/* Live Price Calculation */}
                  {price && totalTravelers > 0 && (
                    <div className="py-3 rounded-b-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>
                          Booking Amount
                        </span>
                        <span className="text-xl font-black" style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}>
                          {formatINR(totalAmount)}
                        </span>
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: 'rgba(58,42,24,0.5)' }}>
                        {formatINR(price)} × {form.adults} Adult{Number(form.adults) !== 1 ? 's' : ''}
                        {Number(form.children) > 0 ? ` + ${form.children} Child${Number(form.children) !== 1 ? 'ren' : ''}` : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}