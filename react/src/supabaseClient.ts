import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// A quick safety check to ensure your .env variables are loading
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

// Export the typed client so you can use it anywhere in your React app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
