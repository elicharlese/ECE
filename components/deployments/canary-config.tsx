"use client"

import { useState } from "react"
import { useDeployments } from "@/context/deployment-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import type { CanaryConfig } from "@/types/deployment"

export function CanaryConfig() {
  const { canaryConfig, updateCanaryConfig, isCanaryConfigLoading } = useDeployments()
  const [config, setConfig] = useState<CanaryConfig | null>(canaryConfig)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Canary Deployment Configuration</CardTitle>
            <CardDescription>Configure how canary deployments are managed</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isCanaryConfigLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="canary-enabled">Enable Canary Deployments</Label>
              <Switch id="canary-enabled" disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-percentage">Initial Traffic Percentage</Label>
              <Slider id="initial-percentage" disabled />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="increment-step">Increment Step</Label>
                <Input id="increment-step" type="number" disabled />
              </div>
              <div>
                <Label htmlFor="increment-interval">Increment Interval</Label>
                <Input id="increment-interval" type="number" disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-percentage">Maximum Traffic Percentage</Label>
              <Slider id="max-percentage" disabled />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-promote" disabled />
              <Label htmlFor="auto-promote">Auto-Promote Canary</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auto-promote-threshold">Auto-Promote Threshold</Label>
              <Input id="auto-promote-threshold" type="number" disabled />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
