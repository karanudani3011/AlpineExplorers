import { serviceTours } from '../../src/data/servicesData.js'

const tourIds = [
  'int-thailand', 'int-bali', 'int-phuket-krabi', 'int-singapore-malaysia',
  'int-sri-lanka', 'int-vietnam', 'int-baku', 'int-bhutan',
  'dom-goa', 'dom-kashmir-himachal', 'dom-kerala', 'dom-seven-sisters',
  'dom-sikkim', 'dom-rajasthan', 'int-dubai'
]

const result = {}
for (const cat of Object.keys(serviceTours)) {
  for (const t of serviceTours[cat]) {
    if (tourIds.includes(t.id)) {
      result[t.id] = {
        title: t.title,
        duration: t.duration,
        daysCount: t.itinerary ? t.itinerary.length : 0,
        itinerary: t.itinerary
      }
    }
  }
}

console.log(JSON.stringify(result, null, 2))
