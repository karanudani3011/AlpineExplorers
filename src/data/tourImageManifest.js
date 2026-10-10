import manifest from './tourImageManifest.json'
import { serviceTours } from './servicesData'

const canonical = (value = '') => String(value).trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ')

export function getTourImageRecords(tour) {
  if (!tour) return []
  const normalizeRecords = (records) => records.map((image) => ({
    ...image,
    url: image.url || image.imageUrl,
    alt: image.alt || image.placeName || tour.title,
  })).filter((image) => image.url)
  let record = manifest[String(tour.id)]
  if (record) return normalizeRecords((record.images || []).filter((image) => image.titleMatchTerms > 0 || image.descriptionMatchTerms > 0))
  if (!record) {
    const title = canonical(tour.title)
    for (const items of Object.values(serviceTours)) {
      const match = items.find((item) => canonical(item.title) === title)
      if (match) {
        record = manifest[String(match.id)]
        break
      }
    }
  }
  if (record) return normalizeRecords((record.images || []).filter((image) => image.titleMatchTerms > 0 || image.descriptionMatchTerms > 0))
  if (Array.isArray(tour.images) && tour.images.length) return tour.images
  return tour.image ? [tour.image] : []
}
