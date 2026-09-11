import { PageHeader, Card } from './admin-ui'

export default function ComingSoon({ icon: Icon, title, subtitle, message, note }) {
  return (
    <div>
      <PageHeader icon={Icon} title={title} subtitle={subtitle} />
      <Card>
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg,rgba(197,155,39,0.18),rgba(212,175,55,0.08))', border: '1px solid rgba(197,155,39,0.35)' }}>
            <Icon size={28} style={{ color: '#c59b27' }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Cinzel', serif", color: '#001a4d' }}>
            {title} — coming soon
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(58,42,24,0.65)', fontFamily: "'Inter', sans-serif" }}>
            {message}
          </p>
          {note && (
            <p className="text-xs mt-4 max-w-xl mx-auto" style={{ color: 'rgba(58,42,24,0.5)', fontFamily: "'Inter', sans-serif" }}>
              {note}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}