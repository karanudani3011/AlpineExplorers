import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const JWT_SECRET = process.env.JWT_SECRET || 'alpine-secret-key-change-in-production'
export const TOKEN_EXPIRY = '8h'

export function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
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
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid token' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    if (roles.includes('super_admin') && req.user.role === 'super_admin') return next()
    if (roles.includes(req.user.role)) return next()
    return res.status(403).json({ error: 'You do not have permission to perform this action' })
  }
}

export function requireSuperAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' })
  if (req.user.role !== 'super_admin') return res.status(403).json({ error: 'Only Super Admin can access this' })
  next()
}

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safe}`)
  },
})

const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/gif', 'image/svg+xml']
const limits = { fileSize: 8 * 1024 * 1024 }

export const upload = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

export function uploadError(err, req, res, next) {
  if (err instanceof multer.MulterError || err?.message?.includes('image')) {
    return res.status(400).json({ error: err.message || 'Upload failed' })
  }
  next(err)
}