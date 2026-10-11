import { Router } from 'express'
import crypto from 'node:crypto'
import { db, logActivity, updateBookingPayment, getBookingByBookingId } from '../db.js'
import { supabaseRequest, supabaseAdmin } from '../utils/supabase.js'
import { authRequired } from '../middleware.js'

const router = Router()

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || ''
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''

/**
 * GET /api/payments/config
 * Returns public payment configuration (e.g. Razorpay key ID if configured)
 */
router.get('/config', (req, res) => {
  res.json({
    hasRazorpay: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
    keyId: RAZORPAY_KEY_ID || null,
    currency: 'INR',
  })
})

/**
 * POST /api/payments/create-order
 * Creates a payment order for secure checkout
 */
router.post('/create-order', authRequired, async (req, res) => {
  try {
    const { amount, booking_id, customer_name, customer_email, customer_phone } = req.body || {}

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' })
    }

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return res.status(503).json({ error: 'Card payments are not configured yet.' })
    const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').select('user_id,total_amount').eq('booking_reference', booking_id).maybeSingle()
    if (bookingError || !booking || booking.user_id !== (req.user.auth_user_id || req.user.id) || Number(booking.total_amount) !== Number(amount)) return res.status(403).json({ error: 'Booking owner or amount could not be verified.' })

    const amountInPaise = Math.round(Number(amount) * 100)

    // If live/test Razorpay keys are configured in .env, call Razorpay API directly
    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: (booking_id || `rcpt_${Date.now()}`).slice(0, 40),
            notes: {
              booking_id: booking_id || '',
              customer_name: customer_name || '',
            },
          }),
        })

        if (!rzpRes.ok) {
          const errData = await rzpRes.json().catch(() => ({}))
          console.error('[Razorpay Order Error]:', errData)
          throw new Error(errData.error?.description || 'Razorpay order creation failed')
        }

        const rzpOrder = await rzpRes.json()
        return res.json({
          order_id: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: RAZORPAY_KEY_ID,
          isMock: false,
        })
      } catch (err) {
        console.error('[Razorpay Order Error]:', err.message)
        return res.status(502).json({ error: 'Secure card checkout could not be initialized.' })
      }
    }
    return res.status(503).json({ error: 'Card payments are not configured yet.' })
  } catch (error) {
    console.error('[Create Order Error]:', error)
    res.status(500).json({ error: error.message || 'Failed to create payment order' })
  }
})

/**
 * POST /api/payments/verify
 * Verifies gateway payment response and marks booking as PAID
 */
router.post('/verify', authRequired, async (req, res) => {
  try {
    const {
      booking_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_method = 'CARD',
      amount,
    } = req.body || {}

    if (!booking_id || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ error: 'A configured gateway and complete payment verification data are required.' })

    // If real Razorpay secret is present, verify HMAC SHA256 signature
    {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      const expected = Buffer.from(generatedSignature, 'hex')
      const received = Buffer.from(razorpay_signature, 'hex')
      if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
        return res.status(400).json({ error: 'Invalid payment signature. Verification failed.' })
      }
    }

    const paymentId = razorpay_payment_id
    const orderId = razorpay_order_id
    const { data: savedBooking, error: bookingError } = await supabaseAdmin.from('bookings').select('id,user_id,total_amount').eq('booking_reference', booking_id).maybeSingle()
    if (bookingError || !savedBooking || savedBooking.user_id !== (req.user.auth_user_id || req.user.id) || !Number(savedBooking.total_amount) || Number(savedBooking.total_amount) !== Number(amount)) return res.status(403).json({ error: 'Booking owner or amount could not be verified.' })
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')
    const gatewayResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: authHeader } })
    const gatewayPayment = await gatewayResponse.json()
    if (!gatewayResponse.ok || gatewayPayment.status !== 'captured' || gatewayPayment.order_id !== orderId || Number(gatewayPayment.amount) !== Math.round(Number(savedBooking.total_amount) * 100)) return res.status(400).json({ error: 'Payment could not be verified with the payment provider.' })

    // Update SQLite booking if found
    const existing = getBookingByBookingId(booking_id)
    if (existing) {
      updateBookingPayment(existing.id, {
        payment_status: 'paid',
        payment_method,
        payment_id: paymentId,
        order_id: orderId,
        booking_status: 'confirmed',
      })
      logActivity({
        user_name: existing.booking_contact_name || 'Customer',
        action: 'Card payment completed',
        module: 'Payments',
        details: `Booking ${booking_id} paid via ${payment_method}. Amount: ₹${existing.total_amount || amount}`,
      })
    }

    // Update Supabase booking table
    const { error: paymentUpdateError } = await supabaseAdmin.from('bookings').update({ payment_status: 'paid', payment_method, payment_id: paymentId, order_id: orderId, status: 'confirmed', updated_at: new Date().toISOString() }).eq('id', savedBooking.id)
    if (paymentUpdateError) throw paymentUpdateError
    const { error: paymentInsertError } = await supabaseAdmin.from('payments').upsert({ booking_id: savedBooking.id, payment_method, amount: savedBooking.total_amount, gateway_reference_id: paymentId, payment_status: 'paid', verification_status: 'verified', verified_at: new Date().toISOString() }, { onConflict: 'gateway_reference_id' })
    if (paymentInsertError) throw paymentInsertError

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      payment_status: 'paid',
      payment_id: paymentId,
      order_id: orderId,
      booking_status: 'confirmed',
    })
  } catch (error) {
    console.error('[Verify Payment Error]:', error)
    res.status(500).json({ error: error.message || 'Payment verification failed' })
  }
})

export default router
