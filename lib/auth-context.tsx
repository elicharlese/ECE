"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { supabase } from "./supabase-client"
import { useToast } from "@/hooks/use-toast"
import { isDemoModeEnabled } from "./demo-utils"
import { demoUsers } from "./demo-data"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateUserAvatar: (url: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  updateUserAvatar: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        // Check if demo mode is enabled
        if (isDemoModeEnabled()) {
          console.log("Demo mode detected, using demo user")

          // Create a demo user
          const demoUser = {
            id: "demo-user-id",
            email: demoUsers[0].email,
            user_metadata: {
              name: demoUsers[0].name,
              avatar_url: demoUsers[0].avatar,
            },
            app_metadata: {},
            aud: "authenticated",
            created_at: demoUsers[0].joinedDate,
          } as User

          // Create a demo session
          const demoSession = {
            access_token: "demo-access-token",
            refresh_token: "demo-refresh-token",
            expires_at: Date.now() + 3600,
            user: demoUser,
          } as Session

          setUser(demoUser)
          setSession(demoSession)
        } else {
          // Get the real session from Supabase
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting session:", error)
            throw error
          }

          setSession(data.session)
          setUser(data.session?.user ?? null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event)
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setSession(data.session)
      setUser(data.session?.user ?? null)

      return data
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Note: User will need to verify email before being fully authenticated
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account.",
      })

      return data
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      if (isDemoModeEnabled()) {
        // Handle demo mode sign out
        localStorage.removeItem("eceDemoMode")
        document.cookie = "eceDemoMode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        window.location.href = "/login"
        return
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setSession(null)

      router.push("/login")
    } catch (error: any) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  // Reset password (send reset email)
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
    } catch (error: any) {
      console.error("Reset password error:", error)
      throw error
    }
  }

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error
    } catch (error: any) {
      console.error("Update password error:", error)
      throw error
    }
  }

  // Update user avatar
  const updateUserAvatar = async (url: string) => {
    try {
      if (isDemoModeEnabled()) {
        // For demo mode, just update the user object in state
        if (user) {
          const updatedUser = {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              avatar_url: url,
            },
          }
          setUser(updatedUser)
        }
        return
      }

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: url },
      })

      if (error) throw error
    } catch (error: any) {
      console.error("Update avatar error:", error)
      throw error
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateUserAvatar,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
