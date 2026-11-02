import { supabase } from './supabaseClient'
import { useEffect, useState, useCallback } from 'react'
import { api } from './api'

export function usePublicData(fallback) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    const load = async () => {
      try {
        const [international, domestic, adventure, camping, services] = await Promise.all([
          api.get('/public/international').then((d) => d.items).catch(() => null),
          api.get('/public/domestic').then((d) => d.items).catch(() => null),
          api.get('/public/adventure').then((d) => d.items).catch(() => null),
          api.get('/public/camping').then((d) => d.items).catch(() => null),
          api.get('/public/services').then((d) => d.items).catch(() => null),
        ])
        if (!mounted) return
        if (international || domestic || adventure || camping || services) {
          setData((prev) => ({
            ...prev,
            international: international || prev?.international || [],
            domestic: domestic || prev?.domestic || [],
            adventure: adventure || prev?.adventure || [],
            camping: camping || prev?.camping || [],
            services: services || prev?.services || [],
          }))
          setError(null)
        } else {
          setError('offline')
        }
      } catch {
        if (mounted) setError('offline')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [refreshKey])

  return { data, loading, error, refresh }
}

export function usePublicBlogs(fallback = []) {
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
        const d = await api.get(`/public/blogs/${slug}`)
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
}

export function usePublicEvents(fallback = []) {
  const [events, setEvents] = useState(fallback)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    api.get('/public/events')
      .then((d) => {
        if (mounted && Array.isArray(d.items) && d.items.length > 0) {
          setEvents(d.items)
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])
  return { events, loading }
}

export function usePublicContent(type, fallback = null) {
  const [content, setContent] = useState(fallback)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    api.get(`/public/${type}`).then((d) => {
      const key = type === 'contact' ? 'contact' : type === 'about' ? 'about' : type === 'homepage' ? 'homepage' : type === 'settings' ? 'settings' : null
      if (mounted && key && d[key]) setContent(d[key])
    }).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [type])
  return { content, loading }
}