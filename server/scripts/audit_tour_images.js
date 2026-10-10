import 'dotenv/config'
import { writeFile } from 'node:fs/promises'
import { db } from '../db.js'
import { serviceTours } from '../../src/data/servicesData.js'
import { tours as featuredTours } from '../../src/data/data.js'
import { destinations } from '../../src/data/data.js'
import manifest from '../../src/data/tourImageManifest.json' with { type: 'json' }

const parseGallery = (value) => {
  if (Array.isArray(value)) return value
  try { const parsed = JSON.parse(value || '[]'); return Array.isArray(parsed) ? parsed : [] } catch { return [] }
}
const databaseTours = [
  ...db.prepare("SELECT * FROM international_packages WHERE status='active'").all().map((row) => ({ id: `int-${row.id}`, title: row.destination, destination: row.country ? `${row.destination}, ${row.country}` : row.destination, location: row.country || row.destination, category: 'International', image: row.image, images: [row.image, ...parseGallery(row.gallery)].filter(Boolean) })),
  ...db.prepare("SELECT * FROM domestic_packages WHERE status='active'").all().map((row) => ({ id: `dom-${row.id}`, title: row.destination, destination: row.state || row.destination, location: row.state || row.destination, category: 'Domestic', image: row.image, images: [row.image, ...parseGallery(row.gallery)].filter(Boolean) })),
  ...db.prepare("SELECT * FROM adventure_packages WHERE status='active'").all().map((row) => ({ id: `adv-${row.id}`, title: row.title, destination: row.location, location: row.location, category: 'Adventure Tours & Camps', image: row.image, images: [row.image, ...parseGallery(row.gallery)].filter(Boolean) })),
  ...db.prepare("SELECT * FROM camping_packages WHERE status='active'").all().map((row) => ({ id: `camp-${row.id}`, title: row.title, destination: row.location, location: row.location, category: 'Camping & Weekend Getaways', image: row.image, images: [row.image, ...parseGallery(row.gallery)].filter(Boolean) })),
]
const databaseTitles = new Set(databaseTours.map((tour) => tour.title.toLowerCase().trim()))
const bundledServiceTours = Object.entries(serviceTours).flatMap(([category, items]) => items
  .filter((tour) => !databaseTitles.has(tour.title.toLowerCase().trim()))
  .map((tour) => ({ ...tour, category: tour.category || category })))
const tours = [
  ...databaseTours,
  ...bundledServiceTours,
  ...featuredTours,
  ...destinations.map((destination) => ({ ...destination, id: `destination-${destination.id}`, title: destination.name, category: 'Destination card' })),
]
const canonicalPhotoId = (url) => {
  const text = String(url || '')
  return text.match(/images\.unsplash\.com\/(photo-[^/?]+)/)?.[1] || text
}

async function checkAvailability(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) })
    return { status: response.status, available: response.ok }
  } catch (error) {
    return { status: null, available: false, error: error.message }
  }
}

const checkUrls = process.argv.includes('--check-urls')
const sourceRecords = tours.flatMap((tour) => {
  const records = manifest[String(tour.id)]
    ? manifest[String(tour.id)].images
    : (Array.isArray(tour.images) ? tour.images : (tour.image ? [tour.image] : []))
  return records.map((item) => typeof item === 'string' ? item : item?.imageUrl || item?.url).filter(Boolean)
})
const availabilityByUrl = new Map()
if (checkUrls) {
  const urls = [...new Set(sourceRecords)]
  let nextIndex = 0
  await Promise.all(Array.from({ length: Math.min(6, urls.length) }, async () => {
    while (nextIndex < urls.length) {
      const url = urls[nextIndex++]
      availabilityByUrl.set(url, await checkAvailability(url))
    }
  }))
}
const results = []
for (const tour of tours) {
  const rawImages = manifest[String(tour.id)]
    ? manifest[String(tour.id)].images
    : (Array.isArray(tour.images) ? tour.images : (tour.image ? [tour.image] : []))
  const seen = new Set()
  const images = []
  for (const item of rawImages) {
    const url = typeof item === 'string' ? item : item?.imageUrl || item?.url
    if (!url) continue
    const photoId = typeof item === 'object' && item?.sourcePhotoId ? item.sourcePhotoId : canonicalPhotoId(url)
    const duplicateWithinTour = seen.has(photoId)
    seen.add(photoId)
    const availability = checkUrls ? availabilityByUrl.get(url) : { checked: false }
    images.push({
      placeName: typeof item === 'object' ? item.placeName || null : null,
      url,
      photoId,
      duplicateWithinTour,
      availability,
      source: typeof item === 'object' ? item.source || null : null,
      pageUrl: typeof item === 'object' ? item.pageUrl || null : null,
      artist: typeof item === 'object' ? item.artist || null : null,
      license: typeof item === 'object' ? item.license || null : null,
      sourceMetadataPresent: Boolean(typeof item === 'object' && item.sourcePhotoId && item.pageUrl && item.artist && item.license),
      destinationTitleMatch: Boolean(typeof item === 'object' && (item.titleMatchTerms > 0 || item.descriptionMatchTerms > 0)),
      visualChecked: false,
      verificationNote: typeof item === 'object' && item.sourcePhotoId
        ? 'Commons source, artist, license, and file-title/description match recorded; visual review is still required.'
        : 'No provider record or location verification evidence is stored with this tour image.',
    })
  }
  const usableImages = images.filter((image) => image.sourceMetadataPresent && image.destinationTitleMatch && !image.duplicateWithinTour)
  results.push({
    tourId: String(tour.id),
    title: tour.title,
    category: tour.category || tour.serviceCategory || 'Featured',
    destination: tour.destination || tour.location || null,
    images,
    uniqueImageCount: new Set(usableImages.map((image) => image.photoId)).size,
    usableImageCount: usableImages.length,
    needsPhotos: new Set(usableImages.map((image) => image.photoId)).size < 4,
    needsSourceVerification: images.length === 0 || images.some((image) => !image.sourceMetadataPresent || !image.destinationTitleMatch),
    needsVisualReview: images.some((image) => !image.visualChecked),
  })
}

const crossTourPhotoAssignments = new Map()
for (const tour of results) {
  for (const image of tour.images) {
    const assigned = crossTourPhotoAssignments.get(image.photoId) || []
    assigned.push(tour.tourId)
    crossTourPhotoAssignments.set(image.photoId, assigned)
  }
}
const report = {
  generatedAt: new Date().toISOString(),
  source: `Active catalogues (${databaseTours.length} database tours, ${bundledServiceTours.length} additional bundled tours, ${featuredTours.length} featured tours, ${destinations.length} destination cards).`,
  checks: { urlAvailability: checkUrls, destinationVerification: 'Commons title/description matching; visual review required' },
  totals: {
    toursInspected: results.filter((tour) => tour.category !== 'Destination card').length,
    databaseToursInspected: databaseTours.length,
    databaseOnlyToursInspected: databaseTours.filter((tour) => !Object.values(serviceTours).flat().some((item) => item.title.toLowerCase().trim() === tour.title.toLowerCase().trim())).length,
    destinationCardsInspected: results.filter((tour) => tour.category === 'Destination card').length,
    recordsInspected: results.length,
    toursWithFourUniqueUrls: results.filter((tour) => tour.category !== 'Destination card' && tour.uniqueImageCount >= 4).length,
    toursWithFourAttributedTitleMatchedRecords: results.filter((tour) => tour.category !== 'Destination card' && tour.uniqueImageCount >= 4 && tour.usableImageCount >= 4).length,
    destinationCardsWithFourUniqueUrls: results.filter((tour) => tour.category === 'Destination card' && tour.uniqueImageCount >= 4).length,
    toursNeedingPhotos: results.filter((tour) => tour.needsPhotos).length,
    toursNeedingSourceVerification: results.filter((tour) => tour.needsSourceVerification).length,
    toursNeedingVisualReview: results.filter((tour) => tour.needsVisualReview).length,
    brokenImageUrls: [...new Set(results.flatMap((tour) => tour.images.filter((image) => image.availability?.checked && !image.availability.available).map((image) => image.url)))].length,
    duplicateAssignmentsAcrossTours: [...crossTourPhotoAssignments.entries()].filter(([, ids]) => new Set(ids).size > 1).length,
  },
  tours: results,
  duplicatePhotoIdsAcrossTours: [...crossTourPhotoAssignments.entries()]
    .filter(([, ids]) => new Set(ids).size > 1)
    .map(([photoId, ids]) => ({ photoId, tourIds: [...new Set(ids)] })),
}

const outputPath = process.argv.find((arg) => arg.startsWith('--out='))?.slice('--out='.length)
if (outputPath) await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(JSON.stringify(report, null, 2))
