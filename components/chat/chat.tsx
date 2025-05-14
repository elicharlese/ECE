"use client"

import { useState } from "react"
import { useChat } from "@/lib/chat-context"
import { ChatNotificationProvider } from "@/lib/chat-notification-context"
import { ChatHeader } from "./chat-header"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { ThreadView } from "./thread-view"
import { SearchDialog } from "./search-dialog"

export function Chat() {
  const { activeThread, currentChannel } = useChat()
  const [searchOpen, setSearchOpen] = useState(false)

  if (!currentChannel) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select a channel</h2>
          <p className="text-muted-foreground">Choose a channel from the sidebar to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <ChatNotificationProvider>
      <>
        <div className="flex h-full">
          <ChatSidebar />
          <div className="flex flex-col flex-1 h-full">
            <ChatHeader channel={currentChannel} onSearchClick={() => setSearchOpen(true)} />
            <ChatMessages />
            <ChatInput />
          </div>
          {activeThread && <ThreadView />}
        </div>

        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </>
    </ChatNotificationProvider>
  )
}
