import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, MapPin, Calendar, Clock, ArrowRight, MessageSquare, Heart } from 'lucide-react'
import InquiryModal from './InquiryModal'

const NAVY = '#001a4d'
const GOLD = '#c59b27'

function formatINR(amount) {
  if (!amount || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ServiceTourCard({ tour }) {
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const discount = tour.originalPrice > tour.price
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : 0

  const formattedPrice = formatINR(tour.price)
  const formattedOriginal = formatINR(tour.originalPrice)

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 flex flex-col h-full transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-56 sm:h-64 w-full flex-shrink-0">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {tour.badge && (
              <span
                className="text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md tracking-wider uppercase"
                style={{ background: `linear-gradient(135deg, ${NAVY}, #0d3a80)` }}
              >
                {tour.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-md">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-rose-500 shadow-md transition z-10"
          >
            <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
          </button>

          {/* Location & Rating on image */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 drop-shadow font-medium">
              <MapPin size={12} className="text-amber-400" />
              <span className="truncate max-w-[140px]">{tour.location}</span>
            </span>
            {tour.rating > 0 && (
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-[11px]">{tour.rating}</span>
                {tour.reviews > 0 && <span className="opacity-70 text-[9px]">({tour.reviews})</span>}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/tour/${tour.id}`}>
              <h3
                className="font-bold text-base sm:text-lg group-hover:text-[#c59b27] transition line-clamp-1 mb-1.5"
                style={{ fontFamily: 'Cinzel, serif', color: NAVY }}
              >
                {tour.title}
              </h3>
            </Link>
            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">
              {tour.shortDescription}
            </p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-2 pb-3 mb-3 border-b border-gray-100 text-[11px] text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock size={13} style={{ color: GOLD }} className="flex-shrink-0" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} style={{ color: GOLD }} className="flex-shrink-0" />
                <span>
                  {new Date(tour.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">
                  Starting From
                </span>
                <div className="flex items-baseline gap-2">
                  {formattedPrice ? (
                    <>
                      <span className="text-xl font-bold" style={{ color: NAVY }}>
                        {formattedPrice}
                      </span>
                      {formattedOriginal && tour.originalPrice > tour.price && (
                        <span className="text-[11px] text-gray-400 line-through">{formattedOriginal}</span>
                      )}
                      <span className="text-[10px] text-gray-500 font-semibold">/ person</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold" style={{ color: NAVY }}>On Request</span>
                  )}
                </div>
              </div>
              <a
                href={`https://wa.me/919979883339?text=${encodeURIComponent(`Hello Alpine Explorers! I'm interested in the "${tour.title}" tour.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1.5 rounded-lg border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold flex items-center gap-1 transition"
                title="Inquire on WhatsApp"
              >
                <MessageSquare size={11} />
                <span>Inquire</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to={`/tour/${tour.id}`}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1 group/btn"
              >
                <span>View Details</span>
                <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to={`/booking/${tour.id}`}
                className="w-full py-2.5 text-white font-bold rounded-xl text-xs text-center shadow-md transition"
                style={{ backgroundColor: NAVY }}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        tour={tour}
      />
    </>
  )
}
