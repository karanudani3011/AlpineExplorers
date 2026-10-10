import { useRef, useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'

export default function TourInquiryForm({ tour, isOpen, onClose, travelers = 1 }) {
  const [values, setValues] = useState({ startDate: '', returnDate: '', adults: Math.max(1, travelers), children: 0, name: '', email: '', phone: '', contact: 'Email', requests: '', consent: false })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const submittedRef = useRef(false)
  const destination = tour?.location || tour?.destination || tour?.title || ''
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  if (!isOpen || !tour) return null
  const closeForm = () => {
    if (!submitting) {
      submittedRef.current = false
      setSuccess(false)
      setError('')
    }
    onClose()
  }
  const update = (event) => setValues((prev) => ({ ...prev, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); setError('')
    if (!values.startDate || !values.name.trim() || !values.email.trim() || !values.phone.trim() || !values.consent) { setError('Complete all required fields and consent to continue.'); return }
    if (values.returnDate && values.returnDate < values.startDate) { setError('Return date must be on or after the travel start date.'); return }
    if (submittedRef.current || submitting) return
    submittedRef.current = true
    setSubmitting(true)
    try {
      const total = Number(values.adults) + Number(values.children)
      const details = { tourId: tour.id, adults: Number(values.adults), children: Number(values.children), returnDate: values.returnDate || null, preferredContact: values.contact, price: 'On Request', requests: values.requests }
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tour_id: tour.id, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), destination, package_name: tour.title, travel_date: values.startDate, travelers: total, message: `Booking inquiry (not a reservation). ${JSON.stringify(details)}` }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'The inquiry could not be submitted. Please try again.')
      setSuccess(true)
    } catch (err) { submittedRef.current = false; setError(err.message || 'The inquiry could not be submitted. Please try again.') }
    finally { setSubmitting(false) }
  }
  return <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/70 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="tour-inquiry-title">
    <div className="mx-auto my-4 max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:my-8 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="tour-inquiry-title" className="text-xl font-bold text-slate-900">Booking inquiry</h2><p className="mt-1 text-sm text-slate-600">{tour.title} · {destination}</p><p className="mt-1 text-sm font-semibold text-emerald-800">Price: On Request</p></div><button type="button" onClick={closeForm} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close inquiry form"><X size={20}/></button></div>
      {success ? <div className="rounded-xl bg-emerald-50 p-5 text-emerald-900"><CheckCircle2 className="mb-2"/><h3 className="font-bold">Inquiry received</h3><p className="mt-1 text-sm">This is an inquiry, not a confirmed reservation. The team will review your dates and share availability and a quotation.</p><button className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white" onClick={closeForm}>Done</button></div> : <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Tour<input readOnly value={`${tour.title} — ${tour.duration}`} className="mt-1 w-full rounded-lg border bg-slate-50 p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Destination<input readOnly value={destination} className="mt-1 w-full rounded-lg border bg-slate-50 p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Travel start date *<input required type="date" name="startDate" min={today} value={values.startDate} onChange={update} className="mt-1 w-full rounded-lg border p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Preferred return date<input type="date" name="returnDate" min={values.startDate || today} value={values.returnDate} onChange={update} className="mt-1 w-full rounded-lg border p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Adults *<input required min="1" type="number" name="adults" value={values.adults} onChange={update} className="mt-1 w-full rounded-lg border p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Children<input min="0" type="number" name="children" value={values.children} onChange={update} className="mt-1 w-full rounded-lg border p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Full name *<input required name="name" autoComplete="name" value={values.name} onChange={update} className="mt-1 w-full rounded-lg border p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Email address *<input required type="email" name="email" autoComplete="email" value={values.email} onChange={update} className="mt-1 w-full rounded-lg border p-2.5"/></label>
        <label className="text-sm font-medium text-slate-700">Mobile with country code *<input required type="tel" name="phone" autoComplete="tel" pattern="\\+[0-9][0-9 ()-]{7,18}" title="Include country code, for example +91 98765 43210" value={values.phone} onChange={update} className="mt-1 w-full rounded-lg border p-2.5" placeholder="+91…"/></label>
        <label className="text-sm font-medium text-slate-700">Preferred contact<select name="contact" value={values.contact} onChange={update} className="mt-1 w-full rounded-lg border p-2.5"><option>Email</option><option>Phone</option><option>WhatsApp</option></select></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Special requests<textarea name="requests" value={values.requests} onChange={update} rows="3" className="mt-1 w-full rounded-lg border p-2.5"/></label>
        <label className="flex items-start gap-2 text-sm text-slate-700 sm:col-span-2"><input required type="checkbox" name="consent" checked={values.consent} onChange={update} className="mt-1"/><span>I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-blue-700 underline">Privacy Policy</a> and allow Alpine Explorers to contact me about this inquiry.</span></label>
        <p className="text-xs text-slate-600 sm:col-span-2">Your submission requests a quotation; it does not confirm a reservation. Final pricing will be shared after review.</p>
        {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
        <button disabled={submitting} className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-60 sm:col-span-2">{submitting ? 'Submitting…' : 'Submit Booking Inquiry'}</button>
      </form>}
    </div>
  </div>
}
