import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, ChevronRight, CheckCircle2, ArrowRight, ArrowLeft,
  Mountain, MapPin, Clock, Calendar, CreditCard, Download,
  Home, FileText, AlertCircle, Loader2
} from 'lucide-react'
import { api } from '../services/api'
import TravelerForm from './booking/TravelerForm'
import ReviewCard from './booking/ReviewCard'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const ERR = '#dc2626'

/* ──────────────────────────── Helpers ──────────────────────────── */

function formatINR(amount) {
  if (!amount || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)
}

function generateBookingId() {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `AE-${year}-${rand}`
}

function makeTraveler() {
  return {
    course: '',
    name: '',
    dob: '',
    age: '',
    sex: '',
    bloodGroup: '',
    address: '',
    contact: '',
    education: '',
    school: '',
    schoolAddress: '',
    schoolPhone: '',
    hobbies: '',
    experience: '',
    experienceDetails: '',
    declarationAgreed: false,
    declarationPlace: '',
    declarationDate: '',
    riskName: '',
    riskCourse: '',
    riskAgreed: false,
    riskPlace: '',
    riskDate: '',
    participantType: 'Adult',
    guardianName: '',
    guardianContact: '',
    photo: '',
    sigApplicant: '',
    sigGuardian: '',
    sigRisk: '',
    isExpanded: true,
    isCompleted: false,
  }
}

const INDIAN_PHONE = /^(\+91)?0?[6-9]\d{9}$/

function validateTraveler(t) {
  const e = {}
  if (!t.name.trim()) e.name = 'Please enter full name'
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
  if (!t.declarationAgreed) e.declarationAgreed = 'Please accept the terms and conditions'
  if (!t.declarationPlace.trim()) e.declarationPlace = 'Please enter place'
  if (!t.declarationDate) e.declarationDate = 'Please enter date'
  if (!t.sigApplicant) e.sigApplicant = 'Please provide applicant signature'
  if (!t.riskName.trim()) e.riskName = 'Please enter participant name for risk certificate'
  if (!t.riskAgreed) e.riskAgreed = 'Please accept the risk certificate'
  if (!t.riskPlace.trim()) e.riskPlace = 'Please enter place'
  if (!t.riskDate) e.riskDate = 'Please enter date'
  if (!t.sigRisk) e.sigRisk = 'Please provide signature for risk certificate'
  if (!t.participantType) e.participantType = 'Please select participant type'
  if (t.participantType === 'Minor') {
    if (!t.guardianName.trim()) e.guardianName = 'Please enter guardian name'
    if (!t.guardianContact.trim()) {
      e.guardianContact = 'Please enter guardian contact number'
    } else if (!INDIAN_PHONE.test(t.guardianContact.replace(/\s+/g, ''))) {
      e.guardianContact = 'Please enter a valid Indian mobile number'
    }
    if (!t.sigGuardian) e.sigGuardian = 'Please provide guardian signature'
  }
  return e
}

/* ──────────────────────────── Step Indicator ──────────────────────────── */

const STEPS = ['Travelers', 'Application', 'Review', 'Done']

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < step
        const active = i === step
        const last = i === STEPS.length - 1
        return (
          <div key={label} className="flex items-center">
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
                className="w-12 sm:w-20 h-0.5 mx-1 mb-4 sm:mb-5 rounded transition-all"
                style={{ backgroundColor: done ? GOLD : '#e2e8f0' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ──────────────────────────── MAIN COMPONENT ──────────────────────────── */

export default function MultiTravelerBooking({ tour }) {
  const [step, setStep] = useState(0)
  const [travelerCount, setTravelerCount] = useState(1)
  const [travelers, setTravelers] = useState([makeTraveler()])
  const [allErrors, setAllErrors] = useState([{}])
  const [confirmedCorrect, setConfirmedCorrect] = useState(false)
  const [bookingId] = useState(generateBookingId)
  const topRef = useRef(null)

  const scrollTop = () =>
    window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)

  /* ── Traveler count controls ── */
  const adjustCount = (delta) => {
    const next = Math.max(1, travelerCount + delta)
    setTravelerCount(next)
    setTravelers((prev) => {
      if (next > prev.length) {
        const added = Array.from({ length: next - prev.length }, makeTraveler)
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

  /* ── Update a single field for a traveler ── */
  const updateTraveler = useCallback((index, field, value) => {
    setTravelers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
    // Clear that field's error live
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

  /* ── STEP 0 → STEP 1 ── */
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
      // Expand first traveler with errors
      const firstBadIdx = errors.findIndex((e) => Object.keys(e).length > 0)
      setTravelers((prev) => {
        const next = [...prev]
        next[firstBadIdx] = { ...next[firstBadIdx], isExpanded: true }
        return next
      })
      scrollTop()
      return
    }

    // Mark all completed
    setTravelers((prev) =>
      prev.map((t) => ({ ...t, isCompleted: true, isExpanded: false }))
    )
    setStep(2)
    scrollTop()
  }

  /* ── STEP 2 → STEP 1 (edit a traveler) ── */
  const editTraveler = (index) => {
    setTravelers((prev) =>
      prev.map((t, i) => ({ ...t, isExpanded: i === index }))
    )
    setStep(1)
    scrollTop()
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  /* ── STEP 2 → STEP 3 (submit) ── */
  const handleSubmit = async () => {
    if (!confirmedCorrect) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const payload = {
        booking_id: bookingId,
        tour_id: tour.id ? String(tour.id) : '',
        tour_name: tour.title,
        tour_category: tour.category || 'Adventure',
        location: tour.location || '',
        duration: tour.duration || '',
        travel_date: tour.date || new Date().toISOString().slice(0, 10),
        price_per_person: tour.price || null,
        number_of_travelers: travelerCount,
        total_amount: totalPrice,
        booking_contact_name: travelers[0]?.name || '',
        booking_contact_email: '',
        booking_contact_phone: travelers[0]?.contact || '',
        travelers: travelers.map((t) => ({
          courseName: t.course || tour.title,
          fullName: t.name,
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
          experienceYesNo: t.experience || 'No',
          experienceDetails: t.experienceDetails || '',
          declarationAccepted: t.declarationAgreed,
          declarationPlace: t.declarationPlace,
          declarationDate: t.declarationDate,
          signature: t.sigApplicant,
          participantType: t.participantType === 'Minor' ? 'Minor' : 'Adult',
          guardianName: t.guardianName,
          guardianContact: t.guardianContact,
          sigGuardian: t.sigGuardian,
          riskAccepted: t.riskAgreed,
          riskParticipantName: t.riskName,
          riskCourseName: t.riskCourse || tour.title,
          riskPlace: t.riskPlace,
          riskDate: t.riskDate,
          riskSignature: t.sigRisk,
        }))
      }

      await api.post('/bookings', payload)
      setStep(3)
      scrollTop()
    } catch (err) {
      setSubmitError(err?.message || 'Unable to submit booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = tour.price > 0 ? tour.price * travelerCount : null

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
                boxShadow: '0 4px 20px rgba(0,26,77,0.2)',
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
                  Selected Tour
                </p>
                <p className="text-white font-bold text-base truncate" style={{ fontFamily: 'Cinzel, serif' }}>
                  {tour.title}
                </p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs" style={{ color: 'rgba(250,245,234,0.75)' }}>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {tour.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {tour.duration}</span>
                  {tour.date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(tour.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
              {tour.price > 0 && (
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: GOLD }}>
                    Price/Person
                  </p>
                  <p className="text-white font-bold text-sm">
                    {formatINR(tour.price)}
                  </p>
                </div>
              )}
            </div>

            {/* Traveler count selector */}
            <div
              className="rounded-2xl bg-white p-8 text-center"
              style={{ boxShadow: '0 2px 16px rgba(0,26,77,0.08)', border: `1px solid ${GOLD}20` }}
            >
              <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                How many people are traveling?
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                We'll generate a separate application form for each traveler.
              </p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => adjustCount(-1)}
                  disabled={travelerCount <= 1}
                  className="w-14 h-14 rounded-2xl font-bold text-2xl flex items-center justify-center transition disabled:opacity-30"
                  style={{
                    backgroundColor: `${NAVY}08`,
                    color: NAVY,
                    border: `2px solid ${NAVY}15`,
                  }}
                  onMouseEnter={(e) => { if (travelerCount > 1) e.currentTarget.style.backgroundColor = `${NAVY}15` }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${NAVY}08` }}
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
                  className="w-14 h-14 rounded-2xl font-bold text-2xl flex items-center justify-center transition"
                  style={{
                    background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
                    color: '#ffffff',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${GOLD}, ${GOLD2})` }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                >
                  +
                </button>
              </div>

              {/* Count pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { const delta = n - travelerCount; adjustCount(delta) }}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold transition"
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

              {tour.price > 0 && (
                <div
                  className="inline-block px-5 py-2.5 rounded-xl mb-8"
                  style={{ backgroundColor: `${GOLD}10`, border: `1px solid ${GOLD}30` }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#78350f' }}>
                    Estimated Total:{' '}
                    <span className="text-base font-extrabold" style={{ color: NAVY }}>
                      {formatINR(tour.price * travelerCount)}
                    </span>
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      ({formatINR(tour.price)} × {travelerCount})
                    </span>
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={proceedToForms}
                className="flex items-center justify-center gap-2 mx-auto px-10 py-4 rounded-2xl text-white font-bold text-sm transition"
                style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, boxShadow: '0 4px 16px rgba(0,26,77,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${GOLD}, ${GOLD2})`; e.currentTarget.style.color = NAVY }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`; e.currentTarget.style.color = '#ffffff' }}
              >
                Continue to Application Forms
                <ArrowRight size={16} />
              </button>
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
            {/* Progress overview */}
            <div
              className="rounded-2xl p-4 flex flex-wrap items-center gap-3"
              style={{ backgroundColor: 'white', border: `1px solid ${GOLD}25`, boxShadow: '0 1px 8px rgba(0,26,77,0.06)' }}
            >
              <Users size={16} style={{ color: GOLD }} />
              <span className="text-sm font-bold" style={{ color: NAVY }}>
                {travelerCount} Traveler{travelerCount > 1 ? 's' : ''} — Complete all application forms below
              </span>
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
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold transition"
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
              <div key={i} id={`traveler-${i}`}>
                <TravelerForm
                  index={i}
                  count={travelerCount}
                  tour={tour}
                  data={t}
                  onChange={(field, value) => updateTraveler(i, field, value)}
                  errors={allErrors[i] || {}}
                  isExpanded={t.isExpanded}
                  onToggle={() => toggleExpand(i)}
                  isCompleted={t.isCompleted}
                />
                {/* Show error summary if that traveler has errors and is collapsed */}
                {!t.isExpanded && allErrors[i] && Object.keys(allErrors[i]).length > 0 && (
                  <div
                    className="mt-1 ml-2 flex items-center gap-2 text-xs font-semibold text-red-600 cursor-pointer"
                    onClick={() => toggleExpand(i)}
                  >
                    <AlertCircle size={13} />
                    {Object.keys(allErrors[i]).length} field{Object.keys(allErrors[i]).length > 1 ? 's' : ''} require attention — click to expand
                  </div>
                )}
              </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setStep(0); scrollTop() }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ color: NAVY, backgroundColor: 'white', border: `1.5px solid #e2e8f0` }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = NAVY}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <ArrowLeft size={15} /> Back
              </button>

              <button
                type="button"
                onClick={proceedToReview}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm transition"
                style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, boxShadow: '0 4px 14px rgba(0,26,77,0.22)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${GOLD}, ${GOLD2})`; e.currentTarget.style.color = NAVY }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`; e.currentTarget.style.color = '#ffffff' }}
              >
                Review Application <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────── STEP 2: Review ─────────── */}
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
                Review Application
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Please verify all information before proceeding to payment.
              </p>
            </div>

            {/* Traveler review cards */}
            <div className="space-y-4">
              {travelers.map((t, i) => (
                <ReviewCard
                  key={i}
                  index={i}
                  data={t}
                  onEdit={() => editTraveler(i)}
                />
              ))}
            </div>

            {/* Booking summary */}
            <div
              className="rounded-2xl p-5"
              style={{ background: `linear-gradient(135deg, ${NAVY}08, ${GOLD}06)`, border: `1px solid ${GOLD}30` }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: NAVY }}>
                Booking Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tour</span>
                  <span className="font-semibold" style={{ color: NAVY }}>{tour.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold" style={{ color: NAVY }}>{tour.location}</span>
                </div>
                {tour.date && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tour Date</span>
                    <span className="font-semibold" style={{ color: NAVY }}>
                      {new Date(tour.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Number of Travelers</span>
                  <span className="font-semibold" style={{ color: NAVY }}>{travelerCount}</span>
                </div>
                {tour.price > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price per Person</span>
                      <span className="font-semibold" style={{ color: NAVY }}>{formatINR(tour.price)}</span>
                    </div>
                    <div className="border-t border-dashed my-2" style={{ borderColor: `${GOLD}50` }} />
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-bold text-base" style={{ color: NAVY }}>Total Amount</span>
                      <span className="font-extrabold text-xl" style={{ color: GOLD }}>
                        {formatINR(totalPrice)}
                      </span>
                    </div>
                    <p className="text-[11px] text-right text-gray-400">
                      {formatINR(tour.price)} × {travelerCount} traveler{travelerCount > 1 ? 's' : ''}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Final confirmation checkbox */}
            <label
              className="flex items-start gap-3 cursor-pointer rounded-xl p-4 transition"
              style={{
                border: `1.5px solid ${confirmedCorrect ? GOLD : '#e2e8f0'}`,
                backgroundColor: confirmedCorrect ? `${GOLD}08` : 'white',
              }}
            >
              <input
                type="checkbox"
                checked={confirmedCorrect}
                onChange={(e) => setConfirmedCorrect(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-amber-600"
              />
              <span className="text-sm" style={{ color: NAVY }}>
                I confirm that all traveler information provided by me is correct and complete.
              </span>
            </label>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setStep(1); scrollTop() }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ color: NAVY, backgroundColor: 'white', border: `1.5px solid #e2e8f0` }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = NAVY}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <ArrowLeft size={15} /> Edit Applications
              </button>

              <div className="flex flex-col items-end gap-2">
                {submitError && (
                  <div className="p-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
                    {submitError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!confirmedCorrect || submitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: confirmedCorrect && !submitting
                      ? `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`
                      : '#94a3b8',
                    boxShadow: confirmedCorrect && !submitting ? '0 4px 14px rgba(0,26,77,0.22)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (confirmedCorrect && !submitting) {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${GOLD}, ${GOLD2})`
                      e.currentTarget.style.color = NAVY
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (confirmedCorrect && !submitting) {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <CreditCard size={15} /> Continue to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────── STEP 3: Success ─────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 sm:p-12" style={{ boxShadow: '0 4px 24px rgba(0,26,77,0.10)', border: `1px solid ${GOLD}30` }}>
              {/* Success icon */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: `linear-gradient(135deg, ${GOLD}25, ${GOLD}10)`, border: `3px solid ${GOLD}` }}
              >
                <CheckCircle2 size={36} style={{ color: GOLD }} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                Application Submitted Successfully
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                Thank you for choosing Alpine Explorers! Your application has been received.
                Our team will contact you shortly to confirm your booking.
              </p>

              {/* Booking details */}
              <div
                className="rounded-2xl p-5 mb-8 text-left max-w-sm mx-auto"
                style={{ background: `linear-gradient(135deg, ${NAVY}06, ${GOLD}06)`, border: `1px solid ${GOLD}30` }}
              >
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Booking ID</span>
                    <span className="font-extrabold tracking-widest" style={{ color: NAVY }}>{bookingId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Tour</span>
                    <span className="font-semibold text-right max-w-[60%]" style={{ color: NAVY }}>{tour.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Travelers</span>
                    <span className="font-semibold" style={{ color: NAVY }}>{travelerCount}</span>
                  </div>
                  {totalPrice && (
                    <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: `${GOLD}30` }}>
                      <span className="font-bold" style={{ color: NAVY }}>Total Amount</span>
                      <span className="font-extrabold text-base" style={{ color: GOLD }}>{formatINR(totalPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }}
                    >
                      ✓ Submitted
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition"
                  style={{
                    backgroundColor: 'white',
                    color: NAVY,
                    border: `1.5px solid ${NAVY}20`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = NAVY}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = `${NAVY}20`}
                >
                  <Download size={15} /> Download Application
                </button>

                <a
                  href="/home"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${GOLD}, ${GOLD2})`; e.currentTarget.style.color = NAVY }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`; e.currentTarget.style.color = '#ffffff' }}
                >
                  <Home size={15} /> Continue to Home
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
