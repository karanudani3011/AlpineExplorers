import { supabase } from './supabaseClient'
import { api } from './api'

// =========================================================================
// PUBLIC USER METHODS (ZERO HARDCODED DEMO DATA)
// =========================================================================

/**
 * Fetch all categories from Supabase
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.warn('[galleryService] Supabase getCategories error:', error.message)
      return { data: [], error }
    }
    return { data: data || [], error: null }
  } catch (err) {
    console.warn('[galleryService] Network error fetching categories:', err.message)
    return { data: [], error: err }
  }
}

/**
 * Fetch categories with published item counts computed from real database data.
 * When filterEmpty = true (user side), hides categories with 0 published items.
 */
export async function getCategoriesWithCounts({ filterEmpty = true } = {}) {
  try {
    const [catRes, countRes] = await Promise.all([
      supabase.from('gallery_categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('gallery_images').select('category_id').eq('is_published', true),
    ])

    if (catRes.error) {
      return { data: [], error: catRes.error }
    }

    const categories = catRes.data || []
    const publishedItems = countRes.data || []

    // Build count dictionary
    const counts = {}
    publishedItems.forEach((item) => {
      if (item.category_id) {
        counts[item.category_id] = (counts[item.category_id] || 0) + 1
      }
    })

    const result = categories.map((cat) => ({
      ...cat,
      count: counts[cat.id] || 0,
    }))

    const filtered = filterEmpty ? result.filter((cat) => cat.count > 0) : result
    return { data: filtered, totalItems: publishedItems.length, error: null }
  } catch (err) {
    console.warn('[galleryService] getCategoriesWithCounts error:', err.message)
    return { data: [], totalItems: 0, error: err }
  }
}

/**
 * Fetch published gallery items with pagination, category filter, media_type filter & search.
 * ONLY returns published rows from Supabase gallery_images. No demo fallbacks.
 */
export async function getPublishedImages({
  categorySlug = 'all',
  mediaType = 'all', // 'all' | 'photos' | 'videos'
  search = '',
  page = 0,
  limit = 24,
} = {}) {
  try {
    let query = supabase
      .from('gallery_images')
      .select('*, category:gallery_categories(*)', { count: 'exact' })
      .eq('is_published', true)

    // Category filter
    if (categorySlug && categorySlug !== 'all') {
      const { data: catData } = await supabase
        .from('gallery_categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle()

      if (catData?.id) {
        query = query.eq('category_id', catData.id)
      } else {
        // Category not found -> empty result
        return { data: [], total: 0, hasMore: false, error: null }
      }
    }

    // Media type filter
    if (mediaType === 'photos') {
      query = query.or('media_type.eq.image,resource_type.eq.image,media_type.is.null')
    } else if (mediaType === 'videos') {
      query = query.or('media_type.eq.video,resource_type.eq.video')
    }

    // Search query
    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      query = query.or(`title.ilike.${q},caption.ilike.${q},location.ilike.${q}`)
    }

    // Ordering: featured first, then sort_order asc, created_at desc
    const from = page * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.warn('[galleryService] getPublishedImages error:', error.message)
      return { data: [], total: 0, hasMore: false, error }
    }

    const items = data || []
    const total = count || items.length
    const hasMore = to < total - 1

    return { data: items, total, hasMore, error: null }
  } catch (err) {
    console.warn('[galleryService] getPublishedImages network error:', err.message)
    return { data: [], total: 0, hasMore: false, error: err }
  }
}

/**
 * Fetch featured published items for Curated Highlights strip.
 * Returns empty array if none exist (hides the strip).
 */
export async function getFeaturedImages(limit = 8) {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*, category:gallery_categories(*)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.warn('[galleryService] getFeaturedImages error:', error.message)
      return { data: [], error }
    }
    return { data: data || [], error: null }
  } catch (err) {
    return { data: [], error: err }
  }
}

// =========================================================================
// ADMIN METHODS
// =========================================================================

/**
 * Fetch all gallery images & videos for admin management
 * Calls backend GET /api/admin/gallery
 */
export async function getAllImagesAdmin({
  categoryId = 'all',
  mediaType = 'all',
  isPublished = 'all',
  isFeatured = 'all',
  search = '',
  page = 0,
  limit = 100,
} = {}) {
  try {
    const params = new URLSearchParams()
    if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId)
    if (mediaType && mediaType !== 'all') params.append('mediaType', mediaType)
    if (isPublished !== 'all') params.append('isPublished', String(isPublished))
    if (isFeatured !== 'all') params.append('isFeatured', String(isFeatured))
    if (search && search.trim()) params.append('search', search.trim())
    params.append('page', String(page))
    params.append('limit', String(limit))

    const res = await api.get(`/admin/gallery?${params.toString()}`)
    return { data: res.data || [], count: res.count ?? (res.data ? res.data.length : 0), error: null }
  } catch (err) {
    console.error('[galleryService] getAllImagesAdmin error:', err.message)
    return { data: [], count: 0, error: err }
  }
}

/**
 * Insert a single gallery media item
 * Calls backend POST /api/admin/gallery
 */
export async function createGalleryImage(item) {
  const res = await api.post('/admin/gallery', item)
  return res.data
}

/**
 * Insert multiple gallery items in batch
 * Calls backend POST /api/admin/gallery with { items }
 */
export async function createGalleryImagesBatch(itemsArray) {
  if (!itemsArray || itemsArray.length === 0) return []
  const res = await api.post('/admin/gallery', { items: itemsArray })
  return res.data || []
}

/**
 * Update an existing gallery image or video
 * Calls backend PATCH /api/admin/gallery/:id
 */
export async function updateGalleryImage(id, updates) {
  const res = await api.patch(`/admin/gallery/${id}`, updates)
  return res.data
}

/**
 * Delete a gallery media item by ID.
 * Backend handles both Cloudinary asset destruction AND Supabase row removal.
 * Calls backend DELETE /api/admin/gallery/:id
 */
export async function deleteGalleryImage(id) {
  await api.del(`/admin/gallery/${id}`)
  return true
}

/**
 * Bulk delete multiple media items (photos and videos)
 * Calls backend POST /api/admin/gallery/bulk with { action: 'delete', ids }
 */
export async function bulkDeleteImages(items = []) {
  if (!items.length) return false
  const ids = items.map((item) => (typeof item === 'object' ? item.id : item))
  await api.post('/admin/gallery/bulk', { action: 'delete', ids })
  return true
}

/**
 * Bulk update multiple images (publish, unpublish, category)
 * Calls backend POST /api/admin/gallery/bulk
 */
export async function bulkUpdateImages(ids = [], updates = {}) {
  if (!ids.length) return false
  if (updates.is_published !== undefined) {
    await api.post('/admin/gallery/bulk', {
      action: updates.is_published ? 'publish' : 'unpublish',
      ids,
    })
    return true
  }
  if (updates.category_id !== undefined) {
    await api.post('/admin/gallery/bulk', {
      action: 'category',
      ids,
      category_id: updates.category_id,
    })
    return true
  }
  return true
}

/**
 * Update sort order for reordered items
 * Calls backend PATCH /api/admin/gallery/reorder
 */
export async function updateImageSortOrders(orderList = []) {
  if (!orderList.length) return true
  await api.patch('/admin/gallery/reorder', { items: orderList })
  return true
}

/**
 * Category management: Add new category
 * Calls backend POST /api/admin/gallery/categories
 */
export async function createCategory({ name, slug, sort_order = 0 }) {
  const res = await api.post('/admin/gallery/categories', { name, slug, sort_order })
  return res.data
}

/**
 * Category management: Update existing category
 * Calls backend PATCH /api/admin/gallery/categories/:id
 */
export async function updateCategory(id, updates) {
  const res = await api.patch(`/admin/gallery/categories/${id}`, updates)
  return res.data
}

/**
 * Category management: Delete category
 * Calls backend DELETE /api/admin/gallery/categories/:id
 */
export async function deleteCategory(id) {
  await api.del(`/admin/gallery/categories/${id}`)
  return true
}
