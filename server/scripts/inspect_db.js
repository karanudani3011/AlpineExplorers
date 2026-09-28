import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

const db = new DatabaseSync('server/data/alpine.db')

console.log('=== TABLES ===')
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
console.log(tables.map(t => t.name))

console.log('\n=== INTERNATIONAL PACKAGES ===')
try {
  const intl = db.prepare("SELECT id, destination, country, duration FROM international_packages").all()
  console.log(intl)
} catch (e) {
  console.log('Error:', e.message)
}

console.log('\n=== DOMESTIC PACKAGES ===')
try {
  const dom = db.prepare("SELECT id, destination, state, duration FROM domestic_packages").all()
  console.log(dom)
} catch (e) {
  console.log('Error:', e.message)
}
