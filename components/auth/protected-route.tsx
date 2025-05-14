"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isDemoModeEnabled } from "@/lib/demo-utils"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if demo mode is enabled
    const demoMode = isDemoModeEnabled()

    if (!isLoading && !user && !demoMode) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  // Allow access if user is authenticated or in demo mode
  if (user || isDemoModeEnabled()) {
    return <>{children}</>
  }

  // Show nothing while redirecting
  return null
}
