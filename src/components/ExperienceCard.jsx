import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

export default function ExperienceCard({ experience, index }) {
  const IconComponent = LucideIcons[experience.icon] || LucideIcons.MapPin

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
        {/* Background Image */}
        <motion.img
          src={experience.image}
          alt={experience.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 group-hover:from-blue-500/40 group-hover:via-blue-500/20 group-hover:to-black/70 transition-all duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="mb-4"
          >
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
              <IconComponent size={40} className="text-white" />
            </div>
          </motion.div>

          {/* Name */}
          <h3 className="font-display font-bold text-2xl mb-2">{experience.name}</h3>

          {/* Description */}
          <p className="text-sm text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {experience.description}
          </p>

          {/* Arrow */}
          <motion.div
            className="mt-4 opacity-0 group-hover:opacity-100"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
