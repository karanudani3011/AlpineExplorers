import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, User, ArrowRight, X, Clock, Quote } from 'lucide-react'

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

export default function BlogCard({ blog, index }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border transition-all duration-300 flex flex-col justify-between"
        style={{ backgroundColor: CREAM, borderColor: 'rgba(180,160,130,0.28)', boxShadow: '0 8px 22px rgba(60,40,20,0.1), 0 2px 6px rgba(60,40,20,0.05)' }}
      >
        <div>
          {/* Image */}
          <div className="relative overflow-hidden h-52 sm:h-56">
            <motion.img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137]/75 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold shadow-md" style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage }}>
                {blog.category}
              </span>
            </div>

            <div className="absolute bottom-3 right-4 text-white text-xs flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-md" style={{ backgroundColor: 'rgba(0,26,77,0.55)' }}>
              <Clock size={12} />
              <span>{blog.readTime || '5 min read'}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3
              onClick={() => setModalOpen(true)}
              className="text-[#001a4d] group-hover:text-[#c59b27] transition font-bold text-xl mb-3 line-clamp-2 cursor-pointer"
              style={font.display}
            >
              {blog.title}
            </h3>

            <p className="text-sm mb-4 line-clamp-3 leading-relaxed" style={{ color: BROWN, ...font.body }}>
              {blog.excerpt}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t" style={{ color: 'rgba(58,42,24,0.7)', borderColor: 'rgba(180,160,130,0.25)' }}>
              <div className="flex items-center gap-1.5">
                <User size={14} style={{ color: GOLD }} />
                <span className="font-semibold" style={{ color: '#1e3a5f', ...font.body }}>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} style={{ color: GOLD }} />
                <span className="font-medium">{new Date(blog.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Read more button footer */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={() => setModalOpen(true)}
            className="group/btn w-full py-2.5 rounded-full text-xs uppercase font-bold tracking-wider text-white transition flex items-center justify-center gap-2"
            style={{ backgroundColor: NAVY, ...font.vintage, boxShadow: '0 8px 18px rgba(0,26,77,0.25)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
          >
            <span>Read Full Article</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(3,9,20,0.8)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              style={{ backgroundColor: CREAM, borderColor: 'rgba(180,160,130,0.3)', border: '1px solid rgba(180,160,130,0.3)' }}
            >
              {/* Header */}
              <div className="relative h-56 sm:h-64 overflow-hidden flex-shrink-0">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137] via-[#0d2137]/35 to-transparent" />
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block" style={{ backgroundColor: GOLD, color: NAVY, ...font.vintage }}>
                    {blog.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight" style={{ ...font.display }}>
                    {blog.title}
                  </h3>
                </div>
              </div>

              {/* Article Text Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
                <div className="flex items-center justify-between pb-4 border-b text-xs" style={{ color: 'rgba(58,42,24,0.7)', borderColor: 'rgba(180,160,130,0.25)' }}>
                  <span style={font.body}>By <strong style={{ color: NAVY }}>{blog.author}</strong></span>
                  <span>{new Date(blog.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(197,155,39,0.15)', color: '#7a5a12', ...font.body }}>{blog.readTime || '5 min read'}</span>
                </div>

                <p className="text-base font-medium leading-relaxed italic p-4 rounded-xl border-l-4" style={{ color: NAVY, backgroundColor: 'rgba(197,155,39,0.1)', borderLeftColor: GOLD, ...font.display }}>
                  "{blog.excerpt}"
                </p>

                <div className="text-sm leading-relaxed space-y-4" style={{ color: BROWN, ...font.body }}>
                  <p>{blog.content}</p>
                  <p>
                    Traveling to high alpine frontiers or remote coastal villages requires an appreciation of local conditions. We advise explorers to always pack layered weatherproof outer shells, preserve digital offline topographic maps, and engage local cultural guides who preserve mountain oral histories.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t flex items-center justify-between px-6" style={{ backgroundColor: 'rgba(197,155,39,0.06)', borderColor: 'rgba(180,160,130,0.25)' }}>
                <span className="text-xs" style={{ color: 'rgba(58,42,24,0.7)', ...font.script }}>Alpine Explorers Editorial Chronicles ✦</span>
                <div className="flex items-center gap-3">
                  <Quote size={15} style={{ color: GOLD }} />
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 rounded-full text-xs font-bold text-white transition"
                    style={{ backgroundColor: NAVY, ...font.vintage }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
                  >
                    Close Reader
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}