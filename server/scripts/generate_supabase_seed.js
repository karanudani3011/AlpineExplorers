import fs from 'node:fs'
import path from 'node:path'
import { serviceCategories, serviceTours } from '../../src/data/servicesData.js'
import { blogs as dataBlogs } from '../../src/data/data.js'
import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync('server/data/alpine.db')

function escapeSqlString(str) {
  if (str === null || str === undefined) return "''"
  return `'${String(str).replace(/'/g, "''")}'`
}

function escapeSqlNumber(num, fallback = 0) {
  if (num === null || num === undefined || isNaN(num)) return fallback
  return num
}

function formatTextArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 'ARRAY[]::text[]'
  return `ARRAY[${arr.map(item => `'${String(item).replace(/'/g, "''")}'`).join(', ')}]::text[]`
}

function formatJsonValue(val) {
  if (val === null || val === undefined) return "'[]'"
  return `'${JSON.stringify(val).replace(/'/g, "''")}'`
}

const CATEGORY_ICONS = {
  international: 'Globe',
  domestic: 'Map',
  mountain: 'Mountain',
  adventure: 'Tent',
  family: 'Users',
  solo: 'Backpack'
}

let sql = `-- ==============================================================================
-- ALPINE EXPLORERS — SUPABASE SEED DATA (Service Categories, Tours & Blog Posts)
-- ==============================================================================
-- Instructions:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qhbsilnramjkagdjitlp
-- 2. Click "SQL Editor" on the left sidebar.
-- 3. Click "New query" (+ button).
-- 4. Paste this entire file and click "Run".
-- ==============================================================================

-- Enable RLS & Public Read Access Policies
ALTER TABLE IF EXISTS public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'service_categories' AND policyname = 'Allow public read access on service_categories'
  ) THEN
    CREATE POLICY "Allow public read access on service_categories" ON public.service_categories FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tours' AND policyname = 'Allow public read access on tours'
  ) THEN
    CREATE POLICY "Allow public read access on tours" ON public.tours FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow public read access on blog_posts'
  ) THEN
    CREATE POLICY "Allow public read access on blog_posts" ON public.blog_posts FOR SELECT USING (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 1. SEED SERVICE CATEGORIES
-- ------------------------------------------------------------------------------
`

let orderIdx = 1
for (const cat of serviceCategories) {
  const catKey = cat.id || cat.slug
  const icon = CATEGORY_ICONS[catKey] || 'Compass'
  sql += `
INSERT INTO public.service_categories (id, title, icon, description, badge, display_order)
VALUES (${escapeSqlString(catKey)}, ${escapeSqlString(cat.name || cat.title)}, ${escapeSqlString(icon)}, ${escapeSqlString(cat.description || cat.tagline)}, ${escapeSqlString(cat.shortName || cat.name)}, ${orderIdx++})
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order;
`
}

sql += `\n-- ------------------------------------------------------------------------------
-- 2. SEED TOURS
-- ------------------------------------------------------------------------------
`

for (const [catKey, tours] of Object.entries(serviceTours)) {
  const catObj = serviceCategories.find(c => c.id === catKey || c.slug === catKey)
  const catName = catObj ? catObj.name : catKey

  for (const tour of tours) {
    const tourId = String(tour.id || tour.slug)
    const slug = tour.slug || tour.id
    const title = tour.title || tour.name
    const shortDesc = tour.shortDescription || tour.description
    const fullDesc = tour.description || tour.shortDescription
    const rawPrice = tour.price || 0
    const priceStr = rawPrice > 0 ? `₹${Number(rawPrice).toLocaleString('en-IN')}` : 'On Request'
    const priceNum = Number(rawPrice) || 0
    const duration = tour.duration || '5N/6D'
    const dates = tour.date || 'Multiple Departures Available'
    const location = tour.location || ''
    const rating = tour.rating || 4.8
    const reviewsCount = tour.reviews || 128
    const images = Array.isArray(tour.images) ? tour.images : (tour.image ? [tour.image] : [])
    const highlights = Array.isArray(tour.highlights) ? tour.highlights : []
    const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : []
    const transportation = 'Included'
    const accommodation = 'Included'
    const status = 'active'

    sql += `
INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  ${escapeSqlString(tourId)},
  ${escapeSqlString(slug)},
  ${escapeSqlString(catKey)},
  ${escapeSqlString(catName)},
  ${escapeSqlString(title)},
  ${escapeSqlString(location)},
  ${escapeSqlString(priceStr)},
  ${escapeSqlNumber(priceNum, 0)},
  ${escapeSqlString(duration)},
  ${escapeSqlString(dates)},
  ${escapeSqlNumber(rating, 4.8)},
  ${escapeSqlNumber(reviewsCount, 100)},
  ${formatTextArray(images)},
  ${escapeSqlString(shortDesc)},
  ${escapeSqlString(fullDesc)},
  ${formatTextArray(highlights)},
  ${formatJsonValue(itinerary)},
  ${escapeSqlString(transportation)},
  ${escapeSqlString(accommodation)},
  ${escapeSqlString(status)}
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;
`
  }
}

sql += `\n-- ------------------------------------------------------------------------------
-- 3. SEED BLOG POSTS
-- ------------------------------------------------------------------------------
`

// Combine blogs from SQLite and data.js
let allBlogs = []
try {
  const dbBlogs = db.prepare("SELECT * FROM blogs").all()
  for (const b of dbBlogs) {
    allBlogs.push({
      id: String(b.id),
      slug: b.slug || `blog-${b.id}`,
      title: b.title,
      short_description: b.short_description || (b.content ? b.content.slice(0, 120) + '...' : ''),
      category: b.category || 'Travel',
      rating: 5.0,
      featured_image: b.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
      author: b.author || 'Alpine Explorers',
      content: b.content || '',
      tags: typeof b.tags === 'string' ? (b.tags.startsWith('[') ? JSON.parse(b.tags) : b.tags.split(',').map(t => t.trim())) : ['Travel', 'Alpine'],
      status: b.status || 'published',
      views: 240
    })
  }
} catch (e) {
  console.log('No SQLite blogs table or error:', e.message)
}

if (allBlogs.length === 0 && dataBlogs) {
  for (const b of dataBlogs) {
    allBlogs.push({
      id: String(b.id),
      slug: b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: b.title,
      short_description: b.excerpt || '',
      category: b.category || 'Destinations',
      rating: 4.9,
      featured_image: b.image || '',
      author: b.author || 'Alpine Explorers',
      content: b.content || '',
      tags: [b.category || 'Travel'],
      status: 'published',
      views: 180
    })
  }
}

for (const b of allBlogs) {
  sql += `
INSERT INTO public.blog_posts (
  id, slug, title, category, rating, featured_image, short_description, author, content, tags, status, views
)
VALUES (
  ${escapeSqlString(b.id)},
  ${escapeSqlString(b.slug)},
  ${escapeSqlString(b.title)},
  ${escapeSqlString(b.category)},
  ${escapeSqlNumber(b.rating, 5.0)},
  ${escapeSqlString(b.featured_image)},
  ${escapeSqlString(b.short_description)},
  ${escapeSqlString(b.author)},
  ${escapeSqlString(b.content)},
  ${formatTextArray(b.tags || [])},
  ${escapeSqlString(b.status || 'published')},
  ${escapeSqlNumber(b.views, 150)}
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  featured_image = EXCLUDED.featured_image,
  short_description = EXCLUDED.short_description,
  author = EXCLUDED.author,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  views = EXCLUDED.views;
`
}

fs.writeFileSync('supabase_seed_data.sql', sql, 'utf8')
fs.writeFileSync('supabase/migrations/20261003_seed_categories_tours_blogs.sql', sql, 'utf8')
console.log('Generated supabase_seed_data.sql successfully!')
