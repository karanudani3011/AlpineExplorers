import fs from 'node:fs'

const content = fs.readFileSync('src/services/usePublic.js', 'utf8')
const normalized = content.replace(/\r\n/g, '\n')

// 1. Add supabase import
let updated = normalized
if (!updated.includes("import { supabase } from './supabaseClient'")) {
  updated = "import { supabase } from './supabaseClient'\n" + updated
}

// 2. Replace usePublicBlogs
const oldBlogsHook = `export function usePublicBlogs(fallback = []) {
  const [blogs, setBlogs] = useState(fallback)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    api.get('/public/blogs')
      .then((d) => {
        if (mounted && Array.isArray(d?.blogs) && d.blogs.length > 0) {
          setBlogs(d.blogs)
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])
  return { blogs, loading }
}`

const newBlogsHook = `export function usePublicBlogs(fallback = []) {
  const [blogs, setBlogs] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchBlogs() {
      try {
        // Try Supabase directly first
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_date', { ascending: false })

        if (!error && Array.isArray(data) && data.length > 0) {
          if (mounted) setBlogs(data)
          return
        }

        // Fallback to local server API
        const d = await api.get('/public/blogs')
        if (mounted && Array.isArray(d?.blogs) && d.blogs.length > 0) {
          setBlogs(d.blogs)
        }
      } catch {
        // Graceful fallback to local API if Supabase fails
        try {
          const d = await api.get('/public/blogs')
          if (mounted && Array.isArray(d?.blogs) && d.blogs.length > 0) {
            setBlogs(d.blogs)
          }
        } catch {}
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchBlogs()
    return () => { mounted = false }
  }, [])

  return { blogs, loading }
}

export function usePublicBlog(slug) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    if (!slug) return

    async function fetchBlog() {
      setLoading(true)
      try {
        // 1. Try Supabase by slug
        const { data, error: sbError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle()

        if (!sbError && data) {
          if (mounted) setBlog(data)
          return
        }

        // 2. Fallback to local server API
        const d = await api.get(\`/public/blogs/\${slug}\`)
        if (mounted && d?.blog) {
          setBlog(d.blog)
        } else if (mounted) {
          setError('Blog post not found')
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load blog')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchBlog()
    return () => { mounted = false }
  }, [slug])

  return { blog, loading, error }
}`

if (updated.includes(oldBlogsHook)) {
  updated = updated.replace(oldBlogsHook, newBlogsHook)
  fs.writeFileSync('src/services/usePublic.js', updated, 'utf8')
  console.log('Successfully updated usePublic.js')
} else {
  console.error('Could not find oldBlogsHook in usePublic.js')
}
