import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from './useToasts'
import { PageHeader, Btn, Card, Spinner, Modal, cls } from './admin-ui'
import { Field, TextInput, Select, Toggle, ImageUpload, TagPicker, ListEditor } from './FormFields'
import { DataTable } from './DataTable'

const fonts = { fontFamily: "'Inter'" }

export default function CrudPage({ config }) {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    api.get(config.endpoint).then((d) => {
      setRows(d[config.resourceKey] || [])
    }).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }

  useEffect(load, [config.endpoint, config.resourceKey])

  const openCreate = () => {
    const o = {}
    for (const f of config.fields) {
      if (f.type === 'switch') o[f.name] = f.default ?? true
      else if (f.type === 'tags' || f.type === 'list') o[f.name] = []
      else if (f.type === 'number') o[f.name] = ''
      else o[f.name] = f.default ?? ''
      if (f.name === 'status') o[f.name] = f.options?.[0] || 'active'
    }
    setEditing(null)
    setForm(o)
    setOpen(true)
  }

  const openEdit = (row) => {
    const o = {}
    for (const f of config.fields) {
      let v = row[f.name]
      if (f.type === 'switch') v = !!v
      if (f.type === 'number') v = v ?? ''
      if (v === null || v === undefined) v = f.type === 'tags' || f.type === 'list' ? [] : (f.type === 'switch' ? false : '')
      o[f.name] = v
    }
    o.id = row.id
    setEditing(row)
    setForm(o)
    setOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      if (editing) {
        await api.put(`${config.endpoint}/${editing.id}`, form)
        addToast(config.saveMessage || 'Updated successfully')
      } else {
        await api.post(config.endpoint, form)
        addToast(config.saveMessage || 'Created successfully')
      }
      setOpen(false)
      load()
    } catch (e) { addToast(e.message, 'error') } finally { setSaving(false) }
  }

  const toggleStatus = async (row) => {
    const next = config.statusNext ? config.statusNext(row.status) : (row.status === 'active' ? 'inactive' : 'active')
    try {
      await api.patch(`${config.endpoint}/${row.id}/status`, { status: next })
      load()
    } catch (e) { addToast(e.message, 'error') }
  }

  const toggleFeatured = async (row) => {
    if (!config.canFeature) return
    try {
      await api.patch(`${config.endpoint}/${row.id}/featured`, { featured: !row.featured })
      load()
    } catch (e) { addToast(e.message, 'error') }
  }

  const remove = async (row) => {
    setDeleting(true)
    try {
      await api.del(`${config.endpoint}/${row.id}`)
      addToast('Deleted successfully')
      setConfirmDel(null)
      load()
    } catch (e) { addToast(e.message, 'error') } finally { setDeleting(false) }
  }

  const filtered = search.trim()
    ? rows.filter((r) => Object.keys(r).some((k) => typeof r[k] === 'string' && r[k].toLowerCase().includes(search.toLowerCase())))
    : rows

  const set = (name) => (v) => setForm((f) => ({ ...f, [name]: v }))

  const GridField = ({ f }) => (
    <div className={cls(f.span === 2 && 'sm:col-span-2')}>
      <Field label={f.label} required={f.required} hint={f.hint}>
        {f.type === 'switch' && <Toggle checked={!!form[f.name]} onChange={set(f.name)} label={f.toggleLabel} />}
        {f.type === 'select' && <Select value={form[f.name] ?? ''} onChange={set(f.name)} options={f.options} placeholder={f.placeholder || 'Select…'} />}
        {f.type === 'tags' && <TagPicker value={form[f.name] || []} onChange={set(f.name)} suggestions={f.suggestions} />}
        {f.type === 'list' && <ListEditor value={form[f.name] || []} onChange={set(f.name)} placeholder={f.placeholder} />}
        {f.type === 'image' && <ImageUpload value={form[f.name] || ''} onChange={set(f.name)} label={f.label} preset={f.preset} />}
        {f.type === 'textarea' && <TextInput type="textarea" value={form[f.name] ?? ''} onChange={set(f.name)} placeholder={f.placeholder} rows={f.rows || 4} />}
        {(f.type === 'text' || f.type === 'number') && <TextInput type={f.type === 'number' ? 'number' : 'text'} value={form[f.name] ?? ''} onChange={set(f.name)} placeholder={f.placeholder} />}
      </Field>
    </div>
  )

  const formSections = config.formSections || [{ fields: config.fields }]

  return (
    <div>
      <PageHeader icon={config.icon} title={config.title} subtitle={config.subtitle}
        actions={config.canCreate !== false && (
          <Btn onClick={openCreate}><Plus size={14} /> Add {config.itemName || 'New'}</Btn>
        )} />

      <Card className="!p-0">
        <div className="px-5 pt-4 pb-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${config.title.toLowerCase()}…`}
              style={{ ...fonts, padding: '9px 12px 9px 34px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.15)', width: '100%', fontSize: 13, outline: 'none' }} />
          </div>
          <span className="text-[11px] font-semibold" style={{ color: 'rgba(0,26,77,0.5)' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? <Spinner /> : (
          <DataTable columns={config.columns} data={filtered}
            onEdit={(row) => openEdit(row)}
            onDelete={(row) => setConfirmDel(row)}
            emptyHint={config.emptyHint}
            renderActions={(row) => (
              <>
                {config.canFeature !== false && row.featured !== undefined && (
                  <button onClick={() => toggleFeatured(row)} title={row.featured ? 'Unfeature' : 'Feature'} className="p-1.5 rounded-lg hover:bg-black/5" style={{ border: 'none', background: 'none' }}>
                    <StarIcon active={row.featured} />
                  </button>
                )}
                {row.status !== undefined && (
                  <button onClick={() => toggleStatus(row)} className="p-1.5 rounded-lg hover:bg-black/5" title="Toggle status" style={{ border: 'none', background: 'none' }}>
                    <StatusIcon active={row.status === 'active'} />
                  </button>
                )}
              </>
            )}
          />
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${config.itemName || 'Item'}` : `Add ${config.itemName || 'New Item'}`} width={820}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          {formSections.flatMap((s) => s.fields).map((f, i) => <GridField key={i} f={f} />)}
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
          <Btn variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
        </div>
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Confirm Delete" width={420}>
        <p className="text-sm" style={fonts}>
          Are you sure you want to delete <b>{confirmDel?.destination || confirmDel?.title || confirmDel?.name || `record #${confirmDel?.id}`}</b>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Btn variant="ghost" onClick={() => setConfirmDel(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => remove(confirmDel)} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</Btn>
        </div>
      </Modal>

      <ToastHost />
    </div>
  )
}

function StarIcon({ active }) {
  return <StarSvg active={active} />
}
function StarSvg({ active }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? '#c59b27' : 'none'} stroke={active ? '#c59b27' : '#c9bda4'} strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
function StatusIcon({ active }) {
  const c = active ? '#166534' : '#9ca3af'
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <ellipse cx="12" cy="12" rx="9" ry="5" />
      <path d="M3 12c0-2.7 4-5 9-5s9 2.3 9 5-4 5-9 5-9-2.3-9-5z" />
    </svg>
  )
}