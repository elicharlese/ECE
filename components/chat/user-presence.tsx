"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/lib/auth-context"

interface UserPresenceProps {
  userId: string
  className?: string
}

export function UserPresence({ userId, className }: UserPresenceProps) {
  const [isOnline, setIsOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState<Date | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Fetch initial presence status
    const fetchPresence = async () => {
      const { data, error } = await supabase
        .from("user_presence")
        .select("is_online, last_seen")
        .eq("user_id", userId)
        .single()

      if (!error && data) {
        setIsOnline(data.is_online)
        setLastSeen(data.last_seen ? new Date(data.last_seen) : null)
      }
    }

    fetchPresence()

    // Subscribe to presence changes
    const presenceSubscription = supabase
      .channel(`presence:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_presence",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            setIsOnline(payload.new.is_online)
            setLastSeen(payload.new.last_seen ? new Date(payload.new.last_seen) : null)
          }
        },
      )
      .subscribe()

    // Update own presence status
    if (userId === user.id) {
      const updatePresence = async () => {
        await supabase.from("user_presence").upsert(
          {
            user_id: user.id,
            is_online: true,
            last_seen: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          },
        )
      }

      updatePresence()

      // Update presence every minute
      const interval = setInterval(updatePresence, 60000)

      // Update presence when window is focused/blurred
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          updatePresence()
        }
      }

      document.addEventListener("visibilitychange", handleVisibilityChange)

      // Set offline when leaving
      const handleBeforeUnload = async () => {
        await supabase.from("user_presence").upsert(
          {
            user_id: user.id,
            is_online: false,
            last_seen: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          },
        )
      }

      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
        clearInterval(interval)
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        window.removeEventListener("beforeunload", handleBeforeUnload)
        supabase.removeChannel(presenceSubscription)

        // Set offline when component unmounts
        supabase.from("user_presence").upsert(
          {
            user_id: user.id,
            is_online: false,
            last_seen: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          },
        )
      }
    }

    return () => {
      supabase.removeChannel(presenceSubscription)
    }
  }, [userId, user])

  const formatLastSeen = () => {
    if (!lastSeen) return "Never online"

    const now = new Date()
    const diffMs = now.getTime() - lastSeen.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
        title={isOnline ? "Online" : `Last seen ${formatLastSeen()}`}
      />
      {!isOnline && lastSeen && <span className="text-xs text-muted-foreground">{formatLastSeen()}</span>}
    </div>
  )
}
