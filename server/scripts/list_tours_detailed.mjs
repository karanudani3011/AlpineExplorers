import { getSupabaseAdmin } from '../utils/supabase.js'
import fs from 'node:fs'

const sb = getSupabaseAdmin()
const { data: sbTours } = await sb.from('tours').select('id, slug, title, category, category_name, location, images')

console.log('Current Supabase Tours Count:', sbTours ? sbTours.length : 0)
console.log(sbTours.map((t, idx) => `${idx + 1}. [${t.category}] ${t.id} -> ${t.title} (${t.location || ''})`).join('\n'))
