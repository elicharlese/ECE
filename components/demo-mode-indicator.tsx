"use client"

import { useDemo } from "@/lib/demo-context"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DemoModeIndicator() {
  const { isDemoMode, toggleDemoMode } = useDemo()

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center space-x-2">
        <Switch id="demo-mode" checked={isDemoMode} onCheckedChange={toggleDemoMode} />
        <Label htmlFor="demo-mode">Demo Mode</Label>
      </div>

      {isDemoMode && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center gap-1"
              >
                <InfoIcon className="h-3 w-3" />
                Demo
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Using demo data. No real transactions are being processed.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
