import notoSansUrl from '@fontsource/noto-sans/files/noto-sans-latin-ext-400-normal.woff'
import notoSansBoldUrl from '@fontsource/noto-sans/files/noto-sans-latin-ext-700-normal.woff'
import React from 'react'
import { Document, Page, View, Text, Image, Font, StyleSheet, pdf as renderPdf } from '@react-pdf/renderer'

const GOLD = '#C9A227'
const NAVY = '#0B1F5C'
const FIRST_HEADER_HEIGHT = 104
const CONTINUATION_HEADER_HEIGHT = 40

function textValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join(', ')
  return value == null || value === '' ? '' : String(value)
}

function filePart(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'Tour'
}

async function loadLogoDataUrl(logoUrl) {
  const response = await fetch(logoUrl)
  if (!response.ok) throw new Error('The Alpine Explorers logo could not be loaded.')
  const source = await createImageBitmap(await response.blob())
  const scale = Math.min(1, 400 / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(source.width * scale))
  canvas.height = Math.max(1, Math.round(source.height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('The logo could not be prepared for the itinerary.')
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  source.close?.()
  return canvas.toDataURL('image/jpeg', 0.84)
}

function getPdfComponents() {
  const { createElement: h } = React

  Font.register({ family: 'NotoSans', fonts: [
    { src: notoSansUrl, fontWeight: 400 },
    { src: notoSansBoldUrl, fontWeight: 700 },
  ] })

  const styles = StyleSheet.create({
    // A4 is 595 x 842 pt. The bottom padding reserves ~22 mm for the fixed footer.
    page: { paddingTop: 48, paddingHorizontal: 0, paddingBottom: 64, fontFamily: 'NotoSans', fontSize: 9, color: '#253044', backgroundColor: '#FFFDF8' },
    firstHeader: { height: FIRST_HEADER_HEIGHT, width: '100%', marginTop: -48, backgroundColor: '#000000', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40 },
    firstLogo: { width: 62, height: 62, objectFit: 'contain' },
    brandCopy: { marginLeft: 12, justifyContent: 'center' },
    brandName: { color: '#FFFFFF', fontSize: 17, letterSpacing: 1.1, fontFamily: 'Times-Roman' },
    brandTagline: { color: GOLD, fontSize: 9, marginTop: 4, fontFamily: 'NotoSans' },
    goldRule: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: GOLD },
    continuationHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: CONTINUATION_HEADER_HEIGHT, backgroundColor: '#000000', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40 },
    continuationLogo: { width: 28, height: 28, objectFit: 'contain' },
    continuationName: { color: '#FFFFFF', fontSize: 10, marginLeft: 8, fontFamily: 'Times-Roman' },
    continuationRule: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 0.8, backgroundColor: GOLD },
    body: { paddingHorizontal: 40, paddingTop: 12 },
    title: { color: NAVY, fontSize: 21, fontFamily: 'Times-Roman', marginBottom: 3 },
    location: { color: '#475569', fontSize: 9, marginBottom: 2 },
    duration: { color: GOLD, fontSize: 9, fontWeight: 700, marginBottom: 10 },
    sectionHeading: { color: NAVY, fontSize: 14, fontFamily: 'Times-Roman', marginTop: 8, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: GOLD, paddingBottom: 4 },
    day: { marginBottom: 8, padding: 9, borderWidth: 0.7, borderColor: '#E6D7A7', borderRadius: 5, backgroundColor: '#FFFFFF' },
    dayTitle: { color: NAVY, fontSize: 10, fontWeight: 700, marginBottom: 5 },
    dayText: { fontSize: 8.5, lineHeight: 1.4, marginBottom: 3, color: '#374151' },
    label: { fontWeight: 700, color: NAVY },
    footer: { position: 'absolute', bottom: 10, left: 40, right: 40, height: 42, borderTopWidth: 0.7, borderTopColor: GOLD, paddingTop: 4, justifyContent: 'space-between', backgroundColor: '#FFFDF8' },
    footerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    footerText: { color: NAVY, fontSize: 6.5 },
    footerNote: { color: '#6B7280', fontSize: 6.3, textAlign: 'center', flex: 1, marginHorizontal: 8 },
    footerContact: { color: '#475569', fontSize: 6.1, textAlign: 'center' },
  })

  const DayBlock = ({ day, index }) => {
    const title = textValue(day?.title)
    const dayNumber = day?.day ?? index + 1
    const optionalLines = [
      ['Activities', day?.activities],
      ['Meals', day?.meals],
      ['Accommodation', day?.accommodation || day?.overnight],
    ].filter(([, value]) => textValue(value))

    return h(View, { style: styles.day, wrap: false },
      h(Text, { style: styles.dayTitle }, `Day ${dayNumber}: ${title}`),
      textValue(day?.description) ? h(Text, { style: styles.dayText }, textValue(day.description)) : null,
      ...optionalLines.map(([label, value]) => h(Text, { key: label, style: styles.dayText },
        h(Text, { style: styles.label }, `${label}: `), textValue(value))))
  }

  const FirstHeader = ({ logo }) => h(View, { style: styles.firstHeader },
    h(Image, { src: logo, style: styles.firstLogo }),
    h(View, { style: styles.brandCopy },
      h(Text, { style: styles.brandName }, 'ALPINE EXPLORERS'),
      h(Text, { style: styles.brandTagline }, 'Pioneer in Adventure Tourism')),
    h(View, { style: styles.goldRule }))

  const ContinuationHeader = ({ logo }) => h(View, {
    fixed: true,
    render: ({ pageNumber }) => pageNumber > 1
      ? h(View, { style: styles.continuationHeader },
        h(Image, { src: logo, style: styles.continuationLogo }),
        h(Text, { style: styles.continuationName }, 'ALPINE EXPLORERS'),
        h(View, { style: styles.continuationRule }))
      : null,
  })

  const Footer = () => h(View, {
    fixed: true,
    render: ({ pageNumber, totalPages }) => h(View, { style: styles.footer },
      h(View, { style: styles.footerTop },
        h(Text, { style: styles.footerText }, '© Alpine Explorers'),
        h(Text, { style: styles.footerNote }, 'Itinerary is subject to change based on weather and local conditions.'),
        h(Text, { style: styles.footerText }, `Page ${pageNumber} of ${totalPages}`)),
      h(Text, { style: styles.footerContact }, 'Phone +91 99798 83339, +91 99134 83334  ·  alpineexplorers.travel@gmail.com')),
  })

  const ItineraryDocument = ({ tour, duration, itinerary, logo }) => h(Document, {
    title: `Alpine Explorers - ${tour.title || 'Tour'} Itinerary`,
    author: 'Alpine Explorers',
    subject: `${duration} tour itinerary`,
  }, h(Page, { size: 'A4', style: styles.page, wrap: true },
    h(FirstHeader, { logo }),
    h(View, { style: styles.body },
      h(Text, { style: styles.title }, textValue(tour.title) || 'Tour Itinerary'),
      textValue(tour.location || tour.destination) ? h(Text, { style: styles.location }, textValue(tour.location || tour.destination)) : null,
      textValue(duration) ? h(Text, { style: styles.duration }, textValue(duration)) : null,
      (itinerary || []).length ? h(Text, { style: styles.sectionHeading }, 'Day Wise Itinerary') : null,
      ...(itinerary || []).map((day, index) => h(DayBlock, { key: day?.day ?? index, day, index }))),
    h(ContinuationHeader, { logo }),
    h(Footer)))

  return { ItineraryDocument }
}

export async function generateItineraryPdf(tour, selectedDuration, selectedItinerary) {
  if (!tour) throw new Error('Tour details are unavailable. Please try again.')
  const { default: logoUrl } = await import('../assets/alpine_logo.png')
  const logo = await loadLogoDataUrl(logoUrl)
  const { ItineraryDocument } = getPdfComponents()
  const duration = selectedDuration || tour.duration || ''
  const itinerary = Array.isArray(selectedItinerary) ? selectedItinerary : []
  const pdfDocument = React.createElement(ItineraryDocument, { tour, duration, itinerary, logo })
  const blob = await renderPdf(pdfDocument).toBlob()
  const filename = `Alpine-Explorers-${filePart(tour.title)}-${filePart(duration)}-Itinerary.pdf`
  const url = URL.createObjectURL(blob)
  const anchor = globalThis.document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  globalThis.document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return filename
}
