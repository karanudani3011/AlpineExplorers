import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Card, Spinner, EmptyState, Badge, NAVY } from '../../components/admin/admin-ui'

const fonts = { fontFamily: "'Inter'" }

export default function ActivityLogs() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/activity').then((d) => setLogs(d.logs || [])).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader icon={Activity} title="Activity Logs" subtitle="Track logins, content changes & admin actions" />

      <Card className="!p-0">
        {loading ? <Spinner /> : logs.length === 0 ? <EmptyState title="No activity recorded" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={fonts}>
              <thead>
                <tr>
                  {['User', 'Action', 'Module', 'Details', 'Date & Time'].map((h) => (
                    <th key={h} className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap" style={{ color: 'rgba(0,26,77,0.55)', borderBottom: '2px solid rgba(197,155,39,0.4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4 text-[12.5px] font-bold" style={{ color: NAVY }}>{l.user_name}</td>
                    <td className="py-3 px-4 text-[12.5px]">{l.action}</td>
                    <td className="py-3 px-4"><Badge>{l.module}</Badge></td>
                    <td className="py-3 px-4 text-[12px]" style={{ color: 'rgba(0,26,77,0.6)' }}>{l.details || '—'}</td>
                    <td className="py-3 px-4 text-[12px]" style={{ color: 'rgba(0,26,77,0.5)' }}>{l.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <ToastHost />
    </div>
  )
}