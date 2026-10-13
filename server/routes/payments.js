import { Router } from 'express'
import { db } from '../db.js'
import { supabaseAdmin } from '../utils/supabase.js'

const router = Router()

async function getBookingSettings() {
  try {
    const { data, error } = await supabaseAdmin
      .from('booking_settings')
      .select('qr_payment_enabled, closed_message')
      .eq('id', 1)
      .maybeSingle()
    if (!error && data) {
      return {
        qrEnabled: Boolean(data.qr_payment_enabled),
        closedMessage: data.closed_message || 'Bookings are currently full. Please contact us for the next available dates.',
      }
    }
  } catch {}

  try {
    const row = db.prepare('SELECT qr_payment_enabled, closed_message FROM booking_settings WHERE id = 1').get()
    if (row) {
      return {
        qrEnabled: Boolean(row.qr_payment_enabled),
        closedMessage: row.closed_message || 'Bookings are currently full. Please contact us for the next available dates.',
      }
    }
  } catch {}

  return { qrEnabled: true, closedMessage: 'Bookings are currently full. Please contact us for the next available dates.' }
}

/**
 * GET /api/payments/config
 * Returns payment config; refuses when QR payments are disabled
 */
router.get('/config', async (req, res) => {
  const settings = await getBookingSettings()
  if (!settings.qrEnabled) {
    return res.status(503).json({
      error: settings.closedMessage,
      qr_payment_enabled: false,
    })
  }
  res.json({
    currency: 'INR',
    upiOnly: true,
    qr_payment_enabled: true,
  })
})

/**
 * GET /api/payments/upi-details
 * Returns UPI details only when QR payments are enabled; refuses with 503 when disabled
 */
router.get('/upi-details', async (req, res) => {
  const settings = await getBookingSettings()
  if (!settings.qrEnabled) {
    return res.status(503).json({
      error: settings.closedMessage,
      qr_payment_enabled: false,
    })
  }
  res.json({
    upiId: '9979883339@upi',
    qrCode: '/payment/alpine-upi-qr.png',
    currency: 'INR',
    qr_payment_enabled: true,
  })
})

export default router