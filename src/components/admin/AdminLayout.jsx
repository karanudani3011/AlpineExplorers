import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Compass, Globe2, Map as MapIcon, Mountain, Tent, Plane, PenLine,
  Home, Info, Mail, Users, Settings, LogOut, Menu, X, CalendarDays, MapPinned, ChevronDown, FileText,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { BG, NAVY, GOLD, NAVY_DARK } from './admin-ui'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home, end: true, permission: 'dashboard.view' },
  {
    type: 'group', label: 'Services', icon: Compass, permission: 'services.view',
    children: [
      { to: '/admin/international', label: 'International', icon: Globe2 },
      { to: '/admin/domestic', label: 'Domestic', icon: MapIcon },
      { to: '/admin/adventure', label: 'Adventure Tours & Camps', icon: Mountain },
      { to: '/admin/camps', label: 'Camps & Nature', icon: Tent },
      { to: '/admin/services', label: 'Special Services', icon: Plane },
    ],
  },
  { to: '/admin/bookings', label: 'Bookings / Applications', icon: FileText, permission: 'bookings.view' },
  { to: '/admin/events', label: 'Upcoming Events', icon: CalendarDays, permission: 'events.view' },
  { to: '/admin/blog', label: 'Blog', icon: PenLine, permission: 'blog.view' },
  { to: '/admin/travel-mood', label: 'Find Your Travel Mood', icon: MapPinned, permission: 'travel_mood.view' },
  { to: '/admin/about', label: 'About Us', icon: Info, permission: 'about.view' },
  { to: '/admin/inquiries', label: 'Contact Us', icon: Mail, permission: 'contact.view' },
]

const BOTTOM_NAV = [
  { to: '/admin/settings', label: 'Settings', icon: Settings, permission: 'settings.view', superAdminOnly: true },
  { to: '/admin/users', label: 'Staff Management', icon: Users, permission: 'staff.view', superAdminOnly: true },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`

const linkStyle = ({ isActive }) => ({
  fontFamily: "'Inter', sans-serif",
  background: isActive ? 'linear-gradient(90deg, rgba(197,155,39,0.25), transparent)' : 'transparent',
})

function GroupItem({ group, onNavigate }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const active = group.children.some((c) => location.pathname.startsWith(c.to))
  const isOpen = open || active
  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${active ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
        style={{ fontFamily: "'Inter', sans-serif", background: active ? 'linear-gradient(90deg, rgba(197,155,39,0.25), transparent)' : 'transparent' }}>
        <group.icon size={17} style={{ color: GOLD }} className="shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown size={15} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: GOLD }} />
      </button>
      {isOpen && (
        <div className="mt-1 ml-3 pl-4 border-l space-y-1" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          {group.children.map((c) => (
            <NavLink key={c.to} to={c.to} end={!!c.exact} onClick={onNavigate} className={linkClass} style={linkStyle}>
              <c.icon size={15} style={{ color: GOLD }} className="shrink-0" /> {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarContent({ onNavigate, user, isSuperAdmin, hasPermission, onLogout }) {
  // Dynamically filter items by permission
  const items = NAV.filter((n) => {
    if (isSuperAdmin) return true
    return hasPermission(n.permission)
  })

  const bottomItems = BOTTOM_NAV.filter((n) => {
    if (isSuperAdmin) return true
    if (n.superAdminOnly) return false
    return hasPermission(n.permission)
  })

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
        {items.map((n) => n.type === 'group'
          ? <GroupItem key={n.label} group={n} onNavigate={onNavigate} />
          : (
            <NavLink key={n.to} to={n.to} end={!!n.end} onClick={onNavigate} className={linkClass} style={linkStyle}>
              <n.icon size={17} style={{ color: GOLD }} /> {n.label}
            </NavLink>
          ))}
      </nav>

      <div className="px-4 py-4 pb-safe border-t border-white/10">
        {bottomItems.map((n) => (
          <NavLink key={n.to} to={n.to} end={!!n.end} onClick={onNavigate} className={linkClass} style={linkStyle}>
            <n.icon size={16} style={{ color: GOLD }} /> {n.label}
          </NavLink>
        ))}
        <div className="flex items-center gap-2 mb-3 px-1 mt-3">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px] font-bold uppercase">
            {user?.full_name?.[0] || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-bold truncate">{user?.full_name || user?.email}</div>
            <div className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: GOLD }}>
              {isSuperAdmin ? 'SUPER ADMIN' : 'STAFF'}
            </div>
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
  const { user, isSuperAdmin, hasPermission, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const onLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40">
        <SidebarContent
          user={user}
          isSuperAdmin={isSuperAdmin}
          hasPermission={hasPermission}
          onNavigate={() => {}}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">
            <SidebarContent
              user={user}
              isSuperAdmin={isSuperAdmin}
              hasPermission={hasPermission}
              onNavigate={() => setMobileOpen(false)}
              onLogout={onLogout}
            />
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
        <button onClick={() => setMobileOpen(true)} className="touch-target rounded-lg bg-black/5"><Menu size={20} color={NAVY} /></button>
      </header>

      <main className="flex-1 lg:ml-64 px-3 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-12 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}