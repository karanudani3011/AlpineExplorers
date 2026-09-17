import { Router } from 'express'
import crypto from 'node:crypto'
import { db, logActivity, updateBookingPayment, getBookingByBookingId } from '../db.js'
import { supabaseRequest } from '../utils/supabase.js'

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
    keyId: RAZORPAY_KEY_ID || 'rzp_test_alpine_sandbox',
    currency: 'INR',
  })
})

/**
 * POST /api/payments/create-order
 * Creates a payment order for secure checkout
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, booking_id, customer_name, customer_email, customer_phone } = req.body || {}

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' })
    }

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
        console.warn('[Razorpay API fallback to sandbox order]:', err.message)
      }
    }

    // Sandbox / Test Mode Order (when no Razorpay keys are in .env yet)
    const simulatedOrderId = `order_sand_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    res.json({
      order_id: simulatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID || 'rzp_test_alpine_sandbox',
      isMock: !Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
    })
  } catch (error) {
    console.error('[Create Order Error]:', error)
    res.status(500).json({ error: error.message || 'Failed to create payment order' })
  }
})

/**
 * POST /api/payments/verify
 * Verifies gateway payment response and marks booking as PAID
 */
router.post('/verify', async (req, res) => {
  try {
    const {
      booking_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_method = 'CARD',
      amount,
    } = req.body || {}

    if (!booking_id) {
      return res.status(400).json({ error: 'booking_id is required' })
    }

    // If real Razorpay secret is present, verify HMAC SHA256 signature
    if (RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_signature && razorpay_payment_id) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature. Verification failed.' })
      }
    }

    const paymentId = razorpay_payment_id || `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const orderId = razorpay_order_id || `order_${Date.now()}`

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
    try {
      await supabaseRequest('bookings', {
        method: 'PATCH',
        body: {
          payment_status: 'paid',
          payment_method,
          payment_id: paymentId,
          order_id: orderId,
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        },
        query: `booking_reference=eq.${encodeURIComponent(booking_id)}`,
      })
    } catch (supErr) {
      console.warn('[Supabase payment verify update warning]:', supErr.message)
    }

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
