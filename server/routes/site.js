import { Router } from 'express'
import { db, logActivity } from '../db.js'
import { authRequired } from '../middleware.js'

const router = Router()
router.use(authRequired)

const JSON_PARSE = ['sections', 'content', 'values_list', 'recognition', 'statistics']

function parse(r) {
  if (!r) return r
  const out = { ...r }
  for (const f of JSON_PARSE) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f]) } catch { out[f] = {} }
    }
  }
  return out
}

/* ── Homepage ── */
router.get('/homepage', (req, res) => {
  res.json({ homepage: parse(db.prepare('SELECT * FROM homepage WHERE id = 1').get()) })
})
router.put('/homepage', (req, res) => {
  const b = req.body || {}
  if (!db.prepare('SELECT id FROM homepage WHERE id = 1').get()) {
    db.prepare('INSERT INTO homepage (id) VALUES (1)').run()
  }
  db.prepare(`UPDATE homepage SET hero_title=?, hero_subtitle=?, hero_image=?, cta_primary_text=?, cta_primary_link=?,
    cta_secondary_text=?, cta_secondary_link=?, sections=?, content=?, updated_at=datetime('now') WHERE id=1`)
    .run(b.hero_title ?? null, b.hero_subtitle ?? null, b.hero_image ?? null,
      b.cta_primary_text ?? null, b.cta_primary_link ?? null, b.cta_secondary_text ?? null, b.cta_secondary_link ?? null,
      JSON.stringify(b.sections ?? {}), JSON.stringify(b.content ?? {}))
  logActivity({ user_name: req.user.username, action: 'Settings changed', module: 'Homepage', details: 'Homepage updated' })
  res.json({ homepage: parse(db.prepare('SELECT * FROM homepage WHERE id = 1').get()) })
})

/* ── About Us ── */
router.get('/about', (req, res) => {
  res.json({ about: parse(db.prepare('SELECT * FROM about_us WHERE id = 1').get()) })
})
router.put('/about', (req, res) => {
  const b = req.body || {}
  if (!db.prepare('SELECT id FROM about_us WHERE id = 1').get()) {
    db.prepare('INSERT INTO about_us (id) VALUES (1)').run()
  }
  db.prepare(`UPDATE about_us SET legacy_description=?, founder_name=?, founder_title=?, founder_bio=?, founder_image=?,
    mission=?, vision=?, values_list=?, recognition=?, statistics=?, updated_at=datetime('now') WHERE id=1`)
    .run(b.legacy_description ?? null, b.founder_name ?? null, b.founder_title ?? null, b.founder_bio ?? null, b.founder_image ?? null,
      b.mission ?? null, b.vision ?? null, JSON.stringify(b.values ?? []), JSON.stringify(b.recognition ?? []), JSON.stringify(b.statistics ?? []))
  logActivity({ user_name: req.user.username, action: 'Settings changed', module: 'About Us', details: 'About page updated' })
  res.json({ about: parse(db.prepare('SELECT * FROM about_us WHERE id = 1').get()) })
})

/* ── Contact Settings ── */
router.get('/contact', (req, res) => {
  res.json({ contact: parse(db.prepare('SELECT * FROM contact_settings WHERE id = 1').get()) })
})
router.put('/contact', (req, res) => {
  const b = req.body || {}
  if (!db.prepare('SELECT id FROM contact_settings WHERE id = 1').get()) {
    db.prepare('INSERT INTO contact_settings (id) VALUES (1)').run()
  }
  db.prepare(`UPDATE contact_settings SET company_name=?, phone=?, whatsapp=?, email=?, address=?, map_link=?, instagram=?, facebook=?, youtube=?, business_hours=?, updated_at=datetime('now') WHERE id=1`)
    .run(b.company_name ?? null, b.phone ?? null, b.whatsapp ?? null, b.email ?? null, b.address ?? null,
      b.map_link ?? null, b.instagram ?? null, b.facebook ?? null, b.youtube ?? null, b.business_hours ?? null)
  logActivity({ user_name: req.user.username, action: 'Settings changed', module: 'Contact', details: 'Contact settings updated' })
  res.json({ contact: db.prepare('SELECT * FROM contact_settings WHERE id = 1').get() })
})

/* ── Site Settings ── */
router.get('/settings', (req, res) => {
  res.json({ settings: db.prepare('SELECT * FROM settings WHERE id = 1').get() })
})
router.put('/settings', (req, res) => {
  const b = req.body || {}
  if (!db.prepare('SELECT id FROM settings WHERE id = 1').get()) {
    db.prepare('INSERT INTO settings (id) VALUES (1)').run()
  }
  db.prepare(`UPDATE settings SET website_name=?, logo=?, favicon=?, seo_title=?, seo_description=?, ga_id=?, maintenance_mode=?, updated_at=datetime('now') WHERE id=1`)
    .run(b.website_name ?? null, b.logo ?? null, b.favicon ?? null, b.seo_title ?? null, b.seo_description ?? null,
      b.ga_id ?? null, b.maintenance_mode ? 1 : 0)
  logActivity({ user_name: req.user.username, action: 'Settings changed', module: 'Settings', details: 'Site settings updated' })
  res.json({ settings: db.prepare('SELECT * FROM settings WHERE id = 1').get() })
})

/* ── Activity Log ── */
router.get('/activity', (req, res) => {
  const rows = db.prepare('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100').all()
  res.json({ logs: rows })
})

/* ── Dashboard stats ── */
router.get('/dashboard', (req, res) => {
  const one = (sql, ...p) => db.prepare(sql).get(...p)?.c || 0

  const stats = {
    international: one('SELECT COUNT(*) c FROM international_packages'),
    domestic: one('SELECT COUNT(*) c FROM domestic_packages'),
    adventure: one('SELECT COUNT(*) c FROM adventure_packages'),
    camping: one('SELECT COUNT(*) c FROM camping_packages'),
    blogs: one('SELECT COUNT(*) c FROM blogs'),
    users: one('SELECT COUNT(*) c FROM users'),
    newInquiries: one("SELECT COUNT(*) c FROM inquiries WHERE status = 'new'"),
    totalInquiries: one('SELECT COUNT(*) c FROM inquiries'),
    services: one('SELECT COUNT(*) c FROM services'),
    activePackages: one("SELECT COUNT(*) c FROM (SELECT status FROM international_packages UNION ALL SELECT status FROM domestic_packages UNION ALL SELECT status FROM adventure_packages UNION ALL SELECT status FROM camping_packages) WHERE status = 'active'"),
    media: one('SELECT COUNT(*) c FROM media'),
  }

  const byCategory = [
    { name: 'International', value: stats.international },
    { name: 'Domestic', value: stats.domestic },
    { name: 'Adventure', value: stats.adventure },
    { name: 'Camping', value: stats.camping },
  ]

  const monthlyInquiries = db.prepare(
    `SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS value FROM inquiries GROUP BY month ORDER BY month DESC LIMIT 12`
  ).all().reverse()

  const topDestinations = db.prepare(
    `SELECT destination AS name, COUNT(*) AS value FROM inquiries WHERE destination IS NOT NULL AND destination != '' GROUP BY destination ORDER BY value DESC LIMIT 6`
  ).all()

  const recentActivity = db.prepare('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 10').all()

  res.json({ stats, byCategory, monthlyInquiries, topDestinations, recentActivity })
})

export default router