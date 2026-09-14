import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, FileText, Download, Eye, FileSpreadsheet, ChevronDown,
  Loader2, MapPin, Calendar, Users, CreditCard, AlertCircle,
  CheckCircle2, User, Phone, Mail, Camera, PenTool, Shield, Heart
} from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, Badge, NAVY, GOLD, GOLD2, BG, font, Modal } from '../../components/admin/admin-ui'
import { TravelerDetailModal } from './BookingDetailModal'

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  
  const [booking, setBooking] = useState(null)
  const [travelers, setTravelers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [excelGenerating, setExcelGenerating] = useState(false)
  const [selectedTraveler, setSelectedTraveler] = useState(null)

  const loadBooking = async () => {
    setLoading(true)
    try {
      const data = await api.get(`/bookings/${id}`)
      setBooking(data.booking)
      setTravelers(data.travelers || [])
    } catch (e) {
      addToast(e.message, 'error')
      navigate('/admin/bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooking()
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus })
      addToast('Status updated')
      setBooking(prev => ({ ...prev, status: newStatus }))
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const generatePdf = async () => {
    setPdfGenerating(true)
    try {
      const res = await fetch(`${api.BASE}/bookings/${id}/download/pdf`, {
        headers: { 'Authorization': `Bearer ${api.getToken()}` }
      })
      if (!res.ok) throw new Error('Failed to generate PDF')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `booking-${booking?.booking_id || id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      addToast('PDF downloaded successfully')
    } catch (e) {
      addToast('Unable to generate PDF. Please try again.', 'error')
    } finally {
      setPdfGenerating(false)
    }
  }

  const generateExcel = async () => {
    setExcelGenerating(true)
    try {
      const res = await fetch(`${api.BASE}/bookings/${id}/download/excel`, {
        headers: { 'Authorization': `Bearer ${api.getToken()}` }
      })
      if (!res.ok) throw new Error('Failed to generate Excel')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `booking-${booking?.booking_id || id}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      addToast('Excel downloaded successfully')
    } catch (e) {
      addToast('Unable to generate Excel. Please try again.', 'error')
    } finally {
      setExcelGenerating(false)
    }
  }

  const generateIndividualPdf = async (travelerId, travelerNumber) => {
    try {
      const res = await fetch(`${api.BASE}/bookings/traveler/${travelerId}/download/pdf`, {
        headers: { 'Authorization': `Bearer ${api.getToken()}` }
      })
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `traveler-${travelerNumber}-${booking?.booking_id || id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      addToast('Individual PDF downloaded successfully')
    } catch (e) {
      addToast('Unable to generate PDF. Please try again.', 'error')
    }
  }

  const generateIndividualExcel = async (travelerId, travelerNumber) => {
    try {
      const res = await fetch(`${api.BASE}/bookings/traveler/${travelerId}/download/excel`, {
        headers: { 'Authorization': `Bearer ${api.getToken()}` }
      })
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `traveler-${travelerNumber}-${booking?.booking_id || id}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      addToast('Individual Excel downloaded successfully')
    } catch (e) {
      addToast('Unable to generate Excel. Please try again.', 'error')
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return '—'
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    const tones = { pending: 'new', confirmed: 'active', cancelled: 'inactive', completed: 'converted' }
    return <Badge tone={tones[status] || 'new'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  if (loading) return <Spinner />

  if (!booking) return null

  const primaryTraveler = travelers[0] || {}

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: font.body }}>
      <PageHeader
        icon={FileText}
        title={`Booking ${booking.booking_id}`}
        subtitle={`${booking.tour_name} · ${booking.number_of_travelers} Traveler${booking.number_of_travelers > 1 ? 's' : ''}`}
        actions={
          <div className="flex gap-2">
            <Link to="/admin/bookings" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition">
              <ArrowLeft size={14} /> Back
            </Link>
            <Btn variant="ghostGold" onClick={generatePdf} disabled={pdfGenerating || excelGenerating}>
              {pdfGenerating ? <><Loader2 size={14} className="animate-spin" /> Generating PDF...</> : <><Download size={14} /> Download Complete PDF</>}
            </Btn>
            <Btn variant="ghostGold" onClick={generateExcel} disabled={pdfGenerating || excelGenerating}>
              {excelGenerating ? <><Loader2 size={14} className="animate-spin" /> Generating Excel...</> : <><FileSpreadsheet size={14} /> Download Complete Excel</>}
            </Btn>
          </div>
        }
      />

      {/* Booking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel', color: NAVY }}>
            <FileText size={18} style={{ color: GOLD }} /> BOOKING DETAILS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Booking ID" value={booking.booking_id} />
            <DetailRow label="Tour" value={booking.tour_name} />
            <DetailRow label="Tour Category" value={booking.tour_category} />
            <DetailRow label="Location" value={booking.location} icon={MapPin} />
            <DetailRow label="Duration" value={booking.duration} icon={Calendar} />
            <DetailRow label="Travel Date" value={formatDate(booking.travel_date)} icon={Calendar} />
            <DetailRow label="Booking Date" value={formatDate(booking.booking_date)} icon={Calendar} />
            <DetailRow label="Price Per Person" value={formatCurrency(booking.price_per_person)} icon={CreditCard} />
            <DetailRow label="Number of Travelers" value={`${booking.number_of_travelers}`} icon={Users} />
            <DetailRow label="Total Amount" value={formatCurrency(booking.total_amount)} icon={CreditCard} />
            <DetailRow label="Status" value={
              <select
                value={booking.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="rounded-full text-[10px] font-bold uppercase px-2 py-1 border outline-none"
                style={{ background: '#fff', borderColor: 'rgba(0,26,77,0.2)', color: NAVY, fontFamily: font.body }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            } />
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel', color: NAVY }}>
            <User size={18} style={{ color: GOLD }} /> BOOKING CONTACT
          </h3>
          <div className="space-y-3">
            <DetailRow label="Name" value={booking.booking_contact_name || primaryTraveler.full_name || '—'} />
            <DetailRow label="Email" value={booking.booking_contact_email || '—'} icon={Mail} />
            <DetailRow label="Phone" value={booking.booking_contact_phone || primaryTraveler.contact_number || '—'} icon={Phone} />
          </div>
        </Card>
      </div>

      {/* Travelers */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2" style={{ fontFamily: 'Cinzel', color: NAVY }}>
            <Users size={18} style={{ color: GOLD }} /> TRAVELERS ({travelers.length})
          </h3>
        </div>

        {travelers.length === 0 ? (
          <p className="text-center py-8" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: font.body }}>No travelers found for this booking</p>
        ) : (
          <div className="space-y-6">
            {travelers.map((traveler, index) => (
              <TravelerCard
                key={traveler.id}
                traveler={traveler}
                index={index}
                booking={booking}
                onView={() => setSelectedTraveler(traveler)}
                onDownloadPdf={generateIndividualPdf}
                onDownloadExcel={generateIndividualExcel}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Traveler Detail Modal */}
      {selectedTraveler && (
        <TravelerDetailModal
          traveler={selectedTraveler}
          booking={booking}
          onClose={() => setSelectedTraveler(null)}
          onDownloadPdf={() => generateIndividualPdf(selectedTraveler.id, booking.booking_id)}
          onDownloadExcel={() => generateIndividualExcel(selectedTraveler.id, booking.booking_id)}
        />
      )}

      <ToastHost />
    </div>
  )
}

function DetailRow({ label, value, icon: Icon }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(0,26,77,0.45)', fontFamily: font.body }}>
        {Icon && <Icon size={12} className="inline-block mr-1" style={{ color: GOLD }} />} {label}
      </div>
      <div className="font-semibold text-sm" style={{ color: NAVY, fontFamily: font.body }}>
        {typeof value === 'object' ? value : (value || '—')}
      </div>
    </div>
  )
}

function TravelerCard({ traveler, index, booking, onView, onDownloadPdf, onDownloadExcel }) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [excelLoading, setExcelLoading] = useState(false)

  const handleDownloadPdf = async () => {
    setPdfLoading(true)
    try {
      await onDownloadPdf(traveler.id, index + 1)
    } finally {
      setPdfLoading(false)
    }
  }

  const handleDownloadExcel = async () => {
    setExcelLoading(true)
    try {
      await onDownloadExcel(traveler.id, index + 1)
    } finally {
      setExcelLoading(false)
    }
  }

  const age = traveler.date_of_birth ? calculateAge(traveler.date_of_birth) : traveler.age

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `rgba(197,155,39,0.3)`, background: '#fff' }}>
      {/* Traveler Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${NAVY}, #0d3a80)` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            {index + 1}
          </div>
          <div>
            <p className="text-white font-bold text-sm uppercase tracking-wider">Traveler {index + 1}</p>
            {traveler.full_name && <p className="text-xs mt-0.5" style={{ color: 'rgba(250,245,234,0.75)' }}>{traveler.full_name}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onView} className="p-2 rounded-xl transition text-white hover:bg-white/10" title="View Application"><Eye size={15} /></button>
          <button onClick={handleDownloadPdf} disabled={pdfLoading} className="p-2 rounded-xl transition text-white hover:bg-white/10" title="Download PDF">
            {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={15} />}
          </button>
          <button onClick={handleDownloadExcel} disabled={excelLoading} className="p-2 rounded-xl transition text-white hover:bg-white/10" title="Download Excel">
            {excelLoading ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={15} />}
          </button>
        </div>
      </div>

      {/* Traveler Info */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Photo */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-24 h-28 rounded-xl overflow-hidden border-2 shadow-sm" style={{ borderColor: `${GOLD}60` }}>
              {traveler.photo_url ? (
                <img src={traveler.photo_url} alt={traveler.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: `${NAVY}05` }}>
                  <Camera size={20} className="text-gray-300 mb-1" />
                  <span className="text-[9px] text-gray-300 text-center">No photo</span>
                </div>
              )}
            </div>
            {traveler.photo_url && (
              <a
                href={traveler.photo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 text-[11px] font-bold underline hover:opacity-80 transition"
                style={{ color: GOLD }}
              >
                View Photo
              </a>
            )}
          </div>

          {/* Info Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 w-full">
            <InfoRow label="Full Name" value={traveler.full_name} />
            <InfoRow label="Date of Birth" value={traveler.date_of_birth ? formatDate(traveler.date_of_birth) : ''} />
            <InfoRow label="Age" value={age ? `${age} years` : ''} />
            <InfoRow label="Gender" value={traveler.sex} />
            <InfoRow label="Blood Group" value={traveler.blood_group} />
            <InfoRow label="Contact" value={traveler.contact_number} />
            <InfoRow label="Education" value={traveler.education} />
            <InfoRow label="School / College" value={traveler.school_college} />
            <InfoRow label="Experience" value={
              traveler.adventure_experience === 'Yes'
                ? `Yes — ${traveler.adventure_details || 'Details not provided'}`
                : traveler.adventure_experience === 'No'
                ? 'No'
                : ''
            } />
            <InfoRow label="Participant Type" value={traveler.participant_type} />
            {traveler.participant_type === 'Minor' && (
              <>
                <InfoRow label="Guardian" value={traveler.guardian?.guardian_name || '—'} />
                <InfoRow label="Guardian Contact" value={traveler.guardian?.guardian_contact || '—'} />
              </>
            )}
          </div>
        </div>

        {/* Signature Previews */}
        {(traveler.declaration?.signature_url || traveler.risk_certificate?.signature_url) && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {traveler.declaration?.signature_url && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Applicant Signature</p>
                <div className="rounded-xl overflow-hidden border max-w-xs" style={{ borderColor: `${GOLD}30` }}>
                  <img src={traveler.declaration.signature_url} alt="Applicant signature" className="w-full h-16 object-contain bg-white" />
                </div>
              </div>
            )}
            {traveler.risk_certificate?.signature_url && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Risk Certificate Signature</p>
                <div className="rounded-xl overflow-hidden border max-w-xs" style={{ borderColor: `${GOLD}30` }}>
                  <img src={traveler.risk_certificate.signature_url} alt="Risk signature" className="w-full h-16 object-contain bg-white" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            style={{ background: NAVY, color: '#fff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = NAVY }}
            onMouseLeave={(e) => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' }}
          >
            <Eye size={14} /> View Application
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition"
              style={{ background: 'rgba(197,155,39,0.15)', color: NAVY, border: '1px solid rgba(197,155,39,0.4)' }}
            >
              {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
              Download PDF
            </button>
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={excelLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition"
              style={{ background: 'rgba(22,163,74,0.12)', color: '#166534', border: '1px solid rgba(22,163,74,0.3)' }}
            >
              {excelLoading ? <Loader2 size={13} className="animate-spin" /> : <FileSpreadsheet size={13} />}
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-semibold shrink-0 w-28 text-gray-500">{label}</span>
      <span style={{ color: NAVY }}>{value}</span>
    </div>
  )
}

function calculateAge(dob) {
  if (!dob) return ''
  const d = new Date(`${dob}T00:00:00`)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
  return age >= 0 && age < 120 ? age : ''
}