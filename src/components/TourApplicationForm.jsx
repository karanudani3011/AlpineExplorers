import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'

const RED = '#b3211f'
const INK = '#111111'
const serif = "'Times New Roman', Times, serif"

/* ────────────────────────── Signature pad ────────────────────────── */

function SignaturePad({ label, sub, value, onChange }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (value) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      img.src = value
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (e.clientY - rect.top) * (canvasRef.current.height / rect.height),
    }
  }

  const start = (e) => {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = INK
  }

  const move = (e) => {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange(canvasRef.current.toDataURL('image/png'))
  }

  const clearSig = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onChange('')
  }

  return (
    <div>
      <div className="mb-1">
        <span className="text-[13px] font-bold" style={{ color: INK, fontFamily: serif }}>{label}</span>
        {sub && (
          <span className="text-[12px] ml-2" style={{ color: INK, fontFamily: serif }}>{sub}</span>
        )}
      </div>
      <div className="relative inline-block w-full max-w-sm">
        <canvas
          ref={canvasRef}
          width={420}
          height={110}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="w-full border border-gray-400 bg-white rounded-sm touch-none"
        />
        {!value && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-500 pointer-events-none"
            style={{ fontFamily: serif }}>
            Sign here
          </span>
        )}
        <button
          type="button"
          onClick={clearSig}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-400 text-gray-600 flex items-center justify-center shadow-sm"
          title="Clear signature"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────── Dotted-blank input helpers ────────────────────────── */

const blankBase = {
  border: 'none',
  borderBottom: '1px dotted #555',
  borderRadius: 0,
  backgroundColor: 'transparent',
  padding: '2px 4px',
  fontFamily: serif,
  fontSize: '14px',
  color: INK,
  outline: 'none',
}

function Blank({ value, onChange, className = '', placeholder = '' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex-1 min-w-0 ${className}`}
      style={blankBase}
    />
  )
}

/* ────────────────────────── THE APPLICATION FORM ────────────────────────── */

const ERROR_RED = '#cc0000'

export default function TourApplicationForm({ courseName = '' }) {
  const [f, setF] = useState({
    course: courseName || '',
    name: '',
    dob: '',
    age: '',
    sex: '',
    bloodGroup: '',
    address: '',
    contact: '',
    education: '',
    school: '',
    schoolAddress: '',
    schoolPhone: '',
    hobbies: '',
    experience: '',
    details: '',
    place: '',
    date: '',
    riskName: '',
    riskCourse: '',
    riskPlace: '',
    riskDate: '',
  })
  const [photo, setPhoto] = useState('')
  const [sigApplicant, setSigApplicant] = useState('')
  const [sigGuardian, setSigGuardian] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const photoInput = useRef(null)

  const set = (key) => (e) => {
    let v = e.target.value
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = () => setPhoto(reader.result)
      reader.readAsDataURL(e.target.files[0])
      return
    }
    setF((prev) => ({ ...prev, [key]: v }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'NAME is required'
    if (!f.contact.trim()) er.contact = 'CONTACT No. is required'
    if (!f.sex) er.sex = 'Please select SEX'
    setErrors(er)
    if (Object.keys(er).length > 0) return

    // Save to backend and Supabase
    try {
      const bookingId = `APP-${Date.now()}`
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          tour_name: f.course || courseName || 'Tour Application',
          number_of_travelers: 1,
          booking_contact_name: f.name,
          booking_contact_phone: f.contact,
          travelers: [{
            courseName: f.course || courseName,
            fullName: f.name,
            dob: f.dob,
            age: f.age,
            sex: f.sex,
            bloodGroup: f.bloodGroup,
            address: f.address,
            contact: f.contact,
            education: f.education,
            school: f.school,
            schoolAddress: f.schoolAddress,
            schoolPhone: f.schoolPhone,
            hobbies: f.hobbies,
            photo: photo || null,
            experienceYesNo: f.experience || 'No',
            experienceDetails: f.details,
            signature: sigApplicant || null,
            guardianSignature: sigGuardian || null,
            sigPlace: f.place,
            sigDate: f.date,
            riskParticipantName: f.riskName || f.name,
            riskCourseName: f.riskCourse || f.course || courseName,
            riskPlace: f.riskPlace || f.place,
            riskDate: f.riskDate || f.date,
            riskSignature: sigApplicant || null,
            riskAccepted: true,
            declarationAccepted: true,
          }]
        })
      })
    } catch (err) {
      console.error('Error submitting application form:', err)
    }

    setSubmitted(true)
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  /* Success screen */
  if (submitted) {
    return (
      <div className="bg-white" style={{ fontFamily: serif }}>
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(179,33,31,0.1)', border: '2px dashed ' + RED }}>
            <span className="text-3xl" style={{ color: RED }}>✓</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide" style={{ color: RED }}>
            APPLICATION SUBMITTED SUCCESSFULLY
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: INK }}>
            Thank you, <strong>{f.name.split(' ')[0] || 'Applicant'}</strong>. Your application for the{' '}
            <strong>{f.course || 'course'}</strong> has been received. Our team will contact you at{' '}
            <strong>{f.contact}</strong> shortly.
          </p>
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubmitted(false)}
            className="mt-8 px-8 py-2.5 text-white text-sm font-bold rounded-sm tracking-widest uppercase"
            style={{ backgroundColor: RED, fontFamily: serif }}
          >
            Fill Another Application
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-white" style={{ fontFamily: serif }}>
      {/* Double red frame */}
      <div className="border-2 border-[#b3211f] p-1.5">
        <div className="border border-[#b3211f] px-3 sm:px-5 py-4 sm:py-6">
          {/* ─── Header + Photograph box ─── */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ color: RED }}>
                ALPINE EXPLORERS
              </h1>
              <p className="text-[13px] sm:text-sm mt-1 font-semibold" style={{ color: INK }}>
                Amit Lakhani (Director) Cel. 94272 20979
              </p>
              <p className="text-[12px] sm:text-[13px] mt-2 leading-relaxed" style={{ color: INK }}>
                1, Shubh prabha Appt. 28 Karanpara, B/h. Bus station,<br />
                Rajkot - 360 001. Phone : 0281-222 75 83,<br />
                E-mail : alpine_explorers@yahoo.com
              </p>
            </div>

            {/* Photograph box */}
            <div className="shrink-0 self-center sm:self-start">
              <div className="relative w-28 h-32 border-2 border-dashed border-gray-500 rounded-sm flex flex-col items-center justify-center overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Applicant photograph" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={22} className="text-gray-400 mb-1" />
                    <button
                      type="button"
                      onClick={() => photoInput.current && photoInput.current.click()}
                      className="text-[11px] text-gray-500 underline"
                    >
                      Click to upload
                    </button>
                  </>
                )}
                {photo && (
                  <>
                    <button
                      type="button"
                      onClick={() => photoInput.current && photoInput.current.click()}
                      className="absolute bottom-0 inset-x-0 py-0.5 text-[10px] text-white text-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/80 text-rose-700 flex items-center justify-center shadow-sm"
                      title="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  </>
                )}
                <input ref={photoInput} type="file" accept="image/*" className="hidden" onChange={set('photo')} />
              </div>
              <p className="text-[11px] text-center mt-1 tracking-widest uppercase" style={{ color: RED }}>
                Photograph
              </p>
            </div>
          </div>

          {/* ─── Application heading ─── */}
          <div className="text-center border-y border-[#b3211f] py-1 my-5">
            <h2 className="text-lg sm:text-xl font-bold tracking-[0.3em]" style={{ color: RED }}>
              APPLICATION FORM
            </h2>
          </div>

          {/* ─── Fields ─── */}
          <div className="space-y-4 text-[14px]" style={{ color: INK }}>
            <Field label="NAME OF COURSE :">
              <Blank value={f.course} onChange={set('course')} />
            </Field>

            <Field label="NAME :">
              <Blank value={f.name} onChange={set('name')} />
            </Field>
            {errors.name && <FieldError msg={errors.name} />}

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span style={{ fontFamily: serif }}>DATE OF BIRTH :</span>
              <Blank value={f.dob} onChange={set('dob')} className="w-32 sm:w-36" placeholder="DD/MM/YYYY" />
              <span style={{ fontFamily: serif }}>AGE :</span>
              <Blank value={f.age} onChange={set('age')} className="w-12" />
              <span style={{ fontFamily: serif }}>SEX :</span>
              <label className="inline-flex items-center gap-1 text-[13px]">
                <input type="radio" name="sex" value="M" checked={f.sex === 'M'} onChange={set('sex')}
                  className="accent-[#b3211f]" /> M
              </label>
              <label className="inline-flex items-center gap-1 text-[13px]">
                <input type="radio" name="sex" value="F" checked={f.sex === 'F'} onChange={set('sex')}
                  className="accent-[#b3211f]" /> F
              </label>
            </div>
            {errors.sex && <FieldError msg={errors.sex} />}

            <Field label="BLOOD GROUP :">
              <Blank value={f.bloodGroup} onChange={set('bloodGroup')} placeholder="e.g. B+" />
            </Field>
            {errors.bloodGroup && <FieldError msg={errors.bloodGroup} />}

            <MultiField label="ADDRESS :">
              <Blank value={f.address} onChange={set('address')} />
              <Blank value={f.address2 || ''} onChange={(e) => setF((prev) => ({ ...prev, address2: e.target.value }))} />
            </MultiField>

            <Field label="CONTACT No. :">
              <Blank value={f.contact} onChange={set('contact')} />
            </Field>
            {errors.contact && <FieldError msg={errors.contact} />}

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span style={{ fontFamily: serif }}>EDUCATION :</span>
              <Blank value={f.education} onChange={set('education')} className="w-40 sm:w-52" />
              <span style={{ fontFamily: serif }}>SCHOOL / COLLEGE :</span>
              <Blank value={f.school} onChange={set('school')} className="flex-1 min-w-[140px]" />
            </div>

            <MultiField label="SCHOOL / COLLEGE ADDRESS :">
              <Blank value={f.schoolAddress} onChange={set('schoolAddress')} />
              <Blank value={f.schoolAddress2 || ''} onChange={(e) => setF((prev) => ({ ...prev, schoolAddress2: e.target.value }))} />
            </MultiField>

            <Field label="SCHOOL/COLLEGE PHONE No. :">
              <Blank value={f.schoolPhone} onChange={set('schoolPhone')} />
            </Field>

            <Field label="HOBBIES :">
              <Blank value={f.hobbies} onChange={set('hobbies')} />
            </Field>

            <div className="leading-snug">
              <p style={{ fontFamily: serif }}>
                Do you have any experience of any Adventures of Cultural Activities ? Yes / No.
              </p>
              <div className="flex items-center gap-5 mt-1.5 ml-1">
                <label className="inline-flex items-center gap-1.5 text-[13px]">
                  <input type="radio" name="experience" value="Yes" checked={f.experience === 'Yes'} onChange={set('experience')} className="accent-[#b3211f]" /> Yes
                </label>
                <label className="inline-flex items-center gap-1.5 text-[13px]">
                  <input type="radio" name="experience" value="No" checked={f.experience === 'No'} onChange={set('experience')} className="accent-[#b3211f]" /> No
                </label>
              </div>
            </div>

            <MultiField label="Give Details :">
              <Blank value={f.details} onChange={set('details')} />
              <Blank value={f.details2 || ''} onChange={(e) => setF((prev) => ({ ...prev, details2: e.target.value }))} />
            </MultiField>

            {/* ─── Agreement ─── */}
            <div className="border-y border-[#b3211f] py-3 my-6">
              <p className="text-center text-[13px] sm:text-[14px] font-bold leading-relaxed" style={{ color: RED }}>
                IF I SELECTED, I AGREE TO ABIDE BY THE RULES &amp; REGULATIONS, THE<br />
                TERMS AND CONDITIONS OF ADMISSION FOR THE COURSE WHICH I HEREBY<br />
                AGREE TO ABIDE FULLY
              </p>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <span style={{ fontFamily: serif }}>PLACE :</span>
              <Blank value={f.place} onChange={set('place')} className="w-40" />
              <span style={{ fontFamily: serif }}>DATE :</span>
              <Blank value={f.date} onChange={set('date')} className="w-40" />
            </div>

            <div className="mt-5">
              <SignaturePad label="Applicant's signature" value={sigApplicant} onChange={setSigApplicant} />
            </div>

            {/* ─── Risk Certificate ─── */}
            <div className="text-center border-y border-[#b3211f] py-1 mt-8">
              <h3 className="text-base sm:text-lg font-bold tracking-[0.2em]" style={{ color: RED }}>
                RISK CERTIFICATE
              </h3>
            </div>

            <p className="text-[13px] sm:text-[14px] leading-relaxed" style={{ color: INK }}>
              It is certified that I agree to detail my son / daughter / ward / Mr. Myself{' '}
              <Blank value={f.riskName} onChange={set('riskName')} className="w-36 sm:w-44" />{' '}
              For <Blank value={f.riskCourse} onChange={set('riskCourse')} className="w-32 sm:w-40" />{' '}
              course at my own risk and no compensation will be paid to me in case of accident or death
              and I will not hold the CLUB - TRUST or its staff wholly or partially responsible for any
              mishappening.
            </p>

            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mt-3">
              <span style={{ fontFamily: serif }}>PLACE :</span>
              <Blank value={f.riskPlace} onChange={set('riskPlace')} className="w-40" />
              <span style={{ fontFamily: serif }}>DATE :</span>
              <Blank value={f.riskDate} onChange={set('riskDate')} className="w-40" />
            </div>

            <div className="mt-5">
              <SignaturePad
                label="Signature parents/guardian/applicant"
                sub="(If applier minor)"
                value={sigGuardian}
                onChange={setSigGuardian}
              />
            </div>
          </div>

          {/* ─── Submit ─── */}
          <div className="mt-8 text-center">
            <motion.button
              type="submit"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-3 text-white text-sm font-bold rounded-sm tracking-[0.2em] uppercase shadow-md"
              style={{ backgroundColor: RED, fontFamily: serif }}
            >
              Submit Application
            </motion.button>
            <p className="text-[12px] mt-2 text-gray-600" style={{ fontFamily: serif }}>
              Please review all details before submitting.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <span style={{ fontFamily: serif }}>{label}</span>
      {children}
    </div>
  )
}

function MultiField({ label, children }) {
  return (
    <div>
      <span style={{ fontFamily: serif }}>{label}</span>
      <div className="mt-1 space-y-1">{children}</div>
    </div>
  )
}

function FieldError({ msg }) {
  return <p className="text-[12px] font-semibold -mt-2" style={{ color: ERROR_RED, fontFamily: serif }}>{msg}</p>
}