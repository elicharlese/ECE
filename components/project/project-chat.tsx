"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, AtSign, Hash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface ProjectChatProps {
  projectId: string
  projectName: string
  team: any[]
}

interface ChatMessage {
  id: string
  content: string
  timestamp: string
  user: {
    id: string
    name: string
    avatar?: string
    role?: string
  }
  attachments?: {
    name: string
    url: string
    type: string
  }[]
  mentions?: string[]
  references?: {
    type: "milestone" | "risk" | "file"
    id: string
    name: string
  }[]
}

export function ProjectChat({ projectId, projectName, team }: ProjectChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [mentionMenuOpen, setMentionMenuOpen] = useState(false)
  const [referenceMenuOpen, setReferenceMenuOpen] = useState(false)
  const [mentionFilter, setMentionFilter] = useState("")
  const [referenceFilter, setReferenceFilter] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Mock data for milestones and risks
  const projectReferences = [
    { type: "milestone", id: "m1", name: "Project Kickoff" },
    { type: "milestone", id: "m2", name: "Architecture Design" },
    { type: "milestone", id: "m3", name: "Core Development" },
    { type: "risk", id: "r1", name: "Technical Complexity" },
    { type: "risk", id: "r2", name: "Resource Availability" },
    { type: "file", id: "f1", name: "Architecture Diagram" },
  ]

  useEffect(() => {
    // Fetch messages for this project
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 800))

        const mockMessages: ChatMessage[] = [
          {
            id: "1",
            content: "I've updated the architecture diagram with the latest changes.",
            timestamp: "2023-11-15T14:30:00Z",
            user: {
              id: "1",
              name: "Jane Smith",
              avatar: "/abstract-geometric-shapes.png",
              role: "Project Manager",
            },
            references: [{ type: "file", id: "f1", name: "Architecture Diagram" }],
          },
          {
            id: "2",
            content: "Great work! Let's discuss the technical complexity risk during our next meeting.",
            timestamp: "2023-11-15T14:35:00Z",
            user: {
              id: "2",
              name: "John Doe",
              avatar: "/number-two-graphic.png",
              role: "Lead Developer",
            },
            mentions: ["1"],
            references: [{ type: "risk", id: "r1", name: "Technical Complexity" }],
          },
          {
            id: "3",
            content:
              "I'm concerned about the timeline for the Core Development milestone. We might need to allocate more resources.",
            timestamp: "2023-11-15T15:10:00Z",
            user: {
              id: "3",
              name: "Alice Johnson",
              avatar: "/abstract-geometric-shapes.png",
              role: "Blockchain Architect",
            },
            references: [{ type: "milestone", id: "m3", name: "Core Development" }],
          },
          {
            id: "4",
            content: "I agree with Alice. Let's review the resource allocation in tomorrow's meeting.",
            timestamp: "2023-11-15T15:15:00Z",
            user: {
              id: "1",
              name: "Jane Smith",
              avatar: "/abstract-geometric-shapes.png",
              role: "Project Manager",
            },
            mentions: ["3"],
          },
        ]

        setMessages(mockMessages)
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load project chat messages",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [projectId, toast])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsSending(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Extract mentions and references
      const mentionRegex = /@(\w+)/g
      const referenceRegex = /#(\w+)/g

      const mentions = Array.from(message.matchAll(mentionRegex))
        .map((match) => {
          const teamMember = team.find((member) => member.name.toLowerCase().includes(match[1].toLowerCase()))
          return teamMember ? teamMember.id : null
        })
        .filter(Boolean)

      const references = Array.from(message.matchAll(referenceRegex))
        .map((match) => {
          const reference = projectReferences.find((ref) => ref.name.toLowerCase().includes(match[1].toLowerCase()))
          return reference || null
        })
        .filter(Boolean)

      // Create new message
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date().toISOString(),
        user: {
          id: "current-user", // In a real app, this would be the current user's ID
          name: "You", // In a real app, this would be the current user's name
          avatar: "/abstract-geometric-shapes.png", // In a real app, this would be the current user's avatar
          role: "Team Member", // In a real app, this would be the current user's role
        },
        mentions,
        references,
      }

      setMessages((prev) => [...prev, newMessage])
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    } else if (e.key === "@") {
      setMentionMenuOpen(true)
      setMentionFilter("")
    } else if (e.key === "#") {
      setReferenceMenuOpen(true)
      setReferenceFilter("")
    }
  }

  const insertMention = (name: string) => {
    const textarea = inputRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const textBefore = message.substring(0, cursorPos - 1) // Remove the @ that triggered the menu
    const textAfter = message.substring(textarea.selectionEnd)

    const newText = `${textBefore}@${name} ${textAfter}`
    setMessage(newText)

    // Close the mention menu
    setMentionMenuOpen(false)

    // Set focus back to textarea and place cursor after the inserted mention
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = textBefore.length + name.length + 2 // +2 for @ and space
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertReference = (reference: { type: string; name: string }) => {
    const textarea = inputRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const textBefore = message.substring(0, cursorPos - 1) // Remove the # that triggered the menu
    const textAfter = message.substring(textarea.selectionEnd)

    const newText = `${textBefore}#${reference.name} ${textAfter}`
    setMessage(newText)

    // Close the reference menu
    setReferenceMenuOpen(false)

    // Set focus back to textarea and place cursor after the inserted reference
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = textBefore.length + reference.name.length + 2 // +2 for # and space
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageContent = (content: string, mentions?: string[], references?: any[]) => {
    if (!mentions && !references) return content

    let formattedContent = content

    // Replace mentions
    if (mentions) {
      mentions.forEach((mentionId) => {
        const teamMember = team.find((member) => member.id === mentionId)
        if (teamMember) {
          const regex = new RegExp(`@${teamMember.name}`, "g")
          formattedContent = formattedContent.replace(
            regex,
            `<span class="text-blue-500 font-medium">@${teamMember.name}</span>`,
          )
        }
      })
    }

    // Replace references
    if (references) {
      references.forEach((reference) => {
        const regex = new RegExp(`#${reference.name}`, "g")
        const badgeClass =
          reference.type === "milestone"
            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            : reference.type === "risk"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"

        formattedContent = formattedContent.replace(
          regex,
          `<span class="${badgeClass} text-xs px-2 py-0.5 rounded-full">#${reference.name}</span>`,
        )
      })
    }

    return formattedContent
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Project Chat</h3>
          <p className="text-sm text-muted-foreground">{projectName}</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          {team.length} Team Members
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-full max-w-md rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground">Start the conversation about this project.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={msg.id} className="group">
                {index > 0 && (
                  <div className="my-4 flex items-center">
                    <Separator className="flex-grow" />
                    <span className="text-xs text-muted-foreground px-2">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </span>
                    <Separator className="flex-grow" />
                  </div>
                )}
                <div className="flex items-start gap-3 group">
                  <Avatar className="h-8 w-8">
                    {msg.user.avatar && <AvatarImage src={msg.user.avatar || "/placeholder.svg"} alt={msg.user.name} />}
                    <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{msg.user.name}</span>
                      {msg.user.role && <span className="text-xs text-muted-foreground">{msg.user.role}</span>}
                      <span className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(msg.content, msg.mentions, msg.references),
                      }}
                    />
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((attachment, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50">
                            <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                            <a
                              href={attachment.url}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {attachment.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Use @ to mention team members, # to reference project items)"
            className="min-h-[80px] pr-20"
            disabled={isSending}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMentionMenuOpen(true)}>
                    <AtSign className="h-4 w-4" />
                    <span className="sr-only">Mention</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mention team member</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReferenceMenuOpen(true)}>
                    <Hash className="h-4 w-4" />
                    <span className="sr-only">Reference</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reference project item</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button size="sm" className="h-8 px-3" onClick={handleSendMessage} disabled={!message.trim() || isSending}>
              {isSending ? (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse"></span>
                  <span
                    className="h-2 w-2 rounded-full bg-current animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-2 w-2 rounded-full bg-current animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>

        {mentionMenuOpen && (
          <div className="absolute bottom-20 left-4 z-10 w-64 bg-popover border rounded-md shadow-md">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search team members..."
                className="w-full p-1 text-sm bg-transparent border-none focus:outline-none"
                value={mentionFilter}
                onChange={(e) => setMentionFilter(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {team
                .filter((member) => !mentionFilter || member.name.toLowerCase().includes(mentionFilter.toLowerCase()))
                .map((member) => (
                  <button
                    key={member.id}
                    className="flex items-center gap-2 w-full p-2 text-left hover:bg-accent rounded-sm"
                    onClick={() => insertMention(member.name)}
                  >
                    <Avatar className="h-6 w-6">
                      {member.avatar && <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />}
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      {member.role && <div className="text-xs text-muted-foreground">{member.role}</div>}
                    </div>
                  </button>
                ))}
              {team.filter(
                (member) => !mentionFilter || member.name.toLowerCase().includes(mentionFilter.toLowerCase()),
              ).length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">No team members found</div>
              )}
            </div>
          </div>
        )}

        {referenceMenuOpen && (
          <div className="absolute bottom-20 left-4 z-10 w-64 bg-popover border rounded-md shadow-md">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search project items..."
                className="w-full p-1 text-sm bg-transparent border-none focus:outline-none"
                value={referenceFilter}
                onChange={(e) => setReferenceFilter(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {projectReferences
                .filter((ref) => !referenceFilter || ref.name.toLowerCase().includes(referenceFilter.toLowerCase()))
                .map((ref) => (
                  <button
                    key={`${ref.type}-${ref.id}`}
                    className="flex items-center gap-2 w-full p-2 text-left hover:bg-accent rounded-sm"
                    onClick={() => insertReference(ref)}
                  >
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center
                      ${
                        ref.type === "milestone"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : ref.type === "risk"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {ref.type === "milestone" ? "M" : ref.type === "risk" ? "R" : "F"}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{ref.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{ref.type}</div>
                    </div>
                  </button>
                ))}
              {projectReferences.filter(
                (ref) => !referenceFilter || ref.name.toLowerCase().includes(referenceFilter.toLowerCase()),
              ).length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">No project items found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
