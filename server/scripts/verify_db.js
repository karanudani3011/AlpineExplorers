import { db } from '../db.js'

console.log('=== VERIFYING DURATION PACKAGES & ITINERARIES ===')
const pkgs = db.prepare(`
  SELECT p.id, p.tour_type, p.tour_id, p.tour_slug, p.duration, p.days, p.nights,
         COUNT(i.id) as itinerary_days_count
  FROM tour_duration_packages p
  LEFT JOIN tour_itineraries i ON i.package_id = p.id
  GROUP BY p.id
  ORDER BY p.tour_slug, p.days
`).all()

console.table(pkgs)

const mismatches = pkgs.filter(p => p.days !== p.itinerary_days_count)
if (mismatches.length > 0) {
  console.error('MISMATCHES FOUND:', mismatches)
} else {
  console.log('ALL PACKAGES HAVE EXACT MATCHING DAYS COUNT!')
}
