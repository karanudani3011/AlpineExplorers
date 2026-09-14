import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mountain, ArrowLeft, MapPin, Clock, Calendar, Users, CreditCard,
  Phone, Mail, User, MessageSquare, CheckCircle2, AlertCircle,
  Loader2, Ticket, ArrowRight, ShieldCheck
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import { serviceTours, serviceCategories } from '../data/servicesData'
import { tours as dataTours } from '../data/data'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'
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
  if (!amount || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)
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
  // Also check data.js tours (numeric ids)
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

// ── Confirmation Screen ───────────────────────────────────────────────────────

function BookingConfirmation({ booking, tour, onViewMyBookings }) {
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
          Booking Request Submitted!
        </h2>
        <p className="text-sm" style={{ color: 'rgba(250,245,234,0.85)' }}>
          Thank you! Our team will review and confirm your booking shortly.
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
            {booking.booking_reference}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {[
          { label: 'Tour Name', value: booking.tour_name },
          { label: 'Traveler Name', value: booking.customer_name },
          { label: 'Travel Date', value: booking.tour_date ? new Date(booking.tour_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
          { label: 'Total Travelers', value: booking.total_travelers },
          { label: 'Total Amount', value: booking.total_amount ? formatINR(booking.total_amount) : 'On Request' },
          { label: 'Status', value: <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Pending</span> },
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
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center gap-1.5"
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

  useEffect(() => { window.scrollTo(0, 0) }, [id])

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
  const [submitted, setSubmitted] = useState(false)
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
  const totalAmount = price ? price * Number(form.adults) : null

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

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setSubmitError('Please fill all required fields correctly.')
      return
    }

    setSubmitting(true)
    setSubmitError('')

    const bookingRef = generateBookingRef()
    const whatsapp = form.sameAsPhone ? form.customer_phone : form.whatsapp_number

    const bookingPayload = {
      booking_reference: bookingRef,
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
    }

    try {
      // 1. Save to Supabase directly (user-linked)
      const { data: supData, error: supError } = await supabase
        .from('bookings')
        .insert(bookingPayload)
        .select()
        .single()

      if (supError) {
        // If Supabase fails, still attempt backend sync
        console.warn('[Supabase booking insert failed]', supError.message)
      }

      // 2. Sync to Express backend (for admin panel & SQLite)
      try {
        await api.post('/bookings', {
          booking_id: bookingRef,
          tour_id: bookingPayload.tour_id,
          tour_name: bookingPayload.tour_name,
          tour_category: tour?.category || '',
          location: bookingPayload.tour_location,
          duration: bookingPayload.duration,
          travel_date: bookingPayload.tour_date,
          price_per_person: price,
          number_of_travelers: totalTravelers,
          total_amount: totalAmount,
          booking_contact_name: bookingPayload.customer_name,
          booking_contact_email: bookingPayload.customer_email,
          booking_contact_phone: bookingPayload.customer_phone,
          travelers: [{
            fullName: bookingPayload.customer_name,
            dob: '',
            sex: '',
            bloodGroup: '',
            address: '',
            contact: bookingPayload.customer_phone,
            education: '',
            school: '',
            photo: null,
            declarationAccepted: false,
            sigPlace: '',
            sigDate: new Date().toISOString().slice(0, 10),
            signature: '',
            riskAccepted: false,
            riskParticipantName: bookingPayload.customer_name,
            riskCourseName: bookingPayload.tour_name,
            riskPlace: '',
            riskDate: new Date().toISOString().slice(0, 10),
            riskSignature: '',
            participantType: 'adult',
          }],
        })
      } catch (backendErr) {
        console.warn('[Backend booking sync failed]', backendErr.message)
        // Non-fatal: Supabase is the source of truth for users
      }

      setConfirmedBooking(supData || bookingPayload)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
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
            Please login to continue with your booking.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal({ message: 'Login to continue with your booking.', targetTour: tour, onSuccess: () => {} })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
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
          <span>Book Now</span>
        </div>

        {submitted && confirmedBooking ? (
          <BookingConfirmation
            booking={confirmedBooking}
            tour={tour}
            onViewMyBookings={() => navigate('/my-bookings')}
          />
        ) : (
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

                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

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

                  {/* Notice */}
                  <div
                    className="rounded-xl px-4 py-3 text-xs leading-relaxed"
                    style={{ backgroundColor: 'rgba(197,155,39,0.1)', border: '1px solid rgba(197,155,39,0.4)', color: '#7a5a12' }}
                  >
                    <ShieldCheck size={13} className="inline mr-1 -translate-y-px" style={{ color: GOLD }} />
                    No payment is collected at this step. After submission, the Alpine Explorers team will review your booking request and contact you with payment and confirmation details.
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: submitting ? '#6b7280' : `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting Booking...
                      </>
                    ) : (
                      <>
                        <Ticket size={18} />
                        Confirm Booking
                        <ArrowRight size={16} />
                      </>
                    )}
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
                    { icon: Calendar, label: 'Date', value: tour.date ? new Date(tour.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null },
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
                          Estimated Total
                        </span>
                        <span className="text-xl font-black" style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}>
                          {totalAmount ? formatINR(totalAmount) : 'On Request'}
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