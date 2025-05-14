"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Check, Edit2, Trash2, MessageSquare, Copy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase-client"
import { useChat } from "@/lib/chat-context"
import { useToast } from "@/hooks/use-toast"
import { MessageReactions } from "./message-reactions"
import type { Message, MessageReaction } from "@/types/chat"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  message: Message
  isLastMessage: boolean
  isThreadMessage?: boolean
}

export function ChatMessage({ message, isLastMessage, isThreadMessage = false }: ChatMessageProps) {
  const { user } = useAuth()
  const { openThread } = useChat()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)
  const [reactions, setReactions] = useState<MessageReaction[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const isCurrentUser = user?.id === message.user_id

  useEffect(() => {
    // Fetch reactions for this message
    const fetchReactions = async () => {
      const { data, error } = await supabase.from("message_reactions").select("*").eq("message_id", message.id)

      if (!error && data) {
        setReactions(data)
      }
    }

    fetchReactions()

    // Subscribe to reaction changes
    const reactionSubscription = supabase
      .channel(`message-reactions:${message.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `message_id=eq.${message.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setReactions((prev) => [...prev, payload.new as MessageReaction])
          } else if (payload.eventType === "DELETE") {
            setReactions((prev) => prev.filter((r) => r.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(reactionSubscription)
    }
  }, [message.id])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    if (editedContent.trim() === message.content) {
      setIsEditing(false)
      return
    }

    try {
      const { error } = await supabase
        .from("messages")
        .update({
          content: editedContent.trim(),
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", message.id)

      if (error) throw error
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating message:", error)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", message.id)

      if (error) throw error
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const handleOpenThread = () => {
    if (!isThreadMessage) {
      openThread(message)
    }
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content)
    toast({
      title: "Message copied to clipboard",
      duration: 2000,
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <div
      className={`flex gap-3 p-3 ${isCurrentUser ? "bg-muted/50" : ""} ${isLastMessage ? "rounded-b-md" : ""} hover:bg-muted/30 transition-colors`}
      id={`message-${message.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.user?.avatar_url || ""} alt={message.user?.name || "User"} />
        <AvatarFallback>{message.user?.name ? getInitials(message.user.name) : "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{message.user?.name || "Unknown User"}</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
            {message.is_edited && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground italic">(edited)</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edited {formatTime(message.updated_at)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center gap-1">
            {(isHovered || isCurrentUser) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-70 hover:opacity-100"
                onClick={handleCopyMessage}
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="sr-only">Copy message</span>
              </Button>
            )}

            {isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={3}
                autoFocus
              />
              <Button size="sm" onClick={handleEdit}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">Supports markdown formatting</div>
          </div>
        ) : (
          <ReactMarkdown className="text-sm prose prose-sm dark:prose-invert max-w-none">
            {message.content}
          </ReactMarkdown>
        )}

        {/* Message reactions */}
        <MessageReactions messageId={message.id} reactions={reactions} />

        {!isThreadMessage && (
          <div className="flex items-center mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              onClick={handleOpenThread}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {message.thread_count > 0 ? (
                <span>
                  {message.thread_count} {message.thread_count === 1 ? "reply" : "replies"}
                </span>
              ) : (
                <span>Reply in thread</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
