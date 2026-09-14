import { useState } from 'react'
import { X, Download, Eye, Camera, PenTool, Shield, Heart, MapPin, Calendar, User, Phone, Mail, GraduationCap, Building2, FileText, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { NAVY, GOLD, GOLD2, BROWN, font } from '../../components/admin/admin-ui'
import { Modal } from '../../components/admin/admin-ui'

export function TravelerDetailModal({ traveler, booking, onClose, onDownloadPdf, onDownloadExcel }) {
  const [activeSection, setActiveSection] = useState('personal')

  const age = traveler.date_of_birth ? calculateAge(traveler.date_of_birth) : traveler.age

  const sections = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'photo', label: 'Photograph', icon: Camera },
    { id: 'education', label: 'Education & Activities', icon: GraduationCap },
    { id: 'declaration', label: 'Declaration', icon: FileText },
    { id: 'risk', label: 'Risk Certificate', icon: Shield },
    { id: 'guardian', label: 'Guardian', icon: Heart, condition: traveler.participant_type === 'Minor' },
  ].filter(s => !s.condition || s.condition)

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Traveler Application — ${traveler.full_name}`}
      width={900}
    >
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-4 p-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'rgba(180,160,130,0.15)' }}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition flex items-center gap-1.5"
              style={{
                fontFamily: font.body,
                color: activeSection === section.id ? '#ffffff' : NAVY,
                background: activeSection === section.id ? NAVY : 'rgba(0,26,77,0.06)',
                border: `1px solid ${activeSection === section.id ? NAVY : 'rgba(0,26,77,0.15)'}`
              }}
            >
              <section.icon size={13} style={{ color: activeSection === section.id ? GOLD : NAVY }} />
              {section.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={onDownloadPdf} className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition flex items-center gap-1.5 text-white" style={{ background: NAVY, fontFamily: font.body }}>
              <Download size={13} /> PDF
            </button>
            <button onClick={onDownloadExcel} className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition flex items-center gap-1.5 text-white" style={{ background: '#15803d', fontFamily: font.body }}>
              <FileText size={13} /> Excel
            </button>
          </div>
        </div>

        {/* Personal Details */}
        {activeSection === 'personal' && (
          <SectionWrapper title="APPLICATION INFORMATION & PERSONAL DETAILS" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Name of Course" value={traveler.course_name || booking?.tour_name || '—'} fullWidth />
              <DetailField label="Full Name" value={traveler.full_name} />
              <DetailField label="Date of Birth" value={traveler.date_of_birth ? formatDate(traveler.date_of_birth) : '—'} />
              <DetailField label="Age" value={age ? `${age} years` : '—'} />
              <DetailField label="Sex" value={traveler.sex || '—'} />
              <DetailField label="Blood Group" value={traveler.blood_group || '—'} />
              <DetailField label="Contact Number" value={traveler.contact_number || '—'} />
              <DetailField label="Participant Type" value={traveler.participant_type || 'Adult'} />
              <DetailField label="Address" value={traveler.address || '—'} fullWidth />
            </div>
          </SectionWrapper>
        )}

        {/* Photograph */}
        {activeSection === 'photo' && (
          <SectionWrapper title="PHOTOGRAPH" icon={Camera}>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-44 h-52 shrink-0 rounded-xl overflow-hidden border-2 flex items-center justify-center shadow-md" style={{ borderColor: `${GOLD}70`, background: '#fff' }}>
                  {traveler.photo_url ? (
                    <img src={traveler.photo_url} alt={traveler.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4" style={{ color: 'rgba(58,42,24,0.5)' }}>
                      <Camera size={36} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-xs font-semibold">No photograph uploaded</p>
                    </div>
                  )}
                </div>
                {traveler.photo_url && (
                  <a
                    href={traveler.photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition"
                    style={{ background: NAVY }}
                  >
                    <Eye size={12} /> View Photo
                  </a>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-sm" style={{ color: NAVY }}>Traveler Photograph</h4>
                <p className="text-xs leading-relaxed" style={{ color: BROWN, fontFamily: font.body }}>
                  This is the official uploaded photograph submitted by {traveler.full_name} during the booking application.
                  It is automatically archived and embedded into the traveler&apos;s application document and PDF reports.
                </p>
                {traveler.photo_url && (
                  <div className="mt-3 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Photo Storage Path</span>
                    <span className="text-xs font-mono text-gray-700 break-all">{traveler.photo_url}</span>
                  </div>
                )}
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* Education & Activities */}
        {activeSection === 'education' && (
          <SectionWrapper title="EDUCATION & ACTIVITIES" icon={GraduationCap}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Education" value={traveler.education || '—'} />
              <DetailField label="School / College" value={traveler.school_college || '—'} />
              <DetailField label="School / College Address" value={traveler.school_college_address || '—'} fullWidth />
              <DetailField label="School / College Phone" value={traveler.school_college_phone || '—'} />
              <DetailField label="Hobbies" value={traveler.hobbies || '—'} fullWidth />
            </div>
            <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(0,26,77,0.05)', border: '1px solid rgba(0,26,77,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Adventure / Cultural Experience</span>
              </div>
              <DetailField label="Experience" value={traveler.adventure_experience || '—'} />
              {traveler.adventure_experience === 'Yes' && traveler.adventure_details && (
                <DetailField label="Experience Details" value={traveler.adventure_details} fullWidth />
              )}
            </div>
          </SectionWrapper>
        )}

        {/* Declaration */}
        {activeSection === 'declaration' && (
          <SectionWrapper title="DECLARATION" icon={FileText}>
            <div className="rounded-xl p-4 mb-4" style={{ background: '#fff', border: '1px solid rgba(180,160,130,0.5)' }}>
              <p className="text-xs leading-relaxed" style={{ color: BROWN, fontFamily: font.body }}>
                "If I am selected, I agree to abide by the rules & regulations, the terms and conditions of admission for the
                course which I hereby agree to abide fully."
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <DetailField label="Terms & Conditions Accepted" value={traveler.declaration?.accepted ? 'YES' : 'NO'} />
              <DetailField label="Acceptance Date" value={traveler.declaration?.accepted_at ? formatDate(traveler.declaration.accepted_at) : '—'} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <DetailField label="Place" value={traveler.declaration?.place || '—'} />
              <DetailField label="Date" value={traveler.declaration?.date ? formatDate(traveler.declaration.date) : '—'} />
            </div>
            {traveler.declaration?.signature_url && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: NAVY, fontFamily: font.body }}>
                  Applicant Signature
                </p>
                <div className="rounded-xl overflow-hidden border max-w-xs" style={{ borderColor: `${GOLD}30` }}>
                  <img src={traveler.declaration.signature_url} alt="Applicant signature" className="w-full h-20 object-contain bg-white" />
                </div>
              </div>
            )}
          </SectionWrapper>
        )}

        {/* Risk Certificate */}
        {activeSection === 'risk' && (
          <SectionWrapper title="RISK CERTIFICATE" icon={Shield}>
            <div className="rounded-xl p-4 mb-4" style={{ background: '#fff', border: '1px solid rgba(180,160,130,0.5)' }}>
              <p className="text-xs leading-relaxed" style={{ color: BROWN, fontFamily: font.body }}>
                "It is certified that I agree to detail my son / daughter / ward / Mr. / Myself{' '}
                <span style={{ color: GOLD }}>_______________</span> for{' '}
                <span style={{ color: GOLD }}>_______________</span> course at my own risk and no compensation
                will be paid to me in case of accident or death and I will not hold the CLUB-TRUST or its staff
                wholly or partially responsible for any mishappening."
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <DetailField label="Participant Name" value={traveler.risk_certificate?.participant_name || '—'} />
              <DetailField label="Course Name" value={traveler.risk_certificate?.course_name || '—'} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <DetailField label="Risk Accepted" value={traveler.risk_certificate?.accepted ? 'YES' : 'NO'} />
              <DetailField label="Acceptance Date" value={traveler.risk_certificate?.accepted_at ? formatDate(traveler.risk_certificate.accepted_at) : '—'} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <DetailField label="Place" value={traveler.risk_certificate?.place || '—'} />
              <DetailField label="Date" value={traveler.risk_certificate?.date ? formatDate(traveler.risk_certificate.date) : '—'} />
            </div>
            {traveler.risk_certificate?.signature_url && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: NAVY, fontFamily: font.body }}>
                  Risk Certificate Signature
                </p>
                <div className="rounded-xl overflow-hidden border max-w-xs" style={{ borderColor: `${GOLD}30` }}>
                  <img src={traveler.risk_certificate.signature_url} alt="Risk signature" className="w-full h-20 object-contain bg-white" />
                </div>
              </div>
            )}
          </SectionWrapper>
        )}

        {/* Guardian */}
        {activeSection === 'guardian' && (
          <SectionWrapper title="PARENT / GUARDIAN INFORMATION" icon={Heart}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Guardian Name" value={traveler.guardian?.guardian_name || '—'} />
              <DetailField label="Guardian Contact" value={traveler.guardian?.guardian_contact || '—'} />
            </div>
            {traveler.guardian?.guardian_signature_url && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: NAVY, fontFamily: font.body }}>
                  Guardian Signature
                </p>
                <div className="rounded-xl overflow-hidden border max-w-xs" style={{ borderColor: `${GOLD}30` }}>
                  <img src={traveler.guardian.guardian_signature_url} alt="Guardian signature" className="w-full h-20 object-contain bg-white" />
                </div>
              </div>
            )}
          </SectionWrapper>
        )}

        {/* Booking Info at bottom */}
        <div className="mt-6 pt-6 border-t p-4 rounded-xl" style={{ borderColor: 'rgba(180,160,130,0.15)', background: 'rgba(0,26,77,0.03)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: GOLD, fontFamily: font.body }}>BOOKING INFORMATION</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <DetailField label="Booking ID" value={booking.booking_id} />
            <DetailField label="Tour" value={booking.tour_name} />
            <DetailField label="Travel Date" value={formatDate(booking.travel_date)} />
            <DetailField label="Total Amount" value={`₹${booking.total_amount?.toLocaleString('en-IN') || '—'}`} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

function SectionWrapper({ title, icon: Icon, children }) {
  return (
    <div className="space-y-4" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} style={{ color: GOLD }} />
        <h3 className="font-bold" style={{ fontFamily: 'Cinzel', color: NAVY }}>{title}</h3>
      </div>
      <div className="border-l-4 pl-4" style={{ borderColor: GOLD }}>
        {children}
      </div>
    </div>
  )
}

function DetailField({ label, value, fullWidth }) {
  return (
    <div className={`${fullWidth ? 'sm:col-span-2' : ''}`}>
      <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(0,26,77,0.45)', fontFamily: font.body }}>
        {label}
      </div>
      <div className="font-semibold text-sm" style={{ color: NAVY, fontFamily: font.body, wordBreak: 'break-word' }}>
        {value || '—'}
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function calculateAge(dob) {
  if (!dob) return ''
  const d = new Date(`${dob}T00:00:00`)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
  return age >= 0 && age < 120 ? age : ''
}