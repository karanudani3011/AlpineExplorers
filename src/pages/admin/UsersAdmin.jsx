import { useEffect, useState, useMemo } from 'react'
import {
  Users, Plus, Edit, Trash2, KeyRound, ShieldCheck, Shield, Check,
  Eye, EyeOff, X, Lock, CheckSquare, Square, AlertTriangle, UserCheck, UserX,
} from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useToasts } from '../../components/admin/useToasts'
import {
  PageHeader, Btn, Card, Modal, Spinner, EmptyState, Badge, NAVY, GOLD, GOLD2, BG,
} from '../../components/admin/admin-ui'
import { Field, TextInput } from '../../components/admin/FormFields'

const fonts = { fontFamily: "'Inter', sans-serif" }

// ── MODULE PERMISSION DEFINITIONS (10 MODULES) ──
export const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Main admin dashboard and overall stats',
    permissions: [
      { key: 'dashboard.view', label: 'View Dashboard' },
    ],
  },
  {
    id: 'services',
    label: 'Services & Packages',
    description: 'International, Domestic, Adventure, Camps & Services',
    permissions: [
      { key: 'services.view', label: 'View Services' },
      { key: 'services.create', label: 'Add Service' },
      { key: 'services.edit', label: 'Edit Service' },
      { key: 'services.delete', label: 'Delete Service' },
    ],
  },
  {
    id: 'bookings',
    label: 'Bookings / Applications',
    description: 'Manage customer bookings, applications & exports',
    permissions: [
      { key: 'bookings.view', label: 'View Bookings' },
      { key: 'bookings.view_details', label: 'View Booking Details' },
      { key: 'bookings.edit', label: 'Edit Booking' },
      { key: 'bookings.delete', label: 'Delete Booking' },
      { key: 'bookings.export_pdf', label: 'Export Bookings PDF' },
      { key: 'bookings.export_excel', label: 'Export Bookings Excel' },
      { key: 'bookings.export_individual_pdf', label: 'Export Individual Booking PDF' },
      { key: 'bookings.export_individual_excel', label: 'Export Individual Booking Excel' },
    ],
  },
  {
    id: 'events',
    label: 'Upcoming Events',
    description: 'Upcoming excursions, tours and events',
    permissions: [
      { key: 'events.view', label: 'View Events' },
      { key: 'events.create', label: 'Create Event' },
      { key: 'events.edit', label: 'Edit Event' },
      { key: 'events.delete', label: 'Delete Event' },
    ],
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Travel articles, stories and publications',
    permissions: [
      { key: 'blog.view', label: 'View Blog' },
      { key: 'blog.create', label: 'Create Blog' },
      { key: 'blog.edit', label: 'Edit Blog' },
      { key: 'blog.delete', label: 'Delete Blog' },
      { key: 'blog.publish', label: 'Publish Blog' },
    ],
  },
  {
    id: 'travel_mood',
    label: 'Find Your Travel Mood',
    description: 'Travel mood suggestions and destinations',
    permissions: [
      { key: 'travel_mood.view', label: 'View Travel Mood' },
      { key: 'travel_mood.edit', label: 'Create / Edit Mood' },
      { key: 'travel_mood.delete', label: 'Delete Mood' },
    ],
  },
  {
    id: 'about',
    label: 'About Us',
    description: 'Company story, founders and achievements',
    permissions: [
      { key: 'about.view', label: 'View About Us' },
      { key: 'about.edit', label: 'Edit About Us' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact Us',
    description: 'Customer contact messages and inquiries',
    permissions: [
      { key: 'contact.view', label: 'View Contact Messages' },
      { key: 'contact.edit', label: 'Manage Contact Messages' },
      { key: 'contact.delete', label: 'Delete Contact Messages' },
    ],
  },
  {
    id: 'staff',
    label: 'User / Staff Management',
    description: 'Control staff accounts and dashboard permissions',
    permissions: [
      { key: 'staff.view', label: 'View Staff' },
      { key: 'staff.create', label: 'Create Staff' },
      { key: 'staff.edit', label: 'Edit Staff' },
      { key: 'staff.permissions', label: 'Manage Staff Permissions' },
      { key: 'staff.activate', label: 'Activate/Deactivate Staff' },
      { key: 'staff.delete', label: 'Delete Staff' },
      { key: 'staff.reset_password', label: 'Reset Staff Password' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'System configurations and website settings',
    permissions: [
      { key: 'settings.view', label: 'View Settings' },
      { key: 'settings.edit', label: 'Edit Settings' },
    ],
  },
]

// All individual permission keys list
const ALL_PERMISSION_KEYS = PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.key))

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
      permissions: [], // Default: NO permissions selected
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
      addToast('Staff account created successfully', 'success')
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
      addToast('Staff details updated successfully', 'success')
      setEditModalOpen(false)
      loadStaff()
    } catch (err) {
      addToast(err.message || 'Failed to update staff account', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // ── MANAGE PERMISSIONS ──
  const openPermissionsModal = (staff) => {
    setSelectedStaff(staff)
    setSelectedPermissions(staff.permissions || [])
    setPermissionsModalOpen(true)
  }

  const togglePermission = (key) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const toggleModuleAll = (modulePermissions) => {
    const keys = modulePermissions.map((p) => p.key)
    const allSelected = keys.every((k) => selectedPermissions.includes(k))
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !keys.includes(k)))
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...keys])))
    }
  }

  const handleSelectAll = () => {
    setSelectedPermissions(ALL_PERMISSION_KEYS)
  }

  const handleDeselectAll = () => {
    setSelectedPermissions([])
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

  // Generate permission summary text
  const getPermissionSummary = (staff) => {
    if (staff.role === 'SUPER_ADMIN') {
      return <span className="font-bold text-xs" style={{ color: GOLD }}>All Permissions</span>
    }
    const perms = staff.permissions || []
    if (perms.length === 0) {
      return <span className="text-xs text-gray-400 italic">No permissions</span>
    }

    // Extract unique module labels
    const moduleSet = new Set()
    perms.forEach((p) => {
      const mod = p.split('.')[0]
      if (mod === 'bookings') moduleSet.add('Bookings')
      else if (mod === 'services') moduleSet.add('Services')
      else if (mod === 'blog') moduleSet.add('Blog')
      else if (mod === 'events') moduleSet.add('Events')
      else if (mod === 'contact') moduleSet.add('Contact')
      else if (mod === 'travel_mood') moduleSet.add('Mood')
      else if (mod === 'about') moduleSet.add('About')
      else if (mod === 'staff') moduleSet.add('Staff')
      else if (mod === 'settings') moduleSet.add('Settings')
      else if (mod === 'dashboard') moduleSet.add('Dashboard')
    })

    const modules = Array.from(moduleSet)
    if (modules.length <= 3) {
      return (
        <span className="text-xs font-medium" style={{ color: NAVY }}>
          {modules.join(' • ')}
        </span>
      )
    }
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(197,155,39,0.15)', color: NAVY }}>
        {perms.length} Permissions ({modules.slice(0, 2).join(', ')}…)
      </span>
    )
  }

  return (
    <div style={fonts}>
      <PageHeader
        icon={Users}
        title="STAFF MANAGEMENT"
        subtitle="Create staff accounts and control their dashboard access."
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
                        <span className="text-gray-400">Permissions:</span>
                        <div>{getPermissionSummary(staff)}</div>
                      </div>

                      <div className="flex items-center justify-end gap-1 pt-1">
                        <button
                          onClick={() => openEditModal(staff)}
                          className="p-2 rounded-lg text-xs font-bold hover:bg-black/5"
                          title="Edit"
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
                  <tr style={{ borderBottom: '2px solid rgba(197,155,39,0.35)', background: 'rgba(0,26,77,0.02)' }}>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Avatar</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Full Name</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Email</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Phone</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Role</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Status</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Created</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(0,26,77,0.55)' }}>Permissions</th>
                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold text-right" style={{ color: 'rgba(0,26,77,0.55)' }}>Actions</th>
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

                        <td className="py-3.5 px-4 text-xs text-gray-500">
                          {staff.created_at ? new Date(staff.created_at).toLocaleDateString() : '—'}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">{getPermissionSummary(staff)}</td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(staff)}
                              className="p-1.5 rounded-lg hover:bg-black/5 transition"
                              title="Edit Details"
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

      {/* ── MODAL: CREATE STAFF ACCOUNT ── */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="CREATE STAFF ACCOUNT"
        width={680}
      >
        <form onSubmit={handleCreateStaff}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <TextInput
                value={createForm.full_name}
                onChange={(v) => setCreateForm({ ...createForm, full_name: v })}
                placeholder="e.g. John Doe"
              />
            </Field>

            <Field label="Email" required>
              <TextInput
                type="email"
                value={createForm.email}
                onChange={(v) => setCreateForm({ ...createForm, email: v })}
                placeholder="staff@alpineexplorers.com"
              />
            </Field>

            <Field label="Phone">
              <TextInput
                value={createForm.phone}
                onChange={(v) => setCreateForm({ ...createForm, phone: v })}
                placeholder="+91 98765 43210"
              />
            </Field>

            <Field label="Status" required>
              <select
                value={createForm.status}
                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm font-semibold"
                style={{
                  borderColor: 'rgba(0,26,77,0.18)',
                  background: '#fff',
                  color: NAVY,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
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
                    borderColor: 'rgba(0,26,77,0.18)',
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
                    borderColor: 'rgba(0,26,77,0.18)',
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

          <p className="text-xs text-gray-500 mt-4">
            * Note: Newly created staff will have <b>no permissions by default</b>. You can assign permissions below or right after creation via the Permissions button.
          </p>

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

      {/* ── MODAL: EDIT STAFF ── */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="EDIT STAFF ACCOUNT"
        width={540}
      >
        <div className="space-y-4">
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
                  borderColor: 'rgba(0,26,77,0.18)',
                  background: '#fff',
                  color: NAVY,
                }}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </Field>
          )}

          <p className="text-[11px] text-gray-400 italic">
            Password cannot be edited here. Use the dedicated &quot;Reset Password&quot; action instead.
          </p>
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

      {/* ── MODAL: MANAGE STAFF PERMISSIONS ── */}
      <Modal
        open={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        title="MANAGE STAFF PERMISSIONS"
        width={800}
      >
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
            <div>
              <p className="text-sm font-bold" style={{ color: NAVY }}>
                Staff Member: <span style={{ color: GOLD }}>{selectedStaff?.full_name}</span>
              </p>
              <p className="text-xs text-gray-500">{selectedStaff?.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition hover:bg-black/5"
                style={{ border: `1px solid ${GOLD}`, color: NAVY }}
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition hover:bg-black/5 text-gray-600 border"
                style={{ borderColor: 'rgba(0,26,77,0.15)' }}
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {PERMISSION_MODULES.map((mod) => {
              const allModSelected = mod.permissions.every((p) => selectedPermissions.includes(p.key))
              const someModSelected = mod.permissions.some((p) => selectedPermissions.includes(p.key))

              return (
                <div
                  key={mod.id}
                  className="rounded-2xl border p-4 transition-all"
                  style={{
                    borderColor: someModSelected ? 'rgba(197,155,39,0.5)' : 'rgba(0,26,77,0.12)',
                    background: someModSelected ? 'rgba(197,155,39,0.03)' : '#fff',
                  }}
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-bold tracking-wide uppercase" style={{ color: NAVY }}>
                        {mod.label}
                      </h4>
                      <p className="text-[11px] text-gray-500">{mod.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleModuleAll(mod.permissions)}
                      className="text-xs font-bold hover:underline"
                      style={{ color: GOLD }}
                    >
                      {allModSelected ? 'Uncheck All' : 'Check All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {mod.permissions.map((perm) => {
                      const checked = selectedPermissions.includes(perm.key)
                      return (
                        <label
                          key={perm.key}
                          onClick={() => togglePermission(perm.key)}
                          className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer select-none transition hover:bg-black/[0.03]"
                        >
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center transition"
                            style={{
                              background: checked ? GOLD : '#fff',
                              border: `1.5px solid ${checked ? GOLD : 'rgba(0,26,77,0.25)'}`,
                              color: checked ? NAVY : 'transparent',
                            }}
                          >
                            <Check size={13} strokeWidth={3} />
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

          <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'rgba(180,160,130,0.2)' }}>
            <span className="text-xs font-semibold" style={{ color: 'rgba(0,26,77,0.6)' }}>
              {selectedPermissions.length} of {ALL_PERMISSION_KEYS.length} permissions granted
            </span>

            <div className="flex items-center gap-3">
              <Btn variant="ghost" onClick={() => setPermissionsModalOpen(false)} disabled={actionLoading}>
                CANCEL
              </Btn>
              <Btn onClick={handleSavePermissions} disabled={actionLoading}>
                {actionLoading ? 'Saving…' : 'SAVE PERMISSIONS'}
              </Btn>
            </div>
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
                  borderColor: 'rgba(0,26,77,0.18)',
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
                borderColor: 'rgba(0,26,77,0.18)',
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