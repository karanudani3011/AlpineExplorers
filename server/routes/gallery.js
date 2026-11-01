import { Router } from 'express'
import { authRequired } from '../middleware.js'
import { supabaseAdmin, getSupabaseServiceRoleKey, getSafeEnvDiagnostics } from '../utils/supabase.js'
import { cloudinary } from '../utils/cloudinary.js'
import { logActivity } from '../db.js'

const router = Router()
router.use(authRequired)

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(val) {
  return typeof val === 'string' && UUID_REGEX.test(val.trim())
}

function checkServiceRoleKey(res) {
  const key = getSupabaseServiceRoleKey()
  if (!key) {
    console.error(
      '[Gallery Admin] Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_SECRET_KEY is set in environment variables! ' +
      'Cannot execute privileged backend write.'
    )
    res.status(500).json({
      error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) is missing from server environment variables. Please add it to your server .env and Render dashboard.',
      code: 'MISSING_SUPABASE_SERVICE_ROLE_KEY',
    })
    return false
  }
  return true
}

// Safe diagnostic route for admin troubleshooting (NAMES only, no secret values)
router.get('/diagnostics', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: getSafeEnvDiagnostics(),
  })
})

const ALLOWED_MEDIA_FIELDS = [
  'title',
  'caption',
  'image_url',
  'thumbnail_url',
  'public_id',
  'width',
  'height',
  'category_id',
  'location',
  'is_featured',
  'is_published',
  'sort_order',
  'media_type',
  'resource_type',
  'duration',
  'uploaded_by',
]

function sanitizeMediaRow(input, user) {
  const row = {}

  row.title = typeof input.title === 'string' && input.title.trim() ? input.title.trim() : 'Untitled'
  row.caption = typeof input.caption === 'string' ? input.caption.trim() : ''
  row.image_url = typeof input.image_url === 'string' ? input.image_url.trim() : ''
  row.thumbnail_url = typeof input.thumbnail_url === 'string' && input.thumbnail_url.trim()
    ? input.thumbnail_url.trim()
    : row.image_url
  row.public_id = (typeof input.public_id === 'string' && input.public_id.trim())
    ? input.public_id.trim()
    : (row.image_url ? row.image_url.split('/').pop().split('.')[0] : 'asset_' + Date.now())
  row.location = typeof input.location === 'string' ? input.location.trim() : ''

  const resType = (input.resource_type || input.media_type || 'image').toLowerCase()
  row.media_type = resType === 'video' ? 'video' : 'image'
  row.resource_type = resType === 'video' ? 'video' : 'image'

  row.width = Number(input.width) || 1200
  row.height = Number(input.height) || 800
  row.duration = input.duration !== undefined && input.duration !== null ? Number(input.duration) : null

  if (input.category_id && isValidUUID(input.category_id)) {
    row.category_id = input.category_id
  } else {
    row.category_id = null
  }

  row.is_featured = Boolean(input.is_featured)
  row.is_published = input.is_published !== false
  row.sort_order = Number(input.sort_order) || 0
  row.uploaded_by = input.uploaded_by || user?.username || user?.email || user?.id || null

  return row
}

// ============================================================================
// 1. CATEGORY CRUD (Mounted before :id to prevent param collision)
// ============================================================================

router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[Admin Gallery] Fetch categories error:', error)
      return res.status(500).json({ error: error.message, code: error.code })
    }
    res.json({ data: data || [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/categories', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const { name, slug, sort_order = 0 } = req.body || {}
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' })
    }

    const cleanSlug = slug && typeof slug === 'string' && slug.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
      : name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')

    const { data, error } = await supabaseAdmin
      .from('gallery_categories')
      .insert([{ name: name.trim(), slug: cleanSlug, sort_order: Number(sort_order) || 0 }])
      .select()
      .single()

    if (error) {
      console.error('[Admin Gallery] Insert category error:', error)
      return res.status(error.code === '42501' ? 403 : 400).json({ error: error.message, code: error.code })
    }

    logActivity({
      user_name: req.user?.username || req.user?.email || 'admin',
      action: 'Gallery category created',
      module: 'Gallery',
      details: name,
    })

    res.status(201).json({ data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/categories/:id', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const { id } = req.params
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Category ID must be a valid UUID' })
    }

    const updates = {}
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim()
    if (req.body.slug !== undefined) {
      updates.slug = String(req.body.slug).trim().toLowerCase().replace(/\s+/g, '-')
    }
    if (req.body.sort_order !== undefined) updates.sort_order = Number(req.body.sort_order) || 0

    const { data, error } = await supabaseAdmin
      .from('gallery_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Admin Gallery] Update category error:', error)
      return res.status(error.code === '42501' ? 403 : 400).json({ error: error.message, code: error.code })
    }

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/categories/:id', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const { id } = req.params
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Category ID must be a valid UUID' })
    }

    const { error } = await supabaseAdmin
      .from('gallery_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[Admin Gallery] Delete category error:', error)
      return res.status(error.code === '42501' ? 403 : 400).json({ error: error.message, code: error.code })
    }

    logActivity({
      user_name: req.user?.username || req.user?.email || 'admin',
      action: 'Gallery category deleted',
      module: 'Gallery',
      details: id,
    })

    res.json({ success: true, id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================================================================
// 2. BULK OPERATIONS & REORDER (Mounted before :id to prevent param collision)
// ============================================================================

router.patch('/reorder', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const { items } = req.body || {}
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'items array is required for reordering' })
    }

    for (const it of items) {
      if (!isValidUUID(it.id)) {
        return res.status(400).json({ error: `Invalid UUID: ${it.id}` })
      }
    }

    const updates = items.map((it) =>
      supabaseAdmin
        .from('gallery_images')
        .update({ sort_order: Number(it.sort_order) || 0 })
        .eq('id', it.id)
    )

    await Promise.all(updates)
    res.json({ success: true, count: items.length })
  } catch (err) {
    console.error('[Admin Gallery Reorder] Error:', err)
    res.status(500).json({ error: err.message })
  }
})

router.post('/bulk', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const { ids, action, category_id } = req.body || {}
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ error: 'ids array is required for bulk actions' })
    }

    for (const id of ids) {
      if (!isValidUUID(id)) {
        return res.status(400).json({ error: `Invalid UUID: ${id}` })
      }
    }

    if (action === 'publish') {
      const { error } = await supabaseAdmin
        .from('gallery_images')
        .update({ is_published: true, updated_at: new Date().toISOString() })
        .in('id', ids)

      if (error) return res.status(error.code === '42501' ? 403 : 400).json({ error: error.message, code: error.code })
      return res.json({ success: true, count: ids.length, action })
    }

    if (action === 'unpublish') {
      const { error } = await supabaseAdmin
        .from('gallery_images')
        .update({ is_published: false, updated_at: new Date().toISOString() })
        .in('id', ids)

      if (error) return res.status(error.code === '42501' ? 403 : 400).json({ error: error.message, code: error.code })
      return res.json({ success: true, count: ids.length, action })
    }

    if (action === 'category') {
      const cleanCatId = category_id && isValidUUID(category_id) ? category_id : null
      const { error } = await supabaseAdmin
        .from('gallery_images')
        .update({ category_id: cleanCatId, updated_at: new Date().toISOString() })
        .in('id', ids)

      if (error) return res.status(error.code === '42501' ? 403 : 400).json({ error: error.message, code: error.code })
      return res.json({ success: true, count: ids.length, action })
    }

    if (action === 'delete') {
      // 1. Fetch Cloudinary public_ids for clean deletion
      const { data: existingList } = await supabaseAdmin
        .from('gallery_images')
        .select('id, public_id, media_type, resource_type')
        .in('id', ids)

      if (existingList && existingList.length) {
        await Promise.allSettled(
          existingList.map(async (item) => {
            if (item.public_id) {
              const resType = item.resource_type === 'video' || item.media_type === 'video' ? 'video' : 'image'
              return cloudinary.uploader.destroy(item.public_id, { resource_type: resType, invalidate: true })
            }
          })
        )
      }

      // 2. Delete rows from database
      const { error } = await supabaseAdmin
        .from('gallery_images')
        .delete()
        .in('id', ids)

      if (error) return res.status(error.code === '42501' ? 403 : 400).json({ error: error.message, code: error.code })

      logActivity({
        user_name: req.user?.username || req.user?.email || 'admin',
        action: 'Gallery items bulk deleted',
        module: 'Gallery',
        details: `${ids.length} items deleted`,
      })

      return res.json({ success: true, count: ids.length, action })
    }

    return res.status(400).json({ error: `Unsupported bulk action: ${action}` })
  } catch (err) {
    console.error('[Admin Gallery Bulk] Error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ============================================================================
// 3. MAIN GALLERY MEDIA CRUD
// ============================================================================

/**
 * GET /api/admin/gallery
 * Returns all media items (published and unpublished) with category joins & filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      categoryId = 'all',
      mediaType = 'all',
      isPublished = 'all',
      isFeatured = 'all',
      search = '',
      page = 0,
      limit = 100,
    } = req.query

    let query = supabaseAdmin
      .from('gallery_images')
      .select('*, category:gallery_categories(*)', { count: 'exact' })

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }

    if (mediaType === 'photos') {
      query = query.or('media_type.eq.image,resource_type.eq.image,media_type.is.null')
    } else if (mediaType === 'videos') {
      query = query.or('media_type.eq.video,resource_type.eq.video')
    }

    if (isPublished !== 'all') {
      query = query.eq('is_published', isPublished === 'true' || isPublished === true)
    }

    if (isFeatured !== 'all') {
      query = query.eq('is_featured', isFeatured === 'true' || isFeatured === true)
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      query = query.or(`title.ilike.${q},caption.ilike.${q},location.ilike.${q}`)
    }

    const pageNum = Math.max(0, parseInt(page, 10) || 0)
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 100))
    const from = pageNum * limitNum
    const to = from + limitNum - 1

    const { data, error, count } = await query
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('[Admin Gallery GET] Error:', error)
      return res.status(error.code === '42501' ? 403 : 500).json({
        error: error.message,
        code: error.code,
        details: error.details,
      })
    }

    res.json({ data: data || [], count: count ?? (data?.length || 0) })
  } catch (err) {
    console.error('[Admin Gallery GET] Exception:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/admin/gallery
 * Insert a single gallery media item OR a batch array of items
 */
router.post('/', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const isBatch = Array.isArray(req.body) || (req.body && Array.isArray(req.body.items))
    const rawItems = isBatch ? (Array.isArray(req.body) ? req.body : req.body.items) : [req.body]

    if (!rawItems.length) {
      return res.status(400).json({ error: 'No gallery item data provided' })
    }

    const rows = []
    for (const item of rawItems) {
      if (!item || !item.image_url) {
        return res.status(400).json({ error: 'image_url is required for all gallery items' })
      }
      rows.push(sanitizeMediaRow(item, req.user))
    }

    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .insert(rows)
      .select('*, category:gallery_categories(*)')

    if (error) {
      console.error('[Admin Gallery Insert] Supabase error:', error)
      return res.status(error.code === '42501' ? 403 : 400).json({
        error: error.message,
        code: error.code,
        details: error.details,
      })
    }

    logActivity({
      user_name: req.user?.username || req.user?.email || 'admin',
      action: isBatch ? `Gallery batch inserted (${rows.length} items)` : 'Gallery item inserted',
      module: 'Gallery',
      details: rows.map((r) => r.title).join(', '),
    })

    if (isBatch) {
      res.status(201).json({ data, count: data.length })
    } else {
      res.status(201).json({ data: data[0] })
    }
  } catch (err) {
    console.error('[Admin Gallery Insert] Exception:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * PATCH /api/admin/gallery/:id
 * Update an existing gallery item
 */
router.patch('/:id', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const { id } = req.params
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Image ID must be a valid UUID' })
    }

    const updates = {}
    for (const key of ALLOWED_MEDIA_FIELDS) {
      if (req.body[key] !== undefined) {
        if (key === 'category_id') {
          updates[key] = req.body[key] && isValidUUID(req.body[key]) ? req.body[key] : null
        } else if (key === 'is_featured' || key === 'is_published') {
          updates[key] = Boolean(req.body[key])
        } else if (key === 'width' || key === 'height' || key === 'sort_order') {
          updates[key] = Number(req.body[key]) || 0
        } else if (key === 'duration') {
          updates[key] = req.body[key] !== null ? Number(req.body[key]) : null
        } else {
          updates[key] = req.body[key]
        }
      }
    }
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select('*, category:gallery_categories(*)')
      .single()

    if (error) {
      console.error('[Admin Gallery Update] Supabase error:', error)
      return res.status(error.code === '42501' ? 403 : 400).json({
        error: error.message,
        code: error.code,
        details: error.details,
      })
    }

    res.json({ data })
  } catch (err) {
    console.error('[Admin Gallery Update] Exception:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * DELETE /api/admin/gallery/:id
 * Deletes Cloudinary asset server-side AND removes row from Supabase
 */
router.delete('/:id', async (req, res) => {
  if (!checkServiceRoleKey(res)) return
  try {
    const { id } = req.params
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Image ID must be a valid UUID' })
    }

    // 1. Fetch item to obtain public_id and media_type
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('gallery_images')
      .select('id, title, public_id, media_type, resource_type')
      .eq('id', id)
      .maybeSingle()

    if (fetchErr) {
      console.error('[Admin Gallery Delete] Fetch error:', fetchErr)
      return res.status(500).json({ error: fetchErr.message, code: fetchErr.code })
    }

    if (!existing) {
      return res.status(404).json({ error: 'Gallery item not found' })
    }

    // 2. Destroy from Cloudinary server-side
    if (existing.public_id) {
      try {
        const resType = existing.resource_type === 'video' || existing.media_type === 'video' ? 'video' : 'image'
        await cloudinary.uploader.destroy(existing.public_id, {
          resource_type: resType,
          invalidate: true,
        })
      } catch (cloudErr) {
        console.warn('[Admin Gallery Delete] Cloudinary destroy warning:', cloudErr.message)
      }
    }

    // 3. Delete row from Supabase
    const { error: delErr } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (delErr) {
      console.error('[Admin Gallery Delete] Supabase error:', delErr)
      return res.status(delErr.code === '42501' ? 403 : 400).json({
        error: delErr.message,
        code: delErr.code,
        details: delErr.details,
      })
    }

    logActivity({
      user_name: req.user?.username || req.user?.email || 'admin',
      action: 'Gallery item deleted',
      module: 'Gallery',
      details: existing.title || id,
    })

    res.json({ success: true, id })
  } catch (err) {
    console.error('[Admin Gallery Delete] Exception:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router

