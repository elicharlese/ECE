"use client"

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AutosaveStatus = "idle" | "saving" | "saved" | "error"

interface AutosaveIndicatorProps {
  status: AutosaveStatus
  className?: string
}

export function AutosaveIndicator({ status, className }: AutosaveIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {status === "idle" && null}

      {status === "saving" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}

      {status === "saved" && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Saved</span>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-destructive">Failed to save</span>
        </>
      )}
    </div>
  )
}
