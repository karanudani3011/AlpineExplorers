import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Loader2, Calendar, Edit3, Check } from 'lucide-react'
import { api } from '../../services/api'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'
const fn = { fontFamily: "'Inter', sans-serif" }

const inp = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid rgb(var(--ae-navy-rgb) /0.18)',
  fontFamily: "'Inter', sans-serif", fontSize: 13, background: '#fff', outline: 'none',
}

function Notice({ type, msg, onDismiss }) {
  if (!msg) return null
  const c = type === 'error'
    ? { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' }
    : { bg: '#f0fdf4', border: '#86efac', color: '#166534' }
  return (
    <div style={{ ...fn, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 12, marginBottom: 12 }}>
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.color, fontSize: 16 }}>×</button>
    </div>
  )
}

function DayRow({ day, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: day.title, description: day.description || '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try { await onSave({ day: day.day, ...form }); setEditing(false) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ borderRadius: 8, border: '1px solid rgba(180,160,130,0.25)', background: editing ? 'rgb(var(--ae-gold-rgb) /0.04)' : '#fff', marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
        <span style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,var(--ae-gold),var(--ae-gold2))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
          D{day.day}
        </span>
        {editing
          ? <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Day title..." style={{ ...inp, flex: 1, padding: '6px 10px' }} />
          : <span style={{ ...fn, flex: 1, fontSize: 13, fontWeight: 600, color: NAVY }}>{day.title}</span>
        }
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {editing ? (
            <>
              <button onClick={save} disabled={saving} style={{ border: 'none', background: '#166534', color: '#fff', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Check size={12} />
              </button>
              <button onClick={() => setEditing(false)} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', fontSize: 14 }}>
                ×
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={{ border: '1px solid rgba(180,160,130,0.35)', background: '#fff', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: NAVY }}>
              <Edit3 size={12} />
            </button>
          )}
          <button onClick={() => onDelete(day.day)} style={{ border: '1px solid #fca5a5', background: '#fef2f2', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#991b1b' }}>
            <Trash2 size={11} />
          </button>
        </div>
      </div>
      {editing && (
        <div style={{ padding: '0 12px 10px' }}>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Activities and description..." style={{ ...inp, resize: 'vertical' }} />
        </div>
      )}
      {!editing && day.description && (
        <div style={{ padding: '0 12px 10px 48px', ...fn, fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{day.description}</div>
      )}
    </div>
  )
}

function PackagePanel({ pkg, tourType, tourId, onRefresh }) {
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [addingDay, setAddingDay] = useState(false)
  const [newDay, setNewDay] = useState({ title: '', description: '' })

  const itinerary = Array.isArray(pkg.itinerary) ? [...pkg.itinerary].sort((a, b) => a.day - b.day) : []

  const showNotice = (type, msg) => {
    setNotice({ type, msg })
    if (type === 'success') setTimeout(() => setNotice(null), 3000)
  }

  const saveDay = async (dayData) => {
    try {
      await api.post(`/api/admin/packages/${pkg.id}/itinerary`, dayData)
      onRefresh()
      showNotice('success', `Day ${dayData.day} saved`)
    } catch (e) { showNotice('error', e.message) }
  }

  const deleteDay = async (day) => {
    if (!window.confirm(`Delete Day ${day} from "${pkg.duration}"?`)) return
    try {
      await api.del(`/api/admin/packages/${pkg.id}/itinerary/${day}`)
      onRefresh()
      showNotice('success', `Day ${day} removed`)
    } catch (e) { showNotice('error', e.message) }
  }

  const addDay = async () => {
    if (!newDay.title.trim()) { showNotice('error', 'Day title is required'); return }
    const nextDay = itinerary.length > 0 ? Math.max(...itinerary.map(d => d.day)) + 1 : 1
    setSaving(true)
    try {
      await api.post(`/api/admin/packages/${pkg.id}/itinerary`, { day: nextDay, ...newDay })
      setNewDay({ title: '', description: '' })
      setAddingDay(false)
      onRefresh()
      showNotice('success', `Day ${nextDay} added`)
    } catch (e) { showNotice('error', e.message) } finally { setSaving(false) }
  }

  const deletePkg = async () => {
    if (!window.confirm(`Delete duration "${pkg.duration}" and all ${itinerary.length} itinerary days?`)) return
    setDeleting(true)
    try {
      await api.del(`/api/admin/packages/${pkg.id}`)
      onRefresh()
    } catch (e) { showNotice('error', e.message); setDeleting(false) }
  }

  return (
    <div style={{ borderRadius: 10, border: `1.5px solid ${open ? 'rgb(var(--ae-gold-rgb) /0.45)' : 'rgba(180,160,130,0.3)'}`, background: '#fff', marginBottom: 10, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: open ? 'rgb(var(--ae-gold-rgb) /0.05)' : '#fff', border: 'none', cursor: 'pointer', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}
      >
        <span style={{ background: 'linear-gradient(135deg,var(--ae-navy),#1a3c7e)', color: '#fff', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
          {pkg.duration}
        </span>
        <span style={{ ...fn, fontSize: 12, color: '#6b7280', flex: 1 }}>
          {itinerary.length} day{itinerary.length !== 1 ? 's' : ''} planned
          {pkg.price ? ` · ₹${Number(pkg.price).toLocaleString('en-IN')}` : ''}
          {pkg.is_default ? ' · ⭐ Default' : ''}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={e => { e.stopPropagation(); deletePkg() }}
            disabled={deleting}
            style={{ border: '1px solid #fca5a5', background: '#fef2f2', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#991b1b' }}
          >
            {deleting ? <Loader2 size={11} /> : <Trash2 size={11} />}
          </button>
          {open ? <ChevronUp size={15} style={{ color: GOLD }} /> : <ChevronDown size={15} style={{ color: NAVY }} />}
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 14px 14px' }}>
          {notice && <Notice type={notice.type} msg={notice.msg} onDismiss={() => setNotice(null)} />}

          <div style={{ ...fn, fontSize: 11, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, marginTop: 4 }}>
            Day-Wise Itinerary
          </div>

          {itinerary.length === 0 && (
            <p style={{ ...fn, fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>No itinerary days yet. Add the first day below.</p>
          )}

          {itinerary.map(day => (
            <DayRow key={day.id || day.day} day={day} onSave={saveDay} onDelete={deleteDay} />
          ))}

          {addingDay ? (
            <div style={{ borderRadius: 8, border: '1px dashed rgb(var(--ae-gold-rgb) /0.5)', background: 'rgb(var(--ae-gold-rgb) /0.03)', padding: 12, marginTop: 6 }}>
              <div style={{ ...fn, fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Add Day {itinerary.length > 0 ? Math.max(...itinerary.map(d => d.day)) + 1 : 1}
              </div>
              <input
                value={newDay.title}
                onChange={e => setNewDay(f => ({ ...f, title: e.target.value }))}
                placeholder="Day title (required)"
                style={{ ...inp, marginBottom: 6 }}
              />
              <textarea
                value={newDay.description}
                onChange={e => setNewDay(f => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Activities and description..."
                style={{ ...inp, resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setAddingDay(false); setNewDay({ title: '', description: '' }) }}
                  style={{ ...fn, border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12, color: '#6b7280' }}
                >
                  Cancel
                </button>
                <button
                  onClick={addDay}
                  disabled={saving}
                  style={{ ...fn, border: 'none', background: 'linear-gradient(90deg,var(--ae-gold),var(--ae-gold2))', color: NAVY, borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  {saving ? <Loader2 size={12} /> : <Save size={12} />} Save Day
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingDay(true)}
              style={{ ...fn, marginTop: 6, width: '100%', border: '1px dashed rgba(180,160,130,0.5)', background: 'transparent', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 12, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            >
              <Plus size={13} /> Add Day {itinerary.length > 0 ? Math.max(...itinerary.map(d => d.day)) + 1 : 1}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function NewPackageForm({ tourType, tourId, tourSlug, onSave, onCancel }) {
  const [form, setForm] = useState({ duration: '', days: '', nights: '', price: '', original_price: '', is_default: false })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = k => v => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.duration.trim()) { setErr('Duration label is required (e.g. 5N/6D)'); return }
    if (!form.days || isNaN(Number(form.days)) || Number(form.days) <= 0) { setErr('Enter valid number of days'); return }
    setSaving(true); setErr('')
    try {
      await api.post(`/api/admin/tours/${tourType}/${tourId}/packages`, {
        duration: form.duration.trim(),
        days: Number(form.days),
        nights: form.nights !== '' ? Number(form.nights) : Number(form.days) - 1,
        price: form.price !== '' ? Number(form.price) : null,
        original_price: form.original_price !== '' ? Number(form.original_price) : null,
        is_default: form.is_default,
        tour_slug: tourSlug,
      })
      onSave()
    } catch (e) { setErr(e.message) } finally { setSaving(false) }
  }

  const fields = [
    { label: 'Duration Label *', key: 'duration', type: 'text', placeholder: 'e.g. 5N/6D' },
    { label: 'Days *', key: 'days', type: 'number', placeholder: '6' },
    { label: 'Nights', key: 'nights', type: 'number', placeholder: '5 (auto)' },
    { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '52000' },
    { label: 'Original Price (₹)', key: 'original_price', type: 'number', placeholder: '68000' },
  ]

  return (
    <div style={{ borderRadius: 10, border: '1.5px dashed rgb(var(--ae-gold-rgb) /0.5)', background: 'rgb(var(--ae-gold-rgb) /0.03)', padding: 14, marginBottom: 10 }}>
      <div style={{ ...fn, fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        New Duration Package
      </div>
      {err && <Notice type="error" msg={err} onDismiss={() => setErr('')} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label style={{ ...fn, fontSize: 10, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 3 }}>
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={e => set(key)(e.target.value)}
              placeholder={placeholder}
              style={inp}
            />
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
          <input
            type="checkbox"
            id="is_default_new"
            checked={form.is_default}
            onChange={e => set('is_default')(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          <label htmlFor="is_default_new" style={{ ...fn, fontSize: 12, color: NAVY, cursor: 'pointer' }}>
            Set as default duration
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{ ...fn, border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 12, color: '#6b7280' }}
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          style={{ ...fn, border: 'none', background: 'linear-gradient(90deg,var(--ae-navy),#1a3c7e)', color: '#fff', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}
        >
          {saving ? <Loader2 size={12} /> : <Plus size={12} />} Create Duration
        </button>
      </div>
    </div>
  )
}

export default function TourDurationsManager({ tourId, tourType, tourSlug }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [notice, setNotice] = useState(null)

  const load = useCallback(async () => {
    if (!tourId || !tourType) return
    setLoading(true)
    try {
      const data = await api.get(`/api/admin/tours/${tourType}/${tourId}/packages`)
      setPackages(data.packages || [])
    } catch (e) {
      setNotice({ type: 'error', msg: e.message })
    } finally { setLoading(false) }
  }, [tourId, tourType])

  useEffect(() => { load() }, [load])

  if (!tourId || !tourType) return null

  return (
    <div style={{ marginTop: 20, padding: '18px 20px', borderRadius: 14, border: '1.5px solid rgb(var(--ae-gold-rgb) /0.35)', background: 'linear-gradient(to bottom,rgb(var(--ae-gold-rgb) /0.04),#fff)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,rgb(var(--ae-gold-rgb) /0.2),rgb(var(--ae-gold2-rgb) /0.1))', border: '1px solid rgb(var(--ae-gold-rgb) /0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={15} style={{ color: GOLD }} />
          </div>
          <div>
            <div style={{ ...fn, fontSize: 13, fontWeight: 700, color: NAVY }}>Duration Packages & Itineraries</div>
            <div style={{ ...fn, fontSize: 11, color: '#9ca3af' }}>
              {packages.length} duration{packages.length !== 1 ? 's' : ''} configured
            </div>
          </div>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            style={{ ...fn, border: 'none', background: 'linear-gradient(90deg,var(--ae-gold),var(--ae-gold2))', color: NAVY, borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Plus size={13} /> Add Duration
          </button>
        )}
      </div>

      {notice && <Notice type={notice.type} msg={notice.msg} onDismiss={() => setNotice(null)} />}

      {adding && (
        <NewPackageForm
          tourType={tourType}
          tourId={tourId}
          tourSlug={tourSlug}
          onSave={() => { setAdding(false); load() }}
          onCancel={() => setAdding(false)}
        />
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <Loader2 size={20} style={{ color: GOLD }} />
        </div>
      )}

      {!loading && packages.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', ...fn, fontSize: 12 }}>
          No duration packages yet. Click "Add Duration" to get started.
        </div>
      )}

      {!loading && packages.map(pkg => (
        <PackagePanel
          key={pkg.id}
          pkg={pkg}
          tourType={tourType}
          tourId={tourId}
          tourSlug={tourSlug}
          onRefresh={load}
        />
      ))}
    </div>
  )
}
