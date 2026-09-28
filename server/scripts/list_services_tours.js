import { serviceTours } from '../../src/data/servicesData.js'

console.log('Tours in servicesData.js:')
for (const cat of Object.keys(serviceTours)) {
  for (const t of serviceTours[cat]) {
    console.log(`[${cat}] ID: "${t.id}" | Title: "${t.title}" | Duration: "${t.duration}" | Days in itinerary: ${t.itinerary ? t.itinerary.length : 0}`)
  }
}
