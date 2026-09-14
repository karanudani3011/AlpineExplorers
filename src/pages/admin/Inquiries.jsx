import { useEffect, useState } from 'react'
import { Inbox, Trash2, Search } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, EmptyState, Badge, NAVY, GOLD } from '../../components/admin/admin-ui'

const STATUSES = ['new', 'contacted', 'in_progress', 'converted', 'closed']
const fonts = { fontFamily: "'Inter'" }

export default function Inquiries() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState(null)

  const load = () => {
    const qs = new URLSearchParams()
    if (filter) qs.set('status', filter)
    if (search) qs.set('q', search)
    setLoading(true)
    api.get(`/inquiries?${qs.toString()}`).then((d) => setItems(d.inquiries || []))
      .catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }
  useEffect(load, [filter])

  const setStatus = async (id, status) => {
    try { await api.patch(`/inquiries/${id}/status`, { status }); addToast('Status updated'); load() }
    catch (e) { addToast(e.message, 'error') }
  }

  const remove = async (id) => {
    if (!confirm('Delete this inquiry?')) return
    try { await api.del(`/inquiries/${id}`); addToast('Deleted'); load() } catch (e) { addToast(e.message, 'error') }
  }

  return (
    <div>
      <PageHeader icon={Inbox} title="Inquiries" subtitle="Leads submitted through the website contact & inquiry forms" />

      <div className="mb-4 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['', ...STATUSES].map((s) => (
            <button key={s || 'all'} onClick={() => setFilter(s)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors"
              style={{ background: filter === s ? GOLD : 'rgba(0,26,77,0.05)', color: filter === s ? '#fff' : NAVY, border: '1px solid rgba(0,26,77,0.1)' }}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search…" style={{ ...fonts, padding: '8px 12px 8px 34px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.15)', width: '100%', fontSize: 13, outline: 'none' }} />
        </div>
      </div>

      <Card className="!p-0">
        {loading ? <Spinner /> : items.length === 0 ? <EmptyState title="No inquiries" subtitle="New form submissions will appear here" /> : (
          <div className="divide-y" style={{ borderColor: 'rgba(180,160,130,0.15)' }}>
            {items.map((x) => (
              <div key={x.id} className="px-5 py-4 hover:bg-black/[0.02] cursor-pointer" onClick={() => setViewing(x)}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-[13px]" style={{ color: NAVY }}>{x.name}</span>
                  <span className="text-[11px]" style={{ color: 'rgba(0,26,77,0.5)' }}>{x.email} {x.phone && `· ${x.phone}`}</span>
                  <span className="ml-auto text-[10px]" style={{ color: 'rgba(0,26,77,0.4)' }}>{x.created_at}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {x.destination && <Chip label="Destination" value={x.destination} />}
                  {x.package_name && <Chip label="Package" value={x.package_name} />}
                  {x.travel_date && <Chip label="Travel Date" value={x.travel_date} />}
                  {x.travelers && <Chip label="Travelers" value={x.travelers} />}
                  <select value={x.status} disabled={false}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { e.stopPropagation(); setStatus(x.id, e.target.value) }}
                    className="ml-auto rounded-full text-[10px] font-bold uppercase px-2 py-1 border outline-none"
                    style={{ background: '#fff', borderColor: 'rgba(0,26,77,0.2)', color: NAVY }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Btn variant="ghost" className="!px-2 !py-1" onClick={(e) => { e.stopPropagation(); remove(x.id) }}><Trash2 size={13} color="#8b2518" /></Btn>
                </div>
                {x.message && <p className="text-[12px] mt-2 line-clamp-2" style={{ color: 'rgba(58,42,24,0.7)' }}>{x.message}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(13,27,62,0.55)' }}>
          <div className="rounded-2xl bg-white w-full max-w-lg my-8 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ fontFamily: 'Cinzel', color: NAVY }}>Inquiry #{viewing.id}</h3>
              <button onClick={() => setViewing(null)} className="w-8 h-8 rounded-full hover:bg-black/5">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] mb-4">
              <View label="Name" value={viewing.name} />
              <View label="Email" value={viewing.email} />
              <View label="Phone" value={viewing.phone} />
              <View label="Destination" value={viewing.destination} />
              <View label="Package" value={viewing.package_name} />
              <View label="Travel Date" value={viewing.travel_date} />
              <View label="Travelers" value={viewing.travelers} />
              <View label="Date" value={viewing.created_at} />
            </div>
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase mb-1" style={{ color: 'rgba(0,26,77,0.5)' }}>Message</div>
              <p className="text-sm" style={{ color: 'rgba(58,42,24,0.8)' }}>{viewing.message || '—'}</p>
            </div>
            <div className="flex justify-between items-center">
              <Badge tone={viewing.status}>{viewing.status}</Badge>
              <Btn onClick={() => setViewing(null)}>Close</Btn>
            </div>
          </div>
        </div>
      )}
      <ToastHost />
    </div>
  )
}

function Chip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(197,155,39,0.12)', color: '#7a6210' }}>
      <b>{label}:</b> {value}
    </span>
  )
}
function View({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase" style={{ color: 'rgba(0,26,77,0.45)' }}>{label}</div>
      <div className="font-semibold" style={{ color: NAVY }}>{value || '—'}</div>
    </div>
  )
}