"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Database, Key, Lock, RefreshCw, Server } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Integration = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  isEnabled: boolean
  isConfigured: boolean
  status: "active" | "inactive" | "error"
}

export function AppIntegrationSettings() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "database",
      name: "Database",
      description: "Connect your application to a database",
      icon: <Database className="h-6 w-6" />,
      isEnabled: true,
      isConfigured: true,
      status: "active",
    },
    {
      id: "auth",
      name: "Authentication",
      description: "Add authentication to your application",
      icon: <Lock className="h-6 w-6" />,
      isEnabled: true,
      isConfigured: true,
      status: "active",
    },
    {
      id: "api",
      name: "API Keys",
      description: "Manage API keys for your application",
      icon: <Key className="h-6 w-6" />,
      isEnabled: false,
      isConfigured: false,
      status: "inactive",
    },
    {
      id: "serverless",
      name: "Serverless Functions",
      description: "Deploy serverless functions for your application",
      icon: <Server className="h-6 w-6" />,
      isEnabled: true,
      isConfigured: false,
      status: "error",
    },
  ])

  const toggleIntegration = async (id: string, enabled: boolean) => {
    setIsLoading(id)

    try {
      if (isDemoMode) {
        // Simulate API call for demo mode
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIntegrations(
          integrations.map((integration) => {
            if (integration.id === id) {
              return {
                ...integration,
                isEnabled: enabled,
                status: enabled ? (integration.isConfigured ? "active" : "error") : "inactive",
              }
            }
            return integration
          }),
        )

        toast({
          title: enabled ? "Integration enabled" : "Integration disabled",
          description: `The ${integrations.find((i) => i.id === id)?.name} integration has been ${
            enabled ? "enabled" : "disabled"
          }.`,
          variant: "default",
        })
      } else {
        // Here you would actually toggle the integration in your backend
        // await toggleAppIntegration(appId, id, enabled)
      }
    } catch (error) {
      console.error("Integration toggle error:", error)
      toast({
        title: "Error",
        description: "Failed to update integration settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const configureIntegration = (id: string) => {
    toast({
      title: "Configure Integration",
      description: `Opening configuration for ${integrations.find((i) => i.id === id)?.name}...`,
      variant: "default",
    })
  }

  const refreshIntegration = async (id: string) => {
    setIsLoading(id)

    try {
      if (isDemoMode) {
        // Simulate API call for demo mode
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIntegrations(
          integrations.map((integration) => {
            if (integration.id === id) {
              return {
                ...integration,
                status: "active",
                isConfigured: true,
              }
            }
            return integration
          }),
        )

        toast({
          title: "Integration refreshed",
          description: `The ${integrations.find((i) => i.id === id)?.name} integration has been refreshed.`,
          variant: "default",
        })
      } else {
        // Here you would actually refresh the integration in your backend
        // await refreshAppIntegration(appId, id)
      }
    } catch (error) {
      console.error("Integration refresh error:", error)
      toast({
        title: "Error",
        description: "Failed to refresh integration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Integrations</h3>
      </div>

      <Alert variant="default" className="bg-muted/50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Enable and configure integrations for your application. Some integrations may require additional setup.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {integration.icon}
                  <CardTitle>{integration.name}</CardTitle>
                </div>
                {getStatusBadge(integration.status)}
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enable Integration</span>
                <Switch
                  checked={integration.isEnabled}
                  onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                  disabled={isLoading === integration.id}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => configureIntegration(integration.id)}
                disabled={!integration.isEnabled || isLoading === integration.id}
              >
                Configure
              </Button>
              {integration.status === "error" && (
                <LoadingButton
                  variant="outline"
                  size="sm"
                  onClick={() => refreshIntegration(integration.id)}
                  isLoading={isLoading === integration.id}
                  loadingText="Refreshing..."
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </LoadingButton>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
