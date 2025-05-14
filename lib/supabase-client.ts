import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export the singleton instance for direct use
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Export a function to create a new client (useful for components that need a fresh client)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
