import { Edit3, User, Calendar, Phone, BookOpen, MapPin, Heart, Camera } from 'lucide-react'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'

function calcAge(dob) {
  if (!dob) return ''
  const d = new Date(`${dob}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
  return age >= 0 && age < 120 ? age : ''
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-semibold shrink-0 w-28 text-gray-500">{label}</span>
      <span style={{ color: NAVY }}>{value}</span>
    </div>
  )
}

/**
 * ReviewCard — displays a read-only summary of one traveler's data.
 *
 * Props:
 *  - index:    0-based traveler index
 *  - data:     traveler state object
 *  - onEdit:   () => void — called when "Edit" is clicked
 */
export default function ReviewCard({ index, traveler, data, onEdit }) {
  const d = traveler || data || {}

  const name = d.fullName || d.name || ''
  const dob = d.dob || ''
  const age = d.age || (dob ? calcAge(dob) : '')
  const sex = d.sex || d.gender || ''
  const bloodGroup = d.bloodGroup || ''
  const contact = d.contact || d.phone || ''
  const education = d.education || ''
  const school = d.school || ''
  const experience =
    d.experienceYesNo === 'Yes'
      ? `Yes — ${d.experienceDetails || 'Details provided'}`
      : d.experienceYesNo === 'No'
      ? 'No'
      : d.experience || ''
  const participantType =
    d.participantType === 'minor'
      ? 'Minor'
      : d.participantType === 'adult'
      ? 'Adult'
      : d.participantType || ''
  const guardianName = d.guardianName || ''
  const guardianContact = d.guardianContact || ''

  const photoUrl = typeof d.photo === 'string' ? d.photo : d.photo?.dataUrl || null
  const applicantSig = d.signature || d.sigApplicant || null
  const riskSig = d.riskSignature || d.sigRisk || null

  return (
    <div
      className="rounded-2xl overflow-hidden border bg-white"
      style={{ borderColor: `${GOLD}40`, boxShadow: '0 2px 12px rgb(var(--ae-navy-rgb) /0.07)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid))` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
          >
            {index + 1}
          </div>
          <div>
            <p className="text-white font-bold text-sm uppercase tracking-wider">
              Traveler {index + 1}
            </p>
            {name && (
              <p className="text-xs mt-0.5" style={{ color: 'rgb(var(--ae-cream-rgb) /0.75)' }}>
                {name}
              </p>
            )}
          </div>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#ffffff' }}
          >
            <Edit3 size={12} />
            Edit
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5 bg-white">
        <div className="flex gap-5 items-start">
          {/* Photo thumbnail */}
          {photoUrl ? (
            <div
              className="shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2"
              style={{ borderColor: `${GOLD}50` }}
            >
              <img src={photoUrl} alt={`Traveler ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center"
              style={{ backgroundColor: `${NAVY}05`, border: `1.5px dashed #cbd5e1` }}
            >
              <Camera size={16} className="text-gray-300 mb-1" />
              <span className="text-[9px] text-gray-300 text-center">No photo</span>
            </div>
          )}

          {/* Info grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <InfoRow label="Full Name" value={name} />
            <InfoRow
              label="Date of Birth"
              value={dob ? new Date(dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            />
            <InfoRow label="Age" value={age ? `${age} years` : ''} />
            <InfoRow label="Gender" value={sex} />
            <InfoRow label="Blood Group" value={bloodGroup} />
            <InfoRow label="Contact" value={contact} />
            <InfoRow label="Education" value={education} />
            <InfoRow label="School / College" value={school} />
            <InfoRow label="Experience" value={experience} />
            <InfoRow label="Participant" value={participantType} />
            {participantType === 'Minor' && (
              <>
                <InfoRow label="Guardian" value={guardianName} />
                <InfoRow label="Guardian Contact" value={guardianContact} />
              </>
            )}
          </div>
        </div>

        {/* Signature previews */}
        {(applicantSig || riskSig) && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {applicantSig && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>
                  Applicant Signature
                </p>
                <div className="rounded-xl overflow-hidden border bg-white p-1" style={{ borderColor: `${GOLD}30` }}>
                  <img src={applicantSig} alt="Applicant signature" className="w-full h-16 object-contain" />
                </div>
              </div>
            )}
            {riskSig && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>
                  Risk Certificate Signature
                </p>
                <div className="rounded-xl overflow-hidden border bg-white p-1" style={{ borderColor: `${GOLD}30` }}>
                  <img src={riskSig} alt="Risk signature" className="w-full h-16 object-contain" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
