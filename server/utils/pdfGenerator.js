import PDFDocument from 'pdfkit'
import { db, getBookingById, getTravelersByBookingId, getDeclarationByTravelerId, getRiskCertificateByTravelerId, getGuardianByTravelerId, getAllBookingsForExport, getAllTravelersForExport, getTravelerById } from '../db.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'

function formatCurrency(amount) {
  if (!amount) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function addImage(doc, imageData, x, y, maxWidth, maxHeight) {
  if (!imageData || typeof imageData !== 'string') return false
  try {
    let buffer = null
    if (imageData.startsWith('data:image/')) {
      const parts = imageData.split(',')
      if (parts.length > 1) {
        buffer = Buffer.from(parts[1], 'base64')
      }
    } else if (imageData.startsWith('/uploads/') || imageData.startsWith('uploads/')) {
      const cleanRel = imageData.replace(/^\/?uploads\//, '')
      const diskPath = path.join(uploadsDir, cleanRel)
      if (fs.existsSync(diskPath)) {
        buffer = fs.readFileSync(diskPath)
      }
    } else {
      const diskPath = path.join(uploadsDir, imageData)
      if (fs.existsSync(diskPath)) {
        buffer = fs.readFileSync(diskPath)
      }
    }

    if (!buffer || buffer.length === 0) return false

    doc.image(buffer, x, y, { fit: [maxWidth, maxHeight], align: 'center' })
    return true
  } catch (e) {
    console.error('Error adding image to PDF:', e.message)
    return false
  }
}

function addPageNumbersAndFooters(doc) {
  try {
    const range = doc.bufferedPageRange()
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i)
      doc.fontSize(8).font('Helvetica').fillColor('#718096').text(
        `Page ${i + 1} of ${range.count}   |   Alpine Explorers — Application & Booking Management`,
        50,
        doc.page.height - 35,
        { align: 'center', width: doc.page.width - 100 }
      )
    }
  } catch (e) {
    console.error('Error adding page numbers to PDF:', e)
  }
}

function drawSectionHeader(doc, title, y) {
  doc.fontSize(13).font('Helvetica-Bold').fillColor(NAVY).text(title, 50, y)
  doc.moveTo(50, y + 18).lineTo(550, y + 18).strokeColor(GOLD).lineWidth(1.5).stroke()
  return y + 26
}

function drawField(doc, label, value, y, indent = 50) {
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#3a2a18').text(`${label}:`, indent, y, { width: 160 })
  doc.fontSize(9.5).font('Helvetica').fillColor(NAVY).text(value || '—', indent + 165, y, { width: 335 })
  return y + 17
}

function drawTextBlock(doc, text, y, indent = 50, width = 450) {
  doc.fontSize(9).font('Helvetica').fillColor('#3a2a18').text(text, indent, y, { width, align: 'justify', lineGap: 2 })
  return y + doc.heightOfString(text, { width, align: 'justify', lineGap: 2 }) + 8
}

function checkPageBreak(doc, y, needed = 100) {
  if (y + needed > doc.page.height - 50) {
    doc.addPage()
    return 50
  }
  return y
}

export async function generateBookingPdf(bookingId) {
  const booking = getBookingById(bookingId)
  if (!booking) throw new Error('Booking not found')
  
  const travelers = getTravelersByBookingId(booking.id)
  const travelersWithDetails = travelers.map(t => ({
    ...t,
    declaration: getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian: getGuardianByTravelerId(t.id)
  }))

  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true })
  const chunks = []
  doc.on('data', chunk => chunks.push(chunk))
  
  let y = 50

  // Cover Page
  doc.fontSize(28).font('Helvetica-Bold').fillColor(NAVY).text('ALPINE EXPLORERS', 50, y, { align: 'center' })
  y += 40
  doc.fontSize(18).font('Helvetica').fillColor(GOLD).text('Booking & Application Report', 50, y, { align: 'center' })
  y += 30
  doc.fontSize(12).font('Helvetica').fillColor('#666').text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 50, y, { align: 'center' })
  y += 60

  // Booking Summary
  y = drawSectionHeader(doc, 'BOOKING SUMMARY', y)
  y = drawField(doc, 'Booking ID', booking.booking_id, y)
  y = drawField(doc, 'Tour', booking.tour_name, y)
  y = drawField(doc, 'Tour Category', booking.tour_category, y)
  y = drawField(doc, 'Location', booking.location, y)
  y = drawField(doc, 'Duration', booking.duration, y)
  y = drawField(doc, 'Travel Date', formatDate(booking.travel_date), y)
  y = drawField(doc, 'Booking Date', formatDate(booking.booking_date), y)
  y = drawField(doc, 'Price Per Person', formatCurrency(booking.price_per_person), y)
  y = drawField(doc, 'Number of Travelers', String(booking.number_of_travelers), y)
  y = drawField(doc, 'Total Amount', formatCurrency(booking.total_amount), y)
  y = drawField(doc, 'Status', booking.status.charAt(0).toUpperCase() + booking.status.slice(1), y)
  y = drawField(doc, 'Contact Name', booking.booking_contact_name || '—', y)
  y = drawField(doc, 'Contact Email', booking.booking_contact_email || '—', y)
  y = drawField(doc, 'Contact Phone', booking.booking_contact_phone || '—', y)

  // Travelers
  for (let i = 0; i < travelersWithDetails.length; i++) {
    const t = travelersWithDetails[i]
    doc.addPage()
    y = 50
    
    doc.fontSize(16).font('Helvetica-Bold').fillColor(NAVY).text(`TRAVELER ${i + 1}: ${t.full_name || 'Unknown'}`, 50, y, { align: 'center' })
    y += 30
    doc.moveTo(50, y).lineTo(550, y).strokeColor(GOLD).lineWidth(1).stroke()
    y += 20

    // Photograph
    y = drawSectionHeader(doc, 'PHOTOGRAPH', y)
    if (t.photo_url) {
      const imgAdded = addImage(doc, t.photo_url, 50, y, 150, 180)
      if (imgAdded) y += 190
      else {
        doc.fontSize(10).font('Helvetica').fillColor('#999').text('[Photograph not available]', 50, y)
        y += 30
      }
    } else {
      doc.fontSize(10).font('Helvetica').fillColor('#999').text('[No photograph uploaded]', 50, y)
      y += 30
    }

    // Personal Details
    y = checkPageBreak(doc, y, 150)
    y = drawSectionHeader(doc, 'PERSONAL DETAILS', y)
    y = drawField(doc, 'Full Name', t.full_name, y)
    y = drawField(doc, 'Date of Birth', t.date_of_birth ? formatDate(t.date_of_birth) : '—', y)
    y = drawField(doc, 'Age', t.age ? `${t.age} years` : '—', y)
    y = drawField(doc, 'Gender', t.sex || '—', y)
    y = drawField(doc, 'Blood Group', t.blood_group || '—', y)
    y = drawField(doc, 'Contact Number', t.contact_number || '—', y)
    y = drawField(doc, 'Address', t.address || '—', y)

    // Education & Activities
    y = checkPageBreak(doc, y, 150)
    y = drawSectionHeader(doc, 'EDUCATION & ACTIVITIES', y)
    y = drawField(doc, 'Education', t.education || '—', y)
    y = drawField(doc, 'School / College', t.school_college || '—', y)
    y = drawField(doc, 'School / College Address', t.school_college_address || '—', y)
    y = drawField(doc, 'School / College Phone', t.school_college_phone || '—', y)
    y = drawField(doc, 'Hobbies', t.hobbies || '—', y)
    
    y = checkPageBreak(doc, y, 80)
    y = drawField(doc, 'Adventure Experience', t.adventure_experience || '—', y)
    if (t.adventure_experience === 'Yes' && t.adventure_details) {
      y = drawTextBlock(doc, `Details: ${t.adventure_details}`, y)
    }

    // Declaration
    y = checkPageBreak(doc, y, 150)
    y = drawSectionHeader(doc, 'DECLARATION', y)
    y = drawTextBlock(doc, '"If I am selected, I agree to abide by the rules & regulations, the terms and conditions of admission for the course which I hereby agree to abide fully."', y)
    y = drawField(doc, 'Terms & Conditions Accepted', t.declaration?.accepted ? 'YES' : 'NO', y)
    y = drawField(doc, 'Place', t.declaration?.place || '—', y)
    y = drawField(doc, 'Date', t.declaration?.date ? formatDate(t.declaration.date) : '—', y)
    
    if (t.declaration?.signature_url) {
      y = checkPageBreak(doc, y, 80)
      y = drawSectionHeader(doc, 'APPLICANT SIGNATURE', y)
      const sigAdded = addImage(doc, t.declaration.signature_url, 50, y, 200, 80)
      if (sigAdded) y += 90
    }

    // Risk Certificate
    y = checkPageBreak(doc, y, 150)
    y = drawSectionHeader(doc, 'RISK CERTIFICATE', y)
    y = drawTextBlock(doc, '"It is certified that I agree to detail my son / daughter / ward / Mr. / Myself _______________ for _______________ course at my own risk and no compensation will be paid to me in case of accident or death and I will not hold the CLUB-TRUST or its staff wholly or partially responsible for any mishappening."', y)
    y = drawField(doc, 'Participant Name', t.risk_certificate?.participant_name || '—', y)
    y = drawField(doc, 'Course Name', t.risk_certificate?.course_name || '—', y)
    y = drawField(doc, 'Risk Accepted', t.risk_certificate?.accepted ? 'YES' : 'NO', y)
    y = drawField(doc, 'Place', t.risk_certificate?.place || '—', y)
    y = drawField(doc, 'Date', t.risk_certificate?.date ? formatDate(t.risk_certificate.date) : '—', y)
    
    if (t.risk_certificate?.signature_url) {
      y = checkPageBreak(doc, y, 80)
      y = drawSectionHeader(doc, 'RISK CERTIFICATE SIGNATURE', y)
      const sigAdded = addImage(doc, t.risk_certificate.signature_url, 50, y, 200, 80)
      if (sigAdded) y += 90
    }

    // Guardian (if minor)
    if (t.participant_type === 'Minor' && t.guardian) {
      y = checkPageBreak(doc, y, 120)
      y = drawSectionHeader(doc, 'PARENT / GUARDIAN INFORMATION', y)
      y = drawField(doc, 'Guardian Name', t.guardian.guardian_name || '—', y)
      y = drawField(doc, 'Guardian Contact', t.guardian.guardian_contact || '—', y)
      
      if (t.guardian.guardian_signature_url) {
        y = checkPageBreak(doc, y, 80)
        y = drawSectionHeader(doc, 'GUARDIAN SIGNATURE', y)
        const sigAdded = addImage(doc, t.guardian.guardian_signature_url, 50, y, 200, 80)
        if (sigAdded) y += 90
      }
    }
  }

  addPageNumbersAndFooters(doc)
  doc.end()
  
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
}

export async function generateIndividualTravelerPdf(travelerId) {
  const traveler = getTravelerById(travelerId)
  if (!traveler) throw new Error('Traveler not found')
  
  const declaration = getDeclarationByTravelerId(traveler.id)
  const risk_certificate = getRiskCertificateByTravelerId(traveler.id)
  const guardian = getGuardianByTravelerId(traveler.id)
  const booking = getBookingById(traveler.booking_id)

  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true })
  const chunks = []
  doc.on('data', chunk => chunks.push(chunk))
  
  let y = 50

  // Header
  doc.fontSize(22).font('Helvetica-Bold').fillColor(NAVY).text('ALPINE EXPLORERS', 50, y, { align: 'center' })
  y += 30
  doc.fontSize(14).font('Helvetica').fillColor(GOLD).text('Individual Traveler Application Form', 50, y, { align: 'center' })
  y += 20
  doc.moveTo(50, y).lineTo(550, y).strokeColor(GOLD).lineWidth(2).stroke()
  y += 20

  // Booking Info
  y = drawSectionHeader(doc, 'BOOKING INFORMATION', y)
  y = drawField(doc, 'Booking ID', booking?.booking_id || '—', y)
  y = drawField(doc, 'Tour', booking?.tour_name || '—', y)
  y = drawField(doc, 'Travel Date', booking?.travel_date ? formatDate(booking.travel_date) : '—', y)
  y = drawField(doc, 'Total Amount', booking?.total_amount ? formatCurrency(booking.total_amount) : '—', y)

  // Personal Details
  y = checkPageBreak(doc, y, 150)
  y = drawSectionHeader(doc, 'PERSONAL DETAILS', y)
  y = drawField(doc, 'Full Name', traveler.full_name, y)
  y = drawField(doc, 'Date of Birth', traveler.date_of_birth ? formatDate(traveler.date_of_birth) : '—', y)
  y = drawField(doc, 'Age', traveler.age ? `${traveler.age} years` : '—', y)
  y = drawField(doc, 'Gender', traveler.sex || '—', y)
  y = drawField(doc, 'Blood Group', traveler.blood_group || '—', y)
  y = drawField(doc, 'Contact Number', traveler.contact_number || '—', y)
  y = drawField(doc, 'Address', traveler.address || '—', y)

  // Photograph
  y = checkPageBreak(doc, y, 180)
  y = drawSectionHeader(doc, 'PHOTOGRAPH', y)
  if (traveler.photo_url) {
    const imgAdded = addImage(doc, traveler.photo_url, 50, y, 150, 180)
    if (imgAdded) y += 190
    else {
      doc.fontSize(10).font('Helvetica').fillColor('#999').text('[Photograph not available]', 50, y)
      y += 30
    }
  } else {
    doc.fontSize(10).font('Helvetica').fillColor('#999').text('[No photograph uploaded]', 50, y)
    y += 30
  }

  // Education & Activities
  y = checkPageBreak(doc, y, 150)
  y = drawSectionHeader(doc, 'EDUCATION & ACTIVITIES', y)
  y = drawField(doc, 'Education', traveler.education || '—', y)
  y = drawField(doc, 'School / College', traveler.school_college || '—', y)
  y = drawField(doc, 'School / College Address', traveler.school_college_address || '—', y)
  y = drawField(doc, 'School / College Phone', traveler.school_college_phone || '—', y)
  y = drawField(doc, 'Hobbies', traveler.hobbies || '—', y)
  y = drawField(doc, 'Adventure Experience', traveler.adventure_experience || '—', y)
  if (traveler.adventure_experience === 'Yes' && traveler.adventure_details) {
    y = drawTextBlock(doc, `Details: ${traveler.adventure_details}`, y)
  }

  // Declaration
  y = checkPageBreak(doc, y, 150)
  y = drawSectionHeader(doc, 'DECLARATION', y)
  y = drawTextBlock(doc, '"If I am selected, I agree to abide by the rules & regulations, the terms and conditions of admission for the course which I hereby agree to abide fully."', y)
  y = drawField(doc, 'Terms & Conditions Accepted', declaration?.accepted ? 'YES' : 'NO', y)
  y = drawField(doc, 'Place', declaration?.place || '—', y)
  y = drawField(doc, 'Date', declaration?.date ? formatDate(declaration.date) : '—', y)
  
  if (declaration?.signature_url) {
    y = checkPageBreak(doc, y, 80)
    y = drawSectionHeader(doc, 'APPLICANT SIGNATURE', y)
    const sigAdded = addImage(doc, declaration.signature_url, 50, y, 200, 80)
    if (sigAdded) y += 90
  }

  // Risk Certificate
  y = checkPageBreak(doc, y, 150)
  y = drawSectionHeader(doc, 'RISK CERTIFICATE', y)
  y = drawTextBlock(doc, '"It is certified that I agree to detail my son / daughter / ward / Mr. / Myself _______________ for _______________ course at my own risk and no compensation will be paid to me in case of accident or death and I will not hold the CLUB-TRUST or its staff wholly or partially responsible for any mishappening."', y)
  y = drawField(doc, 'Participant Name', risk_certificate?.participant_name || '—', y)
  y = drawField(doc, 'Course Name', risk_certificate?.course_name || '—', y)
  y = drawField(doc, 'Risk Accepted', risk_certificate?.accepted ? 'YES' : 'NO', y)
  y = drawField(doc, 'Place', risk_certificate?.place || '—', y)
  y = drawField(doc, 'Date', risk_certificate?.date ? formatDate(risk_certificate.date) : '—', y)
  
  if (risk_certificate?.signature_url) {
    y = checkPageBreak(doc, y, 80)
    y = drawSectionHeader(doc, 'RISK CERTIFICATE SIGNATURE', y)
    const sigAdded = addImage(doc, risk_certificate.signature_url, 50, y, 200, 80)
    if (sigAdded) y += 90
  }

  // Guardian (if minor)
  if (traveler.participant_type === 'Minor' && guardian) {
    y = checkPageBreak(doc, y, 120)
    y = drawSectionHeader(doc, 'PARENT / GUARDIAN INFORMATION', y)
    y = drawField(doc, 'Guardian Name', guardian.guardian_name || '—', y)
    y = drawField(doc, 'Guardian Contact', guardian.guardian_contact || '—', y)
    
    if (guardian.guardian_signature_url) {
      y = checkPageBreak(doc, y, 80)
      y = drawSectionHeader(doc, 'GUARDIAN SIGNATURE', y)
      const sigAdded = addImage(doc, guardian.guardian_signature_url, 50, y, 200, 80)
      if (sigAdded) y += 90
    }
  }

  // Footer
  y = checkPageBreak(doc, y, 50)
  doc.fontSize(8).font('Helvetica').fillColor('#999').text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} | Alpine Explorers`, 50, y, { align: 'center', width: 500 })

  addPageNumbersAndFooters(doc)
  doc.end()
  
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
}

export async function generateAllBookingsPdf() {
  const bookings = getAllBookingsForExport()
  const travelers = getAllTravelersForExport()

  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true })
  const chunks = []
  doc.on('data', chunk => chunks.push(chunk))
  
  let y = 50

  // Cover Page
  doc.fontSize(28).font('Helvetica-Bold').fillColor(NAVY).text('ALPINE EXPLORERS', 50, y, { align: 'center' })
  y += 40
  doc.fontSize(18).font('Helvetica').fillColor(GOLD).text('Complete Booking & Application Report', 50, y, { align: 'center' })
  y += 30
  doc.fontSize(12).font('Helvetica').fillColor('#666').text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 50, y, { align: 'center' })
  y += 30
  doc.fontSize(12).font('Helvetica').fillColor('#666').text(`Total Bookings: ${bookings.length} | Total Travelers: ${travelers.length}`, 50, y, { align: 'center' })
  y += 60

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i]
    const bookingTravelers = travelers.filter(t => t.booking_id === booking.id)
    
    if (i > 0) {
      doc.addPage()
      y = 50
    }
    
    // Booking Header
    doc.fontSize(16).font('Helvetica-Bold').fillColor(NAVY).text(`BOOKING ${i + 1}: ${booking.booking_id}`, 50, y)
    y += 25
    doc.moveTo(50, y).lineTo(550, y).strokeColor(GOLD).lineWidth(1).stroke()
    y += 15

    y = drawField(doc, 'Tour', booking.tour_name, y)
    y = drawField(doc, 'Location', booking.location, y)
    y = drawField(doc, 'Travel Date', formatDate(booking.travel_date), y)
    y = drawField(doc, 'Booking Date', formatDate(booking.booking_date), y)
    y = drawField(doc, 'Number of Travelers', String(booking.number_of_travelers), y)
    y = drawField(doc, 'Total Amount', formatCurrency(booking.total_amount), y)
    y = drawField(doc, 'Status', booking.status.charAt(0).toUpperCase() + booking.status.slice(1), y)

    // Travelers
    for (let j = 0; j < bookingTravelers.length; j++) {
      const t = bookingTravelers[j]
      const declaration = getDeclarationByTravelerId(t.id)
      const risk_certificate = getRiskCertificateByTravelerId(t.id)
      const guardian = getGuardianByTravelerId(t.id)
      
      y = checkPageBreak(doc, y, 120)
      if (y === 50) { // new page
        doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text(`TRAVELER ${j + 1}: ${t.full_name || 'Unknown'}`, 50, y)
        y += 25
      } else {
        doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(`TRAVELER ${j + 1}: ${t.full_name || 'Unknown'}`, 50, y)
        y += 20
      }
      doc.moveTo(70, y).lineTo(530, y).strokeColor(GOLD).lineWidth(0.5).stroke()
      y += 10

      y = drawField(doc, 'Full Name', t.full_name, y, 70)
      y = drawField(doc, 'DOB', t.date_of_birth ? formatDate(t.date_of_birth) : '—', y, 70)
      y = drawField(doc, 'Age', t.age ? `${t.age} years` : '—', y, 70)
      y = drawField(doc, 'Gender', t.sex || '—', y, 70)
      y = drawField(doc, 'Blood Group', t.blood_group || '—', y, 70)
      y = drawField(doc, 'Contact', t.contact_number || '—', y, 70)
      y = drawField(doc, 'Education', t.education || '—', y, 70)
      y = drawField(doc, 'School/College', t.school_college || '—', y, 70)
      y = drawField(doc, 'Adventure Exp.', t.adventure_experience || '—', y, 70)
      if (t.adventure_experience === 'Yes' && t.adventure_details) {
        y = drawTextBlock(doc, t.adventure_details, y, 70, 400)
      }
      y = drawField(doc, 'Participant Type', t.participant_type || 'Adult', y, 70)
      
      if (declaration) {
        y = drawField(doc, 'Declaration Accepted', declaration.accepted ? 'YES' : 'NO', y, 70)
        y = drawField(doc, 'Declaration Place', declaration.place || '—', y, 70)
        y = drawField(doc, 'Declaration Date', declaration.date ? formatDate(declaration.date) : '—', y, 70)
      }
      
      if (risk_certificate) {
        y = drawField(doc, 'Risk Accepted', risk_certificate.accepted ? 'YES' : 'NO', y, 70)
        y = drawField(doc, 'Risk Place', risk_certificate.place || '—', y, 70)
        y = drawField(doc, 'Risk Date', risk_certificate.date ? formatDate(risk_certificate.date) : '—', y, 70)
      }

      if (t.participant_type === 'Minor' && guardian) {
        y = drawField(doc, 'Guardian Name', guardian.guardian_name || '—', y, 70)
        y = drawField(doc, 'Guardian Contact', guardian.guardian_contact || '—', y, 70)
      }
      
      y += 10
    }
  }

  addPageNumbersAndFooters(doc)
  doc.end()
  
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
}