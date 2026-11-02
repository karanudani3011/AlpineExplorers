import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from '../utils/supabase.js'

const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const anonClient = createClient(SUPABASE_URL, anonKey)

// 1. Can anon read draft?
const { data: drafts } = await anonClient.from('blog_posts').select('*').eq('status', 'draft')
console.log('Anon can read drafts?', drafts ? drafts.length : 0)

// 2. Can anon insert?
const { error: insertErr } = await anonClient.from('blog_posts').insert({
  id: 'test-anon-insert',
  slug: 'test-anon-insert',
  title: 'Test',
  status: 'draft'
})
console.log('Anon insert blocked?', insertErr ? `YES: ${insertErr.message}` : 'NO - anon could insert!')
