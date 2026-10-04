import { createBrowserClient } from '@supabase/ssr'

const FALLBACK_URL = 'https://nfmjdvvqxbmqkjfgeibo.supabase.co'
const FALLBACK_PUBLISHABLE_KEY = 'sb_publishable_02qM2kPAUBikHOzel1FViA_LmcLRUZF'

export function hasSupabaseEnv(){
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL) &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY)
  )
}

export function createClient(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY
  return createBrowserClient(url, key)
}
