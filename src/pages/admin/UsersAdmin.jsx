import { useEffect, useState } from 'react'
import { Users, Plus, Edit, Trash2, KeyRound, ShieldCheck } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Modal, Spinner, EmptyState, Badge, NAVY, GOLD } from '../../components/admin/admin-ui'
import { Field, TextInput, Select, Toggle } from '../../components/admin/FormFields'

const ROLES = ['super_admin', 'admin', 'editor']
const fonts = { fontFamily: "'Inter'" }
const inp = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.18)', fontSize: 13, outline: 'none', fontFamily: "'Inter'" }

export default function UsersAdmin() {
  const { user: me } = useAuth()
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [resetFor, setResetFor] = useState(null)
  const [newPass, setNewPass] = useState('')
  const [roleFor, setRoleFor] = useState(null)

  const load = () => { setLoading(true); api.get('/users').then((d) => setItems(d.users || [])).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false)) }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm({ role: 'editor', status: 'active' }); setOpen(true) }
  const openEdit = (u) => { setEditing(u); setForm({ full_name: u.full_name, email: u.email, phone: u.phone, role: u.role, status: u.status, username: u.username }); setOpen(true) }

  const save = async () => {
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/users/${editing.id}`, form)
        addToast('User updated')
      } else {
        if (form.password !== form.confirm) throw new Error('Passwords do not match')
        await api.post('/users', form)
        addToast('User created')
      }
      setOpen(false); load()
    } catch (e) { addToast(e.message, 'error') } finally { setSaving(false) }
  }

  const remove = async (u) => {
    if (!confirm(`Delete user ${u.full_name}?`)) return
    try { await api.del(`/users/${u.id}`); addToast('User deleted'); load() } catch (e) { addToast(e.message, 'error') }
  }

  const toggleStatus = async (u) => {
    try { await api.patch(`/users/${u.id}/status`, { status: u.status === 'active' ? 'inactive' : 'active' }); load() } catch (e) { addToast(e.message, 'error') }
  }

  const changeRole = async (u, role) => {
    try { await api.patch(`/users/${u.id}/role`, { role }); addToast('Role updated'); setRoleFor(null); load() } catch (e) { addToast(e.message, 'error') }
  }

  const resetPassword = async () => {
    if (!resetFor || !newPass) return
    try { await api.patch(`/users/${resetFor.id}/reset-password`, { password: newPass }); addToast('Password reset'); setResetFor(null); setNewPass('') }
    catch (e) { addToast(e.message, 'error') }
  }

  return (
    <div>
      <PageHeader icon={Users} title="User Management" subtitle="Create, edit & manage admin accounts (Super Admin only)"
        actions={me?.role === 'super_admin' && <Btn onClick={openAdd}><Plus size={14} /> Add User</Btn>} />

      <Card className="!p-0">
        {loading ? <Spinner /> : items.length === 0 ? <EmptyState title="No users yet" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={fonts}>
              <thead>
                <tr>
                  {['User', 'Username', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap" style={{ color: 'rgba(0,26,77,0.55)', borderBottom: '2px solid rgba(197,155,39,0.4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4 text-[12.5px]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${u.role === 'super_admin' ? '#8b2518' : '#001a4d'}, ${GOLD})` }}>
                          {u.full_name?.[0]}
                        </div>
                        <span className="font-semibold" style={{ color: NAVY }}>{u.full_name}</span>
                        {u.id === me?.id && <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/5" style={{ color: 'rgba(0,26,77,0.5)' }}>you</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[12.5px]">{u.username}</td>
                    <td className="py-3 px-4 text-[12.5px]">{u.email}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => me?.role === 'super_admin' && u.id !== me.id && setRoleFor(u)} title="Change role" style={{ border: 'none', background: 'none', padding: 0 }}>
                        <Badge tone={u.role}>{u.role}</Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleStatus(u)} disabled={u.id === me.id} style={{ border: 'none', background: 'none', padding: 0 }}>
                        <Badge tone={u.status === 'active' ? 'published' : 'inactive'}>{u.status}</Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-[12px]" style={{ color: 'rgba(0,26,77,0.5)' }}>{u.created_at?.slice(0, 10)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} title="Edit" className="p-1.5 rounded-lg hover:bg-black/5" style={{ border: 'none', background: 'none' }}><Edit size={14} /></button>
                        <button onClick={() => setResetFor(u)} title="Reset password" className="p-1.5 rounded-lg hover:bg-black/5" style={{ border: 'none', background: 'none' }}><KeyRound size={14} color={GOLD} /></button>
                        {u.id !== me.id && (
                          <button onClick={() => remove(u)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-500/10" style={{ border: 'none', background: 'none' }}><Trash2 size={14} color="#8b2518" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit User' : 'Add User'} width={560}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Full Name" required><TextInput value={form.full_name || ''} onChange={(v) => setForm({ ...form, full_name: v })} /></Field>
          <Field label="Username" required><TextInput value={form.username || ''} onChange={(v) => setForm({ ...form, username: v })} /></Field>
          <Field label="Email" required><TextInput value={form.email || ''} onChange={(v) => setForm({ ...form, email: v })} /></Field>
          <Field label="Phone"><TextInput value={form.phone || ''} onChange={(v) => setForm({ ...form, phone: v })} /></Field>
          <Field label="Password" required={!editing} hint={editing ? 'Leave blank to keep current' : 'Min 6 characters'}>
            <TextInput type="password" value={form.password || ''} onChange={(v) => setForm({ ...form, password: v })} />
          </Field>
          <Field label="Confirm Password" required={!editing}>
            <TextInput type="password" value={form.confirm || ''} onChange={(v) => setForm({ ...form, confirm: v })} />
          </Field>
          <Field label="Role" required>
            <Select value={form.role || 'editor'} onChange={(v) => setForm({ ...form, role: v })} options={ROLES} />
          </Field>
          <Field label="Status" required>
            <Select value={form.status || 'active'} onChange={(v) => setForm({ ...form, status: v })} options={['active', 'inactive']} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
          <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
        </div>
      </Modal>

      <Modal open={!!resetFor} onClose={() => { setResetFor(null); setNewPass('') }} title="Reset Password" width={420}>
        <p className="text-sm mb-4" style={fonts}>Set a new password for <b>{resetFor?.full_name}</b>.</p>
        <Field label="New Password">
          <TextInput type="password" value={newPass} onChange={setNewPass} placeholder="Min 6 characters" />
        </Field>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="ghost" onClick={() => { setResetFor(null); setNewPass('') }}>Cancel</Btn>
          <Btn onClick={resetPassword}>Reset</Btn>
        </div>
      </Modal>

      <Modal open={!!roleFor} onClose={() => setRoleFor(null)} title="Change Role" width={420}>
        <p className="text-sm mb-4" style={fonts}>Change role for <b>{roleFor?.full_name}</b>:</p>
        <div className="space-y-2 mb-4">
          {ROLES.map((r) => (
            <button key={r} onClick={() => changeRole(roleFor, r)}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold hover:bg-black/5"
              style={{ borderColor: roleFor?.role === r ? GOLD : 'rgba(0,26,77,0.15)', color: NAVY }}>
              <ShieldCheck size={15} style={{ color: GOLD }} /> {r}
              {roleFor?.role === r && <span className="ml-auto text-[10px] uppercase text-gray-400">current</span>}
            </button>
          ))}
        </div>
        <div className="flex justify-end"><Btn variant="ghost" onClick={() => setRoleFor(null)}>Cancel</Btn></div>
      </Modal>
      <ToastHost />
    </div>
  )
}