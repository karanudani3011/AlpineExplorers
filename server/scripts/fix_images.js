import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync('server/data/alpine.db')

const updateDubai = db.prepare(`
  UPDATE international_packages 
  SET image = 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop'
  WHERE LOWER(destination) = 'dubai' OR id = 11
`)
updateDubai.run()

const updateBaku = db.prepare(`
  UPDATE international_packages 
  SET image = 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=600&fit=crop'
  WHERE LOWER(destination) = 'baku' OR id = 10
`)
updateBaku.run()

console.log('Updated packages:')
const rows = db.prepare("SELECT id, destination, image FROM international_packages WHERE LOWER(destination) IN ('dubai', 'baku')").all()
console.log(rows)
