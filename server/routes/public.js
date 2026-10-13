import { Router } from 'express'
import { db, getTourPackagesByIdentifier, getPackageById } from '../db.js'
import { publicTableRouter, CONTENT_CONFIGS, decorateRow } from './content.js'
import { runSeed } from '../seed.js'

const publicRouter = Router()

publicRouter.get('/seed', (req, res) => {
  try {
    const seededNow = runSeed()
    res.json({ ok: true, seeded: seededNow, message: seededNow ? 'Database seeded successfully' : 'Database already seeded' })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

publicRouter.get('/tours/:identifier/packages', (req, res) => {
  try {
    const packages = getTourPackagesByIdentifier(req.params.identifier)
    res.json({ packages })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

publicRouter.get('/packages/:id', (req, res) => {
  try {
    const pkg = getPackageById(req.params.id)
    if (!pkg) return res.status(404).json({ error: 'Package not found' })
    res.json({ package: pkg })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

Object.entries(CONTENT_CONFIGS).forEach(([key, cfg]) => {
  publicRouter.use(`/${key}`, publicTableRouter(cfg))
})

publicRouter.get('/blogs', (req, res) => {
  const blogs = db.prepare(
    "SELECT id, title, slug, category, author, cover_image, short_description, content, tags, publish_date, featured, created_at FROM blogs WHERE status = 'published' ORDER BY featured DESC, publish_date DESC, id DESC"
  ).all().map(decorateRow)
  res.json({ blogs })
})

publicRouter.get('/featured', (req, res) => {
  const items = db.prepare(
    "SELECT * FROM international_packages WHERE status='active' AND featured=1 ORDER BY id DESC LIMIT 6"
  ).all().map(decorateRow)
  res.json({ items })
})

function parseRow(r) {
  if (!r) return r
  const out = { ...r }
  for (const f of ['sections', 'content', 'values_list', 'recognition', 'statistics']) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f]) } catch { out[f] = {} }
    }
  }
  return out
}

publicRouter.get('/homepage', (req, res) => {
  if (!db.prepare('SELECT id FROM homepage WHERE id=1').get()) {
    db.prepare('INSERT INTO homepage (id) VALUES (1)').run()
  }
  res.json({ homepage: parseRow(db.prepare('SELECT * FROM homepage WHERE id=1').get()) })
})

publicRouter.get('/about', (req, res) => {
  if (!db.prepare('SELECT id FROM about_us WHERE id=1').get()) {
    db.prepare('INSERT INTO about_us (id) VALUES (1)').run()
  }
  res.json({ about: parseRow(db.prepare('SELECT * FROM about_us WHERE id=1').get()) })
})

publicRouter.get('/contact', (req, res) => {
  if (!db.prepare('SELECT id FROM contact_settings WHERE id=1').get()) {
    db.prepare('INSERT INTO contact_settings (id) VALUES (1)').run()
  }
  res.json({ contact: parseRow(db.prepare('SELECT * FROM contact_settings WHERE id=1').get()) })
})

publicRouter.get('/settings', (req, res) => {
  if (!db.prepare('SELECT id FROM settings WHERE id=1').get()) {
    db.prepare('INSERT INTO settings (id) VALUES (1)').run()
  }
  res.json({ settings: db.prepare('SELECT website_name, logo, favicon, seo_title, seo_description, ga_id, maintenance_mode FROM settings WHERE id=1').get() })
})

publicRouter.get('/booking-settings', (req, res) => {
  try {
    let row = db.prepare('SELECT qr_payment_enabled, closed_message FROM booking_settings WHERE id=1').get()
    if (!row) {
      db.prepare("INSERT OR IGNORE INTO booking_settings (id, qr_payment_enabled, closed_message) VALUES (1, 1, 'Bookings are currently full. Please contact us for the next available dates.')").run()
      row = db.prepare('SELECT qr_payment_enabled, closed_message FROM booking_settings WHERE id=1').get()
    }
    res.json({
      settings: {
        qr_payment_enabled: Boolean(row.qr_payment_enabled),
        closed_message: row.closed_message || 'Bookings are currently full. Please contact us for the next available dates.',
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default publicRouter