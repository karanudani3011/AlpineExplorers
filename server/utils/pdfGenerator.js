import PDFDocument from 'pdfkit'
import { getBookingById, getTravelersByBookingId, getDeclarationByTravelerId, getRiskCertificateByTravelerId, getGuardianByTravelerId, getAllBookingsForExport, getAllTravelersForExport, getTravelerById } from '../db.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

const RED   = '#b91c1c'
const NAVY  = '#001a4d'
const GOLD  = '#c59b27'
const GRAY  = '#6b7280'
const BLACK = '#111827'
const LIGHT = '#f8fafc'

function fmt(amount) {
  if (!amount) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return d }
}

function addImg(doc, src, x, y, w, h) {
  if (!src || typeof src !== 'string') return false
  try {
    let buf = null
    if (src.startsWith('data:image/')) {
      const p = src.split(',')
      if (p.length > 1) buf = Buffer.from(p[1], 'base64')
    } else {
      const rel = src.replace(/^\/?uploads\//, '')
      const fp  = path.join(uploadsDir, rel)
      if (fs.existsSync(fp)) buf = fs.readFileSync(fp)
    }
    if (!buf || buf.length === 0) return false
    doc.image(buf, x, y, { fit: [w, h], align: 'center', valign: 'center' })
    return true
  } catch { return false }
}

// Draw outer + inner red double border
function border(doc) {
  doc.rect(20, 20, 555, 801).lineWidth(2).strokeColor(RED).stroke()
  doc.rect(23, 23, 549, 795).lineWidth(0.5).strokeColor(RED).stroke()
}

// Compact header — occupies only ~50pt
function header(doc, booking, pageNum) {
  border(doc)

  // Logo block
  doc.rect(30, 28, 36, 36).fillAndStroke(RED, RED)
  doc.fontSize(7).font('Helvetica-Bold').fillColor('#fff')
  doc.text('ALPINE', 30, 36, { width: 36, align: 'center' })
  doc.fontSize(5).font('Helvetica').fillColor('#fff')
  doc.text('EXPLORERS', 30, 44, { width: 36, align: 'center' })

  // Company name + tagline
  doc.fontSize(13).font('Times-Bold').fillColor(RED).text('ALPINE EXPLORERS', 72, 29)
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(GRAY).text('PIONEER IN ADVENTURE TOURISM  |  Amit Lakhani (Director)  |  Cel. 94272 20979', 72, 43)
  doc.fontSize(6).font('Helvetica').fillColor(BLACK).text('1, Shubh prabha Appt., 28 Karanpara, Rajkot  |  0281-222 75 83  |  alpine_explorers@yahoo.com', 72, 52)

  // Booking ref + page
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(NAVY)
  doc.text(`Ref: ${booking.booking_id}   |   Page ${pageNum} of 2`, 350, 29, { width: 215, align: 'right' })

  // Red divider
  doc.moveTo(28, 68).lineTo(572, 68).lineWidth(1.2).strokeColor(RED).stroke()
}

// Single text row: label + value + optional underline
function row(doc, label, value, x, y, lw, vw, ul = true) {
  doc.fontSize(7).font('Helvetica-Bold').fillColor(BLACK).text(label, x, y, { width: lw })
  doc.fontSize(7).font('Helvetica').fillColor(NAVY).text(value || '—', x + lw, y, { width: vw })
  if (ul) doc.moveTo(x + lw, y + 9).lineTo(x + lw + vw, y + 9).lineWidth(0.3).strokeColor('#d1d5db').stroke()
}

/* =============================================================
   PAGE 1 — Application Form
   ============================================================= */
function page1(doc, booking, t, idx) {
  header(doc, booking, 1)

  // Title bar
  doc.rect(28, 72, 544, 14).fillAndStroke(RED, RED)
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#fff')
  doc.text(`APPLICATION FORM   —   TRAVELER ${idx + 1} OF ${booking.number_of_travelers}`, 28, 75, { width: 544, align: 'center' })

  let y = 90

  // ── Course name row ──
  row(doc, 'COURSE / TOUR :', t.course_name || booking.tour_name || '—', 28, y, 95, 300)

  // ── Photo box (right side, row 0-5 height) ──
  const px = 440, py = 88, pw = 115, ph = 105
  doc.rect(px, py, pw, ph).lineWidth(0.8).strokeColor(RED).stroke()
  const didPhoto = t.photo_url ? addImg(doc, t.photo_url, px + 2, py + 2, pw - 4, ph - 4) : false
  if (!didPhoto) {
    doc.fontSize(6.5).font('Helvetica-Bold').fillColor('#9ca3af')
    doc.text('AFFIX\nPASSPORT\nSIZE PHOTO', px, py + 32, { width: pw, align: 'center', lineGap: 1 })
  }
  doc.fontSize(5.5).font('Helvetica').fillColor(GRAY).text('Photograph', px, py + ph + 1, { width: pw, align: 'center' })

  y += 14
  row(doc, 'FULL NAME :', t.full_name, 28, y, 80, 320)

  y += 13
  // Address (2 sub-lines)
  doc.fontSize(7).font('Helvetica-Bold').fillColor(BLACK).text('ADDRESS :', 28, y, { width: 80 })
  doc.fontSize(7).font('Helvetica').fillColor(NAVY).text(t.address || '—', 110, y, { width: 290 })
  doc.moveTo(110, y + 9).lineTo(400, y + 9).lineWidth(0.3).strokeColor('#d1d5db').stroke()

  y += 13
  // DOB / Age / Sex / Blood group on one line
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK).text('DOB :', 28, y)
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(fmtDate(t.date_of_birth), 55, y, { width: 70 })
  doc.moveTo(55, y + 8).lineTo(125, y + 8).lineWidth(0.3).strokeColor('#d1d5db').stroke()

  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK).text('AGE :', 130, y)
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(t.age ? `${t.age} yrs` : '—', 158, y, { width: 40 })
  doc.moveTo(158, y + 8).lineTo(198, y + 8).lineWidth(0.3).strokeColor('#d1d5db').stroke()

  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK).text('SEX :', 203, y)
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(t.sex || '—', 228, y, { width: 35 })
  doc.moveTo(228, y + 8).lineTo(263, y + 8).lineWidth(0.3).strokeColor('#d1d5db').stroke()

  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK).text('BLOOD GRP :', 268, y)
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(t.blood_group || '—', 320, y, { width: 50 })
  doc.moveTo(320, y + 8).lineTo(370, y + 8).lineWidth(0.3).strokeColor('#d1d5db').stroke()

  y += 13
  row(doc, 'MOBILE / TEL :', t.contact_number || booking.booking_contact_phone || '—', 28, y, 85, 315)

  y += 13
  // Education + Institute same line
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK).text('EDUCATION :', 28, y, { width: 70 })
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(t.education || '—', 100, y, { width: 120 })
  doc.moveTo(100, y + 8).lineTo(220, y + 8).lineWidth(0.3).strokeColor('#d1d5db').stroke()
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK).text('INST/OFFICE :', 228, y, { width: 75 })
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(t.school_college || '—', 305, y, { width: 125 })
  doc.moveTo(305, y + 8).lineTo(430, y + 8).lineWidth(0.3).strokeColor('#d1d5db').stroke()

  y += 13
  row(doc, 'INST. ADDRESS :', t.school_college_address || '—', 28, y, 90, 250)
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK).text('INST. PHONE :', 373, y, { width: 75 })
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(t.school_college_phone || '—', 448, y, { width: 90 })
  doc.moveTo(448, y + 8).lineTo(538, y + 8).lineWidth(0.3).strokeColor('#d1d5db').stroke()

  y += 13
  row(doc, 'HOBBIES :', t.hobbies || '—', 28, y, 65, 375)

  y += 13
  const expYN = t.adventure_experience || 'No'
  row(doc, 'PREV. ADVENTURE / CULTURAL EXPERIENCE :', expYN, 28, y, 210, 50)
  if (t.adventure_details) {
    y += 12
    row(doc, 'DETAILS :', t.adventure_details, 28, y, 65, 375)
  }

  // ── Declaration box ──
  y += 18
  doc.rect(28, y, 544, 26).fillAndStroke('#fef2f2', RED)
  doc.fontSize(7).font('Helvetica-Bold').fillColor(RED)
  doc.text('DECLARATION & UNDERTAKING', 28, y + 3, { width: 544, align: 'center' })
  doc.fontSize(6).font('Helvetica').fillColor(BLACK)
  doc.text(
    'IF I AM SELECTED, I AGREE TO ABIDE BY ALL THE RULES & REGULATIONS AND TERMS AND CONDITIONS OF ADMISSION FOR THE COURSE / TOUR WHICH I HEREBY FULLY ACCEPT.',
    36, y + 12, { width: 528, align: 'center' }
  )

  // ── Signatures row ──
  y += 34
  const decl = t.declaration || {}
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK)
  doc.text(`Place : ${decl.place || '—'}`, 30, y)
  doc.text(`Date  : ${fmtDate(decl.date)}`, 30, y + 11)

  // Guardian sig (if minor)
  if (t.participant_type === 'Minor' || t.guardian) {
    const gSigX = 200, guard = t.guardian || {}
    if (guard.guardian_signature_url) addImg(doc, guard.guardian_signature_url, gSigX, y - 4, 110, 22)
    doc.moveTo(gSigX - 5, y + 22).lineTo(gSigX + 120, y + 22).lineWidth(0.4).strokeColor(GRAY).stroke()
    doc.fontSize(6).font('Helvetica-Bold').fillColor(BLACK)
    doc.text('Signature of Parent / Guardian', gSigX - 5, y + 24, { width: 125, align: 'center' })
  }

  // Applicant sig
  const sigX = 400
  if (decl.signature_url) addImg(doc, decl.signature_url, sigX, y - 4, 110, 22)
  doc.moveTo(sigX - 5, y + 22).lineTo(sigX + 120, y + 22).lineWidth(0.4).strokeColor(GRAY).stroke()
  doc.fontSize(6).font('Helvetica-Bold').fillColor(BLACK)
  doc.text('Signature of Applicant', sigX - 5, y + 24, { width: 125, align: 'center' })
}

/* =============================================================
   PAGE 2 — Risk Certificate + Booking Summary + Office Use
   ============================================================= */
function page2(doc, booking, t, idx) {
  doc.addPage()
  header(doc, booking, 2)

  let y = 72

  // ── RISK CERTIFICATE ──
  const risk = t.risk_certificate || {}
  doc.rect(28, y, 544, 115).lineWidth(1).strokeColor(RED).stroke()
  doc.rect(28, y, 544, 13).fillAndStroke(RED, RED)
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#fff').text('RISK CERTIFICATE', 28, y + 3, { width: 544, align: 'center' })

  const partName  = risk.participant_name || t.full_name || '—'
  const courseName = risk.course_name || t.course_name || booking.tour_name || '—'

  doc.fontSize(7.5).font('Helvetica').fillColor(BLACK)
  doc.text(
    `It is certified that I agree to detail my son / daughter / ward / Mr. / Ms. / Myself  "${partName}"  for  "${courseName}"  course at my own risk and no compensation will be paid to me in case of accident or death and I will not hold the CLUB - TRUST or its staff wholly or partially responsible for any mishappening during the expedition / course.`,
    36, y + 18, { width: 528, align: 'justify', lineGap: 2 }
  )

  const rSigY = y + 72
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(BLACK)
  doc.text(`Place : ${risk.place || '—'}`, 36, rSigY)
  doc.text(`Date  : ${fmtDate(risk.date)}`, 36, rSigY + 11)

  const rSigX = 380
  if (risk.signature_url) addImg(doc, risk.signature_url, rSigX, rSigY - 4, 120, 22)
  doc.moveTo(rSigX - 5, rSigY + 22).lineTo(rSigX + 135, rSigY + 22).lineWidth(0.4).strokeColor(GRAY).stroke()
  doc.fontSize(6).font('Helvetica-Bold').fillColor(BLACK)
  doc.text('Signature of Parent / Guardian / Applicant', rSigX - 5, rSigY + 24, { width: 140, align: 'center' })
  doc.fontSize(5.5).font('Helvetica').fillColor(GRAY).text('(In case of minor, parent signature required)', rSigX - 5, rSigY + 32, { width: 140, align: 'center' })

  y += 120

  // ── BOOKING & PAYMENT SUMMARY ──
  doc.rect(28, y, 544, 12).fillAndStroke(NAVY, NAVY)
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#fff').text('OFFICIAL BOOKING & PAYMENT DETAILS', 28, y + 2.5, { width: 544, align: 'center' })

  y += 16
  doc.rect(28, y, 544, 95).lineWidth(0.5).strokeColor('#cbd5e1').stroke()

  const c1 = 38, c2 = 300
  let ry = y + 7

  const brow = (l1, v1, l2, v2) => {
    doc.fontSize(6.5).font('Helvetica-Bold').fillColor(GRAY).text(l1, c1, ry, { width: 75 })
    doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(v1 || '—', c1 + 75, ry, { width: 170 })
    if (l2) {
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(GRAY).text(l2, c2, ry, { width: 80 })
      doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(v2 || '—', c2 + 80, ry, { width: 170 })
    }
    ry += 13
  }

  brow('BOOKING ID :', booking.booking_id, 'BOOKING DATE :', fmtDate(booking.booking_date))
  brow('TOUR / PACKAGE :', booking.tour_name, 'TRAVEL DATE :', fmtDate(booking.travel_date))
  brow('DESTINATION :', booking.location, 'DURATION :', booking.duration)
  brow('TRAVELERS :', `${booking.number_of_travelers} Person(s)`, 'TOTAL AMOUNT :', fmt(booking.total_amount))
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(GRAY).text('PAYMENT MODE :', c1, ry, { width: 75 })
  doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text((booking.payment_method || 'UPI').toUpperCase(), c1 + 75, ry, { width: 100 })
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(GRAY).text('PAYMENT STATUS :', c2, ry, { width: 80 })
  const isPaid = (booking.payment_status || '').toLowerCase() === 'paid'
  doc.fontSize(6.5).font('Helvetica-Bold').fillColor(isPaid ? '#059669' : '#d97706')
  doc.text((booking.payment_status || 'Pending').toUpperCase(), c2 + 80, ry, { width: 100 })
  ry += 13
  brow('CONTACT :', `${booking.booking_contact_name || '—'} (${booking.booking_contact_phone || '—'})`, 'EMAIL :', booking.booking_contact_email)

  y += 100

  // ── SCANNED FORMS SECTION ──
  let scannedForms = []
  try {
    scannedForms = typeof booking.scanned_forms === 'string'
      ? JSON.parse(booking.scanned_forms || '[]')
      : (booking.scanned_forms || [])
  } catch (e) {}

  const sfH = scannedForms.length > 0 ? Math.min(14 + scannedForms.length * 13, 65) : 24
  doc.rect(28, y, 544, 13).fillAndStroke('#f1f5f9', '#94a3b8')
  doc.fontSize(7).font('Helvetica-Bold').fillColor(NAVY).text('ATTACHED SCANNED APPLICATION DOCUMENTS', 28, y + 3, { width: 544, align: 'center' })

  y += 16
  doc.rect(28, y, 544, sfH).lineWidth(0.4).strokeColor('#cbd5e1').stroke()

  if (scannedForms.length > 0) {
    let sy = y + 5
    scannedForms.forEach((form, fi) => {
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(RED).text(`[PDF ${fi + 1}]`, 36, sy)
      doc.fontSize(6.5).font('Helvetica').fillColor(NAVY).text(form.name || `Scanned_Form_${fi + 1}.pdf`, 75, sy, { width: 280 })
      doc.fontSize(6).font('Helvetica').fillColor(GRAY)
      doc.text(`${form.size ? (form.size / 1024).toFixed(0) + ' KB' : 'PDF'}  |  ${form.uploaded_at ? fmtDate(form.uploaded_at) : 'Uploaded'}`, 360, sy, { width: 200, align: 'right' })
      sy += 13
    })
  } else {
    doc.fontSize(6.5).font('Helvetica-Oblique').fillColor(GRAY)
    doc.text('No scanned document uploaded. Signed physical copy will be verified at reporting.', 36, y + 7, { width: 528, align: 'center' })
  }

  y += sfH + 8

  // ── OFFICE USE BOX ──
  const offH = 52
  doc.rect(28, y, 544, offH).lineWidth(0.6).strokeColor('#94a3b8').stroke()
  doc.fontSize(7).font('Helvetica-Bold').fillColor(NAVY).text('FOR ALPINE EXPLORERS OFFICE USE ONLY', 36, y + 5)
  doc.fontSize(6.5).font('Helvetica').fillColor('#475569')
  doc.text(
    'Application Form & Documents Verified   [    ]\nMedical & Declaration Checks Cleared     [    ]\nCamp Admission & Slot Confirmed          [    ]',
    36, y + 15, { lineGap: 2 }
  )

  const stX = 400
  doc.rect(stX, y + 6, 132, 42).lineWidth(0.4).strokeColor('#94a3b8').stroke()
  doc.moveTo(stX, y + 42).lineTo(stX + 132, y + 42).lineWidth(0.3).strokeColor(GRAY).stroke()
  doc.fontSize(6).font('Helvetica-Bold').fillColor(NAVY)
  doc.text('Authorized Signature & Seal', stX, y + 44, { width: 132, align: 'center' })
}

/* =============================================================
   Public exports
   ============================================================= */
export async function generateBookingPdf(bookingId) {
  const booking = getBookingById(bookingId)
  if (!booking) throw new Error('Booking not found')

  const travelers = getTravelersByBookingId(booking.id)
  const withDetails = travelers.map(t => ({
    ...t,
    declaration:      getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian:         getGuardianByTravelerId(t.id)
  }))

  const doc = new PDFDocument({ margin: 20, size: 'A4', autoFirstPage: true })
  const chunks = []
  doc.on('data', c => chunks.push(c))

  for (let i = 0; i < withDetails.length; i++) {
    if (i > 0) doc.addPage()
    page1(doc, booking, withDetails[i], i)
    page2(doc, booking, withDetails[i], i)
  }

  doc.end()
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
}

export async function generateIndividualTravelerPdf(travelerId) {
  const t = getTravelerById(travelerId)
  if (!t) throw new Error('Traveler not found')

  const booking = getBookingById(t.booking_id)
  const tWithDetails = {
    ...t,
    declaration:      getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian:         getGuardianByTravelerId(t.id)
  }

  const doc = new PDFDocument({ margin: 20, size: 'A4', autoFirstPage: true })
  const chunks = []
  doc.on('data', c => chunks.push(c))

  page1(doc, booking || { booking_id: `T-${travelerId}`, number_of_travelers: 1 }, tWithDetails, (t.traveler_number || 1) - 1)
  page2(doc, booking || { booking_id: `T-${travelerId}` }, tWithDetails, (t.traveler_number || 1) - 1)

  doc.end()
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
}

export async function generateAllBookingsPdf() {
  const bookings = getAllBookingsForExport()
  const allT     = getAllTravelersForExport()

  const doc = new PDFDocument({ margin: 20, size: 'A4', autoFirstPage: true })
  const chunks = []
  doc.on('data', c => chunks.push(c))

  let first = true
  for (const b of bookings) {
    const bTravelers = allT.filter(t => t.booking_id === b.id)
    for (let i = 0; i < bTravelers.length; i++) {
      const twd = {
        ...bTravelers[i],
        declaration:      getDeclarationByTravelerId(bTravelers[i].id),
        risk_certificate: getRiskCertificateByTravelerId(bTravelers[i].id),
        guardian:         getGuardianByTravelerId(bTravelers[i].id)
      }
      if (!first) doc.addPage()
      first = false
      page1(doc, b, twd, i)
      page2(doc, b, twd, i)
    }
  }

  doc.end()
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
}