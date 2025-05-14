"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"
import { useAutosave } from "@/hooks/use-autosave"
import { AutosaveIndicator } from "@/components/ui/autosave-indicator"

const generalSettingsSchema = z.object({
  name: z.string().min(2, {
    message: "App name must be at least 2 characters.",
  }),
  description: z.string().max(200, {
    message: "Description must not be longer than 200 characters.",
  }),
  framework: z.string(),
  autoDeployment: z.boolean(),
  productionBranch: z.string(),
})

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>

export function AppGeneralSettings() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const [isLoading, setIsLoading] = useState(false)

  // Default values for the form
  const defaultValues: GeneralSettingsValues = {
    name: "My ECE App",
    description: "A blockchain application built with ECE platform",
    framework: "next",
    autoDeployment: true,
    productionBranch: "main",
  }

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
    mode: "onChange",
  })

  const formValues = form.watch()

  const saveSettings = async (data: GeneralSettingsValues) => {
    if (isDemoMode) {
      // Simulate API call for demo mode
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
    }

    // Here you would actually save the settings to your backend
    // await updateAppSettings(appId, data)
  }

  const { status: autosaveStatus, forceSave } = useAutosave({
    data: formValues,
    onSave: saveSettings,
    debounceMs: 1500,
  })

  async function onSubmit(data: GeneralSettingsValues) {
    setIsLoading(true)

    try {
      await forceSave()

      toast({
        title: "Settings updated",
        description: "Your app settings have been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Settings update error:", error)
      toast({
        title: "Error",
        description: "Failed to update app settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">App Configuration</h3>
          <AutosaveIndicator status={autosaveStatus} />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Name</FormLabel>
              <FormControl>
                <Input placeholder="My App" {...field} />
              </FormControl>
              <FormDescription>The name of your application.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="A brief description of your app" {...field} />
              </FormControl>
              <FormDescription>Brief description for your application. Max 200 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="framework"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Framework</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The framework used for your application.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionBranch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Production Branch</FormLabel>
              <FormControl>
                <Input placeholder="main" {...field} />
              </FormControl>
              <FormDescription>The branch that will be deployed to production.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="autoDeployment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto Deployment</FormLabel>
                <FormDescription>
                  Automatically deploy when changes are pushed to the production branch.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText="Saving..."
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
