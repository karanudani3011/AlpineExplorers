import { Globe2, Map as MapIcon, Mountain, Tent, Plane, PenLine } from 'lucide-react'
import CrudPage from '../../components/admin/CrudPage'
import { IMAGE_PRESETS } from './imagePresets'

const Thumb = ({ src, alt }) => src
  ? <img src={src} alt={alt} className="w-14 h-10 rounded object-cover" />
  : <div className="w-14 h-10 rounded" style={{ background: 'rgba(180,160,130,0.15)' }} />

const PRICE = (r) => r.price ? <span className="font-bold">₹{(+r.price).toLocaleString('en-IN')}</span> : <span className="opacity-40">—</span>

const T = (v, c = NAVYc) => <span style={c}>{v}</span>
const NAVYc = { color: '#001a4d', fontFamily: "'Inter'" }

export function InternationalPage() {
  return (
    <CrudPage config={{
      title: 'International Tours', subtitle: 'Manage international destinations & packages', icon: Globe2, itemName: 'Package',
      endpoint: '/api/international', resourceKey: 'international',
      emptyHint: 'No international packages yet',
      columns: [
        { key: 'image', label: 'Image', render: (r) => <Thumb src={r.image} alt={r.destination} /> },
        { key: 'destination', label: 'Destination', render: (r) => <div style={NAVYc}><div className="font-bold">{r.destination}</div><div className="text-[10px] opacity-60">{r.country}</div></div> },
        { key: 'duration', label: 'Duration', render: (r) => T(r.duration) },
        { key: 'price', label: 'Price', render: PRICE },
      ],
      fields: [
        { name: 'destination', label: 'Destination', type: 'text', required: true },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text', hint: 'e.g. 5N/6D · 7N/8D' },
        { name: 'price', label: 'Price (₹)', type: 'number' },
        { name: 'original_price', label: 'Original Price (₹)', type: 'number' },
        { name: 'short_description', label: 'Short Description', type: 'textarea', rows: 2 },
        { name: 'full_description', label: 'Full Description', type: 'textarea', rows: 4, span: 2 },
        { name: 'image', label: 'Cover Image', type: 'image', preset: IMAGE_PRESETS.international, span: 2 },
        { name: 'gallery', label: 'Gallery Image URLs', type: 'list', placeholder: 'Paste an image URL + Enter', span: 2 },
        { name: 'air_ticket', label: 'Inclusions', type: 'switch', toggleLabel: 'Air Ticket', default: true },
        { name: 'passport_visa', label: 'Passport & Visa', type: 'switch', toggleLabel: 'Passport & Visa', default: true },
        { name: 'pickup_drop', label: 'Pickup & Drop', type: 'switch', toggleLabel: 'Pickup & Drop', default: true },
        { name: 'accommodation', label: 'Accommodation', type: 'switch', toggleLabel: 'Accommodation', default: true },
        { name: 'food', label: 'Food', type: 'switch', toggleLabel: 'Food', default: true },
        { name: 'sightseeing', label: 'Sightseeing', type: 'switch', toggleLabel: 'Sightseeing', default: true },
        { name: 'guidance', label: 'Guidance', type: 'switch', toggleLabel: 'Guidance', default: true },
        { name: 'featured', label: 'Featured', type: 'switch', toggleLabel: 'Featured package', default: false },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
      ],
    }} />
  )
}

export function DomesticPage() {
  return (
    <CrudPage config={{
      title: 'Domestic Tours', subtitle: 'Manage India travel packages', icon: MapIcon, itemName: 'Package',
      endpoint: '/api/domestic', resourceKey: 'domestic',
      emptyHint: 'No domestic packages yet',
      columns: [
        { key: 'image', label: 'Image', render: (r) => <Thumb src={r.image} alt={r.destination} /> },
        { key: 'destination', label: 'Destination', render: (r) => <div style={NAVYc}><div className="font-bold">{r.destination}</div><div className="text-[10px] opacity-60">{r.state}</div></div> },
        { key: 'duration', label: 'Duration', render: (r) => T(r.duration) },
        { key: 'season', label: 'Season', render: (r) => T(r.season) },
        { key: 'price', label: 'Price' },
      ],
      fields: [
        { name: 'destination', label: 'Destination', type: 'text', required: true },
        { name: 'state', label: 'State / Region', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'season', label: 'Season', type: 'text' },
        { name: 'price', label: 'Price (₹)', type: 'number' },
        { name: 'short_description', label: 'Short Description', type: 'textarea', rows: 2 },
        { name: 'full_description', label: 'Full Description', type: 'textarea', rows: 4, span: 2 },
        { name: 'image', label: 'Cover Image', type: 'image', preset: IMAGE_PRESETS.domestic, span: 2 },
        { name: 'gallery', label: 'Gallery Image URLs', type: 'list', placeholder: 'Paste an image URL + Enter', span: 2 },
        { name: 'transportation', label: 'Transportation', type: 'switch', toggleLabel: 'Transportation', default: true },
        { name: 'accommodation', label: 'Accommodation', type: 'switch', toggleLabel: 'Accommodation', default: true },
        { name: 'food', label: 'Food', type: 'switch', toggleLabel: 'Food', default: true },
        { name: 'sightseeing', label: 'Sightseeing', type: 'switch', toggleLabel: 'Sightseeing', default: true },
        { name: 'activities', label: 'Activities', type: 'list', placeholder: 'Add an activity + Enter', span: 2 },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
      ],
    }} />
  )
}

export function AdventurePage() {
  return (
    <CrudPage config={{
      title: 'Adventure', subtitle: 'Treks, expeditions & adventure camps', icon: Mountain, itemName: 'Adventure Package',
      endpoint: '/api/adventure', resourceKey: 'adventure',
      emptyHint: 'No adventure packages yet',
      columns: [
        { key: 'image', label: 'Image', render: (r) => <Thumb src={r.image} alt={r.title} /> },
        { key: 'title', label: 'Title', render: (r) => <div style={NAVYc}><div className="font-bold">{r.title}</div><div className="text-[10px] opacity-60">{r.category}</div></div> },
        { key: 'location', label: 'Location', render: (r) => T(r.location) },
        { key: 'duration', label: 'Duration', render: (r) => T(r.duration) },
        { key: 'season', label: 'Season', render: (r) => T(r.season) },
      ],
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Trekking', 'Adventure Camp', 'Biking', 'Camping', 'Other'] },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Uttarakhand' },
        { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 9D/8N' },
        { name: 'season', label: 'Season', type: 'text', placeholder: 'e.g. December – February' },
        { name: 'ex', label: 'Ex / Starting Point', type: 'text', placeholder: 'Ex. Gujarat / Ex. Delhi' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, span: 2 },
        { name: 'activities', label: 'Activities', type: 'list', placeholder: 'Add activity + Enter', suggestions: ['Rock Climbing', 'Rappelling', 'Snow Craft', 'Paragliding', 'Rafting', 'Trekking', 'Sports'], span: 2 },
        { name: 'includes', label: 'Inclusions', type: 'list', placeholder: 'Add inclusion + Enter', span: 2 },
        { name: 'image', label: 'Cover Image', type: 'image', preset: IMAGE_PRESETS.adventure, span: 2 },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
      ],
    }} />
  )
}

export function CampsPage() {
  return (
    <CrudPage config={{
      title: 'Camps & Nature', subtitle: 'Wildlife, marine & family camping packages', icon: Tent, itemName: 'Camp',
      endpoint: '/api/camps', resourceKey: 'camping',
      emptyHint: 'No camping packages yet',
      columns: [
        { key: 'image', label: 'Image', render: (r) => <Thumb src={r.image} alt={r.title} /> },
        { key: 'title', label: 'Title', render: (r) => <div style={NAVYc}><div className="font-bold">{r.title}</div><div className="text-[10px] opacity-60">{r.location}</div></div> },
        { key: 'duration', label: 'Duration', render: (r) => T(r.duration) },
        { key: 'season', label: 'Season', render: (r) => T(r.season) },
      ],
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Sasan Gir, Gujarat' },
        { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 2N/3D' },
        { name: 'season', label: 'Season', type: 'text', placeholder: 'e.g. November – March' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, span: 2 },
        { name: 'activities', label: 'Activities', type: 'list', placeholder: 'Add activity + Enter', span: 2 },
        { name: 'accommodation', label: 'Accommodation', type: 'text', span: 2 },
        { name: 'food', label: 'Food', type: 'text', span: 2 },
        { name: 'charges', label: 'Camp Charges', type: 'text', placeholder: 'e.g. On request / ₹4000 per person' },
        { name: 'certificates', label: 'Certificates', type: 'text', placeholder: 'e.g. Certificate on completion' },
        { name: 'rules', label: 'Rules', type: 'list', placeholder: 'Add rule + Enter', span: 2 },
        { name: 'what_to_bring', label: 'What To Bring', type: 'list', placeholder: 'Add item + Enter', span: 2 },
        { name: 'image', label: 'Cover Image', type: 'image', preset: IMAGE_PRESETS.camping, span: 2 },
        { name: 'gallery', label: 'Gallery Image URLs', type: 'list', placeholder: 'Paste image URL + Enter', span: 2 },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
      ],
    }} />
  )
}

export function ServicesPage() {
  return (
    <CrudPage config={{
      title: 'Services', subtitle: 'Special travel & tour services', icon: Plane, itemName: 'Service',
      endpoint: '/api/services', resourceKey: 'services',
      emptyHint: 'No services yet',
      columns: [
        { key: 'icon', label: 'Icon', render: (r) => <span className="text-lg">{r.icon === 'custom' ? '✦' : r.icon}</span> },
        { key: 'title', label: 'Title', render: (r) => <div style={NAVYc}><div className="font-bold">{r.title}</div><div className="text-[10px] opacity-60">{r.description}</div></div> },
        { key: 'category', label: 'Category', render: (r) => T(r.category) },
      ],
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'icon', label: 'Icon', type: 'select', options: ['Plane', 'Building2', 'FileCheck', 'Banknote', 'Heart', 'Users', 'Ship', 'Tent', 'Trees', 'TreePine', 'Mountain', 'GraduationCap', 'Globe', 'Compass'] },
        { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Travel, Tour, Camping, Education' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
      ],
    }} />
  )
}

export function BlogPage() {
  return (
    <CrudPage config={{
      title: 'Blog', subtitle: 'Write, publish & manage blog posts', icon: PenLine, itemName: 'Post',
      endpoint: '/api/blogs', resourceKey: 'blogs', saveMessage: 'Blog saved',
      statusNext: (s) => (s === 'published' ? 'draft' : 'published'),
      columns: [
        { key: 'cover_image', label: 'Cover', render: (r) => <Thumb src={r.cover_image} alt={r.title} /> },
        { key: 'title', label: 'Title', render: (r) => <div style={NAVYc}><div className="font-bold max-w-[220px] truncate">{r.title}</div><div className="text-[10px] opacity-60">{r.category} · {r.author}</div></div> },
        { key: 'publish_date', label: 'Publish Date', render: (r) => T(r.publish_date || '—') },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge s={r.status} /> },
        { key: 'featured', label: 'Featured', render: (r) => (r.featured ? <span style={{ color: '#c59b27' }}>★</span> : <span className="opacity-30">☆</span>) },
      ],
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, span: 2 },
        { name: 'slug', label: 'Slug', type: 'text', hint: 'Leave blank to auto-generate from title' },
        { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Trekking, Camping, Beaches' },
        { name: 'author', label: 'Author', type: 'text', placeholder: 'Alpine Explorers' },
        { name: 'cover_image', label: 'Cover Image', type: 'image', preset: IMAGE_PRESETS.blog, span: 2 },
        { name: 'short_description', label: 'Short Description', type: 'textarea', rows: 2, span: 2 },
        { name: 'content', label: 'Full Content', type: 'textarea', rows: 9, span: 2, hint: 'Separate paragraphs with a blank line' },
        { name: 'tags', label: 'Tags', type: 'tags', suggestions: ['Trekking', 'Camping', 'Wildlife', 'Beaches', 'Himalayas', 'Family', 'Adventure'], span: 2 },
        { name: 'publish_date', label: 'Publish Date', type: 'text', placeholder: 'YYYY-MM-DD' },
        { name: 'featured', label: 'Featured', type: 'switch', toggleLabel: 'Featured post', default: false },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'unpublished'] },
      ],
    }} />
  )
}

function StatusBadge({ s }) {
  const map = { published: { b: 'rgba(22,163,74,0.12)', c: '#166534' }, draft: { b: 'rgba(148,163,184,0.15)', c: '#475569' }, unpublished: { b: 'rgba(245,158,11,0.15)', c: '#b45309' }, active: { b: 'rgba(22,163,74,0.12)', c: '#166534' }, inactive: { b: 'rgba(148,163,184,0.15)', c: '#475569' } }
  const t = map[s] || map.draft
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: t.b, color: t.c }}>{s}</span>
}