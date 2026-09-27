import 'dotenv/config'
import { db } from '../db.js'
import { uploadUrlToCloudinary } from '../utils/cloudinary.js'

async function uploadIfNotCloudinary(url, category = 'tours', title = 'Tour Image') {
  if (!url || typeof url !== 'string') return url
  if (url.includes('res.cloudinary.com')) return url // already in Cloudinary

  try {
    console.log(`  -> Uploading to Cloudinary: ${url.slice(0, 70)}...`)
    const res = await uploadUrlToCloudinary(url, {
      folder: 'alpine_explorers',
      resource_type: 'auto',
    })
    console.log(`     ✓ Uploaded: ${res.secure_url}`)

    // Record in media table if not already present
    try {
      db.prepare(
        'INSERT INTO media (filename, url, category, title, size, type) VALUES (?,?,?,?,?,?)'
      ).run(res.public_id, res.secure_url, category, title, res.bytes || 0, res.resource_type || 'image')
    } catch {}

    return res.secure_url
  } catch (err) {
    console.warn(`     ✕ Failed to upload ${url}:`, err.message)
    return url // keep existing fallback
  }
}

async function migrateTable(tableName, imageCol, titleCol, hasGallery = false) {
  console.log(`\n--- Migrating ${tableName} ---`)
  const rows = db.prepare(`SELECT * FROM ${tableName}`).all()
  console.log(`Found ${rows.length} rows in ${tableName}`)

  for (const row of rows) {
    let updated = false
    let newImage = row[imageCol]
    let newGallery = row.gallery

    if (row[imageCol]) {
      const cloudUrl = await uploadIfNotCloudinary(row[imageCol], tableName, `${row[titleCol]} Cover`)
      if (cloudUrl !== row[imageCol]) {
        newImage = cloudUrl
        updated = true
      }
    }

    if (hasGallery && row.gallery) {
      try {
        const galleryArr = typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : row.gallery
        if (Array.isArray(galleryArr) && galleryArr.length > 0) {
          const newArr = []
          for (let i = 0; i < galleryArr.length; i++) {
            const gUrl = galleryArr[i]
            const uploadedGUrl = await uploadIfNotCloudinary(gUrl, tableName, `${row[titleCol]} Gallery #${i + 1}`)
            newArr.push(uploadedGUrl)
            if (uploadedGUrl !== gUrl) updated = true
          }
          newGallery = JSON.stringify(newArr)
        }
      } catch (e) {
        console.warn(`Gallery parse error for ${row[titleCol]}:`, e.message)
      }
    }

    if (updated) {
      if (hasGallery) {
        db.prepare(`UPDATE ${tableName} SET ${imageCol} = ?, gallery = ? WHERE id = ?`).run(newImage, newGallery, row.id)
      } else {
        db.prepare(`UPDATE ${tableName} SET ${imageCol} = ? WHERE id = ?`).run(newImage, row.id)
      }
      console.log(`  Updated row #${row.id} (${row[titleCol]})`)
    }
  }
}

async function runMigration() {
  console.log('============================================')
  console.log(' Starting Cloudinary Media Migration')
  console.log('============================================')

  await migrateTable('international_packages', 'image', 'destination', true)
  await migrateTable('domestic_packages', 'image', 'destination', true)
  await migrateTable('adventure_packages', 'image', 'title', true)
  await migrateTable('camping_packages', 'image', 'title', true)
  await migrateTable('blogs', 'cover_image', 'title', false)

  console.log('\n============================================')
  console.log(' Migration Complete! All images uploaded to Cloudinary.')
  console.log('============================================\n')
}

runMigration().catch((err) => {
  console.error('Fatal migration error:', err)
  process.exit(1)
})
