"use client"

import { ChatProvider } from "@/lib/chat-context"
import { Chat } from "@/components/chat/chat"
import { UnreadCountUpdater } from "@/components/chat/unread-count-updater"

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Chat</h1>
        </div>
        <Chat />
        <UnreadCountUpdater />
      </div>
    </ChatProvider>
  )
}
