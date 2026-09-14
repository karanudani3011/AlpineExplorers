import { X } from 'lucide-react'

export const NAVY = '#001a4d'
export const NAVY_DARK = '#0d1b3e'
export const GOLD = '#c59b27'
export const GOLD2 = '#d4af37'
export const CREAM = '#faf5ea'
export const BROWN = '#3a2a18'
export const BG = '#f5ecd8'

export const font = { vintage: "'Cinzel', serif", body: "'Inter', sans-serif" }

export function cls(...parts) { return parts.filter(Boolean).join(' ') }

export function Btn({ children, onClick, variant = 'primary', className = '', type = 'button', disabled }) {
  const styles = {
    primary: { background: 'linear-gradient(90deg,#c59b27,#d4af37)', color: NAVY, boxShadow: '0 6px 18px rgba(197,155,39,0.3)' },
    navy: { background: NAVY, color: '#fff', boxShadow: '0 6px 18px rgba(0,26,77,0.25)' },
    danger: { background: '#8b2518', color: '#fff' },
    ghost: { background: 'transparent', border: '1px solid rgba(0,26,77,0.2)', color: NAVY },
    ghostGold: { background: 'rgba(197,155,39,0.12)', border: '1px solid rgba(197,155,39,0.4)', color: NAVY },
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ ...fonts_btn, ...styles[variant], fontFamily: font.body }}>
      {children}
    </button>
  )
}

export const fonts_btn = { fontFamily: font.body }

export function PageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,rgba(197,155,39,0.2),rgba(212,175,55,0.1))', border: '1px solid rgba(197,155,39,0.35)' }}>
          <Icon size={20} style={{ color: GOLD }} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: font.vintage, color: NAVY }}>{title}</h1>
          {subtitle && <p className="text-xs" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: font.body }}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm border ${className}`}
      style={{ borderColor: 'rgba(180,160,130,0.25)', boxShadow: '0 8px 28px rgba(60,40,20,0.08)' }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, accent = GOLD }) {
  return (
    <div className="rounded-2xl bg-white p-5 border flex items-center gap-4"
      style={{ borderColor: 'rgba(180,160,130,0.25)', boxShadow: '0 8px 28px rgba(60,40,20,0.08)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}18`, color: accent }}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-bold" style={{ color: NAVY, fontFamily: font.vintage }}>{value}</div>
        <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: font.body }}>{label}</div>
      </div>
    </div>
  )
}

export function Badge({ children, tone }) {
  const map = {
    active: { bg: 'rgba(22,163,74,0.12)', color: '#166534' },
    inactive: { bg: 'rgba(148,163,184,0.15)', color: '#475569' },
    published: { bg: 'rgba(22,163,74,0.12)', color: '#166534' },
    draft: { bg: 'rgba(148,163,184,0.15)', color: '#475569' },
    unpublished: { bg: 'rgba(245,158,11,0.15)', color: '#b45309' },
    new: { bg: 'rgba(0,26,77,0.08)', color: NAVY },
    contacted: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },
    in_progress: { bg: 'rgba(245,158,11,0.15)', color: '#b45309' },
    converted: { bg: 'rgba(22,163,74,0.12)', color: '#166534' },
    closed: { bg: 'rgba(148,163,184,0.15)', color: '#475569' },
    super_admin: { bg: 'rgba(139,37,24,0.12)', color: '#8b2518' },
    admin: { bg: 'rgba(0,26,77,0.08)', color: NAVY },
    editor: { bg: 'rgba(197,155,39,0.15)', color: '#8a6d1a' },
  }
  const t = map[tone] || { bg: 'rgba(148,163,184,0.15)', color: '#475569' }
  return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide" style={{ background: t.bg, color: t.color, fontFamily: font.body }}>{children}</span>
}

export function EmptyState({ title = 'Nothing here yet', subtitle }) {
  return (
    <div className="text-center py-14">
      <div className="text-5xl mb-3 opacity-30">🗺️</div>
      <p className="font-bold" style={{ color: NAVY, fontFamily: font.vintage }}>{title}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: font.body }}>{subtitle}</p>}
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: GOLD, borderRightColor: GOLD }} />
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 640 }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4" style={{ background: 'rgba(13,27,62,0.55)', backdropFilter: 'blur(2px)' }}>
      <div className="relative rounded-2xl bg-white w-full my-8 shadow-2xl" style={{ maxWidth: width }}>
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
          <h3 className="font-bold" style={{ fontFamily: font.vintage, color: NAVY }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export function FieldLabel({ children, required }) {
  return <label className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: NAVY, fontFamily: font.body }}>
    {children} {required && <span style={{ color: '#8b2518' }}>*</span>}
  </label>
}

export function inputStyle() {
  return {
    width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(0,26,77,0.18)',
    fontFamily: font.body, fontSize: 13, background: '#fff', color: '#1a1a1a', outline: 'none',
  }
}

export function Toasts({ toasts, dismiss }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-[60] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} onClick={() => dismiss(t.id)} className="px-4 py-3 rounded-xl shadow-lg cursor-pointer text-sm font-semibold text-white"
          style={{ background: t.type === 'error' ? '#8b2518' : NAVY, fontFamily: font.body }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}