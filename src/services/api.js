const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

function buildUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  if (BASE_URL) {
    if (cleanPath.startsWith('/api')) {
      return `${BASE_URL}${cleanPath}`
    }
    return `${BASE_URL}/api${cleanPath}`
  }
  return cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`
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
          if (val && val.access_token) return val.access_token
        }
      }
    } catch {}
    return ''
  },
  setToken: (t) => localStorage.setItem('ae_token', t || ''),
  clearToken: () => localStorage.removeItem('ae_token'),
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {}
  const token = API.getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (form) {
    payload = form
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const url = buildUrl(path)
  const res = await fetch(url, { method, headers, body: payload })
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
  const url = buildUrl(path)
  const res = await fetch(url, { method: 'GET', headers })
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
  BASE: BASE_URL || '/api',
}