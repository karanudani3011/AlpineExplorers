import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'

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

    // Supabase restores the persisted session after refresh.
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
      if (mounted) setLoading(false)
    }).catch(() => { if (mounted) setLoading(false) })

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
        } else {
          setSession(null)
          setUser(null)
          setProfile(null)
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
      if (err.code === 'invalid_credentials' || err.message?.toLowerCase().includes('invalid')) {
        throw new Error('Invalid email or password.')
      }
      throw new Error('Unable to log in. Please check your connection and try again.')
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
        needsEmailVerification: !data?.session,
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes('already registered') || err.message?.toLowerCase().includes('exists')) {
        throw new Error('An account with this email already exists. Please log in instead.')
      }
      throw new Error('Unable to create account. Please check your details and try again.')
    }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
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
    } catch {
      throw new Error('Unable to send the password reset email. Please try again.')
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
