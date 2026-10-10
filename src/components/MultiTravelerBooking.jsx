import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users, CheckCircle2, ArrowRight, ArrowLeft,
  Mountain, MapPin, Clock, Calendar, CreditCard, Download,
  Home, AlertCircle, Loader2, Ticket, MessageSquare, ExternalLink
} from 'lucide-react'
import { api } from '../services/api'
import { supabase } from '../services/supabaseClient'
import TravelerForm from './booking/TravelerForm'
import ReviewCard from './booking/ReviewCard'
import PaymentScreen from './booking/PaymentScreen'
import DownloadFormStep from './booking/DownloadFormStep'
import UploadFormStep from './booking/UploadFormStep'
import { PAYMENT_CONFIG } from '../config/paymentConfig'

const NAVY = 'var(--ae-navy)'
const NAVY_MID = 'var(--ae-navy-mid)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'
const ERR = '#dc2626'

/* ──────────────────────────── Helpers ──────────────────────────── */

function formatINR(amount) {
  return 'On Request'
}

function formatDate(dateStr) {
  if (!dateStr) return 'Flexible / To be confirmed'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function generateBookingId() {
  const year = new Date().getFullYear()
  const rand = Math.floor(10000 + Math.random() * 90000)
  return `ALP-${year}-${rand}`
}

function makeTraveler(user = null, profile = null, defaultCourse = '') {
  return {
    courseName: defaultCourse,
    fullName: profile?.full_name || user?.user_metadata?.full_name || '',
    dob: '',
    age: '',
    sex: '',
    bloodGroup: '',
    address: '',
    contact: profile?.phone || '',
    education: '',
    school: '',
    schoolAddress: '',
    schoolPhone: '',
    hobbies: '',
    experienceYesNo: 'No',
    experienceDetails: '',
    declarationAccepted: false,
    sigPlace: '',
    sigDate: '',
    riskParticipantName: '',
    riskCourseName: defaultCourse,
    riskAccepted: false,
    riskPlace: '',
    riskDate: '',
    participantType: 'adult',
    guardianName: '',
    guardianContact: '',
    photo: null,
    signature: '',
    sigRisk: '',
    isExpanded: true,
    isCompleted: false,
  }
}

const INDIAN_PHONE = /^(\+91)?0?[6-9]\d{9}$/

function validateTraveler(t) {
  const e = {}
  if (!t.fullName.trim()) e.fullName = 'Please enter full name'
  if (!t.dob) e.dob = 'Please select date of birth'
  if (!t.sex) e.sex = 'Please select gender'
  if (!t.bloodGroup) e.bloodGroup = 'Please select blood group'
  if (!t.address.trim()) e.address = 'Please enter address'
  if (!t.contact.trim()) {
    e.contact = 'Please enter contact number'
  } else if (!INDIAN_PHONE.test(t.contact.replace(/\s+/g, ''))) {
    e.contact = 'Please enter a valid Indian mobile number'
  }
  if (!t.education.trim()) e.education = 'Please enter education qualification'
  if (!t.school.trim()) e.school = 'Please enter school / college name'
  if (!t.photo) e.photo = 'Please upload photograph'
  if (!t.declarationAccepted) e.declaration = 'Please accept the declaration'
  if (!t.sigPlace.trim()) e.sigPlace = 'Please enter place'
  if (!t.sigDate) e.sigDate = 'Please enter date'
  if (!t.signature) e.signature = 'Please provide applicant signature'
  if (!t.riskParticipantName.trim()) e.riskParticipantName = 'Please enter participant name for risk certificate'
  if (!t.riskCourseName.trim()) e.riskCourseName = 'Please enter course name for risk certificate'
  if (!t.riskAccepted) e.risk = 'Please accept the risk certificate'
  if (!t.riskPlace.trim()) e.riskPlace = 'Please enter place'
  if (!t.riskDate) e.riskDate = 'Please enter date'
  if (!t.riskSignature) e.riskSignature = 'Please provide signature for risk certificate'
  if (!t.participantType) e.participantType = 'Please select participant type'
  if (t.participantType === 'minor') {
    if (!t.guardianName.trim()) e.guardianName = 'Please enter guardian name'
    if (!t.guardianContact.trim()) {
      e.guardianContact = 'Please enter guardian contact number'
    } else if (!INDIAN_PHONE.test(t.guardianContact.replace(/\s+/g, ''))) {
      e.guardianContact = 'Please enter a valid Indian mobile number'
    }
  }
  return e
}

/* ──────────────────────────── Step Indicator ──────────────────────────── */

const STEPS = ['Travelers', 'Application', 'Summary', 'Download Form', 'Upload Form', 'Payment', 'Confirmation']

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 overflow-x-auto py-2">
      {STEPS.map((label, i) => {
        const done = i < step
        const active = i === step
        const last = i === STEPS.length - 1
        return (
          <div key={label} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  backgroundColor: done ? GOLD : active ? NAVY : '#e2e8f0',
                  color: done || active ? '#ffffff' : '#94a3b8',
                  boxShadow: active ? `0 0 0 3px ${NAVY}25` : 'none',
                }}
              >
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider hidden sm:block"
                style={{ color: done ? GOLD : active ? NAVY : '#94a3b8' }}
              >
                {label}
              </span>
            </div>
            {!last && (
              <div
                className="w-8 sm:w-16 h-0.5 mx-1 mb-4 sm:mb-5 rounded transition-all"
                style={{ backgroundColor: done ? GOLD : '#e2e8f0' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ──────────────────────────── Final Booking Confirmation Screen ──────────────────────────── */

function BookingConfirmation({ booking, tour }) {
  const navigate = useNavigate()
  const isPaid = booking.payment_status === 'paid'
  const isPendingVerification = booking.payment_status === 'pending_verification'
  const bookingRef = booking.booking_reference || booking.booking_id

  const buildWhatsAppUrl = () => {
    const msg = `Hello Alpine Explorers,
I have completed the payment for my booking.
Booking ID: ${bookingRef}
Tour/Package: ${booking.tour_name}
Applicant Name: ${booking.customer_name}
Amount Paid: ₹${Number(booking.total_amount || 0).toLocaleString('en-IN')}
Please verify my payment.
Thank you.`

    return `https://wa.me/${PAYMENT_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden text-center bg-white shadow-xl border"
      style={{ borderColor: 'rgb(var(--ae-gold2-rgb) /0.4)' }}
    >
      <div className="py-10 px-6" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgb(var(--ae-gold2-rgb) /0.2)', border: '2px solid rgb(var(--ae-gold2-rgb) /0.5)' }}
        >
          <CheckCircle2 size={36} style={{ color: GOLD2 }} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          {isPaid ? 'Booking Confirmed!' : 'Booking Request Received!'}
        </h2>
        <p className="text-sm text-cream-100/90 max-w-md mx-auto" style={{ color: 'rgb(var(--ae-cream-rgb) /0.85)' }}>
          {isPaid
            ? 'Thank you! Your payment is confirmed and your booking is secured.'
            : isPendingVerification
            ? 'Thank you! We received your UPI payment confirmation and our team is verifying it.'
            : 'Thank you! Our team will review your application and payment details shortly.'}
        </p>
      </div>

      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
        <div
          className="inline-block px-6 py-3 rounded-2xl"
          style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) /0.1)', border: '1px solid rgb(var(--ae-gold-rgb) /0.4)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: GOLD }}>
            Booking Reference
          </p>
          <p className="text-2xl font-black" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
            {bookingRef}
          </p>
        </div>
      </div>

      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
        <div>
          <span className="text-gray-500 block uppercase font-bold text-[10px]">Tour / Package Name</span>
          <span className="text-sm font-semibold text-gray-900">{booking.tour_name}</span>
        </div>
        <div>
          <span className="text-gray-500 block uppercase font-bold text-[10px]">Applicant Name</span>
          <span className="text-sm font-semibold text-gray-900">{booking.customer_name}</span>
        </div>
        <div>
          <span className="text-gray-500 block uppercase font-bold text-[10px]">Travel Date</span>
          <span className="text-sm font-semibold text-gray-900">{formatDate(booking.tour_date)}</span>
        </div>
        <div>
          <span className="text-gray-500 block uppercase font-bold text-[10px]">Total Travelers</span>
          <span className="text-sm font-semibold text-gray-900">{booking.total_travelers} Guest(s)</span>
        </div>
        <div>
          <span className="text-gray-500 block uppercase font-bold text-[10px]">Booking Amount</span>
          <span className="text-sm font-bold text-amber-800">{formatINR(booking.total_amount)}</span>
        </div>
        <div>
          <span className="text-gray-500 block uppercase font-bold text-[10px]">Payment Status</span>
          <div className="mt-0.5">
            {isPaid ? (
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
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-7 pt-2 flex flex-wrap gap-3 justify-center">
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: '#047857' }}
        >
          <MessageSquare size={15} /> Send WhatsApp Confirmation <ExternalLink size={13} />
        </a>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-1.5"
          style={{ color: NAVY, border: `1px solid rgb(var(--ae-navy-rgb) /0.25)` }}
        >
          <Download size={14} /> Print Application
        </button>

        <button
          type="button"
          onClick={() => navigate('/my-bookings')}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: NAVY }}
        >
          <Ticket size={14} /> View My Bookings
        </button>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────── MAIN COMPONENT ──────────────────────────── */

export default function MultiTravelerBooking({ tour, user, profile }) {
  const [step, setStep] = useState(0) // 0: Count, 1: Form, 2: Summary, 3: Download, 4: Upload, 5: Payment, 6: Done
  const [travelerCount, setTravelerCount] = useState(1)
  const [travelers, setTravelers] = useState([makeTraveler(user, profile, tour?.title || '')])
  const [allErrors, setAllErrors] = useState([{}])
  const [confirmedCorrect, setConfirmedCorrect] = useState(false)
  const [bookingId] = useState(generateBookingId)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const topRef = useRef(null)

  const scrollTop = () =>
    window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)

  // Keep traveler 1 auto-filled if profile/user loads
  useEffect(() => {
    if (user || profile) {
      setTravelers((prev) => {
        if (!prev.length) return prev
        const next = [...prev]
        if (!next[0].fullName) next[0].fullName = profile?.full_name || user?.user_metadata?.full_name || ''
        if (!next[0].contact) next[0].contact = profile?.phone || ''
        if (!next[0].courseName) next[0].courseName = tour?.title || ''
        if (!next[0].riskCourseName) next[0].riskCourseName = tour?.title || ''
        return next
      })
    }
  }, [user, profile, tour])

  /* ── Traveler count controls ── */
  const adjustCount = (delta) => {
    const next = Math.max(1, travelerCount + delta)
    setTravelerCount(next)
    setTravelers((prev) => {
      if (next > prev.length) {
        const added = Array.from({ length: next - prev.length }, () => makeTraveler(null, null, tour?.title || ''))
        return [...prev, ...added]
      }
      return prev.slice(0, next)
    })
    setAllErrors((prev) => {
      if (next > prev.length) {
        return [...prev, ...Array(next - prev.length).fill({})]
      }
      return prev.slice(0, next)
    })
  }

  /* ── Update field for a traveler ── */
  const updateTraveler = useCallback((index, field, value) => {
    setTravelers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
    setAllErrors((prev) => {
      const next = [...prev]
      if (next[index]?.[field]) {
        next[index] = { ...next[index] }
        delete next[index][field]
      }
      return next
    })
  }, [])

  /* ── Toggle accordion ── */
  const toggleExpand = useCallback((index) => {
    setTravelers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], isExpanded: !next[index].isExpanded }
      return next
    })
  }, [])

  const proceedToForms = () => {
    setStep(1)
    scrollTop()
  }

  /* ── STEP 1 → STEP 2 (validate all) ── */
  const proceedToReview = () => {
    const errors = travelers.map(validateTraveler)
    const hasErrors = errors.some((e) => Object.keys(e).length > 0)

    if (hasErrors) {
      setAllErrors(errors)
      const firstBadIdx = errors.findIndex((e) => Object.keys(e).length > 0)
      setTravelers((prev) => {
        const next = [...prev]
        if (firstBadIdx !== -1) {
          next[firstBadIdx] = { ...next[firstBadIdx], isExpanded: true }
        }
        return next
      })
      scrollTop()
      return
    }

    setTravelers((prev) =>
      prev.map((t) => ({ ...t, isCompleted: true, isExpanded: false }))
    )
    setStep(2)
    scrollTop()
  }

  const editTraveler = (index) => {
    setTravelers((prev) =>
      prev.map((t, i) => ({ ...t, isExpanded: i === index }))
    )
    setStep(1)
    scrollTop()
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const totalPrice = null

  /* ── STEP 2 → STEP 3 (Submit application & open PaymentScreen) ── */
  const handleProceedToPayment = async (uploadedFormList = []) => {
    if (!confirmedCorrect || submitting) return
    setSubmitting(true)
    setSubmitError('')

    const payload = {
      booking_id: bookingId,
      tour_id: tour.id ? String(tour.id) : '',
      tour_name: tour.title,
      tour_category: tour.category || 'Adventure',
      location: tour.location || tour.destination || '',
      duration: tour.duration || '',
      travel_date: tour.date || new Date().toISOString().slice(0, 10),
      price_per_person: null,
      number_of_travelers: travelerCount,
      total_amount: totalPrice,
      booking_contact_name: travelers[0]?.fullName || '',
      booking_contact_email: user?.email || '',
      booking_contact_phone: travelers[0]?.contact || '',
      status: 'pending',
      payment_status: 'pending',
      scanned_forms: uploadedFormList || [],
      travelers: travelers.map((t) => ({
        courseName: t.courseName || tour.title,
        fullName: t.fullName,
        dob: t.dob,
        age: t.age || '',
        sex: t.sex,
        bloodGroup: t.bloodGroup,
        address: t.address,
        contact: t.contact,
        education: t.education,
        school: t.school,
        schoolAddress: t.schoolAddress,
        schoolPhone: t.schoolPhone,
        hobbies: t.hobbies,
        photo: t.photo || null,
        experienceYesNo: t.experienceYesNo || 'No',
        experienceDetails: t.experienceDetails || '',
        declarationAccepted: t.declarationAccepted,
        declarationPlace: t.sigPlace,
        declarationDate: t.sigDate,
        signature: t.signature,
        participantType: t.participantType === 'minor' ? 'Minor' : 'Adult',
        guardianName: t.guardianName,
        guardianContact: t.guardianContact,
        sigGuardian: t.sigGuardian || null,
        riskAccepted: t.riskAccepted,
        riskParticipantName: t.riskParticipantName,
        riskCourseName: t.riskCourseName || tour.title,
        riskPlace: t.riskPlace,
        riskDate: t.riskDate,
        riskSignature: t.riskSignature,
      }))
    }

    try {
      // 1. Save to SQLite database
      await api.post('/bookings', payload)

      // 2. Save/Sync to Supabase if configured
      try {
        await supabase
          .from('bookings')
          .upsert({
            booking_reference: bookingId,
            user_id: user?.id || null,
            tour_id: String(tour.id || ''),
            tour_name: tour.title,
            tour_location: tour.location || tour.destination || null,
            tour_date: tour.date || null,
            duration: tour.duration || null,
            price_per_person: null,
            total_travelers: travelerCount,
            total_amount: totalPrice,
            customer_name: travelers[0]?.fullName || '',
            customer_email: user?.email || '',
            customer_phone: travelers[0]?.contact || '',
            status: 'pending',
            payment_status: 'pending',
            scanned_forms: uploadedFormList || [],
          }, { onConflict: 'booking_reference' })
      } catch (supErr) {
        console.warn('Supabase booking sync note:', supErr.message)
      }

      const bookingRecord = {
        booking_reference: bookingId,
        booking_id: bookingId,
        user_id: user?.id || null,
        tour_id: String(tour.id || ''),
        tour_name: tour.title,
        tour_location: tour.location || tour.destination || null,
        tour_date: tour.date || null,
        duration: tour.duration || null,
        price_per_person: null,
        total_travelers: travelerCount,
        total_amount: totalPrice,
        customer_name: travelers[0]?.fullName || '',
        customer_email: user?.email || '',
        customer_phone: travelers[0]?.contact || '',
        status: 'pending',
        payment_status: 'pending',
      }

      setConfirmedBooking(bookingRecord)
      setStep(5) // Step 5: Payment
      scrollTop()
    } catch (err) {
      setSubmitError(err?.message || 'Unable to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ══════════════════════════ RENDER ══════════════════════════ */

  return (
    <div ref={topRef}>
      <StepBar step={step} />

      <AnimatePresence mode="wait">
        {/* ─────────── STEP 0: Traveler Count ─────────── */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tour summary card */}
            <div
              className="rounded-2xl p-5 mb-6 flex items-center gap-4"
              style={{
                background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
                boxShadow: '0 4px 20px rgb(var(--ae-navy-rgb) /0.2)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <Mountain size={22} style={{ color: GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: GOLD }}>
                  Selected Tour / Course
                </p>
                <p className="text-white font-bold text-base truncate" style={{ fontFamily: 'Cinzel, serif' }}>
                  {tour.title}
                </p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs" style={{ color: 'rgb(var(--ae-cream-rgb) /0.75)' }}>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {tour.location || tour.destination}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {tour.duration}</span>
                  {tour.date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(tour.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0"><p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: GOLD }}>Price</p><p className="text-white font-bold text-sm">On Request</p></div>
            </div>

            {/* Traveler count selector */}
            <div
              className="rounded-2xl bg-white p-8 text-center"
              style={{ boxShadow: '0 2px 16px rgb(var(--ae-navy-rgb) /0.08)', border: `1px solid ${GOLD}20` }}
            >
              <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                How many people are traveling?
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                We will generate an official Alpine Explorers application form for each traveler.
              </p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => adjustCount(-1)}
                  disabled={travelerCount <= 1}
                  className="w-14 h-14 rounded-2xl font-bold text-2xl flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
                  style={{
                    backgroundColor: `${NAVY}08`,
                    color: NAVY,
                    border: `2px solid ${NAVY}15`,
                  }}
                >
                  −
                </button>

                <div className="text-center">
                  <div
                    className="text-5xl font-extrabold mb-1"
                    style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}
                  >
                    {travelerCount}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Traveler{travelerCount > 1 ? 's' : ''}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => adjustCount(1)}
                  className="w-14 h-14 rounded-2xl font-bold text-2xl flex items-center justify-center transition cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
                    color: '#ffffff',
                  }}
                >
                  +
                </button>
              </div>

              {/* Quick Count pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => adjustCount(n - travelerCount)}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer"
                    style={{
                      backgroundColor: travelerCount === n ? NAVY : `${NAVY}08`,
                      color: travelerCount === n ? '#ffffff' : NAVY,
                      border: `1.5px solid ${travelerCount === n ? NAVY : `${NAVY}20`}`,
                    }}
                  >
                    {n} {n === 1 ? 'Traveler' : 'Travelers'}
                  </button>
                ))}
              </div>

              <div className="inline-block px-5 py-2.5 rounded-xl mb-8" style={{ backgroundColor: `${GOLD}10`, border: `1px solid ${GOLD}30` }}><span className="text-sm font-semibold text-amber-900">Price: On Request</span></div>

              <div>
                <button
                  type="button"
                  onClick={proceedToForms}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-white font-bold text-sm transition cursor-pointer shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                >
                  <span>Continue to Application Forms</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────── STEP 1: Application Forms ─────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Header banner */}
            <div
              className="rounded-2xl p-4 flex flex-wrap items-center gap-3 bg-white border shadow-sm"
              style={{ borderColor: 'rgba(180,160,130,0.3)' }}
            >
              <Users size={18} style={{ color: GOLD }} />
              <div>
                <span className="text-sm font-bold block" style={{ color: NAVY }}>
                  Alpine Explorers Original Application Form ({travelerCount} Traveler{travelerCount > 1 ? 's' : ''})
                </span>
                <span className="text-xs text-gray-500">
                  Please fill out all required fields, upload a photo, and sign the form below.
                </span>
              </div>

              <div className="flex gap-2 ml-auto flex-wrap">
                {travelers.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setTravelers((prev) => prev.map((tt, j) => ({ ...tt, isExpanded: j === i })))
                      window.setTimeout(() => {
                        document.getElementById(`traveler-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 60)
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer"
                    style={{
                      backgroundColor: t.isCompleted ? `${GOLD}15` : t.isExpanded ? `${NAVY}10` : '#f1f5f9',
                      color: t.isCompleted ? GOLD : t.isExpanded ? NAVY : '#64748b',
                      border: `1.5px solid ${t.isCompleted ? GOLD : t.isExpanded ? NAVY : '#e2e8f0'}`,
                    }}
                  >
                    {t.isCompleted ? '✓' : ''} T{i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Traveler accordion forms */}
            {travelers.map((t, i) => (
              <div key={i} id={`traveler-${i}`} className="bg-white rounded-2xl p-6 border shadow-md" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
                <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <h3 className="text-base font-bold flex items-center gap-2" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    Traveler {i + 1} Application Form
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggleExpand(i)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    {t.isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                {t.isExpanded && (
                  <TravelerForm
                    index={i}
                    count={travelerCount}
                    trip={tour}
                    traveler={t}
                    errors={allErrors[i] || {}}
                    onChange={(field, value) => updateTraveler(i, field, value)}
                    onSetError={(field, err) => {
                      setAllErrors((prev) => {
                        const next = [...prev]
                        next[i] = { ...(next[i] || {}), [field]: err }
                        return next
                      })
                    }}
                  />
                )}

                {!t.isExpanded && allErrors[i] && Object.keys(allErrors[i]).length > 0 && (
                  <div
                    className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-600 cursor-pointer"
                    onClick={() => toggleExpand(i)}
                  >
                    <AlertCircle size={13} />
                    {Object.keys(allErrors[i]).length} field{Object.keys(allErrors[i]).length > 1 ? 's' : ''} require attention — click to expand
                  </div>
                )}
              </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => { setStep(0); scrollTop() }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer bg-white border"
                style={{ color: NAVY, borderColor: '#e2e8f0' }}
              >
                <ArrowLeft size={15} /> Back
              </button>

              <button
                type="button"
                onClick={proceedToReview}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm transition cursor-pointer shadow-lg"
                style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
              >
                <span>Review Application</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────── STEP 2: Booking Summary ─────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                Application Summary
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Please verify all traveler details and signatures before proceeding to payment.
              </p>
            </div>

            {/* Traveler review cards */}
            <div className="space-y-4">
              {travelers.map((t, i) => (
                <ReviewCard
                  key={i}
                  index={i}
                  traveler={t}
                  onEdit={() => editTraveler(i)}
                />
              ))}
            </div>

            {/* Price breakdown */}
            <div
              className="rounded-2xl p-5 bg-white border"
              style={{ borderColor: 'rgb(var(--ae-gold2-rgb) /0.35)', boxShadow: '0 2px 12px rgb(var(--ae-navy-rgb) /0.06)' }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: NAVY }}>
                Booking Summary & Pricing
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selected Package</span>
                  <span className="font-semibold text-gray-900">{tour.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-900">{tour.location || tour.destination}</span>
                </div>
                {tour.date && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Travel Date</span>
                    <span className="font-semibold text-gray-900">{formatDate(tour.date)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Travelers</span>
                  <span className="font-semibold text-gray-900">{travelerCount} Guest(s)</span>
                </div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Price</span><span className="font-semibold text-gray-900">On Request</span></div>
                <p className="border-t border-dashed pt-2 text-xs text-gray-500">This application is an inquiry; availability and quotation will be confirmed by the team.</p>
              </div>
            </div>

            {/* Confirmation checkbox */}
            <label
              className="flex items-start gap-3 cursor-pointer rounded-xl p-4 transition border bg-white"
              style={{
                borderColor: confirmedCorrect ? GOLD : '#e2e8f0',
                backgroundColor: confirmedCorrect ? `${GOLD}08` : '#ffffff',
              }}
            >
              <input
                type="checkbox"
                checked={confirmedCorrect}
                onChange={(e) => setConfirmedCorrect(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-amber-600"
              />
              <span className="text-sm" style={{ color: NAVY }}>
                I confirm that all traveler information, declarations, and signatures provided above are true, complete, and accurate.
              </span>
            </label>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setStep(1); scrollTop() }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer bg-white border"
                style={{ color: NAVY, borderColor: '#e2e8f0' }}
              >
                <ArrowLeft size={15} className="inline mr-1" /> Edit Application Form
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmedCorrect) {
                    setStep(3)
                    scrollTop()
                  }
                }}
                disabled={!confirmedCorrect}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                style={{
                  background: confirmedCorrect
                    ? `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`
                    : '#94a3b8',
                }}
              >
                Continue to Download Form <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────── STEP 3: Download Form ─────────── */}
        {step === 3 && (
          <DownloadFormStep
            key="step3"
            travelers={travelers}
            tour={tour}
            onBack={() => { setStep(2); scrollTop() }}
            onNext={() => { setStep(4); scrollTop() }}
          />
        )}

        {/* ─────────── STEP 4: Upload Scanned Form ─────────── */}
        {step === 4 && (
          <UploadFormStep
            key="step4"
            travelers={travelers}
            tour={tour}
            bookingId={bookingId}
            submitting={submitting}
            submitError={submitError}
            onBack={() => { setStep(3); scrollTop() }}
            onNext={(files) => { handleProceedToPayment(files) }}
          />
        )}

        {/* ─────────── STEP 5: Payment ─────────── */}
        {step === 5 && confirmedBooking && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {confirmedBooking.total_amount > 0 ? <PaymentScreen
              booking={confirmedBooking}
              tour={tour}
              onBack={() => setStep(4)}
              onPaymentSuccess={(updated) => {
                setConfirmedBooking(updated)
                setStep(6)
                scrollTop()
              }}
              onUpiSubmitted={(updated) => {
                setConfirmedBooking(updated)
                setStep(6)
                scrollTop()
              }}
            /> : <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-7 text-center shadow-lg"><CheckCircle2 className="mx-auto mb-3 text-emerald-700" size={36}/><h2 className="text-2xl font-bold text-slate-900">Inquiry received</h2><p className="mt-2 text-sm text-slate-600">Your application was submitted. This is an inquiry, not a confirmed reservation. The team will review availability and share the quotation.</p><p className="mt-3 font-bold text-emerald-800">Price: On Request</p><Link to="/services" className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Browse tours</Link></div>}
          </motion.div>
        )}

        {/* ─────────── STEP 6: Confirmation ─────────── */}
        {step === 6 && confirmedBooking && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BookingConfirmation booking={confirmedBooking} tour={tour} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
