import { useEffect, useRef, useState } from 'react'
import { Palette, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeContext'

const THEME_OPTIONS = [
  { id: 'blue', label: 'Blue + White', primary: '#1d4ed8', accent: '#60a5fa' },
  { id: 'red', label: 'Red + White', primary: '#b91c1c', accent: '#f87171' },
  { id: 'yellow-red', label: 'Yellow + Red', primary: '#d97706', accent: '#dc2626' },
  { id: 'purple', label: 'White + Purple', primary: '#7c3aed', accent: '#c4b5fd' },
  { id: 'yellow', label: 'Yellow + White', primary: '#d97706', accent: '#facc15' },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2.5 rounded-xl transition flex items-center justify-center relative"
        style={{
          color: open ? 'var(--ae-navy)' : 'var(--ae-ink)',
          backgroundColor: open ? 'rgb(var(--ae-gold-rgb) /0.12)' : 'transparent',
        }}
        aria-label="Switch color theme"
        title="Switch color theme"
        aria-expanded={open}
      >
        <Palette size={19} />
        {theme && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--ae-gold)', outline: '2px solid var(--ae-cream)' }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--ae-cream)',
              borderColor: 'rgb(var(--ae-gold-rgb) /0.4)',
              boxShadow: '0 18px 45px rgb(var(--ae-navy-rgb) /0.25)',
              zIndex: 60,
            }}
          >
            <div
              className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--ae-gold)' }}
            >
              Color Themes
            </div>
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => { setTheme(opt.id); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-colors"
                  style={{ color: active ? 'var(--ae-navy)' : 'var(--ae-ink)' }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'rgb(var(--ae-gold-rgb) /0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span className="flex -space-x-1.5">
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: opt.primary }} />
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: opt.accent }} />
                  </span>
                  <span className="flex-1">{opt.label}</span>
                  {active && <Check size={15} style={{ color: 'var(--ae-gold)' }} />}
                </button>
              )
            })}
            <div className="px-3 py-2" style={{ borderTop: '1px solid rgb(var(--ae-gold-rgb) /0.25)' }}>
              <button
                onClick={() => { setTheme(''); setOpen(false) }}
                className="w-full text-[11px] font-bold uppercase tracking-widest py-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--ae-navy)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(var(--ae-gold-rgb) /0.12)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                Reset to Original Palette
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}