"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/lib/auth-context"
import type { Channel, Message, TypingIndicator, SearchResult } from "@/types/chat"

interface ChatContextProps {
  channels: Channel[]
  currentChannel: Channel | null
  messages: Message[]
  threadMessages: Record<string, Message[]>
  activeThread: Message | null
  typingUsers: TypingIndicator[]
  isLoading: boolean
  isThreadLoading: boolean
  searchQuery: string
  searchResults: SearchResult[]
  isSearching: boolean
  setCurrentChannel: (channel: Channel) => void
  sendMessage: (content: string, parentId?: string, attachments?: any[]) => Promise<void>
  setTyping: (isTyping: boolean) => void
  markChannelAsRead: (channelId: string) => Promise<void>
  createChannel: (name: string, description: string, type: "team" | "project" | "direct") => Promise<Channel | null>
  getUnreadCount: (channelId: string) => number
  getTotalUnreadCount: () => number
  openThread: (message: Message) => Promise<void>
  closeThread: () => void
  searchMessages: (query: string) => Promise<void>
  clearSearch: () => void
  jumpToMessage: (result: SearchResult) => Promise<void>
  pinMessage: (messageId: string, isPinned: boolean) => Promise<void>
  getPinnedMessages: (channelId: string) => Promise<Message[]>
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [threadMessages, setThreadMessages] = useState<Record<string, Message[]>>({})
  const [activeThread, setActiveThread] = useState<Message | null>(null)
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isThreadLoading, setIsThreadLoading] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const markChannelAsRead = useCallback(
    async (channelId: string) => {
      if (!user) return

      try {
        // Get all unread messages in this channel
        const { data: unreadMessages, error: fetchError } = await supabase
          .from("messages")
          .select("id")
          .eq("channel_id", channelId)
          .not("id", "in", (subquery) => {
            return subquery.from("read_receipts").select("message_id").eq("user_id", user.id)
          })

        if (fetchError) throw fetchError

        if (unreadMessages && unreadMessages.length > 0) {
          // Mark all as read
          const { error: insertError } = await supabase.from("read_receipts").insert(
            unreadMessages.map((msg) => ({
              message_id: msg.id,
              user_id: user.id,
              read_at: new Date().toISOString(),
            })),
          )

          if (insertError) throw insertError

          // Update unread counts
          setUnreadCounts((prev) => ({
            ...prev,
            [channelId]: 0,
          }))
        }

        // Update last_read_at in channel_members
        const { error: updateError } = await supabase.from("channel_members").upsert(
          {
            channel_id: channelId,
            user_id: user.id,
            last_read_at: new Date().toISOString(),
          },
          {
            onConflict: "channel_id,user_id",
          },
        )

        if (updateError) throw updateError
      } catch (error) {
        console.error("Error marking channel as read:", error)
      }
    },
    [user],
  )

  // Fetch channels
  useEffect(() => {
    if (!user) return

    const fetchChannels = async () => {
      try {
        const { data, error } = await supabase.from("channels").select("*").order("updated_at", { ascending: false })

        if (error) throw error

        setChannels(data || [])
        if (data && data.length > 0 && !currentChannel) {
          setCurrentChannel(data[0])
        }
      } catch (error) {
        console.error("Error fetching channels:", error)
        toast({
          title: "Error",
          description: "Failed to load chat channels",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannels()

    // Subscribe to channel changes
    const channelSubscription = supabase
      .channel("public:channels")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channels",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setChannels((prev) => [payload.new as Channel, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setChannels((prev) =>
              prev.map((channel) => (channel.id === payload.new.id ? (payload.new as Channel) : channel)),
            )
          } else if (payload.eventType === "DELETE") {
            setChannels((prev) => prev.filter((channel) => channel.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channelSubscription)
    }
  }, [user, toast, currentChannel])

  // Fetch messages for current channel
  useEffect(() => {
    if (!currentChannel || !user) return

    setIsLoading(true)

    const fetchMessages = async () => {
      try {
        // Fetch messages with user details
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(`
            *,
            user:user_id (
              id,
              name,
              avatar_url
            )
          `)
          .eq("channel_id", currentChannel.id)
          .is("parent_id", null) // Only fetch top-level messages, not thread replies
          .order("created_at", { ascending: true })

        if (messagesError) throw messagesError

        // Fetch attachments for these messages
        const messageIds = messagesData?.map((msg) => msg.id) || []

        if (messageIds.length > 0) {
          const { data: attachmentsData, error: attachmentsError } = await supabase
            .from("message_attachments")
            .select("*")
            .in("message_id", messageIds)

          if (attachmentsError) throw attachmentsError

          // Attach attachments to their respective messages
          const messagesWithAttachments =
            messagesData?.map((msg) => {
              const attachments = attachmentsData?.filter((attachment) => attachment.message_id === msg.id) || []
              return {
                ...msg,
                attachments: attachments,
              }
            }) || []

          setMessages(messagesWithAttachments)
        } else {
          setMessages(messagesData || [])
        }

        // Mark channel as read
        await markChannelAsRead(currentChannel.id)
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()

    // Subscribe to message changes for this channel
    const messageSubscription = supabase
      .channel(`messages:${currentChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${currentChannel.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Only add to main messages if it's not a thread reply
            if (!payload.new.parent_id) {
              // Fetch user details for the new message
              const { data: userData } = await supabase
                .from("users")
                .select("id, name, avatar_url")
                .eq("id", payload.new.user_id)
                .single()

              const newMessage = {
                ...(payload.new as Message),
                user: userData,
                attachments: [], // Initialize attachments array
              }

              setMessages((prev) => [...prev, newMessage])

              // If the message is from another user, mark it as read
              if (payload.new.user_id !== user.id) {
                await supabase.from("read_receipts").insert({
                  message_id: payload.new.id,
                  user_id: user.id,
                  read_at: new Date().toISOString(),
                })
              }
            } else if (activeThread && payload.new.parent_id === activeThread.id) {
              // If it's a thread reply and the thread is active, add it to thread messages
              const { data: userData } = await supabase
                .from("users")
                .select("id, name, avatar_url")
                .eq("id", payload.new.user_id)
                .single()

              const newMessage = {
                ...(payload.new as Message),
                user: userData,
                attachments: [], // Initialize attachments array
              }

              setThreadMessages((prev) => ({
                ...prev,
                [activeThread.id]: [...(prev[activeThread.id] || []), newMessage],
              }))
            }
          } else if (payload.eventType === "UPDATE") {
            // Update in main messages if it's not a thread reply
            if (!payload.new.parent_id) {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === payload.new.id ? { ...message, ...(payload.new as Message) } : message,
                ),
              )
            } else if (activeThread && payload.new.parent_id === activeThread.id) {
              // Update in thread messages if the thread is active
              setThreadMessages((prev) => ({
                ...prev,
                [activeThread.id]: (prev[activeThread.id] || []).map((message) =>
                  message.id === payload.new.id ? { ...message, ...(payload.new as Message) } : message,
                ),
              }))
            }
          } else if (payload.eventType === "DELETE") {
            // Remove from main messages if it's not a thread reply
            if (!payload.old.parent_id) {
              setMessages((prev) => prev.filter((message) => message.id !== payload.old.id))
            } else if (activeThread && payload.old.parent_id === activeThread.id) {
              // Remove from thread messages if the thread is active
              setThreadMessages((prev) => ({
                ...prev,
                [activeThread.id]: (prev[activeThread.id] || []).filter((message) => message.id !== payload.old.id),
              }))
            }
          }
        },
      )
      .subscribe()

    // Subscribe to typing indicators
    const typingSubscription = supabase
      .channel(`typing:${currentChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_indicators",
          filter: `channel_id=eq.${currentChannel.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            if (payload.new.user_id === user.id) return

            // Fetch user details
            const { data: userData } = await supabase
              .from("users")
              .select("id, name")
              .eq("id", payload.new.user_id)
              .single()

            const typingIndicator = {
              ...(payload.new as TypingIndicator),
              user: userData,
            }

            if (typingIndicator.is_typing) {
              setTypingUsers((prev) => {
                const exists = prev.some((t) => t.user_id === typingIndicator.user_id)
                if (exists) {
                  return prev.map((t) => (t.user_id === typingIndicator.user_id ? typingIndicator : t))
                } else {
                  return [...prev, typingIndicator]
                }
              })
            } else {
              setTypingUsers((prev) => prev.filter((t) => t.user_id !== typingIndicator.user_id))
            }
          } else if (payload.eventType === "DELETE") {
            setTypingUsers((prev) => prev.filter((t) => t.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    // Fetch unread counts
    const fetchUnreadCounts = async () => {
      try {
        // For each channel, get count of messages not in read_receipts
        const counts: Record<string, number> = {}

        for (const channel of channels) {
          const { count, error } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("channel_id", channel.id)
            .not("id", "in", (subquery) => {
              return subquery.from("read_receipts").select("message_id").eq("user_id", user.id)
            })

          if (error) throw error
          counts[channel.id] = count || 0
        }

        setUnreadCounts(counts)
      } catch (error) {
        console.error("Error fetching unread counts:", error)
      }
    }

    fetchUnreadCounts()

    return () => {
      supabase.removeChannel(messageSubscription)
      supabase.removeChannel(typingSubscription)
    }
  }, [currentChannel, user, toast, channels, activeThread, markChannelAsRead])

  const sendMessage = useCallback(
    async (content: string, parentId?: string, attachments?: any[]) => {
      if (!currentChannel || !user || (!content.trim() && (!attachments || attachments.length === 0))) return

      try {
        const { data: messageData, error: messageError } = await supabase
          .from("messages")
          .insert({
            channel_id: currentChannel.id,
            user_id: user.id,
            content: content.trim(),
            parent_id: parentId || null,
          })
          .select()
          .single()

        if (messageError) throw messageError

        // Handle attachments
        if (attachments && attachments.length > 0) {
          const attachmentsToInsert = attachments.map((attachment: any) => ({
            message_id: messageData.id,
            file_name: attachment.name,
            file_size: attachment.size,
            file_type: attachment.type,
            file_url: attachment.url,
          }))

          const { error: attachmentsError } = await supabase.from("message_attachments").insert(attachmentsToInsert)

          if (attachmentsError) throw attachmentsError
        }

        // Clear typing indicator
        setTyping(false)
      } catch (error) {
        console.error("Error sending message:", error)
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        })
      }
    },
    [currentChannel, user, toast],
  )

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!currentChannel || !user) return

      try {
        const { error } = await supabase.from("typing_indicators").upsert(
          {
            channel_id: currentChannel.id,
            user_id: user.id,
            is_typing: isTyping,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "channel_id,user_id",
          },
        )

        if (error) throw error
      } catch (error) {
        console.error("Error updating typing indicator:", error)
      }
    },
    [currentChannel, user],
  )

  const createChannel = useCallback(
    async (name: string, description: string, type: "team" | "project" | "direct"): Promise<Channel | null> => {
      if (!user) return null

      try {
        const { data, error } = await supabase
          .from("channels")
          .insert({
            name,
            description,
            type,
          })
          .select()
          .single()

        if (error) throw error

        // Add current user as member
        await supabase.from("channel_members").insert({
          channel_id: data.id,
          user_id: user.id,
        })

        return data
      } catch (error) {
        console.error("Error creating channel:", error)
        toast({
          title: "Error",
          description: "Failed to create channel",
          variant: "destructive",
        })
        return null
      }
    },
    [user, toast],
  )

  const getUnreadCount = useCallback(
    (channelId: string) => {
      return unreadCounts[channelId] || 0
    },
    [unreadCounts],
  )

  const getTotalUnreadCount = useCallback(() => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)
  }, [unreadCounts])

  const openThread = useCallback(
    async (message: Message) => {
      if (!user) return

      setActiveThread(message)
      setIsThreadLoading(true)

      try {
        // Fetch thread messages
        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            user:user_id (
              id,
              name,
              avatar_url
            )
          `)
          .eq("parent_id", message.id)
          .order("created_at", { ascending: true })

        if (error) throw error

        setThreadMessages((prev) => ({
          ...prev,
          [message.id]: data || [],
        }))
      } catch (error) {
        console.error("Error fetching thread messages:", error)
        toast({
          title: "Error",
          description: "Failed to load thread messages",
          variant: "destructive",
        })
      } finally {
        setIsThreadLoading(false)
      }
    },
    [user, toast],
  )

  const closeThread = useCallback(() => {
    setActiveThread(null)
  }, [])

  const searchMessages = useCallback(
    async (query: string) => {
      if (!user || !query.trim()) return

      setIsSearching(true)
      setSearchQuery(query)
      setSearchResults([])

      try {
        // Search in messages
        const { data, error } = await supabase.rpc("search_messages", {
          search_query: query.trim(),
        })

        if (error) throw error

        // Format results
        const formattedResults: SearchResult[] = await Promise.all(
          (data || []).map(async (result: any) => {
            // Get channel name
            const { data: channelData } = await supabase
              .from("channels")
              .select("name")
              .eq("id", result.channel_id)
              .single()

            // Get user name
            const { data: userData } = await supabase.from("users").select("name").eq("id", result.user_id).single()

            return {
              id: result.id,
              channel_id: result.channel_id,
              channel_name: channelData?.name || "Unknown Channel",
              user_id: result.user_id,
              user_name: userData?.name || "Unknown User",
              content: result.content,
              created_at: result.created_at,
              parent_id: result.parent_id,
            }
          }),
        )

        setSearchResults(formattedResults)
      } catch (error) {
        console.error("Error searching messages:", error)
        toast({
          title: "Error",
          description: "Failed to search messages",
          variant: "destructive",
        })
      } finally {
        setIsSearching(false)
      }
    },
    [user, toast],
  )

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setSearchResults([])
  }, [])

  const jumpToMessage = useCallback(
    async (result: SearchResult) => {
      if (!user) return

      // If the message is in a different channel, switch to that channel
      if (currentChannel?.id !== result.channel_id) {
        const channel = channels.find((c) => c.id === result.channel_id)
        if (channel) {
          setCurrentChannel(channel)
          // Wait for channel to load
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      // If the message is a thread reply, open the thread
      if (result.parent_id) {
        // Find the parent message
        const { data: parentMessage, error } = await supabase
          .from("messages")
          .select(`
            *,
            user:user_id (
              id,
              name,
              avatar_url
            )
          `)
          .eq("id", result.parent_id)
          .single()

        if (error) {
          console.error("Error fetching parent message:", error)
          return
        }

        // Open the thread
        await openThread(parentMessage)
      }

      // Scroll to the message
      setTimeout(() => {
        const messageElement = document.getElementById(`message-${result.id}`)
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: "smooth", block: "center" })
          messageElement.classList.add("bg-yellow-100", "dark:bg-yellow-900/30")
          setTimeout(() => {
            messageElement.classList.remove("bg-yellow-100", "dark:bg-yellow-900/30")
          }, 2000)
        }
      }, 500)
    },
    [user, currentChannel, channels, openThread],
  )

  const pinMessage = useCallback(
    async (messageId: string, isPinned: boolean) => {
      if (!user) return

      try {
        const { error } = await supabase.from("messages").update({ is_pinned: isPinned }).eq("id", messageId)

        if (error) {
          console.error("Error pinning/unpinning message:", error)
          toast({
            title: "Error",
            description: `Failed to ${isPinned ? "pin" : "unpin"} message`,
            variant: "destructive",
          })
        } else {
          // Optimistically update the message in the local state
          setMessages((prevMessages) =>
            prevMessages.map((message) => (message.id === messageId ? { ...message, is_pinned: isPinned } : message)),
          )
        }
      } catch (error) {
        console.error("Error pinning/unpinning message:", error)
        toast({
          title: "Error",
          description: `Failed to ${isPinned ? "pin" : "unpin"} message`,
          variant: "destructive",
        })
      }
    },
    [user, toast],
  )

  const getPinnedMessages = useCallback(
    async (channelId: string) => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            user:user_id (
              id,
              name,
              avatar_url
            )
          `)
          .eq("channel_id", channelId)
          .eq("is_pinned", true)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching pinned messages:", error)
          toast({
            title: "Error",
            description: "Failed to fetch pinned messages",
            variant: "destructive",
          })
          return []
        }

        return data || []
      } catch (error) {
        console.error("Error fetching pinned messages:", error)
        toast({
          title: "Error",
          description: "Failed to fetch pinned messages",
          variant: "destructive",
        })
        return []
      }
    },
    [toast],
  )

  return (
    <ChatContext.Provider
      value={{
        channels,
        currentChannel,
        messages,
        threadMessages,
        activeThread,
        typingUsers,
        isLoading,
        isThreadLoading,
        searchQuery,
        searchResults,
        isSearching,
        setCurrentChannel,
        sendMessage,
        setTyping,
        markChannelAsRead,
        createChannel,
        getUnreadCount,
        getTotalUnreadCount,
        openThread,
        closeThread,
        searchMessages,
        clearSearch,
        jumpToMessage,
        pinMessage,
        getPinnedMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
