import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db, logActivity } from '../db.js'
import { authRequired, requireSuperAdmin } from '../middleware.js'

const router = Router()
router.use(authRequired, requireSuperAdmin)

const SAFE = 'id, full_name, username, email, phone, role, status, created_at'

router.get('/', (req, res) => {
  const users = db.prepare(`SELECT ${SAFE} FROM users ORDER BY id`).all()
  res.json({ users })
})

router.post('/', (req, res) => {
  const { full_name, username, email, phone, password, role, status } = req.body || {}
  if (!full_name || !username || !email || !password) {
    return res.status(400).json({ error: 'Name, username, email and password are required' })
  }
  const exists = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email)
  if (exists) return res.status(400).json({ error: 'Username or email already exists' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const hash = bcrypt.hashSync(String(password), 10)
  const info = db.prepare(
    'INSERT INTO users (full_name, username, email, phone, password_hash, role, status) VALUES (?,?,?,?,?,?,?)'
  ).run(full_name, username, email, phone || null, hash, role || 'editor', status || 'active')

  logActivity({ user_name: req.user.username, action: 'User created', module: 'Users', details: `${full_name} (${role})` })
  const user = db.prepare(`SELECT ${SAFE} FROM users WHERE id = ?`).get(info.lastInsertRowid)
  res.status(201).json({ user })
})

router.put('/:id', (req, res) => {
  const { full_name, email, phone, role, status } = req.body || {}
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'User not found' })

  const dup = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email || '', req.params.id)
  if (dup) return res.status(400).json({ error: 'Email already in use' })

  if (existing.role === 'super_admin' && role && role !== 'super_admin') {
    const superCount = db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'super_admin'").get().c
    if (superCount <= 1) return res.status(400).json({ error: 'Cannot demote the last Super Admin' })
  }

  db.prepare('UPDATE users SET full_name=?, email=?, phone=?, role=?, status=? WHERE id=?')
    .run(full_name || existing.full_name, email || existing.email, phone ?? existing.phone,
      role || existing.role, status || existing.status, req.params.id)

  logActivity({ user_name: req.user.username, action: 'User updated', module: 'Users', details: existing.username })
  const user = db.prepare(`SELECT ${SAFE} FROM users WHERE id = ?`).get(req.params.id)
  res.json({ user })
})

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'User not found' })
  if (existing.id === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account' })
  if (existing.role === 'super_admin') {
    const superCount = db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'super_admin'").get().c
    if (superCount <= 1) return res.status(400).json({ error: 'Cannot delete the last Super Admin' })
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
  logActivity({ user_name: req.user.username, action: 'User deleted', module: 'Users', details: existing.username })
  res.json({ message: 'User deleted' })
})

router.patch('/:id/status', (req, res) => {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'User not found' })
  if (existing.id === req.user.id) return res.status(400).json({ error: 'You cannot deactivate your own account' })
  const status = req.body.status === 'active' ? 'active' : 'inactive'
  db.prepare('UPDATE users SET status=? WHERE id=?').run(status, req.params.id)
  logActivity({ user_name: req.user.username, action: status === 'active' ? 'User activated' : 'User deactivated', module: 'Users', details: existing.username })
  res.json({ message: 'User status updated', status })
})

router.patch('/:id/role', (req, res) => {
  const { role } = req.body || {}
  if (!['super_admin', 'admin', 'editor'].includes(role)) return res.status(400).json({ error: 'Invalid role' })
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'User not found' })
  if (existing.role === 'super_admin' && role !== 'super_admin') {
    const superCount = db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'super_admin'").get().c
    if (superCount <= 1) return res.status(400).json({ error: 'Cannot demote the last Super Admin' })
  }
  db.prepare('UPDATE users SET role=? WHERE id=?').run(role, req.params.id)
  logActivity({ user_name: req.user.username, action: 'Role changed', module: 'Users', details: `${existing.username} -> ${role}` })
  res.json({ message: 'Role updated', role })
})

router.patch('/:id/reset-password', (req, res) => {
  const { password } = req.body || {}
  if (!password || String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'User not found' })
  const hash = bcrypt.hashSync(String(password), 10)
  db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash, req.params.id)
  logActivity({ user_name: req.user.username, action: 'Password reset', module: 'Users', details: existing.username })
  res.json({ message: 'Password reset successfully' })
})

export default router