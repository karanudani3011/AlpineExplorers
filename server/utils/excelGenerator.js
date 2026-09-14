import ExcelJS from 'exceljs'
import { db, getBookingById, getTravelersByBookingId, getDeclarationByTravelerId, getRiskCertificateByTravelerId, getGuardianByTravelerId, getAllBookingsForExport, getAllTravelersForExport, getTravelerById } from '../db.js'

const NAVY = '#001a4d'
const GOLD = '#c59b27'

function formatCurrency(amount) {
  if (!amount) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function styleHeaderRow(row) {
  row.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF001A4D' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  })
}

function styleDataCell(cell, isHeader = false) {
  cell.font = { size: 10 }
  cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
  cell.border = {
    top: { style: 'thin', color: { argb: 'FFB4A082' } },
    bottom: { style: 'thin', color: { argb: 'FFB4A082' } },
    left: { style: 'thin', color: { argb: 'FFB4A082' } },
    right: { style: 'thin', color: { argb: 'FFB4A082' } }
  }
}

function addSectionHeader(worksheet, rowNum, title, colSpan) {
  const row = worksheet.getRow(rowNum)
  row.height = 25
  const cell = row.getCell(1)
  cell.value = title
  cell.font = { bold: true, color: { argb: 'FFC59B27' }, size: 12 }
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5ECD8' } }
  cell.alignment = { horizontal: 'left', vertical: 'middle' }
  worksheet.mergeCells(rowNum, 1, rowNum, colSpan)
  return rowNum + 1
}

function addFieldRow(worksheet, rowNum, label, value, labelCol = 1, valueCol = 2) {
  const row = worksheet.getRow(rowNum)
  row.height = 22
  const labelCell = row.getCell(labelCol)
  labelCell.value = label
  labelCell.font = { bold: true, size: 10, color: { argb: 'FF3A2A18' } }
  labelCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
  
  const valueCell = row.getCell(valueCol)
  valueCell.value = value || '—'
  valueCell.font = { size: 10, color: { argb: 'FF001A4D' } }
  valueCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
  
  return rowNum + 1
}

function styleFieldRows(worksheet, startRow, endRow, labelCol = 1, valueCol = 2) {
  for (let r = startRow; r <= endRow; r++) {
    const row = worksheet.getRow(r)
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFB4A082' } },
        bottom: { style: 'thin', color: { argb: 'FFB4A082' } },
        left: { style: 'thin', color: { argb: 'FFB4A082' } },
        right: { style: 'thin', color: { argb: 'FFB4A082' } }
      }
    })
  }
}

export async function generateBookingExcel(bookingId) {
  const booking = getBookingById(bookingId)
  if (!booking) throw new Error('Booking not found')
  
  const travelers = getTravelersByBookingId(booking.id)
  const travelersWithDetails = travelers.map(t => ({
    ...t,
    declaration: getDeclarationByTravelerId(t.id),
    risk_certificate: getRiskCertificateByTravelerId(t.id),
    guardian: getGuardianByTravelerId(t.id)
  }))

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Alpine Explorers'
  workbook.created = new Date()

  // Sheet 1: Booking Summary
  const sheet1 = workbook.addWorksheet('Booking Summary', { properties: { tabColor: { argb: 'FFC59B27' } } })
  sheet1.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 60 }
  ]

  const bookingFields = [
    ['Booking ID', booking.booking_id],
    ['Tour', booking.tour_name],
    ['Tour Category', booking.tour_category],
    ['Location', booking.location],
    ['Duration', booking.duration],
    ['Travel Date', formatDate(booking.travel_date)],
    ['Booking Date', formatDate(booking.booking_date)],
    ['Price Per Person', formatCurrency(booking.price_per_person)],
    ['Number of Travelers', booking.number_of_travelers],
    ['Total Amount', formatCurrency(booking.total_amount)],
    ['Status', booking.status.charAt(0).toUpperCase() + booking.status.slice(1)],
    ['Contact Name', booking.booking_contact_name || '—'],
    ['Contact Email', booking.booking_contact_email || '—'],
    ['Contact Phone', booking.booking_contact_phone || '—'],
  ]

  bookingFields.forEach(([field, value], i) => {
    const row = sheet1.addRow({ field, value })
    if (i === 0) {
      row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
      row.getCell(2).font = { bold: true, color: { argb: 'FFC59B27' } }
    }
    styleDataCell(row.getCell(1))
    styleDataCell(row.getCell(2))
  })

  styleHeaderRow(sheet1.getRow(1))

  // Sheet 2: Travelers
  const sheet2 = workbook.addWorksheet('Travelers', { properties: { tabColor: { argb: 'FF15803D' } } })
  sheet2.columns = [
    { header: 'Traveler #', key: 'num', width: 12 },
    { header: 'Full Name', key: 'name', width: 25 },
    { header: 'DOB', key: 'dob', width: 18 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'Gender', key: 'gender', width: 12 },
    { header: 'Blood Group', key: 'blood', width: 14 },
    { header: 'Contact', key: 'contact', width: 18 },
    { header: 'Address', key: 'address', width: 35 },
    { header: 'Education', key: 'education', width: 25 },
    { header: 'School/College', key: 'school', width: 25 },
    { header: 'School Address', key: 'schoolAddr', width: 30 },
    { header: 'School Phone', key: 'schoolPhone', width: 18 },
    { header: 'Hobbies', key: 'hobbies', width: 25 },
    { header: 'Adventure Exp.', key: 'advExp', width: 15 },
    { header: 'Adventure Details', key: 'advDetails', width: 40 },
    { header: 'Participant Type', key: 'pType', width: 18 },
  ]

  travelersWithDetails.forEach((t, i) => {
    const row = sheet2.addRow({
      num: i + 1,
      name: t.full_name,
      dob: t.date_of_birth ? formatDate(t.date_of_birth) : '—',
      age: t.age ? `${t.age} years` : '—',
      gender: t.sex || '—',
      blood: t.blood_group || '—',
      contact: t.contact_number || '—',
      address: t.address || '—',
      education: t.education || '—',
      school: t.school_college || '—',
      schoolAddr: t.school_college_address || '—',
      schoolPhone: t.school_college_phone || '—',
      hobbies: t.hobbies || '—',
      advExp: t.adventure_experience || '—',
      advDetails: t.adventure_details || '—',
      pType: t.participant_type || 'Adult'
    })
    row.eachCell(styleDataCell)
  })

  styleHeaderRow(sheet2.getRow(1))
  sheet2.views = [{ state: 'frozen', ySplit: 1 }]

  // Sheet 3: Declarations
  const sheet3 = workbook.addWorksheet('Declarations', { properties: { tabColor: { argb: 'FF8B2518' } } })
  sheet3.columns = [
    { header: 'Traveler #', key: 'num', width: 12 },
    { header: 'Full Name', key: 'name', width: 25 },
    { header: 'Accepted', key: 'accepted', width: 12 },
    { header: 'Place', key: 'place', width: 20 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Signature', key: 'signature', width: 30 },
    { header: 'Accepted At', key: 'acceptedAt', width: 22 }
  ]

  travelersWithDetails.forEach((t, i) => {
    const d = t.declaration
    const row = sheet3.addRow({
      num: i + 1,
      name: t.full_name,
      accepted: d?.accepted ? 'YES' : 'NO',
      place: d?.place || '—',
      date: d?.date ? formatDate(d.date) : '—',
      signature: d?.signature_url ? 'Available' : '—',
      acceptedAt: d?.accepted_at ? formatDate(d.accepted_at) : '—'
    })
    row.eachCell(styleDataCell)
  })

  styleHeaderRow(sheet3.getRow(1))
  sheet3.views = [{ state: 'frozen', ySplit: 1 }]

  // Sheet 4: Risk Certificates
  const sheet4 = workbook.addWorksheet('Risk Certificates', { properties: { tabColor: { argb: 'FF7C2D12' } } })
  sheet4.columns = [
    { header: 'Traveler #', key: 'num', width: 12 },
    { header: 'Full Name', key: 'name', width: 25 },
    { header: 'Participant Name', key: 'pName', width: 25 },
    { header: 'Course Name', key: 'cName', width: 30 },
    { header: 'Accepted', key: 'accepted', width: 12 },
    { header: 'Place', key: 'place', width: 20 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Signature', key: 'signature', width: 30 },
    { header: 'Accepted At', key: 'acceptedAt', width: 22 }
  ]

  travelersWithDetails.forEach((t, i) => {
    const r = t.risk_certificate
    const row = sheet4.addRow({
      num: i + 1,
      name: t.full_name,
      pName: r?.participant_name || '—',
      cName: r?.course_name || '—',
      accepted: r?.accepted ? 'YES' : 'NO',
      place: r?.place || '—',
      date: r?.date ? formatDate(r.date) : '—',
      signature: r?.signature_url ? 'Available' : '—',
      acceptedAt: r?.accepted_at ? formatDate(r.accepted_at) : '—'
    })
    row.eachCell(styleDataCell)
  })

  styleHeaderRow(sheet4.getRow(1))
  sheet4.views = [{ state: 'frozen', ySplit: 1 }]

  // Sheet 5: Guardians
  const sheet5 = workbook.addWorksheet('Guardians', { properties: { tabColor: { argb: 'FFB45309' } } })
  sheet5.columns = [
    { header: 'Traveler #', key: 'num', width: 12 },
    { header: 'Full Name', key: 'name', width: 25 },
    { header: 'Guardian Name', key: 'gName', width: 25 },
    { header: 'Guardian Contact', key: 'gContact', width: 20 },
    { header: 'Guardian Signature', key: 'gSignature', width: 30 }
  ]

  travelersWithDetails.forEach((t, i) => {
    if (t.participant_type === 'Minor' && t.guardian) {
      const g = t.guardian
      const row = sheet5.addRow({
        num: i + 1,
        name: t.full_name,
        gName: g.guardian_name || '—',
        gContact: g.guardian_contact || '—',
        gSignature: g.guardian_signature_url ? 'Available' : '—'
      })
      row.eachCell(styleDataCell)
    }
  })

  styleHeaderRow(sheet5.getRow(1))
  sheet5.views = [{ state: 'frozen', ySplit: 1 }]

  return workbook.xlsx.writeBuffer()
}

export async function generateIndividualTravelerExcel(travelerId) {
  const traveler = getTravelerById(travelerId)
  if (!traveler) throw new Error('Traveler not found')
  
  const declaration = getDeclarationByTravelerId(traveler.id)
  const risk_certificate = getRiskCertificateByTravelerId(traveler.id)
  const guardian = getGuardianByTravelerId(traveler.id)
  const booking = getBookingById(traveler.booking_id)

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Alpine Explorers'
  workbook.created = new Date()

  // Sheet 1: Booking Info
  const sheet1 = workbook.addWorksheet('Booking Info', { properties: { tabColor: { argb: 'FF001A4D' } } })
  sheet1.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 60 }
  ]

  const bookingFields = [
    ['Booking ID', booking?.booking_id || '—'],
    ['Tour', booking?.tour_name || '—'],
    ['Tour Category', booking?.tour_category || '—'],
    ['Location', booking?.location || '—'],
    ['Travel Date', booking?.travel_date ? formatDate(booking.travel_date) : '—'],
    ['Booking Date', booking?.booking_date ? formatDate(booking.booking_date) : '—'],
    ['Total Amount', booking?.total_amount ? formatCurrency(booking.total_amount) : '—'],
    ['Status', booking?.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : '—'],
  ]

  bookingFields.forEach(([field, value], i) => {
    const row = sheet1.addRow({ field, value })
    if (i === 0) {
      row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
      row.getCell(2).font = { bold: true, color: { argb: 'FFC59B27' } }
    }
    styleDataCell(row.getCell(1))
    styleDataCell(row.getCell(2))
  })

  styleHeaderRow(sheet1.getRow(1))

  // Sheet 2: Personal Info
  const sheet2 = workbook.addWorksheet('Personal Info', { properties: { tabColor: { argb: 'FF15803D' } } })
  sheet2.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 60 }
  ]

  const personalFields = [
    ['Full Name', traveler.full_name],
    ['Date of Birth', traveler.date_of_birth ? formatDate(traveler.date_of_birth) : '—'],
    ['Age', traveler.age ? `${traveler.age} years` : '—'],
    ['Gender', traveler.sex || '—'],
    ['Blood Group', traveler.blood_group || '—'],
    ['Contact Number', traveler.contact_number || '—'],
    ['Address', traveler.address || '—'],
  ]

  personalFields.forEach(([field, value], i) => {
    const row = sheet2.addRow({ field, value })
    if (i === 0) {
      row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
    }
    styleDataCell(row.getCell(1))
    styleDataCell(row.getCell(2))
  })

  styleHeaderRow(sheet2.getRow(1))

  // Sheet 3: Education & Activities
  const sheet3 = workbook.addWorksheet('Education & Activities', { properties: { tabColor: { argb: 'FF7C3AED' } } })
  sheet3.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 80 }
  ]

  const eduFields = [
    ['Education', traveler.education || '—'],
    ['School / College', traveler.school_college || '—'],
    ['School / College Address', traveler.school_college_address || '—'],
    ['School / College Phone', traveler.school_college_phone || '—'],
    ['Hobbies', traveler.hobbies || '—'],
    ['Adventure Experience', traveler.adventure_experience || '—'],
    ['Adventure Details', traveler.adventure_details || '—'],
  ]

  eduFields.forEach(([field, value], i) => {
    const row = sheet3.addRow({ field, value })
    if (i === 0) {
      row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
    }
    styleDataCell(row.getCell(1))
    styleDataCell(row.getCell(2))
  })

  styleHeaderRow(sheet3.getRow(1))

  // Sheet 4: Declaration
  const sheet4 = workbook.addWorksheet('Declaration', { properties: { tabColor: { argb: 'FF8B2518' } } })
  sheet4.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 60 }
  ]

  const declFields = [
    ['Terms & Conditions Accepted', declaration?.accepted ? 'YES' : 'NO'],
    ['Place', declaration?.place || '—'],
    ['Date', declaration?.date ? formatDate(declaration.date) : '—'],
    ['Signature', declaration?.signature_url ? 'Available' : '—'],
    ['Accepted At', declaration?.accepted_at ? formatDate(declaration.accepted_at) : '—'],
  ]

  declFields.forEach(([field, value], i) => {
    const row = sheet4.addRow({ field, value })
    if (i === 0) {
      row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
    }
    styleDataCell(row.getCell(1))
    styleDataCell(row.getCell(2))
  })

  styleHeaderRow(sheet4.getRow(1))

  // Sheet 5: Risk Certificate
  const sheet5 = workbook.addWorksheet('Risk Certificate', { properties: { tabColor: { argb: 'FF7C2D12' } } })
  sheet5.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 60 }
  ]

  const riskFields = [
    ['Participant Name', risk_certificate?.participant_name || '—'],
    ['Course Name', risk_certificate?.course_name || '—'],
    ['Risk Accepted', risk_certificate?.accepted ? 'YES' : 'NO'],
    ['Place', risk_certificate?.place || '—'],
    ['Date', risk_certificate?.date ? formatDate(risk_certificate.date) : '—'],
    ['Signature', risk_certificate?.signature_url ? 'Available' : '—'],
    ['Accepted At', risk_certificate?.accepted_at ? formatDate(risk_certificate.accepted_at) : '—'],
  ]

  riskFields.forEach(([field, value], i) => {
    const row = sheet5.addRow({ field, value })
    if (i === 0) {
      row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
    }
    styleDataCell(row.getCell(1))
    styleDataCell(row.getCell(2))
  })

  styleHeaderRow(sheet5.getRow(1))

  // Sheet 6: Guardian (if minor)
  if (traveler.participant_type === 'Minor' && guardian) {
    const sheet6 = workbook.addWorksheet('Guardian', { properties: { tabColor: { argb: 'FFB45309' } } })
    sheet6.columns = [
      { header: 'Field', key: 'field', width: 30 },
      { header: 'Value', key: 'value', width: 60 }
    ]

    const guardFields = [
      ['Guardian Name', guardian.guardian_name || '—'],
      ['Guardian Contact', guardian.guardian_contact || '—'],
      ['Guardian Signature', guardian.guardian_signature_url ? 'Available' : '—'],
    ]

    guardFields.forEach(([field, value], i) => {
      const row = sheet6.addRow({ field, value })
      if (i === 0) {
        row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
      }
      styleDataCell(row.getCell(1))
      styleDataCell(row.getCell(2))
    })

    styleHeaderRow(sheet6.getRow(1))
  }

  return workbook.xlsx.writeBuffer()
}

export async function generateAllBookingsExcel() {
  const bookings = getAllBookingsForExport()
  const travelers = getAllTravelersForExport()

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Alpine Explorers'
  workbook.created = new Date()

  // Sheet 1: Bookings
  const sheet1 = workbook.addWorksheet('Bookings', { properties: { tabColor: { argb: 'FF001A4D' } } })
  sheet1.columns = [
    { header: 'Booking ID', key: 'bookingId', width: 20 },
    { header: 'Booking Date', key: 'bookingDate', width: 18 },
    { header: 'Tour', key: 'tour', width: 35 },
    { header: 'Location', key: 'location', width: 25 },
    { header: 'Travel Date', key: 'travelDate', width: 18 },
    { header: 'Travelers', key: 'travelers', width: 12 },
    { header: 'Price/Person', key: 'price', width: 15 },
    { header: 'Total Amount', key: 'total', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
  ]

  bookings.forEach((b, i) => {
    const row = sheet1.addRow({
      bookingId: b.booking_id,
      bookingDate: formatDate(b.booking_date),
      tour: b.tour_name,
      location: b.location,
      travelDate: formatDate(b.travel_date),
      travelers: b.number_of_travelers,
      price: formatCurrency(b.price_per_person),
      total: formatCurrency(b.total_amount),
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
    })
    if (i === 0) row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
    row.eachCell(styleDataCell)
  })

  styleHeaderRow(sheet1.getRow(1))
  sheet1.views = [{ state: 'frozen', ySplit: 1 }]

  // Sheet 2: Travelers
  const sheet2 = workbook.addWorksheet('Travelers', { properties: { tabColor: { argb: 'FF15803D' } } })
  sheet2.columns = [
    { header: 'Booking ID', key: 'bookingId', width: 20 },
    { header: 'Traveler #', key: 'num', width: 12 },
    { header: 'Full Name', key: 'name', width: 25 },
    { header: 'DOB', key: 'dob', width: 18 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'Gender', key: 'gender', width: 12 },
    { header: 'Blood Group', key: 'blood', width: 14 },
    { header: 'Contact', key: 'contact', width: 18 },
    { header: 'Address', key: 'address', width: 35 },
    { header: 'Education', key: 'education', width: 25 },
    { header: 'School/College', key: 'school', width: 25 },
    { header: 'School Address', key: 'schoolAddr', width: 30 },
    { header: 'School Phone', key: 'schoolPhone', width: 18 },
    { header: 'Hobbies', key: 'hobbies', width: 25 },
    { header: 'Adventure Exp.', key: 'advExp', width: 15 },
    { header: 'Adventure Details', key: 'advDetails', width: 40 },
    { header: 'Participant Type', key: 'pType', width: 18 },
  ]

  travelers.forEach((t, i) => {
    const row = sheet2.addRow({
      bookingId: t.booking_code || t.booking_id,
      num: t.traveler_number,
      name: t.full_name,
      dob: t.date_of_birth ? formatDate(t.date_of_birth) : '—',
      age: t.age ? `${t.age} years` : '—',
      gender: t.sex || '—',
      blood: t.blood_group || '—',
      contact: t.contact_number || '—',
      address: t.address || '—',
      education: t.education || '—',
      school: t.school_college || '—',
      schoolAddr: t.school_college_address || '—',
      schoolPhone: t.school_college_phone || '—',
      hobbies: t.hobbies || '—',
      advExp: t.adventure_experience || '—',
      advDetails: t.adventure_details || '—',
      pType: t.participant_type || 'Adult'
    })
    if (i === 0) row.getCell(1).font = { bold: true, color: { argb: 'FF001A4D' } }
    row.eachCell(styleDataCell)
  })

  styleHeaderRow(sheet2.getRow(1))
  sheet2.views = [{ state: 'frozen', ySplit: 1 }]

  // Sheet 3: Risk Certificates
  const sheet3 = workbook.addWorksheet('Risk Certificates', { properties: { tabColor: { argb: 'FF7C2D12' } } })
  sheet3.columns = [
    { header: 'Booking ID', key: 'bookingId', width: 20 },
    { header: 'Traveler #', key: 'num', width: 12 },
    { header: 'Participant Name', key: 'pName', width: 25 },
    { header: 'Course', key: 'course', width: 30 },
    { header: 'Risk Accepted', key: 'accepted', width: 15 },
    { header: 'Place', key: 'place', width: 20 },
    { header: 'Date', key: 'date', width: 18 },
  ]

  for (const booking of bookings) {
    const bookingTravelers = travelers.filter(t => t.booking_id === booking.id)
    for (const t of bookingTravelers) {
      const risk = getRiskCertificateByTravelerId(t.id)
      if (risk) {
        const row = sheet3.addRow({
          bookingId: booking.booking_id,
          num: t.traveler_number,
          pName: risk.participant_name || '—',
          course: risk.course_name || '—',
          accepted: risk.accepted ? 'YES' : 'NO',
          place: risk.place || '—',
          date: risk.date ? formatDate(risk.date) : '—'
        })
        row.eachCell(styleDataCell)
      }
    }
  }

  styleHeaderRow(sheet3.getRow(1))
  sheet3.views = [{ state: 'frozen', ySplit: 1 }]

  // Sheet 4: Guardians
  const sheet4 = workbook.addWorksheet('Guardians', { properties: { tabColor: { argb: 'FFB45309' } } })
  sheet4.columns = [
    { header: 'Booking ID', key: 'bookingId', width: 20 },
    { header: 'Traveler #', key: 'num', width: 12 },
    { header: 'Guardian Name', key: 'gName', width: 25 },
    { header: 'Guardian Contact', key: 'gContact', width: 20 },
  ]

  for (const booking of bookings) {
    const bookingTravelers = travelers.filter(t => t.booking_id === booking.id)
    for (const t of bookingTravelers) {
      if (t.participant_type === 'Minor') {
        const guardian = getGuardianByTravelerId(t.id)
        if (guardian) {
          const row = sheet4.addRow({
            bookingId: booking.booking_id,
            num: t.traveler_number,
            gName: guardian.guardian_name || '—',
            gContact: guardian.guardian_contact || '—'
          })
          row.eachCell(styleDataCell)
        }
      }
    }
  }

  styleHeaderRow(sheet4.getRow(1))
  sheet4.views = [{ state: 'frozen', ySplit: 1 }]

  return workbook.xlsx.writeBuffer()
}