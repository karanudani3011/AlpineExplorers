import { Router } from 'express'
import {
  db,
  logActivity,
  getTourPackages,
  getTourPackagesByIdentifier,
  getPackageById,
  saveTourPackage,
  deleteTourPackage,
  saveItineraryDay,
  deleteItineraryDay,
} from '../db.js'
import { authRequired, requirePermission } from '../middleware.js'

const toursRouter = Router()

/* ─────────────────────────────────────────────────────────────
 * PUBLIC ENDPOINTS
 * ───────────────────────────────────────────────────────────── */

toursRouter.get('/public/tours/:identifier/packages', (req, res) => {
  try {
    const packages = getTourPackagesByIdentifier(req.params.identifier)
    res.json({ packages })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

toursRouter.get('/public/packages/:id', (req, res) => {
  try {
    const pkg = getPackageById(req.params.id)
    if (!pkg) return res.status(404).json({ error: 'Package not found' })
    res.json({ package: pkg })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ─────────────────────────────────────────────────────────────
 * ADMIN ENDPOINTS (Protected)
 * ───────────────────────────────────────────────────────────── */

// Get all packages for a tour
toursRouter.get('/admin/tours/:tourType/:tourId/packages', authRequired, requirePermission('services.view'), (req, res) => {
  try {
    const { tourType, tourId } = req.params
    const packages = getTourPackages(tourType, Number(tourId))
    res.json({ packages })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create a new duration package for a tour
toursRouter.post('/admin/tours/:tourType/:tourId/packages', authRequired, requirePermission('services.edit'), (req, res) => {
  try {
    const { tourType, tourId } = req.params
    const { duration, days, nights, price, original_price, tour_slug, itinerary } = req.body

    if (!duration || !String(duration).trim()) {
      return res.status(400).json({ error: 'Duration label is required (e.g. 5N/6D)' })
    }
    const daysNum = Number(days)
    const nightsNum = Number(nights)
    if (isNaN(daysNum) || daysNum <= 0) {
      return res.status(400).json({ error: 'Days must be a valid number greater than 0' })
    }
    if (isNaN(nightsNum) || nightsNum < 0) {
      return res.status(400).json({ error: 'Nights must be a valid number (0 or greater)' })
    }

    // Default itinerary if none provided
    const itin = Array.isArray(itinerary) && itinerary.length > 0
      ? itinerary
      : Array.from({ length: daysNum }, (_, i) => ({
          day: i + 1,
          title: `Day ${i + 1} - Sightseeing & Activities`,
          description: `Planned activities and exploration for Day ${i + 1}.`,
          activities: [],
          meals: ['Breakfast'],
          overnight: '',
        }))

    const saved = saveTourPackage({
      tour_type: tourType,
      tour_id: Number(tourId),
      tour_slug: tour_slug || `${tourType === 'international' ? 'int' : 'dom'}-${tourId}`,
      duration: duration.trim(),
      days: daysNum,
      nights: nightsNum,
      price: price != null && price !== '' ? Number(price) : null,
      original_price: original_price != null && original_price !== '' ? Number(original_price) : null,
      is_default: req.body.is_default ? 1 : 0,
      itinerary: itin,
    })

    logActivity({
      user_name: req.user.full_name || req.user.username || req.user.email,
      action: 'Created Package',
      module: 'Tours',
      details: `${tourType} #${tourId} - ${duration}`,
    })

    res.status(201).json({ package: saved })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save / update a package AND its complete day-wise itinerary
toursRouter.put('/admin/packages/:packageId/full', authRequired, requirePermission('services.edit'), (req, res) => {
  try {
    const packageId = Number(req.params.packageId)
    const existing = db.prepare('SELECT * FROM tour_duration_packages WHERE id = ?').get(packageId)
    if (!existing) {
      return res.status(404).json({ error: 'Package not found' })
    }

    const { duration, days, nights, price, original_price, tour_slug, is_default, itinerary } = req.body

    const daysNum = days !== undefined ? Number(days) : existing.days
    const nightsNum = nights !== undefined ? Number(nights) : existing.nights

    if (!duration || !String(duration).trim()) {
      return res.status(400).json({ error: 'Duration cannot be empty' })
    }
    if (isNaN(daysNum) || daysNum <= 0) {
      return res.status(400).json({ error: 'Days must be a valid number' })
    }
    if (isNaN(nightsNum) || nightsNum < 0) {
      return res.status(400).json({ error: 'Nights must be a valid number' })
    }

    // Validation: if itinerary is supplied, ensure exactly `daysNum` days are provided
    if (Array.isArray(itinerary)) {
      if (itinerary.length !== daysNum) {
        return res.status(400).json({
          error: `Duration ${duration} requires exactly ${daysNum} itinerary days, but ${itinerary.length} were provided.`,
        })
      }
      for (const d of itinerary) {
        if (!d.title || !String(d.title).trim()) {
          return res.status(400).json({ error: `Itinerary Day ${d.day || '?'} must have a title.` })
        }
      }
    }

    const saved = saveTourPackage({
      id: packageId,
      tour_type: existing.tour_type,
      tour_id: existing.tour_id,
      tour_slug: tour_slug || existing.tour_slug,
      duration: duration.trim(),
      days: daysNum,
      nights: nightsNum,
      price: price !== undefined && price !== '' ? Number(price) : existing.price,
      original_price: original_price !== undefined && original_price !== '' ? Number(original_price) : existing.original_price,
      is_default: is_default !== undefined ? (is_default ? 1 : 0) : existing.is_default,
      itinerary,
    })

    logActivity({
      user_name: req.user.full_name || req.user.username || req.user.email,
      action: 'Updated Package Full',
      module: 'Tours',
      details: `Package #${packageId} (${saved.duration}) with ${saved.itinerary?.length || 0} days`,
    })

    res.json({ package: saved })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update basic package metadata (without modifying itinerary)
toursRouter.put('/admin/packages/:packageId', authRequired, requirePermission('services.edit'), (req, res) => {
  try {
    const packageId = Number(req.params.packageId)
    const existing = db.prepare('SELECT * FROM tour_duration_packages WHERE id = ?').get(packageId)
    if (!existing) {
      return res.status(404).json({ error: 'Package not found' })
    }

    const { duration, days, nights, price, original_price, tour_slug, is_default } = req.body

    const saved = saveTourPackage({
      id: packageId,
      tour_type: existing.tour_type,
      tour_id: existing.tour_id,
      tour_slug: tour_slug || existing.tour_slug,
      duration: duration ? duration.trim() : existing.duration,
      days: days != null ? Number(days) : existing.days,
      nights: nights != null ? Number(nights) : existing.nights,
      price: price != null ? Number(price) : existing.price,
      original_price: original_price != null ? Number(original_price) : existing.original_price,
      is_default: is_default != null ? (is_default ? 1 : 0) : existing.is_default,
    })

    logActivity({
      user_name: req.user.full_name || req.user.username || req.user.email,
      action: 'Updated Package',
      module: 'Tours',
      details: `Package #${packageId}`,
    })

    res.json({ package: saved })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete a duration package (and all its itinerary days)
toursRouter.delete('/admin/packages/:packageId', authRequired, requirePermission('services.delete'), (req, res) => {
  try {
    const packageId = Number(req.params.packageId)
    const existing = db.prepare('SELECT * FROM tour_duration_packages WHERE id = ?').get(packageId)
    if (!existing) {
      return res.status(404).json({ error: 'Package not found' })
    }

    deleteTourPackage(packageId)

    logActivity({
      user_name: req.user.full_name || req.user.username || req.user.email,
      action: 'Deleted Package',
      module: 'Tours',
      details: `Package #${packageId} (${existing.duration})`,
    })

    res.json({ success: true, message: 'Package and itinerary deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add or update a single itinerary day
toursRouter.post('/admin/packages/:packageId/itinerary', authRequired, requirePermission('services.edit'), (req, res) => {
  try {
    const packageId = Number(req.params.packageId)
    const existingPkg = db.prepare('SELECT * FROM tour_duration_packages WHERE id = ?').get(packageId)
    if (!existingPkg) return res.status(404).json({ error: 'Package not found' })

    const { day, title, description, activities, meals, overnight } = req.body
    if (!day || isNaN(Number(day))) {
      return res.status(400).json({ error: 'Valid day number is required' })
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Day title is required' })
    }

    const savedDay = saveItineraryDay(packageId, {
      day: Number(day),
      title: title.trim(),
      description: description || '',
      activities: activities || [],
      meals: meals || [],
      overnight: overnight || '',
    })

    res.status(201).json({ day: savedDay })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete a single itinerary day
toursRouter.delete('/admin/packages/:packageId/itinerary/:day', authRequired, requirePermission('services.edit'), (req, res) => {
  try {
    const packageId = Number(req.params.packageId)
    const day = Number(req.params.day)
    deleteItineraryDay(packageId, day)
    res.json({ success: true, message: `Day ${day} deleted` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default toursRouter
