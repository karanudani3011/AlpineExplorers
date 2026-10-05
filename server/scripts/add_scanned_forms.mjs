import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../server/data/alpine.db')
console.log('Opening database at:', dbPath)
const db = new DatabaseSync(dbPath)

try {
  db.exec("ALTER TABLE bookings ADD COLUMN scanned_forms TEXT DEFAULT '[]'")
  console.log('Added scanned_forms column to bookings')
} catch (e) {
  console.log('scanned_forms:', e.message.includes('duplicate') || e.message.includes('already') ? 'Already exists' : e.message)
}

try {
  db.exec("ALTER TABLE travelers ADD COLUMN scanned_form_url TEXT")
  console.log('Added scanned_form_url column to travelers')
} catch (e) {
  console.log('scanned_form_url:', e.message.includes('duplicate') || e.message.includes('already') ? 'Already exists' : e.message)
}

const cols = db.prepare('PRAGMA table_info(bookings)').all()
console.log('\nBookings columns:', cols.map(c => c.name).join(', '))

db.close()
console.log('\nDone!')
