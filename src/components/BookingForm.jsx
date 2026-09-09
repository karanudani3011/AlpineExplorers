import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { getTour, getCatalog, formatPrice } from '../services/catalog'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

export default function BookingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState(null)

  useEffect(() => {
    let mounted = true
    getTour(id).then((t) => {
      if (!mounted) return
      if (t) setTour(t)
      else getCatalog().then((all) => mounted && setTour(all[0] || null))
    })
    return () => { mounted = false }
  }, [id])
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    travelers: 1,
    specialRequest: '',
  })

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Tour not found</h1>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log('Booking submitted:', formData)
    setCurrentStep(4)
  }

  const steps = [
    { number: 1, title: 'Registration', description: 'Your details' },
    { number: 2, title: 'Booking Details', description: 'Tour info' },
    { number: 3, title: 'Payment', description: 'Payment info' },
    { number: 4, title: 'Confirmation', description: 'Done!' },
  ]

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-32">
          <p className="text-gray-500 font-bold">Loading booking details…</p>
        </div>
      </div>
    )
  }

  const totalPrice = tour.price > 0 ? tour.price * formData.travelers : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center flex-1"
              >
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step.number <= currentStep
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number < currentStep ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition ${
                      step.number < currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8"
          >
            {/* Step 1: Registration */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
                  Your Information
                </h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
                  Booking Details
                </h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Number of Travelers</label>
                  <input
                    type="number"
                    name="travelers"
                    min="1"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Special Request</label>
                  <textarea
                    name="specialRequest"
                    value={formData.specialRequest}
                    onChange={handleInputChange}
                    placeholder="Any special requests or dietary requirements?"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <p className="text-gray-700 mb-2">Tour: <span className="font-bold">{tour.title}</span></p>
                  <p className="text-gray-700 mb-4">Total Price: <span className="font-bold text-2xl text-blue-600">{totalPrice !== null ? `$${totalPrice}` : 'On Request'}</span></p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Card Holder Name</label>
                  <input
                    type="text"
                    placeholder="Full name on card"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Your booking has been confirmed. A confirmation email has been sent to {formData.email}
                </p>

                <div className="bg-green-50 p-6 rounded-lg mb-8 text-left">
                  <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Tour:</strong> {tour.title}</p>
                    <p><strong>Travelers:</strong> {formData.travelers}</p>
                    <p><strong>Travel Date:</strong> {formData.travelDate}</p>
                    <p><strong>Total Cost:</strong> {totalPrice !== null ? `$${totalPrice}` : 'On Request'}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/home')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Back to Home
                </button>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={currentStep === 3 ? handleSubmit : handleNext}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition flex items-center justify-center gap-2"
                >
                  {currentStep === 3 ? 'Complete Booking' : 'Next'}
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>

          {/* Sidebar - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-display font-bold text-xl text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 pb-6 border-b border-gray-200">
                <img src={tour.image} alt={tour.title} className="w-full h-40 object-cover rounded-lg" />
                <div>
                  <p className="font-bold text-gray-900">{tour.title}</p>
                  <p className="text-sm text-gray-600">{tour.location}</p>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <div className="flex justify-between text-gray-700">
                  <span>Price per person:</span>
                  <span className="font-bold">${tour.price > 0 ? tour.price : 'On Request'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Number of travelers:</span>
                  <span className="font-bold">{formData.travelers}</span>
                </div>

                {totalPrice !== null && (
                <div className="flex justify-between text-gray-700 pt-3 border-t border-gray-200">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-2xl text-blue-600">${totalPrice}</span>
                </div>
                )}
              </div>

              <div className="mt-6 text-sm text-gray-600 space-y-2">
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
