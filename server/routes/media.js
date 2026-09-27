import { Router } from 'express'
import { db, logActivity } from '../db.js'
import { authRequired, upload, uploadError } from '../middleware.js'
import { uploadBufferToCloudinary, cloudinary } from '../utils/cloudinary.js'

const router = Router()
router.use(authRequired)

router.get('/', (req, res) => {
  const { q = '', category = '' } = req.query
  let sql = 'SELECT * FROM media WHERE 1=1'
  const params = []
  if (q) { sql += ' AND (filename LIKE ? OR title LIKE ?)'; params.push(`%${q}%`, `%${q}%`) }
  if (category) { sql += ' AND category = ?'; params.push(category) }
  sql += ' ORDER BY id DESC'
  res.json({ media: db.prepare(sql).all(...params) })
})

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const category = req.body.category || 'general'
    const title = req.body.title || req.file.originalname

    const isVideo = req.file.mimetype.startsWith('video/')
    const cloudRes = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'alpine_explorers',
      resource_type: isVideo ? 'video' : 'image',
    })

    const url = cloudRes.secure_url
    const filename = cloudRes.public_id || req.file.originalname
    const size = cloudRes.bytes || req.file.size
    const type = req.file.mimetype

    const info = db.prepare(
      'INSERT INTO media (filename, url, category, title, size, type) VALUES (?,?,?,?,?,?)'
    ).run(filename, url, category, title, size, type)

    logActivity({
      user_name: req.user?.username || req.user?.email || 'admin',
      action: isVideo ? 'Video uploaded to Cloudinary' : 'Image uploaded to Cloudinary',
      module: 'Media',
      details: title,
    })

    const item = db.prepare('SELECT * FROM media WHERE id = ?').get(info.lastInsertRowid)
    res.status(201).json({ media: item })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ error: 'Cloudinary upload failed: ' + (err.message || 'Unknown error') })
  }
})

// Multiple files upload for tour galleries
router.post('/multiple', upload.array('files', 15), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' })
  try {
    const category = req.body.category || 'tours'
    const uploadedMedia = []

    for (const file of req.files) {
      const isVideo = file.mimetype.startsWith('video/')
      const cloudRes = await uploadBufferToCloudinary(file.buffer, {
        folder: 'alpine_explorers',
        resource_type: isVideo ? 'video' : 'image',
      })

      const url = cloudRes.secure_url
      const filename = cloudRes.public_id || file.originalname
      const size = cloudRes.bytes || file.size
      const type = file.mimetype
      const title = file.originalname

      const info = db.prepare(
        'INSERT INTO media (filename, url, category, title, size, type) VALUES (?,?,?,?,?,?)'
      ).run(filename, url, category, title, size, type)

      const item = db.prepare('SELECT * FROM media WHERE id = ?').get(info.lastInsertRowid)
      uploadedMedia.push(item)
    }

    logActivity({
      user_name: req.user?.username || req.user?.email || 'admin',
      action: `${uploadedMedia.length} files uploaded to Cloudinary`,
      module: 'Media',
      details: `Batch upload`,
    })

    res.status(201).json({ media: uploadedMedia, urls: uploadedMedia.map((m) => m.url) })
  } catch (err) {
    console.error('Cloudinary batch upload error:', err)
    res.status(500).json({ error: 'Upload failed: ' + (err.message || 'Unknown error') })
  }
})

router.put('/:id', upload.single('file'), async (req, res) => {
  const existing = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  let url = existing.url
  let filename = existing.filename
  let size = existing.size
  let type = existing.type

  if (req.file) {
    try {
      const isVideo = req.file.mimetype.startsWith('video/')
      const cloudRes = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'alpine_explorers',
        resource_type: isVideo ? 'video' : 'image',
      })
      url = cloudRes.secure_url
      filename = cloudRes.public_id
      size = cloudRes.bytes || req.file.size
      type = req.file.mimetype
    } catch (err) {
      return res.status(500).json({ error: 'Failed to upload replacement to Cloudinary: ' + err.message })
    }
  }

  db.prepare('UPDATE media SET title=?, category=?, url=?, filename=?, size=?, type=? WHERE id=?')
    .run(req.body.title || existing.title, req.body.category || existing.category, url, filename, size, type, req.params.id)

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

router.delete('/:id', async (req, res) => {
  const existing = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  // Attempt to delete from Cloudinary if it has a public_id
  if (existing.filename && existing.filename.includes('alpine_explorers/')) {
    try {
      const isVideo = (existing.type || '').startsWith('video')
      await cloudinary.uploader.destroy(existing.filename, { resource_type: isVideo ? 'video' : 'image' })
    } catch (e) {
      console.warn('Could not delete from Cloudinary:', e.message)
    }
  }

  db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id)
  logActivity({
    user_name: req.user?.username || req.user?.email || 'admin',
    action: 'Media deleted',
    module: 'Media',
    details: existing.title,
  })
  res.json({ message: 'Deleted' })
})

export const mediaConfig = { router, upload, uploadError }
export default router