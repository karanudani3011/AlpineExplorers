import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const JWT_SECRET = process.env.JWT_SECRET || 'alpine-secret-key-change-in-production'
export const TOKEN_EXPIRY = '8h'

export function signToken(user, permissions = []) {
  const normRole = (user.role || '').toUpperCase() === 'SUPER_ADMIN' || user.role === 'super_admin' ? 'SUPER_ADMIN' : 'STAFF'
  return jwt.sign(
    {
      id: user.id,
      auth_user_id: user.auth_user_id || user.id,
      username: user.username || user.email,
      email: user.email,
      full_name: user.full_name,
      role: normRole,
      status: (user.status || 'ACTIVE').toUpperCase(),
      permissions: permissions || [],
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Authentication required' })

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.status === 'INACTIVE') {
      return res.status(403).json({ error: 'This account is deactivated. Contact the Super Admin.' })
    }
    req.user = payload
    return next()
  } catch {
    // If not local JWT, could be Supabase access token; decode payload safely
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
        if (decoded && (decoded.sub || decoded.email)) {
          req.user = {
            id: decoded.sub,
            auth_user_id: decoded.sub,
            email: decoded.email,
            role: decoded.user_metadata?.role || 'STAFF',
            status: 'ACTIVE',
            permissions: decoded.user_metadata?.permissions || [],
          }
          return next()
        }
      }
    } catch {}
    return res.status(401).json({ error: 'Session expired or invalid token' })
  }
}

export function requireSuperAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' })
  const role = (req.user.role || '').toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'SUPERADMIN') {
    return res.status(403).json({ error: 'Only Super Admin can access this section' })
  }
  next()
}

export function requirePermission(permissionKey) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    const role = (req.user.role || '').toUpperCase()
    if (role === 'SUPER_ADMIN' || role === 'SUPERADMIN') {
      return next() // Super Admin always has all permissions
    }

    const perms = Array.isArray(req.user.permissions) ? req.user.permissions : []
    if (perms.includes(permissionKey) || perms.includes('*')) {
      return next()
    }

    return res.status(403).json({ error: `You don't have permission to access this section (${permissionKey})` })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    const userRole = (req.user.role || '').toUpperCase()
    const match = roles.some((r) => r.toUpperCase() === userRole || (r.toUpperCase() === 'SUPER_ADMIN' && userRole === 'SUPERADMIN'))
    if (userRole === 'SUPER_ADMIN' || match) return next()
    return res.status(403).json({ error: 'You do not have permission to perform this action' })
  }
}

const storage = multer.memoryStorage()

const allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/gif', 'image/svg+xml']
const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/mpeg']
const limits = { fileSize: 50 * 1024 * 1024 } // 50MB for video/image

export const upload = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only image and video files are allowed'))
    }
  },
})

export function uploadError(err, req, res, next) {
  if (err instanceof multer.MulterError || err?.message?.includes('image') || err?.message?.includes('video')) {
    return res.status(400).json({ error: err.message || 'Upload failed' })
  }
  next(err)
}