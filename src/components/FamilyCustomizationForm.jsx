import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, Calendar, Clock, Banknote, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const BROWN = '#3a2a18'

const destinations = [
  'Europe', 'Bali', 'Dubai', 'Singapore', 'Thailand',
  'Kashmir', 'Rajasthan', 'Goa', 'Kerala', 'Himachal Pradesh',
  'Ladakh', 'Andaman', 'Nepal', 'Other',
]

const budgetRanges = [
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,00,000',
  '₹2,00,000 - ₹5,00,000',
  'Above ₹5,00,000',
  'Flexible / On Request',
]

export default function FamilyCustomizationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    destination: '',
    travelDate: '',
    adults: 2,
    children: 0,
    duration: '',
    budget: '',
    specialRequirements: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save to local database and Supabase via /api/inquiries
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination || 'Not decided yet',
        package_name: 'Family Tour Customization',
        travel_date: formData.travelDate || null,
        travelers: (Number(formData.adults) || 2) + (Number(formData.children) || 0),
        message: `Family Tour Request | Destination: ${formData.destination || 'Flexible'} | Duration: ${formData.duration || 'Flexible'} | Budget: ${formData.budget || 'Flexible'} | Adults: ${formData.adults}, Children: ${formData.children} | Special Requirements: ${formData.specialRequirements || 'None'}`,
      })
    }).catch(err => console.error('Error saving family customization:', err))

    const message = `*Alpine Explorers — Family Tour Customization* 👨‍👩‍👧‍👦\n\n` +
      `*Name:* ${formData.fullName}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n\n` +
      `*Destination:* ${formData.destination || 'Not decided yet'}\n` +
      `*Travel Date:* ${formData.travelDate || 'Flexible'}\n` +
      `*Adults:* ${formData.adults}\n` +
      `*Children:* ${formData.children}\n` +
      `*Duration:* ${formData.duration || 'Flexible'}\n` +
      `*Budget:* ${formData.budget || 'On Request'}\n\n` +
      `*Special Requirements:*\n${formData.specialRequirements || 'None'}\n\n` +
      `Please create a customized family itinerary. Thank you!`

    window.open(`https://wa.me/1800257463?text=${encodeURIComponent(message)}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-200"
      >
        <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: GOLD }} />
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif', color: NAVY }}>
          Request Sent!
        </h3>
        <p className="text-sm mb-6" style={{ color: BROWN }}>
          Your family tour customization request has been sent via WhatsApp. Our travel expert will get back to you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition"
          style={{ backgroundColor: NAVY }}
        >
          Submit Another Request
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD})`, boxShadow: '0 3px 10px rgba(197,155,39,0.3)' }}
        >
          <Users size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Cinzel, serif', color: NAVY }}>
            Customize Your Family Tour
          </h3>
          <p className="text-[11px]" style={{ color: 'rgba(58,42,24,0.6)' }}>
            Tell us your preferences and we'll create the perfect trip
          </p>
        </div>
      </div>

      {/* Name & Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Full Name *</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Phone *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>

      {/* Destination & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>
            <MapPin size={12} className="inline mr-1" style={{ color: GOLD }} />
            Preferred Destination
          </label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition bg-white"
          >
            <option value="">Select destination</option>
            {destinations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>
            <Calendar size={12} className="inline mr-1" style={{ color: GOLD }} />
            Travel Date
          </label>
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Adults & Children */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Adults</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
              className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              -
            </button>
            <span className="flex-1 text-center font-bold text-sm" style={{ color: NAVY }}>{formData.adults}</span>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, adults: p.adults + 1 }))}
              className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Children</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
              className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              -
            </button>
            <span className="flex-1 text-center font-bold text-sm" style={{ color: NAVY }}>{formData.children}</span>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, children: p.children + 1 }))}
              className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Duration & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>
            <Clock size={12} className="inline mr-1" style={{ color: GOLD }} />
            Duration
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition bg-white"
          >
            <option value="">Select duration</option>
            <option value="3-4 Days">3-4 Days</option>
            <option value="5-6 Days">5-6 Days</option>
            <option value="7-8 Days">7-8 Days</option>
            <option value="9-10 Days">9-10 Days</option>
            <option value="10+ Days">10+ Days</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>
            <Banknote size={12} className="inline mr-1" style={{ color: GOLD }} />
            Budget Range
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition bg-white"
          >
            <option value="">Select budget</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Special Requirements */}
      <div>
        <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>
          <MessageSquare size={12} className="inline mr-1" style={{ color: GOLD }} />
          Special Requirements
        </label>
        <textarea
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          rows={3}
          placeholder="Dietary needs, accessibility requirements, activities of interest..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-sm"
        style={{ background: `linear-gradient(135deg, ${NAVY}, #0d3a80)` }}
      >
        <Send size={16} />
        <span>Customize My Tour</span>
      </button>

      <p className="text-center text-[10px]" style={{ color: 'rgba(58,42,24,0.5)' }}>
        Your request will be sent via WhatsApp. Our team responds within 30 minutes during business hours.
      </p>
    </motion.form>
  )
}
