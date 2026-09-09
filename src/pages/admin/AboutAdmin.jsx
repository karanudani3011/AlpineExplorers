import { useEffect, useState } from 'react'
import { Info, Save } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, NAVY } from '../../components/admin/admin-ui'
import { Field, TextInput, ImageUpload, ListEditor } from '../../components/admin/FormFields'

function SplitList({ label, value, onChange, placeholder }) {
  return (
    <Field label={label} hint="Entries helpfully line-by-line">
      <ListEditor value={value} onChange={onChange} placeholder={placeholder} />
    </Field>
  )
}

export default function AboutAdmin() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [a, setA] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/about').then((d) => {
      const r = d.about || {}
      setA({
        legacy_description: r.legacy_description || '', founder_name: r.founder_name || '',
        founder_title: r.founder_title || '', founder_bio: r.founder_bio || '', founder_image: r.founder_image || '',
        mission: r.mission || '', vision: r.vision || '',
        values: r.values_list || [], recognition: r.recognition || [], statistics: r.statistics || [],
      })
    }).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }, [])

  const set = (k) => (v) => setA((s) => ({ ...s, [k]: v }))

  const save = async () => {
    setSaving(true)
    try { await api.put('/about', a); addToast('About Us content saved') } catch (e) { addToast(e.message, 'error') } finally { setSaving(false) }
  }

  if (loading) return <Spinner />
  if (!a) return null

  return (
    <div>
      <PageHeader icon={Info} title="About Us Management" subtitle="Edit legacy, founder, mission, values & recognition"
        actions={<Btn onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</Btn>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Our Legacy</h3>
          <Field label="Legacy Description"><TextInput type="textarea" rows={5} value={a.legacy_description} onChange={set('legacy_description')} /></Field>
        </Card>

        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Founder</h3>
          <Field label="Founder Name"><TextInput value={a.founder_name} onChange={set('founder_name')} /></Field>
          <Field label="Founder Title"><TextInput value={a.founder_title} onChange={set('founder_title')} /></Field>
          <Field label="Founder Bio"><TextInput type="textarea" rows={3} value={a.founder_bio} onChange={set('founder_bio')} /></Field>
          <Field label="Founder Image"><ImageUpload value={a.founder_image} onChange={set('founder_image')} /></Field>
        </Card>

        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Mission & Vision</h3>
          <Field label="Mission"><TextInput type="textarea" rows={3} value={a.mission} onChange={set('mission')} /></Field>
          <Field label="Vision"><TextInput type="textarea" rows={3} value={a.vision} onChange={set('vision')} /></Field>
          <SplitList label="Core Values" value={a.values} onChange={set('values')} placeholder="Add value + Enter" />
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Statistics</h3>
            <p className="text-[11px] mb-3" style={{ color: 'rgba(58,42,24,0.55)' }}>Format: Label — value (e.g. Years of Legacy — 28)</p>
            <ListEditor value={a.statistics} onChange={set('statistics')} placeholder="Label — value" />
          </Card>

          <Card>
            <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Recognition & Associations</h3>
            <p className="text-[11px] mb-3" style={{ color: 'rgba(58,42,24,0.55)' }}>Format: Label — kind (kind = Awarded By or Instructor Association)</p>
            <ListEditor value={a.recognition} onChange={set('recognition')} placeholder="President X — Awarded By" />
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end"><Btn onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</Btn></div>
      <ToastHost />
    </div>
  )
}