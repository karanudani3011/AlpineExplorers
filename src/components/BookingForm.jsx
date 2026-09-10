import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { serviceTours, serviceCategories } from '../data/servicesData'
import { ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  display: { fontFamily: 'Playfair Display, serif' },
}

function formatINR(amount) {
  if (!amount || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function findTourById(id) {
  for (const category of Object.keys(serviceTours)) {
    const found = serviceTours[category].find((t) => t.id === id)
    if (found) {
      const cat = serviceCategories.find((c) => c.slug === category)
      return { tour: found, category: cat }
    }
  }
  return { tour: null, category: null }
}

export default function BookingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tour, category } = findTourById(id)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    travelers: 1,
    specialRequest: '',
  })

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: CREAM }}>
        <Navbar />
        <div className="text-center py-32">
          <h1 className="text-3xl font-bold mb-4" style={{ color: NAVY, ...font.vintage }}>
            Tour Not Found
          </h1>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{ backgroundColor: NAVY }}
          >
            Browse Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    setCurrentStep(4)
  }

  const steps = [
    { number: 1, title: 'Registration', description: 'Your details' },
    { number: 2, title: 'Booking Details', description: 'Tour info' },
    { number: 3, title: 'Payment', description: 'Secure checkout' },
    { number: 4, title: 'Confirmation', description: 'Done!' },
  ]

  const hasPrice = tour.price > 0
  const totalPrice = hasPrice ? tour.price * formData.travelers : null
  const formattedTotal = formatINR(totalPrice)
  const formattedPerPerson = formatINR(tour.price)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center flex-1"
              >
                <div
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all"
                  style={{
                    background: step.number <= currentStep
                      ? `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`
                      : '#e5e7eb',
                    color: step.number <= currentStep ? 'white' : '#6b7280',
                    boxShadow: step.number <= currentStep ? '0 4px 12px rgba(0,26,77,0.3)' : 'none',
                  }}
                >
                  {step.number < currentStep ? (
                    <CheckCircle2 size={20} className="text-white" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className="font-semibold text-xs text-gray-900">{step.title}</p>
                  <p className="text-[11px] text-gray-500">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-3 rounded-full transition"
                    style={{
                      background: step.number < currentStep
                        ? `linear-gradient(to right, ${NAVY}, ${NAVY_MID})`
                        : '#e5e7eb',
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8"
          >
            {/* Step 1: Registration */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                  Your Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Booking Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                  Booking Details
                </h2>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Number of Travelers</label>
                  <input
                    type="number"
                    name="travelers"
                    min="1"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: BROWN }}>Special Requirements</label>
                  <textarea
                    name="specialRequest"
                    value={formData.specialRequest}
                    onChange={handleInputChange}
                    placeholder="Dietary needs, accessibility requirements, activities of interest..."
                    rows="3"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold" style={{ ...font.vintage, color: NAVY }}>
                  Secure Checkout
                </h2>

                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(197,155,39,0.06)', border: '1px solid rgba(197,155,39,0.15)' }}>
                  <p className="text-sm" style={{ color: BROWN }}>
                    Tour: <span className="font-bold" style={{ color: NAVY }}>{tour.title}</span>
                  </p>
                  <p className="text-sm mt-1" style={{ color: BROWN }}>
                    Total: <span className="font-bold text-lg" style={{ color: NAVY }}>{formattedTotal || 'On Request'}</span>
                  </p>
                </div>

                <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'rgba(0,26,77,0.03)', border: '1px dashed rgba(0,26,77,0.15)' }}>
                  <p className="text-sm font-bold mb-2" style={{ color: NAVY }}>Secure Payment</p>
                  <p className="text-xs" style={{ color: 'rgba(58,42,24,0.6)' }}>
                    Payment processing is handled securely. After submitting your booking, our team will contact you with payment details.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-800 font-medium">
                    ✓ Your booking details are encrypted and secure<br/>
                    ✓ No payment will be charged until confirmed<br/>
                    ✓ Free cancellation up to 30 days before travel
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
                >
                  <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ ...font.vintage, color: NAVY }}>
                  Booking Confirmed!
                </h2>
                <p className="text-sm mb-6" style={{ color: BROWN }}>
                  Your booking has been received. A confirmation will be sent to {formData.email || 'your email'}
                </p>

                <div className="p-5 rounded-xl text-left max-w-md mx-auto mb-6" style={{ backgroundColor: 'rgba(197,155,39,0.06)', border: '1px solid rgba(197,155,39,0.15)' }}>
                  <h3 className="font-bold text-sm mb-3" style={{ color: NAVY }}>Booking Summary</h3>
                  <div className="space-y-1.5 text-xs" style={{ color: BROWN }}>
                    <p><strong>Tour:</strong> {tour.title}</p>
                    <p><strong>Travelers:</strong> {formData.travelers}</p>
                    <p><strong>Travel Date:</strong> {formData.travelDate || 'To be confirmed'}</p>
                    <p><strong>Total:</strong> {formattedTotal || 'On Request'}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/home')}
                  className="px-8 py-3 rounded-xl font-bold text-sm text-white transition"
                  style={{ backgroundColor: NAVY }}
                >
                  Back to Home
                </button>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={currentStep === 3 ? handleSubmit : handleNext}
                  className="flex-1 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})` }}
                >
                  {currentStep === 3 ? 'Complete Booking' : 'Next'}
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>

          {/* Sidebar - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-5">
              <h3 className="font-bold text-base mb-4" style={{ fontFamily: 'Cinzel, serif', color: NAVY }}>
                Order Summary
              </h3>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <img src={tour.image} alt={tour.title} className="w-full h-36 object-cover rounded-xl" />
                <div>
                  <p className="font-bold text-sm" style={{ color: NAVY }}>{tour.title}</p>
                  <p className="text-[11px]" style={{ color: BROWN }}>{tour.location}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-xs" style={{ color: BROWN }}>
                  <span>Price per person:</span>
                  <span className="font-bold">{formattedPerPerson || 'On Request'}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: BROWN }}>
                  <span>Travelers:</span>
                  <span className="font-bold">{formData.travelers}</span>
                </div>

                {formattedTotal && (
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-sm" style={{ color: NAVY }}>Total:</span>
                    <span className="font-bold text-lg" style={{ color: NAVY }}>{formattedTotal}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-1.5 text-[11px]" style={{ color: 'rgba(58,42,24,0.6)' }}>
                <p>✓ Free cancellation</p>
                <p>✓ Secure payment</p>
                <p>✓ 24/7 support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
