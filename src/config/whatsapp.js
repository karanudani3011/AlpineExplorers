import { getTripInfo } from '../utils/trips'

export const WHATSAPP_NUMBER = '919979883339'

export function buildWhatsAppMessage(item = {}) {
  const { title, fields } = getTripInfo(item)
  const lines = [
    'Hello Alpine Explorers,',
    '',
    'I am interested in the following trip:',
    '',
    `Trip: ${title}`,
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'I would like to know more about the trip, availability, pricing and booking process.',
    '',
    'Thank you.',
  ]
  return lines.join('\n')
}

export function buildWhatsAppUrl(item = {}) {
  const message = buildWhatsAppMessage(item)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}