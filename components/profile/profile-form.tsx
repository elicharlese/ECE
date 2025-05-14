"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile } from "@/lib/user-profile"
import { useAutosave } from "@/hooks/use-autosave"
import { AutosaveIndicator } from "@/components/ui/autosave-indicator"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
  website: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    name: "",
    username: "",
    bio: "",
    website: "",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const formValues = form.watch()

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.name || user.email?.split("@")[0] || ""
      const username = user.user_metadata?.username || name.toLowerCase().replace(/\s+/g, "") || ""

      form.reset({
        name,
        username,
        bio: user.user_metadata?.bio || "",
        website: user.user_metadata?.website || "",
      })
    } else if (isDemoMode) {
      form.reset({
        name: "Demo User",
        username: "demouser",
        bio: "This is a demo account for exploring the ECE platform features.",
        website: "https://example.com",
      })
    }
  }, [user, isDemoMode, form])

  const saveProfile = async (data: ProfileFormValues) => {
    if (isDemoMode) {
      // Simulate API call for demo mode
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
    }

    if (user) {
      // Actually update the user profile
      await updateUserProfile(user.id, {
        name: data.name,
        username: data.username,
        bio: data.bio,
        website: data.website,
      })
    }
  }

  const { status: autosaveStatus, forceSave } = useAutosave({
    data: formValues,
    onSave: saveProfile,
    debounceMs: 1500,
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      await forceSave()

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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
          <h3 className="text-lg font-medium">Profile Information</h3>
          <AutosaveIndicator status={autosaveStatus} />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>This is your public username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Brief description for your profile. Max 160 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>Your personal or company website.</FormDescription>
              <FormMessage />
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
