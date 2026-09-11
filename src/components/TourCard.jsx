import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Star, MapPin, Calendar, Clock, ArrowRight, MessageSquare, ShieldCheck, Heart } from 'lucide-react'
import InquiryModal from './InquiryModal'

export default function TourCard({ tour }) {
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const navigate = useNavigate()

  const discount = tour.discount ?? (tour.originalPrice > tour.price ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100) : 0)

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 flex flex-col h-full transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-64 sm:h-72 w-full flex-shrink-0">
          <motion.img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges on Top Left */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {tour.badge && (
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md tracking-wider uppercase">
                {tour.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Category Tag on Top Right */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
            <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {tour.category}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-rose-500 shadow-md transition"
              title="Save to Wishlist"
            >
              <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
            </button>
          </div>

          {/* Location on image bottom */}
          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1.5 drop-shadow font-medium">
              <MapPin size={14} className="text-amber-400" />
              <span className="truncate">{tour.location}</span>
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="font-bold">{tour.rating}</span>
              <span className="opacity-80 text-[10px]">({tour.reviews})</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/tour/${tour.id}`}>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#001a4d] group-hover:text-[#c59b27] transition line-clamp-1 mb-2">
                {tour.title}
              </h3>
            </Link>

            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
              {tour.shortDescription}
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 pb-4 mb-4 border-b border-gray-100 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#c59b27] flex-shrink-0" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#c59b27] flex-shrink-0" />
                <span>{new Date(tour.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Price & Triple Action Buttons */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[11px] text-gray-700 block uppercase tracking-wider font-semibold">Starting From</span>
                <div className="flex items-baseline gap-2">
                  {tour.price > 0 ? (
                    <>
                      <span className="text-2xl font-bold text-[#001a4d]">${tour.price}</span>
                      {tour.originalPrice > tour.price && (
                        <span className="text-xs text-gray-600 line-through">${tour.originalPrice}</span>
                      )}
                      <span className="text-[10px] text-gray-600 font-semibold">/ guest</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-[#001a4d]">On Request</span>
                  )}
                </div>
              </div>

              <a
                href={`https://wa.me/919979883339?text=${encodeURIComponent(`Hello Alpine Explorers! I'm interested in the "${tour.title}" tour.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1 transition"
                title="Inquire on WhatsApp"
              >
                <MessageSquare size={13} />
                <span>Inquire</span>
              </a>
            </div>

            {/* View Details & Book Now Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={`/tour/${tour.id}`}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1 group/btn"
              >
                <span>View Details</span>
                <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to={`/booking/${tour.id}`}
                className="w-full py-2.5 bg-[#001a4d] hover:bg-[#0d3a80] text-white font-bold rounded-xl text-xs text-center shadow-md transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        tour={tour}
      />
    </>
  )
}
