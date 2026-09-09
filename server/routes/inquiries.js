import { Router } from 'express'
import { db, logActivity } from '../db.js'
import { authRequired } from '../middleware.js'

const router = Router()

router.post('/', (req, res) => {
  const { name, email, phone, destination, package_name, travel_date, travelers, message } = req.body || {}
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' })
  const info = db.prepare(
    'INSERT INTO inquiries (name, email, phone, destination, package_name, travel_date, travelers, message, status) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(String(name), String(email), phone || null, destination || null, package_name || null,
    travel_date || null, travelers ? Number(travelers) : null, message || null, 'new')
  res.status(201).json({ message: 'Inquiry submitted successfully', id: Number(info.lastInsertRowid) })
})

router.use(authRequired)

router.get('/', (req, res) => {
  const { status = '', q = '' } = req.query
  let sql = 'SELECT * FROM inquiries WHERE 1=1'
  const params = []
  if (status) { sql += ' AND status = ?'; params.push(status) }
  if (q) { sql += ' AND (name LIKE ? OR email LIKE ? OR destination LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`) }
  sql += ' ORDER BY id DESC'
  res.json({ inquiries: db.prepare(sql).all(...params) })
})

router.patch('/:id/status', (req, res) => {
  const statuses = ['new', 'contacted', 'in_progress', 'converted', 'closed']
  const status = req.body.status
  if (!statuses.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  const existing = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('UPDATE inquiries SET status=? WHERE id=?').run(status, req.params.id)
  logActivity({ user_name: req.user.username, action: 'Inquiry updated', module: 'Inquiries', details: `#${req.params.id} -> ${status}` })
  res.json({ message: 'Status updated', status })
})

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id)
  logActivity({ user_name: req.user.username, action: 'Inquiry deleted', module: 'Inquiries', details: `#${req.params.id}` })
  res.json({ message: 'Deleted' })
})

export default router