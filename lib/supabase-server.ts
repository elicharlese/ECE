import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { cookies } from "next/headers"

export function createServerClient(cookieStore: () => ReturnType<typeof cookies>) {
  return createServerComponentClient({ cookies: cookieStore })
}

export const supabase = createServerClient
