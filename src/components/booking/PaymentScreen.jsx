import { useState, useEffect } from 'react'
import {
  QrCode, ShieldCheck, AlertCircle,
  Loader2, MessageSquare, ExternalLink, ArrowLeft,
  Copy, Check, Info, Lock
} from 'lucide-react'
import { supabase } from '../../services/supabaseClient'
import { PAYMENT_CONFIG } from '../../config/paymentConfig'
import { api } from '../../services/api'

const NAVY = 'var(--ae-navy)'
const NAVY_MID = 'var(--ae-navy-mid)'
const GOLD = 'var(--ae-gold)'

const WHATSAPP_NUMBER = PAYMENT_CONFIG.whatsappNumber || '919979883339'
const UPI_VPA = PAYMENT_CONFIG.upiId || '9979883339@upi'
const QR_IMAGE = PAYMENT_CONFIG.qrCode || '/payment/alpine-upi-qr.png'

function formatINR(amount) {
  if (!amount || amount <= 0) return 'Rs.0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function PaymentScreen({
  booking,
  tour,
  onUpiSubmitted,
  onBack,
}) {
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [upiSubmitted, setUpiSubmitted] = useState(booking.payment_status === 'pending_verification')
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [qrEnabled, setQrEnabled] = useState(true)
  const [closedMessage, setClosedMessage] = useState('Bookings are currently full. Please contact us for the next available dates.')

  const bookingRef = booking.booking_reference || booking.booking_id || 'ALP-BOOKING'
  const totalAmount = Number(booking.total_amount || 0)

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_settings')
        .select('qr_payment_enabled, closed_message')
        .eq('id', 1)
        .maybeSingle()
      if (!error && data) {
        setQrEnabled(Boolean(data.qr_payment_enabled))
        if (data.closed_message) setClosedMessage(data.closed_message)
        setSettingsLoading(false)
        return
      }
    } catch {}

    try {
      const json = await api.get('/api/public/booking-settings')
      if (json.settings) {
        setQrEnabled(Boolean(json.settings.qr_payment_enabled))
        if (json.settings.closed_message) setClosedMessage(json.settings.closed_message)
      }
    } catch {}

    setSettingsLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const buildWhatsAppUrl = () => {
    const msg = `Hello Alpine Explorers,\nI have completed the payment for my booking.\nBooking ID: ${bookingRef}\nTour/Package: ${booking.tour_name}\nApplicant Name: ${booking.customer_name}\nAmount Paid: Rs.${totalAmount.toLocaleString('en-IN')}\nPlease verify my payment.\nThank you.`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  const handleUpiPaymentDone = async () => {
    setProcessing(true)
    setErrorMsg('')
    try {
      let isEnabled = true
      let activeMsg = ''

      try {
        const { data: settings, error: settingsErr } = await supabase
          .from('booking_settings')
          .select('qr_payment_enabled, closed_message')
          .eq('id', 1)
          .maybeSingle()
        if (!settingsErr && settings) {
          isEnabled = Boolean(settings.qr_payment_enabled)
          activeMsg = settings.closed_message
        } else {
          throw new Error('Supabase check fallback')
        }
      } catch {
        const json = await api.get('/api/public/booking-settings')
        if (json.settings) {
          isEnabled = Boolean(json.settings.qr_payment_enabled)
          activeMsg = json.settings.closed_message
        }
      }

      if (!isEnabled) {
        setQrEnabled(false)
        if (activeMsg) setClosedMessage(activeMsg)
        setErrorMsg(activeMsg || 'QR payments are currently disabled.')
        return
      }

      const { error } = await supabase.rpc('report_upi_payment', { p_booking_reference: bookingRef })
      if (error) throw error
      setUpiSubmitted(true)
      window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer')
      if (typeof onUpiSubmitted === 'function') {
        onUpiSubmitted({ ...booking, payment_status: 'pending_verification', payment_method: 'UPI' })
      }
    } catch {
      setErrorMsg('We could not record your payment confirmation. Please try again or contact Alpine Explorers.')
    } finally {
      setProcessing(false)
    }
  }

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_VPA)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  if (settingsLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={28} className="animate-spin" style={{ color: GOLD }} />
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl bg-white border" style={{ borderColor: 'rgb(var(--ae-gold2-rgb) /0.45)' }}>
      {/* Header Banner */}
      <div
        className="px-6 py-6 text-white text-center relative"
        style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, borderBottom: '2px solid rgb(var(--ae-gold2-rgb) /0.4)' }}
      >
        <div className="flex items-center justify-between mb-2">
          {onBack && (
            <button type="button" onClick={onBack} className="text-xs flex items-center gap-1 text-white/80 hover:text-white transition cursor-pointer">
              <ArrowLeft size={14} /> Back to Summary
            </button>
          )}
          <div className="flex-1" />
          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-amber-300">
            <Lock size={11} /> 256-bit Secure Payment
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ fontFamily: 'Cinzel, serif', color: '#ffffff' }}>
          Complete Your Payment
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'rgb(var(--ae-cream-rgb) /0.85)' }}>
          {qrEnabled ? 'Scan the QR code below and confirm your UPI payment.' : 'Online booking is temporarily unavailable.'}
        </p>
        {/* Booking Summary Pill */}
        <div className="mt-5 rounded-xl p-4 text-left grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgb(var(--ae-gold2-rgb) /0.3)' }}>
          <div><span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Tour / Package</span><span className="text-xs font-bold text-white truncate block">{booking.tour_name}</span></div>
          <div><span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Customer</span><span className="text-xs font-bold text-white truncate block">{booking.customer_name}</span></div>
          <div><span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Booking ID</span><span className="text-xs font-bold text-white tracking-wider block" style={{ fontFamily: 'Cinzel, serif' }}>{bookingRef}</span></div>
          <div><span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Travelers</span><span className="text-xs font-bold text-white block">{booking.total_travelers} Guest{booking.total_travelers > 1 ? 's' : ''}</span></div>
          <div><span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Total Amount</span><span className="text-sm font-black text-amber-300 block">{formatINR(totalAmount)}</span></div>
          <div><span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Payment Status</span><span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">{upiSubmitted ? 'Pending Verification' : 'Pending'}</span></div>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mx-6 mt-6 rounded-xl px-4 py-3 text-xs font-semibold flex items-start gap-2 bg-red-50 text-red-700 border border-red-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Booking closed state — no QR rendered */}
      {!qrEnabled && (
        <div className="p-6">
          <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: '#fef9f0', borderColor: 'rgba(180,160,130,0.3)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(180,160,130,0.15)' }}>
              <ShieldCheck size={30} style={{ color: GOLD }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>Bookings Temporarily Unavailable</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">{closedMessage}</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg"
              style={{ backgroundColor: '#047857' }}>
              <MessageSquare size={16} /> Contact via WhatsApp <ExternalLink size={13} className="opacity-80" />
            </a>
          </div>
        </div>
      )}

      {/* QR Payment Panel — only rendered when enabled */}
      {qrEnabled && (
        <div className="p-6">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border text-center" style={{ backgroundColor: '#fcfaf6', borderColor: 'rgb(var(--ae-gold2-rgb) /0.3)' }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) /0.15)', color: NAVY }}>
                <QrCode size={13} style={{ color: GOLD }} />
                <span>Instant UPI Payment</span>
              </div>
              <div className="mb-4">
                <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Amount to Pay</span>
                <div className="text-3xl sm:text-4xl font-black mt-1" style={{ color: NAVY }}>{formatINR(totalAmount)}</div>
              </div>
              <div className="inline-block p-3.5 bg-white rounded-2xl shadow-md border" style={{ borderColor: 'rgba(180,160,130,0.35)' }}>
                <img src={QR_IMAGE} alt={`UPI QR code for Rs.${totalAmount}`} className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto" loading="lazy" decoding="async" />
              </div>
              <p className="text-xs font-semibold text-gray-700 mt-4 max-w-sm mx-auto">
                Scan this QR using Google Pay, PhonePe, Paytm or any UPI app.
              </p>
              <button type="button" onClick={copyUpiId}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs"
                style={{ borderColor: 'rgba(180,160,130,.4)', color: NAVY }}>
                UPI ID: {UPI_VPA} {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>

            {/* Verification notice */}
            <div className="rounded-xl p-4 border text-xs leading-relaxed" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}>
              <div className="flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-bold mb-1">Manual UPI Verification Step</p>
                  <p>After scanning and paying Rs.{totalAmount.toLocaleString('en-IN')}, click the confirmation button below. It will save your booking as <b>Pending Verification</b> and automatically open WhatsApp to notify our team for swift manual verification.</p>
                </div>
              </div>
            </div>

            {/* UPI Confirmation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleUpiPaymentDone}
                disabled={processing}
                className="w-full py-4 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: '#047857' }}
                onMouseEnter={(e) => { if (!processing) e.currentTarget.style.backgroundColor = '#065f46' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#047857' }}
              >
                {processing ? (
                  <><Loader2 size={18} className="animate-spin" /><span>Recording confirmation...</span></>
                ) : (
                  <><MessageSquare size={18} /><span>Payment Done - Send Confirmation</span><ExternalLink size={14} className="opacity-80" /></>
                )}
              </button>
              <p className="text-[11px] text-center text-gray-500 mt-2">
                Opens official Alpine Explorers WhatsApp at <b>+91 99798 83339</b>
              </p>
            </div>

            {/* Status after confirmation */}
            {upiSubmitted && (
              <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 text-center">
                <p className="font-bold mb-1">Payment Confirmation Submitted</p>
                <p>Status: <span className="font-bold uppercase tracking-wider text-amber-700">Pending Verification</span></p>
                <p className="mt-1 text-gray-600">Our admin team will review your payment and update the status to Paid.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
