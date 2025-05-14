"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Globe, Shield, Bell, Database } from "lucide-react"

export function AppSettings() {
  const [appName, setAppName] = useState("DeFi Protocol")
  const [appDescription, setAppDescription] = useState(
    "A decentralized finance protocol for lending and borrowing crypto assets",
  )
  const [autoScaling, setAutoScaling] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [region, setRegion] = useState("us-east-1")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          App Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4 grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">App Name</Label>
                <Input id="app-name" value={appName} onChange={(e) => setAppName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="app-description">Description</Label>
                <Textarea
                  id="app-description"
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                    <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                    <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="auto-scaling">Auto Scaling</Label>
                  <span className="text-xs text-gray-500">Automatically scale resources based on usage</span>
                </div>
                <Switch id="auto-scaling" checked={autoScaling} onCheckedChange={setAutoScaling} />
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <span className="text-xs text-gray-500">Put app in maintenance mode</span>
                </div>
                <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="analytics">Analytics</Label>
                  <span className="text-xs text-gray-500">Enable usage analytics</span>
                </div>
                <Switch id="analytics" checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="domains">
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-4">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Globe className="h-10 w-10 text-gray-400" />
                <h3 className="text-lg font-medium">Domain Settings</h3>
                <p className="text-sm text-gray-500">Configure custom domains and SSL certificates</p>
                <Button className="mt-2">Add Domain</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-4">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Shield className="h-10 w-10 text-gray-400" />
                <h3 className="text-lg font-medium">Security Settings</h3>
                <p className="text-sm text-gray-500">Configure security settings and access controls</p>
                <Button className="mt-2">Manage Security</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-4">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Bell className="h-10 w-10 text-gray-400" />
                <h3 className="text-lg font-medium">Notification Settings</h3>
                <p className="text-sm text-gray-500">Configure alerts and notification preferences</p>
                <Button className="mt-2">Configure Notifications</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-4">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Database className="h-10 w-10 text-gray-400" />
                <h3 className="text-lg font-medium">Database Settings</h3>
                <p className="text-sm text-gray-500">Configure database connections and settings</p>
                <Button className="mt-2">Manage Database</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
