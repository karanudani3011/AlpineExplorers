import fs from 'node:fs'
import { getSupabaseAdmin } from '../utils/supabase.js'

const sb = getSupabaseAdmin()

// 1. Fetch existing Supabase tours
const { data: sbTours, error } = await sb.from('tours').select('*')
if (error) {
  console.error('Error fetching Supabase tours:', error)
  process.exit(1)
}

const tourMap = new Map()

// Add existing Supabase tours
for (const t of sbTours) {
  tourMap.set(t.id, {
    id: t.id,
    slug: t.slug || t.id,
    title: t.title,
    category: t.category,
    category_name: t.category_name,
    location: t.location,
    duration: t.duration,
    images: Array.isArray(t.images) ? t.images : (t.images ? [t.images] : []),
    short_description: t.short_description,
    full_description: t.full_description,
    highlights: t.highlights || [],
    itinerary: t.itinerary || []
  })
}

// 2. Add tours from tour_seed_data.json
const seedData = JSON.parse(fs.readFileSync('server/seed-data/tour_seed_data.json', 'utf8'))
const categoryNames = {
  international: 'International Tours',
  domestic: 'Domestic Tours',
  mountain: 'Mountain Expeditions',
  adventure: 'Adventure Tours & Camps',
  family: 'Family Tours',
  solo: 'Solo Expeditions'
}

for (const t of seedData) {
  if (!tourMap.has(t.id)) {
    tourMap.set(t.id, {
      id: t.id,
      slug: t.id,
      title: t.title,
      category: t.category,
      category_name: categoryNames[t.category] || t.category,
      location: t.title,
      duration: t.duration || '5N/6D',
      images: [],
      short_description: t.description || '',
      full_description: t.description || '',
      highlights: t.highlights || [],
      itinerary: t.itinerary || []
    })
  }
}

// 3. Add Agra and Delhi
if (!tourMap.has('dom-agra-taj-mahal')) {
  tourMap.set('dom-agra-taj-mahal', {
    id: 'dom-agra-taj-mahal',
    slug: 'dom-agra-taj-mahal',
    title: 'Agra & Taj Mahal Heritage Tour',
    category: 'domestic',
    category_name: 'Domestic Tours',
    location: 'Agra & Fatehpur Sikri, Uttar Pradesh',
    duration: '2N/3D',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&h=700&fit=crop'
    ],
    short_description: 'Discover the iconic Taj Mahal, Agra Fort, and Mughal architectural marvels.',
    full_description: 'An unforgettable heritage journey into the heart of the Mughal Empire. Marvel at the sunrise over the Taj Mahal, wander through the red sandstone courtyards of Agra Fort, and visit ghost city Fatehpur Sikri.',
    highlights: ['Sunrise at the Taj Mahal', 'Agra Fort Guided Heritage Walk', 'Fatehpur Sikri Mughal Capital', 'Mehtab Bagh Sunset View', 'Petha & Mughlai Culinary Trail'],
    itinerary: []
  })
}

if (!tourMap.has('dom-delhi-heritage')) {
  tourMap.set('dom-delhi-heritage', {
    id: 'dom-delhi-heritage',
    slug: 'dom-delhi-heritage',
    title: 'Delhi Historical & Cultural Explorer',
    category: 'domestic',
    category_name: 'Domestic Tours',
    location: 'Old Delhi & New Delhi',
    duration: '3N/4D',
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=1000&h=700&fit=crop'
    ],
    short_description: 'Explore monuments, historic bazaars, and vibrant culture across Old and New Delhi.',
    full_description: 'Experience India’s historic capital where millennia of civilization converge. From the bustling lanes of Chandni Chowk and the imposing Red Fort to the serene Lotus Temple and Qutub Minar.',
    highlights: ['Red Fort & Jama Masjid', 'Chandni Chowk Rickshaw Food Trail', 'Qutub Minar & Humayun’s Tomb', 'India Gate & Rajpath Boulevard', 'Lotus Temple & Akshardham'],
    itinerary: []
  })
}

// Check images manifest for images
const manifest = JSON.parse(fs.readFileSync('src/data/tourImageManifest.json', 'utf8'))
for (const [id, t] of tourMap.entries()) {
  if (t.images.length === 0 && manifest[id]?.curatedImages?.length > 0) {
    t.images = manifest[id].curatedImages.map(img => img.imageUrl)
  }
}

const allTours = Array.from(tourMap.values())
console.log('Total Tours Count:', allTours.length)
console.log(allTours.map((t, i) => `${i + 1}. [${t.category}] ${t.id} -> ${t.title} (${t.location || ''}) [images: ${t.images.length}]`).join('\n'))

fs.writeFileSync('server/seed-data/all_unified_tours.json', JSON.stringify(allTours, null, 2))
