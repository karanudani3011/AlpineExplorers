import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db, logActivity } from '../db.js'
import { signToken, authRequired } from '../middleware.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(String(username).trim())
  if (!user) return res.status(401).json({ error: 'Invalid username or password' })
  if (user.status !== 'active') return res.status(403).json({ error: 'This account is deactivated. Contact the Super Admin.' })

  const ok = bcrypt.compareSync(String(password), user.password_hash)
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' })

  const token = signToken(user)
  logActivity({ user_name: user.username, action: 'Login', module: 'Auth', details: 'Admin logged in' })
  res.json({
    token,
    user: { id: user.id, full_name: user.full_name, username: user.username, email: user.email, role: user.role },
  })
})

router.post('/logout', authRequired, (req, res) => {
  logActivity({ user_name: req.user.username, action: 'Logout', module: 'Auth', details: 'Admin logged out' })
  res.json({ message: 'Logged out' })
})

router.get('/me', authRequired, (req, res) => {
  const user = db.prepare('SELECT id, full_name, username, email, phone, role, status, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!user || user.status !== 'active') return res.status(401).json({ error: 'Account not found or deactivated' })
  res.json({ user })
})

export default router