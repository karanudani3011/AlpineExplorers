import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '../..')
const sourcePath = path.join(projectRoot, 'src/data/servicesData.js')
const outputPath = path.join(projectRoot, 'server/seed-data/tour_seed_data.json')
const source = fs.readFileSync(sourcePath, 'utf8')
  .replace(/^import .*;?\s*$/gm, '')
  .replace(/\bexport\s+const\s+/g, 'const ')

const context = {
  Globe: null, Map: null, Mountain: null, Tent: null, Users: null, Backpack: null,
  burjKhalifaImage: null, mountainExpeditionImage: null,
  adventureCampImage: null, familyTripImage: null,
}
vm.runInNewContext(`${source}\nglobalThis.__seedTours = serviceTours`, context, { timeout: 5000 })

const tourSeedData = Object.entries(context.__seedTours).flatMap(([category, tours]) =>
  tours.map(({ id, title, duration, description, highlights, itinerary }) => ({
    category,
    id,
    title,
    duration,
    description,
    highlights: Array.isArray(highlights) ? highlights : [],
    itinerary: Array.isArray(itinerary) ? itinerary : [],
  })),
)

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(tourSeedData, null, 2)}\n`)
console.log(`Wrote ${tourSeedData.length} locally curated tour records to ${path.relative(projectRoot, outputPath)}`)
