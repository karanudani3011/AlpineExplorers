import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..', '..')

// Simple .env parser to ensure environment variables are loaded in ESM
function loadEnv() {
  const envPath = path.join(rootDir, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim()
      if (!process.env[key]) {
        process.env[key] = val
      }
    }
  }
}

loadEnv()

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qhbsilnramjkagdjitlp.supabase.co'
export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

/**
 * Perform a request to Supabase REST API
 */
export async function supabaseRequest(endpoint, { method = 'GET', body = null, prefer = null, query = '' } = {}) {
  if (!SUPABASE_KEY) {
    console.warn('[Supabase] Missing SUPABASE_KEY; skipping Supabase request')
    return null
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${query ? `?${query}` : ''}`
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  }
  if (prefer) {
    headers['Prefer'] = prefer
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`[Supabase Error ${res.status}] ${endpoint}:`, errText)
      return { error: errText, status: res.status }
    }

    const text = await res.text()
    return text ? JSON.parse(text) : null
  } catch (err) {
    console.error(`[Supabase Network Error] ${endpoint}:`, err.message)
    return { error: err.message }
  }
}

/**
 * Sync inquiry to Supabase inquiries and feedback tables
 */
export async function syncInquiryToSupabase(inquiry) {
  const syncId = inquiry.supabase_id || `INQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

  // 1. Sync to 'inquiries' table
  const inqPayload = {
    id: syncId,
    name: inquiry.name,
    email: inquiry.email,
    mobile: inquiry.phone || null,
    tour_name: inquiry.package_name || inquiry.destination || 'General Inquiry',
    travelers: inquiry.travelers ? Number(inquiry.travelers) : 1,
    preferred_date: inquiry.travel_date || null,
    message: inquiry.message || null,
    status: inquiry.status || 'new',
    address: inquiry.destination ? `Destination: ${inquiry.destination}` : null,
  }

  // 2. Sync to 'feedback' table
  const fdbPayload = {
    id: `FDB-${syncId}`,
    type: 'inquiry',
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone || null,
    subject: inquiry.package_name || inquiry.destination || 'Inquiry / Contact Form',
    message: inquiry.message || 'New contact inquiry submitted',
    status: inquiry.status || 'new',
  }

  const results = await Promise.allSettled([
    supabaseRequest('inquiries', {
      method: 'POST',
      body: inqPayload,
      prefer: 'resolution=merge-duplicates,return=representation',
    }),
    supabaseRequest('feedback', {
      method: 'POST',
      body: fdbPayload,
      prefer: 'resolution=merge-duplicates,return=representation',
    }),
  ])

  return { syncId, results }
}

/**
 * Sync a full traveler application / booking to Supabase inquiries & feedback tables
 */
export async function syncBookingToSupabase(booking, travelers = []) {
  const primary = travelers[0] || {}
  const syncId = `BOOK-${booking.booking_id || Date.now()}`

  const inqPayload = {
    id: syncId,
    name: primary.fullName || primary.name || booking.booking_contact_name || 'Traveler',
    email: primary.email || booking.booking_contact_email || 'booking@alpineexplorers.com',
    mobile: primary.contact || primary.contact_number || booking.booking_contact_phone || null,
    date_of_birth: primary.dob || primary.date_of_birth || null,
    age: primary.age ? Number(primary.age) : null,
    sex: primary.sex || null,
    blood_group: primary.bloodGroup || primary.blood_group || null,
    address: primary.address || (booking.location ? `Location: ${booking.location}` : null),
    education: primary.education || null,
    school_college: primary.school || primary.school_college || null,
    school_college_address: primary.schoolAddress || primary.school_college_address || null,
    school_college_phone: primary.schoolPhone || primary.school_college_phone || null,
    hobbies: primary.hobbies || null,
    has_adventure_exp: (primary.experienceYesNo === 'Yes' || primary.adventure_experience === 'Yes'),
    adventure_exp_details: primary.experienceDetails || primary.adventure_details || null,
    tour_name: booking.tour_name || primary.courseName || 'Tour Booking',
    travelers: booking.number_of_travelers || travelers.length || 1,
    preferred_date: booking.travel_date || null,
    message: `Booking ID: ${booking.booking_id} | Amount: ₹${booking.total_amount || 0} | Travelers: ${travelers.length}`,
    status: 'new',
  }

  const fdbPayload = {
    id: `FDB-${syncId}`,
    type: 'booking',
    name: inqPayload.name,
    email: inqPayload.email,
    phone: inqPayload.mobile,
    subject: `Booking Application: ${booking.tour_name} (${booking.booking_id})`,
    message: inqPayload.message,
    status: 'new',
  }

  return Promise.allSettled([
    supabaseRequest('inquiries', {
      method: 'POST',
      body: inqPayload,
      prefer: 'resolution=merge-duplicates,return=representation',
    }),
    supabaseRequest('feedback', {
      method: 'POST',
      body: fdbPayload,
      prefer: 'resolution=merge-duplicates,return=representation',
    }),
  ])
}
