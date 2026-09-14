import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { db, logActivity } from '../db.js'
import { authRequired, requireSuperAdmin } from '../middleware.js'
import {
  supabaseAdmin,
  saveAdminPermissions,
  fetchAdminPermissions,
  recordAuditLog,
  fetchAuditLogs,
} from '../utils/supabase.js'

const router = Router()

// All staff endpoints require authentication
router.use(authRequired)

/**
 * Helper: ensure default super admin exists in SQLite & Supabase
 */
function ensureSuperAdmin() {
  try {
    const existing = db.prepare("SELECT * FROM admin_profiles WHERE role = 'SUPER_ADMIN'").get()
    if (!existing) {
      const id = crypto.randomUUID()
      db.prepare(`
        INSERT INTO admin_profiles (id, auth_user_id, full_name, email, phone, role, status)
        VALUES (?, ?, 'Super Administrator', 'admin@alpineexplorers.com', '+91 99798 83339', 'SUPER_ADMIN', 'ACTIVE')
      `).run(id, id)
    }
  } catch (e) {
    console.warn('ensureSuperAdmin error:', e.message)
  }
}

ensureSuperAdmin()

/**
 * GET /api/staff - List all staff & super admins with permissions
 */
router.get('/', async (req, res) => {
  try {
    // 1. Try fetching from Supabase admin_profiles
    let profiles = []
    try {
      const { data, error } = await supabaseAdmin
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: true })

      if (!error && Array.isArray(data) && data.length > 0) {
        profiles = data
      }
    } catch {}

    // 2. Fallback to SQLite admin_profiles if Supabase table not migrated yet
    if (profiles.length === 0) {
      profiles = db.prepare('SELECT * FROM admin_profiles ORDER BY created_at ASC').all()
    }

    // 3. If still empty, migrate/sync existing users table from SQLite
    if (profiles.length === 0) {
      const legacyUsers = db.prepare('SELECT * FROM users').all()
      for (const lu of legacyUsers) {
        const id = String(lu.id)
        const role = lu.role === 'super_admin' ? 'SUPER_ADMIN' : 'STAFF'
        const status = lu.status === 'active' ? 'ACTIVE' : 'INACTIVE'
        db.prepare(`
          INSERT OR IGNORE INTO admin_profiles (id, auth_user_id, full_name, email, phone, role, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, id, lu.full_name, lu.email, lu.phone || '', role, status)
      }
      profiles = db.prepare('SELECT * FROM admin_profiles ORDER BY created_at ASC').all()
    }

    // 4. Attach permissions to each profile
    const staffList = []
    for (const p of profiles) {
      let perms = []
      // Check Supabase admin_permissions
      try {
        const { data } = await supabaseAdmin
          .from('admin_permissions')
          .select('permission_key')
          .eq('user_id', p.id)
        if (Array.isArray(data)) {
          perms = data.map((x) => x.permission_key)
        }
      } catch {}

      // Fallback to SQLite admin_permissions
      if (perms.length === 0) {
        const localPerms = db.prepare('SELECT permission_key FROM admin_permissions WHERE user_id = ?').all(p.id)
        perms = localPerms.map((x) => x.permission_key)
      }

      staffList.push({
        id: p.id,
        auth_user_id: p.auth_user_id || p.id,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone || '',
        role: p.role,
        status: p.status,
        created_at: p.created_at,
        permissions: p.role === 'SUPER_ADMIN' ? ['*'] : perms,
      })
    }

    res.json({ staff: staffList })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch staff members' })
  }
})

/**
 * POST /api/staff - Create new staff account
 */
router.post('/', requireSuperAdmin, async (req, res) => {
  const { full_name, email, phone, password, confirm, status = 'ACTIVE', permissions = [] } = req.body || {}

  const cleanName = (full_name || '').trim()
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPhone = (phone || '').trim()
  const cleanStatus = status.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'

  if (!cleanName) return res.status(400).json({ error: 'Full Name is required' })
  if (!cleanEmail || !cleanEmail.includes('@')) return res.status(400).json({ error: 'Valid Email is required' })
  if (!password) return res.status(400).json({ error: 'Password is required' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  if (password !== confirm) return res.status(400).json({ error: 'Passwords do not match' })

  // Check duplicate email in SQLite
  const existingLocal = db.prepare('SELECT id FROM admin_profiles WHERE email = ?').get(cleanEmail)
  if (existingLocal) return res.status(400).json({ error: 'An account with this email already exists' })

  let authUserId = null

  // 1. Create in Supabase Authentication
  try {
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        phone: cleanPhone,
        role: 'STAFF',
      },
    })

    if (authError) {
      if (authError.message?.toLowerCase().includes('already') || authError.message?.toLowerCase().includes('exists')) {
        return res.status(400).json({ error: 'An account with this email already exists in Supabase Auth' })
      }
      console.warn('[Supabase Auth Warning] createUser:', authError.message)
    } else if (authUser?.user?.id) {
      authUserId = authUser.user.id
    }
  } catch (supErr) {
    console.warn('[Supabase Auth Network Error]:', supErr.message)
  }

  // Generate ID if not created by Supabase Auth
  const profileId = authUserId || crypto.randomUUID()
  const nowIso = new Date().toISOString()

  // 2. Insert into Supabase admin_profiles
  try {
    await supabaseAdmin.from('admin_profiles').upsert({
      id: profileId,
      auth_user_id: authUserId || profileId,
      full_name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'STAFF',
      status: cleanStatus,
      created_at: nowIso,
      updated_at: nowIso,
    })
  } catch {}

  // 3. Save permissions in Supabase
  if (Array.isArray(permissions) && permissions.length > 0) {
    await saveAdminPermissions(profileId, permissions)
  }

  // 4. Save into local SQLite tables
  try {
    db.prepare(`
      INSERT INTO admin_profiles (id, auth_user_id, full_name, email, phone, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'STAFF', ?, ?, ?)
    `).run(profileId, authUserId || profileId, cleanName, cleanEmail, cleanPhone, cleanStatus, nowIso, nowIso)

    // Save local permissions
    for (const p of permissions) {
      const permId = crypto.randomUUID()
      db.prepare('INSERT OR IGNORE INTO admin_permissions (id, user_id, permission_key) VALUES (?, ?, ?)').run(permId, profileId, p)
    }

    // Keep legacy users table in sync for fallback
    const hash = bcrypt.hashSync(String(password), 10)
    db.prepare(`
      INSERT OR REPLACE INTO users (full_name, username, email, phone, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?, 'editor', ?)
    `).run(cleanName, cleanEmail.split('@')[0], cleanEmail, cleanPhone, hash, cleanStatus.toLowerCase())
  } catch (e) {
    console.warn('[SQLite RBAC Sync Warning]:', e.message)
  }

  // 5. Audit Log
  const adminId = req.user?.id || req.user?.email || 'admin'
  await recordAuditLog({
    admin_user_id: adminId,
    action: 'Staff created',
    target_user_id: profileId,
    module: 'Staff Management',
    details: `Created staff account: ${cleanName} (${cleanEmail})`,
  })
  logActivity({
    user_name: req.user?.full_name || req.user?.username || 'Super Admin',
    action: 'Staff created',
    module: 'Staff Management',
    details: `${cleanName} (${cleanEmail})`,
  })

  res.status(201).json({
    message: 'Staff account created successfully',
    staff: {
      id: profileId,
      auth_user_id: authUserId || profileId,
      full_name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'STAFF',
      status: cleanStatus,
      created_at: nowIso,
      permissions,
    },
  })
})

/**
 * PUT /api/staff/:id - Edit staff member details
 */
router.put('/:id', requireSuperAdmin, async (req, res) => {
  const { id } = req.params
  const { full_name, email, phone, status } = req.body || {}

  const cleanName = (full_name || '').trim()
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPhone = (phone || '').trim()
  const cleanStatus = status ? status.toUpperCase() : undefined

  // Find existing profile
  let existing = db.prepare('SELECT * FROM admin_profiles WHERE id = ? OR auth_user_id = ?').get(id, id)
  if (!existing) {
    try {
      const { data } = await supabaseAdmin.from('admin_profiles').select('*').eq('id', id).maybeSingle()
      existing = data
    } catch {}
  }
  if (!existing) return res.status(404).json({ error: 'Staff account not found' })

  // Check duplicate email if changed
  if (cleanEmail && cleanEmail !== existing.email) {
    const dup = db.prepare('SELECT id FROM admin_profiles WHERE email = ? AND id != ?').get(cleanEmail, existing.id)
    if (dup) return res.status(400).json({ error: 'Email already in use by another account' })
  }

  const updatedName = cleanName || existing.full_name
  const updatedEmail = cleanEmail || existing.email
  const updatedPhone = cleanPhone !== undefined ? cleanPhone : existing.phone
  const updatedStatus = cleanStatus || existing.status

  // 1. Update Supabase admin_profiles
  try {
    await supabaseAdmin
      .from('admin_profiles')
      .update({
        full_name: updatedName,
        email: updatedEmail,
        phone: updatedPhone,
        status: updatedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (existing.auth_user_id) {
      await supabaseAdmin.auth.admin.updateUserById(existing.auth_user_id, {
        email: updatedEmail,
        user_metadata: { full_name: updatedName, phone: updatedPhone },
      })
    }
  } catch {}

  // 2. Update SQLite
  try {
    db.prepare(`
      UPDATE admin_profiles SET full_name = ?, email = ?, phone = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(updatedName, updatedEmail, updatedPhone, updatedStatus, existing.id)

    db.prepare('UPDATE users SET full_name = ?, email = ?, phone = ?, status = ? WHERE email = ?')
      .run(updatedName, updatedEmail, updatedPhone, updatedStatus.toLowerCase(), existing.email)
  } catch {}

  // 3. Audit Log
  const adminId = req.user?.id || req.user?.email || 'admin'
  await recordAuditLog({
    admin_user_id: adminId,
    action: 'Staff edited',
    target_user_id: existing.id,
    module: 'Staff Management',
    details: `Updated details for ${updatedName} (${updatedEmail})`,
  })

  res.json({ message: 'Staff updated successfully', staff: { id: existing.id, full_name: updatedName, email: updatedEmail, phone: updatedPhone, status: updatedStatus } })
})

/**
 * PATCH /api/staff/:id/permissions - Update staff permissions
 */
router.patch('/:id/permissions', requireSuperAdmin, async (req, res) => {
  const { id } = req.params
  const { permissions = [] } = req.body || {}

  let existing = db.prepare('SELECT * FROM admin_profiles WHERE id = ? OR auth_user_id = ?').get(id, id)
  if (!existing) {
    try {
      const { data } = await supabaseAdmin.from('admin_profiles').select('*').eq('id', id).maybeSingle()
      existing = data
    } catch {}
  }
  if (!existing) return res.status(404).json({ error: 'Staff account not found' })
  if (existing.role === 'SUPER_ADMIN') {
    return res.status(400).json({ error: 'Super Administrator always has all permissions' })
  }

  // 1. Update in Supabase
  await saveAdminPermissions(existing.id, permissions)

  // 2. Update in SQLite
  try {
    db.prepare('DELETE FROM admin_permissions WHERE user_id = ?').run(existing.id)
    for (const p of permissions) {
      const permId = crypto.randomUUID()
      db.prepare('INSERT INTO admin_permissions (id, user_id, permission_key) VALUES (?, ?, ?)').run(permId, existing.id, p)
    }
  } catch (e) {
    console.warn('SQLite permission update warning:', e.message)
  }

  // 3. Audit Log
  const adminId = req.user?.id || req.user?.email || 'admin'
  await recordAuditLog({
    admin_user_id: adminId,
    action: 'Permission changed',
    target_user_id: existing.id,
    module: 'Staff Management',
    details: `Assigned ${permissions.length} permission(s) to ${existing.full_name}`,
  })

  res.json({ message: 'Permissions updated successfully', permissions })
})

/**
 * PATCH /api/staff/:id/status - Activate / Deactivate staff
 */
router.patch('/:id/status', requireSuperAdmin, async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}

  const nextStatus = status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'

  let existing = db.prepare('SELECT * FROM admin_profiles WHERE id = ? OR auth_user_id = ?').get(id, id)
  if (!existing) {
    try {
      const { data } = await supabaseAdmin.from('admin_profiles').select('*').eq('id', id).maybeSingle()
      existing = data
    } catch {}
  }
  if (!existing) return res.status(404).json({ error: 'Staff account not found' })

  if (existing.role === 'SUPER_ADMIN') {
    return res.status(400).json({ error: 'Super Administrator cannot be deactivated' })
  }
  if (existing.auth_user_id === req.user?.auth_user_id || existing.id === req.user?.id) {
    return res.status(400).json({ error: 'You cannot deactivate your own account' })
  }

  // 1. Supabase update
  try {
    await supabaseAdmin.from('admin_profiles').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', existing.id)
  } catch {}

  // 2. SQLite update
  try {
    db.prepare("UPDATE admin_profiles SET status = ?, updated_at = datetime('now') WHERE id = ?").run(nextStatus, existing.id)
    db.prepare('UPDATE users SET status = ? WHERE email = ?').run(nextStatus.toLowerCase(), existing.email)
  } catch {}

  // 3. Audit Log
  const adminId = req.user?.id || req.user?.email || 'admin'
  const actionText = nextStatus === 'ACTIVE' ? 'Staff activated' : 'Staff deactivated'
  await recordAuditLog({
    admin_user_id: adminId,
    action: actionText,
    target_user_id: existing.id,
    module: 'Staff Management',
    details: `${actionText}: ${existing.full_name} (${existing.email})`,
  })

  res.json({ message: `Staff account ${nextStatus.toLowerCase()} successfully`, status: nextStatus })
})

/**
 * PATCH /api/staff/:id/reset-password - Reset staff password
 */
router.patch('/:id/reset-password', requireSuperAdmin, async (req, res) => {
  const { id } = req.params
  const { password, confirm } = req.body || {}

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }
  if (confirm && password !== confirm) {
    return res.status(400).json({ error: 'Passwords do not match' })
  }

  let existing = db.prepare('SELECT * FROM admin_profiles WHERE id = ? OR auth_user_id = ?').get(id, id)
  if (!existing) {
    try {
      const { data } = await supabaseAdmin.from('admin_profiles').select('*').eq('id', id).maybeSingle()
      existing = data
    } catch {}
  }
  if (!existing) return res.status(404).json({ error: 'Staff account not found' })

  // 1. Update password in Supabase Auth
  if (existing.auth_user_id) {
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.auth_user_id, {
        password,
      })
      if (error) console.warn('[Supabase Auth update password warning]:', error.message)
    } catch (e) {
      console.warn('[Supabase Auth password reset error]:', e.message)
    }
  }

  // 2. Update SQLite hash
  try {
    const hash = bcrypt.hashSync(String(password), 10)
    db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(hash, existing.email)
  } catch {}

  // 3. Audit Log
  const adminId = req.user?.id || req.user?.email || 'admin'
  await recordAuditLog({
    admin_user_id: adminId,
    action: 'Password reset',
    target_user_id: existing.id,
    module: 'Staff Management',
    details: `Reset password for staff: ${existing.full_name} (${existing.email})`,
  })

  res.json({ message: 'Password reset successfully' })
})

/**
 * DELETE /api/staff/:id - Permanently delete staff account
 */
router.delete('/:id', requireSuperAdmin, async (req, res) => {
  const { id } = req.params

  let existing = db.prepare('SELECT * FROM admin_profiles WHERE id = ? OR auth_user_id = ?').get(id, id)
  if (!existing) {
    try {
      const { data } = await supabaseAdmin.from('admin_profiles').select('*').eq('id', id).maybeSingle()
      existing = data
    } catch {}
  }
  if (!existing) return res.status(404).json({ error: 'Staff account not found' })

  if (existing.role === 'SUPER_ADMIN') {
    return res.status(400).json({ error: 'Super Administrator cannot be deleted' })
  }
  if (existing.auth_user_id === req.user?.auth_user_id || existing.id === req.user?.id) {
    return res.status(400).json({ error: 'You cannot delete your own account' })
  }

  // 1. Delete from Supabase Auth
  if (existing.auth_user_id) {
    try {
      await supabaseAdmin.auth.admin.deleteUser(existing.auth_user_id)
    } catch (e) {
      console.warn('[Supabase Auth delete user warning]:', e.message)
    }
  }

  // 2. Delete from Supabase tables
  try {
    await supabaseAdmin.from('admin_permissions').delete().eq('user_id', existing.id)
    await supabaseAdmin.from('admin_profiles').delete().eq('id', existing.id)
  } catch {}

  // 3. Delete from SQLite
  try {
    db.prepare('DELETE FROM admin_permissions WHERE user_id = ?').run(existing.id)
    db.prepare('DELETE FROM admin_profiles WHERE id = ?').run(existing.id)
    db.prepare('DELETE FROM users WHERE email = ?').run(existing.email)
  } catch {}

  // 4. Audit Log
  const adminId = req.user?.id || req.user?.email || 'admin'
  await recordAuditLog({
    admin_user_id: adminId,
    action: 'Staff deleted',
    target_user_id: existing.id,
    module: 'Staff Management',
    details: `Permanently deleted staff: ${existing.full_name} (${existing.email})`,
  })

  res.json({ message: 'Staff account deleted successfully' })
})

/**
 * GET /api/staff/audit-logs - View audit logs
 */
router.get('/audit-logs', requireSuperAdmin, async (req, res) => {
  try {
    let logs = await fetchAuditLogs(100)
    if (logs.length === 0) {
      logs = db.prepare('SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT 100').all()
    }
    res.json({ logs })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to fetch audit logs' })
  }
})

export default router
