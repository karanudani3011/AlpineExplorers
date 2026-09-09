import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Globe2, Map as MapIcon, Mountain, Tent, Plane, PenLine,
  Image as ImageIcon, Home, Info, Inbox, Users, Settings, LogOut, Menu, X, Activity,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { BG, NAVY, GOLD, NAVY_DARK } from './admin-ui'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/international', label: 'International Tours', icon: Globe2, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/domestic', label: 'Domestic Tours', icon: MapIcon, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/adventure', label: 'Adventure', icon: Mountain, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/camps', label: 'Camps & Nature', icon: Tent, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/services', label: 'Services', icon: Plane, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/blog', label: 'Blog', icon: PenLine, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/media', label: 'Media', icon: ImageIcon, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/homepage', label: 'Homepage', icon: Home, roles: ['super_admin', 'admin'] },
  { to: '/admin/about', label: 'About Us', icon: Info, roles: ['super_admin', 'admin'] },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox, roles: ['super_admin', 'admin', 'editor'] },
  { to: '/admin/activity', label: 'Activity Logs', icon: Activity, roles: ['super_admin'] },
  { to: '/admin/users', label: 'Users', icon: Users, roles: ['super_admin'] },
  { to: '/admin/settings', label: 'Settings', icon: Settings, roles: ['super_admin'] },
]

function SidebarContent({ onNavigate, user, onLogout }) {
  const items = NAV.filter((n) => user && n.roles.includes(user.role))
  return (
    <div className="h-full flex flex-col" style={{ background: NAVY_DARK }}>
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: `linear-gradient(135deg,${GOLD},#e6c75c)`, color: NAVY, fontFamily: 'Cinzel' }}>AE</div>
          <div>
            <div className="text-white font-bold" style={{ fontFamily: 'Cinzel' }}>Alpine Explorers</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>Admin Panel</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
        {items.map((n) => (
          <NavLink key={n.to} to={n.to} end={!!n.exact} onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            style={({ isActive }) => ({ fontFamily: "'Inter'", background: isActive ? `linear-gradient(90deg, rgba(197,155,39,0.25), transparent)` : 'transparent' })}>
            <n.icon size={17} style={{ color: GOLD }} /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px] font-bold uppercase">{user?.full_name?.[0]}</div>
          <div className="min-w-0">
            <div className="text-white text-xs font-bold truncate">{user?.full_name}</div>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: GOLD }}>{user?.role?.replace('_', ' ')}</div>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/10 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const onLogout = async () => { await logout(); navigate('/admin/login') }

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40">
        <SidebarContent user={user} onNavigate={() => {}} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">
            <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} onLogout={onLogout} />
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-white/90 backdrop-blur border-b"
        style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
        <div className="flex items-center gap-2 font-bold" style={{ fontFamily: 'Cinzel', color: NAVY }}>
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px]" style={{ background: `linear-gradient(135deg,${GOLD},#e6c75c)`, color: NAVY }}>AE</span>
          Alpine Explorers
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg bg-black/5"><Menu size={20} color={NAVY} /></button>
      </header>

      <main className="flex-1 lg:ml-64 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-12">
        <Outlet />
      </main>
    </div>
  )
}