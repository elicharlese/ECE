"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { supabase } from "@/lib/supabase-client"
import { updateUserSettings, useUserSettings } from "@/lib/user-profile"
import { AccountDeletionDialog } from "./account-deletion-dialog"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function SecurityForm() {
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const { toast } = useToast()
  const userSettings = useUserSettings()
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(userSettings.twoFactorEnabled || false)
  const [sessionAlertEnabled, setSessionAlertEnabled] = useState(userSettings.sessionAlertEnabled || true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true)

    try {
      if (isDemoMode) {
        // Simulate API call for demo mode
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
          variant: "default",
        })
        form.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        // Actually update the password
        const { error } = await supabase.auth.updateUser({
          password: data.newPassword,
        })

        if (error) throw error

        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
          variant: "default",
        })

        form.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.error("Password update error:", error)
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorToggle = async (checked: boolean) => {
    setTwoFactorEnabled(checked)

    try {
      if (!isDemoMode && user) {
        await updateUserSettings(user.id, {
          twoFactorEnabled: checked,
        })
      }

      toast({
        title: checked ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
        description: checked
          ? "Your account is now more secure with two-factor authentication."
          : "Two-factor authentication has been disabled.",
        variant: "default",
      })
    } catch (error) {
      console.error("Two-factor toggle error:", error)
      setTwoFactorEnabled(!checked) // Revert the toggle
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication settings.",
        variant: "destructive",
      })
    }
  }

  const handleSessionAlertToggle = async (checked: boolean) => {
    setSessionAlertEnabled(checked)

    try {
      if (!isDemoMode && user) {
        await updateUserSettings(user.id, {
          sessionAlertEnabled: checked,
        })
      }

      toast({
        title: "Setting updated",
        description: checked
          ? "You will be notified of new login sessions."
          : "You will not be notified of new login sessions.",
        variant: "default",
      })
    } catch (error) {
      console.error("Session alert toggle error:", error)
      setSessionAlertEnabled(!checked) // Revert the toggle
      toast({
        title: "Error",
        description: "Failed to update session alert settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Updating..."
                className="bg-primary hover:bg-primary/90"
              >
                Update Password
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account.</p>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Two-factor authentication</p>
            <p className="text-sm text-muted-foreground">Require a verification code when signing in.</p>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Login Sessions</h3>
        <p className="text-sm text-muted-foreground mb-4">Manage your active sessions and login alerts.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Email alerts for new logins</p>
              <p className="text-sm text-muted-foreground">
                Receive an email when a new device logs into your account.
              </p>
            </div>
            <Switch checked={sessionAlertEnabled} onCheckedChange={handleSessionAlertToggle} />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Active Sessions</AlertTitle>
            <AlertDescription>You can view and manage your active sessions in the Sessions tab.</AlertDescription>
          </Alert>

          <Button variant="outline" className="w-full">
            View Active Sessions
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Delete Account
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Deleting your account will remove all your data, including profile information, settings, and activity
            history.
          </AlertDescription>
        </Alert>

        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="w-full">
          Delete Account
        </Button>

        <AccountDeletionDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      </div>
    </div>
  )
}
