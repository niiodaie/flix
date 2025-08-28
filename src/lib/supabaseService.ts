import { createClient } from '@supabase/supabase-js'

export const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key', // server only
  { auth: { persistSession: false, autoRefreshToken: false } }
)

