import { motion } from 'framer-motion'
import ServiceTourCard from './ServiceTourCard'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function TourGrid({ tours, category }) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span
          className="text-xl"
          style={{ fontFamily: 'Caveat, cursive', color: 'var(--ae-gold)' }}
        >
          Explore our curated collection
        </span>
        <h2
          className="text-2xl sm:text-3xl font-bold mt-1"
          style={{ fontFamily: 'Cinzel, serif', color: 'var(--ae-navy)' }}
        >
          {category.name}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-[1.5px] w-12" style={{ background: 'linear-gradient(to right, transparent, var(--ae-gold))' }} />
          <p className="italic text-sm" style={{ fontFamily: 'Playfair Display, serif', color: 'rgb(var(--ae-ink-rgb) /0.6)' }}>
            {category.tagline}
          </p>
          <div className="h-[1.5px] w-12" style={{ background: 'linear-gradient(to left, transparent, var(--ae-gold))' }} />
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tours.map((tour) => (
          <motion.div key={tour.id} variants={item}>
            <ServiceTourCard tour={tour} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
