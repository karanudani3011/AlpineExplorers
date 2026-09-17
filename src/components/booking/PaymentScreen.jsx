import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import {
  QrCode, CreditCard, ShieldCheck, CheckCircle2, AlertCircle,
  Loader2, ArrowRight, MessageSquare, ExternalLink, ArrowLeft,
  Copy, Check, Info, Lock
} from 'lucide-react'
import { api } from '../../services/api'
import { supabase } from '../../services/supabaseClient'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

const WHATSAPP_NUMBER = '919979883339' // +91 99798 83339
const UPI_VPA = '9979883339@upi'

function formatINR(amount) {
  if (!amount || amount <= 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return 'Flexible / To be decided'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PaymentScreen({
  booking,
  tour,
  onPaymentSuccess,
  onUpiSubmitted,
  onBack,
}) {
  const [method, setMethod] = useState('upi') // 'upi' | 'card'
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [loadingQr, setLoadingQr] = useState(true)
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [upiSubmitted, setUpiSubmitted] = useState(booking.payment_status === 'pending_verification')
  const [cardPaid, setCardPaid] = useState(booking.payment_status === 'paid')
  const [paymentDetails, setPaymentDetails] = useState(null)

  const bookingRef = booking.booking_reference || booking.booking_id || 'ALP-BOOKING'
  const totalAmount = Number(booking.total_amount || 0)

  // Generate UPI URI
  const upiUri = useMemo(() => {
    const encodedName = encodeURIComponent('Alpine Explorers')
    const encodedNote = encodeURIComponent(`Booking ${bookingRef}`)
    return `upi://pay?pa=${UPI_VPA}&pn=${encodedName}&am=${totalAmount}&cu=INR&tn=${encodedNote}`
  }, [bookingRef, totalAmount])

  // Generate QR Code dynamically from exact booking total
  useEffect(() => {
    let active = true
    setLoadingQr(true)
    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#001a4d',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) {
          setQrDataUrl(url)
          setLoadingQr(false)
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err)
        if (active) setLoadingQr(false)
      })

    return () => { active = false }
  }, [upiUri])

  // Programmatic WhatsApp deep-link generation
  const buildWhatsAppUrl = () => {
    const travelDateFormatted = formatDate(booking.tour_date)
    const msg = `Hello Alpine Explorers,

I have completed my booking payment.

Booking ID: ${bookingRef}
Customer Name: ${booking.customer_name}
Tour/Package: ${booking.tour_name}
Travel Date: ${travelDateFormatted}
Number of Travelers: ${booking.total_travelers}
Amount Paid: ₹${totalAmount.toLocaleString('en-IN')}
Payment Method: UPI / GPay

Please verify my payment and confirm my booking.

Thank you.`

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  // Handle UPI Confirmation
  const handleUpiPaymentDone = async () => {
    setProcessing(true)
    setErrorMsg('')
    try {
      // 1. Update status in backend SQLite
      try {
        await api.post('/bookings', {
          booking_id: bookingRef,
          payment_status: 'pending_verification',
          payment_method: 'UPI',
          booking_status: 'pending',
          total_amount: totalAmount,
          travelers: [{ fullName: booking.customer_name }],
        })
      } catch (err) {
        console.warn('Backend UPI update note:', err.message)
      }

      // 2. Update status in Supabase
      try {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'pending_verification',
            payment_method: 'UPI',
            status: 'pending',
            updated_at: new Date().toISOString(),
          })
          .eq('booking_reference', bookingRef)
      } catch (supErr) {
        console.warn('Supabase UPI update note:', supErr.message)
      }

      setUpiSubmitted(true)

      // 3. Open WhatsApp with pre-filled message
      const waUrl = buildWhatsAppUrl()
      window.open(waUrl, '_blank', 'noopener,noreferrer')

      if (typeof onUpiSubmitted === 'function') {
        onUpiSubmitted({
          ...booking,
          payment_status: 'pending_verification',
          payment_method: 'UPI',
        })
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to submit payment confirmation. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // Handle Card Payment (Razorpay Checkout)
  const handleCardPayment = async () => {
    setProcessing(true)
    setErrorMsg('')

    try {
      // 1. Create order on backend
      const orderData = await api.post('/payments/create-order', {
        amount: totalAmount,
        booking_id: bookingRef,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
      })

      // Helper to dynamically load Razorpay checkout script if not present
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true)
            return
          }
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
      }

      const scriptLoaded = await loadRazorpayScript()

      // If Razorpay script loaded and order is a live/test gateway order
      if (scriptLoaded && window.Razorpay && !orderData.isMock) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Alpine Explorers',
          description: `Payment for ${booking.tour_name} (${bookingRef})`,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=128&h=128&fit=crop',
          order_id: orderData.order_id,
          prefill: {
            name: booking.customer_name,
            email: booking.customer_email,
            contact: booking.customer_phone,
          },
          notes: {
            booking_id: bookingRef,
          },
          theme: {
            color: NAVY,
          },
          modal: {
            ondismiss: () => {
              setProcessing(false)
            },
          },
          handler: async (response) => {
            try {
              // Verify on backend
              const verifyRes = await api.post('/payments/verify', {
                booking_id: bookingRef,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                payment_method: 'CARD',
                amount: totalAmount,
              })

              setCardPaid(true)
              setPaymentDetails(verifyRes)
              if (typeof onPaymentSuccess === 'function') {
                onPaymentSuccess({
                  ...booking,
                  payment_status: 'paid',
                  payment_id: verifyRes.payment_id,
                  order_id: verifyRes.order_id,
                })
              }
            } catch (verErr) {
              setErrorMsg(verErr.message || 'Payment verification failed. Please contact support.')
            } finally {
              setProcessing(false)
            }
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', (resp) => {
          setErrorMsg(resp.error?.description || 'Payment failed. Please try again.')
          setProcessing(false)
        })
        rzp.open()
      } else {
        // Fallback Sandbox Simulator (when no live Razorpay API keys are configured in .env)
        // Simulate a 1.2-second secure gateway handshake and verify via backend
        window.setTimeout(async () => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              booking_id: bookingRef,
              razorpay_order_id: orderData.order_id,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'sandbox_verified_sig',
              payment_method: 'CARD',
              amount: totalAmount,
            })

            setCardPaid(true)
            setPaymentDetails(verifyRes)
            if (typeof onPaymentSuccess === 'function') {
              onPaymentSuccess({
                ...booking,
                payment_status: 'paid',
                payment_id: verifyRes.payment_id,
                order_id: verifyRes.order_id,
              })
            }
          } catch (simErr) {
            setErrorMsg(simErr.message || 'Sandbox verification failed')
          } finally {
            setProcessing(false)
          }
        }, 1200)
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to initialize card payment. Please try again.')
      setProcessing(false)
    }
  }

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_VPA)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  // ── Success state after Card payment ──
  if (cardPaid) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl overflow-hidden text-center shadow-xl border bg-white"
        style={{ borderColor: 'rgba(16,185,129,0.4)' }}
      >
        <div className="py-10 px-6 bg-gradient-to-br from-emerald-700 to-teal-900 text-white">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-emerald-500/20 border-2 border-emerald-400/60">
            <CheckCircle2 size={38} className="text-emerald-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
            Payment Successful
          </h2>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            Your booking payment has been verified and confirmed. Pack your bags for an incredible journey!
          </p>
        </div>

        <div className="p-6 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
          <div className="inline-block px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-0.5">Booking Reference</p>
            <p className="text-2xl font-black tracking-wider" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
              {bookingRef}
            </p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
          <div>
            <span className="text-gray-500 block uppercase font-bold text-[10px]">Tour / Package</span>
            <span className="text-sm font-semibold text-gray-900">{booking.tour_name}</span>
          </div>
          <div>
            <span className="text-gray-500 block uppercase font-bold text-[10px]">Customer Name</span>
            <span className="text-sm font-semibold text-gray-900">{booking.customer_name}</span>
          </div>
          <div>
            <span className="text-gray-500 block uppercase font-bold text-[10px]">Travel Date</span>
            <span className="text-sm font-semibold text-gray-900">{formatDate(booking.tour_date)}</span>
          </div>
          <div>
            <span className="text-gray-500 block uppercase font-bold text-[10px]">Amount Paid</span>
            <span className="text-sm font-bold text-emerald-700">{formatINR(totalAmount)}</span>
          </div>
          <div>
            <span className="text-gray-500 block uppercase font-bold text-[10px]">Payment Method</span>
            <span className="text-sm font-semibold text-gray-900">Card / Gateway</span>
          </div>
          <div>
            <span className="text-gray-500 block uppercase font-bold text-[10px]">Payment Status</span>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Paid
            </span>
          </div>
        </div>

        <div className="p-6 pt-2 pb-8 flex justify-center">
          <button
            type="button"
            onClick={() => onPaymentSuccess?.({ ...booking, payment_status: 'paid' })}
            className="px-8 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
            style={{ backgroundColor: NAVY }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NAVY_MID}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = NAVY}
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl bg-white border" style={{ borderColor: 'rgba(212,175,55,0.45)' }}>
      {/* Title Header Banner */}
      <div
        className="px-6 py-6 text-white text-center relative"
        style={{
          background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
          borderBottom: '2px solid rgba(212,175,55,0.4)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs flex items-center gap-1 text-white/80 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Summary
            </button>
          )}
          <div className="flex-1" />
          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-amber-300">
            <Lock size={11} /> 256-bit Secure Payment
          </div>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold tracking-wide"
          style={{ fontFamily: 'Cinzel, serif', color: '#ffffff' }}
        >
          Complete Your Payment
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'rgba(250,245,234,0.85)' }}>
          Review your booking details and choose your preferred payment option below.
        </p>

        {/* Prominent Booking Summary Pill */}
        <div
          className="mt-5 rounded-xl p-4 text-left grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Tour / Package</span>
            <span className="text-xs font-bold text-white truncate block">{booking.tour_name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Customer</span>
            <span className="text-xs font-bold text-white truncate block">{booking.customer_name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Booking ID</span>
            <span className="text-xs font-bold text-white tracking-wider block" style={{ fontFamily: 'Cinzel, serif' }}>
              {bookingRef}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Travelers</span>
            <span className="text-xs font-bold text-white block">{booking.total_travelers} Guest{booking.total_travelers > 1 ? 's' : ''}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Total Amount</span>
            <span className="text-sm font-black text-amber-300 block">{formatINR(totalAmount)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-200">Payment Status</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
              {upiSubmitted ? 'Pending Verification' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mx-6 mt-6 rounded-xl px-4 py-3 text-xs font-semibold flex items-start gap-2 bg-red-50 text-red-700 border border-red-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Two Payment Method Tabs */}
      <div className="p-6">
        <div className="flex rounded-xl p-1 mb-6 border" style={{ backgroundColor: '#f4ede1', borderColor: 'rgba(180,160,130,0.3)' }}>
          <button
            type="button"
            onClick={() => { setMethod('upi'); setErrorMsg('') }}
            className={`flex-1 py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              method === 'upi'
                ? 'bg-white shadow-md text-[#001a4d]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <QrCode size={17} style={{ color: method === 'upi' ? GOLD : undefined }} />
            <span>Pay with UPI / Google Pay</span>
          </button>

          <button
            type="button"
            onClick={() => { setMethod('card'); setErrorMsg('') }}
            className={`flex-1 py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              method === 'card'
                ? 'bg-white shadow-md text-[#001a4d]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard size={17} style={{ color: method === 'card' ? GOLD : undefined }} />
            <span>Pay with Card</span>
          </button>
        </div>

        {/* ── OPTION 1: UPI / GPAY ── */}
        {method === 'upi' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border text-center" style={{ backgroundColor: '#fcfaf6', borderColor: 'rgba(212,175,55,0.3)' }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(197,155,39,0.15)', color: NAVY }}>
                <QrCode size={13} style={{ color: GOLD }} />
                <span>Instant UPI Payment</span>
              </div>

              {/* Exact prominent amount display */}
              <div className="mb-4">
                <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Amount to Pay</span>
                <div className="text-3xl sm:text-4xl font-black mt-1" style={{ color: NAVY }}>
                  {formatINR(totalAmount)}
                </div>
              </div>

              {/* Dynamic QR Area */}
              <div className="inline-block p-3.5 bg-white rounded-2xl shadow-md border" style={{ borderColor: 'rgba(180,160,130,0.35)' }}>
                {loadingQr ? (
                  <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-xs text-gray-500">
                    <Loader2 size={28} className="animate-spin text-amber-600" />
                    <span>Generating exact QR code...</span>
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`UPI QR code for ₹${totalAmount}`}
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-xs text-red-500">
                    Unable to generate QR
                  </div>
                )}
              </div>

              {/* Scanner text instruction */}
              <p className="text-xs font-semibold text-gray-700 mt-4 max-w-sm mx-auto">
                Scan this QR using Google Pay, PhonePe, Paytm or any UPI app.
              </p>

              {/* UPI ID copy pill */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs bg-white text-gray-700" style={{ borderColor: 'rgba(180,160,130,0.4)' }}>
                <span>UPI ID: <b>{UPI_VPA}</b></span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="p-1 rounded hover:bg-gray-100 transition text-gray-600 cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Verification notice box */}
            <div className="rounded-xl p-4 border text-xs leading-relaxed" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}>
              <div className="flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-bold mb-1">Manual UPI Verification Step</p>
                  <p>
                    After scanning and paying ₹{totalAmount.toLocaleString('en-IN')}, click the confirmation button below.
                    It will save your booking as <b>Pending Verification</b> and automatically open WhatsApp to notify our team for swift manual verification.
                  </p>
                </div>
              </div>
            </div>

            {/* UPI Payment Confirmation Button */}
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
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Recording confirmation...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    <span>Payment Done - Send Confirmation</span>
                    <ExternalLink size={14} className="opacity-80" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-gray-500 mt-2">
                Opens official Alpine Explorers WhatsApp at <b>+91 99798 83339</b>
              </p>
            </div>

            {/* Status notice after user clicks confirmation */}
            {upiSubmitted && (
              <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 text-center">
                <p className="font-bold mb-1">Payment Confirmation Submitted</p>
                <p>Status: <span className="font-bold uppercase tracking-wider text-amber-700">Pending Verification</span></p>
                <p className="mt-1 text-gray-600">Our admin team will review your payment and update the status to Paid.</p>
              </div>
            )}
          </div>
        )}

        {/* ── OPTION 2: CARD PAYMENT ── */}
        {method === 'card' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border text-center" style={{ backgroundColor: '#fcfaf6', borderColor: 'rgba(212,175,55,0.3)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(0,26,77,0.08)', color: NAVY }}>
                <CreditCard size={28} style={{ color: NAVY }} />
              </div>

              <h3 className="text-lg font-bold" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                Secure Card Checkout
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                Pay instantly and securely using Visa, MasterCard, RuPay, American Express or NetBanking via our verified payment gateway.
              </p>

              {/* Exact Amount */}
              <div className="my-5 p-4 rounded-xl bg-white border inline-block min-w-[240px]" style={{ borderColor: 'rgba(180,160,130,0.3)' }}>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Payable Amount</span>
                <span className="text-3xl font-black" style={{ color: NAVY }}>
                  {formatINR(totalAmount)}
                </span>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 text-gray-600 text-xs flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck size={14} className="text-emerald-600" /> PCI-DSS Compliant
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Lock size={13} className="text-amber-600" /> 128/256-bit SSL
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <CheckCircle2 size={14} className="text-blue-600" /> RBI Guidelines Compliant
                </span>
              </div>
            </div>

            {/* Pay with Card Button */}
            <div>
              <button
                type="submit"
                onClick={handleCardPayment}
                disabled={processing}
                className="w-full py-4 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: NAVY }}
                onMouseEnter={(e) => { if (!processing) e.currentTarget.style.backgroundColor = NAVY_MID }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY }}
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Connecting to Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Proceed to Pay {formatINR(totalAmount)}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-gray-500 mt-2">
                Your payment details are encrypted and securely processed by the payment provider. We never store card numbers or CVV.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
