import { useState } from 'react'
import { X, Plus, Trash2, Edit2, Check, ArrowUp, ArrowDown } from 'lucide-react'
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/galleryService'
import { Btn, NAVY, GOLD } from '../admin-ui'

export default function CategoryManager({
  categories = [],
  onClose,
  onRefreshCategories,
  addToast,
}) {
  const [newCatName, setNewCatName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    setLoading(true)
    try {
      const slug = newCatName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

      await createCategory({
        name: newCatName.trim(),
        slug,
        sort_order: categories.length + 1,
      })

      setNewCatName('')
      addToast('Category created successfully', 'success')
      onRefreshCategories()
    } catch (err) {
      addToast(err.message || 'Failed to create category', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return

    setLoading(true)
    try {
      const slug = editingName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

      await updateCategory(id, { name: editingName.trim(), slug })
      setEditingId(null)
      setEditingName('')
      addToast('Category updated successfully', 'success')
      onRefreshCategories()
    } catch (err) {
      addToast(err.message || 'Failed to update category', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return

    setLoading(true)
    try {
      await deleteCategory(cat.id)
      addToast('Category deleted', 'success')
      onRefreshCategories()
    } catch (err) {
      addToast(err.message || 'Failed to delete category', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const currentCat = categories[index]
    const targetCat = categories[targetIndex]

    setLoading(true)
    try {
      await Promise.all([
        updateCategory(currentCat.id, { sort_order: targetCat.sort_order ?? targetIndex }),
        updateCategory(targetCat.id, { sort_order: currentCat.sort_order ?? index }),
      ])
      onRefreshCategories()
    } catch (err) {
      addToast('Failed to update sort order', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col border border-[rgba(180,160,130,0.35)]"
        style={{ maxHeight: 'calc(100vh - 40px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h3 className="font-bold text-base text-stone-900" style={{ fontFamily: 'Cinzel, serif', color: NAVY }}>
            Manage Gallery Categories
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Wildlife Safaris, Island Odysseys"
              disabled={loading}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[var(--ae-gold)]"
            />
            <Btn type="submit" disabled={loading || !newCatName.trim()}>
              <Plus size={14} /> Add Category
            </Btn>
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Current Categories ({categories.length})
            </span>

            {categories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition"
              >
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-stone-300 bg-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdate(cat.id)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      aria-label="Save"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300 transition"
                      aria-label="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-stone-400">slug: {cat.slug}</div>
                  </div>
                )}

                {/* Reorder and Action Buttons */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(idx, -1)}
                    disabled={idx === 0 || loading}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(idx, 1)}
                    disabled={idx === categories.length - 1 || loading}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(cat.id)
                      setEditingName(cat.name)
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-900 transition ml-1"
                    title="Edit Name"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-red-400 hover:text-red-600 transition"
                    title="Delete Category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 flex justify-end bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

