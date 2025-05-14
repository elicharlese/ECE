"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"

type UserStatus = "online" | "away" | "busy" | "offline" | "invisible"

interface Organization {
  id: string
  name: string
  role: string
  avatar: string
}

interface RecentActivity {
  id: string
  type: string
  title: string
  time: string
  icon: React.ReactNode
}

export function UserDropdown() {
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const router = useRouter()
  const [initials, setInitials] = useState("U")
  const [userName, setUserName] = useState("User")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [persistentAuthState, setPersistentAuthState] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const persistentAuth = localStorage.getItem("eceAuthState")
        if (persistentAuth) {
          const authState = JSON.parse(persistentAuth)
          if (authState.timestamp && Date.now() - authState.timestamp < 24 * 60 * 60 * 1000) {
            setPersistentAuthState(true)
          }
        }
      } catch (e) {
        console.error("Error parsing persistent auth state:", e)
      }
    }
  }, [])

  useEffect(() => {
    setMounted(true)

    try {
      if (user) {
        // Get user name from metadata
        const metadata = user.user_metadata || {}
        const name = metadata.name || (user.email ? user.email.split("@")[0] : "User")
        setUserName(name)

        // Get avatar URL from metadata
        const avatar = metadata.avatar_url || ""
        setAvatarUrl(avatar)

        // Generate initials from name
        const nameParts = name.split(" ")
        if (nameParts.length > 1) {
          setInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase())
        } else if (name.length > 0) {
          setInitials(name[0].toUpperCase())
        }
      } else if (isDemoMode) {
        setUserName("Demo User")
        setInitials("D")
        setAvatarUrl("/diverse-user-avatars.png")
      }
    } catch (error) {
      console.error("Error setting up user dropdown:", error)
      setUserName("User")
      setInitials("U")
    }
  }, [user, isDemoMode])

  const handleProfileClick = () => {
    router.push("/app/profile")
  }

  if (!mounted) return null

  if (!user && !isDemoMode && !persistentAuthState) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-full p-0"
      onClick={handleProfileClick}
      aria-label="View profile"
      title={`${userName}'s profile`}
    >
      <div className="relative">
        <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary transition-all duration-200">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={userName} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{initials}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></div>
        )}
      </div>
    </Button>
  )
}
