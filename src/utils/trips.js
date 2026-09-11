export function formatPrice(price) {
  if (typeof price === 'number' && price > 0) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }
  return price
}

export function isTourItem(item = {}) {
  return Boolean(item.duration || item.price)
}

export function getTripInfo(item = {}) {
  const title = item.title || item.name || 'Alpine Explorers Trip'
  const fields = []
  if (isTourItem(item)) {
    if (item.destination || item.location) fields.push(['Destination', item.destination || item.location])
    if (item.duration) fields.push(['Duration', item.duration])
    if (item.price) fields.push(['Price', `${formatPrice(item.price)} / person`])
  } else {
    if (item.date) fields.push(['Date', item.date])
    if (item.location) fields.push(['Location', item.location])
  }
  return { title, fields }
}