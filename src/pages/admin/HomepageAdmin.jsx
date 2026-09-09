import { useEffect, useState } from 'react'
import { Home, Save } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, FieldLabel, NAVY, GOLD } from '../../components/admin/admin-ui'
import { Field, TextInput, Toggle, ImageUpload, ListEditor } from '../../components/admin/FormFields'

const fonts = { fontFamily: "'Inter'" }
const inp = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.18)', fontSize: 13, outline: 'none', fontFamily: "'Inter'" }

const SECTIONS = [
  ['hero', 'Hero Section'],
  ['popular_destinations', 'Popular Destinations'],
  ['trending_tours', 'Trending Tours'],
  ['experiences', 'Experience Categories'],
  ['why_choose_us', 'Why Choose Us'],
  ['featured_packages', 'Featured Packages'],
  ['testimonials', 'Testimonials'],
  ['promotional_banners', 'Promotional Banners'],
]

export default function HomepageAdmin() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [h, setH] = useState({})

  useEffect(() => {
    api.get('/homepage').then((d) => {
      const hp = d.homepage || {}
      setH({
        hero_title: hp.hero_title || '', hero_subtitle: hp.hero_subtitle || '', hero_image: hp.hero_image || '',
        cta_primary_text: hp.cta_primary_text || '', cta_primary_link: hp.cta_primary_link || '',
        cta_secondary_text: hp.cta_secondary_text || '', cta_secondary_link: hp.cta_secondary_link || '',
        sections: hp.sections || {}, content: hp.content || {},
      })
    }).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }, [])

  const setSection = (k, v) => setH((s) => ({ ...s, sections: { ...s.sections, [k]: v } }))
  const setContent = (k, v) => setH((s) => ({ ...s, content: { ...s.content, [k]: v } }))
  const set = (k) => (v) => setH((s) => ({ ...s, [k]: v }))

  const save = async () => {
    setSaving(true)
    try { await api.put('/homepage', h); addToast('Homepage settings saved') } catch (e) { addToast(e.message, 'error') } finally { setSaving(false) }
  }

  if (loading) return <Spinner />
  if (!h) return null

  return (
    <div>
      <PageHeader icon={Home} title="Homepage Management" subtitle="Edit hero section, CTAs, sections & homepage content"
        actions={<Btn onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</Btn>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Hero Section</h3>
          <Field label="Hero Title"><TextInput value={h.hero_title} onChange={set('hero_title')} /></Field>
          <Field label="Hero Subtitle"><TextInput value={h.hero_subtitle} onChange={set('hero_subtitle')} /></Field>
          <Field label="Hero Image"><ImageUpload value={h.hero_image} onChange={set('hero_image')} /></Field>
        </Card>

        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>CTA Buttons</h3>
          <Field label="Primary Button Text"><TextInput value={h.cta_primary_text} onChange={set('cta_primary_text')} /></Field>
          <Field label="Primary Button Link"><TextInput value={h.cta_primary_link} onChange={set('cta_primary_link')} /></Field>
          <Field label="Secondary Button Text"><TextInput value={h.cta_secondary_text} onChange={set('cta_secondary_text')} /></Field>
          <Field label="Secondary Button Link"><TextInput value={h.cta_secondary_link} onChange={set('cta_secondary_link')} /></Field>
        </Card>

        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Section Visibility</h3>
          <div className="space-y-2.5">
            {SECTIONS.map(([k, label]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: NAVY }}>{label}</span>
                <Toggle checked={!!h.sections[k]} onChange={(v) => setSection(k, v)} />
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3" style={{ color: 'rgba(58,42,24,0.55)' }}>Disabled sections are hidden on the public homepage.</p>
        </Card>

        <Card>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Homepage Content</h3>
          <Field label="Popular Destinations" hint="Used in the popular destinations section">
            <ListEditor value={h.content.popularDestinations || []} onChange={(v) => setContent('popularDestinations', v)} placeholder="Add destination + Enter" />
          </Field>
          <Field label="Experience Categories">
            <ListEditor value={h.content.experienceCategories || []} onChange={(v) => setContent('experienceCategories', v)} placeholder="Add category + Enter" />
          </Field>
          <Field label="Why Choose Us">
            <ListEditor value={h.content.whyChooseUs || []} onChange={(v) => setContent('whyChooseUs', v)} placeholder="Add point + Enter" />
          </Field>
          <Field label="Testimonials" hint="One per line: Name — location — message">
            <ListEditor value={h.content.testimonials || []} onChange={(v) => setContent('testimonials', v)} placeholder='Name — City — Text' />
          </Field>
        </Card>
      </div>

      <div className="mt-6 flex justify-end"><Btn onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</Btn></div>
      <ToastHost />
    </div>
  )
}