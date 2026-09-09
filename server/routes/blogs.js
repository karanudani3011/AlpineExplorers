import { Router } from 'express'
import { db, logActivity } from '../db.js'
import { authRequired } from '../middleware.js'
import { decorateRow } from './content.js'

const router = Router()
router.use(authRequired)

const FIELDS = ['title', 'slug', 'category', 'author', 'cover_image', 'short_description', 'content', 'tags', 'publish_date', 'featured', 'status']
const SELECT = `id, ${FIELDS.join(', ')}, created_at, updated_at`

function slugify(s) {
  return String(s || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-')
}

router.get('/', (req, res) => {
  const rows = db.prepare(`SELECT ${SELECT} FROM blogs ORDER BY id DESC`).all()
  res.json({ blogs: rows.map(decorateRow) })
})

router.get('/:id', (req, res) => {
  const row = db.prepare(`SELECT ${SELECT} FROM blogs WHERE id = ?`).get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(decorateRow(row))
})

router.post('/', (req, res) => {
  const b = req.body || {}
  if (!b.title) return res.status(400).json({ error: 'Title is required' })
  const slug = b.slug || slugify(b.title)
  const info = db.prepare(
    `INSERT INTO blogs (title, slug, category, author, cover_image, short_description, content, tags, publish_date, featured, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).run(b.title, slug, b.category || 'Travel', b.author || 'Alpine Explorers', b.cover_image || null,
    b.short_description || '', b.content || '',
    JSON.stringify(b.tags || []), b.publish_date || null, b.featured ? 1 : 0, b.status || 'draft')
  logActivity({ user_name: req.user.username, action: 'Blog created', module: 'Blog', details: b.title })
  const row = db.prepare(`SELECT ${SELECT} FROM blogs WHERE id = ?`).get(info.lastInsertRowid)
  res.status(201).json(decorateRow(row))
})

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM blogs WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const b = req.body || {}
  db.prepare(
    `UPDATE blogs SET title=?, slug=?, category=?, author=?, cover_image=?, short_description=?, content=?, tags=?, publish_date=?, featured=?, status=?, updated_at=datetime('now') WHERE id=?`
  ).run(
    b.title ?? existing.title, b.slug ?? existing.slug, b.category ?? existing.category,
    b.author ?? existing.author, b.cover_image ?? existing.cover_image, b.short_description ?? existing.short_description,
    b.content ?? existing.content, JSON.stringify(b.tags ?? []), b.publish_date ?? existing.publish_date,
    b.featured !== undefined ? (b.featured ? 1 : 0) : existing.featured,
    b.status ?? existing.status, req.params.id
  )
  logActivity({ user_name: req.user.username, action: 'Blog updated', module: 'Blog', details: b.title || existing.title })
  const row = db.prepare(`SELECT ${SELECT} FROM blogs WHERE id = ?`).get(req.params.id)
  res.json(decorateRow(row))
})

router.patch('/:id/status', (req, res) => {
  const existing = db.prepare('SELECT * FROM blogs WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const status = ['draft', 'published', 'unpublished'].includes(req.body.status) ? req.body.status : 'published'
  db.prepare('UPDATE blogs SET status=?, updated_at=datetime(\'now\') WHERE id=?').run(status, req.params.id)
  logActivity({ user_name: req.user.username, action: status === 'published' ? 'Blog published' : `Blog ${status}`, module: 'Blog', details: existing.title })
  res.json({ message: 'Status updated', status })
})

router.patch('/:id/featured', (req, res) => {
  db.prepare('UPDATE blogs SET featured=?, updated_at=datetime(\'now\') WHERE id=?').run(req.body.featured ? 1 : 0, req.params.id)
  res.json({ message: 'Updated' })
})

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM blogs WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id)
  logActivity({ user_name: req.user.username, action: 'Blog deleted', module: 'Blog', details: existing.title })
  res.json({ message: 'Deleted' })
})

export default router