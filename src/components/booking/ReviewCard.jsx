import { Edit3, User, Calendar, Phone, BookOpen, MapPin, Heart, Camera } from 'lucide-react'

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'

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
export default function ReviewCard({ index, data, onEdit }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: `${GOLD}40`, boxShadow: '0 2px 12px rgba(0,26,77,0.07)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${NAVY}, #0d3a80)` }}
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
            {data.name && (
              <p className="text-xs mt-0.5" style={{ color: 'rgba(250,245,234,0.75)' }}>
                {data.name}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#ffffff' }}
        >
          <Edit3 size={12} />
          Edit
        </button>
      </div>

      {/* Body */}
      <div className="p-5 bg-white">
        <div className="flex gap-5 items-start">
          {/* Photo thumbnail */}
          {data.photo ? (
            <div
              className="shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2"
              style={{ borderColor: `${GOLD}50` }}
            >
              <img src={data.photo} alt={`Traveler ${index + 1}`} className="w-full h-full object-cover" />
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
            <InfoRow label="Full Name" value={data.name} />
            <InfoRow
              label="Date of Birth"
              value={data.dob ? new Date(data.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            />
            <InfoRow label="Age" value={data.age ? `${data.age} years` : ''} />
            <InfoRow label="Gender" value={data.sex} />
            <InfoRow label="Blood Group" value={data.bloodGroup} />
            <InfoRow label="Contact" value={data.contact} />
            <InfoRow label="Education" value={data.education} />
            <InfoRow label="School / College" value={data.school} />
            <InfoRow
              label="Experience"
              value={
                data.experience === 'Yes'
                  ? `Yes — ${data.experienceDetails || 'Details not provided'}`
                  : data.experience === 'No'
                  ? 'No'
                  : ''
              }
            />
            <InfoRow label="Participant" value={data.participantType} />
            {data.participantType === 'Minor' && (
              <>
                <InfoRow label="Guardian" value={data.guardianName} />
                <InfoRow label="Guardian Contact" value={data.guardianContact} />
              </>
            )}
          </div>
        </div>

        {/* Signature previews */}
        {(data.sigApplicant || data.sigRisk) && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.sigApplicant && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>
                  Applicant Signature
                </p>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${GOLD}30` }}>
                  <img src={data.sigApplicant} alt="Applicant signature" className="w-full h-16 object-contain bg-white" />
                </div>
              </div>
            )}
            {data.sigRisk && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>
                  Risk Certificate Signature
                </p>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${GOLD}30` }}>
                  <img src={data.sigRisk} alt="Risk signature" className="w-full h-16 object-contain bg-white" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
