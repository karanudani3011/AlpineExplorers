import { api } from './api'
import { serviceTours } from '../data/servicesData'
import { tourImages } from '../data/tourImages'

const lbl = (flag, label) => (flag ? label : null)
const parseList = (v) => {
  try {
    const arr = JSON.parse(v || '[]')
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

const dflt = { price: 0, originalPrice: 0, rating: 4.9, reviews: 142, date: new Date().toISOString().slice(0, 10) }

function inferMoodAndType(title = '', destination = '', category = '', price = 0) {
  const text = `${title} ${destination} ${category}`.toLowerCase()

  // Destination Type
  let destinationType = 'Nature'
  if (text.includes('beach') || text.includes('goa') || text.includes('bali') || text.includes('andaman') || text.includes('maldives') || text.includes('krabi') || text.includes('phuket') || text.includes('island') || text.includes('marine') || text.includes('lakshadweep') || text.includes('odyssey')) {
    destinationType = 'Beach'
  } else if (text.includes('mountain') || text.includes('biking') || text.includes('leh') || text.includes('ladakh') || text.includes('himalaya') || text.includes('trek') || text.includes('kashmir') || text.includes('spiti') || text.includes('manali') || text.includes('sikkim') || text.includes('bhutan') || text.includes('brahmatal') || text.includes('kedarkantha') || text.includes('chopta') || text.includes('alps') || text.includes('rockies')) {
    destinationType = 'Mountain'
  } else if (text.includes('fort') || text.includes('palace') || text.includes('rajasthan') || text.includes('jaipur') || text.includes('udaipur') || text.includes('jaisalmer') || text.includes('heritage') || text.includes('dubai') || text.includes('vietnam') || text.includes('baku') || text.includes('temple') || text.includes('thailand') || text.includes('bangkok') || text.includes('singapore') || text.includes('europe') || text.includes('paris')) {
    destinationType = 'Heritage'
  }

  // Mood
  let mood = 'Explore'
  if (text.includes('biking') || text.includes('motorcycle') || text.includes('rally') || text.includes('solo') || text.includes('backpacking') || text.includes('circuit')) {
    mood = 'Solo Travelers'
  } else if (text.includes('trek') || text.includes('adventure') || text.includes('rafting') || text.includes('climbing') || text.includes('expedition') || text.includes('lion') || text.includes('wildlife') || text.includes('snow')) {
    mood = 'Adventure'
  } else if (text.includes('honeymoon') || text.includes('romantic') || text.includes('maldives') || text.includes('paris') || text.includes('cruise') || text.includes('kashmir')) {
    mood = 'Romantic'
  } else if (text.includes('relax') || text.includes('beach') || text.includes('spa') || text.includes('goa') || text.includes('bali') || text.includes('kerala') || text.includes('saputara') || text.includes('family camping') || text.includes('andaman')) {
    mood = 'Relax'
  }

  // Budget Tier
  let budgetTier = 'Mid Range'
  const p = Number(price) || 0
  if (p >= 50000 || text.includes('dubai') || text.includes('maldives') || text.includes('europe') || text.includes('bali') || text.includes('bhutan') || text.includes('singapore')) {
    budgetTier = 'Luxury'
  } else if ((p > 0 && p <= 25000) || text.includes('trek') || text.includes('camp') || text.includes('goa') || text.includes('saputara') || text.includes('jaisalmer')) {
    budgetTier = 'Budget'
  }

  return { mood, destinationType, budgetTier }
}

const extractImages = (p, fallbackId) => {
  const gallery = Array.isArray(p.gallery) ? p.gallery : parseList(p.gallery)
  const list = [p.image, ...gallery].filter(Boolean)
  if (list.length > 0 && !list[0].includes('photo-1547203664') && !list[0].includes('photo-1587645585583') && !list[0].includes('photo-1589227365533')) {
    return list
  }
  return tourImages[fallbackId] || (p.image ? [p.image] : ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop'])
}

const fromInternational = (p) => {
  const id = `int-${p.id}`
  const images = extractImages(p, id)
  const meta = inferMoodAndType(p.destination, p.country, 'International', p.price)
  return {
    id,
    title: p.destination,
    destination: p.country ? `${p.destination}, ${p.country}` : p.destination,
    image: images[0],
    images,
    gallery: Array.isArray(p.gallery) ? p.gallery : parseList(p.gallery),
    description: p.full_description || p.short_description || p.destination,
    shortDescription: p.short_description || p.destination,
    price: p.price ?? dflt.price,
    originalPrice: p.original_price ?? p.price ?? 0,
    date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
    duration: p.duration,
    location: p.country || p.destination,
    category: 'International',
    serviceCategory: 'International',
    mood: meta.mood,
    destinationType: meta.destinationType,
    budgetTier: meta.budgetTier,
    rating: 4.9,
    reviews: 180 + (p.id * 17) % 150,
    badge: p.featured ? 'Featured' : null,
    highlights: [p.short_description, ...[lbl(p.guidance, 'Guided & Assisted')].filter(Boolean)],
    inclusions: [
      lbl(p.air_ticket, 'Air Ticket'), lbl(p.passport_visa, 'Passport & Visa'), lbl(p.pickup_drop, 'Pickup & Drop'),
      lbl(p.accommodation, 'Accommodation'), lbl(p.food, 'Food'), lbl(p.sightseeing, 'Sightseeing'), lbl(p.guidance, 'Guidance'),
    ].filter(Boolean),
    exclusions: p.air_ticket ? [] : ['International flights'],
    itinerary: [],
  }
}

const fromDomestic = (p) => {
  const id = `dom-${p.id}`
  const images = extractImages(p, id)
  const meta = inferMoodAndType(p.destination, p.state, 'Domestic', p.price)
  return {
    id,
    title: p.destination,
    destination: p.state ? `${p.destination}, ${p.state}` : p.destination,
    image: images[0],
    images,
    gallery: Array.isArray(p.gallery) ? p.gallery : parseList(p.gallery),
    description: p.full_description || p.short_description || p.destination,
    shortDescription: p.short_description || p.destination,
    price: p.price ?? dflt.price,
    originalPrice: p.original_price ?? p.price ?? 0,
    date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
    duration: p.duration,
    location: p.state || p.destination,
    category: 'Domestic',
    serviceCategory: 'Domestic',
    mood: meta.mood,
    destinationType: meta.destinationType,
    budgetTier: meta.budgetTier,
    rating: 4.9,
    reviews: 160 + (p.id * 23) % 120,
    badge: null,
    highlights: parseList(p.activities).length ? parseList(p.activities).slice(0, 5) : [p.short_description],
    inclusions: [
      lbl(p.transportation, 'Transportation'), lbl(p.accommodation, 'Accommodation'),
      lbl(p.food, 'Food'), lbl(p.sightseeing, 'Sightseeing'),
    ].filter(Boolean),
    exclusions: [],
    itinerary: [],
  }
}

const fromAdventure = (p) => {
  const id = `adv-${p.id}`
  const images = extractImages(p, id)
  const meta = inferMoodAndType(p.title, p.location, p.category || 'Adventure', p.price || 18000)
  return {
    id,
    title: p.title,
    destination: p.location,
    image: images[0],
    images,
    gallery: Array.isArray(p.gallery) ? p.gallery : parseList(p.gallery),
    description: p.description || p.title,
    shortDescription: p.description || p.title,
    price: p.price || 18500,
    originalPrice: 24000,
    date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
    duration: p.duration,
    location: p.location,
    category: 'Adventure Tours & Camps',
    serviceCategory: 'Adventure Tours & Camps',
    mood: meta.mood,
    destinationType: meta.destinationType,
    budgetTier: meta.budgetTier,
    rating: 5.0,
    reviews: 210 + (p.id * 19) % 100,
    badge: 'Adventure',
    highlights: parseList(p.includes).length ? parseList(p.includes).slice(0, 6) : parseList(p.activities).slice(0, 6),
    inclusions: parseList(p.includes),
    exclusions: [],
    itinerary: [],
  }
}

const fromCamping = (p) => {
  const id = `camp-${p.id}`
  const images = extractImages(p, id)
  const meta = inferMoodAndType(p.title, p.location, 'Camping', 12000)
  return {
    id,
    title: p.title,
    destination: p.location,
    image: images[0],
    images,
    gallery: Array.isArray(p.gallery) ? p.gallery : parseList(p.gallery),
    description: p.description || p.title,
    shortDescription: p.description || p.title,
    price: 12500,
    originalPrice: 16000,
    date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
    duration: p.duration,
    location: p.location,
    category: 'Weekend Camps',
    serviceCategory: 'Weekend Camps',
    mood: meta.mood,
    destinationType: meta.destinationType,
    budgetTier: meta.budgetTier,
    rating: 4.8,
    reviews: 130 + (p.id * 11) % 90,
  }
}

// Convert all curated serviceTours to catalog items with verified real photos
function getCuratedServiceTours() {
  const list = []
  for (const cat of Object.keys(serviceTours)) {
    for (const item of serviceTours[cat]) {
      const meta = inferMoodAndType(item.title, item.location, item.category || cat, item.price)
      list.push({
        ...item,
        serviceCategory: item.category || cat,
        mood: item.mood || meta.mood,
        destinationType: item.destinationType || meta.destinationType,
        budgetTier: item.budgetTier || meta.budgetTier,
        rating: item.rating || 4.9,
        reviews: item.reviews || 150,
      })
    }
  }
  return list
}

let cache = null

async function getCatalog() {
  if (cache) return cache
  let international = [], domestic = [], adventure = [], camping = []
  try {
    const results = await Promise.all([
      api.get('/public/international').catch(() => ({ items: [] })),
      api.get('/public/domestic').catch(() => ({ items: [] })),
      api.get('/public/adventure').catch(() => ({ items: [] })),
      api.get('/public/camping').catch(() => ({ items: [] })),
    ])
    international = results[0]?.items || []
    domestic = results[1]?.items || []
    adventure = results[2]?.items || []
    camping = results[3]?.items || []
  } catch {
    // server offline
  }

  const dbItems = [
    ...international.map(fromInternational),
    ...domestic.map(fromDomestic),
    ...adventure.map(fromAdventure),
    ...camping.map(fromCamping),
  ]

  const curated = getCuratedServiceTours()
  
  // Merge: start with curated rich tours, then add any DB items that aren't duplicate titles
  const seenTitles = new Set(curated.map((c) => c.title.toLowerCase().trim()))
  const additionalDb = dbItems.filter((d) => !seenTitles.has(d.title.toLowerCase().trim()))

  cache = [...curated, ...additionalDb]
  return cache
}

export function findTourById(id) {
  const key = String(id)
  return (cache || []).find((t) => t.id === key)
}

export async function getTour(id) {
  if (cache) return findTourById(id)
  await getCatalog()
  return findTourById(id)
}

export function formatPrice(p) {
  return p && p > 0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p) : 'On Request'
}

export { getCatalog }
export { fromInternational, fromDomestic, fromAdventure, fromCamping }