import { PageHeader, Card } from './admin-ui'

export default function ComingSoon({ icon: Icon, title, subtitle, message, note }) {
  return (
    <div>
      <PageHeader icon={Icon} title={title} subtitle={subtitle} />
      <Card>
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg,rgb(var(--ae-gold-rgb) /0.18),rgb(var(--ae-gold2-rgb) /0.08))', border: '1px solid rgb(var(--ae-gold-rgb) /0.35)' }}>
            <Icon size={28} style={{ color: 'var(--ae-gold)' }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Cinzel', serif", color: 'var(--ae-navy)' }}>
            {title} — coming soon
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: 'rgb(var(--ae-ink-rgb) /0.65)', fontFamily: "'Inter', sans-serif" }}>
            {message}
          </p>
          {note && (
            <p className="text-xs mt-4 max-w-xl mx-auto" style={{ color: 'rgb(var(--ae-ink-rgb) /0.5)', fontFamily: "'Inter', sans-serif" }}>
              {note}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}