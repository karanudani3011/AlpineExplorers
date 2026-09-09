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
    api.get('/public/blogs').then((d) => mounted && setBlogs(d.blogs || [])).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])
  return { blogs, loading }
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