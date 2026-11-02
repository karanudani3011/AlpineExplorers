// scripts/seedBlogs.js
// Standalone seed script to populate Supabase blog_posts table
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Simple .env parser
function loadEnv() {
  const envPath = path.join(rootDir, '.env')
  if (!fs.existsSync(envPath)) return {}
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim()
      env[key] = val
      if (!process.env[key]) process.env[key] = val
    }
  }
  return env
}

const env = loadEnv()
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qhbsilnramjkagdjitlp.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!SERVICE_KEY) {
  console.error('[Error] SUPABASE_SERVICE_ROLE_KEY missing from .env!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

// Load blogs
const blogsPath = path.join(rootDir, 'server', 'seed-data', 'generated_blogs.json')
const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'))

console.log(`[Seed] Loaded ${blogs.length} blogs to upsert into Supabase blog_posts table...`)

async function seed() {
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i]
    const { error } = await supabase.from('blog_posts').upsert({
      id: b.id,
      slug: b.slug,
      title: b.title,
      short_description: b.short_description,
      featured_image: b.featured_image,
      category: b.category,
      author: b.author,
      published_date: b.published_date,
      reading_time: b.reading_time,
      rating: b.rating,
      review_count: b.review_count,
      tags: b.tags,
      content: b.content,
      related_destinations: b.related_destinations,
      related_tours: b.related_tours,
      status: b.status,
      views: b.views,
      created_at: b.created_at,
      updated_at: b.updated_at
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`[${i + 1}/${blogs.length}] Failed to upsert ${b.slug}:`, error.message)
      errorCount++
    } else {
      console.log(`[${i + 1}/${blogs.length}] Upserted: ${b.title} (${b.slug})`)
      successCount++
    }
  }

  console.log(`\n[Seed Completed] Successfully upserted: ${successCount}, Failed: ${errorCount}`)
}

seed().catch(err => {
  console.error('[Fatal Error in Seed]', err)
  process.exit(1)
})
