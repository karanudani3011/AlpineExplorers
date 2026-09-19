import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

if (!isConfigured) {
  console.warn(
    '[supabaseClient] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env — ' +
      'Supabase auth & booking features are disabled until they are added. ' +
      'Copy .env.example to .env, fill in your Supabase project URL and anon key, then restart the dev server.'
  )
}

const unconfiguredMessage =
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server.'

const noData = { data: null, error: { message: unconfiguredMessage } }

const authResult = async () => ({ data: { user: null, session: null }, error: { message: unconfiguredMessage } })

// Graceful fallback so the site still loads even without a .env. It mirrors the small
// supabase API surface used by the frontend and never throws at import time.
function createNoopClient() {
  const chain = () => {
    const pending = {
      select: () => pending,
      eq: () => pending,
      neq: () => pending,
      in: () => pending,
      order: () => pending,
      limit: () => pending,
      match: () => pending,
      is: () => pending,
      maybeSingle: async () => noData,
      single: async () => noData,
      insert: async () => noData,
      upsert: async () => noData,
      update: async () => noData,
      delete: async () => noData,
    }
    return pending
  }
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: authResult,
      signUp: authResult,
      signInWithOtp: authResult,
      resetPasswordForEmail: authResult,
      updateUser: authResult,
      signOut: async () => ({ error: null }),
    },
    from: () => chain(),
    storage: {
      from: () => ({
        upload: async () => noData,
        remove: async () => noData,
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  }
}

export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : createNoopClient()