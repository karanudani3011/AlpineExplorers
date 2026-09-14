import { Router } from 'express'
import { db, logActivity } from '../db.js'
import { authRequired } from '../middleware.js'

const router = Router()

router.post('/', (req, res) => {
  const { package_name, destination, travelers, price_per_person, total, data } = req.body || {}
  if (!package_name || !Array.isArray(data?.travelers) || data.travelers.length === 0) {
    return res.status(400).json({ error: 'An application requires a package and at least one traveler' })
  }
  const info = db.prepare(
    'INSERT INTO applications (package_name, destination, travelers, price_per_person, total, data) VALUES (?,?,?,?,?,?)'
  ).run(
    String(package_name),
    destination || null,
    Number(data.travelers.length) || 1,
    Number.isFinite(Number(price_per_person)) ? Number(price_per_person) : null,
    Number.isFinite(Number(total)) ? Number(total) : null,
    JSON.stringify(data)
  )
  res.status(201).json({ message: 'Application submitted successfully', id: Number(info.lastInsertRowid) })
})

router.use(authRequired)

router.get('/', (req, res) => {
  const { status = '', q = '' } = req.query
  let sql = 'SELECT * FROM applications WHERE 1=1'
  const params = []
  if (status) { sql += ' AND status = ?'; params.push(status) }
  if (q) { sql += ' AND (package_name LIKE ? OR destination LIKE ? OR data LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`) }
  sql += ' ORDER BY id DESC'
  res.json({ applications: db.prepare(sql).all(...params) })
})

router.patch('/:id/status', (req, res) => {
  const statuses = ['new', 'contacted', 'in_progress', 'converted', 'closed']
  const status = req.body.status
  if (!statuses.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  const existing = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('UPDATE applications SET status=? WHERE id=?').run(status, req.params.id)
  logActivity({ user_name: req.user.username, action: 'Application updated', module: 'Applications', details: `#${req.params.id} -> ${status}` })
  res.json({ message: 'Status updated', status })
})

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id)
  logActivity({ user_name: req.user.username, action: 'Application deleted', module: 'Applications', details: `#${req.params.id}` })
  res.json({ message: 'Deleted' })
})

export default router