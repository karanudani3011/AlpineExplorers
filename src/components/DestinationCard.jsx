import { motion } from 'framer-motion'
import { Star, MapPin, ArrowRight } from 'lucide-react'

export default function DestinationCard({ destination, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group flex-shrink-0 w-80 cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg h-80 shadow-lg">
        {/* Image */}
        <motion.img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.5 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          {/* Rating */}
          <div className="self-end bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{destination.rating}</span>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display font-bold text-3xl mb-1">{destination.name}</h3>
            <p className="flex items-center gap-2 text-sm text-gray-200 mb-4">
              <MapPin size={16} />
              {destination.country}
            </p>
            <p className="text-gray-100 text-sm mb-4 line-clamp-2">
              {destination.description}
            </p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition inline-flex items-center gap-2">
              Explore
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
