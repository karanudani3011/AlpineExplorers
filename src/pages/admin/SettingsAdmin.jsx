import { useEffect, useState } from 'react'
import { Settings, Save, Phone } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, FieldLabel, NAVY, GOLD } from '../../components/admin/admin-ui'
import { Field, TextInput, Toggle, ImageUpload } from '../../components/admin/FormFields'

const inp = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.18)', fontSize: 13, outline: 'none', fontFamily: "'Inter'" }

export default function SettingsAdmin() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [s, setS] = useState(null)
  const [c, setC] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/settings'), api.get('/contact')])
      .then(([sd, cd]) => {
        setS(sd.settings || {}); setC(cd.contact || {})
      }).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/settings', s)
      await api.put('/contact', c)
      addToast('Settings saved')
    } catch (e) { addToast(e.message, 'error') } finally { setSaving(false) }
  }

  if (loading) return <Spinner />
  if (!s || !c) return null

  return (
    <div>
      <PageHeader icon={Settings} title="Settings" subtitle="Site settings, SEO & contact information"
        actions={<Btn onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</Btn>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Site Settings</h3>
          <Field label="Website Name"><TextInput value={s.website_name || ''} onChange={(v) => setS({ ...s, website_name: v })} /></Field>
          <Field label="Logo"><ImageUpload value={s.logo || ''} onChange={(v) => setS({ ...s, logo: v })} /></Field>
          <Field label="Favicon"><ImageUpload value={s.favicon || ''} onChange={(v) => setS({ ...s, favicon: v })} /></Field>
          <Field label="SEO Title"><TextInput value={s.seo_title || ''} onChange={(v) => setS({ ...s, seo_title: v })} /></Field>
          <Field label="SEO Description"><TextInput type="textarea" rows={3} value={s.seo_description || ''} onChange={(v) => setS({ ...s, seo_description: v })} /></Field>
          <Field label="Google Analytics ID"><TextInput value={s.ga_id || ''} onChange={(v) => setS({ ...s, ga_id: v })} placeholder="G-XXXXXXXXXX" /></Field>
          <div className="pt-2 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
            <FieldLabel>Maintenance Mode</FieldLabel>
            <Toggle checked={!!s.maintenance_mode} onChange={(v) => setS({ ...s, maintenance_mode: v ? 1 : 0 })} label="Enable maintenance mode" />
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel', color: NAVY }}>
            <Phone size={16} style={{ color: GOLD }} /> Contact Settings
          </h3>
          <Field label="Company Name"><TextInput value={c.company_name || ''} onChange={(v) => setC({ ...c, company_name: v })} /></Field>
          <Field label="Phone"><TextInput value={c.phone || ''} onChange={(v) => setC({ ...c, phone: v })} /></Field>
          <Field label="WhatsApp"><TextInput value={c.whatsapp || ''} onChange={(v) => setC({ ...c, whatsapp: v })} placeholder="with country code, digits only" /></Field>
          <Field label="Email"><TextInput value={c.email || ''} onChange={(v) => setC({ ...c, email: v })} /></Field>
          <Field label="Address"><TextInput type="textarea" rows={2} value={c.address || ''} onChange={(v) => setC({ ...c, address: v })} /></Field>
          <Field label="Google Maps Link"><TextInput value={c.map_link || ''} onChange={(v) => setC({ ...c, map_link: v })} /></Field>
          <Field label="Business Hours"><TextInput value={c.business_hours || ''} onChange={(v) => setC({ ...c, business_hours: v })} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Instagram"><TextInput value={c.instagram || ''} onChange={(v) => setC({ ...c, instagram: v })} /></Field>
            <Field label="Facebook"><TextInput value={c.facebook || ''} onChange={(v) => setC({ ...c, facebook: v })} /></Field>
            <Field label="YouTube"><TextInput value={c.youtube || ''} onChange={(v) => setC({ ...c, youtube: v })} /></Field>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end"><Btn onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</Btn></div>
      <ToastHost />
    </div>
  )
}