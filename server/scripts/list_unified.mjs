import fs from 'node:fs'
const tours = JSON.parse(fs.readFileSync('server/seed-data/all_unified_tours.json', 'utf8'))
console.log('Unified tours count:', tours.length)
for (let i = 0; i < tours.length; i++) {
  const t = tours[i]
  console.log(`${i + 1}. [${t.id}] ${t.title} | ${t.location || ''} | ${t.category || ''}`)
}
