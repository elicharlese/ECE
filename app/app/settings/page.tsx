"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/profile/profile-form"
import { SecurityForm } from "@/components/profile/security-form"
import { NotificationsForm } from "@/components/profile/notifications-form"
import { AppearanceForm } from "@/components/profile/appearance-form"
import { ProfileHeader } from "@/components/profile/profile-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TabNavigation } from "@/components/ui/tab-navigation"
import { IntegrationSettings } from "@/components/integrations/integration-settings"
import { CalendarSyncSettings } from "@/components/team/calendar-sync-settings"
import { TimezonePreferences } from "@/components/team/timezone-preferences"
import { AutoThemeSettings } from "@/components/profile/auto-theme-settings"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const { isDemoMode } = useDemo()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")

  // Redirect if not authenticated and not in demo mode
  useEffect(() => {
    if (!isLoading && !user && !isDemoMode) {
      router.push("/login")
    }
  }, [user, isLoading, isDemoMode, router])

  // Show success toast when tab changes (simulating saved settings)
  const handleTabChange = (value: string) => {
    const prevTab = activeTab
    setActiveTab(value)

    if (prevTab !== value && prevTab !== "") {
      toast({
        title: "Settings saved",
        description: `Your ${prevTab} settings have been saved successfully.`,
        variant: "default",
      })
    }
  }

  const tabItems = [
    { value: "profile", label: "Profile" },
    { value: "security", label: "Security" },
    { value: "notifications", label: "Notifications" },
    { value: "appearance", label: "Appearance" },
    { value: "integrations", label: "Integrations" },
    { value: "calendar", label: "Calendar" },
    { value: "timezone", label: "Timezone" },
  ]

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="hidden md:block">
          <ProfileHeader />
          <Separator className="my-6" />
          <div className="flex flex-col space-y-1">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("profile")}
            >
              Profile
            </Button>
            <Button
              variant={activeTab === "security" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("security")}
            >
              Security
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("notifications")}
            >
              Notifications
            </Button>
            <Button
              variant={activeTab === "appearance" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("appearance")}
            >
              Appearance
            </Button>
            <Button
              variant={activeTab === "integrations" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("integrations")}
            >
              Integrations
            </Button>
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("calendar")}
            >
              Calendar
            </Button>
            <Button
              variant={activeTab === "timezone" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("timezone")}
            >
              Timezone
            </Button>
          </div>
        </div>

        <div>
          <div className="md:hidden mb-6">
            <ProfileHeader />
            <Separator className="my-6" />
            <TabNavigation items={tabItems} value={activeTab} onValueChange={handleTabChange} />
          </div>

          <div className="space-y-6">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your public profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security and authentication settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityForm />
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationsForm />
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent>
                  <AppearanceForm />
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Auto Theme Settings</h3>
                    <AutoThemeSettings />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "integrations" && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Manage your connected services and integrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <IntegrationSettings />
                </CardContent>
              </Card>
            )}

            {activeTab === "calendar" && (
              <Card>
                <CardHeader>
                  <CardTitle>Calendar Settings</CardTitle>
                  <CardDescription>Manage your calendar synchronization settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarSyncSettings />
                </CardContent>
              </Card>
            )}

            {activeTab === "timezone" && (
              <Card>
                <CardHeader>
                  <CardTitle>Timezone Preferences</CardTitle>
                  <CardDescription>Manage your timezone and display preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <TimezonePreferences />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
