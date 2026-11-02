import fs from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync('server/data/alpine.db')
const blogs = JSON.parse(fs.readFileSync('server/seed-data/generated_blogs.json', 'utf8'))

console.log('Syncing', blogs.length, 'blogs to local SQLite...')

// Check if blogs table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    author TEXT,
    cover_image TEXT,
    short_description TEXT,
    content TEXT,
    tags TEXT,
    publish_date TEXT,
    featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

const insertStmt = db.prepare(`
  INSERT INTO blogs (title, slug, category, author, cover_image, short_description, content, tags, publish_date, featured, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    category = excluded.category,
    author = excluded.author,
    cover_image = excluded.cover_image,
    short_description = excluded.short_description,
    content = excluded.content,
    tags = excluded.tags,
    publish_date = excluded.publish_date,
    featured = excluded.featured,
    status = excluded.status,
    updated_at = excluded.updated_at
`)

let count = 0
for (const b of blogs) {
  insertStmt.run(
    b.title,
    b.slug,
    b.category,
    b.author,
    b.featured_image,
    b.short_description,
    b.content,
    JSON.stringify(b.tags),
    b.published_date,
    b.rating >= 4.9 ? 1 : 0,
    b.status,
    b.created_at,
    b.updated_at
  )
  count++
}

console.log('Successfully synced', count, 'blogs to local SQLite alpine.db')
