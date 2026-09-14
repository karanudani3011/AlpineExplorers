import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db, logActivity } from '../db.js'
import { signToken, authRequired } from '../middleware.js'
import {
  supabaseAdmin,
  fetchAdminProfileByEmail,
  fetchAdminPermissions,
  recordAuditLog,
} from '../utils/supabase.js'

const router = Router()

/**
 * POST /api/auth/login
 * Unified login endpoint for both Super Admin and Staff.
 * Accepts: email (or username) and password.
 */
router.post('/login', async (req, res) => {
  const { email, username, password } = req.body || {}
  const identifier = (email || username || '').trim().toLowerCase()

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  let authenticatedProfile = null
  let permissions = []

  // 1. Try Supabase Auth verification
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: identifier,
      password: String(password),
    })

    if (!authError && authData?.user) {
      // Find corresponding admin profile
      let prof = await fetchAdminProfileByEmail(identifier)
      if (!prof && authData.user.id) {
        const { data } = await supabaseAdmin
          .from('admin_profiles')
          .select('*')
          .eq('auth_user_id', authData.user.id)
          .maybeSingle()
        prof = data
      }

      if (prof) {
        authenticatedProfile = prof
      } else {
        // Create fallback profile if not found
        authenticatedProfile = {
          id: authData.user.id,
          auth_user_id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name || 'Admin User',
          phone: authData.user.user_metadata?.phone || '',
          role: authData.user.user_metadata?.role || (identifier.startsWith('admin') ? 'SUPER_ADMIN' : 'STAFF'),
          status: 'ACTIVE',
        }
      }
    }
  } catch (supErr) {
    console.warn('[Supabase Auth sign-in warning]:', supErr.message)
  }

  // 2. Fallback to SQLite admin_profiles / users check if Supabase didn't match
  if (!authenticatedProfile) {
    let localProfile = db.prepare('SELECT * FROM admin_profiles WHERE LOWER(email) = ?').get(identifier)
    let localLegacy = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?').get(identifier, identifier)

    if (localLegacy) {
      const match = bcrypt.compareSync(String(password), localLegacy.password_hash)
      if (match) {
        const role = localLegacy.role === 'super_admin' ? 'SUPER_ADMIN' : 'STAFF'
        const status = localLegacy.status === 'active' ? 'ACTIVE' : 'INACTIVE'
        authenticatedProfile = {
          id: String(localLegacy.id),
          auth_user_id: String(localLegacy.id),
          full_name: localLegacy.full_name,
          email: localLegacy.email,
          phone: localLegacy.phone || '',
          role,
          status,
        }
      }
    } else if (localProfile) {
      // If found in admin_profiles but legacy not matched, check legacy users table for same email
      const userRec = db.prepare('SELECT password_hash FROM users WHERE email = ?').get(localProfile.email)
      if (userRec && bcrypt.compareSync(String(password), userRec.password_hash)) {
        authenticatedProfile = localProfile
      }
    }
  }

  // If still not authenticated
  if (!authenticatedProfile) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  // Check ACTIVE status
  const normStatus = (authenticatedProfile.status || 'ACTIVE').toUpperCase()
  if (normStatus === 'INACTIVE') {
    return res.status(403).json({ error: 'This account is deactivated. Contact the Super Admin.' })
  }

  const normRole = (authenticatedProfile.role || '').toUpperCase() === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'STAFF'

  // Fetch permissions
  if (normRole === 'SUPER_ADMIN') {
    permissions = ['*']
  } else {
    // 1. Try Supabase permissions
    try {
      const supPerms = await fetchAdminPermissions(authenticatedProfile.id)
      if (Array.isArray(supPerms) && supPerms.length > 0) {
        permissions = supPerms
      }
    } catch {}

    // 2. Fallback to SQLite permissions
    if (permissions.length === 0) {
      const rows = db.prepare('SELECT permission_key FROM admin_permissions WHERE user_id = ?').all(authenticatedProfile.id)
      permissions = rows.map((r) => r.permission_key)
    }
  }

  // Sign JWT
  const userPayload = {
    id: authenticatedProfile.id,
    auth_user_id: authenticatedProfile.auth_user_id || authenticatedProfile.id,
    full_name: authenticatedProfile.full_name,
    email: authenticatedProfile.email,
    phone: authenticatedProfile.phone || '',
    role: normRole,
    status: normStatus,
    permissions,
  }

  const token = signToken(userPayload, permissions)

  // Log activity & audit
  logActivity({
    user_name: authenticatedProfile.full_name || authenticatedProfile.email,
    action: 'Login',
    module: 'Auth',
    details: `${normRole} logged in (${authenticatedProfile.email})`,
  })

  await recordAuditLog({
    admin_user_id: authenticatedProfile.id,
    action: 'Login',
    module: 'Auth',
    details: `${normRole} logged in`,
  })

  res.json({
    token,
    user: userPayload,
  })
})

/**
 * POST /api/auth/logout
 */
router.post('/logout', authRequired, async (req, res) => {
  logActivity({
    user_name: req.user.full_name || req.user.email || req.user.username,
    action: 'Logout',
    module: 'Auth',
    details: 'User logged out',
  })
  res.json({ message: 'Logged out successfully' })
})

/**
 * GET /api/auth/me
 * Restores user session, validates active status, and reloads current permissions.
 */
router.get('/me', authRequired, async (req, res) => {
  const userId = req.user.id || req.user.auth_user_id
  let profile = null

  // 1. Try fetching from Supabase
  try {
    const { data } = await supabaseAdmin
      .from('admin_profiles')
      .select('*')
      .or(`id.eq.${userId},auth_user_id.eq.${userId},email.eq.${req.user.email}`)
      .maybeSingle()
    if (data) profile = data
  } catch {}

  // 2. Fallback to SQLite
  if (!profile) {
    profile = db.prepare('SELECT * FROM admin_profiles WHERE id = ? OR auth_user_id = ? OR email = ?').get(userId, userId, req.user.email)
  }

  if (!profile) {
    const legacy = db.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(userId, req.user.email)
    if (legacy) {
      profile = {
        id: String(legacy.id),
        auth_user_id: String(legacy.id),
        full_name: legacy.full_name,
        email: legacy.email,
        phone: legacy.phone || '',
        role: legacy.role === 'super_admin' ? 'SUPER_ADMIN' : 'STAFF',
        status: legacy.status === 'active' ? 'ACTIVE' : 'INACTIVE',
      }
    }
  }

  if (!profile) {
    return res.status(401).json({ error: 'Account not found' })
  }

  const normStatus = (profile.status || 'ACTIVE').toUpperCase()
  if (normStatus === 'INACTIVE') {
    return res.status(403).json({ error: 'This account is deactivated. Contact the Super Admin.' })
  }

  const normRole = (profile.role || '').toUpperCase() === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'STAFF'

  let permissions = []
  if (normRole === 'SUPER_ADMIN') {
    permissions = ['*']
  } else {
    try {
      const supPerms = await fetchAdminPermissions(profile.id)
      if (Array.isArray(supPerms) && supPerms.length > 0) permissions = supPerms
    } catch {}

    if (permissions.length === 0) {
      const localPerms = db.prepare('SELECT permission_key FROM admin_permissions WHERE user_id = ?').all(profile.id)
      permissions = localPerms.map((r) => r.permission_key)
    }
  }

  res.json({
    user: {
      id: profile.id,
      auth_user_id: profile.auth_user_id || profile.id,
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone || '',
      role: normRole,
      status: normStatus,
      permissions,
    },
  })
})

export default router