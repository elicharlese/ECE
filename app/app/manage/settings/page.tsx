"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TabNavigation } from "@/components/ui/tab-navigation"
import { AppGeneralSettings } from "@/components/app-management/app-general-settings"
import { AppEnvironmentVariables } from "@/components/app-management/app-environment-variables"
import { AppDomainSettings } from "@/components/app-management/app-domain-settings"
import { AppIntegrationSettings } from "@/components/app-management/app-integration-settings"
import { useDemo } from "@/lib/demo-context"
import { useToast } from "@/hooks/use-toast"

export default function AppSettingsPage() {
  const router = useRouter()
  const { isDemoMode } = useDemo()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  // Handle tab change
  const handleTabChange = (value: string) => {
    const prevTab = activeTab
    setActiveTab(value)

    if (prevTab !== value && prevTab !== "") {
      toast({
        title: "Settings saved",
        description: `Your ${prevTab} settings have been saved automatically.`,
        variant: "default",
      })
    }
  }

  const tabItems = [
    { value: "general", label: "General" },
    { value: "environment", label: "Environment Variables" },
    { value: "domains", label: "Domains" },
    { value: "integrations", label: "Integrations" },
  ]

  return (
    <div className="container py-10">
      <div className="flex items-center mb-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">App Settings</h1>
      </div>

      <div className="mb-6">
        <TabNavigation items={tabItems} value={activeTab} onValueChange={handleTabChange} />
      </div>

      <div className="space-y-6">
        {activeTab === "general" && (
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic settings for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <AppGeneralSettings />
            </CardContent>
          </Card>
        )}

        {activeTab === "environment" && (
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Manage environment variables for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <AppEnvironmentVariables />
            </CardContent>
          </Card>
        )}

        {activeTab === "domains" && (
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>Configure domains and subdomains for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <AppDomainSettings />
            </CardContent>
          </Card>
        )}

        {activeTab === "integrations" && (
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure third-party integrations for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <AppIntegrationSettings />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
