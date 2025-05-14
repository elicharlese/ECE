import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isDemoModeEnabled } from "./lib/demo-utils"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if demo mode is enabled
  const demoMode = isDemoModeEnabled()

  // If user is signed in or in demo mode and the current path is /login or /signup, redirect to /app
  if ((session || demoMode) && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/app", req.url))
  }

  // If user is not signed in and not in demo mode and the current path is /app, redirect to /login
  if (!session && !demoMode && req.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
