import { useRef } from 'react'
import { Plus, Upload, X } from 'lucide-react'
import { api } from '../../services/api'
import { FieldLabel, inputStyle, Btn, cls, NAVY, GOLD } from './admin-ui'

const fonts = { fontFamily: "'Inter', sans-serif" }

export function Field({ id, label, required, children, hint }) {
  return (
    <div className="mb-4">
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
      {hint && <p className="text-[10px] mt-1" style={{ color: 'rgba(58,42,24,0.55)' }}>{hint}</p>}
    </div>
  )
}

export function TextInput({ value = '', onChange, placeholder, type = 'text', rows }) {
  const style = { ...inputStyle(), fontFamily: fonts.fontFamily }
  if (type === 'textarea') {
    return <textarea value={value} rows={rows || 4} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={style} />
  }
  return <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? e.target.value : e.target.value)} placeholder={placeholder} style={style} />
}

export function Select({ value = '', onChange, options, placeholder = 'Select…' }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle(), fontFamily: fonts.fontFamily }}>
      <option value="" style={{ color: '#999' }}>{placeholder}</option>
      {options.map((o) => (
        <option key={typeof o === 'object' ? o.value : o} value={typeof o === 'object' ? o.value : o}>
          {typeof o === 'object' ? o.label : o}
        </option>
      ))}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-3">
      <span className="w-11 h-6 rounded-full relative transition-colors" style={{ background: checked ? GOLD : '#d1d5db' }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: checked ? 22 : 2 }} />
      </span>
      {label && <span className="text-sm font-semibold" style={{ color: NAVY, fontFamily: fonts.fontFamily }}>{label}</span>}
    </button>
  )
}

export function TagPicker({ value = [], onChange, suggestions = [] }) {
  const add = (tag) => {
    const t = tag.trim()
    if (!t || value.includes(t)) return
    onChange([...value, t])
  }
  return (
    <div>
      <div style={{ ...inputStyle(), padding: '6px 8px', minHeight: 44 }}>
        <div className="flex flex-wrap gap-1.5 items-center">
          {value.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ background: 'rgba(197,155,39,0.15)', color: NAVY }}>
              {v}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== v))}><X size={11} /></button>
            </span>
          ))}
          <TagInput onCommit={add} />
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.filter((s) => !value.includes(s)).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="px-2 py-0.5 rounded-full text-[11px] hover:opacity-70"
              style={{ background: 'rgba(0,26,77,0.06)', color: NAVY }}>
              <Plus size={10} className="inline mr-0.5" />{s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TagInput({ onCommit }) {
  const ref = useRef(null)
  const commit = () => {
    if (!ref.current) return
    const v = ref.current.value
    if (v.trim()) onCommit(v)
    ref.current.value = ''
  }
  return (
    <input ref={ref} onKeyDown={(e) => {
      if (e.key === 'Enter') { e.preventDefault(); commit() }
      if (e.key === ',') { e.preventDefault(); commit() }
    }} onBlur={commit}
      className="bg-transparent outline-none text-[12px]" style={{ minWidth: 90, flex: 1, fontFamily: fonts.fontFamily }}
      placeholder="type + Enter" />
  )
}

export function ImageUpload({ value = '', onChange, label = 'Image', preset }) {
  const ref = useRef(null)
  const handleFile = async (file) => {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const data = await api.postForm('/media', fd)
      onChange(data.media.url)
    } catch (e) {
      onChange(URL.createObjectURL(file))
    }
  }
  return (
    <div className="flex items-start gap-4">
      <div className="w-24 h-20 rounded-lg overflow-hidden border flex items-center justify-center shrink-0"
        style={{ borderColor: 'rgba(0,26,77,0.15)', background: '#f8f5ee' }}>
        {value
          ? <img src={value} alt="preview" className="w-full h-full object-cover" />
          : <span className="text-[10px] text-center px-1" style={{ color: '#999' }}>No image</span>}
      </div>
      <div className="flex-1">
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
        <div className="flex gap-2 flex-wrap">
          <Btn variant="ghostGold" onClick={() => ref.current?.click()}><Upload size={13} /> Upload</Btn>
          {value && <Btn variant="ghost" onClick={() => onChange('')}><X size={13} /> Remove</Btn>}
        </div>
        {preset && (
          <div>
            <div className="text-[10px] uppercase tracking-wide mt-2 mb-1" style={{ color: 'rgba(58,42,24,0.5)', fontFamily: 'Inter' }}>Or pick presets</div>
            <div className="flex gap-1.5 flex-wrap max-h-16 overflow-y-auto">
              {preset.map((p) => (
                <button key={p.url} type="button" onClick={() => onChange(p.url)} title={p.label}
                  className={cls('w-10 h-8 rounded border overflow-hidden', value === p.url && 'ring-2')}
                  style={{ borderColor: 'rgba(0,26,77,0.15)', ['--tw-ring-color']: GOLD }}>
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ListEditor({ value = [], onChange, placeholder = 'Add item…' }) {
  const ref = useRef(null)
  const add = () => {
    const v = ref.current?.value?.trim()
    if (v) { onChange([...value, v]); ref.current.value = '' }
  }
  const displayItem = (v) => {
    if (typeof v === 'string') return v
    if (v && typeof v === 'object') {
      const { name, location, text } = v
      if (name || location || text) return [name, location, text].filter(Boolean).join(' — ')
      try { return JSON.stringify(v) } catch { return '[object]' }
    }
    return String(v)
  }
  return (
    <div>
      <div className="flex gap-2">
        <input ref={ref} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={placeholder} style={{ ...inputStyle(), fontFamily: fonts.fontFamily }} />
        <Btn variant="navy" onClick={add}><Plus size={13} /></Btn>
      </div>
      {value.length > 0 && (
        <ul className="mt-2 space-y-1">
          {value.map((v, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px]"
              style={{ background: 'rgba(0,26,77,0.04)' }}>
              <span style={{ color: NAVY }}>{displayItem(v)}</span>
              <button type="button" onClick={() => onChange(value.filter((_, x) => x !== i))} className="opacity-50 hover:opacity-100"><X size={13} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}