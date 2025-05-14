"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/lib/chat-context"
import { ChatMessage } from "./chat-message"

export function ChatMessages() {
  const { messages, typingUsers, isLoading } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="h-4 w-64 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-0.5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-sm text-muted-foreground">Be the first to send a message in this channel!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} isLastMessage={index === messages.length - 1} />
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
            <div className="flex space-x-1">
              <div
                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0].user?.name} is typing...`
                : `${typingUsers.length} people are typing...`}
            </span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}
