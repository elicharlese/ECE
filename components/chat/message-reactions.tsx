"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/lib/auth-context"
import type { MessageReaction } from "@/types/chat"

const commonEmojis = ["👍", "❤️", "😂", "🎉", "🙌", "👀", "🔥", "💯"]

interface MessageReactionsProps {
  messageId: string
  reactions: MessageReaction[]
}

export function MessageReactions({ messageId, reactions }: MessageReactionsProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Group reactions by emoji
  const groupedReactions = reactions.reduce<Record<string, MessageReaction[]>>((acc, reaction) => {
    if (!acc[reaction.reaction]) {
      acc[reaction.reaction] = []
    }
    acc[reaction.reaction].push(reaction)
    return acc
  }, {})

  const handleAddReaction = async (emoji: string) => {
    if (!user) return
    setIsLoading(true)

    try {
      // Check if user already reacted with this emoji
      const existingReaction = reactions.find((r) => r.user_id === user.id && r.reaction === emoji)

      if (existingReaction) {
        // Remove reaction
        await supabase.from("message_reactions").delete().eq("id", existingReaction.id)
      } else {
        // Add reaction
        await supabase.from("message_reactions").insert({
          message_id: messageId,
          user_id: user.id,
          reaction: emoji,
        })
      }
    } catch (error) {
      console.error("Error toggling reaction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, reactions]) => (
        <Button
          key={emoji}
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs rounded-full bg-muted/50 hover:bg-muted"
          onClick={() => handleAddReaction(emoji)}
          disabled={isLoading}
        >
          <span className="mr-1">{emoji}</span>
          <span>{reactions.length}</span>
        </Button>
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-full bg-muted/50 hover:bg-muted"
            disabled={isLoading}
          >
            <Plus size={14} />
            <span className="sr-only">Add reaction</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="grid grid-cols-4 gap-2">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAddReaction(emoji)}
                disabled={isLoading}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
