import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import {
  QrCode, CreditCard, ShieldCheck, CheckCircle2, AlertCircle,
  Loader2, ArrowRight, MessageSquare, ExternalLink, ArrowLeft,
  Copy, Check, Info, Lock, User, Calendar
} from 'lucide-react'
import { api } from '../../services/api'
import { supabase } from '../../services/supabaseClient'

import { PAYMENT_CONFIG } from '../../config/paymentConfig'

const NAVY = 'var(--ae-navy)'
const NAVY_MID = 'var(--ae-navy-mid)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'
const CREAM = 'var(--ae-cream)'
const BROWN = 'var(--ae-ink)'

const WHATSAPP_NUMBER = PAYMENT_CONFIG.whatsappNumber || '919979883339'
const UPI_VPA = PAYMENT_CONFIG.upiId || '9979883339@upi'
const QR_IMAGE = PAYMENT_CONFIG.qrCode || '/payment/alpine-upi-qr.png'

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

  // Card Form State
  const [cardName, setCardName] = useState(booking.customer_name || '')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardErrors, setCardErrors] = useState({})

  const handleCardNumChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(formatted)
    if (cardErrors.cardNumber) setCardErrors((prev) => ({ ...prev, cardNumber: '' }))
  }

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`
    }
    setCardExpiry(raw)
    if (cardErrors.cardExpiry) setCardErrors((prev) => ({ ...prev, cardExpiry: '' }))
  }

  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvv(raw)
    if (cardErrors.cardCvv) setCardErrors((prev) => ({ ...prev, cardCvv: '' }))
  }

  const bookingRef = booking.booking_reference || booking.booking_id || 'ALP-BOOKING'
  const totalAmount = Number(booking.total_amount || 0)

  // Generate UPI URI
  const upiUri = useMemo(() => {
    const encodedName = encodeURIComponent('Alpine Explorers')
    const encodedNote = encodeURIComponent(`Booking ${bookingRef}`)
    return `upi://pay?pa=${UPI_VPA}&pn=${encodedName}&am=${totalAmount}&cu=INR&tn=${encodedNote}`
  }, [bookingRef, totalAmount])

  // Generate QR Code dynamically from exact booking total if static image has issues
  useEffect(() => {
    let active = true
    setLoadingQr(true)
    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: 'var(--ae-navy)',
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
    const msg = `Hello Alpine Explorers,
I have completed the payment for my booking.
Booking ID: ${bookingRef}
Tour/Package: ${booking.tour_name}
Applicant Name: ${booking.customer_name}
Amount Paid: ₹${totalAmount.toLocaleString('en-IN')}
Please verify my payment.
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

  // Handle Card Payment (Razorpay / Direct Card Checkout)
  const handleCardPayment = async () => {
    // Validate card input fields
    const errs = {}
    if (!cardName.trim()) errs.cardName = 'Cardholder name is required'
    const rawNum = cardNumber.replace(/\s+/g, '')
    if (!rawNum) errs.cardNumber = 'Card number is required'
    else if (rawNum.length < 15 || rawNum.length > 16) errs.cardNumber = 'Enter a valid 16-digit card number'

    if (!cardExpiry.trim()) errs.cardExpiry = 'Expiry date required'
    else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardExpiry)) errs.cardExpiry = 'Format MM/YY'

    if (!cardCvv.trim()) errs.cardCvv = 'CVV is required'
    else if (cardCvv.length < 3) errs.cardCvv = '3-4 digits required'

    if (Object.keys(errs).length > 0) {
      setCardErrors(errs)
      return
    }

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
    <div className="rounded-2xl overflow-hidden shadow-2xl bg-white border" style={{ borderColor: 'rgb(var(--ae-gold2-rgb) /0.45)' }}>
      {/* Title Header Banner */}
      <div
        className="px-6 py-6 text-white text-center relative"
        style={{
          background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
          borderBottom: '2px solid rgb(var(--ae-gold2-rgb) /0.4)',
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
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'rgb(var(--ae-cream-rgb) /0.85)' }}>
          Review your booking details and choose your preferred payment option below.
        </p>

        {/* Prominent Booking Summary Pill */}
        <div
          className="mt-5 rounded-xl p-4 text-left grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgb(var(--ae-gold2-rgb) /0.3)',
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
                ? 'bg-white shadow-md text-[color:var(--ae-navy)]'
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
                ? 'bg-white shadow-md text-[color:var(--ae-navy)]'
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
            <div className="p-6 rounded-2xl border text-center" style={{ backgroundColor: '#fcfaf6', borderColor: 'rgb(var(--ae-gold2-rgb) /0.3)' }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) /0.15)', color: NAVY }}>
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

              {/* UPI QR Area */}
              <div className="inline-block p-3.5 bg-white rounded-2xl shadow-md border" style={{ borderColor: 'rgba(180,160,130,0.35)' }}>
                <img
                  src={QR_IMAGE}
                  onError={(e) => {
                    if (qrDataUrl && e.target.src !== qrDataUrl) {
                      e.target.src = qrDataUrl
                    }
                  }}
                  alt={`UPI QR code for ₹${totalAmount}`}
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                />
              </div>

              {/* Scanner text instruction */}
              <p className="text-xs font-semibold text-gray-700 mt-4 max-w-sm mx-auto">
                Scan this QR using Google Pay, PhonePe, Paytm or any UPI app.
              </p>
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

        {/* ── OPTION 2: CARD PAYMENT WITH DETAIL FORM ── */}
        {method === 'card' && (
          <div className="space-y-6">
            {/* Visual Card Preview */}
            <div
              className="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-all"
              style={{
                background: `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid), #1e293b)`,
                border: '1.5px solid rgb(var(--ae-gold2-rgb) /0.4)',
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Credit / Debit Card</p>
                  <p className="text-xs text-white/70">Alpine Explorers Payment</p>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-md">
                  <Lock size={12} className="text-amber-400" /> SECURE 256-BIT
                </div>
              </div>

              {/* Card Number Preview */}
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-[0.18em] my-4 text-amber-100">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex justify-between items-end text-xs pt-2 border-t border-white/15">
                <div>
                  <p className="text-[9px] uppercase font-bold text-white/60 tracking-wider">Cardholder Name</p>
                  <p className="font-bold text-white uppercase tracking-wider text-sm truncate max-w-[180px]">
                    {cardName || 'YOUR NAME HERE'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-white/60 tracking-wider">Expires</p>
                  <p className="font-mono font-bold text-white text-sm">
                    {cardExpiry || 'MM/YY'}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Card Form Inputs */}
            <form onSubmit={(e) => { e.preventDefault(); handleCardPayment(); }} className="space-y-4 bg-gray-50/80 p-5 rounded-2xl border border-gray-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <CreditCard size={15} style={{ color: GOLD }} />
                <span>Enter Card Details</span>
              </h4>

              {/* Cardholder Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Cardholder Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Full name on card"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value)
                      if (cardErrors.cardName) setCardErrors((prev) => ({ ...prev, cardName: '' }))
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                      cardErrors.cardName ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-amber-600 bg-white'
                    }`}
                  />
                </div>
                {cardErrors.cardName && <p className="text-[11px] font-semibold text-red-600 mt-1">{cardErrors.cardName}</p>}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumChange}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm font-mono tracking-wider focus:outline-none transition ${
                      cardErrors.cardNumber ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-amber-600 bg-white'
                    }`}
                  />
                </div>
                {cardErrors.cardNumber && <p className="text-[11px] font-semibold text-red-600 mt-1">{cardErrors.cardNumber}</p>}
              </div>

              {/* Expiry & CVV grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-mono focus:outline-none transition ${
                        cardErrors.cardExpiry ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-amber-600 bg-white'
                      }`}
                    />
                  </div>
                  {cardErrors.cardExpiry && <p className="text-[11px] font-semibold text-red-600 mt-1">{cardErrors.cardExpiry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    CVV / CVC <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={handleCvvChange}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-mono tracking-widest focus:outline-none transition ${
                        cardErrors.cardCvv ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-amber-600 bg-white'
                      }`}
                    />
                  </div>
                  {cardErrors.cardCvv && <p className="text-[11px] font-semibold text-red-600 mt-1">{cardErrors.cardCvv}</p>}
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                  onMouseEnter={(e) => { if (!processing) e.currentTarget.style.backgroundColor = NAVY_MID }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY }}
                >
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing Card Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Pay {formatINR(totalAmount)} Now</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-gray-500 text-[11px] pt-1 flex-wrap">
                <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-600" /> Encrypted & Secure</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={13} className="text-blue-600" /> Credit & Debit Cards Supported</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
