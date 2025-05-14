"use client"

import { useEffect, useState } from "react"
import { isDemoModeEnabled } from "@/lib/demo-utils"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function DemoModeDetector() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if demo mode is enabled
    const demoEnabled = isDemoModeEnabled()
    setIsDemoMode(demoEnabled)

    if (demoEnabled) {
      // Show toast notification
      toast({
        title: "Demo Mode Active",
        description: "You are viewing the application in demo mode with sample data.",
        variant: "default",
      })
    }
  }, [toast])

  if (!isDemoMode) return null

  return (
    <Alert
      variant="default"
      className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30"
    >
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Demo Mode Active</AlertTitle>
      <AlertDescription>
        You are currently viewing the application in demo mode. All data shown is sample data and no real transactions
        will be processed.
      </AlertDescription>
    </Alert>
  )
}
