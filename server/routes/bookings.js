import { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import { deflateRawSync } from 'node:zlib'
import { db, logActivity, getBookings, getBookingsCount, getBookingById, getBookingByBookingId, getTravelersByBookingId, getTravelerById, getDeclarationByTravelerId, getRiskCertificateByTravelerId, getGuardianByTravelerId, updateBookingStatus, updateBookingPayment, updateBookingScannedForms, getBookingStats, getAllBookingsForExport, getAllTravelersForExport, createBooking, createTraveler, createDeclaration, createRiskCertificate, createGuardian } from '../db.js'
import { authRequired, requirePermission } from '../middleware.js'
import { generateBookingPdf, generateIndividualTravelerPdf, generateAllBookingsPdf } from '../utils/pdfGenerator.js'
import { generateBookingExcel, generateIndividualTravelerExcel, generateAllBookingsExcel } from '../utils/excelGenerator.js'
import { generateDigitalApplicationPdf } from '../utils/digitalApplicationPdf.js'
import { syncBookingToSupabase, supabaseRequest, supabaseAdmin } from '../utils/supabase.js'
import { indexScannedDocument, indexSupabaseBookingDocuments, reprocessScannedDocuments } from '../utils/scannedDocumentIndex.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const scannedFormStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf'
    const cleanExt = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.pdf'
    const safeName = `scanned-form-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${cleanExt}`
    cb(null, safeName)
  }
})

const scannedFormUpload = multer({
  storage: scannedFormStorage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (allowed.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and image files are allowed'))
    }
  }
})

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

/**
 * Fetch global booking settings from Supabase or SQLite.
 * Returns { qrEnabled, closedMessage }.
 */
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
 * Check per-tour booking availability and seat limits.
 */
function checkTourBookingAvailability(tourId, tourName) {
  const tables = ['international_packages', 'domestic_packages', 'adventure_packages', 'camping_packages', 'events']
  for (const table of tables) {
    let row = null
    if (tourId) {
      const cleanId = String(tourId).replace(/^(int|dom|adv|camp)-/, '')
      try {
        row = db.prepare(`SELECT booking_open, seats_total, seats_booked FROM ${table} WHERE id = ?`).get(cleanId)
      } catch {}
    }
    if (!row && tourName) {
      try {
        if (table === 'international_packages' || table === 'domestic_packages') {
          row = db.prepare(`SELECT booking_open, seats_total, seats_booked FROM ${table} WHERE destination LIKE ?`).get(`%${tourName}%`)
        } else {
          row = db.prepare(`SELECT booking_open, seats_total, seats_booked FROM ${table} WHERE title LIKE ?`).get(`%${tourName}%`)
        }
      } catch {}
    }
    if (row) {
      const isManualClosed = row.booking_open === 0 || row.booking_open === false
      const isAutoFull = row.seats_total > 0 && (row.seats_booked || 0) >= row.seats_total
      if (isManualClosed || isAutoFull) {
        return {
          available: false,
          reason: isAutoFull
            ? 'This tour is fully booked (capacity reached). Please contact us for next available dates.'
            : 'Bookings for this tour are currently closed. Please contact us.'
        }
      }
      return { available: true }
    }
  }
  return { available: true }
}

router.get('/local-files/:filename', authRequired, requirePermission('bookings.view'), (req, res) => {
  const filename = path.basename(req.params.filename || '')
  const filePath = path.resolve(uploadsDir, filename)
  if (!filename || filePath !== path.join(uploadsDir, filename) || !fs.existsSync(filePath)) return res.status(404).json({ error: 'Private booking file was not found.' })
  const relativePath = `/uploads/${filename}`
  const referenced = db.prepare("SELECT 1 AS found FROM bookings WHERE scanned_forms LIKE ? LIMIT 1").get(`%${relativePath}%`)
    || db.prepare('SELECT 1 AS found FROM travelers WHERE photo_url=? OR scanned_form_url=? LIMIT 1').get(relativePath, relativePath)
    || db.prepare('SELECT 1 AS found FROM declarations WHERE signature_url=? LIMIT 1').get(relativePath)
    || db.prepare('SELECT 1 AS found FROM risk_certificates WHERE signature_url=? LIMIT 1').get(relativePath)
    || db.prepare('SELECT 1 AS found FROM guardians WHERE guardian_signature_url=? LIMIT 1').get(relativePath)
  if (!referenced) return res.status(404).json({ error: 'Private booking file was not found.' })
  const ext = path.extname(filename).toLowerCase()
  const contentType = ({ '.pdf':'application/pdf','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp' })[ext]
  if (!contentType) return res.status(415).json({ error: 'Unsupported booking file type.' })
  res.setHeader('Content-Type', contentType)
  res.setHeader('Content-Disposition', `inline; filename="${filename.replace(/[\r\n"\\]/g, '_')}"`)
  res.setHeader('Cache-Control', 'private, no-store')
  res.sendFile(filePath)
})

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0) }
  return (crc ^ 0xffffffff) >>> 0
}

function makeZip(files) {
  const local = [], central = []; let offset = 0
  for (const { name, data } of files) {
    const fileName = Buffer.from(name), compressed = deflateRawSync(data), crc = crc32(data)
    const header = Buffer.alloc(30); header.writeUInt32LE(0x04034b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x0800, 6); header.writeUInt16LE(8, 8); header.writeUInt32LE(crc, 14); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(data.length, 22); header.writeUInt16LE(fileName.length, 26)
    local.push(header, fileName, compressed)
    const record = Buffer.alloc(46); record.writeUInt32LE(0x02014b50, 0); record.writeUInt16LE(20, 4); record.writeUInt16LE(20, 6); record.writeUInt16LE(0x0800, 8); record.writeUInt16LE(8, 10); record.writeUInt32LE(crc, 16); record.writeUInt32LE(compressed.length, 20); record.writeUInt32LE(data.length, 24); record.writeUInt16LE(fileName.length, 28); record.writeUInt32LE(offset, 42)
    central.push(record, fileName); offset += header.length + fileName.length + compressed.length
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, directory, end])
}

async function downloadStorageObject(storagePath) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Private document export requires server Supabase configuration.')
  const { data, error } = await supabaseAdmin.storage.from('booking-private-docs').download(storagePath)
  if (error || !data) throw error || new Error('Stored document is unavailable.')
  return Buffer.from(await data.arrayBuffer())
}

/* ── Public endpoint for uploading scanned application forms ── */
router.post('/upload-forms', scannedFormUpload.any(), async (req, res) => {
  try {
    const { qrEnabled, closedMessage } = await getBookingSettings()
    if (!qrEnabled) {
      return res.status(503).json({ error: closedMessage || 'Bookings are currently unavailable. Form uploads are disabled.' })
    }

    const bookingId = req.body.booking_id || req.body.bookingId
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    const uploadedFiles = req.files.map((file, idx) => ({
      name: file.originalname || `Scanned_Form_${idx + 1}.pdf`,
      url: `/uploads/${file.filename}`,
      size: file.size,
      type: file.mimetype,
      uploaded_at: new Date().toISOString()
    }))

    if (bookingId) {
      const existing = getBookingByBookingId(bookingId) || getBookingById(bookingId)
      if (existing) {
        let existingForms = []
        try {
          existingForms = typeof existing.scanned_forms === 'string' ? JSON.parse(existing.scanned_forms || '[]') : (existing.scanned_forms || [])
        } catch (e) {}
        const merged = [...existingForms, ...uploadedFiles]
        updateBookingScannedForms(existing.id, merged)

        req.files.forEach((source, index) => {
          const isPdf = source.originalname.toLowerCase().endsWith('.pdf') || source.mimetype === 'application/pdf'
          uploadedFiles[index].search_index_status = isPdf ? 'processing' : 'not_applicable'
          if (isPdf) void indexScannedDocument({ bookingId: existing.id, documentPath: `/uploads/${source.filename}`, documentName: source.originalname }).catch(error => console.error('[Scanned PDF index]', error.message))
        })

        // Sync to Supabase bookings table
        try {
          await supabaseAdmin
            .from('bookings')
            .update({ scanned_forms: merged })
            .eq('booking_reference', bookingId)
        } catch (supErr) {
          console.warn('Supabase scanned forms sync note:', supErr.message)
        }
      }
    }

    return res.status(200).json({
      message: 'Scanned forms uploaded successfully',
      files: uploadedFiles
    })
  } catch (err) {
    console.error('Error uploading scanned forms:', err)
    return res.status(500).json({ error: err.message || 'Failed to process upload' })
  }
})

router.post('/', async (req, res) => {
  const bearerToken = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim()
  if (!bearerToken) return res.status(401).json({ error: 'Please log in to submit a booking' })
  const { data: authResult, error: authError } = await supabaseAdmin.auth.getUser(bearerToken)
  if (authError || !authResult?.user) return res.status(401).json({ error: 'Please log in to submit a booking' })

  const {
    booking_id, tour_id, tour_name, tour_category, location, duration, travel_date,
    price_per_person, number_of_travelers, total_amount, booking_contact_name,
    booking_contact_email, booking_contact_phone, travelers, scanned_forms,
    payment_status, payment_method, payment_id, order_id, currency, booking_status, booking_details
  } = req.body || {}

  if (booking_contact_email && booking_contact_email.trim().toLowerCase() !== (authResult.user.email || '').toLowerCase()) {
    return res.status(403).json({ error: 'Booking account does not match the signed-in user' })
  }
  
  if (!booking_id || !tour_name || !Array.isArray(travelers) || travelers.length === 0) {
    return res.status(400).json({ error: 'A booking requires booking_id, tour_name, and at least one traveler' })
  }

  // Server-side booking gate: check global QR payment switch
  // (Only enforce when this is a new booking creation, not a payment update)
  const existingForGateCheck = db.prepare('SELECT id FROM bookings WHERE booking_id = ?').get(booking_id)
  if (!existingForGateCheck) {
    const { qrEnabled, closedMessage } = await getBookingSettings()
    if (!qrEnabled) {
      return res.status(503).json({ error: closedMessage || 'Bookings are currently unavailable. Please contact us.' })
    }
    const avail = checkTourBookingAvailability(tour_id, tour_name)
    if (!avail.available) {
      return res.status(403).json({ error: avail.reason })
    }
  }

  const existing = existingForGateCheck
  if (existing) {
    // If booking already exists, update payment details if provided instead of throwing duplicate error
    if (payment_status || payment_method || payment_id || order_id || scanned_forms) {
      updateBookingPayment(existing.id, {
        payment_status: payment_status || undefined,
        payment_method: payment_method || undefined,
        payment_id: payment_id || undefined,
        order_id: order_id || undefined,
        booking_status: booking_status || undefined,
      })
      if (scanned_forms && scanned_forms.length > 0) {
        updateBookingScannedForms(existing.id, scanned_forms)
      }
      return res.status(200).json({ message: 'Booking payment updated', bookingId: booking_id, id: existing.id })
    }
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
    status: booking_status || 'pending',
    payment_status: payment_status || 'pending',
    payment_method: payment_method || null,
    payment_id: payment_id || null,
    order_id: order_id || null,
    currency: currency || 'INR',
    booking_status: booking_status || 'pending',
    booking_details: booking_details || {},
    scanned_forms: scanned_forms || []
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

router.get('/my-bookings', (req, res) => {
  const email = (req.query.email || '').trim().toLowerCase()
  if (!email) return res.json({ bookings: [] })
  try {
    const rows = db.prepare(
      'SELECT * FROM bookings WHERE LOWER(booking_contact_email) = ? ORDER BY id DESC'
    ).all(email)
    res.json({ bookings: rows || [] })
  } catch (err) {
    console.error('Error fetching traveler bookings:', err)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

router.use(authRequired)

router.get('/stats', requirePermission('bookings.view'), (req, res) => {
  res.json(getBookingStats())
})

router.get('/', requirePermission('bookings.view'), async (req, res) => {
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

  const { status, payment_status, paymentStatus, search, tour, travelDate, bookingDate, minTravelers, maxTravelers, hasScannedForm, has_scanned_form, page = 1, limit = 20 } = req.query
  const offset = (Number(page) - 1) * Number(limit)
  
  const rawBookings = getBookings({
    status,
    paymentStatus: payment_status || paymentStatus,
    search,
    tour,
    travelDate,
    bookingDate,
    minTravelers: minTravelers ? Number(minTravelers) : undefined,
    maxTravelers: maxTravelers ? Number(maxTravelers) : undefined,
    hasScannedForm: hasScannedForm || has_scanned_form,
    limit: Number(limit),
    offset
  })

  const bookings = rawBookings.map(b => {
    let parsedForms = []
    try {
      parsedForms = typeof b.scanned_forms === 'string' ? JSON.parse(b.scanned_forms || '[]') : (b.scanned_forms || [])
    } catch(e) {}
    const indexRows = db.prepare('SELECT document_path,document_name,index_status,index_error,indexed_at,extracted_text FROM scanned_document_index WHERE booking_id=?').all(b.id)
    const needle = String(search || '').trim().toLowerCase()
    const search_document_matches = needle ? indexRows.flatMap(index => {
      const matchAt = index.index_status === 'indexed' ? index.extracted_text.toLowerCase().indexOf(needle) : -1
      if (matchAt < 0) return []
      const pagePrefix = index.extracted_text.slice(0, matchAt).match(/\[Page (\d+)\]/g)?.at(-1)
      return [{ document_name: index.document_name, page: pagePrefix?.match(/\d+/)?.[0] || null }]
    }) : []
    return { ...b, search_document_matches, scanned_forms: parsedForms.map(form => {
      const index = indexRows.find(row => row.document_path === form.url) || null
      const matchAt = needle && index?.index_status === 'indexed' ? index.extracted_text.toLowerCase().indexOf(needle) : -1
      const pagePrefix = matchAt >= 0 ? index.extracted_text.slice(0, matchAt).match(/\[Page (\d+)\]/g)?.at(-1) : null
      return { ...form, search_index: index ? { ...index, extracted_text: undefined } : null, search_match: matchAt >= 0 ? { document_name: index.document_name, page: pagePrefix?.match(/\d+/)?.[0] || null } : null }
    }) }
  })

  const total = getBookingsCount({
    status,
    paymentStatus: payment_status || paymentStatus,
    search,
    tour,
    travelDate,
    bookingDate,
    minTravelers: minTravelers ? Number(minTravelers) : undefined,
    maxTravelers: maxTravelers ? Number(maxTravelers) : undefined,
    hasScannedForm: hasScannedForm || has_scanned_form
  })

  res.json({ bookings, total, page: Number(page), limit: Number(limit) })
})

router.get('/:id', requirePermission('bookings.view'), (req, res) => {
  const booking = getBookingById(req.params.id)
  if (!booking) return res.status(404).json({ error: 'Not found' })
  
  let parsedForms = []
  try {
    parsedForms = typeof booking.scanned_forms === 'string' ? JSON.parse(booking.scanned_forms || '[]') : (booking.scanned_forms || [])
  } catch (e) {}

  const travelers = getTravelersByBookingId(booking.id)
  const travelersWithDetails = travelers.map(t => ({
    ...t,
    declaration: getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian: getGuardianByTravelerId(t.id)
  }))
  
  const indexRows = db.prepare('SELECT document_path,index_status,index_error,indexed_at FROM scanned_document_index WHERE booking_id=?').all(booking.id)
  res.json({ booking: { ...booking, scanned_forms: parsedForms.map(form => ({ ...form, search_index: indexRows.find(row => row.document_path === form.url) || null })) }, travelers: travelersWithDetails })
})

router.get('/booking-id/:bookingId', requirePermission('bookings.view'), (req, res) => {
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

router.post('/search-index/reprocess', requirePermission('bookings.edit'), async (req, res) => {
  try {
    const bookingId = req.body?.booking_id ? getBookingByBookingId(req.body.booking_id)?.id : null
    if (req.body?.booking_id && !bookingId) return res.status(404).json({ error: 'Booking was not found.' })
    const results = await reprocessScannedDocuments(bookingId)
    res.json({ processed: results.length, indexed: results.filter(row => row.status === 'indexed').length, failed: results.filter(row => row.status === 'failed').length, results })
  } catch (error) {
    res.status(500).json({ error: 'Unable to reprocess scanned document search indexes.' })
  }
})

router.post('/index-user-documents', authRequired, async (req, res) => {
  try {
    const bookingReference = String(req.body?.booking_reference || '')
    if (!bookingReference) return res.status(400).json({ error: 'Booking reference is required.' })
    const result = await indexSupabaseBookingDocuments(bookingReference, req.user.auth_user_id || req.user.id)
    if (!result.found) return res.status(404).json({ error: 'Your booking or its saved application documents were not found.' })
    res.json(result)
  } catch (error) {
    res.status(503).json({ error: error.message || 'Application document search indexing failed.' })
  }
})

// Secure Supabase application documents and payments for the existing RBAC admin detail view.
router.get('/booking-id/:bookingId/application-data', requirePermission('bookings.view'), async (req, res) => {
  try {
    const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').select('*').eq('booking_reference', req.params.bookingId).maybeSingle()
    if (bookingError) throw bookingError
    if (!booking) return res.status(404).json({ error: 'Booking details are unavailable.' })
    const [{ data: applications, error: applicationsError }, { data: payments, error: paymentsError }] = await Promise.all([
      supabaseAdmin.from('traveler_applications').select('*').eq('booking_id', booking.id).order('traveler_number'),
      supabaseAdmin.from('payments').select('*').eq('booking_id', booking.id).order('created_at', { ascending: false }),
    ])
    if (applicationsError) throw applicationsError
    if (paymentsError) throw paymentsError
    const documents = []
    for (const app of applications || []) {
      for (const [field, urlField] of [['photograph_path', 'photograph_url'], ['applicant_signature_path', 'applicant_signature_url'], ['parent_guardian_signature_path', 'parent_guardian_signature_url']]) {
        if (app[field]) {
          const { data: signed, error: signedError } = await supabaseAdmin.storage.from('booking-private-docs').createSignedUrl(app[field], 300)
          if (!signedError && signed?.signedUrl) app[urlField] = signed.signedUrl
          else app[`${urlField}_error`] = 'Private file unavailable.'
        }
      }
    }
    for (const app of applications || []) {
      const { data: rows, error } = await supabaseAdmin.from('application_documents').select('*').eq('application_id', app.id)
      if (error) throw error
      for (const doc of rows || []) {
        const { data: signed, error: signedError } = await supabaseAdmin.storage.from('booking-private-docs').createSignedUrl(doc.storage_path, 300)
        const indexed = db.prepare('SELECT index_status,index_error,indexed_at FROM scanned_document_index WHERE document_path=?').get(`supabase://booking-private-docs/${doc.storage_path}`)
        documents.push({ ...doc, traveler_number: app.traveler_number, signed_url: !signedError ? signed?.signedUrl : null, search_index: indexed || null })
      }
    }
    res.json({ booking, applications: applications || [], documents, payments: payments || [] })
  } catch (error) {
    console.error('[Admin booking application data]', error.message)
    res.status(503).json({ error: 'Private application documents are unavailable. Check server Supabase service configuration.' })
  }
})

router.get('/booking-id/:bookingId/applications/:travelerNumber/digital-pdf', requirePermission('bookings.export_individual_pdf'), async (req, res) => {
  try {
    const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').select('*').eq('booking_reference', req.params.bookingId).single()
    if (bookingError || !booking) throw bookingError || new Error('Booking not found.')
    const { data: app, error } = await supabaseAdmin.from('traveler_applications').select('*').eq('booking_id', booking.id).eq('traveler_number', Number(req.params.travelerNumber)).single()
    if (error || !app) return res.status(404).json({ error: 'Digital application was not found.' })
    const assets = {}
    if (app.photograph_path) assets.photo = await downloadStorageObject(app.photograph_path)
    if (app.applicant_signature_path) assets.signature = await downloadStorageObject(app.applicant_signature_path)
    if (app.parent_guardian_signature_path) assets.guardianSignature = await downloadStorageObject(app.parent_guardian_signature_path)
    const pdf = await generateDigitalApplicationPdf(booking, app, assets)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${booking.booking_reference}-traveler-${app.traveler_number}-digital-application.pdf"`)
    res.send(pdf)
  } catch (error) {
    console.error('[Digital application PDF]', error.message)
    res.status(503).json({ error: error.message || 'Unable to generate the digital application PDF.' })
  }
})

router.get('/booking-id/:bookingId/applications/:travelerNumber/original-pdf', requirePermission('bookings.view'), async (req, res) => {
  try {
    const { data: booking, error: bookingError } = await supabaseAdmin.from('bookings').select('id,booking_reference').eq('booking_reference', req.params.bookingId).single()
    if (bookingError || !booking) return res.status(404).json({ error: 'Booking was not found.' })
    const { data: app, error } = await supabaseAdmin.from('traveler_applications').select('id,traveler_number').eq('booking_id', booking.id).eq('traveler_number', Number(req.params.travelerNumber)).single()
    if (error || !app) return res.status(404).json({ error: 'Traveler application was not found.' })
    const { data: doc, error: docError } = await supabaseAdmin.from('application_documents').select('storage_path,original_filename').eq('application_id', app.id).single()
    if (docError || !doc) return res.status(404).json({ error: 'Uploaded original PDF was not found.' })
    const pdf = await downloadStorageObject(doc.storage_path)
    const safeName = String(doc.original_filename || 'application.pdf').replace(/[\r\n"\\]/g, '_')
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`)
    res.send(pdf)
  } catch (error) {
    console.error('[Original application download]', error.message)
    res.status(503).json({ error: error.message || 'Uploaded original PDF is unavailable.' })
  }
})

router.get('/download/all/digital-applications.zip', requirePermission('bookings.export_pdf'), async (req, res) => {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Private document export requires server Supabase configuration.')
    const exportReferences = getAllBookingsForExport(bookingExportFilters(req.query)).map(row => row.booking_id)
    if (!exportReferences.length) return res.status(404).json({ error: 'No bookings match the selected filters.' })
    const files = []
    for (let offset = 0; ; offset += 500) {
      const { data: bookings, error } = await supabaseAdmin.from('bookings').select('*').in('booking_reference', exportReferences).order('created_at').range(offset, offset + 499)
      if (error) throw error
      if (!bookings?.length) break
      for (const booking of bookings) {
        const { data: applications, error: appError } = await supabaseAdmin.from('traveler_applications').select('*').eq('booking_id', booking.id).order('traveler_number')
        if (appError) throw appError
        for (const app of applications || []) {
          const assets = {}
          if (app.photograph_path) assets.photo = await downloadStorageObject(app.photograph_path)
          if (app.applicant_signature_path) assets.signature = await downloadStorageObject(app.applicant_signature_path)
          if (app.parent_guardian_signature_path) assets.guardianSignature = await downloadStorageObject(app.parent_guardian_signature_path)
          const data = await generateDigitalApplicationPdf(booking, app, assets)
          files.push({ name: `${booking.booking_reference}-traveler-${app.traveler_number}-digital-application.pdf`, data })
        }
      }
      if (bookings.length < 500) break
    }
    if (!files.length) return res.status(404).json({ error: 'There are no digital applications to export.' })
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename="all-digital-applications.zip"')
    res.send(makeZip(files))
  } catch (error) {
    console.error('[Bulk digital application export]', error.message)
    res.status(503).json({ error: error.message || 'Unable to export digital applications.' })
  }
})

router.get('/:id/travelers', requirePermission('bookings.view'), (req, res) => {
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

router.get('/traveler/:travelerId', requirePermission('bookings.view'), (req, res) => {
  const traveler = getTravelerById(req.params.travelerId)
  if (!traveler) return res.status(404).json({ error: 'Not found' })
  
  const declaration = getDeclarationByTravelerId(traveler.id)
  const risk_certificate = getRiskCertificateByTravelerId(traveler.id)
  const guardian = getGuardianByTravelerId(traveler.id)
  const booking = getBookingById(traveler.booking_id)
  
  res.json({ traveler, declaration, risk_certificate, guardian, booking })
})

router.patch('/:id/status', requirePermission('bookings.edit'), async (req, res) => {
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

  logActivity({ user_name: req.user.full_name || req.user.username || req.user.email, action: 'Booking status updated', module: 'Bookings', details: `#${req.params.id} -> ${status}` })
  res.json({ message: 'Status updated', status })
})

// Admin verify UPI / manual payment: sets payment_status = 'paid' and status = 'confirmed'
router.patch('/:id/verify-payment', requirePermission('bookings.edit'), async (req, res) => {
  const existing = getBookingById(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  updateBookingPayment(req.params.id, {
    payment_status: 'paid',
    booking_status: 'confirmed'
  })

  // Sync to Supabase bookings table
  try {
    const bookingRef = existing.booking_id || req.params.id
    // Try updating payment_status and status
    const supRes = await supabaseRequest('bookings', {
      method: 'PATCH',
      body: { payment_status: 'paid', status: 'confirmed', updated_at: new Date().toISOString() },
      query: `booking_reference=eq.${encodeURIComponent(bookingRef)}`
    })
    // If column doesn't exist yet, fallback to status only
    if (supRes?.error && supRes.error.includes('column')) {
      await supabaseRequest('bookings', {
        method: 'PATCH',
        body: { status: 'confirmed', updated_at: new Date().toISOString() },
        query: `booking_reference=eq.${encodeURIComponent(bookingRef)}`
      })
    }
    const { data: supabaseBooking } = await supabaseAdmin.from('bookings').select('id').eq('booking_reference', bookingRef).maybeSingle()
    if (supabaseBooking?.id) {
      const actorId = req.user?.auth_user_id || req.user?.id
      const verifiedBy = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actorId || '') ? actorId : null
      const { error: paymentError } = await supabaseAdmin.from('payments').update({ payment_status: 'paid', verification_status: 'verified', verified_by: verifiedBy, verified_at: new Date().toISOString() }).eq('booking_id', supabaseBooking.id).eq('payment_method', 'UPI').eq('payment_status', 'pending_verification')
      if (paymentError) throw paymentError
    }
  } catch (supErr) {
    console.warn('[Supabase verify payment warning]:', supErr.message)
  }

  logActivity({
    user_name: req.user.full_name || req.user.username || req.user.email,
    action: 'Payment verified',
    module: 'Bookings',
    details: `Payment verified for booking #${req.params.id} (${existing.booking_id})`
  })

  res.json({
    message: 'Payment verified successfully',
    payment_status: 'paid',
    status: 'confirmed'
  })
})

// Admin reject payment: sets payment_status = 'payment_failed' (does NOT delete the booking)
router.patch('/:id/reject-payment', requirePermission('bookings.edit'), async (req, res) => {
  const existing = getBookingById(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  updateBookingPayment(req.params.id, {
    payment_status: 'payment_failed'
  })

  // Sync to Supabase bookings table
  try {
    const bookingRef = existing.booking_id || req.params.id
    await supabaseRequest('bookings', {
      method: 'PATCH',
      body: { payment_status: 'payment_failed', updated_at: new Date().toISOString() },
      query: `booking_reference=eq.${encodeURIComponent(bookingRef)}`
    })
  } catch (supErr) {
    console.warn('[Supabase reject payment warning]:', supErr.message)
  }

  logActivity({
    user_name: req.user.full_name || req.user.username || req.user.email,
    action: 'Payment rejected',
    module: 'Bookings',
    details: `Payment rejected for booking #${req.params.id} (${existing.booking_id})`
  })

  res.json({
    message: 'Payment marked as failed',
    payment_status: 'payment_failed',
    status: existing.status
  })
})

// Generic payment status update
router.patch('/:id/payment-status', requirePermission('bookings.edit'), async (req, res) => {
  const validStatuses = ['pending', 'pending_verification', 'paid', 'payment_failed', 'refunded']
  const { payment_status, payment_method, payment_id } = req.body || {}
  if (!validStatuses.includes(payment_status)) {
    return res.status(400).json({ error: 'Invalid payment status' })
  }

  const existing = getBookingById(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  updateBookingPayment(req.params.id, {
    payment_status,
    payment_method: payment_method || undefined,
    payment_id: payment_id || undefined,
    booking_status: payment_status === 'paid' ? 'confirmed' : undefined
  })

  // Sync to Supabase bookings table
  try {
    const bookingRef = existing.booking_id || req.params.id
    const payload = { payment_status, updated_at: new Date().toISOString() }
    if (payment_status === 'paid') payload.status = 'confirmed'
    if (payment_method) payload.payment_method = payment_method
    if (payment_id) payload.payment_id = payment_id

    await supabaseRequest('bookings', {
      method: 'PATCH',
      body: payload,
      query: `booking_reference=eq.${encodeURIComponent(bookingRef)}`
    })
  } catch (supErr) {
    console.warn('[Supabase payment status patch warning]:', supErr.message)
  }

  logActivity({
    user_name: req.user.full_name || req.user.username || req.user.email,
    action: 'Payment status updated',
    module: 'Bookings',
    details: `Booking #${req.params.id} payment_status -> ${payment_status}`
  })

  res.json({
    message: 'Payment status updated',
    payment_status,
    status: payment_status === 'paid' ? 'confirmed' : existing.status
  })
})

router.delete('/:id', requirePermission('bookings.delete'), async (req, res) => {
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
  logActivity({ user_name: req.user.full_name || req.user.username || req.user.email, action: 'Booking deleted', module: 'Bookings', details: `Booking #${req.params.id} (${existing.booking_id})` })
  res.json({ message: 'Booking deleted successfully' })
})

// PDF & Excel Downloads — NOTE: Specific static routes MUST come BEFORE parameterized /:id routes in Express!

function bookingExportFilters(query = {}) {
  return {
    status: query.status || undefined,
    paymentStatus: query.payment_status || query.paymentStatus || undefined,
    search: query.search || undefined,
    tour: query.tour || undefined,
    travelDate: query.travelDate || undefined,
    bookingDate: query.bookingDate || undefined,
    minTravelers: query.minTravelers ? Number(query.minTravelers) : undefined,
    maxTravelers: query.maxTravelers ? Number(query.maxTravelers) : undefined,
    hasScannedForm: query.hasScannedForm || query.has_scanned_form || undefined,
  }
}

// 1. All Bookings PDF
router.get('/download/all/pdf', requirePermission('bookings.export_pdf'), async (req, res) => {
  try {
    const pdfBuffer = await generateAllBookingsPdf(bookingExportFilters(req.query))
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="all-bookings.pdf"')
    res.send(pdfBuffer)
  } catch (e) {
    console.error('Error generating all PDF:', e)
    res.status(500).json({ error: 'Unable to generate PDF' })
  }
})

// 2. All Bookings Excel
router.get('/download/all/excel', requirePermission('bookings.export_excel'), async (req, res) => {
  try {
    const excelBuffer = await generateAllBookingsExcel(bookingExportFilters(req.query))
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="all-bookings.xlsx"')
    res.send(excelBuffer)
  } catch (e) {
    console.error('Error generating all Excel:', e)
    res.status(500).json({ error: 'Unable to generate Excel' })
  }
})

// 3. Individual Traveler PDF
router.get('/traveler/:travelerId/download/pdf', requirePermission('bookings.export_individual_pdf'), async (req, res) => {
  try {
    const travelerId = isNaN(Number(req.params.travelerId)) ? req.params.travelerId : Number(req.params.travelerId)
    const pdfBuffer = await generateIndividualTravelerPdf(travelerId)
    const traveler = getTravelerById(travelerId)
    const booking = traveler ? getBookingById(traveler.booking_id) : null
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="traveler-${traveler?.traveler_number || req.params.travelerId}-${booking?.booking_id || 'booking'}.pdf"`)
    res.send(pdfBuffer)
  } catch (e) {
    console.error('Error generating traveler PDF:', e)
    res.status(500).json({ error: 'Unable to generate PDF' })
  }
})

// 4. Individual Traveler Excel
router.get('/traveler/:travelerId/download/excel', requirePermission('bookings.export_individual_excel'), async (req, res) => {
  try {
    const travelerId = isNaN(Number(req.params.travelerId)) ? req.params.travelerId : Number(req.params.travelerId)
    const excelBuffer = await generateIndividualTravelerExcel(travelerId)
    const traveler = getTravelerById(travelerId)
    const booking = traveler ? getBookingById(traveler.booking_id) : null
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="traveler-${traveler?.traveler_number || req.params.travelerId}-${booking?.booking_id || 'booking'}.xlsx"`)
    res.send(excelBuffer)
  } catch (e) {
    console.error('Error generating traveler Excel:', e)
    res.status(500).json({ error: 'Unable to generate Excel' })
  }
})

// 5. Booking PDF (by id or booking_id)
router.get('/:id/download/pdf', requirePermission('bookings.export_individual_pdf'), async (req, res) => {
  try {
    const bookingId = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id)
    const pdfBuffer = await generateBookingPdf(bookingId)
    const booking = getBookingById(bookingId)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="booking-${booking?.booking_id || req.params.id}.pdf"`)
    res.send(pdfBuffer)
  } catch (e) {
    console.error('Error generating booking PDF:', e)
    res.status(500).json({ error: 'Unable to generate PDF' })
  }
})

// 6. Booking Excel (by id or booking_id)
router.get('/:id/download/excel', requirePermission('bookings.export_individual_excel'), async (req, res) => {
  try {
    const bookingId = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id)
    const excelBuffer = await generateBookingExcel(bookingId)
    const booking = getBookingById(bookingId)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="booking-${booking?.booking_id || req.params.id}.xlsx"`)
    res.send(excelBuffer)
  } catch (e) {
    console.error('Error generating booking Excel:', e)
    res.status(500).json({ error: 'Unable to generate Excel' })
  }
})

export default router
