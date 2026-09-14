import { useEffect, useState } from 'react'
import { LayoutDashboard, Globe2, Map as MapIcon, Mountain, Tent, PenLine, Users, Inbox, Package, Image as ImageIcon, BarChart3, TrendingUp } from 'lucide-react'
import { api } from '../../services/api'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, StatCard, Card, Spinner, NAVY, GOLD, GOLD2 } from '../../components/admin/admin-ui'
import { Badge } from '../../components/admin/admin-ui'
import { useAuth } from '../../contexts/AuthContext'

const fonts = { fontFamily: "'Inter'" }

export default function Dashboard() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()
  const { hasPermission, hasModulePermission, isSuperAdmin } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then((d) => setData(d)).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!data) return null

  const { stats, byCategory, monthlyInquiries, topDestinations, recentActivity } = data
  const maxCat = Math.max(...byCategory.map((c) => c.value), 1)
  const maxMonth = Math.max(...monthlyInquiries.map((m) => m.value), 1)
  const maxDest = Math.max(...topDestinations.map((d) => d.value), 1)
  const maxActive = Math.max(stats.international, stats.domestic)

  const canSeeContent = isSuperAdmin || hasModulePermission('services') || hasModulePermission('blog')
  const canSeeBookings = isSuperAdmin || hasModulePermission('bookings')
  const canSeeInquiries = isSuperAdmin || hasModulePermission('contact')

  return (
    <div>
      <PageHeader icon={LayoutDashboard} title="Dashboard" subtitle={`Welcome back — here's what's happening`} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {canSeeContent && <StatCard label="International Packages" value={stats.international} icon={Globe2} accent="#1d4ed8" />}
        {canSeeContent && <StatCard label="Domestic Packages" value={stats.domestic} icon={MapIcon} accent="#15803d" />}
        {canSeeContent && <StatCard label="Adventure Packages" value={stats.adventure} icon={Mountain} accent="#8b2518" />}
        {canSeeContent && <StatCard label="Camping Packages" value={stats.camping} icon={Tent} accent="#b45309" />}
        {(isSuperAdmin || hasModulePermission('blog')) && <StatCard label="Blog Posts" value={stats.blogs} icon={PenLine} accent="#7c3aed" />}
        {isSuperAdmin && <StatCard label="Total Users" value={stats.users} icon={Users} accent="#0e7490" />}
        {canSeeInquiries && <StatCard label="New Inquiries" value={stats.newInquiries} icon={Inbox} accent={GOLD} />}
        {canSeeContent && <StatCard label="Active Packages" value={stats.activePackages} icon={Package} accent="#166534" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Packages by category */}
        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel', color: NAVY }}>
            <BarChart3 size={16} style={{ color: GOLD }} /> Packages by Category
          </h3>
          <div className="space-y-3">
            {byCategory.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs font-semibold mb-1" style={fonts}>
                  <span style={{ color: NAVY }}>{c.name}</span>
                  <span style={{ color: 'rgba(0,26,77,0.5)' }}>{c.value}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,26,77,0.06)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(c.value / maxCat) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: NAVY }}>International vs Domestic</h4>
            <div className="flex gap-4">
              <Bar label="International" value={stats.international} max={maxActive} color="#001a4d" />
              <Bar label="Domestic" value={stats.domestic} max={maxActive} color={GOLD} />
            </div>
          </div>
        </Card>

        {/* Monthly inquiries */}
        <Card>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Cinzel', color: NAVY }}>
            <TrendingUp size={16} style={{ color: GOLD }} /> Monthly Inquiries
          </h3>
          {monthlyInquiries.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: '#a59880' }}>No inquiries yet</p>
          ) : (
            <div className="flex items-end gap-2.5 h-40">
              {monthlyInquiries.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold" style={{ color: NAVY }}>{m.value}</span>
                  <div className="w-full rounded-t-lg transition-all" title={m.month}
                    style={{ height: `${(m.value / maxMonth) * 130}px`, minHeight: 6, background: `linear-gradient(180deg, ${GOLD2}, ${GOLD})` }} />
                  <span className="text-[9px]" style={{ color: 'rgba(0,26,77,0.5)' }}>{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Top destinations */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: NAVY }}>Top Inquiry Destinations</h4>
            <div className="space-y-2">
              {topDestinations.length === 0 && <p className="text-xs" style={{ color: '#a59880' }}>No destination data yet</p>}
              {topDestinations.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold w-32 truncate" style={{ color: NAVY }}>{d.name}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,26,77,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.value / maxDest) * 100}%`, background: '#001a4d' }} />
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: 'rgba(0,26,77,0.5)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <h3 className="font-bold mb-4" style={{ fontFamily: 'Cinzel', color: NAVY }}>Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: '#a59880' }}>No activity logged yet</p>
        ) : (
          <div className="space-y-0">
            {recentActivity.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(180,160,130,0.15)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(197,155,39,0.12)', color: GOLD }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={fonts}>
                    <span style={{ color: NAVY }}>{a.action}</span>
                    {a.details && <span className="text-[11px] font-normal text-gray-500"> — {a.details}</span>}
                  </p>
                  <p className="text-[10px]" style={{ color: 'rgba(0,26,77,0.45)', fontFamily: 'Inter' }}>
                    {a.user_name} · {a.module} · {a.created_at}
                  </p>
                </div>
                <Badge tone={a.module.toLowerCase() === 'auth' ? 'new' : undefined}>{a.module}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
      <ToastHost />
    </div>
  )
}

function Bar({ label, value, max, color }) {
  return (
    <div className="flex-1">
      <div className="text-[11px] font-semibold mb-1" style={{ color: 'rgba(0,26,77,0.6)' }}>{label}: <b style={{ color: NAVY }}>{value}</b></div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,26,77,0.06)' }}>
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  )
}