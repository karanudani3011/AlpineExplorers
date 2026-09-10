import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import TourApplicationForm from './TourApplicationForm'

export default function ApplicationFormModal({ isOpen, onClose, courseName = '' }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm overflow-y-auto p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="w-full max-w-3xl mx-auto my-2 sm:my-6 bg-white rounded-lg overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal chrome bar (keeps form itself untouched) */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 bg-[#b3211f] text-white">
            <span className="text-xs sm:text-sm font-bold tracking-wide" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              ALPINE EXPLORERS — APPLICATION FORM
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition"
              aria-label="Close application form"
            >
              <X size={17} />
            </button>
          </div>

          <div className="p-3 sm:p-5">
            <TourApplicationForm courseName={courseName} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}