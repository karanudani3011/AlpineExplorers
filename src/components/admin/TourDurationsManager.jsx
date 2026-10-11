import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Loader2, Calendar, Eye, Copy, ArrowUp, ArrowDown, X } from 'lucide-react'
import { api } from '../../services/api'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'
const fn = { fontFamily: "'Inter', sans-serif" }
const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid rgb(var(--ae-navy-rgb) /0.18)', fontFamily: "'Inter', sans-serif", fontSize: 13, background: '#fff', outline: 'none' }
const blankDay = (day) => ({ day, title: '', summary: '', description: '', places: [], activities: [], start_time: '', end_time: '', meals: [], overnight: '', transportation: '', image_urls: [], notes: '', map_location: '', latitude: '', longitude: '', is_visible: true })
const listText = (value) => (Array.isArray(value) ? value : []).join('\n')
const listValue = (value) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean)
const normalize = (days) => (days || []).map((day, index) => ({ ...blankDay(index + 1), ...day, day: index + 1, is_visible: day.is_visible !== false && day.is_visible !== 0 }))
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function Notice({ type, msg, onDismiss }) {
  if (!msg) return null
  const c = type === 'error' ? { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' } : { bg: '#f0fdf4', border: '#86efac', color: '#166534' }
  return <div role="status" style={{ ...fn, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 12, marginBottom: 12 }}><span style={{ flex: 1 }}>{msg}</span><button type="button" onClick={onDismiss} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.color, fontSize: 16 }}>×</button></div>
}

function Field({ label, value, onChange, multiline = false, rows = 2, type = 'text', placeholder = '' }) {
  const common = { value: value ?? '', onChange: (event) => onChange(event.target.value), placeholder, style: inp }
  return <label style={{ ...fn, display: 'block', fontSize: 10, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}{multiline ? <textarea {...common} rows={rows} style={{ ...inp, display: 'block', marginTop: 4, resize: 'vertical', textTransform: 'none' }} /> : <input {...common} type={type} style={{ ...inp, display: 'block', marginTop: 4, textTransform: 'none' }} />}</label>
}

function DayEditor({ day, index, count, update, move, duplicate, remove, onPreview }) {
  const [open, setOpen] = useState(true)
  const set = (key, value) => update(index, { ...day, [key]: value })
  return <section style={{ border: '1px solid rgba(180,160,130,.3)', borderRadius: 10, background: '#fff', marginBottom: 9, overflow: 'hidden' }}>
    <header style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgb(var(--ae-gold-rgb) /0.04)' }}>
      <span style={{ background: `linear-gradient(135deg,${NAVY},#1a3c7e)`, color: '#fff', borderRadius: 6, padding: '5px 9px', fontSize: 11, fontWeight: 700 }}>Day {index + 1}</span>
      <button type="button" onClick={() => setOpen((value) => !value)} style={{ flex: 1, textAlign: 'left', border: 0, background: 'transparent', color: NAVY, fontWeight: 700, cursor: 'pointer' }}>{day.title || 'Untitled itinerary day'}</button>
      <label title="Show to visitors" style={{ ...fn, fontSize: 11, display: 'flex', gap: 5, alignItems: 'center' }}><input type="checkbox" checked={day.is_visible} onChange={(event) => set('is_visible', event.target.checked)} /> Visible</label>
      <button type="button" onClick={() => move(index, -1)} disabled={index === 0} title="Move up" style={iconButton}><ArrowUp size={13} /></button>
      <button type="button" onClick={() => move(index, 1)} disabled={index === count - 1} title="Move down" style={iconButton}><ArrowDown size={13} /></button>
      <button type="button" onClick={() => duplicate(index)} title="Duplicate day" style={iconButton}><Copy size={13} /></button>
      <button type="button" onClick={onPreview} title="Preview day" style={iconButton}><Eye size={13} /></button>
      <button type="button" onClick={() => remove(index)} title="Delete day" style={{ ...iconButton, color: '#991b1b', borderColor: '#fca5a5' }}><Trash2 size={13} /></button>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Collapse day' : 'Expand day'} style={iconButton}>{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
    </header>
    {open && <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 9 }}>
      <Field label="Day title *" value={day.title} onChange={(value) => set('title', value)} placeholder="Arrival in Ladakh" />
      <Field label="Short summary" value={day.summary} onChange={(value) => set('summary', value)} />
      <Field label="Detailed description" value={day.description} onChange={(value) => set('description', value)} multiline rows={3} />
      <Field label="Places / destinations (one per line)" value={listText(day.places)} onChange={(value) => set('places', listValue(value))} multiline />
      <Field label="Activities (one per line)" value={listText(day.activities)} onChange={(value) => set('activities', listValue(value))} multiline />
      <Field label="Meals (one per line)" value={listText(day.meals)} onChange={(value) => set('meals', listValue(value))} multiline />
      <Field label="Start time" value={day.start_time} onChange={(value) => set('start_time', value)} type="time" />
      <Field label="End time" value={day.end_time} onChange={(value) => set('end_time', value)} type="time" />
      <Field label="Accommodation / hotel" value={day.overnight} onChange={(value) => set('overnight', value)} />
      <Field label="Transportation" value={day.transportation} onChange={(value) => set('transportation', value)} />
      <Field label="Image URLs (one per line)" value={listText(day.image_urls)} onChange={(value) => set('image_urls', listValue(value))} multiline />
      <Field label="Important notes" value={day.notes} onChange={(value) => set('notes', value)} multiline />
      <Field label="Map location / coordinates" value={day.map_location} onChange={(value) => set('map_location', value)} />
      <Field label="Latitude" value={day.latitude} onChange={(value) => set('latitude', value)} type="number" />
      <Field label="Longitude" value={day.longitude} onChange={(value) => set('longitude', value)} type="number" />
    </div>}
  </section>
}

const iconButton = { width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(180,160,130,.35)', background: '#fff', borderRadius: 6, cursor: 'pointer', color: NAVY }

function PackagePanel({ pkg, onRefresh }) {
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)
  const [days, setDays] = useState(() => normalize(pkg.itinerary))
  const [savedDays, setSavedDays] = useState(() => normalize(pkg.itinerary))
  const dirty = !equal(days, savedDays)
  useEffect(() => { const refreshed = normalize(pkg.itinerary); setDays(refreshed); setSavedDays(refreshed) }, [pkg.id, pkg.updated_at, JSON.stringify(pkg.itinerary)])
  const update = (index, next) => setDays((current) => current.map((day, i) => i === index ? next : day))
  const move = (index, delta) => setDays((current) => { const next = [...current]; const to = index + delta; if (to < 0 || to >= next.length) return current; [next[index], next[to]] = [next[to], next[index]]; return normalize(next) })
  const duplicate = (index) => setDays((current) => { const next = [...current]; const copy = { ...next[index], id: undefined }; next.splice(index + 1, 0, copy); return normalize(next) })
  const remove = (index) => { if (!window.confirm(`Delete Day ${index + 1} from ${pkg.duration}?`)) return; setDays((current) => normalize(current.filter((_, i) => i !== index))) }
  const save = async () => {
    if (days.some((day) => !day.title.trim())) { setNotice({ type: 'error', msg: 'Add a title to every itinerary day before saving.' }); return }
    setSaving(true); setNotice(null)
    try {
      const result = await api.put(`/api/admin/packages/${pkg.id}/itinerary`, { itinerary: days })
      const saved = normalize(result.itinerary || [])
      setDays(saved); setSavedDays(saved); setNotice({ type: 'success', msg: 'Itinerary saved successfully.' }); onRefresh()
    } catch (error) { setNotice({ type: 'error', msg: error.message || 'Could not save the itinerary. Your edits are still here.' }) }
    finally { setSaving(false) }
  }
  const preview = () => {
    const visible = days.filter((day) => day.is_visible)
    const text = visible.map((day, i) => `Day ${i + 1}: ${day.title}\n${day.summary || day.description}`).join('\n\n') || 'No visible days.'
    window.alert(`${pkg.duration} itinerary preview\n\n${text}`)
  }
  const cancel = () => { if (dirty && !window.confirm('Discard unsaved itinerary changes?')) return; setDays(savedDays); setNotice(null) }
  return <div style={{ borderRadius: 10, border: `1.5px solid ${open ? 'rgb(var(--ae-gold-rgb) /0.45)' : 'rgba(180,160,130,.3)'}`, background: '#fff', marginBottom: 10, overflow: 'hidden' }}>
    <button type="button" onClick={() => setOpen((value) => !value)} style={{ width: '100%', background: open ? 'rgb(var(--ae-gold-rgb) /0.05)' : '#fff', border: 0, cursor: 'pointer', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
      <span style={{ background: `linear-gradient(135deg,${NAVY},#1a3c7e)`, color: '#fff', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{pkg.duration}</span>
      <span style={{ ...fn, fontSize: 12, color: '#6b7280', flex: 1 }}>{days.length} day{days.length !== 1 ? 's' : ''}{dirty ? ' · Unsaved changes' : ''}{pkg.price ? ` · ₹${Number(pkg.price).toLocaleString('en-IN')}` : ''}{pkg.is_default ? ' · ⭐ Default' : ''}</span>
      {open ? <ChevronUp size={15} style={{ color: GOLD }} /> : <ChevronDown size={15} style={{ color: NAVY }} />}
    </button>
    {open && <div style={{ padding: '0 14px 14px' }}>
      {notice && <Notice type={notice.type} msg={notice.msg} onDismiss={() => setNotice(null)} />}
      <div style={{ ...fn, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, margin: '4px 0 10px', flexWrap: 'wrap' }}><strong style={{ color: NAVY, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em' }}>Day-wise itinerary</strong><span style={{ color: dirty ? '#b45309' : '#64748b', fontSize: 11 }}>{dirty ? 'Unsaved changes' : 'All changes saved'}</span></div>
      {days.map((day, index) => <DayEditor key={day.id || `new-${index}`} day={day} index={index} count={days.length} update={update} move={move} duplicate={duplicate} remove={remove} onPreview={preview} />)}
      {!days.length && <p style={{ ...fn, color: '#64748b', fontSize: 12 }}>No itinerary days yet. Add days at any length.</p>}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 }}>
        <button type="button" onClick={() => setDays((current) => normalize([...current, blankDay(current.length + 1)]))} style={{ ...actionButton, border: '1px dashed rgba(180,160,130,.6)', background: 'transparent', color: NAVY }}><Plus size={13} /> Add Day</button>
        <div style={{ display: 'flex', gap: 7 }}><button type="button" onClick={preview} style={{ ...actionButton, background: '#fff', border: '1px solid #e5e7eb', color: NAVY }}><Eye size={13} /> Preview</button><button type="button" onClick={cancel} disabled={!dirty || saving} style={{ ...actionButton, background: '#fff', border: '1px solid #e5e7eb', color: '#64748b' }}><X size={13} /> Cancel edits</button><button type="button" onClick={save} disabled={!dirty || saving} style={{ ...actionButton, border: 0, background: dirty ? 'linear-gradient(90deg,var(--ae-navy),#1a3c7e)' : '#94a3b8', color: '#fff' }}>{saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} {saving ? 'Saving…' : 'Save Itinerary'}</button></div>
      </div>
    </div>}
  </div>
}
const actionButton = { ...fn, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }

function NewPackageForm({ tourType, tourId, tourSlug, onSave, onCancel }) {
  const [form, setForm] = useState({ duration: '', days: '', nights: '', price: '', original_price: '', is_default: false })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }))
  const save = async () => {
    if (!form.duration.trim()) return setErr('Duration label is required (e.g. 5N/6D)')
    if (!form.days || Number(form.days) <= 0) return setErr('Enter a valid number of days')
    setSaving(true); setErr('')
    try {
      const days = Number(form.days)
      const itinerary = Array.from({ length: days }, (_, index) => blankDay(index + 1))
      await api.post(`/api/admin/tours/${tourType}/${tourId}/packages`, { duration: form.duration.trim(), days, nights: form.nights !== '' ? Number(form.nights) : days - 1, price: form.price !== '' ? Number(form.price) : null, original_price: form.original_price !== '' ? Number(form.original_price) : null, is_default: form.is_default, tour_slug: tourSlug, itinerary })
      onSave()
    } catch (error) { setErr(error.message || 'Unable to create duration package.') } finally { setSaving(false) }
  }
  const fields = [{ label: 'Duration Label *', key: 'duration', type: 'text', placeholder: 'e.g. 5N/6D' }, { label: 'Days *', key: 'days', type: 'number', placeholder: '6' }, { label: 'Nights', key: 'nights', type: 'number', placeholder: '5' }, { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '52000' }, { label: 'Original Price (₹)', key: 'original_price', type: 'number', placeholder: '68000' }]
  return <div style={{ borderRadius: 10, border: '1.5px dashed rgb(var(--ae-gold-rgb) /0.5)', background: 'rgb(var(--ae-gold-rgb) /0.03)', padding: 14, marginBottom: 10 }}>
    <div style={{ ...fn, fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>New Duration Package</div>
    {err && <Notice type="error" msg={err} onDismiss={() => setErr('')} />}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, marginBottom: 8 }}>{fields.map(({ label, key, type, placeholder }) => <Field key={key} label={label} value={form[key]} onChange={set(key)} type={type} placeholder={placeholder} />)}<label style={{ ...fn, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: NAVY }}><input type="checkbox" checked={form.is_default} onChange={(event) => set('is_default')(event.target.checked)} /> Set as default duration</label></div>
    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}><button type="button" onClick={onCancel} style={{ ...actionButton, background: '#fff', border: '1px solid #e5e7eb', color: '#64748b' }}>Cancel</button><button type="button" onClick={save} disabled={saving} style={{ ...actionButton, border: 0, background: `linear-gradient(90deg,${NAVY},#1a3c7e)`, color: '#fff' }}>{saving ? <Loader2 size={12} /> : <Plus size={12} />} Create Duration</button></div>
  </div>
}

export default function TourDurationsManager({ tourId, tourType, tourSlug }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [notice, setNotice] = useState(null)
  const load = useCallback(async () => {
    if (!tourId || !tourType) return
    setLoading(true)
    try { const data = await api.get(`/api/admin/tours/${tourType}/${tourId}/packages`); setPackages(data.packages || []) }
    catch (error) { setNotice({ type: 'error', msg: error.message || 'Could not load itinerary packages.' }) }
    finally { setLoading(false) }
  }, [tourId, tourType])
  useEffect(() => { load() }, [load])
  if (!tourId || !tourType) return null
  return <div style={{ marginTop: 20, padding: '18px 20px', borderRadius: 14, border: '1.5px solid rgb(var(--ae-gold-rgb) /0.35)', background: 'linear-gradient(to bottom,rgb(var(--ae-gold-rgb) /0.04),#fff)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgb(var(--ae-gold-rgb) /0.15)', border: '1px solid rgb(var(--ae-gold-rgb) /0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={15} style={{ color: GOLD }} /></div><div><div style={{ ...fn, fontSize: 13, fontWeight: 700, color: NAVY }}>Duration Packages & Itineraries</div><div style={{ ...fn, fontSize: 11, color: '#9ca3af' }}>{packages.length} duration{packages.length !== 1 ? 's' : ''} configured</div></div></div>{!adding && <button type="button" onClick={() => setAdding(true)} style={{ ...actionButton, border: 0, background: `linear-gradient(90deg,var(--ae-gold),var(--ae-gold2))`, color: NAVY }}><Plus size={13} /> Add Duration</button>}</div>
    {notice && <Notice type="error" msg={notice.msg} onDismiss={() => setNotice(null)} />}
    {adding && <NewPackageForm tourType={tourType} tourId={tourId} tourSlug={tourSlug} onSave={() => { setAdding(false); load() }} onCancel={() => setAdding(false)} />}
    {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><Loader2 size={20} style={{ color: GOLD }} className="animate-spin" /></div>}
    {!loading && !packages.length && !adding && <div style={{ textAlign: 'center', padding: 20, color: '#9ca3af', ...fn, fontSize: 12 }}>No duration packages yet. Click “Add Duration” to get started.</div>}
    {!loading && packages.map((pkg) => <PackagePanel key={pkg.id} pkg={pkg} onRefresh={load} />)}
  </div>
}
