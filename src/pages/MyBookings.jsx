import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ticket, Calendar, Users, CreditCard, Clock, MapPin, Phone,
  Mail, MessageSquare, ArrowRight, Eye, X, AlertCircle, Loader2,
  RefreshCw, ChevronRight, CheckCircle2, Shield
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'
import { supabase } from '../services/supabaseClient'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const BROWN = '#3a2a18'

function formatINR(amount) {
  if (!amount || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase()
  const styles = {
    pending: { bg: 'rgba(212,175,55,0.15)', text: '#92400e', border: 'rgba(212,175,55,0.4)', label: 'Pending' },
    confirmed: { bg: 'rgba(16,185,129,0.12)', text: '#047857', border: 'rgba(16,185,129,0.35)', label: 'Confirmed' },
    cancelled: { bg: 'rgba(220,38,38,0.1)', text: '#b91c1c', border: 'rgba(220,38,38,0.3)', label: 'Cancelled' },
    completed: { bg: 'rgba(14,116,144,0.12)', text: '#0e7490', border: 'rgba(14,116,144,0.35)', label: 'Completed' },
  }
  const current = styles[s] || styles.pending

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: current.bg, color: current.text, border: `1px solid ${current.border}` }}
    >
      {current.label}
    </span>
  )
}

export default function MyBookings() {
  const { user } = useSupabaseAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchBookings = async () => {
    if (!user) return
    setLoading(true)
    try {
      // Supabase query with RLS: user only sees their own bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setBookings(data)
      } else {
        setBookings([])
      }
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'all') return true
    return (b.status || 'pending').toLowerCase() === filterStatus
  })

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'rgba(58,42,24,0.6)' }}>
          <Link to="/home" className="hover:underline" style={{ color: NAVY }}>Home</Link>
          <span>›</span>
          <span>My Bookings</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}
            >
              My Bookings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              View and manage your tour reservations with Alpine Explorers.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer"
            style={{ borderColor: 'rgba(0,26,77,0.2)', color: NAVY, backgroundColor: '#ffffff' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs font-bold">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className="px-4 py-2 rounded-xl transition cursor-pointer capitalize"
              style={{
                backgroundColor: filterStatus === st ? NAVY : '#ffffff',
                color: filterStatus === st ? '#ffffff' : NAVY,
                border: `1px solid ${filterStatus === st ? NAVY : 'rgba(180,160,130,0.3)'}`,
              }}
            >
              {st} {st === 'all' && `(${bookings.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: NAVY }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: NAVY }}>
              Loading your bookings...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center bg-white border"
            style={{ borderColor: 'rgba(180,160,130,0.3)', boxShadow: '0 4px 20px rgba(0,26,77,0.05)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(0,26,77,0.06)', color: NAVY }}
            >
              <Ticket size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
              No Bookings Found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              You don't have any bookings in this category yet. Explore our curated tours and start your next expedition!
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition"
              style={{ backgroundColor: NAVY }}
            >
              <span>Explore Tours</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <motion.div
                key={b.id || b.booking_reference}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border p-5 sm:p-6 transition hover:shadow-lg cursor-pointer"
                style={{ borderColor: 'rgba(180,160,130,0.35)' }}
                onClick={() => setSelectedBooking(b)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(0,26,77,0.08)', color: NAVY }}
                    >
                      <Ticket size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                        Reference
                      </p>
                      <h4 className="font-bold text-base" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
                        {b.booking_reference}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedBooking(b)
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1"
                      style={{ borderColor: 'rgba(0,26,77,0.2)', color: NAVY }}
                    >
                      <Eye size={13} /> Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Tour Name</span>
                    <span className="font-bold text-gray-900 block truncate">{b.tour_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Travel Date</span>
                    <span className="font-semibold text-gray-800 block">{formatDate(b.tour_date)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Travelers</span>
                    <span className="font-semibold text-gray-800 block">
                      {b.total_travelers} Traveler{b.total_travelers !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Total Amount</span>
                    <span className="font-bold text-base block" style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}>
                      {b.total_amount ? formatINR(b.total_amount) : 'On Request'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detailed Booking View Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
              style={{ backgroundColor: 'rgba(3, 9, 20, 0.72)', backdropFilter: 'blur(5px)' }}
              onClick={() => setSelectedBooking(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl my-auto"
                style={{ border: '1px solid rgba(212,175,55,0.4)' }}
              >
                {/* Header */}
                <div
                  className="px-6 py-5 text-white flex items-center justify-between"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, borderBottom: '2px solid rgba(212,175,55,0.5)' }}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD2 }}>
                      Booking Details
                    </p>
                    <h3 className="text-xl font-bold mt-0.5" style={{ fontFamily: 'Cinzel, serif' }}>
                      {selectedBooking.booking_reference}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs text-gray-700">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                      Booking Status:
                    </span>
                    <StatusBadge status={selectedBooking.status} />
                  </div>

                  {/* Tour Info */}
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-2.5" style={{ color: NAVY }}>
                      Tour Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Tour Name</span>
                        <span className="font-bold text-sm text-gray-900 block">{selectedBooking.tour_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Location</span>
                        <span className="font-semibold text-gray-800 block">{selectedBooking.tour_location || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Travel Date</span>
                        <span className="font-semibold text-gray-800 block">{formatDate(selectedBooking.tour_date)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Duration</span>
                        <span className="font-semibold text-gray-800 block">{selectedBooking.duration || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Traveler Info */}
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-2.5" style={{ color: NAVY }}>
                      Traveler Information
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Lead Traveler</span>
                        <span className="font-bold text-gray-900 block">{selectedBooking.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Email</span>
                        <span className="font-semibold text-gray-800 block truncate">{selectedBooking.customer_email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Mobile Phone</span>
                        <span className="font-semibold text-gray-800 block">{selectedBooking.customer_phone || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">WhatsApp</span>
                        <span className="font-semibold text-gray-800 block">{selectedBooking.whatsapp_number || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Adults</span>
                        <span className="font-semibold text-gray-800 block">{selectedBooking.adults || 1}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Children</span>
                        <span className="font-semibold text-gray-800 block">{selectedBooking.children || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-2.5" style={{ color: NAVY }}>
                      Pricing Breakdown
                    </h4>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 divide-y divide-gray-200">
                      <div className="flex justify-between py-1.5">
                        <span className="text-gray-500">Price per Person:</span>
                        <span className="font-semibold">{selectedBooking.price_per_person ? formatINR(selectedBooking.price_per_person) : 'On Request'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-gray-500">Total Travelers:</span>
                        <span className="font-semibold">{selectedBooking.total_travelers}</span>
                      </div>
                      <div className="flex justify-between py-2 pt-2.5 font-bold">
                        <span style={{ color: NAVY }}>Total Amount:</span>
                        <span className="text-base" style={{ color: GOLD, fontFamily: 'Cinzel, serif' }}>
                          {selectedBooking.total_amount ? formatINR(selectedBooking.total_amount) : 'On Request'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes & Special Requests */}
                  {(selectedBooking.special_requirements || selectedBooking.notes) && (
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-2.5" style={{ color: NAVY }}>
                        Special Requests & Notes
                      </h4>
                      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                        {selectedBooking.special_requirements && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Special Requirements</span>
                            <p className="text-xs text-gray-700 mt-0.5">{selectedBooking.special_requirements}</p>
                          </div>
                        )}
                        {selectedBooking.notes && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Notes</span>
                            <p className="text-xs text-gray-700 mt-0.5">{selectedBooking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-gray-400 pt-2 border-t text-center">
                    Booking created on {formatDate(selectedBooking.created_at)}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white transition"
                    style={{ backgroundColor: NAVY }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
