export const API_BASE = import.meta.env.VITE_API_URL || ''

const REQUEST_TIMEOUT_MS = 60_000
const MAX_RETRIES = 2
const trimBase = API_BASE.replace(/\/+$/, '')

export function apiUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  if (!cleanPath.startsWith('/api/') && !cleanPath.startsWith('/uploads/')) return cleanPath
  if (!trimBase) return cleanPath
  return `${trimBase}${cleanPath}`
}

function buildUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return apiUrl(cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`)
}

export const API = {
  getToken: () => {
    const localToken = localStorage.getItem('ae_token')
    if (localToken) return localToken
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('sb-') || key.includes('supabase')) && key.endsWith('-auth-token')) {
          const val = JSON.parse(localStorage.getItem(key) || '{}')
          if (val?.access_token) return val.access_token
        }
      }
    } catch {}
    return ''
  },
  setToken: (t) => localStorage.setItem('ae_token', t || ''),
  clearToken: () => localStorage.removeItem('ae_token'),
}

function announceRetry() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ae:api-retrying', {
      detail: 'Waking up the server, please wait a few seconds...',
    }))
  }
}

async function fetchWithRetry(url, options) {
  let lastError
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(new Error('Request timed out after 60 seconds.')), REQUEST_TIMEOUT_MS)
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      if (response.status >= 500 && attempt < MAX_RETRIES) {
        announceRetry()
        await response.body?.cancel().catch(() => {})
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
        continue
      }
      return response
    } catch (error) {
      lastError = error.name === 'AbortError'
        ? new Error('The server took too long to respond. Please try again.')
        : error
      if (attempt >= MAX_RETRIES) break
      announceRetry()
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    } finally {
      clearTimeout(timeout)
    }
  }
  throw lastError || new Error('Unable to reach the server. Please try again.')
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {}
  const token = API.getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (form) payload = form
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetchWithRetry(buildUrl(path), { method, headers, body: payload })
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(`Expected JSON from ${path}, but received ${contentType || 'an unknown content type'}. Check the API URL and server response.`)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

async function requestBlob(path) {
  const headers = {}
  const token = API.getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetchWithRetry(buildUrl(path), { method: 'GET', headers })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data.error || `Download failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return res.blob()
}

export const api = {
  get: (path) => request(path),
  getBlob: (path) => requestBlob(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  postForm: (path, form) => request(path, { method: 'POST', form }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  putForm: (path, form) => request(path, { method: 'PUT', form }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  getToken: () => API.getToken(),
  BASE: trimBase ? `${trimBase}/api` : '/api',
}
