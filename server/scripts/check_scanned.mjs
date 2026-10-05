import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../server/data/alpine.db')
const db = new DatabaseSync(dbPath)

const bookings = db.prepare('SELECT id, booking_id, scanned_forms FROM bookings ORDER BY id DESC LIMIT 10').all()
console.log('Recent bookings scanned_forms:')
bookings.forEach(b => {
  console.log(`  [${b.id}] ${b.booking_id}: "${b.scanned_forms}"`)
})

db.close()
