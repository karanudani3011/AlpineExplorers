import { useState, useEffect, useCallback } from 'react'
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  FolderPlus,
  RefreshCw,
  Star,
  CheckSquare,
  Square,
  X,
  Video as VideoIcon,
  Layers,
  Camera,
} from 'lucide-react'
import { useToasts } from '../../components/admin/useToasts'
import { PageHeader, Btn, Card, Spinner, NAVY, GOLD } from '../../components/admin/admin-ui'
import {
  getCategories,
  getAllImagesAdmin,
  updateGalleryImage,
  deleteGalleryImage,
  bulkUpdateImages,
  bulkDeleteImages,
  updateImageSortOrders,
} from '../../services/galleryService'
import UploadDropzone from '../../components/admin/gallery/UploadDropzone'
import GalleryAdminGrid from '../../components/admin/gallery/GalleryAdminGrid'
import EditImageModal from '../../components/admin/gallery/EditImageModal'
import CategoryManager from '../../components/admin/gallery/CategoryManager'

export default function GalleryManagement() {
  const { toasts, addToast, dismiss, ToastHost } = useToasts()

  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all') // 'all' | 'photos' | 'videos'
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'true' | 'false'
  const [featuredFilter, setFeaturedFilter] = useState('all') // 'all' | 'true' | 'false'
  const [searchQuery, setSearchQuery] = useState('')

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState([])

  // Modal Dialogs
  const [uploadOpen, setUploadOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [editingImage, setEditingImage] = useState(null)

  // Load Categories & Images
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [catRes, imgRes] = await Promise.all([
        getCategories(),
        getAllImagesAdmin({
          categoryId: categoryFilter,
          mediaType: mediaTypeFilter,
          isPublished: statusFilter,
          isFeatured: featuredFilter,
          search: searchQuery,
        }),
      ])

      if (catRes.data) setCategories(catRes.data)
      if (imgRes.data) setImages(imgRes.data)
    } catch (err) {
      addToast(err.message || 'Failed to load gallery data', 'error')
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, mediaTypeFilter, statusFilter, featuredFilter, searchQuery, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Selection toggles
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === images.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(images.map((img) => img.id))
    }
  }

  // Quick Action: Toggle Publish
  const handleTogglePublish = async (item) => {
    const nextStatus = !item.is_published
    // Optimistic update
    setImages((prev) =>
      prev.map((img) => (img.id === item.id ? { ...img, is_published: nextStatus } : img))
    )

    try {
      await updateGalleryImage(item.id, { is_published: nextStatus })
      addToast(nextStatus ? 'Published to gallery' : 'Hidden from public', 'success')
    } catch (err) {
      // Rollback
      setImages((prev) =>
        prev.map((img) => (img.id === item.id ? { ...img, is_published: !nextStatus } : img))
      )
      addToast(err.message || 'Failed to update visibility', 'error')
    }
  }

  // Quick Action: Toggle Featured
  const handleToggleFeatured = async (item) => {
    const nextFeatured = !item.is_featured
    // Optimistic update
    setImages((prev) =>
      prev.map((img) => (img.id === item.id ? { ...img, is_featured: nextFeatured } : img))
    )

    try {
      await updateGalleryImage(item.id, { is_featured: nextFeatured })
      addToast(nextFeatured ? 'Added to Curated Highlights' : 'Removed from Featured', 'success')
    } catch (err) {
      // Rollback
      setImages((prev) =>
        prev.map((img) => (img.id === item.id ? { ...img, is_featured: !nextFeatured } : img))
      )
      addToast(err.message || 'Failed to update featured flag', 'error')
    }
  }

  // Single Delete with Confirmation Dialog
  const handleDeleteImage = async (item) => {
    const isVid =
      item.media_type === 'video' ||
      item.resource_type === 'video' ||
      /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(item.image_url)

    const confirmed = window.confirm(
      `Delete this ${isVid ? 'video' : 'photo'} permanently?\n\n"${item.title}"\n\nThis will remove it from the database and Cloudinary.`
    )
    if (!confirmed) return

    // Optimistic delete
    const originalList = [...images]
    setImages((prev) => prev.filter((img) => img.id !== item.id))
    setSelectedIds((prev) => prev.filter((id) => id !== item.id))

    try {
      await deleteGalleryImage(item.id, item.public_id, isVid ? 'video' : 'image')
      addToast(`${isVid ? 'Video' : 'Photo'} deleted permanently`, 'success')
    } catch (err) {
      // Rollback
      setImages(originalList)
      console.error('[GalleryManagement] Delete error:', err)
      addToast(err.message || 'Failed to delete item', 'error')
    }
  }

  // Reorder Handler
  const handleReorder = async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return
    const reordered = Array.from(images)
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    const updatedWithSort = reordered.map((img, idx) => ({ ...img, sort_order: idx + 1 }))
    setImages(updatedWithSort)

    try {
      await updateImageSortOrders(
        updatedWithSort.map((img) => ({ id: img.id, sort_order: img.sort_order }))
      )
    } catch (err) {
      addToast('Failed to save sort order', 'error')
      loadData()
    }
  }

  // Bulk Actions
  const handleBulkPublish = async (isPub) => {
    if (!selectedIds.length) return
    try {
      await bulkUpdateImages(selectedIds, { is_published: isPub })
      addToast(
        `Updated ${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''} to ${
          isPub ? 'Published' : 'Hidden'
        }`,
        'success'
      )
      loadData()
    } catch (err) {
      addToast('Bulk update failed: ' + err.message, 'error')
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return
    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected items permanently?\n\nThis will remove them from the database and Cloudinary storage.`
    )
    if (!confirmed) return

    const originalList = [...images]
    const itemsToDelete = images.filter((img) => selectedIds.includes(img.id))
    setImages((prev) => prev.filter((img) => !selectedIds.includes(img.id)))
    setSelectedIds([])

    try {
      await bulkDeleteImages(itemsToDelete)
      addToast(`${itemsToDelete.length} items deleted permanently`, 'success')
    } catch (err) {
      setImages(originalList)
      console.error('[GalleryManagement] Bulk delete error:', err)
      addToast(err.message || 'Bulk delete failed', 'error')
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <PageHeader
        icon={ImageIcon}
        title="Gallery Management"
        subtitle="Upload, curate, and organize high-resolution photos and videos for the public gallery"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Btn
              variant="secondary"
              onClick={() => setCategoriesOpen(true)}
              className="min-h-[44px] flex items-center gap-1.5"
            >
              <FolderPlus size={15} /> Categories ({categories.length})
            </Btn>
            <Btn
              onClick={() => setUploadOpen(true)}
              className="min-h-[44px] flex items-center gap-1.5"
            >
              <Upload size={15} /> Upload Photos & Videos
            </Btn>
          </div>
        }
      />

      {/* Upload Dropzone Collapse / Modal */}
      {uploadOpen && (
        <Card className="border-2 border-[rgba(180,160,130,0.4)] bg-amber-50/20 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
            <h3 className="font-bold text-base text-stone-900" style={{ fontFamily: 'Cinzel, serif', color: NAVY }}>
              Upload Photos & Videos to Cloudinary
            </h3>
            <button
              type="button"
              onClick={() => setUploadOpen(false)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 transition"
              aria-label="Close uploader"
            >
              <X size={20} />
            </button>
          </div>

          <UploadDropzone
            categories={categories}
            onUploadSuccess={() => {
              loadData()
            }}
            onClose={() => setUploadOpen(false)}
            addToast={addToast}
          />
        </Card>
      )}

      {/* Filter & Search Bar */}
      <Card className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Media Type Tabs: All / Photos / Videos */}
          <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 self-start">
            <button
              type="button"
              onClick={() => setMediaTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mediaTypeFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Layers size={13} /> All Media
            </button>
            <button
              type="button"
              onClick={() => setMediaTypeFilter('photos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mediaTypeFilter === 'photos'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Camera size={13} /> Photos
            </button>
            <button
              type="button"
              onClick={() => setMediaTypeFilter('videos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mediaTypeFilter === 'videos'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <VideoIcon size={13} /> Videos
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 lg:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg px-2.5 py-1.5 border border-stone-200 bg-white font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg px-2.5 py-1.5 border border-stone-200 bg-white font-medium focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="true">Published</option>
              <option value="false">Hidden</option>
            </select>
          </div>

          {/* Featured Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Featured:</span>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="rounded-lg px-2.5 py-1.5 border border-stone-200 bg-white font-medium focus:outline-none"
            >
              <option value="all">All</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(categoryFilter !== 'all' ||
            mediaTypeFilter !== 'all' ||
            statusFilter !== 'all' ||
            featuredFilter !== 'all' ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all')
                setMediaTypeFilter('all')
                setStatusFilter('all')
                setFeaturedFilter('all')
                setSearchQuery('')
              }}
              className="text-stone-500 hover:text-stone-800 underline ml-auto text-[11px]"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Bulk Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 transition"
          >
            {selectedIds.length > 0 && selectedIds.length === images.length ? (
              <CheckSquare size={16} className="text-navy" />
            ) : (
              <Square size={16} className="text-stone-400" />
            )}
            <span>Select All ({images.length})</span>
          </button>

          {selectedIds.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleBulkPublish(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1"
            >
              <Eye size={13} /> Publish
            </button>
            <button
              type="button"
              onClick={() => handleBulkPublish(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition flex items-center gap-1"
            >
              <EyeOff size={13} /> Hide
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition flex items-center gap-1"
            >
              <Trash2 size={13} /> Delete Selected ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Admin Grid */}
      {loading ? (
        <Spinner />
      ) : images.length === 0 ? (
        <Card className="text-center py-16">
          <div
            className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgb(var(--ae-gold-rgb) / 0.15)', color: NAVY }}
          >
            <ImageIcon size={28} />
          </div>
          <h3 className="font-bold text-base text-stone-900 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
            No Media Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Upload tour photos and videos to showcase journeys in the gallery.
          </p>
          <Btn onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-1.5">
            <Upload size={14} /> Upload First Item
          </Btn>
        </Card>
      ) : (
        <GalleryAdminGrid
          images={images}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onEdit={(img) => setEditingImage(img)}
          onTogglePublish={handleTogglePublish}
          onToggleFeatured={handleToggleFeatured}
          onDelete={handleDeleteImage}
          onReorder={handleReorder}
        />
      )}

      {/* Edit Item Modal */}
      {editingImage && (
        <EditImageModal
          image={editingImage}
          categories={categories}
          onClose={() => setEditingImage(null)}
          onSaveSuccess={(updated) => {
            setImages((prev) => prev.map((img) => (img.id === updated.id ? updated : img)))
            setEditingImage(null)
          }}
          addToast={addToast}
        />
      )}

      {/* Category Manager Modal */}
      {categoriesOpen && (
        <CategoryManager
          categories={categories}
          onClose={() => setCategoriesOpen(false)}
          onCategoriesUpdated={() => loadData()}
          addToast={addToast}
        />
      )}

      <ToastHost />
    </div>
  )
}
