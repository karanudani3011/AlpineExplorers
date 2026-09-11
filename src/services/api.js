const BASE = import.meta.env.PROD ? '/api' : '/api'

export const API = {
  getToken: () => localStorage.getItem('ae_token') || '',
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
  const url = path.startsWith('/api') ? path : `${BASE}${path}`
  const res = await fetch(url, { method, headers, body: payload })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  postForm: (path, form) => request(path, { method: 'POST', form }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  putForm: (path, form) => request(path, { method: 'PUT', form }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  BASE,
}