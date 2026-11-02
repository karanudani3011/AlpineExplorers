import fs from 'node:fs'

const content = fs.readFileSync('server/routes/public.js', 'utf8')
const normalized = content.replace(/\r\n/g, '\n')

const target = `publicRouter.get('/blogs', (req, res) => {
  const blogs = db.prepare(
    "SELECT id, title, slug, category, author, cover_image, short_description, content, tags, publish_date, featured, created_at FROM blogs WHERE status = 'published' ORDER BY featured DESC, publish_date DESC, id DESC"
  ).all().map(decorateRow)
  res.json({ blogs })
})`

const addition = `

publicRouter.get('/blogs/:slug', (req, res) => {
  const row = db.prepare(
    "SELECT id, title, slug, category, author, cover_image, short_description, content, tags, publish_date, featured, created_at FROM blogs WHERE slug = ? OR id = ?"
  ).get(req.params.slug, req.params.slug)
  if (!row) return res.status(404).json({ error: 'Blog not found' })
  res.json({ blog: decorateRow(row) })
})`

if (normalized.includes(target)) {
  const updated = normalized.replace(target, target + addition)
  fs.writeFileSync('server/routes/public.js', updated, 'utf8')
  console.log('Added /blogs/:slug successfully')
} else {
  console.error('Target not found in public.js')
}
