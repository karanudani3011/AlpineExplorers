import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'

const SupabaseAuthContext = createContext(null)

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

      // If profiles table isn't migrated yet or record doesn't exist, create a fallback profile object
      const fallback = {
        id: userId,
        email: fallbackEmail,
        full_name: fallbackName,
        phone: '',
      }
      setProfile(fallback)
      return fallback
    } catch {
      const fallback = {
        id: userId,
        email: fallbackEmail,
        full_name: fallbackName,
        phone: '',
      }
      setProfile(fallback)
      return fallback
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // 1. Initial user check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return
      setSession(initialSession)
      const currentUser = initialSession?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchProfile(
          currentUser.id,
          currentUser.email,
          currentUser.user_metadata?.full_name || ''
        )
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    // 2. Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return
        setSession(currentSession)
        const currentUser = currentSession?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          await fetchProfile(
            currentUser.id,
            currentUser.email,
            currentUser.user_metadata?.full_name || ''
          )
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) {
      if (
        error.message?.toLowerCase().includes('invalid login') ||
        error.message?.toLowerCase().includes('invalid credentials')
      ) {
        throw new Error('Invalid email or password.')
      }
      throw new Error(error.message || 'Failed to log in. Please try again.')
    }

    setUser(data.user)
    setSession(data.session)
    if (data.user) {
      await fetchProfile(
        data.user.id,
        data.user.email,
        data.user.user_metadata?.full_name || ''
      )
    }
    return data
  }, [fetchProfile])

  const signUp = useCallback(async ({ fullName, email, password, confirmPassword, phone }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanName = (fullName || '').trim()

    if (!cleanName) throw new Error('Please enter your full name.')
    if (!cleanEmail) throw new Error('Please enter a valid email address.')
    if (!password) throw new Error('Please enter a password.')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long.')
    if (password !== confirmPassword) throw new Error('Passwords do not match.')

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          phone: phone ? phone.trim() : '',
        },
      },
    })

    if (error) {
      if (
        error.message?.toLowerCase().includes('already registered') ||
        error.message?.toLowerCase().includes('user already exists')
      ) {
        throw new Error('An account with this email already exists. Please log in instead.')
      }
      throw new Error(error.message || 'Unable to create account. Please try again.')
    }

    // Attempt to upsert profile in profiles table
    if (data?.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: cleanName,
          email: cleanEmail,
          phone: phone ? phone.trim() : '',
        })
      } catch {
        // Ignored if table not migrated yet
      }
      await fetchProfile(data.user.id, cleanEmail, cleanName)
    }

    return data
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      setUser(null)
      setSession(null)
      setProfile(null)
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail) throw new Error('Please enter your email address.')

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/`,
    })

    if (error) {
      throw new Error(error.message || 'Unable to send password reset email. Please check the email address.')
    }

    return true
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

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}
