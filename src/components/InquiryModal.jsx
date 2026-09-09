import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Send, CheckCircle2, Phone, Calendar, Users, ShieldAlert, Sparkles, User, FileText } from 'lucide-react'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

// Mock inquiries list for admin interface
const initialAdminInquiries = [
  {
    id: 'INQ-1042',
    name: 'Sophia Laurent',
    tour: 'Swiss Alpine Haute Route',
    travelers: 2,
    date: '2025-06-18',
    message: 'Can we customize the summit trail for intermediate hikers?',
    status: 'New',
    time: '10 mins ago',
  },
  {
    id: 'INQ-1041',
    name: 'Marcus Vance',
    tour: 'White River Rafting & Forest Camp',
    travelers: 4,
    date: '2025-07-02',
    message: 'Is equipment rental included for river rafting and camping gear?',
    status: 'Contacted',
    time: '2 hours ago',
  },
  {
    id: 'INQ-1039',
    name: 'Elena Rostova',
    tour: 'Paris Romantic Getaway',
    travelers: 2,
    date: '2025-05-14',
    message: 'Looking for a private Seine yacht dinner upgrade.',
    status: 'Confirmed',
    time: '1 day ago',
  },
]

export default function InquiryModal({ isOpen, onClose, tour = null }) {
  const [activeTab, setActiveTab] = useState('inquire') // 'inquire' | 'admin'
  const [adminInquiries, setAdminInquiries] = useState(initialAdminInquiries)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    tourName: tour?.title || 'Alpine Explorers Signature Tour',
    fullName: '',
    phone: '',
    travelDate: tour?.date || '2025-05-20',
    travelers: 2,
    inquiryMessage: 'I would like to inquire about package customization, availability, and exclusive group pricing.',
  })

  if (!isOpen) return null

  const whatsappMessage = `*Alpine Explorers Tour Inquiry* 🏔️✈️\n\n` +
    `• *Tour:* ${formData.tourName}\n` +
    `• *Travel Date:* ${formData.travelDate}\n` +
    `• *Travelers:* ${formData.travelers} Guest(s)\n` +
    `• *Name:* ${formData.fullName || 'Travel Explorer'}\n` +
    `• *Contact:* ${formData.phone || 'Provided via WhatsApp'}\n\n` +
    `• *Inquiry:* "${formData.inquiryMessage}"\n\n` +
    `Please provide detailed availability and custom quote. Thank you!`

  const encodedWhatsAppUrl = `https://wa.me/1800257463?text=${encodeURIComponent(whatsappMessage)}`

  const handleSendWhatsApp = () => {
    // Also save to admin inquiry list
    const newInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.fullName || 'Valued Guest',
      tour: formData.tourName,
      travelers: formData.travelers,
      date: formData.travelDate,
      message: formData.inquiryMessage,
      status: 'New',
      time: 'Just now',
    }
    setAdminInquiries([newInquiry, ...adminInquiries])
    setSubmitted(true)
    window.open(encodedWhatsAppUrl, '_blank')
  }

  const handleLocalSubmit = (e) => {
    e.preventDefault()
    const newInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.fullName || 'Valued Guest',
      tour: formData.tourName,
      travelers: formData.travelers,
      date: formData.travelDate,
      message: formData.inquiryMessage,
      status: 'New',
      time: 'Just now',
    }
    setAdminInquiries([newInquiry, ...adminInquiries])
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md" style={{ backgroundColor: 'rgba(3,9,20,0.75)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border flex flex-col max-h-[90vh]"
          style={{ backgroundColor: CREAM, borderColor: 'rgba(212,175,55,0.4)' }}
        >
          {/* Header */}
          <div className="p-6 text-white relative" style={{ background: 'linear-gradient(135deg, #001a4d, #0d3a80 60%, #123a6e)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.55)', color: GOLD2 }}>
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display tracking-wide">
                    {activeTab === 'inquire' ? 'Inquire via WhatsApp' : 'Admin Inquiry Management'}
                  </h3>
                  <p className="text-xs" style={{ color: 'rgba(250,245,234,0.85)' }}>
                    {activeTab === 'inquire'
                      ? 'Instant responses within minutes from our Alpine Concierge'
                      : 'Live incoming traveler inquiries and reservation queue'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab switchers */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setActiveTab('inquire'); setSubmitted(false); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'inquire'
                    ? 'text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                style={activeTab === 'inquire' ? { backgroundColor: GOLD2, color: NAVY } : { backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                💬 Traveler WhatsApp Flow
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'admin'
                    ? 'shadow-md'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                style={activeTab === 'admin'
                  ? { backgroundColor: GOLD2, color: NAVY }
                  : { backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <span>⚙️ Admin Desk Interface</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: NAVY, color: GOLD2 }}>
                  {adminInquiries.length}
                </span>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto flex-1" style={{ color: BROWN }}>
            {activeTab === 'inquire' ? (
              submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{ backgroundColor: 'rgba(212,175,55,0.18)', color: GOLD }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-[#001a4d]">Inquiry Dispatched!</h4>
                  <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'rgba(58,42,24,0.8)' }}>
                    Your inquiry has been generated and queued for Alpine Explorers Concierge. If WhatsApp didn't open automatically, click below:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={encodedWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                      style={{ backgroundColor: NAVY }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
                    >
                      <MessageSquare size={18} /> Open WhatsApp Chat
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 font-medium rounded-xl"
                      style={{ backgroundColor: 'rgba(180,160,130,0.15)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD2; e.currentTarget.style.color = NAVY }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(180,160,130,0.15)'; e.currentTarget.style.color = BROWN }}
                    >
                      Edit Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLocalSubmit} className="space-y-4">
                  {/* Tour selected banner */}
                  <div className="p-3.5 rounded-xl flex items-center justify-between" style={{ backgroundColor: 'rgba(212,175,55,0.16)', border: '1px solid rgba(197,155,39,0.4)' }}>
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#7a5a12' }}>Selected Package</span>
                      <h4 className="font-bold text-base text-[#001a4d]">{formData.tourName}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: GOLD }}>
                      WhatsApp Quick Concierge
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#001a4d]">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-3" style={{ color: 'rgba(58,42,24,0.5)' }} />
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Miller"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
                          style={{ border: '1px solid rgba(180,160,130,0.45)', backgroundColor: '#fff', color: NAVY }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(197,155,39,0.25)'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,160,130,0.45)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#001a4d]">
                        Phone / WhatsApp Number
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-3" style={{ color: 'rgba(58,42,24,0.5)' }} />
                        <input
                          type="tel"
                          placeholder="+1 (555) 019-2834"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
                          style={{ border: '1px solid rgba(180,160,130,0.45)', backgroundColor: '#fff', color: NAVY }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(197,155,39,0.25)'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,160,130,0.45)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#001a4d]">
                        Preferred Travel Date
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3" style={{ color: 'rgba(58,42,24,0.5)' }} />
                        <input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
                          style={{ border: '1px solid rgba(180,160,130,0.45)', backgroundColor: '#fff', color: NAVY }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(197,155,39,0.25)'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,160,130,0.45)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#001a4d]">
                        Number of Travelers
                      </label>
                      <div className="relative">
                        <Users size={16} className="absolute left-3 top-3" style={{ color: 'rgba(58,42,24,0.5)' }} />
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={formData.travelers}
                          onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
                          style={{ border: '1px solid rgba(180,160,130,0.45)', backgroundColor: '#fff', color: NAVY }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(197,155,39,0.25)'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,160,130,0.45)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#001a4d]">
                      Customer Inquiry & Special Requests
                    </label>
                    <textarea
                      rows={3}
                      value={formData.inquiryMessage}
                      onChange={(e) => setFormData({ ...formData, inquiryMessage: e.target.value })}
                      placeholder="Ask about customized dates, airport transfers, luxury upgrades, dietary requirements, or private guide..."
                      className="w-full p-3 rounded-xl text-sm focus:outline-none resize-none"
                      style={{ border: '1px solid rgba(180,160,130,0.45)', backgroundColor: '#fff', color: NAVY }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(197,155,39,0.25)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(180,160,130,0.45)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* WhatsApp Message Preview */}
                  <div className="rounded-xl p-3 text-xs" style={{ backgroundColor: 'rgba(212,175,55,0.14)', border: '1px solid rgba(197,155,39,0.4)' }}>
                    <div className="flex items-center gap-1.5 font-bold mb-1.5 text-[#7a5a12]">
                      <Sparkles size={14} /> WhatsApp Pre-Filled Message Preview:
                    </div>
                    <p className="whitespace-pre-line font-mono p-2.5 rounded-lg max-h-24 overflow-y-auto" style={{ color: BROWN, backgroundColor: '#fff', border: '1px solid rgba(197,155,39,0.25)' }}>
                      {whatsappMessage}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="flex-1 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                      style={{ backgroundColor: NAVY }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
                    >
                      <MessageSquare size={18} /> Open in WhatsApp
                    </button>
                    <button
                      type="submit"
                      className="text-white font-semibold py-3 px-5 rounded-xl transition flex items-center justify-center gap-2"
                      style={{ backgroundColor: GOLD }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = NAVY_MID }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = GOLD }}
                    >
                      <Send size={16} /> Submit to Desk
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* Admin Interface View */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
                  <div>
                    <h4 className="font-bold text-base text-[#001a4d]">Alpine Concierge Desk Inquiries</h4>
                    <p className="text-xs" style={{ color: 'rgba(58,42,24,0.7)' }}>Live feed of inbound traveler leads and WhatsApp conversations</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(197,155,39,0.16)', color: '#7a5a12', border: '1px solid rgba(197,155,39,0.4)' }}>
                    {adminInquiries.length} Active Inquiries
                  </span>
                </div>

                <div className="space-y-3">
                  {adminInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl border transition space-y-2"
                      style={{ backgroundColor: 'rgba(180,160,130,0.1)', borderColor: 'rgba(180,160,130,0.25)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.14)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(180,160,130,0.1)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold" style={{ color: 'rgba(58,42,24,0.6)' }}>{inq.id}</span>
                          <span className="font-bold text-sm text-[#001a4d]">{inq.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              inq.status === 'New'
                                ? 'text-amber-800'
                                : inq.status === 'Contacted'
                                ? 'text-[#0d3a80]'
                                : 'text-emerald-800'
                            }`}
                            style={{ backgroundColor: inq.status === 'New' ? 'rgba(212,175,55,0.2)' : inq.status === 'Contacted' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)' }}
                          >
                            {inq.status}
                          </span>
                          <span className="text-xs" style={{ color: 'rgba(58,42,24,0.55)' }}>{inq.time}</span>
                        </div>
                      </div>

                      <div className="text-xs flex flex-wrap gap-x-4 gap-y-1" style={{ color: 'rgba(58,42,24,0.75)' }}>
                        <span><strong className="text-[#001a4d]">Tour:</strong> {inq.tour}</span>
                        <span><strong className="text-[#001a4d]">Travelers:</strong> {inq.travelers}</span>
                        <span><strong className="text-[#001a4d]">Date:</strong> {inq.date}</span>
                      </div>

                      <p className="text-xs p-2 rounded-lg italic" style={{ color: BROWN, backgroundColor: '#fff', border: '1px solid rgba(197,155,39,0.25)' }}>
                        "{inq.message}"
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            setAdminInquiries(
                              adminInquiries.map((item) =>
                                item.id === inq.id ? { ...item, status: 'Contacted' } : item
                              )
                            )
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded transition"
                          style={{ backgroundColor: '#fff', border: '1px solid rgba(180,160,130,0.5)', color: BROWN }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.2)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
                        >
                          Mark Contacted
                        </button>
                        <a
                          href={`https://wa.me/1800257463?text=${encodeURIComponent(`Hello ${inq.name}, this is Alpine Explorers Concierge regarding your inquiry for ${inq.tour}!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 text-xs font-semibold rounded text-white flex items-center gap-1"
                          style={{ backgroundColor: NAVY }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
                        >
                          <MessageSquare size={12} /> Reply on WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}