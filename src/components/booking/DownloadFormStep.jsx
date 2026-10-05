import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Printer, ArrowRight, ArrowLeft, CheckCircle2, FileDown } from 'lucide-react'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'

/* ── Generates the Blank Printable Form matching the physical paper form in the photo ── */
function buildBlankFormHtml(tourTitle = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Alpine Explorers – Blank Application Form</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#000;background:#f5f5f5;padding:20px}
  .page{max-width:720px;margin:0 auto;background:#fff;border:3px double #b91c1c;padding:20px 24px;box-shadow:0 0 10px rgba(0,0,0,0.1)}
  .header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;gap:12px;border-bottom:2px solid #b91c1c;padding-bottom:8px}
  .logo-area{display:flex;align-items:center;gap:12px}
  .logo-box{width:64px;height:64px;background:#b91c1c;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:11px;text-align:center;line-height:1.1;flex-shrink:0;letter-spacing:0.5px}
  .header-brand .name{font-size:24px;font-weight:900;color:#b91c1c;font-family:'Times New Roman',serif;letter-spacing:1.5px}
  .header-brand .tagline{font-size:10px;font-weight:bold;color:#444;text-transform:uppercase;letter-spacing:1px;margin-top:2px}
  .header-contact{font-size:8.5px;text-align:right;line-height:1.5;color:#222;font-weight:500}
  .header-contact strong{color:#b91c1c}
  .form-title-bar{background:#b91c1c;color:#fff;text-align:center;font-weight:bold;font-size:13px;padding:4px;margin:8px 0 12px;letter-spacing:2px;font-family:'Times New Roman',serif}
  .top-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px}
  .form-fields{flex:1}
  .photo-box{width:90px;height:110px;border:1.5px dashed #b91c1c;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:8.5px;text-align:center;color:#666;flex-shrink:0;background:#fafafa}
  .field-row{display:flex;align-items:baseline;margin-bottom:9px;font-size:10.5px}
  .field-label{font-weight:bold;color:#111;text-transform:uppercase;font-size:10px;white-space:nowrap;margin-right:6px}
  .dotted-line{flex:1;border-bottom:1.5px dotted #555;min-height:14px;padding-left:4px;font-size:11px;color:#111}
  .sub-fields{display:flex;gap:12px;margin-bottom:9px}
  .declaration-box{margin:12px 0 10px;padding:6px 8px;border-top:1.5px solid #b91c1c;border-bottom:1.5px solid #b91c1c;text-align:center;font-size:9px;font-weight:bold;line-height:1.5;color:#111}
  .signatures-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px;margin-bottom:10px;font-size:10px}
  .risk-section{border:2px solid #b91c1c;padding:10px 12px;margin-top:10px;background:#fff}
  .risk-title{background:#b91c1c;color:#fff;text-align:center;font-weight:bold;font-size:11px;padding:3px;margin:-10px -12px 8px;letter-spacing:1px}
  .risk-text{font-size:9.5px;line-height:1.6;color:#111;text-align:justify;margin-bottom:12px}
  @media print{
    body{background:#fff;padding:0}
    .page{border:2.5px double #b91c1c;box-shadow:none;padding:15px;max-width:100%;margin:0;break-inside:avoid}
    @page{size:A4 portrait;margin:8mm}
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="logo-area">
      <div class="logo-box">
        <span>ALPINE</span>
        <span style="font-size:8px;font-weight:normal">EXPLORERS</span>
      </div>
      <div class="header-brand">
        <div class="name">ALPINE EXPLORERS</div>
        <div class="tagline">Pioneer in Adventure Tourism</div>
      </div>
    </div>
    <div class="header-contact">
      <strong>Amit Lakhani (Director)</strong> Cel. 94272 20979 / 98252 20979<br/>
      1, Shubh prabha Appt., 28 Karanpara, B/h. Bus station,<br/>
      Rajkot - 360 001. &nbsp;Phone : 0281-222 75 83.<br/>
      E-mail : <strong>alpine_explorers@yahoo.com</strong>
    </div>
  </div>

  <div class="form-title-bar">APPLICATION FORM</div>

  <!-- Top section with photo box -->
  <div class="top-row">
    <div class="form-fields">
      <div class="field-row">
        <span class="field-label">NAME OF COURSE :</span>
        <span class="dotted-line">${tourTitle || ''}</span>
      </div>
      <div class="field-row">
        <span class="field-label">NAME :</span>
        <span class="dotted-line"></span>
      </div>
      <div class="field-row">
        <span class="field-label">ADDRESS :</span>
        <span class="dotted-line"></span>
      </div>
      <div class="field-row">
        <span class="dotted-line" style="margin-left:0">&nbsp;</span>
      </div>
    </div>
    <div class="photo-box">
      <div style="font-weight:bold;margin-bottom:2px">AFFIX</div>
      <div>PASSPORT</div>
      <div>SIZE PHOTO</div>
    </div>
  </div>

  <!-- Details rows -->
  <div class="sub-fields">
    <div class="field-row" style="flex:1.2;margin-bottom:0">
      <span class="field-label">DATE OF BIRTH :</span>
      <span class="dotted-line"></span>
    </div>
    <div class="field-row" style="flex:0.8;margin-bottom:0">
      <span class="field-label">AGE :</span>
      <span class="dotted-line"></span>
    </div>
    <div class="field-row" style="flex:0.8;margin-bottom:0">
      <span class="field-label">SEX (M/F) :</span>
      <span class="dotted-line"></span>
    </div>
  </div>

  <div class="field-row">
    <span class="field-label">BLOOD GROUP :</span>
    <span class="dotted-line"></span>
  </div>

  <div class="field-row">
    <span class="field-label">TEL. / MOBILE (O) :</span>
    <span class="dotted-line" style="flex:1"></span>
    <span class="field-label" style="margin-left:8px">(R) :</span>
    <span class="dotted-line" style="flex:1"></span>
    <span class="field-label" style="margin-left:8px">(M) :</span>
    <span class="dotted-line" style="flex:1"></span>
  </div>

  <div class="field-row">
    <span class="field-label">EDUCATION :</span>
    <span class="dotted-line" style="flex:1"></span>
    <span class="field-label" style="margin-left:8px">SCHOOL / COLLEGE / OFFICE :</span>
    <span class="dotted-line" style="flex:1.5"></span>
  </div>

  <div class="field-row">
    <span class="field-label">SCHOOL / COLLEGE / OFFICE ADDRESS :</span>
    <span class="dotted-line"></span>
  </div>

  <div class="field-row">
    <span class="field-label">TEL. NO. :</span>
    <span class="dotted-line" style="flex:1"></span>
    <span class="field-label" style="margin-left:8px">HOBBIES :</span>
    <span class="dotted-line" style="flex:2"></span>
  </div>

  <div class="field-row">
    <span class="field-label">PREVIOUS EXPERIENCE OF ADVENTURE / CULTURAL ACTIVITIES (IF ANY) :</span>
    <span class="dotted-line" style="flex:0.5">Yes / No</span>
  </div>

  <div class="field-row">
    <span class="field-label">GIVE DETAILS :</span>
    <span class="dotted-line"></span>
  </div>

  <!-- Declaration -->
  <div class="declaration-box">
    IF I AM SELECTED, I AGREE TO ABIDE BY THE RULES &amp; REGULATIONS, THE TERMS AND<br/>
    CONDITIONS OF ADMISSION FOR THE COURSE WHICH I HEREBY AGREE TO ABIDE FULLY.
  </div>

  <div class="signatures-row">
    <div>
      <div><strong>Place :</strong> ........................................</div>
      <div style="margin-top:6px"><strong>Date :</strong> ........................................</div>
    </div>
    <div style="text-align:right">
      <div style="border-top:1px dotted #333;width:180px;display:inline-block;padding-top:3px;text-align:center">
        <strong>Signature of Applicant</strong>
      </div>
      <div style="margin-top:12px;border-top:1px dotted #333;width:210px;display:inline-block;padding-top:3px;text-align:center">
        <strong>Signature of Parent / Guardian</strong>
      </div>
    </div>
  </div>

  <!-- Risk Certificate -->
  <div class="risk-section">
    <div class="risk-title">RISK CERTIFICATE</div>
    <p class="risk-text">
      It is certified that I agree to detail my son / daughter / ward / Mr. Myself
      .......................................................................................................................
      For <strong>${tourTitle || '.......................................................................................................'}</strong>
      course at my own risk and no compensation will be paid to me in case of accident or death
      and I will not hold the CLUB - TRUST or its staff wholly or partially responsible for any mishappening.
    </p>
    <div class="signatures-row" style="margin-top:8px;margin-bottom:0">
      <div>
        <div><strong>Place :</strong> ........................................</div>
        <div style="margin-top:6px"><strong>Date :</strong> ........................................</div>
      </div>
      <div style="text-align:right">
        <div style="border-top:1px dotted #333;width:240px;display:inline-block;padding-top:3px;text-align:center">
          <strong>Signature of Parent / Guardian / Applicant</strong><br/>
          <span style="font-size:8px;color:#555">(In case of minor, signature of parent/guardian is required)</span>
        </div>
      </div>
    </div>
  </div>

</div>
</body>
</html>`
}

/* ── Generates the printable HTML with pre-filled traveler data ── */
function buildFormHtml(traveler, tourTitle, idx) {
  const t = traveler
  const photoSrc = t.photo
    ? (typeof t.photo === 'string' ? t.photo : '')
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Alpine Explorers – Application Form – ${t.fullName || 'Traveler ' + (idx + 1)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#000;background:#f5f5f5;padding:20px}
  .page{max-width:720px;margin:0 auto;background:#fff;border:3px double #b91c1c;padding:20px 24px;box-shadow:0 0 10px rgba(0,0,0,0.1)}
  .header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;gap:12px;border-bottom:2px solid #b91c1c;padding-bottom:8px}
  .logo-area{display:flex;align-items:center;gap:12px}
  .logo-box{width:64px;height:64px;background:#b91c1c;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:11px;text-align:center;line-height:1.1;flex-shrink:0;letter-spacing:0.5px}
  .header-brand .name{font-size:24px;font-weight:900;color:#b91c1c;font-family:'Times New Roman',serif;letter-spacing:1.5px}
  .header-brand .tagline{font-size:10px;font-weight:bold;color:#444;text-transform:uppercase;letter-spacing:1px;margin-top:2px}
  .header-contact{font-size:8.5px;text-align:right;line-height:1.5;color:#222;font-weight:500}
  .header-contact strong{color:#b91c1c}
  .form-title-bar{background:#b91c1c;color:#fff;text-align:center;font-weight:bold;font-size:13px;padding:4px;margin:8px 0 12px;letter-spacing:2px;font-family:'Times New Roman',serif}
  .top-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px}
  .form-fields{flex:1}
  .photo-box{width:90px;height:110px;border:1.5px solid #b91c1c;display:flex;align-items:center;justify-content:center;font-size:8.5px;text-align:center;color:#666;flex-shrink:0;background:#fafafa;overflow:hidden}
  .photo-box img{width:100%;height:100%;object-fit:cover}
  .field-row{display:flex;align-items:baseline;margin-bottom:9px;font-size:10.5px}
  .field-label{font-weight:bold;color:#111;text-transform:uppercase;font-size:10px;white-space:nowrap;margin-right:6px}
  .dotted-line{flex:1;border-bottom:1.5px dotted #555;min-height:14px;padding-left:4px;font-size:11px;color:#111;font-weight:600}
  .sub-fields{display:flex;gap:12px;margin-bottom:9px}
  .declaration-box{margin:12px 0 10px;padding:6px 8px;border-top:1.5px solid #b91c1c;border-bottom:1.5px solid #b91c1c;text-align:center;font-size:9px;font-weight:bold;line-height:1.5;color:#111}
  .signatures-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px;margin-bottom:10px;font-size:10px}
  .sig-img{max-height:30px;max-width:120px;vertical-align:middle}
  .risk-section{border:2px solid #b91c1c;padding:10px 12px;margin-top:10px;background:#fff}
  .risk-title{background:#b91c1c;color:#fff;text-align:center;font-weight:bold;font-size:11px;padding:3px;margin:-10px -12px 8px;letter-spacing:1px}
  .risk-text{font-size:9.5px;line-height:1.6;color:#111;text-align:justify;margin-bottom:12px}
  @media print{
    body{background:#fff;padding:0}
    .page{border:2.5px double #b91c1c;box-shadow:none;padding:15px;max-width:100%;margin:0;break-inside:avoid}
    @page{size:A4 portrait;margin:8mm}
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="logo-area">
      <div class="logo-box">
        <span>ALPINE</span>
        <span style="font-size:8px;font-weight:normal">EXPLORERS</span>
      </div>
      <div class="header-brand">
        <div class="name">ALPINE EXPLORERS</div>
        <div class="tagline">Pioneer in Adventure Tourism</div>
      </div>
    </div>
    <div class="header-contact">
      <strong>Amit Lakhani (Director)</strong> Cel. 94272 20979 / 98252 20979<br/>
      1, Shubh prabha Appt., 28 Karanpara, B/h. Bus station,<br/>
      Rajkot - 360 001. &nbsp;Phone : 0281-222 75 83.<br/>
      E-mail : <strong>alpine_explorers@yahoo.com</strong>
    </div>
  </div>

  <div class="form-title-bar">APPLICATION FORM</div>

  <!-- Top section with photo box -->
  <div class="top-row">
    <div class="form-fields">
      <div class="field-row">
        <span class="field-label">NAME OF COURSE :</span>
        <span class="dotted-line">${t.courseName || tourTitle || ''}</span>
      </div>
      <div class="field-row">
        <span class="field-label">NAME :</span>
        <span class="dotted-line">${t.fullName || ''}</span>
      </div>
      <div class="field-row">
        <span class="field-label">ADDRESS :</span>
        <span class="dotted-line">${t.address || ''}</span>
      </div>
    </div>
    <div class="photo-box">
      ${photoSrc ? '<img src="' + photoSrc + '" alt="Photo"/>' : 'PHOTOGRAPH'}
    </div>
  </div>

  <!-- Details rows -->
  <div class="sub-fields">
    <div class="field-row" style="flex:1.2;margin-bottom:0">
      <span class="field-label">DATE OF BIRTH :</span>
      <span class="dotted-line">${t.dob || ''}</span>
    </div>
    <div class="field-row" style="flex:0.8;margin-bottom:0">
      <span class="field-label">AGE :</span>
      <span class="dotted-line">${t.age || ''}</span>
    </div>
    <div class="field-row" style="flex:0.8;margin-bottom:0">
      <span class="field-label">SEX (M/F) :</span>
      <span class="dotted-line">${t.sex || ''}</span>
    </div>
  </div>

  <div class="field-row">
    <span class="field-label">BLOOD GROUP :</span>
    <span class="dotted-line">${t.bloodGroup || ''}</span>
  </div>

  <div class="field-row">
    <span class="field-label">TEL. / MOBILE (O) :</span>
    <span class="dotted-line" style="flex:1">${t.contact || ''}</span>
    <span class="field-label" style="margin-left:8px">(R) :</span>
    <span class="dotted-line" style="flex:1"></span>
    <span class="field-label" style="margin-left:8px">(M) :</span>
    <span class="dotted-line" style="flex:1"></span>
  </div>

  <div class="field-row">
    <span class="field-label">EDUCATION :</span>
    <span class="dotted-line" style="flex:1">${t.education || ''}</span>
    <span class="field-label" style="margin-left:8px">SCHOOL / COLLEGE / OFFICE :</span>
    <span class="dotted-line" style="flex:1.5">${t.school || ''}</span>
  </div>

  <div class="field-row">
    <span class="field-label">SCHOOL / COLLEGE / OFFICE ADDRESS :</span>
    <span class="dotted-line">${t.schoolAddress || ''}</span>
  </div>

  <div class="field-row">
    <span class="field-label">TEL. NO. :</span>
    <span class="dotted-line" style="flex:1">${t.schoolPhone || ''}</span>
    <span class="field-label" style="margin-left:8px">HOBBIES :</span>
    <span class="dotted-line" style="flex:2">${t.hobbies || ''}</span>
  </div>

  <div class="field-row">
    <span class="field-label">PREVIOUS EXPERIENCE OF ADVENTURE / CULTURAL ACTIVITIES (IF ANY) :</span>
    <span class="dotted-line" style="flex:0.5">${t.experienceYesNo || 'No'}</span>
  </div>

  <div class="field-row">
    <span class="field-label">GIVE DETAILS :</span>
    <span class="dotted-line">${t.experienceDetails || ''}</span>
  </div>

  <!-- Declaration -->
  <div class="declaration-box">
    IF I AM SELECTED, I AGREE TO ABIDE BY THE RULES &amp; REGULATIONS, THE TERMS AND<br/>
    CONDITIONS OF ADMISSION FOR THE COURSE WHICH I HEREBY AGREE TO ABIDE FULLY.
  </div>

  <div class="signatures-row">
    <div>
      <div><strong>Place :</strong> ${t.sigPlace || '........................................'}</div>
      <div style="margin-top:6px"><strong>Date :</strong> ${t.sigDate || '........................................'}</div>
    </div>
    <div style="text-align:right">
      <div style="border-top:1px dotted #333;width:180px;display:inline-block;padding-top:3px;text-align:center">
        ${t.signature ? '<img class="sig-img" src="' + t.signature + '" alt="sig"/><br/>' : ''}
        <strong>Signature of Applicant</strong>
      </div>
      <div style="margin-top:8px;border-top:1px dotted #333;width:210px;display:inline-block;padding-top:3px;text-align:center">
        ${t.sigGuardian ? '<img class="sig-img" src="' + t.sigGuardian + '" alt="guardian-sig"/><br/>' : ''}
        <strong>Signature of Parent / Guardian</strong>
      </div>
    </div>
  </div>

  <!-- Risk Certificate -->
  <div class="risk-section">
    <div class="risk-title">RISK CERTIFICATE</div>
    <p class="risk-text">
      It is certified that I agree to detail my son / daughter / ward / Mr. Myself
      <strong>${t.riskParticipantName || t.fullName || '.......................................................................................'}</strong>
      For <strong>${t.riskCourseName || tourTitle || '.......................................................................................'}</strong>
      course at my own risk and no compensation will be paid to me in case of accident or death
      and I will not hold the CLUB - TRUST or its staff wholly or partially responsible for any mishappening.
    </p>
    <div class="signatures-row" style="margin-top:8px;margin-bottom:0">
      <div>
        <div><strong>Place :</strong> ${t.riskPlace || '........................................'}</div>
        <div style="margin-top:6px"><strong>Date :</strong> ${t.riskDate || '........................................'}</div>
      </div>
      <div style="text-align:right">
        <div style="border-top:1px dotted #333;width:240px;display:inline-block;padding-top:3px;text-align:center">
          ${t.riskSignature ? '<img class="sig-img" src="' + t.riskSignature + '" alt="risk-sig"/><br/>' : ''}
          <strong>Signature of Parent / Guardian / Applicant</strong><br/>
          <span style="font-size:8px;color:#555">(In case of minor, signature of parent/guardian is required)</span>
        </div>
      </div>
    </div>
  </div>

</div>
</body>
</html>`
}

export default function DownloadFormStep({ travelers, tour, onBack, onNext }) {
  const [downloadedBlank, setDownloadedBlank] = useState(false)
  const [downloadedPreFilled, setDownloadedPreFilled] = useState([])
  const [activeTab, setActiveTab] = useState('blank') // 'blank' | 'prefilled'

  const downloadBlankForm = () => {
    const html = buildBlankFormHtml(tour?.title || '')
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AlpineExplorers_Blank_Application_Form.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadedBlank(true)
  }

  const printBlankForm = () => {
    const html = buildBlankFormHtml(tour?.title || '')
    const win = window.open('', '_blank', 'width=840,height=950')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
    setDownloadedBlank(true)
  }

  const downloadPreFilledForm = (traveler, idx) => {
    const html = buildFormHtml(traveler, tour?.title || '', idx)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AlpineExplorers_Form_${(traveler.fullName || `Traveler${idx + 1}`).replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadedPreFilled((prev) => [...new Set([...prev, idx])])
  }

  const printPreFilledForm = (traveler, idx) => {
    const html = buildFormHtml(traveler, tour?.title || '', idx)
    const win = window.open('', '_blank', 'width=840,height=950')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
    setDownloadedPreFilled((prev) => [...new Set([...prev, idx])])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
          style={{ background: `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid))` }}
        >
          <FileDown size={30} style={{ color: GOLD }} />
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
          Download Application Form
        </h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Download or print the official Alpine Explorers Application Form. Fill &amp; sign it by hand, then submit the scanned copy as a PDF in the next step.
        </p>
      </div>

      {/* 4-Step Instructions banner */}
      <div
        className="rounded-2xl p-4 sm:p-5 border shadow-sm"
        style={{ backgroundColor: `${GOLD}08`, borderColor: `${GOLD}35` }}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0">📋</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm mb-2" style={{ color: NAVY }}>
              How to Complete &amp; Submit Your Physical Form:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60 flex gap-2">
                <span className="font-bold text-amber-700">1.</span>
                <span><strong>Download / Print</strong> the official Blank Form below</span>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60 flex gap-2">
                <span className="font-bold text-amber-700">2.</span>
                <span><strong>Fill in details</strong> and affix passport-size photograph</span>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60 flex gap-2">
                <span className="font-bold text-amber-700">3.</span>
                <span><strong>Put physical signatures</strong> on applicant &amp; risk certificate</span>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60 flex gap-2">
                <span className="font-bold text-amber-700">4.</span>
                <span><strong>Scan as PDF</strong> and upload in Step 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher: Blank Form vs Pre-Filled */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('blank')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'blank'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            style={activeTab === 'blank' ? { color: NAVY } : {}}
          >
            📄 Official Blank Form (Recommended)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prefilled')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'prefilled'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            style={activeTab === 'prefilled' ? { color: NAVY } : {}}
          >
            ✍️ Pre-Filled Form ({travelers.length})
          </button>
        </div>
      </div>

      {/* TAB 1: BLANK APPLICATION FORM */}
      {activeTab === 'blank' && (
        <div className="bg-white rounded-2xl p-6 border shadow-md" style={{ borderColor: `${GOLD}50` }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-inner"
                style={{ background: 'linear-gradient(135deg, #b91c1c, #991b1b)' }}
              >
                <FileText size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base" style={{ color: NAVY }}>
                    Alpine Explorers Official Blank Application Form
                  </h3>
                  <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    Physical Paper Layout
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
                  Ready-to-print A4 application form with authentic red border, logo, photograph space, traveler declarations, and the Risk Certificate section.
                </p>
                {tour?.title && (
                  <p className="text-xs font-semibold text-gray-700 mt-1.5">
                    Course: <span style={{ color: NAVY }}>{tour.title}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={printBlankForm}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition border shadow-sm cursor-pointer hover:bg-gray-50"
                style={{ color: NAVY, borderColor: `${NAVY}35`, backgroundColor: '#fff' }}
              >
                <Printer size={15} /> Print / Save as PDF
              </button>
              <button
                type="button"
                onClick={downloadBlankForm}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white transition shadow-lg cursor-pointer"
                style={{
                  background: downloadedBlank
                    ? 'linear-gradient(135deg, #059669, #047857)'
                    : 'linear-gradient(135deg, #b91c1c, #991b1b)',
                }}
              >
                <Download size={15} />
                {downloadedBlank ? 'Downloaded ✓' : 'Download Blank Form'}
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Standard A4 Size • Red Border Print Layout</span>
            <span>Tip: Select <em>"Save as PDF"</em> in the print dialog if you want a digital blank PDF</span>
          </div>
        </div>
      )}

      {/* TAB 2: PRE-FILLED FORMS */}
      {activeTab === 'prefilled' && (
        <div className="space-y-3">
          {travelers.map((t, idx) => {
            const done = downloadedPreFilled.includes(idx)
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
                style={{ borderColor: done ? `${GOLD}60` : 'rgba(180,160,130,0.25)' }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                    style={{
                      background: done ? `linear-gradient(135deg, ${GOLD}, var(--ae-gold2))` : `${NAVY}10`,
                      color: NAVY,
                    }}
                  >
                    {done ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: NAVY }}>
                      {t.fullName || `Traveler ${idx + 1}`}
                    </p>
                    <p className="text-xs text-gray-500">{t.courseName || tour?.title || ''}</p>
                  </div>
                  {done && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full ml-auto sm:ml-0 shrink-0">
                      ✓ Downloaded
                    </span>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => printPreFilledForm(t, idx)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer hover:bg-gray-50"
                    style={{ color: NAVY, borderColor: `${NAVY}25`, backgroundColor: `${NAVY}05` }}
                  >
                    <Printer size={13} /> Print
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadPreFilledForm(t, idx)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-md cursor-pointer"
                    style={{
                      background: done
                        ? `linear-gradient(135deg, #059669, #047857)`
                        : `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid))`,
                    }}
                  >
                    <Download size={13} />
                    {done ? 'Re-Download' : 'Download Form'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer bg-white border hover:bg-gray-50"
          style={{ color: NAVY, borderColor: '#e2e8f0' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm transition cursor-pointer shadow-lg"
          style={{ background: `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid))` }}
        >
          Proceed to Upload Scanned PDF <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  )
}
