"use client"

import { MessageSquare, Hash, Users, Bell, BellOff, Plus, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useChat } from "@/lib/chat-context"
import { useChatNotifications } from "@/lib/chat-notification-context"
import { NotificationBadge } from "./notification-badge"
import { NotificationPreferences } from "./notification-preferences"
import { UserPresence } from "./user-presence"
import { SearchDialog } from "./search-dialog"
import { useState } from "react"
import type { Channel } from "@/types/chat"

export function ChatSidebar() {
  const { channels, currentChannel, setCurrentChannel, getUnreadCount, getTotalUnreadCount } = useChat()
  const { markAllAsRead } = useChatNotifications()
  const [searchOpen, setSearchOpen] = useState(false)

  const teamChannels = channels.filter((channel) => channel.type === "team")
  const projectChannels = channels.filter((channel) => channel.type === "project")
  const directMessages = channels.filter((channel) => channel.type === "direct")
  const totalUnreadCount = getTotalUnreadCount()

  const renderChannel = (channel: Channel) => {
    const isActive = currentChannel?.id === channel.id
    const unreadCount = getUnreadCount(channel.id)

    return (
      <Button
        key={channel.id}
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start font-normal"
        onClick={() => setCurrentChannel(channel)}
      >
        <Hash className="mr-2 h-4 w-4" />
        <span className="truncate">{channel.name}</span>
        {unreadCount > 0 && <NotificationBadge count={unreadCount} className="ml-auto" />}
      </Button>
    )
  }

  const renderDirectMessage = (channel: Channel) => {
    const isActive = currentChannel?.id === channel.id
    const unreadCount = getUnreadCount(channel.id)
    // Extract user ID from direct message channel name (assuming format "dm-{userId}")
    const userId = channel.name.startsWith("dm-") ? channel.name.substring(3) : ""

    return (
      <Button
        key={channel.id}
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start font-normal"
        onClick={() => setCurrentChannel(channel)}
      >
        <div className="mr-2 relative">
          <MessageSquare className="h-4 w-4" />
          {userId && <UserPresence userId={userId} className="absolute -bottom-1 -right-1" />}
        </div>
        <span className="truncate">{channel.name.replace(/^dm-/, "")}</span>
        {unreadCount > 0 && <NotificationBadge count={unreadCount} className="ml-auto" />}
      </Button>
    )
  }

  return (
    <div className="w-64 border-r bg-muted/50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="px-2 text-lg font-semibold tracking-tight">Channels</h2>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSearchOpen(true)}>
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search messages</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {totalUnreadCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={markAllAsRead}>
                      <BellOff className="h-4 w-4" />
                      <span className="sr-only">Mark all as read</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark all as read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notification settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                  <DialogDescription>Configure how you want to be notified about new messages</DialogDescription>
                </DialogHeader>
                <NotificationPreferences />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New channel</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Channel</DialogTitle>
                  <DialogDescription>Create a new channel for your team</DialogDescription>
                </DialogHeader>
                {/* Channel creation form would go here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          {teamChannels.length > 0 && (
            <div className="pb-4">
              <h3 className="mb-1 px-2 text-sm font-medium text-muted-foreground flex items-center">
                <Users className="mr-1 h-4 w-4" />
                Team
              </h3>
              <div className="space-y-1">{teamChannels.map(renderChannel)}</div>
            </div>
          )}

          {projectChannels.length > 0 && (
            <div className="pb-4">
              <h3 className="mb-1 px-2 text-sm font-medium text-muted-foreground flex items-center">
                <Hash className="mr-1 h-4 w-4" />
                Projects
              </h3>
              <div className="space-y-1">{projectChannels.map(renderChannel)}</div>
            </div>
          )}

          {directMessages.length > 0 && (
            <div>
              <h3 className="mb-1 px-2 text-sm font-medium text-muted-foreground flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                Direct Messages
              </h3>
              <div className="space-y-1">{directMessages.map(renderDirectMessage)}</div>
            </div>
          )}
        </ScrollArea>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
