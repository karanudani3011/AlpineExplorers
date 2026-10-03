import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const candidates = [
  'id', 'created_at', 'updated_at', 'title', 'name', 'slug', 'description', 'short_description', 'full_description',
  'icon', 'badge', 'hero_image', 'heroImage', 'color', 'category', 'category_name', 'price', 'original_price',
  'duration', 'location', 'rating', 'reviews', 'image', 'images', 'featured_image', 'cover_image',
  'highlights', 'inclusions', 'exclusions', 'itinerary', 'author', 'content', 'tags', 'publish_date',
  'status', 'featured', 'date', 'read_time', 'readTime', 'excerpt', 'view_count', 'likes', 'order_index', 'activities',
  'summary', 'overview', 'body', 'published_at', 'category_id', 'is_featured', 'active'
]

async function inspectTable(table) {
  const found = []
  for (const col of candidates) {
    const { error } = await supabase.from(table).select(col).limit(1)
    if (!error) found.push(col)
  }
  console.log(`TABLE [${table}]:`, found)
  return found
}

async function run() {
  await inspectTable('service_categories')
  await inspectTable('tours')
  await inspectTable('blog_posts')
}

run()
