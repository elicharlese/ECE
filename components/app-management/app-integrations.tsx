"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Plus, Settings, Check, AlertTriangle, XCircle, RefreshCw } from "lucide-react"

type Integration = {
  id: string
  name: string
  description: string
  status: "connected" | "disconnected" | "error"
  lastSync: string
  category: "development" | "analytics" | "communication" | "storage"
  icon: string
}

const mockIntegrations: Integration[] = [
  {
    id: "int-1",
    name: "GitHub",
    description: "Connect your GitHub repositories",
    status: "connected",
    lastSync: "2023-04-15T10:30:00Z",
    category: "development",
    icon: "/stylized-gh.png",
  },
  {
    id: "int-2",
    name: "Vercel",
    description: "Deploy and host your applications",
    status: "connected",
    lastSync: "2023-04-15T09:45:00Z",
    category: "development",
    icon: "/vc-logo.png",
  },
  {
    id: "int-3",
    name: "Supabase",
    description: "Database and authentication",
    status: "connected",
    lastSync: "2023-04-14T15:20:00Z",
    category: "storage",
    icon: "/stylized-letter-sb.png",
  },
  {
    id: "int-4",
    name: "Google Analytics",
    description: "Track user behavior and metrics",
    status: "disconnected",
    lastSync: "2023-04-10T11:15:00Z",
    category: "analytics",
    icon: "/green-abstract-art.png",
  },
  {
    id: "int-5",
    name: "Slack",
    description: "Receive notifications and alerts",
    status: "error",
    lastSync: "2023-04-12T14:30:00Z",
    category: "communication",
    icon: "/abstract-sl.png",
  },
]

export function AppIntegrations() {
  const [integrations] = useState<Integration[]>(mockIntegrations)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <Check className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "Connected"
      case "disconnected":
        return "Disconnected"
      case "error":
        return "Error"
    }
  }

  const getStatusBadgeColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "disconnected":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Integrations
          </span>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0 space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                    <img src={integration.icon || "/placeholder.svg"} alt={integration.name} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <Badge className={getStatusBadgeColor(integration.status)}>
                      <span className="mr-1">{getStatusIcon(integration.status)}</span>
                      {getStatusText(integration.status)}
                    </Badge>
                    <span className="mt-1 text-xs text-gray-500">Last sync: {formatDate(integration.lastSync)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="development" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Development integrations will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Analytics integrations will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Communication integrations will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Storage integrations will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
