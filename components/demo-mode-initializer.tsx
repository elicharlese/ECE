"use client"

import { useEffect } from "react"
import { useDemo } from "@/lib/demo-context"
import { isDemoModeEnabled } from "@/lib/demo-utils"
import { useToast } from "@/hooks/use-toast"

export function DemoModeInitializer() {
  const { isDemoMode, enableDemoMode } = useDemo()
  const { toast } = useToast()

  useEffect(() => {
    // Check if demo mode is enabled in storage but not in context
    const checkAndInitializeDemoMode = () => {
      const demoEnabled = isDemoModeEnabled()

      if (demoEnabled && !isDemoMode) {
        console.log("Demo mode detected in storage, initializing context")

        // Show toast notification
        toast({
          title: "Demo Mode Active",
          description: "You are viewing the application in demo mode with sample data.",
          variant: "default",
        })

        // Update the context state without navigation
        enableDemoMode()
      }
    }

    // Check on mount with a slight delay to ensure context is ready
    setTimeout(checkAndInitializeDemoMode, 500)
  }, [isDemoMode, enableDemoMode, toast])

  return null
}
