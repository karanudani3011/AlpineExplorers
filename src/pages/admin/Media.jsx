import { useEffect, useState } from 'react'
import { Image as ImageIcon, Upload, Search, Trash2, Download, RefreshCw } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Modal, Spinner, EmptyState, FieldLabel, NAVY, GOLD } from '../../components/admin/admin-ui'
import { api as apiBase } from '../../services/api'

const CATEGORIES = ['general', 'international', 'domestic', 'adventure', 'trekking', 'camping', 'wildlife', 'blog', 'homepage']
const fonts = { fontFamily: "'Inter'" }

export default function MediaLibrary() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  const fullUrl = (u) => (u.startsWith('http') ? u : `${window.location.origin}${u}`)

  const load = (extra = {}) => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (extra.search !== undefined) qs.set('q', extra.search)
    else if (search) qs.set('q', search)
    if (extra.category !== undefined) qs.set('category', extra.category)
    else if (category) qs.set('category', category)
    api.get(`/media?${qs.toString()}`).then((d) => setMedia(d.media || [])).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const applyFilters = () => load({ search, category })

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    setUploading(true)
    for (const f of files) {
      const fd = new FormData()
      fd.append('file', f)
      fd.append('category', category || 'general')
      try { await api.postForm('/media', fd); addToast('Uploaded ' + f.name) } catch (err) { addToast(err.message, 'error') }
    }
    setUploading(false)
    e.target.value = ''
    load()
  }

  const onReplace = async (file) => {
    if (!file || !editing) return
    const fd = new FormData()
    fd.append('file', file)
    fd.append('title', editForm.title || editing.title)
    fd.append('category', editForm.category || editing.category)
    try {
      const d = await api.putForm(`/media/${editing.id}`, fd)
      setEditing(null)
      addToast('Image replaced')
      load()
    } catch (err) { addToast(err.message, 'error') }
  }

  const saveMeta = async () => {
    try {
      await api.patch(`/media/${editing.id}`, { title: editForm.title, category: editForm.category })
      setEditing(null); addToast('Updated'); load()
    } catch (err) { addToast(err.message, 'error') }
  }

  const onDelete = async (m) => {
    if (!confirm('Delete this image?')) return
    try { await api.del(`/media/${m.id}`); addToast('Deleted'); load() } catch (err) { addToast(err.message, 'error') }
  }

  const filtered = media

  return (
    <div>
      <PageHeader icon={ImageIcon} title="Media Library" subtitle="Upload, organize & manage images"
        actions={
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
            style={{ background: `linear-gradient(90deg, ${GOLD}, #dfbf5a)`, color: NAVY }}>
            <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
            <input type="file" accept="image/*" multiple hidden onChange={onUpload} />
          </label>
        } />

      <Card>
        <div className="flex flex-wrap gap-3 items-center mb-5">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Search images…" style={{ ...fonts, padding: '9px 12px 9px 34px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.15)', width: '100%', fontSize: 13, outline: 'none' }} />
          </div>
          <select value={category} onChange={(e) => { setCategory(e.target.value); load({ search, category: e.target.value }) }}
            style={{ ...fonts, padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.15)', fontSize: 13, outline: 'none', background: '#fff' }}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState title="No images yet" subtitle="Upload your first image using the Upload button" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((m) => (
              <div key={m.id} className="group rounded-xl overflow-hidden border relative"
                style={{ borderColor: 'rgba(180,160,130,0.25)', background: '#fff' }}>
                <div className="relative h-28 overflow-hidden">
                  <img src={fullUrl(m.url)} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => setEditing(m)} className="p-1.5 rounded-lg bg-white/90" title="Edit / Replace"><RefreshCw size={14} /></button>
                    <button onClick={() => onDelete(m)} className="p-1.5 rounded-lg bg-white/90" title="Delete"><Trash2 size={14} color="#8b2518" /></button>
                  </div>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white" style={{ background: 'rgba(0,26,77,0.7)' }}>{m.category}</span>
                </div>
                <div className="p-2">
                  <div className="text-[11px] font-bold truncate" style={{ color: NAVY }}>{m.title || m.filename}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px]" style={{ color: 'rgba(0,26,77,0.5)' }}>{m.type?.split('/')[1]?.toUpperCase()} {(m.size / 1024).toFixed(0)}K</span>
                    <a href={fullUrl(m.url)} download target="_blank" rel="noreferrer"><Download size={12} className="opacity-50 hover:opacity-100" /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit / Replace Image" width={520}>
        {editing && (
          <div>
            <img src={fullUrl(editing.url)} alt={editing.title} className="w-full h-44 object-cover rounded-xl mb-4" />
            <div className="mb-4">
              <FieldLabel>Title</FieldLabel>
              <input value={editForm.title ?? editing.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                style={{ ...fonts, ...inp }} />
            </div>
            <div className="mb-4">
              <FieldLabel>Category</FieldLabel>
              <select value={editForm.category ?? editing.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                style={{ ...fonts, ...inp }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <FieldLabel>Replace Image</FieldLabel>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase cursor-pointer"
                style={{ background: 'rgba(197,155,39,0.15)', color: NAVY }}>
                <Upload size={13} /> Choose file
                <input type="file" accept="image/*" hidden onChange={(e) => onReplace(e.target.files[0])} />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn onClick={saveMeta}>Save</Btn>
            </div>
          </div>
        )}
      </Modal>
      <ToastHost />
    </div>
  )
}

const inp = { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.18)', fontSize: 13, outline: 'none' }