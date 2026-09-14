import { useRef } from 'react'
import { Trash2, Camera, User, Phone, Calendar, MapPin, GraduationCap, Building2, Heart } from 'lucide-react'
import SignaturePad from './SignaturePad'
import { Field, ChipGroup, SectionTitle, inputBase, fieldStyle, NAVY, GOLD, BROWN, ERR, font } from './bookingUi'

const SEX_OPTIONS = ['Male', 'Female', 'Other']
const BLOOD_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function calcAge(dob) {
  if (!dob) return ''
  const d = new Date(`${dob}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
  return age >= 0 && age < 120 ? age : ''
}

const inputStyle = (hasError) => ({ ...inputBase, ...fieldStyle(hasError) })

export default function TravelerForm({ index, count, trip, traveler, errors, onChange, onSetError, maxDob }) {
  const photoInputRef = useRef(null)

  const nameOfCourse = traveler.courseName || trip.title

  const handlePhotoFile = (file) => {
    if (!file) return
    const okTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!okTypes.includes(file.type)) {
      onSetError('photo', 'Please upload a JPG / JPEG / PNG image.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 480
        let width = img.width
        let height = img.height
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else if (height >= width && height > maxDim) {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        onChange('photo', { name: file.name || 'photograph.jpg', dataUrl: canvas.toDataURL('image/jpeg', 0.82) })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {/* Course */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(0,26,77,0.05)', border: '1px solid rgba(0,26,77,0.15)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Course</span>
          <span className="h-px flex-1" style={{ background: 'rgba(197,155,39,0.4)' }} />
        </div>
        <Field id={`course-${index}`} label="Name of Course" required error={errors.courseName}>
          <input
            id={`course-${index}`}
            type="text"
            value={nameOfCourse}
            readOnly
            aria-readonly="true"
            onFocus={(e) => { e.currentTarget.style.borderColor = GOLD }}
            style={{ ...inputStyle(errors.courseName), backgroundColor: 'rgba(255,255,255,0.7)' }}
          />
        </Field>
        <p className="mt-2 text-[11px]" style={{ color: 'rgba(58,42,24,0.6)', ...font.body }}>
          Auto-filled from the selected trip. For changes, contact the Alpine Explorers team.
        </p>
      </div>

      <div>
        <SectionTitle>Personal Details</SectionTitle>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id={`fullname-${index}`} label="Full Name" required error={errors.fullName}>
            <div className="relative">
              <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`fullname-${index}`}
                type="text"
                placeholder="e.g. Ananya Sharma"
                autoComplete="name"
                value={traveler.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? `fullname-${index}-error` : undefined}
                className="w-full"
                style={{ ...inputStyle(errors.fullName), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>

          <ChipGroup
            id={`sex-${index}`}
            label="Sex" required
            value={traveler.sex}
            onChange={(v) => onChange('sex', v)}
            options={SEX_OPTIONS}
            error={errors.sex}
          />

          <Field id={`dob-${index}`} label="Date of Birth" required error={errors.dob}>
            <div className="relative">
              <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`dob-${index}`}
                type="date"
                max={maxDob}
                value={traveler.dob}
                onChange={(e) => onChange('dob', e.target.value)}
                aria-invalid={!!errors.dob}
                aria-describedby={errors.dob ? `dob-${index}-error` : undefined}
                style={{ ...inputStyle(errors.dob), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>

          <Field id={`age-${index}`} label="Age" error={calcAge(traveler.dob) ? '' : errors.age}>
            <input
              id={`age-${index}`}
              type="text"
              readOnly
              value={calcAge(traveler.dob) ? `${calcAge(traveler.dob)} years` : (traveler.dob ? '' : 'Auto calculated from DOB')}
              style={{ ...inputStyle(false), backgroundColor: 'rgba(255,255,255,0.7)' }}
            />
          </Field>

          <ChipGroup
            id={`blood-${index}`}
            label="Blood Group" required
            value={traveler.bloodGroup}
            onChange={(v) => onChange('bloodGroup', v)}
            options={BLOOD_OPTIONS}
            error={errors.bloodGroup}
          />

          <Field id={`contact-${index}`} label="Contact Number" required hint="(Indian)" error={errors.contact}>
            <div className="relative">
              <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`contact-${index}`}
                type="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                value={traveler.contact}
                onChange={(e) => onChange('contact', e.target.value)}
                aria-invalid={!!errors.contact}
                aria-describedby={errors.contact ? `contact-${index}-error` : undefined}
                style={{ ...inputStyle(errors.contact), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>

          <Field id={`address-${index}`} label="Address" required error={errors.address} >
            <textarea
              id={`address-${index}`}
              rows={3}
              placeholder="House no., Street, Area, City, State, PIN"
              value={traveler.address}
              onChange={(e) => onChange('address', e.target.value)}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? `address-${index}-error` : undefined}
              style={{ ...inputStyle(errors.address), resize: 'none', lineHeight: 1.5 }}
            />
          </Field>
        </div>

        {/* Photograph */}
        <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: 'rgba(0,26,77,0.05)', border: '1px solid rgba(0,26,77,0.15)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Photograph</span>
            <span className="h-px flex-1" style={{ background: 'rgba(197,155,39,0.4)' }} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className="w-24 h-28 shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ border: `1.5px dashed ${errors.photo ? ERR : 'rgba(180,160,130,0.6)'}`, backgroundColor: '#ffffff' }}
            >
              {traveler.photo ? (
                <img src={traveler.photo.dataUrl} alt="Traveler photograph" className="w-full h-full object-cover" />
              ) : (
                <Camera size={22} style={{ color: 'rgba(180,160,130,0.7)' }} aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={(e) => handlePhotoFile(e.target.files?.[0])}
              />
              {traveler.photo ? (
                <p className="text-xs font-semibold truncate mb-2" style={{ color: NAVY, ...font.body }}>{traveler.photo.name}</p>
              ) : (
                <p className="text-xs mb-2" style={{ color: 'rgba(58,42,24,0.6)', ...font.body }}>
                  Upload a recent passport-style photograph of the traveler. (JPG / JPEG / PNG)
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                  style={{ backgroundColor: NAVY }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#ffffff' }}
                >
                  {traveler.photo ? 'Change Photo' : 'Upload Photo'}
                </button>
                {traveler.photo && (
                  <button
                    type="button"
                    onClick={() => { onChange('photo', null); onSetError('photo', '') }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    style={{ color: ERR, backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.color = '#ffffff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = ERR }}
                  >
                    <Trash2 size={13} aria-hidden="true" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          {errors.photo && <p id={`photo-${index}-error`} className="mt-2 text-[11px] font-semibold" style={{ color: ERR, ...font.body }}>{errors.photo}</p>}
        </div>
      </div>

      <div>
        <SectionTitle>Education & Activities</SectionTitle>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id={`education-${index}`} label="Education" required error={errors.education}>
            <div className="relative">
              <GraduationCap size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`education-${index}`}
                type="text"
                placeholder="e.g. B.Sc. (Physics), Class XII, etc."
                value={traveler.education}
                onChange={(e) => onChange('education', e.target.value)}
                aria-invalid={!!errors.education}
                aria-describedby={errors.education ? `education-${index}-error` : undefined}
                style={{ ...inputStyle(errors.education), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>

          <Field id={`school-${index}`} label="School / College" required error={errors.school}>
            <div className="relative">
              <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`school-${index}`}
                type="text"
                placeholder="Name of school / college"
                value={traveler.school}
                onChange={(e) => onChange('school', e.target.value)}
                aria-invalid={!!errors.school}
                aria-describedby={errors.school ? `school-${index}-error` : undefined}
                style={{ ...inputStyle(errors.school), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>

          <Field id={`school-address-${index}`} label="School / College Address" error={errors.schoolAddress}>
            <textarea
              id={`school-address-${index}`}
              rows={2}
              placeholder="Full address of institution (optional)"
              value={traveler.schoolAddress}
              onChange={(e) => onChange('schoolAddress', e.target.value)}
              style={{ ...inputStyle(errors.schoolAddress), resize: 'none', lineHeight: 1.5 }}
            />
          </Field>

          <Field id={`school-phone-${index}`} label="School / College Phone No." error={errors.schoolPhone}>
            <input
              id={`school-phone-${index}`}
              type="tel"
              inputMode="tel"
              placeholder="Optional"
              value={traveler.schoolPhone}
              onChange={(e) => onChange('schoolPhone', e.target.value)}
              aria-invalid={!!errors.schoolPhone}
              aria-describedby={errors.schoolPhone ? `school-phone-${index}-error` : undefined}
              style={inputStyle(errors.schoolPhone)}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field id={`hobbies-${index}`} label="Hobbies" error={errors.hobbies}>
              <textarea
                id={`hobbies-${index}`}
                rows={2}
                placeholder="Trekking, sports, art, music... (optional)"
                value={traveler.hobbies}
                onChange={(e) => onChange('hobbies', e.target.value)}
                style={{ ...inputStyle(errors.hobbies), resize: 'none', lineHeight: 1.5 }}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: 'rgba(0,26,77,0.05)', border: '1px solid rgba(0,26,77,0.15)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Adventure / Cultural Experience</span>
            <span className="h-px flex-1" style={{ background: 'rgba(197,155,39,0.4)' }} />
          </div>
          <ChipGroup
            id={`experience-${index}`}
            label="Do you have any experience of any Adventures or Cultural Activities?" required
            value={traveler.experienceYesNo}
            onChange={(v) => onChange('experienceYesNo', v)}
            options={['Yes', 'No']}
            error={errors.experienceYesNo}
          />
          {traveler.experienceYesNo === 'Yes' && (
            <div className="mt-3">
              <Field id={`experience-details-${index}`} label="Give Details" required error={errors.experienceDetails}>
                <textarea
                  id={`experience-details-${index}`}
                  rows={3}
                  placeholder="Describe your trekking, camping, adventure or cultural activities experience..."
                  value={traveler.experienceDetails}
                  onChange={(e) => onChange('experienceDetails', e.target.value)}
                  aria-invalid={!!errors.experienceDetails}
                  aria-describedby={errors.experienceDetails ? `experience-details-${index}-error` : undefined}
                  style={{ ...inputStyle(errors.experienceDetails), resize: 'none', lineHeight: 1.5 }}
                />
              </Field>
            </div>
          )}
        </div>
      </div>

      <div>
        <SectionTitle>Declaration</SectionTitle>
        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(180,160,130,0.5)' }}>
          <p className="text-xs leading-relaxed" style={{ color: BROWN, ...font.body }}>
            &quot;If I am selected, I agree to abide by the rules &amp; regulations, the terms and conditions of admission for the
            course which I hereby agree to abide fully.&quot;
          </p>
          <label className="flex items-start gap-2.5 mt-3 cursor-pointer" style={font.body}>
            <input
              type="checkbox"
              checked={traveler.declarationAccepted}
              onChange={(e) => onChange('declarationAccepted', e.target.checked)}
              className="mt-0.5 w-4 h-4 cursor-pointer accent-[#001a4d]"
              aria-invalid={!!errors.declaration}
            />
            <span className="text-xs" style={{ color: BROWN }}>
              I have read and accept the declaration.<span style={{ color: '#b45309' }}> *</span>
            </span>
          </label>
          {errors.declaration && <p className="mt-1.5 text-[11px] font-semibold" style={{ color: ERR, ...font.body }}>{errors.declaration}</p>}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id={`participant-type-${index}`} label="Participant Type" required error={errors.participantType}>
            <select
              id={`participant-type-${index}`}
              value={traveler.participantType}
              onChange={(e) => onChange('participantType', e.target.value)}
              aria-invalid={!!errors.participantType}
              aria-describedby={errors.participantType ? `participant-type-${index}-error` : undefined}
              style={inputStyle(errors.participantType)}
            >
              <option value="adult">Adult</option>
              <option value="minor">Minor</option>
            </select>
          </Field>

          {traveler.participantType === 'minor' && (
            <>
              <Field id={`guardian-name-${index}`} label="Parent / Guardian Name" required error={errors.guardianName}>
                <input
                  id={`guardian-name-${index}`}
                  type="text"
                  placeholder="Full name of parent / guardian"
                  value={traveler.guardianName}
                  onChange={(e) => onChange('guardianName', e.target.value)}
                  aria-invalid={!!errors.guardianName}
                  aria-describedby={errors.guardianName ? `guardian-name-${index}-error` : undefined}
                  style={inputStyle(errors.guardianName)}
                />
              </Field>
              <Field id={`guardian-contact-${index}`} label="Parent / Guardian Contact Number" required error={errors.guardianContact}>
                <input
                  id={`guardian-contact-${index}`}
                  type="tel"
                  inputMode="tel"
                  placeholder="+91 98765 43210"
                  value={traveler.guardianContact}
                  onChange={(e) => onChange('guardianContact', e.target.value)}
                  aria-invalid={!!errors.guardianContact}
                  aria-describedby={errors.guardianContact ? `guardian-contact-${index}-error` : undefined}
                  style={inputStyle(errors.guardianContact)}
                />
              </Field>
            </>
          )}
        </div>
      </div>

      <div>
        <SectionTitle>Applicant Signature</SectionTitle>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id={`sig-place-${index}`} label="Place" required error={errors.sigPlace}>
            <div className="relative">
              <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`sig-place-${index}`}
                type="text"
                placeholder="City / Town"
                value={traveler.sigPlace}
                onChange={(e) => onChange('sigPlace', e.target.value)}
                aria-invalid={!!errors.sigPlace}
                aria-describedby={errors.sigPlace ? `sig-place-${index}-error` : undefined}
                style={{ ...inputStyle(errors.sigPlace), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>
          <Field id={`sig-date-${index}`} label="Date" required error={errors.sigDate}>
            <div className="relative">
              <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`sig-date-${index}`}
                type="date"
                value={traveler.sigDate}
                onChange={(e) => onChange('sigDate', e.target.value)}
                aria-invalid={!!errors.sigDate}
                aria-describedby={errors.sigDate ? `sig-date-${index}-error` : undefined}
                style={{ ...inputStyle(errors.sigDate), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div>
            <p className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
              {traveler.participantType === 'minor' ? 'Parent / Guardian Signature' : 'Applicant Signature'}
              <span style={{ color: '#b45309' }}> *</span>
            </p>
            <SignaturePad
              id={`signature-${index}`}
              value={traveler.signature}
              onChange={(url) => onChange('signature', url)}
            />
            {errors.signature && <p id={`signature-${index}-error`} className="mt-1 text-[11px] font-semibold" style={{ color: ERR, ...font.body }}>{errors.signature}</p>}
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Risk Certificate</SectionTitle>
        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(180,160,130,0.5)' }}>
          <p className="text-xs leading-relaxed" style={{ color: BROWN, ...font.body }}>
            &quot;It is certified that I agree to detail my son / daughter / ward / Mr. / Myself{' '}
            <span style={{ color: GOLD }}>_______________</span> for{' '}
            <span style={{ color: GOLD }}>_______________</span> course at my own risk and no compensation
            will be paid to me in case of accident or death and I will not hold the CLUB-TRUST or its staff
            wholly or partially responsible for any mishappening.&quot;
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id={`risk-participant-${index}`} label="Participant Name" required error={errors.riskParticipantName}>
            <input
              id={`risk-participant-${index}`}
              type="text"
              placeholder="Full name of participant"
              value={traveler.riskParticipantName}
              onChange={(e) => onChange('riskParticipantName', e.target.value)}
              aria-invalid={!!errors.riskParticipantName}
              aria-describedby={errors.riskParticipantName ? `risk-participant-${index}-error` : undefined}
              style={inputStyle(errors.riskParticipantName)}
            />
          </Field>
          <Field id={`risk-course-${index}`} label="Course Name" required error={errors.riskCourseName}>
            <input
              id={`risk-course-${index}`}
              type="text"
              value={traveler.riskCourseName}
              onChange={(e) => onChange('riskCourseName', e.target.value)}
              aria-invalid={!!errors.riskCourseName}
              aria-describedby={errors.riskCourseName ? `risk-course-${index}-error` : undefined}
              style={inputStyle(errors.riskCourseName)}
            />
          </Field>
        </div>
        <label className="flex items-start gap-2.5 mt-3 cursor-pointer" style={font.body}>
          <input
            type="checkbox"
            checked={traveler.riskAccepted}
            onChange={(e) => onChange('riskAccepted', e.target.checked)}
            className="mt-0.5 w-4 h-4 cursor-pointer accent-[#001a4d]"
            aria-invalid={!!errors.risk}
          />
          <span className="text-xs" style={{ color: BROWN }}>
            I have read and accept the risk certificate.<span style={{ color: '#b45309' }}> *</span>
          </span>
        </label>
        {errors.risk && <p className="mt-1.5 text-[11px] font-semibold" style={{ color: ERR, ...font.body }}>{errors.risk}</p>}
      </div>

      <div>
        <SectionTitle>Risk Certificate Signature</SectionTitle>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id={`risk-place-${index}`} label="Place" required error={errors.riskPlace}>
            <div className="relative">
              <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`risk-place-${index}`}
                type="text"
                placeholder="City / Town"
                value={traveler.riskPlace}
                onChange={(e) => onChange('riskPlace', e.target.value)}
                aria-invalid={!!errors.riskPlace}
                aria-describedby={errors.riskPlace ? `risk-place-${index}-error` : undefined}
                style={{ ...inputStyle(errors.riskPlace), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>
          <Field id={`risk-date-${index}`} label="Date" required error={errors.riskDate}>
            <div className="relative">
              <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(58,42,24,0.45)' }} />
              <input
                id={`risk-date-${index}`}
                type="date"
                value={traveler.riskDate}
                onChange={(e) => onChange('riskDate', e.target.value)}
                aria-invalid={!!errors.riskDate}
                aria-describedby={errors.riskDate ? `risk-date-${index}-error` : undefined}
                style={{ ...inputStyle(errors.riskDate), paddingLeft: '2.25rem' }}
              />
            </div>
          </Field>
        </div>
        <div className="mt-4">
          <p className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
            Signature of Parent / Guardian / Applicant<span style={{ color: '#b45309' }}> *</span>
          </p>
          <SignaturePad
            id={`risk-signature-${index}`}
            value={traveler.riskSignature}
            onChange={(url) => onChange('riskSignature', url)}
          />
          {errors.riskSignature && <p id={`risk-signature-${index}-error`} className="mt-1 text-[11px] font-semibold" style={{ color: ERR, ...font.body }}>{errors.riskSignature}</p>}
        </div>
      </div>

      {count > 1 && (
        <p className="text-[11px] text-center" style={{ color: 'rgba(58,42,24,0.55)', ...font.body }}>
          <Heart size={11} className="inline -translate-y-px mr-1" style={{ color: GOLD }} aria-hidden="true" />
          Every traveler fills their own independent application. Traveler {index + 1} of {count}.
        </p>
      )}
    </div>
  )
}