import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { usePublicBlogs } from '../services/usePublic'
import { Search, Compass, BookOpen, ArrowRight } from 'lucide-react'

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { blogs } = usePublicBlogs()

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))]

  const mappedBlogs = blogs.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author || 'Alpine Explorers',
    date: (b.publish_date || b.created_at || new Date().toISOString()).slice(0, 10),
    category: b.category || 'Travel',
    image: b.cover_image,
    excerpt: b.short_description || '',
    readTime: '5 min read',
    content: b.content || '',
  }))

  const filteredBlogs = mappedBlogs.filter((blog) => {
    const categoryMatch = selectedCategory === 'All' || blog.category === selectedCategory
    const searchMatch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  return (
    <div className="min-h-screen relative"
      style={{
        backgroundColor: '#f5ecd8',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, #fbf6ec 0%, #f0e3c5 60%, #e0cda5 100%),
          radial-gradient(#c7af85 0.75px, transparent 0.75px)`,
        backgroundSize: '100% 100%, 28px 28px',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      {/* Hero */}
      <section className="py-14 md:py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: CREAM, boxShadow: '0 12px 34px rgba(60,40,20,0.14), 0 2px 6px rgba(60,40,20,0.06)', border: '1px solid rgba(180,160,130,0.28)' }}>
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&h=700&fit=crop"
                alt="Travel blog journal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,77,0.78) 0%, rgba(0,26,77,0.25) 55%, rgba(3,9,20,0.35) 100%)' }} />

              {/* tape */}
              <div className="absolute top-4 left-5 w-16 h-5 rounded-sm opacity-70" style={{ backgroundColor: 'rgba(245,230,196,0.85)', transform: 'rotate(-3deg)' }} />
              <div className="absolute top-6 right-6 rotate-[8deg]">
                <div className="px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(212,175,55,0.92)', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: NAVY, ...font.vintage }}>Journals from the trail</span>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl mb-2" style={{ ...font.script, color: GOLD2 }}>
                  Stories · Tips · Guides
                </motion.span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3" style={{ ...font.vintage }}>
                  Travel Blog
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-14" style={{ background: `linear-gradient(to right, transparent, ${GOLD2})` }} />
                  <Compass size={20} style={{ color: GOLD2 }} />
                  <div className="h-[2px] w-14" style={{ background: `linear-gradient(to left, transparent, ${GOLD2})` }} />
                </div>
                <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(250,245,234,0.92)', ...font.body }}>
                  Inspiring stories, tips, and guides for your next adventure — straight from the Alpine Explorers family.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={19} style={{ color: GOLD }} />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white outline-none transition text-sm"
                style={{ border: '1px solid rgba(180,160,130,0.45)', color: BROWN, boxShadow: '0 4px 14px rgba(60,40,20,0.07)', ...font.body }}
                onFocus={(e) => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px rgba(197,155,39,0.18)` }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(180,160,130,0.45)'; e.target.style.boxShadow = '0 4px 14px rgba(60,40,20,0.07)' }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition"
                style={{
                  backgroundColor: selectedCategory === category ? NAVY : 'rgba(250,245,234,0.9)',
                  color: selectedCategory === category ? '#fff' : '#1e3a5f',
                  border: `1px solid ${selectedCategory === category ? NAVY : 'rgba(180,160,130,0.45)'}`,
                  boxShadow: selectedCategory === category ? '0 8px 20px rgba(0,26,77,0.25)' : '0 3px 10px rgba(60,40,20,0.06)',
                  ...font.vintage,
                }}
                onMouseEnter={(e) => { if (selectedCategory !== category) { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD } }}
                onMouseLeave={(e) => { if (selectedCategory !== category) { e.currentTarget.style.borderColor = 'rgba(180,160,130,0.45)'; e.currentTarget.style.color = '#1e3a5f' } }}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredBlogs.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredBlogs.map((blog, index) => (
                <motion.div key={blog.id} variants={itemVariants}>
                  <BlogCard blog={blog} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <BookOpen size={40} className="mx-auto mb-4" style={{ color: GOLD }} />
              <p className="text-xl text-[#3a2a18] mb-4" style={{ ...font.display }}>No blog posts found</p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchTerm('')
                }}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white transition"
                style={{ backgroundColor: NAVY, ...font.vintage }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD; e.currentTarget.style.color = NAVY }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = '#fff' }}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
            className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
            style={{ backgroundColor: NAVY, boxShadow: '0 18px 44px rgba(0,26,77,0.35)' }}
          >
            {/* decorations */}
            <div className="absolute left-5 top-5 opacity-25 pointer-events-none">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="44" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="4 4" />
                <polygon points="50,14 56,44 50,38 44,44" fill="#d4af37" />
              </svg>
            </div>
            <div className="absolute right-6 bottom-6 opacity-20 pointer-events-none">
              <svg viewBox="0 0 60 80" width="40" height="52" fill="none">
                <path d="M30 72 V52" stroke="#6b8f5b" strokeWidth="4" strokeLinecap="round" />
                <circle cx="30" cy="38" r="18" fill="#4a6741" />
                <circle cx="18" cy="46" r="12" fill="#5b7a4d" />
                <circle cx="42" cy="46" r="12" fill="#5b7a4d" />
              </svg>
            </div>

            <span className="block text-xl mb-2" style={{ ...font.script, color: GOLD2 }}>Never miss a story</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ ...font.vintage }}>
              Subscribe to Our Newsletter
            </h2>
            <p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: 'rgba(250,245,234,0.9)', ...font.body }}>
              Get the latest travel tips, destination guides, and exclusive offers delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none"
                style={{ backgroundColor: 'rgba(250,245,234,0.95)', color: BROWN, ...font.body }}
              />
              <button className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition"
                style={{ backgroundColor: GOLD, color: NAVY, ...font.vintage, boxShadow: '0 10px 26px rgba(212,175,55,0.45)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = GOLD2 }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = GOLD }}
              >
                Subscribe <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}