import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase-variabler mangler. Sjekk .env.local for VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
