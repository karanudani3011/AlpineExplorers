import { readFile, writeFile } from 'node:fs/promises'
import { tourAttractions } from '../../src/data/tourAttractions.js'

const API = 'https://commons.wikimedia.org/w/api.php'
const OUTPUT = new URL('../../src/data/tourImageManifest.json', import.meta.url)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const stripHtml = (value = '') => String(value).replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
const normalize = (value = '') => String(value).normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const acceptedLicense = (value = '') => /^(CC0|Public domain|PD|CC BY(?:-SA)?(?:\s|$)|GFDL)/i.test(value.trim())
const stopWords = new Set(['the', 'and', 'near', 'over', 'south', 'north', 'island', 'city', 'park', 'river', 'temple', 'beach', 'mountain', 'lake', 'waterfall', 'national', 'historic', 'old', 'new', 'valley', 'india', 'usa', 'united', 'states', 'gujarat', 'himachal', 'pradesh', 'uttarakhand', 'thailand', 'bali', 'france', 'switzerland', 'australia', 'maldives'])

async function searchPlaces(placeNames) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', gsrnamespace: '6',
    gsrsearch: placeNames.map((name) => `"${name}"`).join(' OR '), gsrlimit: '50', prop: 'imageinfo',
    iiprop: 'url|extmetadata', iiurlwidth: '1280',
  })
  let response
  for (let attempt = 0; attempt < 5; attempt += 1) {
    response = await fetch(`${API}?${params}`, {
      headers: { 'User-Agent': 'AlpineExplorersTourImages/1.0 (destination image manifest)' },
      signal: AbortSignal.timeout(20000),
    })
    if (response.status !== 429) break
    await sleep(Math.max(Number(response.headers.get('retry-after')) * 1000 || 0, 2500 * (attempt + 1)))
  }
  if (!response.ok) throw new Error(`Wikimedia Commons returned HTTP ${response.status} for ${placeNames.join(', ')}`)
  const data = await response.json()
  const candidates = Object.values(data.query?.pages || {}).map((page) => {
    const info = page.imageinfo?.[0]
    const meta = info?.extmetadata || {}
    return {
      pageId: page.pageid,
      fileTitle: page.title.replace(/^File:/, ''),
      pageUrl: info?.descriptionurl,
      imageUrl: info?.thumburl,
      artist: stripHtml(meta.Artist?.value || ''),
      credit: stripHtml(meta.Credit?.value || ''),
      license: stripHtml(meta.LicenseShortName?.value || ''),
      licenseUrl: meta.LicenseUrl?.value || '',
      attribution: stripHtml(meta.Attribution?.value || ''),
      description: stripHtml(meta.ImageDescription?.value || ''),
      source: 'Wikimedia Commons',
      sourcePhotoId: `commons:${page.pageid}`,
    }
  }).filter((item) => item.imageUrl && item.pageUrl && item.artist && acceptedLicense(item.license))
  const byPlace = new Map()
  for (const placeName of placeNames) {
    const terms = normalize(placeName).split(' ').filter((term) => term.length > 3 && !stopWords.has(term))
    byPlace.set(placeName, candidates.map((candidate) => {
      const titleText = normalize(candidate.fileTitle)
      const description = normalize(candidate.description)
      const titleMatchTerms = terms.filter((term) => titleText.includes(term)).length
      const descriptionMatchTerms = terms.filter((term) => description.includes(term)).length
      return { ...candidate, placeName, titleMatchTerms, descriptionMatchTerms, alt: `${placeName} — ${candidate.fileTitle}` }
    }).filter((candidate) => terms.length === 0 || candidate.titleMatchTerms > 0 || candidate.descriptionMatchTerms >= Math.ceil(terms.length / 2))
      .sort((a, b) => b.titleMatchTerms - a.titleMatchTerms || b.descriptionMatchTerms - a.descriptionMatchTerms))
  }
  return byPlace
}

const existingManifest = JSON.parse(await readFile(OUTPUT, 'utf8').catch(() => '{}'))
const candidateCache = new Map()
for (const record of Object.values(existingManifest)) {
  for (const image of record.images || []) {
    const list = candidateCache.get(image.placeName) || []
    list.push(image)
    candidateCache.set(image.placeName, list)
  }
}
const onlyDestinations = process.argv.includes('--only-destinations')
const onlyIdsArg = process.argv.find((arg) => arg.startsWith('--only-ids='))
const onlyIds = onlyIdsArg ? new Set(onlyIdsArg.slice('--only-ids='.length).split(',').filter(Boolean)) : null
const manifest = { ...existingManifest }
const attractionEntries = Object.entries(tourAttractions).filter(([tourId]) => onlyIds ? onlyIds.has(tourId) : (!onlyDestinations || tourId.startsWith('destination-')))
for (const [tourId, places] of attractionEntries) {
  const images = []
  const used = new Set()
  for (const placeName of places) {
    if (!candidateCache.has(placeName)) {
      console.log(`Searching Commons for ${tourId}: ${placeName}`)
      candidateCache.set(placeName, null)
      await sleep(1300)
      const candidateSet = await searchPlaces([placeName])
      candidateCache.set(placeName, candidateSet.get(placeName) || [])
    }
    const image = candidateCache.get(placeName).find((candidate) => !used.has(candidate.sourcePhotoId))
    if (!image) continue
    used.add(image.sourcePhotoId)
    images.push(image)
  }
  manifest[tourId] = {
    tourId,
    images,
    source: 'Wikimedia Commons API',
    validation: {
      candidateCount: images.length,
      fourDistinctPhotoRecords: images.length === 4 && new Set(images.map((image) => image.sourcePhotoId)).size === 4,
      locationEvidence: 'Commons file title or description matched the attraction search term; visual inspection is still required.',
    },
  }
}

await writeFile(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
const report = Object.values(manifest).map(({ tourId, images }) => ({ tourId, photos: images.length, placesMissing: tourAttractions[tourId].filter((place) => !images.some((image) => image.placeName === place)) }))
console.log(JSON.stringify({ tours: report.length, toursWithFour: report.filter((item) => item.photos === 4).length, toursMissing: report.filter((item) => item.photos < 4), manifest: OUTPUT.pathname }, null, 2))
