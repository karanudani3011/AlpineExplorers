import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, API } from '../services/api'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(API.getToken())
  const [loading, setLoading] = useState(true)

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'super_admin'

  const permissions = user?.permissions || []

  // Check if user has a specific permission
  const hasPermission = useCallback((permissionKey) => {
    if (!user) return false
    if (isSuperAdmin) return true
    if (!permissionKey) return true
    if (permissions.includes('*')) return true
    return permissions.includes(permissionKey)
  }, [user, isSuperAdmin, permissions])

  // Check if user has any permission from a list
  const hasAnyPermission = useCallback((permissionKeys = []) => {
    if (!user) return false
    if (isSuperAdmin) return true
    if (!permissionKeys || permissionKeys.length === 0) return true
    if (permissions.includes('*')) return true
    return permissionKeys.some((k) => permissions.includes(k))
  }, [user, isSuperAdmin, permissions])

  // Check if user has any permission in a module (e.g. 'bookings', 'services', 'blog')
  const hasModulePermission = useCallback((modulePrefix) => {
    if (!user) return false
    if (isSuperAdmin) return true
    if (permissions.includes('*')) return true
    return permissions.some((p) => p.startsWith(`${modulePrefix}.`) || p === modulePrefix)
  }, [user, isSuperAdmin, permissions])

  // Legacy can() method for backward compatibility
  const can = useCallback((roles) => {
    if (!user) return false
    if (isSuperAdmin) return true
    if (Array.isArray(roles)) {
      return roles.some((r) => r.toUpperCase() === (user.role || '').toUpperCase())
    }
    return (user.role || '').toUpperCase() === String(roles).toUpperCase()
  }, [user, isSuperAdmin])

  // Initial load / token restoration
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/auth/me')
      .then((d) => {
        if (d.user?.status === 'INACTIVE') {
          API.clearToken()
          setToken('')
          setUser(null)
        } else {
          setUser(d.user)
        }
      })
      .catch(() => {
        API.clearToken()
        setToken('')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  // Login handler
  const login = useCallback(async (emailOrUsername, password) => {
    // 1. Authenticate with backend / Supabase
    const data = await api.post('/auth/login', {
      email: emailOrUsername,
      username: emailOrUsername,
      password,
    })

    if (data.user?.status === 'INACTIVE') {
      throw new Error('This account is deactivated. Contact the Super Admin.')
    }

    // 2. Also authenticate Supabase client session if available
    try {
      if (emailOrUsername.includes('@')) {
        await supabase.auth.signInWithPassword({
          email: emailOrUsername.trim().toLowerCase(),
          password,
        })
      }
    } catch {}

    API.setToken(data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  // Logout handler
  const logout = useCallback(async () => {
    try { await api.post('/auth/logout') } catch {}
    try { await supabase.auth.signOut() } catch {}
    API.clearToken()
    setToken('')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        can,
        hasPermission,
        hasAnyPermission,
        hasModulePermission,
        isSuperAdmin,
        permissions,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}