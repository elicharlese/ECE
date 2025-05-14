"use client"

import type React from "react"

import { useEffect } from "react"
import { prioritizeCriticalFonts, adjustFontLoadingForConnection } from "@/lib/font-loading-optimization"
import { FontStyleMatcher } from "@/components/ui/font-style-matcher"

export function FontOptimizationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Implement font loading optimizations
    prioritizeCriticalFonts()
    adjustFontLoadingForConnection()

    // Add font loading event listeners
    if ("fonts" in document) {
      document.fonts.addEventListener("loadingdone", () => {
        // Mark fonts as loaded to prevent FOUT
        document.documentElement.classList.add("fonts-loaded")
      })
    }

    // Add font loading timeout to prevent waiting too long
    const fontTimeout = setTimeout(() => {
      document.documentElement.classList.add("fonts-loaded")
    }, 3000) // 3 second timeout

    return () => clearTimeout(fontTimeout)
  }, [])

  return (
    <>
      <FontStyleMatcher />
      {children}
    </>
  )
}
