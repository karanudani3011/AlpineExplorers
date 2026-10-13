import { useEffect, useState } from 'react'
import { Settings, Save, Phone, QrCode, AlertTriangle } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, FieldLabel, Modal, Badge, NAVY, GOLD } from '../../components/admin/admin-ui'
import { Field, TextInput, Toggle, ImageUpload } from '../../components/admin/FormFields'

export default function SettingsAdmin() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [s, setS] = useState(null)
  const [c, setC] = useState(null)
  const [bs, setBs] = useState({ qr_payment_enabled: 1, closed_message: 'Bookings are currently full. Please contact us for the next available dates.' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmTurnOffOpen, setConfirmTurnOffOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/settings'),
      api.get('/contact'),
      api.get('/booking-settings').catch(() => ({ settings: { qr_payment_enabled: 1, closed_message: 'Bookings are currently full. Please contact us for the next available dates.' } }))
    ])
      .then(([sd, cd, bsd]) => {
        setS(sd.settings || {})
        setC(cd.contact || {})
        if (bsd?.settings) {
          setBs({
            qr_payment_enabled: bsd.settings.qr_payment_enabled ? 1 : 0,
            closed_message: bsd.settings.closed_message || 'Bookings are currently full. Please contact us for the next available dates.'
          })
        }
      }).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/settings', s)
      await api.put('/contact', c)
      await api.put('/booking-settings', bs)
      addToast('Settings saved')
    } catch (e) { addToast(e.message, 'error') } finally { setSaving(false) }
  }

  const handleToggleQr = (nextVal) => {
    if (!nextVal) {
      // Trying to turn off: show confirm dialog
      setConfirmTurnOffOpen(true)
    } else {
      setBs(prev => ({ ...prev, qr_payment_enabled: 1 }))
    }
  }

  const confirmTurnOff = () => {
    setBs(prev => ({ ...prev, qr_payment_enabled: 0 }))
    setConfirmTurnOffOpen(false)
  }

  if (loading) return <Spinner />
  if (!s || !c) return null

  const isQrOn = Boolean(bs.qr_payment_enabled)

  return (
    <div>
      <PageHeader icon={Settings} title="Settings" subtitle="Site settings, booking availability & contact information"
        actions={<Btn onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</Btn>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking & Payment Settings Card */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-600">
                <QrCode size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base" style={{ fontFamily: 'Cinzel', color: NAVY }}>Booking &amp; Payment Settings</h3>
                <p className="text-xs text-stone-500">Global killswitch and availability messaging for all bookings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={isQrOn ? 'green' : 'amber'}>
                {isQrOn ? 'Accepting Payments (QR ON)' : 'Bookings Blocked (QR OFF)'}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: isQrOn ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)', background: isQrOn ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.03)' }}>
              <div>
                <div className="font-semibold text-sm" style={{ color: NAVY }}>Accept QR Payments (Global)</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  When turned OFF, the tour pages and book now buttons show &quot;Fully booked&quot;, booking forms block new entries, and Step 5 hides UPI/QR codes.
                </div>
              </div>
              <Toggle
                checked={isQrOn}
                onChange={handleToggleQr}
                label={isQrOn ? 'Accepting QR Payments' : 'QR Payments Disabled'}
              />
            </div>

            <Field label="Closed / Fully Booked Message" hint="Shown to travelers when QR payments are turned off or a tour is fully booked">
              <TextInput
                type="textarea"
                rows={2}
                value={bs.closed_message || ''}
                onChange={(v) => setBs({ ...bs, closed_message: v })}
                placeholder="Bookings are currently full. Please contact us for the next available dates."
              />
            </Field>
          </div>
        </Card>

        {/* Site Settings */}
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

        {/* Contact Settings */}
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

      {/* Confirm Turn Off Dialog */}
      <Modal open={confirmTurnOffOpen} onClose={() => setConfirmTurnOffOpen(false)} title="Disable QR Payments?" width={460}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800">
            <AlertTriangle className="flex-shrink-0 mt-0.5 text-amber-600" size={20} />
            <div className="text-sm">
              <p className="font-semibold">New bookings will be blocked until you turn this on.</p>
              <p className="text-xs text-amber-700 mt-1">Tour detail pages will display &quot;Fully booked&quot; and public users cannot proceed with checkout.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Btn tone="subtle" onClick={() => setConfirmTurnOffOpen(false)}>Cancel</Btn>
            <Btn tone="danger" onClick={confirmTurnOff}>Turn Off QR Payments</Btn>
          </div>
        </div>
      </Modal>

      <ToastHost />
    </div>
  )
}