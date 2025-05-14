"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useChat } from "@/lib/chat-context"
import { ChatMessage } from "./chat-message"
import { ThreadInput } from "./thread-input"

export function ThreadView() {
  const { activeThread, threadMessages, closeThread, isThreadLoading } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when thread messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [threadMessages])

  if (!activeThread) return null

  const messages = threadMessages[activeThread.id] || []

  return (
    <div className="flex flex-col border-l h-full w-full md:w-96">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Thread</h3>
        <Button variant="ghost" size="icon" onClick={closeThread}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close thread</span>
        </Button>
      </div>

      <div className="p-4 border-b">
        <ChatMessage message={activeThread} isLastMessage={false} isThreadMessage={true} />
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-0.5">
          {isThreadLoading ? (
            <div className="flex items-center justify-center p-4">
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
              <span className="ml-2 text-sm text-muted-foreground">Loading replies...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No replies yet</h3>
                <p className="text-sm text-muted-foreground">Be the first to reply to this thread!</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLastMessage={index === messages.length - 1}
                isThreadMessage={true}
              />
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <ThreadInput parentId={activeThread.id} />
    </div>
  )
}
