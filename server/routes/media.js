import { Router } from 'express'
import { db, logActivity } from '../db.js'
import { authRequired, upload, uploadError } from '../middleware.js'

const router = Router()
router.use(authRequired)

router.get('/', (req, res) => {
  const { q = '', category = '' } = req.query
  let sql = 'SELECT * FROM media WHERE 1=1'
  const params = []
  if (q) { sql += ' AND filename LIKE ?'; params.push(`%${q}%`) }
  if (category) { sql += ' AND category = ?'; params.push(category) }
  sql += ' ORDER BY id DESC'
  res.json({ media: db.prepare(sql).all(...params) })
})

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const category = req.body.category || 'general'
  const title = req.body.title || req.file.originalname
  const url = `/uploads/${req.file.filename}`
  const info = db.prepare(
    'INSERT INTO media (filename, url, category, title, size, type) VALUES (?,?,?,?,?,?)'
  ).run(req.file.filename, url, category, title, req.file.size, req.file.mimetype)
  logActivity({ user_name: req.user.username, action: 'Image uploaded', module: 'Media', details: title })
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json({ media: item })
})

router.put('/:id', upload.single('file'), (req, res) => {
  const existing = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const url = req.file ? `/uploads/${req.file.filename}` : existing.url
  const filename = req.file ? req.file.filename : existing.filename
  db.prepare('UPDATE media SET title=?, category=?, url=?, filename=? WHERE id=?')
    .run(req.body.title || existing.title, req.body.category || existing.category, url, filename, req.params.id)
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  res.json({ media: item })
})

router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('UPDATE media SET title=?, category=? WHERE id=?')
    .run(req.body.title ?? existing.title, req.body.category ?? existing.category, req.params.id)
  res.json({ media: db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id) })
})

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id)
  logActivity({ user_name: req.user.username, action: 'Image deleted', module: 'Media', details: existing.title })
  res.json({ message: 'Deleted' })
})

export const mediaConfig = { router, upload, uploadError }

export default router