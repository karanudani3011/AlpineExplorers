import fs from 'node:fs'
import path from 'node:path'

// Read unified tours
const tours = JSON.parse(fs.readFileSync('server/seed-data/all_unified_tours.json', 'utf8'))

const imageFallbacks = {
  'int-nepal-grand-explorer': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop',
  'dom-ayodhya-varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=800&fit=crop',
  'dom-char-dham-yatra': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop',
  'dom-kerala-highlights': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop',
  'dom-dalhousie-amritsar': 'https://images.unsplash.com/photo-1588096344356-9a5725f77864?w=1200&h=800&fit=crop',
  'dom-udaipur-chittorgarh': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop',
  'dom-odisha-cultural-explorer': 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1200&h=800&fit=crop',
  'adv-dalhousie': 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200&h=800&fit=crop',
  'adv-mussoorie': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&h=800&fit=crop',
  'adv-manali-camp': 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=1200&h=800&fit=crop'
}

// Category mapper
function mapCategory(tour) {
  const cat = (tour.category || '').toLowerCase()
  const id = tour.id.toLowerCase()
  const title = (tour.title || '').toLowerCase()

  if (id.includes('ayodhya') || id.includes('char-dham') || title.includes('dham') || title.includes('spiritual')) {
    return 'Pilgrimage'
  }
  if (id.includes('agra') || id.includes('delhi') || id.includes('rajasthan') || id.includes('udaipur') || id.includes('odisha') || id.includes('heritage')) {
    return 'Heritage'
  }
  if (id.includes('goa') || id.includes('andaman') || id.includes('lakshadweep') || id.includes('maldives') || id.includes('bali') || id.includes('phuket')) {
    return 'Beaches'
  }
  if (cat === 'mountain' || id.includes('leh') || id.includes('spiti') || id.includes('mountaineering')) {
    return 'Mountain Expeditions'
  }
  if (cat === 'adventure' || id.includes('trek') || id.includes('camp') || id.includes('kedarkantha') || id.includes('brahmatal') || id.includes('chopta')) {
    return 'Adventure & Treks'
  }
  if (cat === 'family' || id.includes('gir')) {
    return 'Family & Wildlife'
  }
  if (cat === 'solo') {
    return 'Solo Journeys'
  }
  if (cat === 'international') {
    return 'International'
  }
  return 'Domestic Wonders'
}

// Staggered dates helper
function getStaggeredDate(index, total) {
  // Between 2025-10-15 and 2026-10-28
  const start = new Date(2025, 9, 15).getTime()
  const end = new Date(2026, 9, 28).getTime()
  const step = (end - start) / total
  const d = new Date(start + step * index)
  return d.toISOString().split('T')[0]
}

// Generate unique clean slug
function getBlogSlug(tour) {
  // Use tour.id directly to guarantee 100% uniqueness across all 49 tours
  return `${tour.id}-travel-guide`.toLowerCase()
}

// Destination metadata dictionary for authentic regional depth
const destinationMeta = {
  'dom-agra-taj-mahal': {
    region: 'Uttar Pradesh, India',
    bestTime: 'October to March when mornings are cool and misty, ideal for sunrise photography at the Taj Mahal.',
    places: ['Taj Mahal at sunrise (UNESCO World Heritage Site)', 'Agra Fort and the Jahangiri Mahal overlooking the Yamuna', 'Fatehpur Sikri, the preserved red sandstone capital of Akbar', 'Mehtab Bagh sunset viewpoint across the river', 'Itmad-ud-Daulah (Baby Taj) marble inlay masterpiece'],
    howToReach: 'Agra is connected via the Yamuna Expressway (3 hours from Delhi) and high-speed Gatimaan & Vande Bharat express trains from Hazrat Nizamuddin Station to Agra Cantt.',
    food: 'World-famous Agra Petha (Petha Gilori, Kesar Angoori), Mughlai spiced kebabs, Bedmi Puri with spicy aloo sabzi, and creamy Jalebi rabri.',
    tips: ['Book your Taj Mahal entry tickets online in advance to bypass morning security queues.', 'The Taj Mahal remains closed for tourists on Fridays.', 'Wear shoe covers or remove footwear on the main marble mausoleum terrace.', 'Hire an Alpine Explorers accredited government historian guide for true Mughal anecdotes.'],
  },
  'dom-delhi-heritage': {
    region: 'National Capital Territory, India',
    bestTime: 'October through March offers pleasant daytime weather for heritage walks, monuments, and open bazaars.',
    places: ['Red Fort (Lal Qila) & Diwan-i-Khas', 'Qutub Minar complex & ancient 4th-century iron pillar', 'Humayun’s Tomb — the Persian-style architectural precursor to the Taj Mahal', 'Chandni Chowk, Jama Masjid & Khari Baoli spice bazaar', 'India Gate, Kartavya Path & Rashtrapati Bhavan'],
    howToReach: 'Indira Gandhi International Airport (DEL) connects globally; New Delhi (NDLS) and Hazrat Nizamuddin railway junctions connect every Indian state.',
    food: 'Chandni Chowk parathas at Paranthe Wali Gali, succulent butter chicken at Daryaganj, Chhole Bhature, Natraj Dahi Bhalle, and hot jalebis.',
    tips: ['Use the Delhi Metro Yellow and Violet lines for fast, air-conditioned transit across congested Old Delhi heritage hubs.', 'Keep your knees and shoulders covered when visiting Jama Masjid, Gurudwara Bangla Sahib, and Nizamuddin Dargah.', 'Early morning hours (7:30 AM to 10:00 AM) offer the best lighting and calmest crowds at Humayun’s Tomb.'],
  },
  'dom-ayodhya-varanasi': {
    region: 'Uttar Pradesh, India',
    bestTime: 'October to March offers cool river breezes, pleasant walking temperatures, and festival celebrations like Dev Deepawali.',
    places: ['Shri Ram Janmabhoomi Mandir & Kanak Bhavan in Ayodhya', 'Sarayu River Ghats & evening Ram Ki Paidi Maha Aarti', 'Kashi Vishwanath Temple corridor in Varanasi', 'Dashashwamedh Ghat Ganga Aarti at sunset', 'Sarnath Buddhist Deer Park & Dhamek Stupa'],
    howToReach: 'Ayodhya Dham Airport (AYJ) and Varanasi Lal Bahadur Shastri Airport (VNS) receive flights from major metros; Vande Bharat trains run between Delhi, Ayodhya, and Varanasi.',
    food: 'Ayodhya Peda, Banarasi Paan, Malaiyyo (winter froth sweet), Kachori Jalebi breakfast, and Tamatar Chaat at Kashi ghats.',
    tips: ['Book VIP darshan and Mangala Aarti slots early via the official temple trust portals.', 'Take a dawn rowboat along the Varanasi ghats from Assi to Manikarnika for an unforgettable spiritual vista.', 'Dress conservatively and observe temple photography regulations.'],
  },
  'dom-char-dham-yatra': {
    region: 'Garhwal Himalayas, Uttarakhand, India',
    bestTime: 'May to June (early summer) and September to October (crisp post-monsoon skies before winter snow closures).',
    places: ['Yamunotri temple and Surya Kund hot springs', 'Gangotri shrine on the banks of holy Bhagirathi', 'Kedarnath Jyotirlinga surrounded by snow-draped Kedar dome', 'Badrinath Dham on the banks of Alaknanda', 'Joshimath and Mana (the last Indian border village)'],
    howToReach: 'Fly to Jolly Grant Airport (Dehradun) or take train to Rishikesh / Haridwar; scenic mountain highways and helicopter shuttles from Phata/Guptkashi.',
    food: 'Simple, nourishing sattvic Garhwali meals — Mandua ki Roti, Chainsoo, Gahat dal, hot ginger chai, and fresh mountain apples.',
    tips: ['Compulsory biometric yatra registration must be completed before travel.', 'Carry layered woollens, thermal inners, sturdy waterproof trekking shoes, and a rain poncho.', 'Acclimatize properly at Guptkashi or Rudraprayag before ascending to Kedarnath (3,584m).'],
  },
}

// Build 49 blogs
const generatedBlogs = []

for (let idx = 0; idx < tours.length; idx++) {
  const tour = tours[idx]
  const blogId = `blog-${tour.id}`
  const slug = getBlogSlug(tour)
  const category = mapCategory(tour)
  const publishedDate = getStaggeredDate(idx, tours.length)
  const rating = Number((4.7 + ((idx * 7) % 30) / 100).toFixed(1))
  const reviewCount = 20 + ((idx * 13) % 60)
  const views = 280 + ((idx * 79) % 1150)
  const readingTime = `${6 + (idx % 4)} min read`
  const author = idx % 3 === 0 ? 'Amit Lakhani' : 'Alpine Explorers Editorial Team'

  // Image resolution
  let featuredImage = (tour.images && tour.images[0]) || imageFallbacks[tour.id] || null

  // Ensure title is SEO friendly
  let blogTitle = `${tour.title}: Complete Travel Guide & Curated Itinerary`
  if (tour.title.toLowerCase().includes('tour') || tour.title.toLowerCase().includes('guide') || tour.title.toLowerCase().includes('expedition')) {
    blogTitle = `${tour.title}: Comprehensive Travel Guide & Itinerary`
  }

  // Short description (120-160 chars)
  let shortDesc = tour.short_description || `Discover the ultimate travel guide for ${tour.title} with Alpine Explorers. Itinerary, highlights, best season, local tips and bookings.`
  if (shortDesc.length > 155) {
    shortDesc = shortDesc.slice(0, 152).trim() + '...'
  }

  // Tags
  const destName = tour.location ? tour.location.split(',')[0].trim() : tour.title.split(' ')[0]
  const tags = Array.from(new Set([
    destName,
    category,
    'Travel Guide',
    tour.category ? tour.category.toUpperCase() : 'EXPEDITION',
    'Alpine Explorers'
  ])).slice(0, 5)

  // Related destinations & tours
  const relatedDestinations = tour.location
    ? tour.location.split(/[–—,&]/).map(s => s.trim()).filter(Boolean).slice(0, 4)
    : [destName]
  const relatedTours = [tour.id]

  // Synthesize custom rich content (800-1000 words) matching the 7 headers
  const meta = destinationMeta[tour.id] || {}
  const bestTimeText = meta.bestTime || `The prime season to experience ${tour.title} spans from ${tour.category === 'mountain' ? 'June to September for high alpine trails, or December to February for thrilling snowscapes' : 'October to April when weather conditions are most comfortable for sightseeing, photography, and cultural explorations'}. During this window, travelers benefit from clear ambient skies, optimal road connectivity, and vibrant local festivities.`
  
  const placesList = (meta.places || (tour.highlights && tour.highlights.length ? tour.highlights : [
    `${destName} Iconic City Center and Cultural District`,
    `Panoramic viewpoint overlooking scenic valleys and horizons`,
    `Ancient heritage monuments and regional architectural landmarks`,
    `Vibrant local markets and artisan craft bazaars`,
    `Protected conservation landscapes and nature preserves`
  ])).map(p => `- **${p.split('(')[0].trim()}**: ${p.includes('(') ? p : 'An essential stop featuring captivating photography perspectives, authentic local charm, and historic depth.'}`).join('\n')

  const howToReachText = meta.howToReach || `Reaching ${tour.location || tour.title} is convenient through major transit junctions. The nearest international or domestic airport operates daily flights connecting Mumbai, Delhi, Ahmedabad, and Rajkot. From the transit hub, Alpine Explorers coordinates private chauffeured AC transports and scenic transfers directly to your hotel or expedition base camp.`

  const foodText = meta.food || `Immerse your senses in regional culinary traditions. Delight in authentic signature dishes, locally grown spices, fragrant herbal teas, and regional sweets prepared fresh by family-run heritage eateries. Alpine Explorers also ensures clean, hygienic dining with dedicated vegetarian and Jain meal arrangements upon request.`

  const tipsList = (meta.tips || [
    `Carry valid government identification (Aadhaar / Passport) and required permit photocopies at all times.`,
    `Pack appropriate clothing: lightweight breathable cottons for daytime exploration and thermal outerwear for chilly mountain evenings.`,
    `Keep a compact first-aid kit, personal hydration bottle, and eco-friendly essentials to minimize single-use plastics.`,
    `Reserve popular monuments and experiences through Alpine Explorers to bypass lengthy ticketing queues.`,
    `Respect local cultural customs, wildlife sanctuary protocols, and photography guidelines at sacred shrines.`
  ]).map(t => `1. **${t.split(':')[0] || 'Essential Advice'}**: ${t.includes(':') ? t.split(':')[1].trim() : t}`).join('\n')

  const fullTourDesc = tour.full_description || tour.short_description || `A curated expedition offering a harmonious balance of luxury, cultural discovery, and adventurous exploration.`

  // Compose markdown content
  const content = `## Introduction
Welcome to ${tour.title}, one of the world's most captivating journeys curated meticulously by Alpine Explorers. Nestled in ${tour.location || 'a magnificent landscape'}, this destination seamlessly weaves together historic majesty, vibrant culture, and breathtaking natural vistas. Whether you are walking through ancient alleyways lined with timeless architecture, feeling the crisp mountain breeze atop panoramic viewpoints, or sharing warm conversations with local communities, every moment here creates an indelible memory.

${fullTourDesc}

At Alpine Explorers, we believe travel is not merely about reaching a destination—it is about the stories you collect along the way. Founded in 1998 in Rajkot, Gujarat, our team has curated extraordinary expeditions for over 25 years. This comprehensive travel guide details everything you need to plan an enriching and stress-free journey to ${tour.title}.

---

## Best Time to Visit
${bestTimeText}

Planning your trip according to weather patterns ensures optimal comfort, smooth road transfers, and unhindered access to outdoor activities. Shoulder seasons also offer peaceful sightseeing with lesser crowd density, making it ideal for couples, photographers, and discerning explorers who value unhurried immersion.

---

## Top Places to See
When exploring ${tour.title}, our expedition itineraries encompass both celebrated world-heritage landmarks and hand-picked hidden gems that showcase the true soul of the region:

${placesList}

Every excursion is paced thoughtfully to ensure you never feel rushed. You will have ample personal time for photography, peaceful contemplation, and authentic interactions with resident communities.

---

## How to Reach
${howToReachText}

For travelers joining from Gujarat (Rajkot, Ahmedabad, Surat, Vadodara) and across India, our logistics desk provides end-to-end flight reservations, luxury train bookings, and seamless private airport meet-and-greet services. All road journeys are conducted in sanitized, verified private vehicles driven by experienced chauffeurs trained in regional routes.

---

## Local Food & Culture
A journey is never complete without tasting the authentic culinary heritage of its people. 

${foodText}

Beyond cuisine, the local culture reflects generations of folklore, time-honored artisanal crafts, vibrant handloom textiles, and deep-rooted hospitality. When you travel with Alpine Explorers, you are invited into authentic cultural exchanges—whether that means visiting traditional artisan workshops, witnessing age-old folk dance performances, or listening to folk tales narrated under starry skies.

---

## Travel Tips
To ensure your adventure is comfortable, respectful, and safe, keep these practical travel guidelines in mind:

${tipsList}

---

## Why Book with Alpine Explorers
Since 1998, Alpine Explorers has stood as a beacon of excellence, safety, and personalized hospitality in curated travel. Headquartered at B-309, The One World, 150 Feet Ring Road, Rajkot, our legacy is built upon 20,000+ happy travelers, over 120 global destinations, and an unyielding commitment to genuine guest care.

- **Founder-Led Excellence**: Under the visionary leadership of Mr. Amit Lakhani (Director), every expedition itinerary is vetted for security, comfort, and unique experiential depth.
- **Dedicated Tour Directors**: Experienced tour managers travel with you to take care of hotel check-ins, local permits, baggage handling, and special dietary needs.
- **Customized Pacing**: We shun cookie-cutter rushed itineraries in favor of balanced schedules that allow genuine rest and rich cultural discovery.
- **Transparent & Reliable**: Clear pricing, zero hidden charges, and continuous support before, during, and after your trip.

Ready to embark on an unforgettable journey? Connect with our travel specialists today to tailor your ${tour.title} vacation to perfection.`

  generatedBlogs.push({
    id: blogId,
    slug,
    title: blogTitle,
    short_description: shortDesc,
    featured_image: featuredImage,
    category,
    author,
    published_date: publishedDate,
    reading_time: readingTime,
    rating,
    review_count: reviewCount,
    tags,
    content,
    related_destinations: relatedDestinations,
    related_tours: relatedTours,
    status: 'published',
    views,
    created_at: `${publishedDate}T10:00:00.000Z`,
    updated_at: `${publishedDate}T10:00:00.000Z`
  })
}

// Write generated blogs to server/seed-data/generated_blogs.json
fs.writeFileSync('server/seed-data/generated_blogs.json', JSON.stringify(generatedBlogs, null, 2))
console.log(`Successfully generated ${generatedBlogs.length} high-quality blog posts!`)

// Ensure scripts directory exists
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts', { recursive: true })
}

// Generate scripts/seedBlogs.js
const seedScriptContent = `// scripts/seedBlogs.js
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
  const lines = fs.readFileSync(envPath, 'utf8').split('\\n')
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

console.log(\`[Seed] Loaded \${blogs.length} blogs to upsert into Supabase blog_posts table...\`)

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
      console.error(\`[\${i + 1}/\${blogs.length}] Failed to upsert \${b.slug}:\`, error.message)
      errorCount++
    } else {
      console.log(\`[\${i + 1}/\${blogs.length}] Upserted: \${b.title} (\${b.slug})\`)
      successCount++
    }
  }

  console.log(\`\\n[Seed Completed] Successfully upserted: \${successCount}, Failed: \${errorCount}\`)
}

seed().catch(err => {
  console.error('[Fatal Error in Seed]', err)
  process.exit(1)
})
`

fs.writeFileSync('scripts/seedBlogs.js', seedScriptContent, 'utf8')
console.log('Created scripts/seedBlogs.js')

// Generate supabase/blog_seed.sql
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL'
  return "'" + String(str).replace(/'/g, "''") + "'"
}

function escapeSqlArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::text[]"
  const escapedElements = arr.map(item => '"' + String(item).replace(/"/g, '\\"') + '"')
  return "ARRAY[" + arr.map(escapeSql).join(', ') + "]::text[]"
}

let sql = `-- Alpine Explorers - Blog Posts Seed Script
-- Generated for all 49 destinations/tours
-- Compatible with Supabase SQL Editor

-- Ensure RLS policy permits public reading of published posts
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' AND policyname = 'Public read published blog posts'
  ) THEN
    CREATE POLICY "Public read published blog posts" 
    ON public.blog_posts FOR SELECT 
    USING (status = 'published');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' AND policyname = 'Admins full access blog posts'
  ) THEN
    CREATE POLICY "Admins full access blog posts" 
    ON public.blog_posts FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Upsert blog posts
`

for (const b of generatedBlogs) {
  sql += `
INSERT INTO public.blog_posts (
  id, slug, title, short_description, featured_image, category, author,
  published_date, reading_time, rating, review_count, tags, content,
  related_destinations, related_tours, status, views, created_at, updated_at
) VALUES (
  ${escapeSql(b.id)},
  ${escapeSql(b.slug)},
  ${escapeSql(b.title)},
  ${escapeSql(b.short_description)},
  ${escapeSql(b.featured_image)},
  ${escapeSql(b.category)},
  ${escapeSql(b.author)},
  ${escapeSql(b.published_date)}::date,
  ${escapeSql(b.reading_time)},
  ${b.rating},
  ${b.review_count},
  ${escapeSqlArray(b.tags)},
  ${escapeSql(b.content)},
  ${escapeSqlArray(b.related_destinations)},
  ${escapeSqlArray(b.related_tours)},
  ${escapeSql(b.status)},
  ${b.views},
  ${escapeSql(b.created_at)}::timestamptz,
  ${escapeSql(b.updated_at)}::timestamptz
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  featured_image = EXCLUDED.featured_image,
  category = EXCLUDED.category,
  author = EXCLUDED.author,
  published_date = EXCLUDED.published_date,
  reading_time = EXCLUDED.reading_time,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  tags = EXCLUDED.tags,
  content = EXCLUDED.content,
  related_destinations = EXCLUDED.related_destinations,
  related_tours = EXCLUDED.related_tours,
  status = EXCLUDED.status,
  views = EXCLUDED.views,
  updated_at = NOW();
`
}

fs.writeFileSync('supabase/blog_seed.sql', sql, 'utf8')
console.log('Created supabase/blog_seed.sql')
