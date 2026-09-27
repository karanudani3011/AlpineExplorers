import { useRef, useState } from 'react'
import { Plus, Upload, X } from 'lucide-react'
import { api } from '../../services/api'
import { FieldLabel, inputStyle, Btn, cls, NAVY, GOLD } from './admin-ui'

const fonts = { fontFamily: "'Inter', sans-serif" }

export function Field({ id, label, required, children, hint }) {
  return (
    <div className="mb-4">
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
      {hint && <p className="text-[10px] mt-1" style={{ color: 'rgb(var(--ae-ink-rgb) /0.55)' }}>{hint}</p>}
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
              style={{ background: 'rgb(var(--ae-gold-rgb) /0.15)', color: NAVY }}>
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
              style={{ background: 'rgb(var(--ae-navy-rgb) /0.06)', color: NAVY }}>
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
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const isVideo = (url) => /\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(url) || (url && url.includes('/video/upload/'))

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', 'tours')
    try {
      const data = await api.postForm('/media', fd)
      onChange(data.media.url)
    } catch (e) {
      console.error('Image upload failed:', e)
      setError(e.message || 'Upload failed')
      onChange(URL.createObjectURL(file))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-24 h-20 rounded-lg overflow-hidden border flex items-center justify-center shrink-0 relative"
        style={{ borderColor: 'rgb(var(--ae-navy-rgb) /0.15)', background: '#f8f5ee' }}>
        {value ? (
          isVideo(value) ? (
            <video src={value} className="w-full h-full object-cover" muted autoPlay loop playsInline />
          ) : (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          )
        ) : (
          <span className="text-[10px] text-center px-1" style={{ color: '#999' }}>
            {uploading ? 'Uploading…' : 'No media'}
          </span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-semibold">
            Uploading…
          </div>
        )}
      </div>
      <div className="flex-1">
        <input ref={ref} type="file" accept="image/*,video/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
        <div className="flex gap-2 flex-wrap items-center">
          <Btn variant="ghostGold" onClick={() => ref.current?.click()} disabled={uploading}>
            <Upload size={13} /> {uploading ? 'Uploading to Cloudinary…' : 'Upload to Cloudinary'}
          </Btn>
          {value && <Btn variant="ghost" onClick={() => onChange('')}><X size={13} /> Remove</Btn>}
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        {preset && (
          <div>
            <div className="text-[10px] uppercase tracking-wide mt-2 mb-1" style={{ color: 'rgb(var(--ae-ink-rgb) /0.5)', fontFamily: 'Inter' }}>Or pick presets</div>
            <div className="flex gap-1.5 flex-wrap max-h-16 overflow-y-auto">
              {preset.map((p) => (
                <button key={p.url} type="button" onClick={() => onChange(p.url)} title={p.label}
                  className={cls('w-10 h-8 rounded border overflow-hidden', value === p.url && 'ring-2')}
                  style={{ borderColor: 'rgb(var(--ae-navy-rgb) /0.15)', ['--tw-ring-color']: GOLD }}>
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

export function GalleryUpload({ value = [], onChange }) {
  const fileInputRef = useRef(null)
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const list = Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value || '[]') : [])

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    Array.from(files).forEach((f) => fd.append('files', f))
    fd.append('category', 'tours')

    try {
      const res = await api.postForm('/media/multiple', fd)
      if (res.urls && res.urls.length) {
        onChange([...list, ...res.urls])
      }
    } catch (e) {
      console.error('Batch upload error:', e)
      // Fallback single uploads
      try {
        const newUrls = []
        for (const file of Array.from(files)) {
          const singleFd = new FormData()
          singleFd.append('file', file)
          singleFd.append('category', 'tours')
          const singleRes = await api.postForm('/media', singleFd)
          if (singleRes.media?.url) newUrls.push(singleRes.media.url)
        }
        if (newUrls.length) onChange([...list, ...newUrls])
      } catch (err2) {
        setError(err2.message || 'Gallery upload failed')
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeAt = (index) => {
    const updated = list.filter((_, i) => i !== index)
    onChange(updated)
  }

  const addManualUrl = () => {
    const trimmed = urlInput.trim()
    if (trimmed) {
      onChange([...list, trimmed])
      setUrlInput('')
    }
  }

  const isVideo = (url) => /\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(url) || (url && url.includes('/video/upload/'))

  return (
    <div className="space-y-3">
      {/* Upload button & Manual URL entry */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Btn variant="ghostGold" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload size={13} /> {uploading ? 'Uploading to Cloudinary…' : 'Upload Photos / Videos'}
        </Btn>

        <div className="flex items-center gap-1.5 flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Or paste image/video URL + Click Add"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addManualUrl() } }}
            style={{ ...inputStyle(), fontFamily: fonts.fontFamily, padding: '6px 10px', fontSize: '12px' }}
          />
          <Btn variant="ghost" onClick={addManualUrl}><Plus size={13} /> Add</Btn>
        </div>
      </div>

      {error && <p className="text-[11px] text-red-500">{error}</p>}

      {/* Gallery Previews Grid */}
      {list.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2 rounded-xl bg-amber-50/40 border border-amber-200/50">
          {list.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-slate-100 shadow-sm">
              {isVideo(url) ? (
                <video src={url} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <img src={url} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow"
                  title="Remove from gallery"
                >
                  <X size={14} />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                #{i + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 rounded-lg border border-dashed border-gray-300 text-center text-xs text-gray-500 bg-slate-50">
          No gallery images yet. Click "Upload Photos / Videos" to select images for sliding display.
        </div>
      )}
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
              style={{ background: 'rgb(var(--ae-navy-rgb) /0.04)' }}>
              <span style={{ color: NAVY }}>{displayItem(v)}</span>
              <button type="button" onClick={() => onChange(value.filter((_, x) => x !== i))} className="opacity-50 hover:opacity-100"><X size={13} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}