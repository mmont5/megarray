import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function getSupabaseBrowserClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Make sure environment variables are set.')
  }
  return supabase
}

export type Profile = {
  id: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  updated_at: string
}

export type Session = {
  user: {
    id: string
    email: string
  }
  access_token: string
  refresh_token: string
} 