import { useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from '../animations/revealMotion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { usePublicBlog, usePublicBlogs } from '../services/usePublic'
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  Star,
  Compass,
  MapPin,
  CheckCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react'

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

// Markdown parser and renderer for structured blog sections
function renderMarkdownContent(content) {
  if (!content) return null

  // Split into paragraphs / blocks
  const blocks = content.split('\n\n')

  return blocks.map((block, idx) => {
    const trimmed = block.trim()

    // Horizontal Rule
    if (trimmed === '---') {
      return (
        <div key={idx} className="my-8 flex items-center justify-center gap-3">
          <div className="h-[1px] flex-1" style={{ backgroundColor: 'rgba(180,160,130,0.3)' }} />
          <Compass size={18} style={{ color: GOLD }} />
          <div className="h-[1px] flex-1" style={{ backgroundColor: 'rgba(180,160,130,0.3)' }} />
        </div>
      )
    }

    // Heading 2: ## Section Title
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.slice(3).trim()
      return (
        <div key={idx} className="pt-6 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GOLD }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD2, ...font.vintage }}>
              Alpine Journal Guide
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[color:var(--ae-navy)]"
            style={font.display}
          >
            {headingText}
          </h2>
        </div>
      )
    }

    // Heading 3: ### Subheading
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.slice(4).trim()
      return (
        <h3
          key={idx}
          className="text-xl sm:text-2xl font-bold pt-4 pb-1 text-[color:var(--ae-navy-soft)]"
          style={font.display}
        >
          {headingText}
        </h3>
      )
    }

    // Numbered list: 1. **Title**: Text
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n')
      return (
        <ol key={idx} className="space-y-3 my-4 list-none pl-0">
          {items.map((item, itemIdx) => {
            const clean = item.replace(/^\d+\.\s*/, '')
            return (
              <li
                key={itemIdx}
                className="flex items-start gap-3 p-3.5 rounded-xl border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(180,160,130,0.25)'
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white mt-0.5"
                  style={{ backgroundColor: NAVY, ...font.vintage }}
                >
                  {itemIdx + 1}
                </span>
                <div
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: BROWN, ...font.body }}
                  dangerouslySetInnerHTML={{
                    __html: clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </li>
            )
          })}
        </ol>
      )
    }

    // Bullet points: - **Title**: Text
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n')
      return (
        <ul key={idx} className="space-y-3 my-4 list-none pl-0">
          {items.map((item, itemIdx) => {
            const clean = item.replace(/^[-*]\s*/, '')
            return (
              <li
                key={itemIdx}
                className="flex items-start gap-3 p-3.5 rounded-xl border transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(180,160,130,0.25)'
                }}
              >
                <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                <div
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: BROWN, ...font.body }}
                  dangerouslySetInnerHTML={{
                    __html: clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </li>
            )
          })}
        </ul>
      )
    }

    // Standard paragraph with bold formatting
    return (
      <p
        key={idx}
        className="text-base sm:text-lg leading-relaxed mb-4"
        style={{ color: BROWN, ...font.body }}
        dangerouslySetInnerHTML={{
          __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        }}
      />
    )
  })
}

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { blog, loading, error } = usePublicBlog(slug)
  const { blogs: allBlogs } = usePublicBlogs()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  // Normalize current blog data
  const post = useMemo(() => {
    if (!blog) return null
    return {
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      author: blog.author || 'Alpine Explorers',
      publishedDate: blog.published_date || blog.publish_date || blog.created_at || '2026-05-15',
      category: blog.category || 'Travel',
      image: blog.featured_image || blog.cover_image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=600&fit=crop',
      shortDescription: blog.short_description || '',
      content: blog.content || '',
      readingTime: blog.reading_time || '6 min read',
      rating: blog.rating || 4.9,
      reviewCount: blog.review_count || 32,
      tags: Array.isArray(blog.tags) ? blog.tags : (typeof blog.tags === 'string' ? JSON.parse(blog.tags || '[]') : []),
      relatedTours: Array.isArray(blog.related_tours) ? blog.related_tours : (typeof blog.related_tours === 'string' ? JSON.parse(blog.related_tours || '[]') : []),
      relatedDestinations: Array.isArray(blog.related_destinations) ? blog.related_destinations : []
    }
  }, [blog])

  // Suggest 3 related articles from same category or different destinations
  const relatedArticles = useMemo(() => {
    if (!allBlogs || !post) return []
    return allBlogs
      .filter((b) => b.slug !== post.slug)
      .slice(0, 3)
      .map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        author: b.author || 'Alpine Explorers',
        date: (b.published_date || b.publish_date || b.created_at || new Date().toISOString()).slice(0, 10),
        category: b.category || 'Travel',
        image: b.featured_image || b.cover_image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=400&fit=crop',
        excerpt: b.short_description || '',
        readTime: b.reading_time || '6 min read'
      }))
  }, [allBlogs, post])

  // Determine linked tour ID for CTA
  const primaryTourId = post?.relatedTours?.[0] || null

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.shortDescription,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Article link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4ebd9] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-amber-600/30 border-t-amber-600 animate-spin mx-auto mb-4"
          />
          <p className="text-sm font-semibold text-[color:var(--ae-navy)]" style={font.vintage}>
            Opening Alpine Journal...
          </p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f4ebd9] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-2xl mx-auto text-center px-4 py-24">
          <Compass size={48} className="mx-auto mb-4" style={{ color: GOLD }} />
          <h1 className="text-3xl font-bold mb-3 text-[color:var(--ae-navy)]" style={font.display}>
            Article Not Found
          </h1>
          <p className="text-base text-gray-700 mb-6" style={font.body}>
            The travel guide you are looking for may have been moved or updated.
          </p>
          <Link
            to="/blog"
            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white inline-flex items-center gap-2"
            style={{ backgroundColor: NAVY, ...font.vintage }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Blogs</span>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: 'var(--ae-bg-paper)',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, var(--ae-bg-glow) 0%, var(--ae-bg-mid) 60%, var(--ae-bg-edge) 100%),
          radial-gradient(#c7af85 0.75px, transparent 0.75px)`,
        backgroundSize: '100% 100%, 28px 28px',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[color:var(--ae-gold)] transition">Home</Link>
          <ChevronRight size={12} className="opacity-50" />
          <Link to="/blog" className="hover:text-[color:var(--ae-gold)] transition">Travel Blog</Link>
          <ChevronRight size={12} className="opacity-50" />
          <span className="text-[color:var(--ae-navy)] font-semibold truncate max-w-[240px]">
            {post.title}
          </span>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-16">
        {/* Hero Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl border mb-10"
          style={{
            backgroundColor: CREAM,
            borderColor: 'rgba(180,160,130,0.3)',
            boxShadow: '0 16px 40px rgba(60,40,20,0.12)'
          }}
        >
          {/* Cover Image */}
          <div className="relative h-72 sm:h-96 md:h-[440px] overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137]/90 via-[#0d2137]/40 to-transparent" />

            {/* Back Button */}
            <button
              onClick={() => navigate('/blog')}
              className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition hover:scale-105"
              style={{ backgroundColor: 'rgba(3,9,20,0.65)', ...font.vintage }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="absolute top-5 right-5 w-9 h-9 rounded-full text-white flex items-center justify-center backdrop-blur-md transition hover:scale-105"
              style={{ backgroundColor: 'rgba(3,9,20,0.65)' }}
              title="Share article"
            >
              <Share2 size={16} />
            </button>

            {/* Badges on Hero */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                  style={{ backgroundColor: GOLD, color: NAVY, ...font.vintage }}
                >
                  {post.category}
                </span>

                <div
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(3,9,20,0.6)' }}
                >
                  <Clock size={12} style={{ color: GOLD }} />
                  <span>{post.readingTime}</span>
                </div>

                <div
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(3,9,20,0.6)' }}
                >
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{post.rating}</span>
                  <span className="opacity-70">({post.reviewCount} reviews)</span>
                </div>
              </div>

              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight"
                style={font.display}
              >
                {post.title}
              </h1>
            </div>
          </div>

          {/* Author & Meta Bar */}
          <div
            className="p-6 border-b flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(180,160,130,0.25)',
              color: 'rgb(var(--ae-ink-rgb) /0.8)'
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                style={{ backgroundColor: NAVY, ...font.vintage }}
              >
                AL
              </div>
              <div>
                <span className="block font-bold text-[color:var(--ae-navy)]" style={font.body}>
                  {post.author}
                </span>
                <span className="text-xs opacity-75">Curated Expeditions · Alpine Explorers</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} style={{ color: GOLD }} />
                <span>
                  Published {new Date(post.publishedDate).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Article Lead Excerpt */}
          <div className="p-6 sm:p-10 pb-0">
            <div
              className="p-5 sm:p-6 rounded-2xl border-l-4 leading-relaxed italic text-base sm:text-lg mb-8"
              style={{
                backgroundColor: 'rgba(197,155,39,0.08)',
                borderLeftColor: GOLD,
                color: NAVY,
                ...font.display
              }}
            >
              "{post.shortDescription}"
            </div>

            {/* Markdown Body Sections */}
            <div className="article-body">
              {renderMarkdownContent(post.content)}
            </div>

            {/* Tags Footer */}
            {post.tags.length > 0 && (
              <div
                className="mt-10 pt-6 border-t flex flex-wrap items-center gap-2"
                style={{ borderColor: 'rgba(180,160,130,0.25)' }}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mr-2" style={font.vintage}>
                  <Tag size={14} style={{ color: GOLD }} />
                  <span>Tags:</span>
                </div>
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(180,160,130,0.18)',
                      color: NAVY,
                      ...font.body
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Plan My Trip / Book CTA Card */}
          <div className="p-6 sm:p-10 pt-8">
            <div
              className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #0d2137 0%, #173b61 100%)',
                border: '1px solid rgba(197,155,39,0.35)'
              }}
            >
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3" style={{ backgroundColor: 'rgba(197,155,39,0.2)', color: GOLD2, ...font.vintage }}>
                    <Sparkles size={13} />
                    <span>Plan Your Journey</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white" style={font.display}>
                    Ready to Experience {post.title.split(':')[0]}?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed" style={font.body}>
                    Founded in 1998, Alpine Explorers crafts seamless, tailor-made travel itineraries with trusted tour managers, private sanitized transfers, and handpicked boutique accommodations.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <Phone size={13} style={{ color: GOLD2 }} />
                      <a href="tel:+919979883339" className="hover:underline">+91 99798 83339</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={13} style={{ color: GOLD2 }} />
                      <a href="mailto:alpineexplorers.travel@gmail.com" className="hover:underline">alpineexplorers.travel@gmail.com</a>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto flex-shrink-0">
                  {primaryTourId && (
                    <Link
                      to={`/tour/${primaryTourId}`}
                      className="px-6 py-3 rounded-full text-xs uppercase font-bold tracking-widest text-center transition shadow-lg"
                      style={{
                        backgroundColor: GOLD,
                        color: NAVY,
                        ...font.vintage
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = GOLD
                      }}
                    >
                      <span>Explore Tour & Itinerary</span>
                    </Link>
                  )}

                  <a
                    href={`https://wa.me/919979883339?text=${encodeURIComponent(`Hello Alpine Explorers, I was reading your travel guide on "${post.title}" and would like to plan my trip!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full text-xs uppercase font-bold tracking-widest text-center flex items-center justify-center gap-2 transition"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      ...font.vintage
                    }}
                  >
                    <MessageCircle size={15} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Guides Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-14">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD, ...font.vintage }}>
                Keep Exploring
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[color:var(--ae-navy)]" style={font.display}>
                Related Travel Stories & Guides
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel, idx) => (
                <BlogCard key={rel.id} blog={rel} index={idx} />
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  )
}

