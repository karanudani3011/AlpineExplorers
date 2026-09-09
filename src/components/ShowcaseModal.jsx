import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Sparkles, Compass, Download, Layers } from 'lucide-react'

export default function ShowcaseModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-[#f7f4ed] rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-amber-200/60 flex flex-col max-h-[95vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-amber-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-wide text-white flex items-center gap-2">
                  Alpine Explorers – 3D UI Concept Board Presentation
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">
                    3D Mockup
                  </span>
                </h3>
                <p className="text-xs text-amber-200/70">
                  Floating 3D website-board showcase with illuminated glowing path & miniature 3D tourists
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-gray-300 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Image & Showcase Body */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100/80 bg-stone-100 max-w-4xl w-full group">
              <img
                src="/alpine_explorers_ui_concept.jpg"
                alt="Alpine Explorers 3D Travel UI Concept Mockup"
                className="w-full h-auto object-cover transition duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md text-amber-200 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <Sparkles size={14} className="text-amber-400" />
                <span>Rendered 3D Concept</span>
              </div>
            </div>

            {/* Design Spec Details Bar */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl text-xs">
              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/60 shadow-sm">
                <span className="font-bold text-slate-800 block mb-1">📐 Layout Architecture</span>
                <p className="text-slate-600">
                  Mediterranean coastal travel hero banner, 4 category cards (International, Domestic, Mountain, River & Camp), with floating golden path outline.
                </p>
              </div>
              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/60 shadow-sm">
                <span className="font-bold text-slate-800 block mb-1">🧭 Right Guide Stack</span>
                <p className="text-slate-600">
                  Vertical Travel Guides & Reviews with compact traveler cards, ratings, and scenic route previews.
                </p>
              </div>
              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/60 shadow-sm">
                <span className="font-bold text-slate-800 block mb-1">🎒 3D Studio Accents</span>
                <p className="text-slate-600">
                  Miniature 3D tourists with backpacks, vintage brass compass, subtle river pebbles, and warm ivory ambient lighting.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-amber-50/80 border-t border-amber-200/60 flex items-center justify-between px-6">
            <span className="text-xs text-slate-600">
              Designed for Alpine Explorers Travel & Tourism Platform
            </span>
            <div className="flex gap-3">
              <a
                href="/alpine_explorers_ui_concept.jpg"
                target="_blank"
                rel="noreferrer"
                download="alpine_explorers_3d_concept.jpg"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <Download size={14} /> Download 16:9 Board
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-slate-900 font-semibold rounded-xl text-xs transition"
              >
                Back to Site
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
