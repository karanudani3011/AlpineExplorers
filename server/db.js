import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(path.join(dataDir, 'alpine.db'))
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK(role IN ('super_admin','admin','editor')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS international_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination TEXT NOT NULL,
  country TEXT,
  duration TEXT,
  short_description TEXT,
  full_description TEXT,
  price REAL,
  original_price REAL,
  air_ticket INTEGER DEFAULT 1,
  passport_visa INTEGER DEFAULT 1,
  pickup_drop INTEGER DEFAULT 1,
  accommodation INTEGER DEFAULT 1,
  food INTEGER DEFAULT 1,
  sightseeing INTEGER DEFAULT 1,
  guidance INTEGER DEFAULT 1,
  image TEXT,
  gallery TEXT DEFAULT '[]',
  featured INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS domestic_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination TEXT NOT NULL,
  state TEXT,
  duration TEXT,
  season TEXT,
  short_description TEXT,
  full_description TEXT,
  price REAL,
  transportation INTEGER DEFAULT 1,
  accommodation INTEGER DEFAULT 1,
  food INTEGER DEFAULT 1,
  sightseeing INTEGER DEFAULT 1,
  activities TEXT DEFAULT '[]',
  image TEXT,
  gallery TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS adventure_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  location TEXT,
  duration TEXT,
  season TEXT,
  ex TEXT,
  description TEXT,
  activities TEXT DEFAULT '[]',
  includes TEXT DEFAULT '[]',
  image TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS camping_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  location TEXT,
  duration TEXT,
  season TEXT,
  description TEXT,
  activities TEXT DEFAULT '[]',
  accommodation TEXT,
  food TEXT,
  charges TEXT,
  rules TEXT DEFAULT '[]',
  what_to_bring TEXT DEFAULT '[]',
  certificates TEXT,
  image TEXT,
  gallery TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  author TEXT,
  cover_image TEXT,
  short_description TEXT,
  content TEXT,
  tags TEXT DEFAULT '[]',
  publish_date TEXT,
  featured INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','unpublished')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  title TEXT,
  size INTEGER,
  type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  destination TEXT,
  package_name TEXT,
  travel_date TEXT,
  travelers INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','in_progress','converted','closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_name TEXT NOT NULL,
  destination TEXT,
  travelers INTEGER NOT NULL DEFAULT 1,
  price_per_person REAL,
  total REAL,
  data TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','in_progress','converted','closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id TEXT NOT NULL UNIQUE,
  tour_id TEXT,
  tour_name TEXT NOT NULL,
  tour_category TEXT,
  location TEXT,
  duration TEXT,
  travel_date TEXT,
  booking_date TEXT NOT NULL DEFAULT (datetime('now')),
  price_per_person REAL,
  number_of_travelers INTEGER NOT NULL DEFAULT 1,
  total_amount REAL,
  booking_contact_name TEXT,
  booking_contact_email TEXT,
  booking_contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled','completed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS travelers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  traveler_number INTEGER NOT NULL,
  course_name TEXT,
  full_name TEXT NOT NULL,
  date_of_birth TEXT,
  age INTEGER,
  sex TEXT,
  blood_group TEXT,
  address TEXT,
  contact_number TEXT,
  education TEXT,
  school_college TEXT,
  school_college_address TEXT,
  school_college_phone TEXT,
  hobbies TEXT,
  photo_url TEXT,
  adventure_experience TEXT,
  adventure_details TEXT,
  participant_type TEXT NOT NULL DEFAULT 'Adult',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS declarations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  traveler_id INTEGER NOT NULL REFERENCES travelers(id) ON DELETE CASCADE,
  accepted INTEGER NOT NULL DEFAULT 0,
  place TEXT,
  date TEXT,
  signature_url TEXT,
  accepted_at TEXT
);

CREATE TABLE IF NOT EXISTS risk_certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  traveler_id INTEGER NOT NULL REFERENCES travelers(id) ON DELETE CASCADE,
  participant_name TEXT,
  course_name TEXT,
  accepted INTEGER NOT NULL DEFAULT 0,
  place TEXT,
  date TEXT,
  signature_url TEXT,
  accepted_at TEXT
);

CREATE TABLE IF NOT EXISTS guardians (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  traveler_id INTEGER NOT NULL REFERENCES travelers(id) ON DELETE CASCADE,
  guardian_name TEXT,
  guardian_contact TEXT,
  guardian_signature_url TEXT
);

CREATE TABLE IF NOT EXISTS homepage (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image TEXT,
  cta_primary_text TEXT,
  cta_primary_link TEXT,
  cta_secondary_text TEXT,
  cta_secondary_link TEXT,
  sections TEXT DEFAULT '{}',
  content TEXT DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS about_us (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  legacy_description TEXT,
  founder_name TEXT,
  founder_title TEXT,
  founder_bio TEXT,
  founder_image TEXT,
  mission TEXT,
  vision TEXT,
  values_list TEXT DEFAULT '[]',
  recognition TEXT DEFAULT '[]',
  statistics TEXT DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_settings (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  company_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  map_link TEXT,
  instagram TEXT,
  facebook TEXT,
  youtube TEXT,
  business_hours TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  website_name TEXT,
  logo TEXT,
  favicon TEXT,
  seo_title TEXT,
  seo_description TEXT,
  ga_id TEXT,
  maintenance_mode INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT,
  action TEXT,
  module TEXT,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_profiles (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'STAFF' CHECK(role IN ('SUPER_ADMIN', 'STAFF')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_permissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES admin_profiles(id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, permission_key)
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT,
  action TEXT NOT NULL,
  target_user_id TEXT,
  module TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`)

export function logActivity({ user_name, action, module, details = '' }) {
  db.prepare('INSERT INTO activity_logs (user_name, action, module, details) VALUES (?,?,?,?)')
    .run(user_name || 'system', action, module, details)
}

export function row(sql, ...params) {
  return db.prepare(sql).get(...params)
}

export function rows(sql, ...params) {
  return db.prepare(sql).all(...params)
}

export function run(sql, ...params) {
  return db.prepare(sql).run(...params)
}

export function getBookingById(id) {
  return db.prepare('SELECT * FROM bookings WHERE id = ?').get(id)
}

export function getBookingByBookingId(bookingId) {
  return db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(bookingId)
}

export function getBookings({ status, search, tour, travelDate, bookingDate, minTravelers, maxTravelers, limit, offset }) {
  let sql = 'SELECT * FROM bookings WHERE 1=1'
  const params = []
  if (status) { sql += ' AND status = ?'; params.push(status) }
  if (search) {
    sql += ' AND (booking_id LIKE ? OR tour_name LIKE ? OR booking_contact_name LIKE ? OR booking_contact_email LIKE ? OR booking_contact_phone LIKE ? OR id IN (SELECT booking_id FROM travelers WHERE full_name LIKE ? OR contact_number LIKE ?))'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (tour) { sql += ' AND tour_name LIKE ?'; params.push(`%${tour}%`) }
  if (travelDate) { sql += ' AND travel_date = ?'; params.push(travelDate) }
  if (bookingDate) { sql += ' AND date(booking_date) = date(?)'; params.push(bookingDate) }
  if (minTravelers) { sql += ' AND number_of_travelers >= ?'; params.push(minTravelers) }
  if (maxTravelers) { sql += ' AND number_of_travelers <= ?'; params.push(maxTravelers) }
  sql += ' ORDER BY id DESC'
  if (limit) { sql += ' LIMIT ?'; params.push(limit) }
  if (offset) { sql += ' OFFSET ?'; params.push(offset) }
  return db.prepare(sql).all(...params)
}

export function getBookingsCount({ status, search, tour, travelDate, bookingDate, minTravelers, maxTravelers }) {
  let sql = 'SELECT COUNT(*) as count FROM bookings WHERE 1=1'
  const params = []
  if (status) { sql += ' AND status = ?'; params.push(status) }
  if (search) {
    sql += ' AND (booking_id LIKE ? OR tour_name LIKE ? OR booking_contact_name LIKE ? OR booking_contact_email LIKE ? OR booking_contact_phone LIKE ? OR id IN (SELECT booking_id FROM travelers WHERE full_name LIKE ? OR contact_number LIKE ?))'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (tour) { sql += ' AND tour_name LIKE ?'; params.push(`%${tour}%`) }
  if (travelDate) { sql += ' AND travel_date = ?'; params.push(travelDate) }
  if (bookingDate) { sql += ' AND date(booking_date) = date(?)'; params.push(bookingDate) }
  if (minTravelers) { sql += ' AND number_of_travelers >= ?'; params.push(minTravelers) }
  if (maxTravelers) { sql += ' AND number_of_travelers <= ?'; params.push(maxTravelers) }
  return db.prepare(sql).get(...params).count
}

export function getTravelersByBookingId(bookingId) {
  return db.prepare('SELECT * FROM travelers WHERE booking_id = ? ORDER BY traveler_number').all(bookingId)
}

export function getTravelerById(id) {
  return db.prepare('SELECT * FROM travelers WHERE id = ?').get(id)
}

export function getDeclarationByTravelerId(travelerId) {
  return db.prepare('SELECT * FROM declarations WHERE traveler_id = ?').get(travelerId)
}

export function getRiskCertificateByTravelerId(travelerId) {
  return db.prepare('SELECT * FROM risk_certificates WHERE traveler_id = ?').get(travelerId)
}

export function getGuardianByTravelerId(travelerId) {
  return db.prepare('SELECT * FROM guardians WHERE traveler_id = ?').get(travelerId)
}

export function createBooking(data) {
  const info = db.prepare(`
    INSERT INTO bookings (booking_id, tour_id, tour_name, tour_category, location, duration, travel_date, booking_date, price_per_person, number_of_travelers, total_amount, booking_contact_name, booking_contact_email, booking_contact_phone, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    data.booking_id,
    data.tour_id,
    data.tour_name,
    data.tour_category,
    data.location,
    data.duration,
    data.travel_date,
    data.booking_date || new Date().toISOString(),
    data.price_per_person,
    data.number_of_travelers,
    data.total_amount,
    data.booking_contact_name,
    data.booking_contact_email,
    data.booking_contact_phone,
    data.status || 'pending'
  )
  return info.lastInsertRowid
}

export function createTraveler(data) {
  const info = db.prepare(`
    INSERT INTO travelers (booking_id, traveler_number, course_name, full_name, date_of_birth, age, sex, blood_group, address, contact_number, education, school_college, school_college_address, school_college_phone, hobbies, photo_url, adventure_experience, adventure_details, participant_type)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    data.booking_id,
    data.traveler_number,
    data.course_name,
    data.full_name,
    data.date_of_birth,
    data.age,
    data.sex,
    data.blood_group,
    data.address,
    data.contact_number,
    data.education,
    data.school_college,
    data.school_college_address,
    data.school_college_phone,
    data.hobbies,
    data.photo_url,
    data.adventure_experience,
    data.adventure_details,
    data.participant_type
  )
  return info.lastInsertRowid
}

export function createDeclaration(data) {
  const info = db.prepare(`
    INSERT INTO declarations (traveler_id, accepted, place, date, signature_url, accepted_at)
    VALUES (?,?,?,?,?,?)
  `).run(
    data.traveler_id,
    data.accepted ? 1 : 0,
    data.place,
    data.date,
    data.signature_url,
    data.accepted_at
  )
  return info.lastInsertRowid
}

export function createRiskCertificate(data) {
  const info = db.prepare(`
    INSERT INTO risk_certificates (traveler_id, participant_name, course_name, accepted, place, date, signature_url, accepted_at)
    VALUES (?,?,?,?,?,?,?,?)
  `).run(
    data.traveler_id,
    data.participant_name,
    data.course_name,
    data.accepted ? 1 : 0,
    data.place,
    data.date,
    data.signature_url,
    data.accepted_at
  )
  return info.lastInsertRowid
}

export function createGuardian(data) {
  const info = db.prepare(`
    INSERT INTO guardians (traveler_id, guardian_name, guardian_contact, guardian_signature_url)
    VALUES (?,?,?,?)
  `).run(
    data.traveler_id,
    data.guardian_name,
    data.guardian_contact,
    data.guardian_signature_url
  )
  return info.lastInsertRowid
}

export function updateBookingStatus(id, status) {
  return db.prepare('UPDATE bookings SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, id)
}

export function getBookingStats() {
  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count
  const totalTravelers = db.prepare('SELECT COUNT(*) as count FROM travelers').get().count
  const pendingApplications = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = ?').get('pending').count
  const confirmedBookings = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = ?').get('confirmed').count
  return { totalBookings, totalTravelers, pendingApplications, confirmedBookings }
}

export function getAllBookingsForExport() {
  return db.prepare('SELECT * FROM bookings ORDER BY id DESC').all()
}

export function getAllTravelersForExport() {
  return db.prepare(`
    SELECT t.*, b.booking_id AS booking_code, b.tour_name, b.travel_date, b.booking_date
    FROM travelers t
    JOIN bookings b ON t.booking_id = b.id
    ORDER BY b.id DESC, t.traveler_number
  `).all()
}