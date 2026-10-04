import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import publicRouter from './routes/public.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import staffRouter from './routes/staff.js'
import blogsRouter from './routes/blogs.js'
import mediaRouter from './routes/media.js'
import inquiriesRouter from './routes/inquiries.js'
import applicationsRouter from './routes/applications.js'
import bookingsRouter from './routes/bookings.js'
import paymentsRouter from './routes/payments.js'
import siteRouter from './routes/site.js'
import { crudAdminRouter, CONTENT_CONFIGS } from './routes/content.js'
import toursRouter from './routes/tours.js'
import { uploadError } from './middleware.js'
import { runSeed } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 5000
const uploadsDir = path.join(__dirname, '..', 'uploads')
const distDir = path.join(__dirname, '..', 'dist')

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : '*'

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
app.use(express.json({ limit: '5mb' }))

/* Uploads */
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

const HOST = process.env.HOST || 'http://localhost'
const API = `${HOST}:${PORT}`

app.get('/api/health', (req, res) => res.json({ ok: true, message: 'Alpine Explorers API is running' }))
app.get('/api/seed', (req, res) => {
  try {
    const seededNow = runSeed()
    res.json({ ok: true, seeded: seededNow, message: seededNow ? 'Database seeded successfully' : 'Database already seeded' })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

/* Public routes */
app.use('/api/public', publicRouter)

/* Auth */
app.use('/api/auth', authRouter)

/* Admin CRUD for content */
app.use('/api/international', crudAdminRouter(CONTENT_CONFIGS.international))
app.use('/api/domestic', crudAdminRouter(CONTENT_CONFIGS.domestic))
app.use('/api/adventure', crudAdminRouter(CONTENT_CONFIGS.adventure))
app.use('/api/camps', crudAdminRouter(CONTENT_CONFIGS.camping))
app.use('/api/services', crudAdminRouter(CONTENT_CONFIGS.services))
app.use('/api/events', crudAdminRouter(CONTENT_CONFIGS.events))
app.use('/api/users', usersRouter)
app.use('/api/staff', staffRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/media', mediaRouter)
app.use('/api/inquiries', inquiriesRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api', toursRouter)
app.use('/api', siteRouter)

app.use('/api', uploadError)

/* Serve built frontend in production */
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  try {
    runSeed()
  } catch (e) {
    console.error('Auto seed error:', e.message)
  }
  console.log(`\n  Alpine Explorers API running at ${API}`)
  console.log(`  Admin login -> ${API}/admin/login`)
  console.log(`  Uploads     -> ${API}/uploads\n`)
})