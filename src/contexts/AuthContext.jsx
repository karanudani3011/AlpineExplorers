import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, API } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(API.getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => {
        API.clearToken()
        setToken('')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = useCallback(async (username, password) => {
    const data = await api.post('/auth/login', { username, password })
    API.setToken(data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout') } catch {}
    API.clearToken()
    setToken('')
    setUser(null)
  }, [])

  const can = useCallback((roles) => {
    if (!user) return false
    if (roles.includes('super_admin') && user.role === 'super_admin') return true
    return roles.includes(user.role)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, can, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}