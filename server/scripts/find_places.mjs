import fs from 'node:fs'

const content = fs.readFileSync('src/data/servicesData.js', 'utf8')
const toursWithDelhi = []
const toursWithAgra = []

const tourBlocks = content.split(/id:\s*['"]/)
for (const b of tourBlocks.slice(1)) {
  const id = b.split(/['"]/)[0]
  if (/Agra/i.test(b)) toursWithAgra.push(id)
  if (/Delhi/i.test(b)) toursWithDelhi.push(id)
}
console.log('Tours mentioning Agra:', toursWithAgra)
console.log('Tours mentioning Delhi:', toursWithDelhi)
