import { useEffect, useState, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FileText, Search, Filter, X, Download, Eye, FileSpreadsheet,
  ChevronDown, Loader2, AlertCircle, CheckCircle2
} from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, EmptyState, Badge, StatCard, NAVY, GOLD, GOLD2, BG, font } from '../../components/admin/admin-ui'
import { useAuth } from '../../contexts/AuthContext'

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']

export default function Bookings() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  
  const [bookings, setBookings] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTour, setFilterTour] = useState('')
  const [filterTravelDate, setFilterTravelDate] = useState('')
  const [filterBookingDate, setFilterBookingDate] = useState('')
  const [filterMinTravelers, setFilterMinTravelers] = useState('')
  const [filterMaxTravelers, setFilterMaxTravelers] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  const [pdfGenerating, setPdfGenerating] = useState(null)
  const [excelGenerating, setExcelGenerating] = useState(null)

  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      qs.set('page', page)
      qs.set('limit', limit)
      if (filterStatus) qs.set('status', filterStatus)
      if (search) qs.set('search', search)
      if (filterTour) qs.set('tour', filterTour)
      if (filterTravelDate) qs.set('travelDate', filterTravelDate)
      if (filterBookingDate) qs.set('bookingDate', filterBookingDate)
      if (filterMinTravelers) qs.set('minTravelers', filterMinTravelers)
      if (filterMaxTravelers) qs.set('maxTravelers', filterMaxTravelers)
      
      const data = await api.get(`/bookings?${qs.toString()}`)
      setBookings(data.bookings || [])
      setTotal(data.total || 0)
    } catch (e) {
      addToast('Unable to load booking information.', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, filterStatus, search, filterTour, filterTravelDate, filterBookingDate, filterMinTravelers, filterMaxTravelers])

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const data = await api.get('/bookings/stats')
      setStats(data)
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBookings()
    loadStats()
  }, [loadBookings, loadStats])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleFilterChange = () => {
    setPage(1)
  }

  const resetFilters = () => {
    setFilterStatus('')
    setFilterTour('')
    setFilterTravelDate('')
    setFilterBookingDate('')
    setFilterMinTravelers('')
    setFilterMaxTravelers('')
    setPage(1)
  }

  const hasActiveFilters = filterStatus || filterTour || filterTravelDate || filterBookingDate || filterMinTravelers || filterMaxTravelers

  const generatePdf = async (bookingId, type = 'booking') => {
    setPdfGenerating(bookingId)
    try {
      let url
      if (type === 'all') {
        url = `${api.BASE}/bookings/download/all/pdf`
      } else {
        url = `${api.BASE}/bookings/${bookingId}/download/pdf`
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${api.getToken()}` }
      })
      if (!res.ok) throw new Error('Failed to generate PDF')
      const blob = await res.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = type === 'all' ? 'all-bookings.pdf' : `booking-${bookingId}.pdf`
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      addToast('PDF downloaded successfully')
    } catch (e) {
      addToast('Unable to generate PDF. Please try again.', 'error')
    } finally {
      setPdfGenerating(null)
    }
  }

  const generateExcel = async (bookingId, type = 'booking') => {
    setExcelGenerating(bookingId)
    try {
      let url
      if (type === 'all') {
        url = `${api.BASE}/bookings/download/all/excel`
      } else {
        url = `${api.BASE}/bookings/${bookingId}/download/excel`
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${api.getToken()}` }
      })
      if (!res.ok) throw new Error('Failed to generate Excel')
      const blob = await res.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = type === 'all' ? 'all-bookings.xlsx' : `booking-${bookingId}.xlsx`
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      addToast('Excel downloaded successfully')
    } catch (e) {
      addToast('Unable to generate Excel. Please try again.', 'error')
    } finally {
      setExcelGenerating(null)
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return '—'
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    const tones = { pending: 'new', confirmed: 'active', cancelled: 'inactive', completed: 'converted' }
    return <Badge tone={tones[status] || 'new'}>{status}</Badge>
  }

  if (statsLoading && loading) return <Spinner />

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: font.body }}>
      <PageHeader
        icon={FileText}
        title="BOOKINGS & APPLICATIONS"
        subtitle="Manage customer bookings, traveler applications and risk certificates."
        actions={
          <div className="flex flex-wrap gap-2">
            {hasPermission('bookings.export_pdf') && (
              <Btn variant="ghostGold" onClick={() => generatePdf(null, 'all')} disabled={pdfGenerating === 'all' || excelGenerating === 'all'}>
                {pdfGenerating === 'all'
                  ? <><Loader2 size={14} className="animate-spin" /><span className="hidden sm:inline"> Generating…</span></>
                  : <><Download size={14} /><span className="hidden sm:inline"> PDF All</span><span className="sm:hidden">PDF</span></>}
              </Btn>
            )}
            {hasPermission('bookings.export_excel') && (
              <Btn variant="ghostGold" onClick={() => generateExcel(null, 'all')} disabled={pdfGenerating === 'all' || excelGenerating === 'all'}>
                {excelGenerating === 'all'
                  ? <><Loader2 size={14} className="animate-spin" /><span className="hidden sm:inline"> Generating…</span></>
                  : <><FileSpreadsheet size={14} /><span className="hidden sm:inline"> Excel All</span><span className="sm:hidden">XLS</span></>}
              </Btn>
            )}
          </div>
        }
      />

      {/* Stats Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="TOTAL BOOKINGS" value={stats.totalBookings} icon={FileText} accent={NAVY} />
          <StatCard label="TOTAL TRAVELERS" value={stats.totalTravelers} icon={CheckCircle2} accent="#15803d" />
          <StatCard label="PENDING APPLICATIONS" value={stats.pendingApplications} icon={AlertCircle} accent={GOLD} />
          <StatCard label="CONFIRMED BOOKINGS" value={stats.confirmedBookings} icon={CheckCircle2} accent="#166534" />
        </div>
      )}

      {/* Search & Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search bookings..."
              className="w-full px-10 py-2.5 rounded-xl border outline-none text-sm"
              style={{
                borderColor: 'rgba(0,26,77,0.15)',
                background: '#fff',
                color: NAVY,
                fontFamily: font.body
              }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide transition"
            style={{
              background: showFilters ? GOLD : 'white',
              color: showFilters ? NAVY : NAVY,
              border: `1.5px solid ${showFilters ? GOLD : 'rgba(0,26,77,0.15)'}`,
              fontFamily: font.body
            }}
          >
            <Filter size={15} /> Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pb-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: NAVY, fontFamily: font.body }}>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); handleFilterChange() }}
                className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                style={{ borderColor: 'rgba(0,26,77,0.15)', background: '#fff', color: NAVY, fontFamily: font.body }}
              >
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: NAVY, fontFamily: font.body }}>Tour</label>
              <input
                type="text"
                value={filterTour}
                onChange={(e) => { setFilterTour(e.target.value); handleFilterChange() }}
                placeholder="Tour name"
                className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                style={{ borderColor: 'rgba(0,26,77,0.15)', background: '#fff', color: NAVY, fontFamily: font.body }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: NAVY, fontFamily: font.body }}>Travel Date</label>
              <input
                type="date"
                value={filterTravelDate}
                onChange={(e) => { setFilterTravelDate(e.target.value); handleFilterChange() }}
                className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                style={{ borderColor: 'rgba(0,26,77,0.15)', background: '#fff', color: NAVY, fontFamily: font.body }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: NAVY, fontFamily: font.body }}>Booking Date</label>
              <input
                type="date"
                value={filterBookingDate}
                onChange={(e) => { setFilterBookingDate(e.target.value); handleFilterChange() }}
                className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                style={{ borderColor: 'rgba(0,26,77,0.15)', background: '#fff', color: NAVY, fontFamily: font.body }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: NAVY, fontFamily: font.body }}>Min Travelers</label>
              <input
                type="number"
                min="1"
                value={filterMinTravelers}
                onChange={(e) => { setFilterMinTravelers(e.target.value); handleFilterChange() }}
                placeholder="1"
                className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                style={{ borderColor: 'rgba(0,26,77,0.15)', background: '#fff', color: NAVY, fontFamily: font.body }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: NAVY, fontFamily: font.body }}>Max Travelers</label>
              <input
                type="number"
                min="1"
                value={filterMaxTravelers}
                onChange={(e) => { setFilterMaxTravelers(e.target.value); handleFilterChange() }}
                placeholder="10"
                className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                style={{ borderColor: 'rgba(0,26,77,0.15)', background: '#fff', color: NAVY, fontFamily: font.body }}
              />
            </div>
            {hasActiveFilters && (
              <div className="flex items-end sm:col-span-2 lg:col-span-6">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition"
                  style={{ color: '#8b2518', backgroundColor: 'rgba(139,37,24,0.08)', border: '1px solid rgba(139,37,24,0.3)' }}
                >
                  <X size={14} /> Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Booking Table */}
      <Card className="!p-0">
        {loading ? (
          <div className="p-8"><Spinner /></div>
        ) : bookings.length === 0 ? (
          search || hasActiveFilters ? (
            <EmptyState title="NO RESULTS FOUND" subtitle="Try another search or remove filters." />
          ) : (
            <EmptyState title="NO BOOKINGS YET" subtitle="No application bookings have been received." />
          )
        ) : (
          <>
            {/* ── Mobile card list (< md) ── */}
            <div className="md:hidden divide-y" style={{ borderColor: 'rgba(180,160,130,0.1)' }}>
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[13px] truncate" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>{booking.booking_id}</p>
                      <p className="text-sm font-medium mt-0.5 line-clamp-1" style={{ color: NAVY }}>{booking.tour_name}</p>
                    </div>
                    <div className="flex-shrink-0">{getStatusBadge(booking.status)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs mb-3" style={{ color: 'rgba(58,42,24,0.7)', fontFamily: font.body }}>
                    <span><b>Booked:</b> {formatDate(booking.booking_date)}</span>
                    <span><b>Travel:</b> {formatDate(booking.travel_date)}</span>
                    <span><b>Travelers:</b> {booking.number_of_travelers}</span>
                    <span style={{ color: GOLD }}><b>Amount:</b> {formatCurrency(booking.total_amount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NavLink
                      to={`/admin/bookings/${booking.id}`}
                      className="flex-1 py-2 text-center rounded-xl text-xs font-bold transition"
                      style={{ background: 'rgba(0,26,77,0.08)', color: NAVY }}
                    >
                      View Details
                    </NavLink>
                    {hasPermission('bookings.export_pdf') && (
                      <button
                        onClick={() => generatePdf(booking.id)}
                        disabled={pdfGenerating === booking.id || excelGenerating === booking.id}
                        className="p-2.5 rounded-xl transition"
                        style={{ background: 'rgba(197,155,39,0.12)', color: NAVY, minWidth: 44, minHeight: 44 }}
                        title={pdfGenerating === booking.id ? 'Generating PDF…' : 'Download PDF'}
                      >
                        {pdfGenerating === booking.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={15} />}
                      </button>
                    )}
                    {hasPermission('bookings.export_excel') && (
                      <button
                        onClick={() => generateExcel(booking.id)}
                        disabled={excelGenerating === booking.id || pdfGenerating === booking.id}
                        className="p-2.5 rounded-xl transition"
                        style={{ background: 'rgba(22,163,74,0.12)', color: '#166534', minWidth: 44, minHeight: 44 }}
                        title={excelGenerating === booking.id ? 'Generating Excel…' : 'Download Excel'}
                      >
                        {excelGenerating === booking.id ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={15} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table (md+) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full" style={{ fontFamily: font.body }}>
                <thead>
                  <tr className="text-left" style={{ borderBottom: '1px solid rgba(180,160,130,0.15)' }}>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>BOOKING ID</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>TOUR</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>BOOKING DATE</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>TRAVEL DATE</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>TRAVELERS</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>TOTAL AMOUNT</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>STATUS</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,26,77,0.5)', fontFamily: font.body }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(180,160,130,0.1)' }}>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="px-5 py-4 font-bold text-[13px]" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>{booking.booking_id}</td>
                      <td className="px-5 py-4 text-sm max-w-xs truncate" style={{ color: NAVY }}>{booking.tour_name}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: 'rgba(58,42,24,0.7)' }}>{formatDate(booking.booking_date)}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: 'rgba(58,42,24,0.7)' }}>{formatDate(booking.travel_date)}</td>
                      <td className="px-5 py-4 text-sm font-semibold" style={{ color: NAVY }}>{booking.number_of_travelers} Traveler{booking.number_of_travelers > 1 ? 's' : ''}</td>
                      <td className="px-5 py-4 text-sm font-bold" style={{ color: GOLD }}>{formatCurrency(booking.total_amount)}</td>
                      <td className="px-5 py-4">{getStatusBadge(booking.status)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <NavLink
                            to={`/admin/bookings/${booking.id}`}
                            className="p-2 rounded-xl transition"
                            style={{ background: 'rgba(0,26,77,0.08)', color: NAVY }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = NAVY }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,26,77,0.08)'; e.currentTarget.style.color = NAVY }}
                            title="View"
                          >
                            <Eye size={15} />
                          </NavLink>
                          {hasPermission('bookings.export_pdf') && (
                            <button
                              onClick={() => generatePdf(booking.id)}
                              disabled={pdfGenerating === booking.id || excelGenerating === booking.id}
                              className="p-2 rounded-xl transition"
                              style={{ background: 'rgba(197,155,39,0.12)', color: NAVY }}
                              onMouseEnter={(e) => { if (pdfGenerating !== booking.id) { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = NAVY }}}
                              onMouseLeave={(e) => { if (pdfGenerating !== booking.id) { e.currentTarget.style.background = 'rgba(197,155,39,0.12)'; e.currentTarget.style.color = NAVY }}}
                              title={pdfGenerating === booking.id ? "Generating PDF..." : "Download PDF"}
                            >
                              {pdfGenerating === booking.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={15} />}
                            </button>
                          )}
                          {hasPermission('bookings.export_excel') && (
                            <button
                              onClick={() => generateExcel(booking.id)}
                              disabled={excelGenerating === booking.id || pdfGenerating === booking.id}
                              className="p-2 rounded-xl transition"
                              style={{ background: 'rgba(22,163,74,0.12)', color: '#166534' }}
                              onMouseEnter={(e) => { if (excelGenerating !== booking.id) { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff' }}}
                              onMouseLeave={(e) => { if (excelGenerating !== booking.id) { e.currentTarget.style.background = 'rgba(22,163,74,0.12)'; e.currentTarget.style.color = '#166534' }}}
                              title={excelGenerating === booking.id ? "Generating Excel..." : "Download Excel"}
                            >
                              {excelGenerating === booking.id ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={15} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {!loading && bookings.length > 0 && total > limit && (
          <div className="px-5 py-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(180,160,130,0.15)' }}>
            <p className="text-sm" style={{ color: 'rgba(58,42,24,0.7)', fontFamily: font.body }}>
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} bookings
            </p>
            <div className="flex items-center gap-2">
              <Btn variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronDown size={14} className="rotate-180" />
              </Btn>
              <span className="px-3 text-sm font-bold" style={{ color: NAVY, fontFamily: font.body }}>Page {page} of {Math.ceil(total / limit)}</span>
              <Btn variant="ghost" size="sm" onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))} disabled={page >= Math.ceil(total / limit)}>
                <ChevronDown size={14} />
              </Btn>
            </div>
          </div>
        )}
      </Card>

      <ToastHost />
    </div>
  )
}