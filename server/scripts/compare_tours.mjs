import fs from 'node:fs'
import { getSupabaseAdmin } from '../utils/supabase.js'

const sb = getSupabaseAdmin()
const { data: sbTours, error } = await sb.from('tours').select('id, title, category')
if (error) {
  console.error('Error fetching sb tours:', error)
  process.exit(1)
}
const sbIds = new Set(sbTours.map((t) => t.id))

const content = fs.readFileSync('src/data/servicesData.js', 'utf8')
const regex = /id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"]/g
let match
const inServicesData = []
while ((match = regex.exec(content)) !== null) {
  inServicesData.push({ id: match[1], title: match[2] })
}

const missing = inServicesData.filter((t) => !sbIds.has(t.id))
console.log('Tours in servicesData.js:', inServicesData.length)
console.log('Tours in Supabase:', sbTours.length)
console.log('Missing in Supabase:', missing.length)
console.log(JSON.stringify(missing, null, 2))
