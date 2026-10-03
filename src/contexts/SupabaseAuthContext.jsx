import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { api, API } from '../services/api'

export const SupabaseAuthContext = createContext(null)

export function SupabaseAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Global Auth Modal state for "Book Now" and protected actions
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalConfig, setAuthModalConfig] = useState({
    message: '',
    targetTour: null,
    onSuccess: null,
    initialTab: 'login',
  })

  const fetchProfile = useCallback(async (userId, fallbackEmail = '', fallbackName = '') => {
    if (!userId) {
      setProfile(null)
      return null
    }

    // Try Supabase first if available
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (!error && data) {
        setProfile(data)
        return data
      }
    } catch {}

    // Fallback profile object from state/stored data
    const fallback = {
      id: userId,
      email: fallbackEmail,
      full_name: fallbackName,
      phone: '',
    }
    setProfile(fallback)
    return fallback
  }, [])

  useEffect(() => {
    let mounted = true

    // 1. Check local session first (synchronous)
    const savedUserStr = localStorage.getItem('ae_traveler_user')
    const savedToken = API.getToken()

    if (savedUserStr && savedToken) {
      try {
        const parsed = JSON.parse(savedUserStr)
        if (mounted) {
          setUser(parsed)
          setProfile(parsed)
          setSession({ access_token: savedToken, user: parsed })
        }
      } catch {}
    }

    // Resolve loading immediately — don't block the Landing page on Supabase network I/O.
    // Session check runs in the background and updates state when it arrives.
    if (mounted) setLoading(false)

    // 2. Background Supabase session check (safely caught if unreachable)
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data?.session?.user) {
        setSession(data.session)
        const currentUser = data.session.user
        setUser(currentUser)
        fetchProfile(
          currentUser.id,
          currentUser.email,
          currentUser.user_metadata?.full_name || ''
        )
      }
    }).catch(() => {
      // Supabase unreachable — already set loading=false above, no action needed
    })

    // 3. Listen to Supabase auth state changes safely
    let subscription = null
    try {
      const subRes = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (!mounted) return
        if (currentSession?.user) {
          setSession(currentSession)
          const currentUser = currentSession.user
          setUser(currentUser)
          await fetchProfile(
            currentUser.id,
            currentUser.email,
            currentUser.user_metadata?.full_name || ''
          )
        }
      })
      subscription = subRes?.data?.subscription
    } catch {}

    return () => {
      mounted = false
      subscription?.unsubscribe?.()
    }
  }, [fetchProfile])

  const openAuthModal = useCallback((config = {}) => {
    setAuthModalConfig({
      message: config.message || 'Login or create an account to continue with your booking.',
      targetTour: config.targetTour || null,
      onSuccess: config.onSuccess || null,
      initialTab: config.initialTab || 'login',
    })
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail || !password) {
      throw new Error('Please enter both email and password.')
    }

    console.log('[Auth] Attempting sign in for:', cleanEmail)

    // 1. Try our backend API (SQLite database)
    try {
      const res = await api.post('/auth/login', { email: cleanEmail, password })
      if (res && res.token && res.user) {
        API.setToken(res.token)
        localStorage.setItem('ae_traveler_user', JSON.stringify(res.user))
        setUser(res.user)
        setProfile(res.user)
        const sess = { access_token: res.token, user: res.user }
        setSession(sess)

        // Try Supabase in background if available
        supabase.auth.signInWithPassword({ email: cleanEmail, password }).catch(() => {})

        return { user: res.user, session: sess }
      }
    } catch (apiErr) {
      // If error is invalid credentials or deactivated account, throw directly
      if (apiErr.status === 401 || apiErr.status === 403 || apiErr.message?.includes('Invalid')) {
        throw new Error(apiErr.message || 'Incorrect email or password.')
      }
    }

    // 2. Fallback to Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) throw error

      setUser(data.user)
      setSession(data.session)
      if (data.user) {
        await fetchProfile(data.user.id, data.user.email, data.user.user_metadata?.full_name || '')
      }
      return data
    } catch (err) {
      console.error('[Auth] Sign in error:', err)
      if (err.code === 'invalid_credentials' || err.message?.toLowerCase().includes('invalid')) {
        throw new Error('Incorrect email or password.')
      }
      throw new Error(err.message || 'Failed to log in. Please try again.')
    }
  }, [fetchProfile])

  const signUp = useCallback(async ({ fullName, email, password, confirmPassword, phone }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanName = (fullName || '').trim()

    if (!cleanName) throw new Error('Please enter your full name.')
    if (!cleanEmail) throw new Error('Please enter a valid email address.')
    if (!password) throw new Error('Please enter a password.')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long.')
    if (confirmPassword !== undefined && password !== confirmPassword) {
      throw new Error('Passwords do not match.')
    }

    console.log('[Auth] Attempting sign up for:', cleanEmail)

    // 1. Try our backend API (stores directly in database!)
    try {
      const res = await api.post('/auth/register', {
        fullName: cleanName,
        email: cleanEmail,
        password,
        phone,
      })

      if (res && res.token && res.user) {
        API.setToken(res.token)
        localStorage.setItem('ae_traveler_user', JSON.stringify(res.user))
        setUser(res.user)
        setProfile(res.user)
        const sess = { access_token: res.token, user: res.user }
        setSession(sess)

        // Sync with Supabase in background if reachable
        supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: cleanName, phone: phone || '' } },
        }).catch(() => {})

        return {
          user: res.user,
          session: sess,
          needsEmailVerification: false,
        }
      }
    } catch (apiErr) {
      if (apiErr.status === 400 || apiErr.message?.includes('already exists')) {
        throw new Error(apiErr.message || 'An account with this email already exists.')
      }
      console.warn('[Auth API Register warning]:', apiErr.message)
    }

    // 2. Fallback to Supabase if backend had an issue
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { full_name: cleanName, phone: phone || '' } },
      })

      if (error) throw error

      if (data?.user) {
        setUser(data.user)
        setSession(data.session)
        await fetchProfile(data.user.id, cleanEmail, cleanName)
      }

      return {
        user: data?.user || null,
        session: data?.session || null,
        needsEmailVerification: false,
      }
    } catch (err) {
      console.error('[Auth] Sign up error:', err)
      if (err.message?.toLowerCase().includes('already registered') || err.message?.toLowerCase().includes('exists')) {
        throw new Error('An account with this email already exists. Please log in instead.')
      }
      throw new Error(err.message || 'Unable to create account. Please try again.')
    }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    try {
      API.clearToken()
      localStorage.removeItem('ae_traveler_user')
      await supabase.auth.signOut().catch(() => {})
    } finally {
      setUser(null)
      setSession(null)
      setProfile(null)
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail) throw new Error('Please enter your email address.')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail)
      if (error) throw error
      return true
    } catch (err) {
      console.warn('[Auth] Password reset:', err.message)
      return true // Friendly response
    }
  }, [])

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        fetchProfile,
        authModalOpen,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export default SupabaseAuthProvider