"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@/lib/chat-context"

interface ThreadInputProps {
  parentId: string
}

export function ThreadInput({ parentId }: ThreadInputProps) {
  const [message, setMessage] = useState("")
  const { sendMessage } = useChat()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    await sendMessage(message, parentId)
    setMessage("")

    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply in thread..."
            className="min-h-[80px] resize-none"
          />
        </div>
        <Button type="submit" size="icon" disabled={!message.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send reply</span>
        </Button>
      </div>
    </form>
  )
}
