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