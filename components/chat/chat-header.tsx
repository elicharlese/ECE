"use client"

import { useState } from "react"
import { Info, Users, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChat } from "@/lib/chat-context"
import type { Channel } from "@/types/chat"

interface ChatHeaderProps {
  channel: Channel
  onSearchClick?: () => void
}

export function ChatHeader({ channel, onSearchClick }: ChatHeaderProps) {
  const { createChannel, setCurrentChannel } = useChat()
  const [isCreating, setIsCreating] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelDescription, setNewChannelDescription] = useState("")
  const [newChannelType, setNewChannelType] = useState<"team" | "project" | "direct">("team")

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return

    setIsCreating(true)
    const newChannel = await createChannel(newChannelName.trim(), newChannelDescription.trim(), newChannelType)
    setIsCreating(false)

    if (newChannel) {
      setCurrentChannel(newChannel)
      setNewChannelName("")
      setNewChannelDescription("")
      setNewChannelType("team")
    }
  }

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold"># {channel.name}</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info className="h-4 w-4" />
          <span className="sr-only">Channel info</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Users className="h-4 w-4" />
          <span className="sr-only">Channel members</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSearchClick}>
          <Search className="h-4 w-4" />
          <span className="sr-only">Search messages</span>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Channel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new channel</DialogTitle>
              <DialogDescription>Create a new channel for your team to collaborate in.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Channel name</Label>
                <Input
                  id="name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. project-discussion"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  placeholder="What is this channel about?"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Channel type</Label>
                <Select
                  value={newChannelType}
                  onValueChange={(value) => setNewChannelType(value as "team" | "project" | "direct")}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select channel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team Channel</SelectItem>
                    <SelectItem value="project">Project Channel</SelectItem>
                    <SelectItem value="direct">Direct Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreateChannel} disabled={isCreating || !newChannelName.trim()}>
                {isCreating ? "Creating..." : "Create Channel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
