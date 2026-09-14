import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X, Check, ChevronLeft, ChevronRight, CheckCircle2, Loader2, ShieldCheck,
  Pencil, Ticket,
} from 'lucide-react'
import { api } from '../services/api'
import { getTripInfo, formatPrice } from '../utils/trips'
import TravelerForm, { calcAge } from './booking/TravelerForm'
import { NAVY, GOLD, GOLD2, CREAM, BROWN, ERR, font, NoticeBox } from './booking/bookingUi'

function createTraveler(tripTitle, today) {
  return {
    courseName: tripTitle,
    fullName: '',
    dob: '',
    sex: '',
    bloodGroup: '',
    address: '',
    contact: '',
    education: '',
    school: '',
    schoolAddress: '',
    schoolPhone: '',
    hobbies: '',
    photo: null,
    experienceYesNo: 'No',
    experienceDetails: '',
    declarationAccepted: false,
    sigPlace: '',
    sigDate: today,
    signature: '',
    participantType: 'adult',
    guardianName: '',
    guardianContact: '',
    riskAccepted: false,
    riskParticipantName: '',
    riskCourseName: tripTitle,
    riskPlace: '',
    riskDate: today,
    riskSignature: '',
  }
}

function validateTraveler(t) {
  const e = {}
  if (!t.courseName.trim()) e.courseName = 'Course name is required.'
  if (!t.fullName.trim()) e.fullName = 'Please enter the traveler full name.'
  else if (t.fullName.trim().length < 2) e.fullName = 'Please enter a valid full name.'
  if (!t.dob) e.dob = 'Please select the date of birth.'
  if (!t.sex) e.sex = 'Please select the sex.'
  if (!t.bloodGroup) e.bloodGroup = 'Please select the blood group.'
  if (!t.address.trim()) e.address = 'Please enter the address.'
  else if (t.address.trim().length < 8) e.address = 'Please enter a complete address.'
  const phone = String(t.contact || '').replace(/\s+/g, '')
  if (!phone) e.contact = 'Please enter the contact number.'
  else if (!/^(\+91)?0?[6-9]\d{9}$/.test(phone)) e.contact = 'Please enter a valid 10-digit Indian number.'
  if (!t.education.trim()) e.education = 'Please enter the education details.'
  if (!t.school.trim()) e.school = 'Please enter the school / college name.'
  if (t.schoolPhone && !/^(\+91)?0?[6-9]\d{9}$/.test(String(t.schoolPhone).replace(/\s+/g, '')) && !/^0?[0-9]{7,12}$/.test(String(t.schoolPhone).replace(/\s+/g, ''))) {
    e.schoolPhone = 'Enter a valid phone number or leave blank.'
  }
  if (!t.photo) e.photo = 'Please upload the traveler photograph.'
  if (t.experienceYesNo === 'Yes' && !t.experienceDetails.trim()) e.experienceDetails = 'Please give details of your experience.'
  if (!t.declarationAccepted) e.declaration = 'Please accept the declaration to continue.'
  if (!t.sigPlace.trim()) e.sigPlace = 'Please enter the place.'
  if (!t.sigDate) e.sigDate = 'Please select the date.'
  if (t.participantType === 'minor') {
    if (!t.guardianName.trim()) e.guardianName = 'Parent / guardian name is required.'
    const gp = String(t.guardianContact || '').replace(/\s+/g, '')
    if (!gp) e.guardianContact = 'Parent / guardian contact number is required.'
    else if (!/^(\+91)?0?[6-9]\d{9}$/.test(gp)) e.guardianContact = 'Please enter a valid 10-digit Indian number.'
  }
  if (!t.signature) e.signature = 'Please sign above.'
  if (!t.riskAccepted) e.risk = 'Please accept the risk certificate to continue.'
  if (!t.riskParticipantName.trim()) e.riskParticipantName = 'Participant name is required.'
  if (!t.riskCourseName.trim()) e.riskCourseName = 'Course name is required.'
  if (!t.riskPlace.trim()) e.riskPlace = 'Please enter the place.'
  if (!t.riskDate) e.riskDate = 'Please select the date.'
  if (!t.riskSignature) e.riskSignature = 'Please sign above.'
  return { errors: e, ok: Object.keys(e).length === 0 }
}

function sanitizeTraveler(t) {
  return {
    courseName: t.courseName,
    fullName: t.fullName,
    dob: t.dob,
    age: calcAge(t.dob),
    sex: t.sex,
    bloodGroup: t.bloodGroup,
    address: t.address,
    contact: t.contact,
    education: t.education,
    school: t.school,
    schoolAddress: t.schoolAddress,
    schoolPhone: t.schoolPhone,
    hobbies: t.hobbies,
    photo: t.photo ? t.photo.dataUrl : null,
    experienceYesNo: t.experienceYesNo,
    experienceDetails: t.experienceDetails,
    declarationAccepted: t.declarationAccepted,
    sigPlace: t.sigPlace,
    sigDate: t.sigDate,
    signature: t.signature,
    participantType: t.participantType,
    guardianName: t.guardianName,
    guardianContact: t.guardianContact,
    riskAccepted: t.riskAccepted,
    riskParticipantName: t.riskParticipantName,
    riskCourseName: t.riskCourseName,
    riskPlace: t.riskPlace,
    riskDate: t.riskDate,
    riskSignature: t.riskSignature,
  }
}

export default function BookingModal({ item, isOpen, onClose }) {
  const dialogRef = useRef(null)
  const bodyRef = useRef(null)

  const trip = getTripInfo(item || {})
  const today = new Date().toISOString().slice(0, 10)

  const price = typeof item?.price === 'number' && item.price > 0 ? item.price : null
  const perPerson = price ? formatPrice(price) : null

  const [count, setCountState] = useState(1)
  const [travelers, setTravelers] = useState(() => [createTraveler(trip.title, today)])
  const [errorsArr, setErrorsArr] = useState(() => [{}])
  const [activeTraveler, setActiveTraveler] = useState(0)
  const [view, setView] = useState('forms')
  const [confirmed, setConfirmed] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedBookingId, setSubmittedBookingId] = useState('')

  const total = price ? formatPrice(price * count) : null

  const reset = () => {
    const base = createTraveler(trip.title, today)
    setCountState(1)
    setTravelers([base])
    setErrorsArr([{}])
    setActiveTraveler(0)
    setView('forms')
    setConfirmed(false)
    setStatus('idle')
    setErrorMsg('')
    setSubmittedBookingId('')
  }

  useEffect(() => {
    if (!isOpen) return
    reset()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 60)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll('button, input, textarea, select, [href], [tabindex]:not([tabindex="-1"])')
        ).filter((el) => !el.disabled && el.offsetParent)
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [isOpen, onClose]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTraveler, view])

  const setCount = (n) => {
    const safe = Math.max(1, Math.min(50, n))
    setCountState(safe)
    setTravelers((prev) => {
      const next = [...prev]
      while (next.length < safe) next.push(createTraveler(trip.title, today))
      return next.slice(0, safe)
    })
    setErrorsArr((prev) => {
      const next = [...prev]
      while (next.length < safe) next.push({})
      return next.slice(0, safe)
    })
    setActiveTraveler((i) => Math.min(i, safe - 1))
  }

  const updateTraveler = (idx) => (key, value) => {
    setTravelers((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: value }
      return next
    })
    setErrorsArr((prev) => {
      if (!(key in prev[idx])) return prev
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: undefined }
      return next
    })
  }

  const setTravelerError = (idx) => (key, message) => {
    setErrorsArr((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: message }
      return next
    })
  }

  const continueFromTraveler = () => {
    const { errors, ok } = validateTraveler(travelers[activeTraveler])
    setErrorsArr((prev) => {
      const next = [...prev]
      next[activeTraveler] = errors
      return next
    })
    if (!ok) {
      setErrorMsg('Please complete the highlighted fields to continue.')
      return
    }
    setErrorMsg('')
    if (activeTraveler < count - 1) setActiveTraveler(activeTraveler + 1)
    else setView('review')
  }

  const backFromTraveler = () => {
    if (activeTraveler > 0) {
      setActiveTraveler(activeTraveler - 1)
      setErrorMsg('')
    }
  }

  const validateAll = () => {
    let firstInvalid = -1
    const errs = travelers.map((t, i) => {
      const { errors, ok } = validateTraveler(t)
      if (!ok && firstInvalid < 0) firstInvalid = i
      return errors
    })
    if (firstInvalid >= 0) {
      setErrorsArr(errs)
      setActiveTraveler(firstInvalid)
      setView('forms')
    }
    return firstInvalid
  }

  const goReview = () => {
    const firstInvalid = validateAll()
    setErrorMsg(firstInvalid >= 0 ? 'One or more travelers have incomplete applications — please review the highlighted fields.' : '')
    if (firstInvalid < 0) setView('review')
  }

  const goPayment = () => {
    const firstInvalid = validateAll()
    setErrorMsg(firstInvalid >= 0 ? 'One or more travelers have incomplete applications — please review the highlighted fields.' : '')
    if (firstInvalid < 0) setView('payment')
  }

  const editTraveler = (idx) => {
    setActiveTraveler(idx)
    setView('forms')
    setErrorMsg('')
  }

  const backToFormsLast = () => {
    setActiveTraveler(count - 1)
    setView('forms')
  }

  const goStep = (idx) => {
    if (idx >= count) {
      if (idx === count) goReview()
      else goPayment()
      return
    }
    if (idx < activeTraveler || view !== 'forms') {
      setActiveTraveler(idx)
      setView('forms')
      setErrorMsg('')
    }
  }

  const handleSubmit = async () => {
    if (!confirmed) {
      setErrorMsg('Please confirm that all information provided for every traveler is correct before continuing.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    try {
      const year = new Date().getFullYear()
      const rand = Math.floor(1000 + Math.random() * 9000)
      const genBookingId = `AE-${year}-${rand}`

      const payload = {
        booking_id: genBookingId,
        tour_id: item?.id ? String(item.id) : '',
        tour_name: trip.title || item?.title || 'Tour',
        tour_category: item?.category || 'Adventure',
        location: item?.location || item?.destination || '',
        duration: item?.duration || '',
        travel_date: item?.date || item?.travelDate || today,
        price_per_person: price,
        number_of_travelers: count,
        total_amount: price ? price * count : null,
        booking_contact_name: travelers[0]?.fullName || '',
        booking_contact_email: '',
        booking_contact_phone: travelers[0]?.contact || '',
        travelers: travelers.map((t) => ({
          courseName: t.courseName || trip.title,
          fullName: t.fullName,
          dob: t.dob,
          age: calcAge(t.dob),
          sex: t.sex,
          bloodGroup: t.bloodGroup,
          address: t.address,
          contact: t.contact,
          education: t.education,
          school: t.school,
          schoolAddress: t.schoolAddress,
          schoolPhone: t.schoolPhone,
          hobbies: t.hobbies,
          photo: t.photo ? (typeof t.photo === 'object' ? t.photo.dataUrl : t.photo) : null,
          experienceYesNo: t.experienceYesNo,
          experienceDetails: t.experienceDetails,
          declarationAccepted: t.declarationAccepted,
          declarationPlace: t.sigPlace,
          declarationDate: t.sigDate,
          signature: t.signature,
          participantType: t.participantType === 'minor' ? 'Minor' : 'Adult',
          guardianName: t.guardianName,
          guardianContact: t.guardianContact,
          sigGuardian: t.participantType === 'minor' ? t.signature : null,
          riskAccepted: t.riskAccepted,
          riskParticipantName: t.riskParticipantName,
          riskCourseName: t.riskCourseName,
          riskPlace: t.riskPlace,
          riskDate: t.riskDate,
          riskSignature: t.riskSignature,
        }))
      }

      const res = await api.post('/bookings', payload)
      setSubmittedBookingId(res?.bookingId || genBookingId)
      setStatus('done')
      setView('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Something went wrong submitting your application. Please try again.')
    }
  }

  const steps = [
    ...Array.from({ length: count }, (_, i) => ({ key: `traveler-${i}`, label: `Traveler ${i + 1}`, idx: i })),
    { key: 'review', label: 'Review', idx: count },
    { key: 'payment', label: 'Payment', idx: count + 1 },
  ]
  const currentIdx = view === 'forms' ? activeTraveler : view === 'review' ? count : count + 1

  const isTravelerDone = (t) => validateTraveler(t).ok

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(3,9,20,0.62)', backdropFilter: 'blur(5px)' }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full h-[100dvh] sm:h-auto flex flex-col
              sm:max-h-[90vh] sm:max-w-[960px] sm:rounded-2xl
              rounded-none outline-none overflow-hidden"
            style={{ backgroundColor: CREAM, boxShadow: '0 30px 80px rgba(0,10,30,0.5)', border: '1px solid rgba(212,175,55,0.35)' }}
          >
            {/* Header */}
            <div className="shrink-0 px-5 sm:px-7 pt-6 pb-4" style={{ background: 'linear-gradient(135deg, #001a4d, #0d3a80 70%)', borderBottom: '2px solid rgba(212,175,55,0.5)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 id="booking-modal-title" className="text-xl sm:text-2xl font-bold text-white" style={font.vintage}>
                    Book Your Trip
                  </h3>
                  <p className="text-[11px] sm:text-xs mt-1.5 leading-relaxed" style={{ color: 'rgba(250,245,234,0.85)', ...font.body }}>
                    Complete the application details for your selected trip.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close booking modal"
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer"
                  style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#ffffff' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#ffffff' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(250,245,234,0.1)', border: '1px solid rgba(212,175,55,0.35)' }}>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD2 }}>Selected Trip</span>
                <div className="text-white font-bold text-sm mt-0.5" style={font.vintage}>{trip.title}</div>
                {trip.fields.length > 0 && (
                  <div className="text-[11px] mt-1 leading-relaxed" style={{ color: 'rgba(250,245,234,0.8)' }}>
                    {trip.fields.map(([, value]) => (
                      <div key={value}>{value}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable body */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 py-5" style={{ ...font.body, color: BROWN }}>
              {view === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(212,175,55,0.18)', color: GOLD }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: NAVY, ...font.vintage }}>
                    Application Submitted!
                  </h4>
                  {submittedBookingId && (
                    <div className="inline-block px-4 py-2 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0,26,77,0.06)', border: '1px solid rgba(197,155,39,0.3)' }}>
                      <span className="text-[10px] uppercase tracking-wider font-bold block" style={{ color: GOLD }}>Booking ID</span>
                      <span className="text-base sm:text-lg font-bold" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>{submittedBookingId}</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed mb-8 mx-auto max-w-md" style={{ color: 'rgba(58,42,24,0.8)' }}>
                    Thank you for your application for <strong>{trip.title}</strong>.
                    <br />
                    Our Alpine Explorers team will review your application and contact you shortly to confirm availability and payment details.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-10 py-3 rounded-xl text-sm font-bold text-white transition cursor-pointer"
                    style={{ backgroundColor: NAVY }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Stepper */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                    {steps.map((s) => {
                      const done = s.idx < currentIdx
                      const active = s.idx === currentIdx
                      const travelerOk = s.idx < count ? isTravelerDone(travelers[s.idx]) : false
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => goStep(s.idx)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${s.idx >= count ? 'hidden sm:inline-flex' : ''}`}
                          style={{
                            backgroundColor: active ? NAVY : done || travelerOk ? 'rgba(197,155,39,0.14)' : '#ffffff',
                            color: active ? '#ffffff' : NAVY,
                            border: `1px solid ${active ? NAVY : done || travelerOk ? GOLD : 'rgba(180,160,130,0.5)'}`,
                          }}
                        >
                          {done || travelerOk ? <Check size={11} style={{ color: active ? '#ffffff' : GOLD }} aria-hidden="true" /> : <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active ? '#ffffff' : 'rgba(180,160,130,0.6)' }} />}
                          {s.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Traveler count */}
                  {view === 'forms' && (
                    <div className="mt-4 rounded-xl px-4 py-3 flex items-center justify-between gap-4" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(212,175,55,0.45)' }}>
                      <div style={font.body}>
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: NAVY }}>
                          Number of Travelers<span style={{ color: '#b45309' }}> *</span>
                        </span>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(58,42,24,0.6)' }}>
                          Each traveler fills their own independent application.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => setCount(count - 1)}
                          disabled={count <= 1}
                          aria-label="Decrease travelers"
                          className="w-9 h-9 rounded-xl text-lg font-black transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ backgroundColor: NAVY, color: '#ffffff' }}
                          onMouseEnter={(e) => { if (count > 1) { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY } }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                        >
                          −
                        </button>
                        <span className="text-xl font-black min-w-[2ch] text-center" style={{ color: NAVY, ...font.vintage }}>{count}</span>
                        <button
                          type="button"
                          onClick={() => setCount(count + 1)}
                          aria-label="Increase travelers"
                          className="w-9 h-9 rounded-xl text-lg font-black transition cursor-pointer"
                          style={{ backgroundColor: NAVY, color: '#ffffff' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Forms */}
                  {view === 'forms' && (
                    <div className="mt-5">
                      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(0,26,77,0.06)', border: '1px solid rgba(212,175,55,0.5)' }}>
                        <h4 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, ...font.vintage }}>
                          Traveler {activeTraveler + 1} <span className="text-sm font-semibold" style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}>/ APPLICATION FORM</span>
                        </h4>
                      </div>
                      <div className="mt-5">
                        <TravelerForm
                          key={`traveler-${activeTraveler}`}
                          index={activeTraveler}
                          count={count}
                          trip={trip}
                          traveler={travelers[activeTraveler]}
                          errors={errorsArr[activeTraveler] || {}}
                          onChange={updateTraveler(activeTraveler)}
                          onSetError={setTravelerError(activeTraveler)}
                          maxDob={today}
                        />
                      </div>
                    </div>
                  )}

                  {/* Review */}
                  {view === 'review' && (
                    <div className="mt-5 space-y-5">
                      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(0,26,77,0.06)', border: '1px solid rgba(212,175,55,0.5)' }}>
                        <h4 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, ...font.vintage }}>Review Application</h4>
                        <p className="text-xs mt-1" style={{ color: 'rgba(58,42,24,0.65)', ...font.body }}>
                          Verify all traveler applications below before continuing to payment.
                        </p>
                      </div>
                      {travelers.map((t, i) => {
                        const age = calcAge(t.dob)
                        return (
                          <div key={`review-${i}`} className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(180,160,130,0.5)' }}>
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black" style={{ backgroundColor: 'rgba(0,26,77,0.08)', color: NAVY }}>
                                  {i + 1}
                                </span>
                                <div>
                                  <p className="text-sm font-bold" style={{ color: NAVY, ...font.body }}>
                                    {t.fullName || `Traveler ${i + 1}`}
                                  </p>
                                  <p className="text-[11px]" style={{ color: GOLD, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                                    {t.participantType === 'minor' ? 'Minor Participant' : 'Adult Participant'}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => editTraveler(i)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer"
                                style={{ color: NAVY, backgroundColor: 'rgba(212,175,55,0.14)', border: '1px solid rgba(212,175,55,0.55)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.14)'; e.currentTarget.style.color = NAVY }}
                              >
                                <Pencil size={12} aria-hidden="true" />
                                Edit Traveler {i + 1}
                              </button>
                            </div>

                            <div className="flex gap-4 mt-4">
                              <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(180,160,130,0.5)', backgroundColor: 'rgba(250,245,234,0.6)' }}>
                                {t.photo ? (
                                  <img src={t.photo.dataUrl} alt={`${t.fullName || `Traveler ${i + 1}`} photograph`} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#b8996b]" style={font.body}>No photo</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[11px]" style={{ ...font.body, color: BROWN }}>
                                <div><span style={{ color: 'rgba(58,42,24,0.55)' }}>Name of Course</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.courseName}</span></div>
                                <div><span style={{ color: 'rgba(58,42,24,0.55)' }}>Full Name</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.fullName}</span></div>
                                <div><span style={{ color: 'rgba(58,42,24,0.55)' }}>Age / Sex</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{age || '—'} · {t.sex}</span></div>
                                <div><span style={{ color: 'rgba(58,42,24,0.55)' }}>Blood Group</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.bloodGroup}</span></div>
                                <div><span style={{ color: 'rgba(58,42,24,0.55)' }}>Contact</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.contact}</span></div>
                                <div><span style={{ color: 'rgba(58,42,24,0.55)' }}>Education</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.education}</span></div>
                                <div className="col-span-2 sm:col-span-3"><span style={{ color: 'rgba(58,42,24,0.55)' }}>School / College</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.school}{t.schoolAddress ? ` — ${t.schoolAddress}` : ''}</span></div>
                                <div className="col-span-2 sm:col-span-3"><span style={{ color: 'rgba(58,42,24,0.55)' }}>Address</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.address}</span></div>
                                <div className="sm:col-span-3"><span style={{ color: 'rgba(58,42,24,0.55)' }}>Hobbies</span><br /><span style={{ color: NAVY, fontWeight: 600 }}>{t.hobbies || '—'}</span></div>
                                <div className="sm:col-span-3">
                                  <span style={{ color: 'rgba(58,42,24,0.55)' }}>Adventure / Cultural Experience</span><br />
                                  <span style={{ color: NAVY, fontWeight: 600 }}>{t.experienceYesNo}{t.experienceYesNo === 'Yes' && t.experienceDetails ? ` — ${t.experienceDetails}` : ''}</span>
                                </div>
                                {t.participantType === 'minor' && (
                                  <div className="sm:col-span-3">
                                    <span style={{ color: 'rgba(58,42,24,0.55)' }}>Parent / Guardian</span><br />
                                    <span style={{ color: NAVY, fontWeight: 600 }}>{t.guardianName} · {t.guardianContact}</span>
                                  </div>
                                )}
                                <div className="sm:col-span-3 flex flex-wrap gap-4">
                                  <span style={{ color: 'rgba(58,42,24,0.55)' }}>Applicant Signature: {t.signature ? <strong style={{ color: NAVY }}>Signed · {t.sigPlace} · {t.sigDate}</strong> : <strong style={{ color: ERR }}>Not signed</strong>}</span>
                                  <span style={{ color: 'rgba(58,42,24,0.55)' }}>Risk Certificate: {t.riskSignature ? <strong style={{ color: NAVY }}>Signed · {t.riskPlace} · {t.riskDate}</strong> : <strong style={{ color: ERR }}>Not signed</strong>}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Payment / Summary */}
                  {view === 'payment' && (
                    <div className="mt-5 space-y-5">
                      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(0,26,77,0.06)', border: '1px solid rgba(212,175,55,0.5)' }}>
                        <h4 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, ...font.vintage }}>Booking Summary</h4>
                        <p className="text-xs mt-1" style={{ color: 'rgba(58,42,24,0.65)', ...font.body }}>
                          Review your booking details and confirm before proceeding to payment.
                        </p>
                      </div>

                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(180,160,130,0.5)', backgroundColor: '#ffffff' }}>
                        <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #001a4d, #0d3a80 70%)' }}>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD2 }}>Selected Trip</span>
                          <div className="text-white font-bold text-base mt-0.5" style={font.vintage}>{trip.title}</div>
                          {trip.fields.length > 0 && (
                            <div className="text-[11px] mt-1 leading-relaxed" style={{ color: 'rgba(250,245,234,0.8)' }}>
                              {trip.fields.map(([, value]) => <div key={value}>{value}</div>)}
                            </div>
                          )}
                        </div>
                        <div className="px-5 py-4 divide-y divide-[rgba(180,160,130,0.25)]" style={font.body}>
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(58,42,24,0.6)' }}>Travelers</span>
                            <span className="text-sm font-bold" style={{ color: NAVY }}>{count}</span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(58,42,24,0.6)' }}>Price per Person</span>
                            <span className="text-sm font-bold" style={{ color: NAVY }}>{perPerson ? `${perPerson} / person` : 'On Request'}</span>
                          </div>
                          <div className="py-3.5 flex items-center justify-between gap-4">
                            <span className="text-xs font-black uppercase tracking-wider" style={{ color: NAVY }}>Total Amount</span>
                            <span className="text-xl font-black" style={{ color: GOLD, ...font.vintage }}>{total || 'On Request'}</span>
                          </div>
                        </div>
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer" style={font.body}>
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => { setConfirmed(e.target.checked); if (e.target.checked) setErrorMsg('') }}
                          className="mt-0.5 w-4 h-4 cursor-pointer accent-[#001a4d]"
                        />
                        <span className="text-xs leading-relaxed" style={{ color: BROWN }}>
                          I confirm that all information provided for every traveler is correct.<span style={{ color: '#b45309' }}> *</span>
                        </span>
                      </label>

                      <NoticeBox>
                        <ShieldCheck size={13} className="inline mr-1 -translate-y-px" style={{ color: GOLD }} />
                        No payment is collected in this form. After submission, our Alpine Explorers team will review your
                        application and guide you through the payment and confirmation process.
                      </NoticeBox>
                    </div>
                  )}

                  {/* Error banner */}
                  {errorMsg && (
                    <div className="mt-5 rounded-xl px-4 py-3 text-xs font-semibold" style={{ backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.35)', color: ERR, ...font.body }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* Nav buttons */}
                  {view !== 'success' && (
                    <div className="mt-6 pb-2 flex flex-wrap items-center justify-between gap-3">
                      {view === 'forms' ? (
                        <button
                          type="button"
                          onClick={backFromTraveler}
                          disabled={activeTraveler === 0}
                          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ color: NAVY, backgroundColor: 'rgba(197,155,39,0.1)', border: '1px solid rgba(197,155,39,0.5)' }}
                        >
                          <ChevronLeft size={14} aria-hidden="true" />
                          Back
                        </button>
                      ) : view === 'review' ? (
                        <button
                          type="button"
                          onClick={backToFormsLast}
                          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
                          style={{ color: NAVY, backgroundColor: 'rgba(197,155,39,0.1)', border: '1px solid rgba(197,155,39,0.5)' }}
                        >
                          <ChevronLeft size={14} aria-hidden="true" />
                          Back to Traveler {count}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setView('review')}
                          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
                          style={{ color: NAVY, backgroundColor: 'rgba(197,155,39,0.1)', border: '1px solid rgba(197,155,39,0.5)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(197,155,39,0.1)'; e.currentTarget.style.color = NAVY }}
                        >
                          <ChevronLeft size={14} aria-hidden="true" />
                          Back to Review
                        </button>
                      )}

                      {view === 'forms' ? (
                        <button
                          type="button"
                          onClick={continueFromTraveler}
                          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                          style={{ backgroundColor: NAVY }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                        >
                          {activeTraveler < count - 1 ? 'Save & Continue' : 'Continue to Review'}
                          <ChevronRight size={14} aria-hidden="true" />
                        </button>
                      ) : view === 'review' ? (
                        <button
                          type="button"
                          onClick={goPayment}
                          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                          style={{ backgroundColor: NAVY }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                        >
                          Continue to Payment
                          <ChevronRight size={14} aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={status === 'submitting'}
                          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                          style={{ backgroundColor: NAVY, opacity: status === 'submitting' ? 0.75 : 1 }}
                          onMouseEnter={(e) => { if (status !== 'submitting') { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY } }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                        >
                          {status === 'submitting' ? (
                            <>
                              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Ticket size={14} aria-hidden="true" />
                              Continue to Payment
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}