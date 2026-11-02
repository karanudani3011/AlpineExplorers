import { Link } from 'react-router-dom'
import { motion } from '../animations/revealMotion'
import { Calendar, User, ArrowRight, Clock, Star } from 'lucide-react'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'
const GOLD2 = 'var(--ae-gold2)'
const CREAM = 'var(--ae-cream)'
const BROWN = 'var(--ae-ink)'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

export default function BlogCard({ blog, index }) {
  const detailLink = `/blog/${blog.slug || blog.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border transition-all duration-300 flex flex-col justify-between"
      style={{
        backgroundColor: CREAM,
        borderColor: 'rgba(180,160,130,0.28)',
        boxShadow: '0 8px 22px rgba(60,40,20,0.1), 0 2px 6px rgba(60,40,20,0.05)'
      }}
    >
      <div>
        {/* Image */}
        <Link to={detailLink} className="block relative overflow-hidden h-52 sm:h-56">
          <motion.img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137]/75 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold shadow-md"
              style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage }}
            >
              {blog.category}
            </span>
          </div>

          {/* Reading time */}
          <div
            className="absolute bottom-3 right-4 text-white text-xs flex items-center gap-1 px-2.5 py-0.5 rounded-full backdrop-blur-md"
            style={{ backgroundColor: 'rgb(var(--ae-navy-rgb) /0.65)' }}
          >
            <Clock size={12} />
            <span>{blog.readTime || '6 min read'}</span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-6">
          <Link to={detailLink} className="block">
            <h3
              className="text-[color:var(--ae-navy)] group-hover:text-[color:var(--ae-gold)] transition font-bold text-xl mb-3 line-clamp-2 cursor-pointer"
              style={font.display}
            >
              {blog.title}
            </h3>
          </Link>

          <p className="text-sm mb-4 line-clamp-3 leading-relaxed" style={{ color: BROWN, ...font.body }}>
            {blog.excerpt}
          </p>

          {/* Meta info */}
          <div
            className="flex flex-wrap items-center justify-between text-xs pt-3 border-t"
            style={{ color: 'rgb(var(--ae-ink-rgb) /0.7)', borderColor: 'rgba(180,160,130,0.25)' }}
          >
            <div className="flex items-center gap-1.5">
              <User size={14} style={{ color: GOLD }} />
              <span className="font-semibold" style={{ color: 'var(--ae-navy-soft)', ...font.body }}>
                {blog.author}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} style={{ color: GOLD }} />
              <span className="font-medium">
                {new Date(blog.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Read more button footer */}
      <div className="px-6 pb-6 pt-2">
        <Link
          to={detailLink}
          className="group/btn w-full py-2.5 rounded-full text-xs uppercase font-bold tracking-wider text-white transition flex items-center justify-center gap-2"
          style={{
            backgroundColor: NAVY,
            ...font.vintage,
            boxShadow: '0 8px 18px rgb(var(--ae-navy-rgb) /0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = GOLD
            e.currentTarget.style.color = NAVY
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = NAVY
            e.currentTarget.style.color = '#fff'
          }}
        >
          <span>Read Full Article</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
