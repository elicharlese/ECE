"use client"

import { supabase } from "./supabase-client"
import { useAuth } from "./auth-context"
import { useEffect, useState } from "react"

export type UserProfile = {
  name: string
  username: string
  bio: string
  website: string
  avatarUrl: string
}

export type UserSettings = {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  reducedMotion: boolean
  highContrast: boolean
  emailNotifications: boolean
  emailUpdates: boolean
  emailSecurity: boolean
  emailMarketing: boolean
  pushNotifications: boolean
  pushMessages: boolean
  pushUpdates: boolean
  pushSecurity: boolean
  marketplaceUpdates: boolean
  projectUpdates: boolean
  transactionAlerts: boolean
  twoFactorEnabled: boolean
  sessionAlertEnabled: boolean
}

export const defaultUserSettings: UserSettings = {
  theme: "system",
  fontSize: "medium",
  reducedMotion: false,
  highContrast: false,
  emailNotifications: true,
  emailUpdates: true,
  emailSecurity: true,
  emailMarketing: false,
  pushNotifications: true,
  pushMessages: true,
  pushUpdates: true,
  pushSecurity: true,
  marketplaceUpdates: true,
  projectUpdates: true,
  transactionAlerts: true,
  twoFactorEnabled: false,
  sessionAlertEnabled: true,
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  const { error } = await supabase.auth.updateUser({
    data: {
      profile: {
        ...profile,
      },
    },
  })

  if (error) {
    throw error
  }
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>) {
  const { error } = await supabase.auth.updateUser({
    data: {
      settings: {
        ...settings,
      },
    },
  })

  if (error) {
    throw error
  }
}

export async function deleteUserAccount(userId: string, password: string) {
  // First verify the password by attempting to sign in
  const { data: user, error: signInError } = await supabase.auth.signInWithPassword({
    email: "", // This should be filled with the user's email
    password,
  })

  if (signInError) {
    throw new Error("Incorrect password. Please try again.")
  }

  // Then delete the user account
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

  if (deleteError) {
    throw new Error("Failed to delete account. Please try again later.")
  }
}

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    username: "",
    bio: "",
    website: "",
    avatarUrl: "",
  })

  useEffect(() => {
    if (user) {
      const userProfile = user.user_metadata?.profile || {}
      setProfile({
        name: userProfile.name || user.user_metadata?.name || "",
        username: userProfile.username || "",
        bio: userProfile.bio || "",
        website: userProfile.website || "",
        avatarUrl: userProfile.avatarUrl || user.user_metadata?.avatar_url || "",
      })
    }
  }, [user])

  return profile
}

export function useUserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings)

  useEffect(() => {
    if (user) {
      const userSettings = user.user_metadata?.settings || {}
      setSettings({
        ...defaultUserSettings,
        ...userSettings,
      })
    }
  }, [user])

  return settings
}
