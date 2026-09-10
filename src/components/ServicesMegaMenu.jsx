import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Map, Mountain, Tent, Users, Backpack } from 'lucide-react'
import { serviceCategories } from '../data/servicesData'

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'

const iconMap = {
  international: Globe,
  domestic: Map,
  mountain: Mountain,
  adventure: Tent,
  family: Users,
  solo: Backpack,
}

const categoryImages = {
  international: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop',
  domestic: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=200&fit=crop',
  mountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
  adventure: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=300&h=200&fit=crop',
  family: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=200&fit=crop',
  solo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&h=200&fit=crop',
}

export default function ServicesMegaMenu({ isOpen, onHoverStart, onHoverEnd, onNavigate }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onHoverEnd()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onHoverEnd])

  return (
    <div
      ref={menuRef}
      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            style={{ width: '1020px', maxWidth: '95vw' }}
          >
            {/* Arrow */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rotate-45 rounded-sm"
              style={{
                boxShadow: '-2px -2px 5px rgba(0,0,0,0.04)',
                borderLeft: '1px solid rgba(200,190,170,0.3)',
                borderTop: '1px solid rgba(200,190,170,0.3)',
              }}
            />

            {/* Main Card */}
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 20px 50px rgba(0,20,60,0.12), 0 6px 16px rgba(0,20,60,0.06)',
                border: '1px solid rgba(200,190,170,0.25)',
              }}
            >
              {/* 6 Categories — Single Horizontal Row */}
              <div className="flex items-stretch px-5 py-5">
                {serviceCategories.map((cat, idx) => {
                  const Icon = iconMap[cat.id]
                  return (
                    <div key={cat.id} className="contents">
                      {/* Separator */}
                      {idx > 0 && (
                        <div
                          className="flex-shrink-0 w-px self-stretch my-1"
                          style={{ background: 'linear-gradient(to bottom, transparent, rgba(200,190,170,0.35), transparent)' }}
                        />
                      )}

                      <Link
                        to={`/services/${cat.slug}`}
                        onClick={onNavigate}
                        className="group flex-1 min-w-0 flex flex-col items-center text-center px-3 py-2 rounded-xl transition-all duration-200 hover:bg-[#faf7f0]"
                      >
                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                          style={{
                            background: `linear-gradient(135deg, ${NAVY}, #0d3a80)`,
                          }}
                        >
                          {Icon && <Icon size={18} className="text-white" />}
                        </div>

                        {/* Image */}
                        <div className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-2.5 ring-1 ring-black/5">
                          <img
                            src={categoryImages[cat.id]}
                            alt={cat.shortName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>

                        {/* Title */}
                        <h4
                          className="text-[12px] font-bold mb-1 transition-colors duration-200 group-hover:text-[#c59b27] leading-tight"
                          style={{ fontFamily: 'Cinzel, serif', color: NAVY }}
                        >
                          {cat.shortName}
                        </h4>

                        {/* Description */}
                        <p
                          className="text-[10px] leading-snug line-clamp-2"
                          style={{ color: 'rgba(58,42,24,0.55)' }}
                        >
                          {cat.tagline}
                        </p>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
