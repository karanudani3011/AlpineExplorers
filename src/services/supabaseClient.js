import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://qhbsilnramjkagdjitlp.supabase.co'

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYnNpbG5yYW1qa2FnZGppdGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDYzOTUsImV4cCI6MjEwNDUyMjM5NX0.VYof3R8a367R5zorFz7qaWl4mrMtx1thC2hTNHM-yW4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
