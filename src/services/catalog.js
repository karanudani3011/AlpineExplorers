import { api } from './api'

const lbl = (flag, label) => (flag ? label : null)
const parseList = (v) => {
  try {
    const arr = JSON.parse(v || '[]')
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

const dflt = { price: 0, originalPrice: 0, rating: 4.9, reviews: 0, date: new Date().toISOString().slice(0, 10) }

const fromInternational = (p) => ({
  id: `int-${p.id}`,
  title: p.destination,
  destination: p.country ? `${p.destination}, ${p.country}` : p.destination,
  image: p.image,
  description: p.full_description || p.short_description || p.destination,
  shortDescription: p.short_description || p.destination,
  price: p.price ?? dflt.price,
  originalPrice: p.original_price ?? p.price ?? 0,
  date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
  duration: p.duration,
  location: p.country || p.destination,
  category: 'International',
  serviceCategory: 'International',
  mood: 'Explore',
  destinationType: 'International',
  budgetTier: 'Luxury',
  badge: p.featured ? 'Featured' : null,
  highlights: [p.short_description, ...[lbl(p.guidance, 'Guided & Assisted')].filter(Boolean)],
  inclusions: [
    lbl(p.air_ticket, 'Air Ticket'), lbl(p.passport_visa, 'Passport & Visa'), lbl(p.pickup_drop, 'Pickup & Drop'),
    lbl(p.accommodation, 'Accommodation'), lbl(p.food, 'Food'), lbl(p.sightseeing, 'Sightseeing'), lbl(p.guidance, 'Guidance'),
  ].filter(Boolean),
  exclusions: p.air_ticket ? [] : ['International flights'],
  itinerary: [],
})

const fromDomestic = (p) => ({
  id: `dom-${p.id}`,
  title: p.destination,
  destination: p.state ? `${p.destination}, ${p.state}` : p.destination,
  image: p.image,
  description: p.full_description || p.short_description || p.destination,
  shortDescription: p.short_description || p.destination,
  price: p.price ?? dflt.price,
  originalPrice: p.original_price ?? p.price ?? 0,
  date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
  duration: p.duration,
  location: p.state || p.destination,
  category: 'Domestic',
  serviceCategory: 'Domestic',
  mood: 'Explore',
  destinationType: 'Heritage',
  budgetTier: 'Mid Range',
  badge: null,
  highlights: parseList(p.activities).length ? parseList(p.activities).slice(0, 5) : [p.short_description],
  inclusions: [
    lbl(p.transportation, 'Transportation'), lbl(p.accommodation, 'Accommodation'),
    lbl(p.food, 'Food'), lbl(p.sightseeing, 'Sightseeing'),
  ].filter(Boolean),
  exclusions: [],
  itinerary: [],
})

const fromAdventure = (p) => ({
  id: `adv-${p.id}`,
  title: p.title,
  destination: p.location,
  image: p.image,
  description: p.description || p.title,
  shortDescription: p.description || p.title,
  price: 0,
  originalPrice: 0,
  date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
  duration: p.duration,
  location: p.location,
  category: 'Adventure Tours & Camps',
  serviceCategory: 'Adventure Tours & Camps',
  mood: 'Adventure',
  destinationType: 'Mountain',
  budgetTier: 'Mid Range',
  badge: 'Adventure',
  highlights: parseList(p.includes).length ? parseList(p.includes).slice(0, 6) : parseList(p.activities).slice(0, 6),
  inclusions: parseList(p.includes),
  exclusions: [],
  itinerary: [],
})

const fromCamping = (p) => ({
  id: `camp-${p.id}`,
  title: p.title,
  destination: p.location,
  image: p.image,
  description: p.description || p.title,
  shortDescription: p.description || p.title,
  price: 0,
  originalPrice: 0,
  date: p.created_at ? p.created_at.slice(0, 10) : dflt.date,
  duration: p.duration,
  location: p.location,
  category: 'Weekend Camps',
  serviceCategory: 'Weekend Camps',
  mood: 'Adventure',
  destinationType: 'Nature',
  budgetTier: valueBudget(p),
  badge: 'Weekend',
  highlights: parseList(p.activities).slice(0, 6),
  inclusions: parseList(p.activities),
  exclusions: [],
  itinerary: [],
})

const valueBudget = (p) => (p.charges ? 'Mid Range' : 'Value')

let cache = null

async function getCatalog() {
  if (cache) return cache
  let international = [], domestic = [], adventure = [], camping = []
  try {
    const results = await Promise.all([
      api.get('/public/international'),
      api.get('/public/domestic'),
      api.get('/public/adventure'),
      api.get('/public/camping'),
    ])
    international = results[0].items || []
    domestic = results[1].items || []
    adventure = results[2].items || []
    camping = results[3].items || []
  } catch {
    // server offline — empty catalog
  }
  cache = [
    ...international.map(fromInternational),
    ...domestic.map(fromDomestic),
    ...adventure.map(fromAdventure),
    ...camping.map(fromCamping),
  ]
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
  return p && p > 0 ? `$${p}` : 'On Request'
}

export { getCatalog }
export { fromInternational, fromDomestic, fromAdventure, fromCamping }