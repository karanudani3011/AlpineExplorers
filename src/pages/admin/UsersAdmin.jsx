import { useEffect, useState, useMemo } from 'react'
import {
  Users, Plus, Edit, Trash2, KeyRound, ShieldCheck, Shield, Check,
  Eye, EyeOff, X, Lock, CheckSquare, Square, AlertTriangle, UserCheck, UserX,
  Compass, PenLine, CalendarDays, FileText, Info, Mail, Settings, LayoutDashboard,
  Sparkles,
} from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useToasts } from '../../components/admin/useToasts'
import {
  PageHeader, Btn, Card, Modal, Spinner, EmptyState, Badge, NAVY, GOLD, GOLD2, BG,
} from '../../components/admin/admin-ui'
import { Field, TextInput } from '../../components/admin/FormFields'

const fonts = { fontFamily: "'Inter', sans-serif" }

// ── MODULE PERMISSION DEFINITIONS (9 CORE MODULES) ──
export const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Main admin dashboard, statistics and analytics overview',
    permissions: [
      { key: 'dashboard.view', label: 'View Dashboard' },
    ],
  },
  {
    id: 'blog',
    label: 'Blog Management',
    icon: PenLine,
    description: 'Travel articles, stories, publications & publishing controls',
    permissions: [
      { key: 'blog.view', label: 'View Blog Posts' },
      { key: 'blog.create', label: 'Create New Post' },
      { key: 'blog.edit', label: 'Edit Posts' },
      { key: 'blog.publish', label: 'Publish / Unpublish Posts' },
      { key: 'blog.delete', label: 'Delete Posts' },
    ],
  },
  {
    id: 'services',
    label: 'Services & Tour Packages',
    icon: Compass,
    description: 'International, Domestic, Adventure, Camps & Special Services',
    permissions: [
      { key: 'services.view', label: 'View Packages & Services' },
      { key: 'services.create', label: 'Create Package' },
      { key: 'services.edit', label: 'Edit Package' },
      { key: 'services.delete', label: 'Delete Package' },
    ],
  },
  {
    id: 'bookings',
    label: 'Bookings / Applications',
    icon: FileText,
    description: 'Manage customer bookings, travelers, forms & PDF/Excel exports',
    permissions: [
      { key: 'bookings.view', label: 'View Bookings' },
      { key: 'bookings.view_details', label: 'View Booking Details' },
      { key: 'bookings.edit', label: 'Edit Booking Status' },
      { key: 'bookings.delete', label: 'Delete Bookings' },
      { key: 'bookings.export_pdf', label: 'Export Bookings PDF' },
      { key: 'bookings.export_excel', label: 'Export Bookings Excel' },
      { key: 'bookings.export_individual_pdf', label: 'Export Traveler Form PDF' },
      { key: 'bookings.export_individual_excel', label: 'Export Traveler Excel' },
    ],
  },
  {
    id: 'events',
    label: 'Upcoming Events',
    icon: CalendarDays,
    description: 'Upcoming excursions, seasonal meetups and events',
    permissions: [
      { key: 'events.view', label: 'View Events' },
      { key: 'events.create', label: 'Create Event' },
      { key: 'events.edit', label: 'Edit Event' },
      { key: 'events.delete', label: 'Delete Event' },
    ],
  },
  {
    id: 'about',
    label: 'About Us',
    icon: Info,
    description: 'Company legacy, leadership story and achievements',
    permissions: [
      { key: 'about.view', label: 'View About Us' },
      { key: 'about.edit', label: 'Edit About Us Content' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact & Inquiries',
    icon: Mail,
    description: 'Customer inquiries, messages and contact settings',
    permissions: [
      { key: 'contact.view', label: 'View Inquiries & Messages' },
      { key: 'contact.edit', label: 'Manage Contact Inquiries' },
      { key: 'contact.delete', label: 'Delete Inquiries' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff Management',
    icon: Users,
    description: 'Manage staff accounts, credentials and permissions',
    permissions: [
      { key: 'staff.view', label: 'View Staff List' },
      { key: 'staff.create', label: 'Create Staff Accounts' },
      { key: 'staff.edit', label: 'Edit Staff Details' },
      { key: 'staff.permissions', label: 'Assign & Edit Permissions' },
      { key: 'staff.activate', label: 'Activate / Deactivate Staff' },
      { key: 'staff.reset_password', label: 'Reset Staff Password' },
      { key: 'staff.delete', label: 'Delete Staff Accounts' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Global system configurations and website settings',
    permissions: [
      { key: 'settings.view', label: 'View System Settings' },
      { key: 'settings.edit', label: 'Edit System Settings' },
    ],
  },
]

// All individual permission keys list
const ALL_PERMISSION_KEYS = PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.key))

// Quick permission presets
const PRESET_TEMPLATES = [
  {
    id: 'all',
    label: 'Full Access',
    icon: Sparkles,
    keys: ALL_PERMISSION_KEYS,
  },
  {
    id: 'blog_editor',
    label: 'Blog Editor',
    icon: PenLine,
    keys: ['dashboard.view', 'blog.view', 'blog.create', 'blog.edit', 'blog.publish', 'blog.delete'],
  },
  {
    id: 'tours_manager',
    label: 'Tours & Bookings',
    icon: Compass,
    keys: [
      'dashboard.view',
      'services.view', 'services.create', 'services.edit',
      'bookings.view', 'bookings.view_details', 'bookings.edit', 'bookings.export_pdf', 'bookings.export_excel',
      'events.view', 'events.create', 'events.edit',
    ],
  },
  {
    id: 'support',
    label: 'Support & Inquiries',
    icon: Mail,
    keys: ['dashboard.view', 'contact.view', 'contact.edit', 'bookings.view', 'bookings.view_details'],
  },
  {
    id: 'dashboard_only',
    label: 'Dashboard Only',
    icon: LayoutDashboard,
    keys: ['dashboard.view'],
  },
]

/**
 * Reusable Personalized Access & Permissions Selector Component
 */
function PermissionsPicker({ value = [], onChange, title = 'Personalized Admin Access', subtitle }) {
  const togglePermission = (key) => {
    if (value.includes(key)) {
      onChange(value.filter((k) => k !== key))
    } else {
      onChange([...value, key])
    }
  }

  const toggleModuleAll = (modulePermissions) => {
    const keys = modulePermissions.map((p) => p.key)
    const allSelected = keys.every((k) => value.includes(k))
    if (allSelected) {
      onChange(value.filter((k) => !keys.includes(k)))
    } else {
      onChange(Array.from(new Set([...value, ...keys])))
    }
  }

  const applyPreset = (presetKeys) => {
    onChange(presetKeys)
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Header with Title & Presets */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgb(var(--ae-navy-rgb) /0.03)', borderColor: 'rgb(var(--ae-navy-rgb) /0.12)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: NAVY }}>
              <Shield size={16} style={{ color: GOLD }} />
              {title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {subtitle || 'Select which sections & actions this staff member can access in the admin panel.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgb(var(--ae-gold-rgb) /0.15)', color: NAVY }}>
              {value.length} of {ALL_PERMISSION_KEYS.length} Selected
            </span>
          </div>
        </div>

        {/* Quick Role Presets */}
        <div className="pt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'rgb(var(--ae-navy-rgb) /0.6)' }}>
            Quick Role Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_TEMPLATES.map((preset) => {
              const IconComp = preset.icon
              const isMatch = preset.keys.length === value.length && preset.keys.every((k) => value.includes(k))
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.keys)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  style={{
                    background: isMatch ? NAVY : '#fff',
                    color: isMatch ? '#fff' : NAVY,
                    border: `1px solid ${isMatch ? NAVY : 'rgb(var(--ae-navy-rgb) /0.18)'}`,
                    boxShadow: isMatch ? '0 2px 8px rgb(var(--ae-navy-rgb) /0.2)' : 'none',
                  }}
                >
                  <IconComp size={13} style={{ color: isMatch ? GOLD : GOLD }} />
                  {preset.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => onChange([])}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-red-600 bg-white border border-gray-200 transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Module Permission Cards */}
      <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
        {PERMISSION_MODULES.map((mod) => {
          const ModIcon = mod.icon
          const allModSelected = mod.permissions.every((p) => value.includes(p.key))
          const someModSelected = mod.permissions.some((p) => value.includes(p.key))
          const modCount = mod.permissions.filter((p) => value.includes(p.key)).length

          return (
            <div
              key={mod.id}
              className="rounded-2xl border p-3.5 sm:p-4 transition-all"
              style={{
                borderColor: someModSelected ? 'rgb(var(--ae-gold-rgb) /0.5)' : 'rgb(var(--ae-navy-rgb) /0.12)',
                background: someModSelected ? 'rgb(var(--ae-gold-rgb) /0.03)' : '#fff',
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: someModSelected ? 'rgb(var(--ae-gold-rgb) /0.15)' : 'rgb(var(--ae-navy-rgb) /0.06)',
                      color: someModSelected ? NAVY : 'rgb(var(--ae-navy-rgb) /0.5)',
                    }}
                  >
                    <ModIcon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-2" style={{ color: NAVY }}>
                      {mod.label}
                      {modCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-900">
                          {modCount}/{mod.permissions.length}
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-gray-500">{mod.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleModuleAll(mod.permissions)}
                  className="text-xs font-bold hover:underline py-1 px-2 rounded hover:bg-black/5"
                  style={{ color: GOLD }}
                >
                  {allModSelected ? 'Uncheck All' : 'Check All'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mod.permissions.map((perm) => {
                  const checked = value.includes(perm.key)
                  return (
                    <label
                      key={perm.key}
                      onClick={() => togglePermission(perm.key)}
                      className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer select-none transition hover:bg-black/[0.03] border border-transparent hover:border-gray-200"
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center transition shrink-0"
                        style={{
                          background: checked ? GOLD : '#fff',
                          border: `1.5px solid ${checked ? GOLD : 'rgb(var(--ae-navy-rgb) /0.25)'}`,
                          color: checked ? NAVY : 'transparent',
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className={`text-xs ${checked ? 'font-bold' : 'font-medium'}`} style={{ color: NAVY }}>
                        {perm.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function UsersAdmin() {
  const { user: me } = useAuth()
  const { toasts, addToast, dismiss, ToastHost } = useToasts()

  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false)
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // Target item state
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Form states
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    status: 'ACTIVE',
    permissions: [],
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
    permissions: [],
  })

  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showResetPass, setShowResetPass] = useState(false)

  // Load staff list
  const loadStaff = async () => {
    setLoading(true)
    try {
      const data = await api.get('/staff')
      setStaffList(data.staff || [])
    } catch (e) {
      addToast(e.message || 'Failed to load staff list', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  // ── CREATE STAFF ──
  const openCreateModal = () => {
    setCreateForm({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
      status: 'ACTIVE',
      permissions: ['dashboard.view', 'blog.view'], // Default starter permissions
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    setCreateModalOpen(true)
  }

  const handleCreateStaff = async (e) => {
    if (e) e.preventDefault()
    if (!createForm.full_name?.trim()) return addToast('Full Name is required', 'error')
    if (!createForm.email?.trim()) return addToast('Email is required', 'error')
    if (!createForm.password) return addToast('Password is required', 'error')
    if (createForm.password.length < 8) return addToast('Password must be at least 8 characters long', 'error')
    if (createForm.password !== createForm.confirm) return addToast('Passwords do not match', 'error')

    setActionLoading(true)
    try {
      await api.post('/staff', {
        ...createForm,
        email: createForm.email.trim().toLowerCase(),
      })
      addToast('Staff account created with personalized access!', 'success')
      setCreateModalOpen(false)
      loadStaff()
    } catch (err) {
      addToast(err.message || 'Failed to create staff account', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // ── EDIT STAFF ──
  const openEditModal = (staff) => {
    setSelectedStaff(staff)
    setEditForm({
      full_name: staff.full_name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      status: staff.status || 'ACTIVE',
      permissions: staff.permissions || [],
    })
    setEditModalOpen(true)
  }

  const handleEditStaff = async () => {
    if (!selectedStaff) return
    if (!editForm.full_name?.trim()) return addToast('Full Name is required', 'error')
    if (!editForm.email?.trim()) return addToast('Email is required', 'error')

    setActionLoading(true)
    try {
      await api.put(`/staff/${selectedStaff.id}`, editForm)
      addToast('Staff details and access permissions updated!', 'success')
      setEditModalOpen(false)
      loadStaff()
    } catch (err) {
      addToast(err.message || 'Failed to update staff account', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // ── MANAGE PERMISSIONS MODAL ──
  const openPermissionsModal = (staff) => {
    setSelectedStaff(staff)
    setSelectedPermissions(staff.permissions || [])
    setPermissionsModalOpen(true)
  }

  const handleSavePermissions = async () => {
    if (!selectedStaff) return
    setActionLoading(true)
    try {
      await api.patch(`/staff/${selectedStaff.id}/permissions`, {
        permissions: selectedPermissions,
      })
      addToast('Permissions updated successfully.', 'success')
      setPermissionsModalOpen(false)
      loadStaff()
    } catch (err) {
      addToast(err.message || 'Failed to save permissions', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // ── ACTIVATE / DEACTIVATE ──
  const openDeactivateModal = (staff) => {
    setSelectedStaff(staff)
    setDeactivateModalOpen(true)
  }

  const handleToggleStatus = async () => {
    if (!selectedStaff) return
    const nextStatus = selectedStaff.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setActionLoading(true)
    try {
      await api.patch(`/staff/${selectedStaff.id}/status`, { status: nextStatus })
      addToast(
        nextStatus === 'ACTIVE'
          ? 'Staff account activated successfully.'
          : 'Staff account deactivated successfully.',
        'success'
      )
      setDeactivateModalOpen(false)
      loadStaff()
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // ── RESET PASSWORD ──
  const openResetPasswordModal = (staff) => {
    setSelectedStaff(staff)
    setNewPassword('')
    setConfirmNewPassword('')
    setShowResetPass(false)
    setResetPasswordModalOpen(true)
  }

  const handleResetPassword = async () => {
    if (!selectedStaff) return
    if (!newPassword || newPassword.length < 8) {
      return addToast('Password must be at least 8 characters long', 'error')
    }
    if (newPassword !== confirmNewPassword) {
      return addToast('Passwords do not match', 'error')
    }

    setActionLoading(true)
    try {
      await api.patch(`/staff/${selectedStaff.id}/reset-password`, {
        password: newPassword,
        confirm: confirmNewPassword,
      })
      addToast('Password reset successfully.', 'success')
      setResetPasswordModalOpen(false)
    } catch (err) {
      addToast(err.message || 'Failed to reset password', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // ── DELETE STAFF ──
  const openDeleteModal = (staff) => {
    setSelectedStaff(staff)
    setDeleteModalOpen(true)
  }

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return
    setActionLoading(true)
    try {
      await api.del(`/staff/${selectedStaff.id}`)
      addToast('Staff account permanently deleted.', 'success')
      setDeleteModalOpen(false)
      loadStaff()
    } catch (err) {
      addToast(err.message || 'Failed to delete staff account', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Generate permission summary badge/text
  const getPermissionSummary = (staff) => {
    if (staff.role === 'SUPER_ADMIN') {
      return <span className="font-bold text-xs" style={{ color: GOLD }}>Full Admin Access</span>
    }
    const perms = staff.permissions || []
    if (perms.length === 0) {
      return <span className="text-xs text-gray-400 italic">No access granted</span>
    }

    const moduleSet = new Set()
    perms.forEach((p) => {
      const mod = p.split('.')[0]
      if (mod === 'dashboard') moduleSet.add('Dashboard')
      else if (mod === 'blog') moduleSet.add('Blog')
      else if (mod === 'services') moduleSet.add('Services')
      else if (mod === 'bookings') moduleSet.add('Bookings')
      else if (mod === 'events') moduleSet.add('Events')
      else if (mod === 'about') moduleSet.add('About')
      else if (mod === 'contact') moduleSet.add('Contact')
      else if (mod === 'staff') moduleSet.add('Staff')
      else if (mod === 'settings') moduleSet.add('Settings')
    })

    const modules = Array.from(moduleSet)
    if (modules.length <= 3) {
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgb(var(--ae-navy-rgb) /0.06)', color: NAVY }}>
          {modules.join(' • ')}
        </span>
      )
    }
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgb(var(--ae-gold-rgb) /0.15)', color: NAVY }}>
        {perms.length} Permissions ({modules.slice(0, 2).join(', ')}…)
      </span>
    )
  }

  return (
    <div style={fonts}>
      <PageHeader
        icon={Users}
        title="STAFF MANAGEMENT"
        subtitle="Create staff accounts, configure personalized access and manage permissions."
        actions={
          <Btn onClick={openCreateModal}>
            <Plus size={15} /> ADD STAFF
          </Btn>
        }
      />

      <Card className="!p-0 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <Spinner />
          </div>
        ) : staffList.length === 0 ? (
          <EmptyState
            title="No staff accounts found"
            subtitle="Click '+ ADD STAFF' to create your first staff member."
          />
        ) : (
          <>
            {/* ── MOBILE CARD LIST (< md) ── */}
            <div className="md:hidden divide-y" style={{ borderColor: 'rgba(180,160,130,0.15)' }}>
              {staffList.map((staff) => {
                const isCurrentSuperAdmin = staff.email === me?.email || staff.id === me?.id
                return (
                  <div key={staff.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm"
                          style={{
                            background:
                              staff.role === 'SUPER_ADMIN'
                                ? `linear-gradient(135deg, #8b2518, ${GOLD})`
                                : `linear-gradient(135deg, ${NAVY}, #1e3a8a)`,
                          }}
                        >
                          {staff.full_name?.[0] || 'S'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm" style={{ color: NAVY }}>
                              {staff.full_name}
                            </span>
                            {isCurrentSuperAdmin && (
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                style={{ background: GOLD, color: NAVY }}
                              >
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{staff.email}</p>
                          {staff.phone && <p className="text-[11px] text-gray-400">{staff.phone}</p>}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge tone={staff.role === 'SUPER_ADMIN' ? 'editor' : 'new'}>
                          {staff.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'STAFF'}
                        </Badge>
                        <Badge tone={staff.status === 'ACTIVE' ? 'published' : 'inactive'}>
                          {staff.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: 'rgba(180,160,130,0.1)' }}>
                      <div className="text-xs flex items-center justify-between">
                        <span className="text-gray-400">Access:</span>
                        <div>{getPermissionSummary(staff)}</div>
                      </div>

                      <div className="flex items-center justify-end gap-1 pt-1">
                        <button
                          onClick={() => openEditModal(staff)}
                          className="p-2 rounded-lg text-xs font-bold hover:bg-black/5"
                          title="Edit Details & Access"
                          style={{ color: NAVY }}
                        >
                          <Edit size={15} />
                        </button>

                        {staff.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => openPermissionsModal(staff)}
                            className="p-2 rounded-lg text-xs font-bold hover:bg-black/5"
                            title="Manage Permissions"
                            style={{ color: GOLD }}
                          >
                            <Shield size={15} />
                          </button>
                        )}

                        {staff.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => openDeactivateModal(staff)}
                            className="p-2 rounded-lg text-xs font-bold hover:bg-black/5"
                            title={staff.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            style={{ color: staff.status === 'ACTIVE' ? '#ea580c' : '#16a34a' }}
                          >
                            {staff.status === 'ACTIVE' ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>
                        )}

                        <button
                          onClick={() => openResetPasswordModal(staff)}
                          className="p-2 rounded-lg text-xs font-bold hover:bg-black/5"
                          title="Reset Password"
                          style={{ color: NAVY }}
                        >
                          <KeyRound size={15} />
                        </button>

                        {staff.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => openDeleteModal(staff)}
                            className="p-2 rounded-lg text-xs font-bold hover:bg-red-50 text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── DESKTOP TABLE (md+) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse" style={fonts}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgb(var(--ae-gold-rgb) /0.35)', background: 'rgb(var(--ae-navy-rgb) /0.02)' }}>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Avatar</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Full Name</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Email</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Phone</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Role</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Status</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Personalized Access</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold text-right" style={{ color: 'rgb(var(--ae-navy-rgb) /0.55)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(180,160,130,0.15)' }}>
                  {staffList.map((staff) => {
                    const isCurrentSuperAdmin = staff.email === me?.email || staff.id === me?.id
                    return (
                      <tr key={staff.id} className="hover:bg-black/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm"
                            style={{
                              background:
                                staff.role === 'SUPER_ADMIN'
                                  ? `linear-gradient(135deg, #8b2518, ${GOLD})`
                                  : `linear-gradient(135deg, ${NAVY}, #1e3a8a)`,
                            }}
                          >
                            {staff.full_name?.[0] || 'S'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-[13px]" style={{ color: NAVY }}>
                          <div className="flex items-center gap-2">
                            <span>{staff.full_name}</span>
                            {isCurrentSuperAdmin && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                                style={{ background: GOLD, color: NAVY }}
                              >
                                YOU
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-xs text-gray-600">{staff.email}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-500">{staff.phone || '—'}</td>

                        <td className="py-3.5 px-4">
                          <Badge tone={staff.role === 'SUPER_ADMIN' ? 'editor' : 'new'}>
                            {staff.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'STAFF'}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge tone={staff.status === 'ACTIVE' ? 'published' : 'inactive'}>
                            {staff.status}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">{getPermissionSummary(staff)}</td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(staff)}
                              className="p-1.5 rounded-lg hover:bg-black/5 transition"
                              title="Edit Details & Access"
                              style={{ color: NAVY }}
                            >
                              <Edit size={15} />
                            </button>

                            {staff.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => openPermissionsModal(staff)}
                                className="p-1.5 rounded-lg hover:bg-black/5 transition"
                                title="Manage Permissions"
                                style={{ color: GOLD }}
                              >
                                <Shield size={15} />
                              </button>
                            )}

                            {staff.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => openDeactivateModal(staff)}
                                className="p-1.5 rounded-lg hover:bg-black/5 transition"
                                title={staff.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                style={{ color: staff.status === 'ACTIVE' ? '#ea580c' : '#16a34a' }}
                              >
                                {staff.status === 'ACTIVE' ? <UserX size={15} /> : <UserCheck size={15} />}
                              </button>
                            )}

                            <button
                              onClick={() => openResetPasswordModal(staff)}
                              className="p-1.5 rounded-lg hover:bg-black/5 transition"
                              title="Reset Password"
                              style={{ color: NAVY }}
                            >
                              <KeyRound size={15} />
                            </button>

                            {staff.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => openDeleteModal(staff)}
                                className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-600"
                                title="Delete Staff Account"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* ── MODAL: CREATE STAFF ACCOUNT (WITH INLINE PERMISSIONS SELECTOR) ── */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="CREATE STAFF ACCOUNT & PERSONALIZE ACCESS"
        width={760}
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <TextInput
                value={createForm.full_name}
                onChange={(v) => setCreateForm({ ...createForm, full_name: v })}
                placeholder="e.g. John Doe"
              />
            </Field>

            <Field label="Email Address (Login Username)" required>
              <TextInput
                type="email"
                value={createForm.email}
                onChange={(v) => setCreateForm({ ...createForm, email: v })}
                placeholder="staff@alpineexplorers.com"
              />
            </Field>

            <Field label="Phone Number">
              <TextInput
                value={createForm.phone}
                onChange={(v) => setCreateForm({ ...createForm, phone: v })}
                placeholder="+91 98765 43210"
              />
            </Field>

            <Field label="Account Status" required>
              <select
                value={createForm.status}
                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm font-semibold"
                style={{
                  borderColor: 'rgb(var(--ae-navy-rgb) /0.18)',
                  background: '#fff',
                  color: NAVY,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <option value="ACTIVE">ACTIVE (Can log in)</option>
                <option value="INACTIVE">INACTIVE (Locked)</option>
              </select>
            </Field>

            <Field label="Password" required hint="Minimum 8 characters">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Enter password (min 8 chars)"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border outline-none text-sm"
                  style={{
                    borderColor: 'rgb(var(--ae-navy-rgb) /0.18)',
                    background: '#fff',
                    color: NAVY,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <Field label="Confirm Password" required>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={createForm.confirm}
                  onChange={(e) => setCreateForm({ ...createForm, confirm: e.target.value })}
                  placeholder="Confirm password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border outline-none text-sm"
                  style={{
                    borderColor: 'rgb(var(--ae-navy-rgb) /0.18)',
                    background: '#fff',
                    color: NAVY,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
          </div>

          {/* Inline Personalized Access / Permissions Picker */}
          <PermissionsPicker
            value={createForm.permissions}
            onChange={(newPerms) => setCreateForm({ ...createForm, permissions: newPerms })}
            title="Personalized Admin Panel Access"
            subtitle="Choose which modules (Dashboard, Blog, Tours, Bookings, Events, etc.) this staff member can see and manage."
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
            <Btn variant="ghost" onClick={() => setCreateModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={actionLoading}>
              {actionLoading ? 'Creating Account…' : 'Create Staff Account'}
            </Btn>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: EDIT STAFF ACCOUNT (WITH INLINE PERMISSIONS) ── */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="EDIT STAFF ACCOUNT & ACCESS"
        width={760}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <TextInput
                value={editForm.full_name}
                onChange={(v) => setEditForm({ ...editForm, full_name: v })}
              />
            </Field>

            <Field label="Email" required>
              <TextInput
                type="email"
                value={editForm.email}
                onChange={(v) => setEditForm({ ...editForm, email: v })}
              />
            </Field>

            <Field label="Phone">
              <TextInput
                value={editForm.phone}
                onChange={(v) => setEditForm({ ...editForm, phone: v })}
              />
            </Field>

            {selectedStaff?.role !== 'SUPER_ADMIN' && (
              <Field label="Status" required>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm font-semibold"
                  style={{
                    borderColor: 'rgb(var(--ae-navy-rgb) /0.18)',
                    background: '#fff',
                    color: NAVY,
                  }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </Field>
            )}
          </div>

          {selectedStaff?.role !== 'SUPER_ADMIN' ? (
            <PermissionsPicker
              value={editForm.permissions}
              onChange={(newPerms) => setEditForm({ ...editForm, permissions: newPerms })}
              title="Personalized Admin Access"
              subtitle={`Configure which modules ${selectedStaff?.full_name || 'this staff member'} can access.`}
            />
          ) : (
            <div className="p-4 rounded-xl border bg-amber-50/50 border-amber-200">
              <p className="text-xs text-amber-900 font-semibold">
                ★ Super Administrator always has unrestricted access to all modules and system settings.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
          <Btn variant="ghost" onClick={() => setEditModalOpen(false)} disabled={actionLoading}>
            Cancel
          </Btn>
          <Btn onClick={handleEditStaff} disabled={actionLoading}>
            {actionLoading ? 'Saving…' : 'Save Changes'}
          </Btn>
        </div>
      </Modal>

      {/* ── MODAL: MANAGE STAFF PERMISSIONS (STANDALONE SHIELD BUTTON) ── */}
      <Modal
        open={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        title="MANAGE STAFF PERMISSIONS"
        width={760}
      >
        <div>
          <div className="flex items-center justify-between pb-3 mb-2 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
            <div>
              <p className="text-sm font-bold" style={{ color: NAVY }}>
                Staff Member: <span style={{ color: GOLD }}>{selectedStaff?.full_name}</span>
              </p>
              <p className="text-xs text-gray-500">{selectedStaff?.email}</p>
            </div>
          </div>

          <PermissionsPicker
            value={selectedPermissions}
            onChange={setSelectedPermissions}
            title="Personalized Access & Permissions"
          />

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
            <Btn variant="ghost" onClick={() => setPermissionsModalOpen(false)} disabled={actionLoading}>
              CANCEL
            </Btn>
            <Btn onClick={handleSavePermissions} disabled={actionLoading}>
              {actionLoading ? 'Saving…' : 'SAVE PERMISSIONS'}
            </Btn>
          </div>
        </div>
      </Modal>

      {/* ── MODAL: RESET STAFF PASSWORD ── */}
      <Modal
        open={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
        title="RESET STAFF PASSWORD"
        width={460}
      >
        <div className="space-y-4">
          <p className="text-xs" style={{ color: NAVY }}>
            Set a new password for <b>{selectedStaff?.full_name}</b> ({selectedStaff?.email}):
          </p>

          <Field label="Enter New Password" required hint="Minimum 8 characters">
            <div className="relative">
              <input
                type={showResetPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 chars)"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border outline-none text-sm"
                style={{
                  borderColor: 'rgb(var(--ae-navy-rgb) /0.18)',
                  background: '#fff',
                  color: NAVY,
                }}
              />
              <button
                type="button"
                onClick={() => setShowResetPass(!showResetPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showResetPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          <Field label="Confirm New Password" required>
            <input
              type={showResetPass ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm"
              style={{
                borderColor: 'rgb(var(--ae-navy-rgb) /0.18)',
                background: '#fff',
                color: NAVY,
              }}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
          <Btn variant="ghost" onClick={() => setResetPasswordModalOpen(false)} disabled={actionLoading}>
            Cancel
          </Btn>
          <Btn onClick={handleResetPassword} disabled={actionLoading}>
            {actionLoading ? 'Resetting…' : 'Reset Password'}
          </Btn>
        </div>
      </Modal>

      {/* ── MODAL: CONFIRM DEACTIVATE ── */}
      <Modal
        open={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title={selectedStaff?.status === 'ACTIVE' ? 'Deactivate Staff Account' : 'Activate Staff Account'}
        width={440}
      >
        <div className="text-center py-2">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{
              background: selectedStaff?.status === 'ACTIVE' ? 'rgba(234,88,12,0.1)' : 'rgba(22,163,74,0.1)',
              color: selectedStaff?.status === 'ACTIVE' ? '#ea580c' : '#16a34a',
            }}
          >
            {selectedStaff?.status === 'ACTIVE' ? <UserX size={28} /> : <UserCheck size={28} />}
          </div>

          <p className="text-sm font-semibold mb-2" style={{ color: NAVY }}>
            {selectedStaff?.status === 'ACTIVE'
              ? 'Are you sure you want to deactivate this staff account?'
              : 'Are you sure you want to activate this staff account?'}
          </p>

          <p className="text-xs text-gray-500 mb-6">
            <b>{selectedStaff?.full_name}</b> ({selectedStaff?.email})
            {selectedStaff?.status === 'ACTIVE' && (
              <span className="block mt-1 text-red-600">
                They will not be able to log in or access the admin dashboard while inactive.
              </span>
            )}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Btn variant="ghost" onClick={() => setDeactivateModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Btn>
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={actionLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider transition shadow"
              style={{
                background: selectedStaff?.status === 'ACTIVE' ? '#ea580c' : '#16a34a',
              }}
            >
              {actionLoading
                ? 'Processing…'
                : selectedStaff?.status === 'ACTIVE'
                ? 'Yes, Deactivate'
                : 'Yes, Activate'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL: CONFIRM DELETE ── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Staff Account"
        width={440}
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-red-100 text-red-600">
            <Trash2 size={28} />
          </div>

          <p className="text-sm font-semibold mb-2" style={{ color: NAVY }}>
            Are you sure you want to permanently delete this staff account?
          </p>

          <p className="text-xs text-gray-500 mb-6">
            <b>{selectedStaff?.full_name}</b> ({selectedStaff?.email})
            <span className="block mt-1 text-red-600 font-semibold">
              This action cannot be undone. All assigned permissions will also be removed.
            </span>
          </p>

          <div className="flex items-center justify-center gap-3">
            <Btn variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Btn>
            <Btn variant="danger" onClick={handleDeleteStaff} disabled={actionLoading}>
              {actionLoading ? 'Deleting…' : 'Yes, Permanently Delete'}
            </Btn>
          </div>
        </div>
      </Modal>

      <ToastHost />
    </div>
  )
}