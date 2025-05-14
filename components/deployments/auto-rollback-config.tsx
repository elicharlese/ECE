"use client"

import { useState } from "react"
import { useDeployments } from "@/context/deployment-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Info, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AutoRollbackConfig() {
  const { autoRollbackConfig, updateAutoRollbackConfig, isAutoRollbackConfigLoading } = useDeployments()
  const [config, setConfig] = useState(autoRollbackConfig)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Handle loading state
  if (isAutoRollbackConfigLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Automatic Rollback Configuration</CardTitle>
          <CardDescription>Loading configuration...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  // Initialize config if it's loaded but state isn't set
  if (autoRollbackConfig && !config) {
    setConfig(autoRollbackConfig)
    return null
  }

  if (!config) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Automatic Rollback Configuration</CardTitle>
          <CardDescription>Configuration not available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Unable to load configuration</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSave = async () => {
    if (!config) return

    setIsSaving(true)
    try {
      const success = await updateAutoRollbackConfig(config)
      if (success) {
        toast({
          title: "Configuration Saved",
          description: "Automatic rollback configuration has been updated",
        })
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to update automatic rollback configuration",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the configuration",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleEnabled = (enabled: boolean) => {
    setConfig((prev) => (prev ? { ...prev, enabled } : null))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Automatic Rollback Configuration</CardTitle>
            <CardDescription>Configure when deployments should be automatically rolled back</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Enabled</span>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleToggleEnabled}
              aria-label="Toggle automatic rollbacks"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!config.enabled ? (
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Automatic Rollbacks Disabled</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Enable automatic rollbacks to have the system automatically revert problematic deployments based on
                    your configured thresholds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="metrics">Metrics Thresholds</TabsTrigger>
              <TabsTrigger value="timing">Timing & Behavior</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Error Rate Threshold</h3>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[config.metrics.errorRateThreshold]}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onValueChange={(value) =>
                        setConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                metrics: { ...prev.metrics, errorRateThreshold: value[0] },
                              }
                            : null,
                        )
                      }
                      className="flex-1"
                      disabled={!config.enabled}
                    />
                    <span className="w-12 text-right">{config.metrics.errorRateThreshold}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Rollback when error rate exceeds this percentage</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Latency Threshold</h3>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[config.metrics.latencyThreshold]}
                      min={50}
                      max={1000}
                      step={10}
                      onValueChange={(value) =>
                        setConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                metrics: { ...prev.metrics, latencyThreshold: value[0] },
                              }
                            : null,
                        )
                      }
                      className="flex-1"
                      disabled={!config.enabled}
                    />
                    <span className="w-16 text-right">{config.metrics.latencyThreshold} ms</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rollback when average response time exceeds this threshold
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">CPU Usage Threshold</h3>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[config.metrics.cpuUsageThreshold]}
                      min={50}
                      max={95}
                      step={5}
                      onValueChange={(value) =>
                        setConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                metrics: { ...prev.metrics, cpuUsageThreshold: value[0] },
                              }
                            : null,
                        )
                      }
                      className="flex-1"
                      disabled={!config.enabled}
                    />
                    <span className="w-12 text-right">{config.metrics.cpuUsageThreshold}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Rollback when CPU usage exceeds this percentage</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Memory Usage Threshold</h3>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[config.metrics.memoryUsageThreshold]}
                      min={50}
                      max={95}
                      step={5}
                      onValueChange={(value) =>
                        setConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                metrics: { ...prev.metrics, memoryUsageThreshold: value[0] },
                              }
                            : null,
                        )
                      }
                      className="flex-1"
                      disabled={!config.enabled}
                    />
                    <span className="w-12 text-right">{config.metrics.memoryUsageThreshold}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rollback when memory usage exceeds this percentage
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="custom-threshold"
                    checked={config.metrics.useCustomThresholds}
                    onCheckedChange={(checked) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              metrics: { ...prev.metrics, useCustomThresholds: checked },
                            }
                          : null,
                      )
                    }
                    disabled={!config.enabled}
                  />
                  <Label htmlFor="custom-threshold">Use custom thresholds per environment</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timing">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="monitoring-period" className="text-sm font-medium">
                    Monitoring Period (minutes)
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="monitoring-period"
                      value={[config.timing.monitoringPeriod]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) =>
                        setConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: { ...prev.timing, monitoringPeriod: value[0] },
                              }
                            : null,
                        )
                      }
                      className="flex-1"
                      disabled={!config.enabled}
                    />
                    <span className="w-12 text-right">{config.timing.monitoringPeriod} min</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitor deployments for this period before deciding to roll back
                  </p>
                </div>

                <div>
                  <Label htmlFor="grace-period" className="text-sm font-medium">
                    Grace Period (minutes)
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="grace-period"
                      value={[config.timing.gracePeriod]}
                      min={0}
                      max={30}
                      step={1}
                      onValueChange={(value) =>
                        setConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                timing: { ...prev.timing, gracePeriod: value[0] },
                              }
                            : null,
                        )
                      }
                      className="flex-1"
                      disabled={!config.enabled}
                    />
                    <span className="w-12 text-right">{config.timing.gracePeriod} min</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Initial period after deployment where metrics are collected but not evaluated
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="require-consecutive"
                    checked={config.timing.requireConsecutiveFailures}
                    onCheckedChange={(checked) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              timing: { ...prev.timing, requireConsecutiveFailures: checked },
                            }
                          : null,
                      )
                    }
                    disabled={!config.enabled}
                  />
                  <Label htmlFor="require-consecutive">Require consecutive threshold violations</Label>
                </div>

                <div>
                  <Label htmlFor="consecutive-count" className="text-sm font-medium">
                    Consecutive Violations Required
                  </Label>
                  <Input
                    id="consecutive-count"
                    type="number"
                    min={1}
                    max={10}
                    value={config.timing.consecutiveFailuresCount}
                    onChange={(e) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              timing: {
                                ...prev.timing,
                                consecutiveFailuresCount: Number.parseInt(e.target.value) || 1,
                              },
                            }
                          : null,
                      )
                    }
                    className="mt-2"
                    disabled={!config.enabled || !config.timing.requireConsecutiveFailures}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Number of consecutive threshold violations required to trigger a rollback
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify-before"
                    checked={config.notifications.notifyBeforeRollback}
                    onCheckedChange={(checked) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              notifications: { ...prev.notifications, notifyBeforeRollback: checked },
                            }
                          : null,
                      )
                    }
                    disabled={!config.enabled}
                  />
                  <Label htmlFor="notify-before">Notify before automatic rollback</Label>
                </div>

                <div>
                  <Label htmlFor="warning-period" className="text-sm font-medium">
                    Warning Period (seconds)
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="warning-period"
                      value={[config.notifications.warningPeriod]}
                      min={0}
                      max={300}
                      step={15}
                      onValueChange={(value) =>
                        setConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                notifications: { ...prev.notifications, warningPeriod: value[0] },
                              }
                            : null,
                        )
                      }
                      className="flex-1"
                      disabled={!config.enabled || !config.notifications.notifyBeforeRollback}
                    />
                    <span className="w-16 text-right">{config.notifications.warningPeriod} sec</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Time between warning notification and automatic rollback
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-override"
                    checked={config.notifications.allowManualOverride}
                    onCheckedChange={(checked) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              notifications: { ...prev.notifications, allowManualOverride: checked },
                            }
                          : null,
                      )
                    }
                    disabled={!config.enabled}
                  />
                  <Label htmlFor="allow-override">Allow manual override of automatic rollbacks</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify-slack"
                    checked={config.notifications.notifyChannels.slack}
                    onCheckedChange={(checked) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                notifyChannels: { ...prev.notifications.notifyChannels, slack: checked },
                              },
                            }
                          : null,
                      )
                    }
                    disabled={!config.enabled}
                  />
                  <Label htmlFor="notify-slack">Send Slack notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify-email"
                    checked={config.notifications.notifyChannels.email}
                    onCheckedChange={(checked) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                notifyChannels: { ...prev.notifications.notifyChannels, email: checked },
                              },
                            }
                          : null,
                      )
                    }
                    disabled={!config.enabled}
                  />
                  <Label htmlFor="notify-email">Send email notifications</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
