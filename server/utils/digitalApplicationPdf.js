import PDFDocument from 'pdfkit'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RED = '#b91c1c'
const logoPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'alpine_logo.png')

export function generateDigitalApplicationPdf(booking, application, assets = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 24, bottom: 24, left: 28, right: 28 }, autoFirstPage: true })
    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('error', reject)
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    const pageW = 595.28, pageH = 841.89, left = 34, right = pageW - 34
    doc.rect(18, 18, pageW - 36, pageH - 36).lineWidth(2).strokeColor(RED).stroke()
    doc.rect(22, 22, pageW - 44, pageH - 44).lineWidth(.5).strokeColor(RED).stroke()
    if (fs.existsSync(logoPath)) { try { doc.image(logoPath, left + 12, 31, { fit: [42, 42] }) } catch {} }
    doc.font('Helvetica-Bold').fontSize(15).fillColor(RED).text('ALPINE EXPLORERS', left, 32, { width: 330, align: 'center' })
    doc.font('Helvetica').fontSize(7).fillColor('#111827').text('Amit Lakhani (Director) Cel. 94272 20979', left, 52, { width: 330, align: 'center' })
    doc.text('1, Shubh prabha Appt. 28 Karanpara, B/h. Bus station, Rajkot - 360 001. Phone : 0281-222 75 83, E-mail : alpine_explorers@yahoo.com', left + 8, 64, { width: 314, align: 'center' })
    if (assets.photo) { try { doc.image(assets.photo, right - 95, 34, { fit: [82, 90] }) } catch {} }
    doc.rect(right - 98, 31, 88, 96).lineWidth(.7).strokeColor(RED).stroke()
    doc.font('Helvetica-Bold').fontSize(10).fillColor(RED).text('APPLICATION FORM', left, 102, { width: 330, align: 'center' })
    let y = 137
    const values = [
      ['NAME OF COURSE', application.course_name], ['NAME', application.full_name],
      ['DATE OF BIRTH / AGE / SEX : M/F', `${application.date_of_birth || '—'} / ${application.age || '—'} / ${application.sex || '—'}`],
      ['BLOOD GROUP', application.blood_group], ['ADDRESS', application.address], ['CONTACT No.', application.contact_no],
      ['EDUCATION', application.education], ['SCHOOL / COLLEGE', application.school_college],
      ['SCHOOL / COLLEGE ADDRESS', application.school_college_address], ['SCHOOL/COLLEGE PHONE No.', application.school_college_phone],
      ['HOBBIES', application.hobbies], ['Do you have any experience of any Adventures of Cultural Activities ? Yes / No.', `${application.adventure_experience ? 'Yes' : 'No'}${application.adventure_details ? ` — ${application.adventure_details}` : ''}`],
    ]
    const rowH = 31, gap = 3, colW = (right - left - 10) / 2
    let overflowMessage = ''
    values.forEach(([label, value], i) => {
      const col = i % 2, row = Math.floor(i / 2), x = left + col * (colW + 10), yy = y + row * (rowH + gap)
      doc.rect(x, yy, colW, rowH).lineWidth(.35).strokeColor('#b8b8b8').stroke()
      doc.font('Helvetica-Bold').fontSize(6).fillColor(RED).text(label, x + 4, yy + 3, { width: colW - 8, height: 7, ellipsis: true })
      const valueText = String(value || '—')
      doc.font('Helvetica').fontSize(6.4).fillColor('#111827')
      const valueHeight = doc.heightOfString(valueText, { width: colW - 8, lineGap: 0 })
      if (valueHeight > 17) { overflowMessage = `The ${label} value is too long to fit legibly on one A4 page.`; return }
      doc.text(valueText, x + 4, yy + 12, { width: colW - 8, height: 17, lineGap: 0 })
    })
    if (overflowMessage) { doc.end(); return reject(new Error(overflowMessage)) }
    y += Math.ceil(values.length / 2) * (rowH + gap) + 8
    const section = (title, text, height) => {
      doc.rect(left, y, right - left, height).lineWidth(.6).strokeColor(RED).stroke()
      doc.rect(left, y, right - left, 15).fillAndStroke(RED, RED)
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#fff').text(title, left + 4, y + 3)
      doc.font('Helvetica').fontSize(7).fillColor('#111827')
      if (doc.heightOfString(text || '', { width: right - left - 16, lineGap: 1 }) > height - 27) { overflowMessage = `The ${title} text is too long to fit legibly on one A4 page.`; return }
      doc.text(text || '', left + 8, y + 21, { width: right - left - 16, height: height - 27, lineGap: 1 })
      y += height + 5
    }
    section('Give Details', application.adventure_details || '', 38)
    if (overflowMessage) { doc.end(); return reject(new Error(overflowMessage)) }
    section('IF I SELECTED, I AGREE TO ABIDE BY THE RULES & REGULATIONS, THE TERMS AND CONDITIONS OF ADMISSION FOR THE COURSE WHICH I HEREBY AGREE TO ABIDE FULLY', application.declaration_accepted ? 'Accepted' : '', 50)
    if (overflowMessage) { doc.end(); return reject(new Error(overflowMessage)) }
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#111827').text(`PLACE: ${application.declaration_place || ''}     DATE: ${application.declaration_date || ''}`, left + 4, y + 2)
    if (assets.signature) { try { doc.image(assets.signature, right - 126, y - 2, { fit: [110, 24] }) } catch {} }
    doc.moveTo(right - 135, y + 25).lineTo(right - 8, y + 25).strokeColor('#666').lineWidth(.5).stroke()
    doc.fontSize(6).text("Applicant's signature", right - 135, y + 27, { width: 127, align: 'center' })
    y += 42
    section('RISK CERTIFICATE', `It is certified that I agree to detail my son / daughter / ward / Mr. Myself ${application.risk_participant_name || application.full_name || '____________________'} For ${application.risk_course_name || application.course_name || '____________________'} course at my own risk and no compensation will be paid to me in case of accident or death and I will not hold the CLUB - TRUST or its staff wholly or partially responsible for any mishappening.`, 83)
    if (overflowMessage) { doc.end(); return reject(new Error(overflowMessage)) }
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#111827').text(`PLACE: ${application.risk_place || ''}     DATE: ${application.risk_date || ''}`, left + 4, y + 2)
    if (assets.guardianSignature) { try { doc.image(assets.guardianSignature, right - 126, y - 2, { fit: [110, 24] }) } catch {} }
    doc.moveTo(right - 150, y + 25).lineTo(right - 8, y + 25).strokeColor('#666').lineWidth(.5).stroke()
    doc.fontSize(6).text('Signature parents/guardian/applicant (If applier minor)', right - 155, y + 27, { width: 152, align: 'center' })
    if (y + 46 > pageH - 28) { doc.end(); return reject(new Error('Application content exceeds one A4 page. Shorten long fields before exporting.')) }
    doc.end()
  })
}
