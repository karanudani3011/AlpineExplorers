import { Router } from 'express'
import { db, logActivity } from '../db.js'
import { authRequired } from '../middleware.js'

const JSON_ARRAY = ['gallery', 'activities', 'includes', 'rules', 'what_to_bring', 'tags', 'values', 'recognition', 'statistics']
const NUM = ['price', 'original_price']
const FLAG = ['air_ticket', 'passport_visa', 'pickup_drop', 'accommodation', 'food', 'sightseeing', 'guidance', 'transportation', 'featured', 'maintenance_mode', 'status_active']

export function normalizeRow(body, fields) {
  const out = {}
  for (const f of fields) {
    if (!(f in body)) continue
    let v = body[f]
    if (JSON_ARRAY.includes(f)) {
      out[f] = typeof v === 'string' ? v : JSON.stringify(Array.isArray(v) ? v : [])
    } else if (NUM.includes(f)) {
      out[f] = v === '' || v == null ? null : Number(v)
    } else if (FLAG.includes(f)) {
      out[f] = v && v !== '0' && v !== 'false' ? 1 : 0
    } else {
      out[f] = v == null ? null : String(v)
    }
  }
  return out
}

export function decorateRow(r) {
  if (!r) return r
  const out = { ...r }
  for (const f of JSON_ARRAY) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f]) } catch { out[f] = [] }
    }
  }
  return out
}

export function crudAdminRouter({ table, fields, module }) {
  const router = Router()
  router.use(authRequired)

  const selectable = `id, ${fields.join(', ')}, created_at, updated_at`

  router.get('/', (req, res) => {
    const rows = db.prepare(`SELECT ${selectable} FROM ${table} ORDER BY id DESC`).all()
    res.json({ [module]: rows.map(decorateRow) })
  })

  router.get('/:id', (req, res) => {
    const row = db.prepare(`SELECT ${selectable} FROM ${table} WHERE id = ?`).get(req.params.id)
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(decorateRow(row))
  })

  router.post('/', (req, res) => {
    const data = normalizeRow(req.body || {}, fields)
    const cols = Object.keys(data).filter((c) => data[c] !== undefined)
    if (cols.length === 0) return res.status(400).json({ error: 'No valid fields provided' })

    // Ensure status default
    if (!cols.includes('status')) { data.status = 'active'; cols.push('status') }

    const ph = cols.map(() => '?').join(', ')
    const vals = cols.map((c) => data[c])
    const info = db.prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${ph})`).run(...vals)
    logActivity({ user_name: req.user.username, action: 'Created', module, details: `#${info.lastInsertRowid}` })
    const row = db.prepare(`SELECT ${selectable} FROM ${table} WHERE id = ?`).get(info.lastInsertRowid)
    res.status(201).json(decorateRow(row))
  })

  router.put('/:id', (req, res) => {
    const existing = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const data = normalizeRow(req.body || {}, fields)
    const cols = Object.keys(data).filter((c) => data[c] !== undefined)
    if (cols.length === 0) return res.status(400).json({ error: 'No valid fields provided' })
    const set = cols.map((c) => `${c} = ?`).join(', ')
    const vals = [...cols.map((c) => data[c]), req.params.id]
    db.prepare(`UPDATE ${table} SET ${set}, updated_at = datetime('now') WHERE id = ?`).run(...vals)
    logActivity({ user_name: req.user.username, action: 'Updated', module, details: `#${req.params.id}` })
    const row = db.prepare(`SELECT ${selectable} FROM ${table} WHERE id = ?`).get(req.params.id)
    res.json(decorateRow(row))
  })

  router.patch('/:id/status', (req, res) => {
    const existing = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const status = req.body.status === 'active' ? 'active' : 'inactive'
    db.prepare(`UPDATE ${table} SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, req.params.id)
    logActivity({ user_name: req.user.username, action: status === 'active' ? 'Activated' : 'Deactivated', module, details: `#${req.params.id}` })
    res.json({ message: 'Status updated', status })
  })

  router.patch('/:id/featured', (req, res) => {
    const existing = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const featured = req.body.featured ? 1 : 0
    db.prepare(`UPDATE ${table} SET featured = ?, updated_at = datetime('now') WHERE id = ?`).run(featured, req.params.id)
    logActivity({ user_name: req.user.username, action: featured ? 'Featured' : 'Unfeatured', module, details: `#${req.params.id}` })
    res.json({ message: 'Updated', featured })
  })

  router.delete('/:id', (req, res) => {
    const existing = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id)
    logActivity({ user_name: req.user.username, action: 'Deleted', module, details: `#${req.params.id}` })
    res.json({ message: 'Deleted' })
  })

  return router
}

export function publicTableRouter({ table, fields, hasFeatured }) {
  const router = Router()
  const orderBy = hasFeatured ? 'featured DESC, ' : ''
  const selectable = `id, ${fields.join(', ')}, created_at`
  router.get('/', (req, res) => {
    const rows = db.prepare(`SELECT ${selectable} FROM ${table} WHERE status = 'active' ORDER BY ${orderBy}id DESC`).all()
    res.json({ items: rows.map(decorateRow) })
  })
  return router
}

export const CONTENT_CONFIGS = {
  international: {
    table: 'international_packages',
    module: 'international',
    hasFeatured: true,
    fields: ['destination', 'country', 'duration', 'short_description', 'full_description', 'price', 'original_price',
      'air_ticket', 'passport_visa', 'pickup_drop', 'accommodation', 'food', 'sightseeing', 'guidance',
      'image', 'gallery', 'featured', 'status'],
  },
  domestic: {
    table: 'domestic_packages',
    module: 'domestic',
    fields: ['destination', 'state', 'duration', 'season', 'short_description', 'full_description', 'price',
      'transportation', 'accommodation', 'food', 'sightseeing', 'activities', 'image', 'gallery', 'status'],
  },
  adventure: {
    table: 'adventure_packages',
    module: 'adventure',
    fields: ['title', 'category', 'location', 'duration', 'season', 'ex', 'description', 'activities', 'includes', 'image', 'status'],
  },
  camping: {
    table: 'camping_packages',
    module: 'camping',
    fields: ['title', 'location', 'duration', 'season', 'description', 'activities', 'accommodation', 'food',
      'charges', 'rules', 'what_to_bring', 'certificates', 'image', 'gallery', 'status'],
  },
  services: {
    table: 'services',
    module: 'services',
    fields: ['icon', 'title', 'description', 'category', 'status'],
  },
}