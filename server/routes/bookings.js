import { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db, logActivity, getBookings, getBookingsCount, getBookingById, getBookingByBookingId, getTravelersByBookingId, getTravelerById, getDeclarationByTravelerId, getRiskCertificateByTravelerId, getGuardianByTravelerId, updateBookingStatus, getBookingStats, getAllBookingsForExport, getAllTravelersForExport, createBooking, createTraveler, createDeclaration, createRiskCertificate, createGuardian } from '../db.js'
import { authRequired } from '../middleware.js'
import { generateBookingPdf, generateIndividualTravelerPdf, generateAllBookingsPdf } from '../utils/pdfGenerator.js'
import { generateBookingExcel, generateIndividualTravelerExcel, generateAllBookingsExcel } from '../utils/excelGenerator.js'
import { syncBookingToSupabase, supabaseRequest } from '../utils/supabase.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

function saveBase64Image(dataUrl, prefix = 'img') {
  if (!dataUrl || typeof dataUrl !== 'string') return null
  if (!dataUrl.startsWith('data:image/')) {
    return dataUrl
  }
  try {
    const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/)
    if (!match) return dataUrl
    const rawExt = match[1].toLowerCase()
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt
    const base64Data = match[2]
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = path.join(uploadsDir, filename)
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'))
    return `/uploads/${filename}`
  } catch (err) {
    console.error('Error saving base64 image:', err)
    return dataUrl
  }
}

const router = Router()

router.post('/', async (req, res) => {
  const { booking_id, tour_id, tour_name, tour_category, location, duration, travel_date, price_per_person, number_of_travelers, total_amount, booking_contact_name, booking_contact_email, booking_contact_phone, travelers } = req.body || {}
  
  if (!booking_id || !tour_name || !Array.isArray(travelers) || travelers.length === 0) {
    return res.status(400).json({ error: 'A booking requires booking_id, tour_name, and at least one traveler' })
  }

  const existing = db.prepare('SELECT id FROM bookings WHERE booking_id = ?').get(booking_id)
  if (existing) {
    return res.status(409).json({ error: 'Booking ID already exists' })
  }

  const primaryTraveler = travelers[0] || {}
  const contactName = booking_contact_name || primaryTraveler.fullName || primaryTraveler.name || ''
  const contactEmail = booking_contact_email || primaryTraveler.email || ''
  const contactPhone = booking_contact_phone || primaryTraveler.contact || primaryTraveler.contact_number || ''

  const bookingId = createBooking({
    booking_id,
    tour_id: tour_id || '',
    tour_name,
    tour_category: tour_category || '',
    location: location || '',
    duration: duration || '',
    travel_date: travel_date || '',
    price_per_person: price_per_person || null,
    number_of_travelers: travelers.length,
    total_amount: total_amount || null,
    booking_contact_name: contactName,
    booking_contact_email: contactEmail,
    booking_contact_phone: contactPhone,
    status: 'pending'
  })

  for (let i = 0; i < travelers.length; i++) {
    const t = travelers[i]

    const rawPhoto = t.photo?.dataUrl || (typeof t.photo === 'string' ? t.photo : null)
    const savedPhotoUrl = rawPhoto ? saveBase64Image(rawPhoto, `photo-${booking_id}-${i + 1}`) : null

    const isMinor = (t.participantType || '').toString().toLowerCase() === 'minor'
    const participantType = isMinor ? 'Minor' : 'Adult'

    const travelerId = createTraveler({
      booking_id: bookingId,
      traveler_number: i + 1,
      course_name: t.courseName || t.course_name || t.course || tour_name,
      full_name: t.fullName || t.name || `Traveler ${i + 1}`,
      date_of_birth: t.dob || t.date_of_birth || '',
      age: t.age ? Number(t.age) : null,
      sex: t.sex || '',
      blood_group: t.bloodGroup || t.blood_group || '',
      address: t.address || '',
      contact_number: t.contact || t.contact_number || '',
      education: t.education || '',
      school_college: t.school || t.school_college || '',
      school_college_address: t.schoolAddress || t.school_college_address || '',
      school_college_phone: t.schoolPhone || t.school_college_phone || '',
      hobbies: t.hobbies || '',
      photo_url: savedPhotoUrl,
      adventure_experience: t.experienceYesNo || t.adventure_experience || t.experience || 'No',
      adventure_details: t.experienceDetails || t.adventure_details || '',
      participant_type: participantType
    })

    // Declaration
    const declSig = t.signature || t.sigApplicant || null
    const savedDeclSig = declSig ? saveBase64Image(declSig, `sig-decl-${booking_id}-${i + 1}`) : null
    const declAccepted = (t.declarationAccepted ?? t.declarationAgreed) ? true : false

    if (declAccepted || t.declarationPlace || t.sigPlace || t.declarationDate || t.sigDate || savedDeclSig) {
      createDeclaration({
        traveler_id: travelerId,
        accepted: declAccepted ? 1 : 0,
        place: t.declarationPlace || t.sigPlace || '',
        date: t.declarationDate || t.sigDate || '',
        signature_url: savedDeclSig,
        accepted_at: new Date().toISOString()
      })
    }

    // Risk Certificate
    const riskSig = t.riskSignature || t.sigRisk || null
    const savedRiskSig = riskSig ? saveBase64Image(riskSig, `sig-risk-${booking_id}-${i + 1}`) : null
    const riskAccepted = (t.riskAccepted ?? t.riskAgreed) ? true : false

    if (riskAccepted || t.riskParticipantName || t.riskName || t.riskCourseName || t.riskCourse || t.riskPlace || t.riskDate || savedRiskSig) {
      createRiskCertificate({
        traveler_id: travelerId,
        participant_name: t.riskParticipantName || t.riskName || t.fullName || t.name || '',
        course_name: t.riskCourseName || t.riskCourse || t.courseName || t.course || tour_name,
        accepted: riskAccepted ? 1 : 0,
        place: t.riskPlace || '',
        date: t.riskDate || '',
        signature_url: savedRiskSig,
        accepted_at: new Date().toISOString()
      })
    }

    // Guardian (if minor)
    if (isMinor) {
      const rawGuardSig = t.sigGuardian || t.guardianSignature || (isMinor ? t.signature : null)
      const savedGuardSig = rawGuardSig ? saveBase64Image(rawGuardSig, `sig-guard-${booking_id}-${i + 1}`) : null

      if (t.guardianName || t.guardianContact || savedGuardSig) {
        createGuardian({
          traveler_id: travelerId,
          guardian_name: t.guardianName || '',
          guardian_contact: t.guardianContact || '',
          guardian_signature_url: savedGuardSig
        })
      }
    }
  }

  logActivity({ user_name: 'customer', action: 'Booking created', module: 'Bookings', details: `Booking ${booking_id} with ${travelers.length} traveler(s)` })

  // Sync booking and primary traveler data to Supabase (inquiries + feedback)
  try {
    await syncBookingToSupabase({
      booking_id,
      tour_name,
      tour_category,
      location,
      duration,
      travel_date,
      number_of_travelers: travelers.length,
      total_amount,
      booking_contact_name: contactName,
      booking_contact_email: contactEmail,
      booking_contact_phone: contactPhone,
    }, travelers)
  } catch (err) {
    console.error('Failed to sync booking to Supabase:', err)
  }

  res.status(201).json({ message: 'Booking created successfully', bookingId: booking_id, id: Number(bookingId) })
})

router.use(authRequired)

router.get('/stats', (req, res) => {
  res.json(getBookingStats())
})

router.get('/', async (req, res) => {
  // Sync from Supabase bookings table to local cache if present
  try {
    const supBookings = await supabaseRequest('bookings', {
      method: 'GET',
      query: 'order=created_at.desc&limit=50'
    })
    if (Array.isArray(supBookings)) {
      for (const sb of supBookings) {
        if (!sb.booking_reference) continue
        const exists = db.prepare('SELECT id FROM bookings WHERE booking_id = ?').get(sb.booking_reference)
        if (!exists) {
          createBooking({
            booking_id: sb.booking_reference,
            tour_id: sb.tour_id || '',
            tour_name: sb.tour_name,
            tour_category: 'Adventure',
            location: sb.tour_location || '',
            duration: sb.duration || '',
            travel_date: sb.tour_date || '',
            booking_date: sb.created_at || new Date().toISOString(),
            price_per_person: sb.price_per_person || null,
            number_of_travelers: sb.total_travelers || 1,
            total_amount: sb.total_amount || null,
            booking_contact_name: sb.customer_name,
            booking_contact_email: sb.customer_email,
            booking_contact_phone: sb.customer_phone,
            status: sb.status || 'pending'
          })
        }
      }
    }
  } catch (err) {
    // Ignored if table not created yet
  }

  const { status, search, tour, travelDate, bookingDate, minTravelers, maxTravelers, page = 1, limit = 20 } = req.query
  const offset = (Number(page) - 1) * Number(limit)
  
  const bookings = getBookings({
    status,
    search,
    tour,
    travelDate,
    bookingDate,
    minTravelers: minTravelers ? Number(minTravelers) : undefined,
    maxTravelers: maxTravelers ? Number(maxTravelers) : undefined,
    limit: Number(limit),
    offset
  })

  const total = getBookingsCount({
    status,
    search,
    tour,
    travelDate,
    bookingDate,
    minTravelers: minTravelers ? Number(minTravelers) : undefined,
    maxTravelers: maxTravelers ? Number(maxTravelers) : undefined
  })

  res.json({ bookings, total, page: Number(page), limit: Number(limit) })
})

router.get('/:id', (req, res) => {
  const booking = getBookingById(req.params.id)
  if (!booking) return res.status(404).json({ error: 'Not found' })
  
  const travelers = getTravelersByBookingId(booking.id)
  const travelersWithDetails = travelers.map(t => ({
    ...t,
    declaration: getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian: getGuardianByTravelerId(t.id)
  }))
  
  res.json({ booking, travelers: travelersWithDetails })
})

router.get('/booking-id/:bookingId', (req, res) => {
  const booking = getBookingByBookingId(req.params.bookingId)
  if (!booking) return res.status(404).json({ error: 'Not found' })
  
  const travelers = getTravelersByBookingId(booking.id)
  const travelersWithDetails = travelers.map(t => ({
    ...t,
    declaration: getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian: getGuardianByTravelerId(t.id)
  }))
  
  res.json({ booking, travelers: travelersWithDetails })
})

router.get('/:id/travelers', (req, res) => {
  const booking = getBookingById(req.params.id)
  if (!booking) return res.status(404).json({ error: 'Not found' })
  
  const travelers = getTravelersByBookingId(booking.id)
  const travelersWithDetails = travelers.map(t => ({
    ...t,
    declaration: getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian: getGuardianByTravelerId(t.id)
  }))
  
  res.json({ travelers: travelersWithDetails })
})

router.get('/traveler/:travelerId', (req, res) => {
  const traveler = getTravelerById(req.params.travelerId)
  if (!traveler) return res.status(404).json({ error: 'Not found' })
  
  const declaration = getDeclarationByTravelerId(traveler.id)
  const risk_certificate = getRiskCertificateByTravelerId(traveler.id)
  const guardian = getGuardianByTravelerId(traveler.id)
  const booking = getBookingById(traveler.booking_id)
  
  res.json({ traveler, declaration, risk_certificate, guardian, booking })
})

router.patch('/:id/status', async (req, res) => {
  const statuses = ['pending', 'confirmed', 'cancelled', 'completed']
  const status = req.body.status
  if (!statuses.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  
  const existing = getBookingById(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  
  updateBookingStatus(req.params.id, status)
  
  // Sync status to Supabase bookings table
  try {
    const bookingRef = existing.booking_id || req.params.id
    await supabaseRequest('bookings', {
      method: 'PATCH',
      body: { status, updated_at: new Date().toISOString() },
      query: `booking_reference=eq.${encodeURIComponent(bookingRef)}`
    })
  } catch (supErr) {
    console.warn('[Supabase status patch warning]:', supErr.message)
  }

  logActivity({ user_name: req.user.username, action: 'Booking status updated', module: 'Bookings', details: `#${req.params.id} -> ${status}` })
  res.json({ message: 'Status updated', status })
})

router.delete('/:id', async (req, res) => {
  const existing = getBookingById(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  // Delete from Supabase bookings table
  try {
    const bookingRef = existing.booking_id || req.params.id
    await supabaseRequest('bookings', {
      method: 'DELETE',
      query: `booking_reference=eq.${encodeURIComponent(bookingRef)}`
    })
  } catch (supErr) {
    console.warn('[Supabase booking delete warning]:', supErr.message)
  }

  // Delete from SQLite
  db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id)
  logActivity({ user_name: req.user.username, action: 'Booking deleted', module: 'Bookings', details: `Booking #${req.params.id} (${existing.booking_id})` })
  res.json({ message: 'Booking deleted successfully' })
})

// PDF Downloads
router.get('/:id/download/pdf', async (req, res) => {
  try {
    const pdfBuffer = await generateBookingPdf(Number(req.params.id))
    const booking = getBookingById(req.params.id)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="booking-${booking?.booking_id || req.params.id}.pdf"`)
    res.send(pdfBuffer)
  } catch (e) {
    res.status(500).json({ error: 'Unable to generate PDF' })
  }
})

router.get('/traveler/:travelerId/download/pdf', async (req, res) => {
  try {
    const pdfBuffer = await generateIndividualTravelerPdf(Number(req.params.travelerId))
    const traveler = getTravelerById(req.params.travelerId)
    const booking = traveler ? getBookingById(traveler.booking_id) : null
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="traveler-${traveler?.traveler_number || req.params.travelerId}-${booking?.booking_id || 'booking'}.pdf"`)
    res.send(pdfBuffer)
  } catch (e) {
    res.status(500).json({ error: 'Unable to generate PDF' })
  }
})

router.get('/download/all/pdf', async (req, res) => {
  try {
    const pdfBuffer = await generateAllBookingsPdf()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="all-bookings.pdf"')
    res.send(pdfBuffer)
  } catch (e) {
    res.status(500).json({ error: 'Unable to generate PDF' })
  }
})

// Excel Downloads
router.get('/:id/download/excel', async (req, res) => {
  try {
    const excelBuffer = await generateBookingExcel(Number(req.params.id))
    const booking = getBookingById(req.params.id)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="booking-${booking?.booking_id || req.params.id}.xlsx"`)
    res.send(excelBuffer)
  } catch (e) {
    res.status(500).json({ error: 'Unable to generate Excel' })
  }
})

router.get('/traveler/:travelerId/download/excel', async (req, res) => {
  try {
    const excelBuffer = await generateIndividualTravelerExcel(Number(req.params.travelerId))
    const traveler = getTravelerById(req.params.travelerId)
    const booking = traveler ? getBookingById(traveler.booking_id) : null
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="traveler-${traveler?.traveler_number || req.params.travelerId}-${booking?.booking_id || 'booking'}.xlsx"`)
    res.send(excelBuffer)
  } catch (e) {
    res.status(500).json({ error: 'Unable to generate Excel' })
  }
})

router.get('/download/all/excel', async (req, res) => {
  try {
    const excelBuffer = await generateAllBookingsExcel()
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="all-bookings.xlsx"')
    res.send(excelBuffer)
  } catch (e) {
    res.status(500).json({ error: 'Unable to generate Excel' })
  }
})

export default router