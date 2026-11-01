// Supabase Edge Function: delete-cloudinary-asset
// Securely deletes photos or videos from Cloudinary using Cloudinary API Secret
// Deployment:
// 1. supabase secrets set CLOUDINARY_CLOUD_NAME=izgswkwq CLOUDINARY_API_KEY=277647969313713 CLOUDINARY_API_SECRET=rprGXN65QRHqrYYvlCLypArfWN4
// 2. supabase functions deploy delete-cloudinary-asset

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify caller authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Parse request payload
    const { public_id, resource_type = 'image' } = await req.json()
    if (!public_id) {
      return new Response(JSON.stringify({ error: 'public_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Compute Cloudinary SHA-1 signature for authenticated destroy API call
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME') || 'izgswkwq'
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY') || ''
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET') || ''
    const timestamp = Math.floor(Date.now() / 1000).toString()

    const toSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`
    const encoder = new TextEncoder()
    const data = encoder.encode(toSign)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    // 4. Call Cloudinary Destroy API
    const formData = new FormData()
    formData.append('public_id', public_id)
    formData.append('timestamp', timestamp)
    formData.append('api_key', apiKey)
    formData.append('signature', signature)
    formData.append('invalidate', 'true')

    const resType = resource_type === 'video' ? 'video' : 'image'
    const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resType}/destroy`
    const cloudRes = await fetch(cloudUrl, {
      method: 'POST',
      body: formData,
    })

    const cloudData = await cloudRes.json()

    return new Response(JSON.stringify({ success: true, result: cloudData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

