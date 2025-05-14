"use client"

// import { useState, useEffect } from "react"
// import { useChat } from "@/lib/chat-context"
// import { useAuth } from "@/lib/auth-context"
// import { supabase } from "@/lib/supabase-client"
// import { NotificationToast } from "./notification-toast"
// import type { Message } from "@/types/chat"

export function NotificationManager() {
  // const [notifications, setNotifications] = useState<Array<Message & { channel_name?: string }>>([])
  // const { currentChannel } = useChat()
  // const { user } = useAuth()

  // useEffect(() => {
  //   if (!user) return

  //   const subscription = supabase
  //     .channel("public:messages")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "messages",
  //       },
  //       async (payload) => {
  //         // Don't notify for own messages
  //         if (payload.new.user_id === user.id) return

  //         // Don't notify for messages in the current channel (user is already looking at them)
  //         if (payload.new.channel_id === currentChannel?.id) return

  //         // Fetch user details for the message
  //         const { data: userData } = await supabase
  //           .from("users")
  //           .select("name, avatar_url")
  //           .eq("id", payload.new.user_id)
  //           .single()

  //         // Fetch channel details
  //         const { data: channelData } = await supabase
  //           .from("channels")
  //           .select("name")
  //           .eq("id", payload.new.channel_id)
  //           .single()

  //         const message = {
  //           ...payload.new,
  //           user: {
  //             id: payload.new.user_id,
  //             name: userData?.name || "Unknown User",
  //             avatar_url: userData?.avatar_url || "",
  //           },
  //           channel_name: channelData?.name || "Unknown Channel",
  //         } as Message & { channel_name: string }

  //         setNotifications((prev) => [...prev, message])
  //       },
  //     )
  //     .subscribe()

  //   return () => {
  //     supabase.removeChannel(subscription)
  //   }
  // }, [user, currentChannel])

  // const removeNotification = (id: string) => {
  //   setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  // }

  return (
    <></>
    // <>
    //   {notifications.map((notification) => (
    //     <NotificationToast
    //       key={notification.id}
    //       message={notification}
    //       onClose={() => removeNotification(notification.id)}
    //     />
    //   ))}
    // </>
  )
}
