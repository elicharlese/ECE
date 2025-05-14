"use client"

import type React from "react"

export function AppContainer({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>
}
