import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, User, Mail, Phone, Users, Calendar, Send, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { api } from '../services/api'
import { getTripInfo } from '../utils/trips'

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'
const ERR = '#dc2626'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

const inputBase = {
  backgroundColor: '#ffffff',
  color: NAVY,
  borderRadius: '0.75rem',
  width: '100%',
  padding: '0.65rem 0.75rem 0.65rem 2.25rem',
  fontSize: '0.825rem',
  outline: 'none',
}

function Field({ id, label, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
        {label}
        {required && <span style={{ color: '#b45309' }}> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11px] font-semibold" style={{ color: ERR }}>
          {error}
        </p>
      )}
    </div>
  )
}

function inputStyle(hasError) {
  return { ...inputBase, border: `1px solid ${hasError ? ERR : 'rgba(180,160,130,0.5)'}` }
}

function buildErrors(form) {
  const errors = {}
  const fullName = form.fullName.trim()
  const email = form.email.trim()
  const phone = form.phone.replace(/\s+/g, '')
  if (!fullName) errors.fullName = 'Please enter your full name.'
  else if (fullName.length < 2) errors.fullName = 'Please enter a valid full name.'
  if (!email) errors.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.'
  if (!phone) errors.phone = 'Please enter your phone number.'
  else if (!/^(\+91)?0?[6-9]\d{9}$/.test(phone)) errors.phone = 'Please enter a valid phone number.'
  if (!form.travelers || Number(form.travelers) < 1) errors.travelers = 'Please select number of travelers.'
  if (!form.travelDate) errors.travelDate = 'Please select your preferred travel date.'
  return errors
}

export default function BookingModal({ item, isOpen, onClose }) {
  const dialogRef = useRef(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', travelers: '2', travelDate: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const trip = getTripInfo(item || {})
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (!isOpen) return
    setForm({ fullName: '', email: '', phone: '', travelers: '2', travelDate: '', message: '' })
    setErrors({})
    setStatus('idle')
    setErrorMsg('')

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
  }, [isOpen, onClose])

  const update = (key) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = GOLD
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,155,39,0.22)'
  }

  const handleBlur = (field) => (e) => {
    e.currentTarget.style.borderColor = errors[field] ? ERR : 'rgba(180,160,130,0.5)'
    e.currentTarget.style.boxShadow = 'none'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = buildErrors(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setStatus('submitting')
    setErrorMsg('')
    try {
      await api.post('/inquiries', {
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        destination: item.location || item.destination || '',
        package_name: item.title || item.name || 'Alpine Explorers Trip',
        travel_date: form.travelDate,
        travelers: Number(form.travelers) || 1,
        message: form.message.trim() || '',
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Something went wrong submitting your request. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
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
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl outline-none"
            style={{ backgroundColor: CREAM, boxShadow: '0 30px 80px rgba(0,10,30,0.5)', border: '1px solid rgba(212,175,55,0.35)' }}
          >
            <div className="sticky top-0 z-10 px-6 pt-6 pb-4" style={{ background: 'linear-gradient(135deg, #001a4d, #0d3a80 70%)', borderBottom: '2px solid rgba(212,175,55,0.5)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 id="booking-modal-title" className="text-xl sm:text-2xl font-bold text-white" style={font.vintage}>
                    Book Your Trip
                  </h3>
                  <p className="text-[11px] sm:text-xs mt-1.5 leading-relaxed" style={{ color: 'rgba(250,245,234,0.85)', ...font.body }}>
                    Complete the details below and our Alpine Explorers team will contact you shortly.
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

            <div className="px-6 py-6" style={{ ...font.body, color: BROWN }}>
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(212,175,55,0.18)', color: GOLD }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: NAVY, ...font.vintage }}>
                    Booking Request Sent!
                  </h4>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(58,42,24,0.8)' }}>
                    Thank you for your interest in Alpine Explorers.
                    <br />
                    Our team will contact you shortly.
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
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <Field id="booking-fullname" label="Full Name" required error={errors.fullName}>
                    <div className="relative">
                      <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
                      <input
                        id="booking-fullname"
                        type="text"
                        placeholder="e.g. Ananya Sharma"
                        autoComplete="name"
                        value={form.fullName}
                        onChange={update('fullName')}
                        onFocus={handleFocus}
                        onBlur={handleBlur('fullName')}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? 'booking-fullname-error' : undefined}
                        style={inputStyle(errors.fullName)}
                      />
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field id="booking-email" label="Email Address" required error={errors.email}>
                      <div className="relative">
                        <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
                        <input
                          id="booking-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={form.email}
                          onChange={update('email')}
                          onFocus={handleFocus}
                          onBlur={handleBlur('email')}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'booking-email-error' : undefined}
                          style={inputStyle(errors.email)}
                        />
                      </div>
                    </Field>

                    <Field id="booking-phone" label="Phone Number" required error={errors.phone}>
                      <div className="relative">
                        <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
                        <input
                          id="booking-phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          inputMode="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={update('phone')}
                          onFocus={handleFocus}
                          onBlur={handleBlur('phone')}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
                          style={inputStyle(errors.phone)}
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field id="booking-travelers" label="Number of Travelers" required error={errors.travelers}>
                      <div className="relative">
                        <Users size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
                        <input
                          id="booking-travelers"
                          type="number"
                          min="1"
                          max="50"
                          value={form.travelers}
                          onChange={update('travelers')}
                          onFocus={handleFocus}
                          onBlur={handleBlur('travelers')}
                          aria-invalid={!!errors.travelers}
                          aria-describedby={errors.travelers ? 'booking-travelers-error' : undefined}
                          style={inputStyle(errors.travelers)}
                        />
                      </div>
                    </Field>

                    <Field id="booking-traveldate" label="Preferred Travel Date" required error={errors.travelDate}>
                      <div className="relative">
                        <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
                        <input
                          id="booking-traveldate"
                          type="date"
                          min={today}
                          value={form.travelDate}
                          onChange={update('travelDate')}
                          onFocus={handleFocus}
                          onBlur={handleBlur('travelDate')}
                          aria-invalid={!!errors.travelDate}
                          aria-describedby={errors.travelDate ? 'booking-traveldate-error' : undefined}
                          style={inputStyle(errors.travelDate)}
                        />
                      </div>
                    </Field>
                  </div>

                  <Field id="booking-message" label="Special Requirements / Message" error={errors.message}>
                    <textarea
                      id="booking-message"
                      rows={3}
                      placeholder="Any special requirements, dietary needs, or questions... (optional)"
                      value={form.message}
                      onChange={update('message')}
                      onFocus={handleFocus}
                      onBlur={handleBlur('message')}
                      style={{ ...inputBase, padding: '0.65rem 0.75rem', resize: 'none', lineHeight: 1.5 }}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: NAVY, opacity: status === 'submitting' ? 0.75 : 1 }}
                    onMouseEnter={(e) => { if (status !== 'submitting') { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY } }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} aria-hidden="true" />
                        Submit Booking Request
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-xs font-semibold text-center" style={{ color: ERR }}>{errorMsg}</p>
                  )}

                  <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px]" style={{ color: 'rgba(58,42,24,0.6)' }}>
                    <ShieldCheck size={13} style={{ color: GOLD }} aria-hidden="true" />
                    No payment required — our team will confirm availability, pricing, and the booking process.
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}