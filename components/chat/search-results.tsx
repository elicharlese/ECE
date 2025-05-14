"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MessageSquare, ChevronRight, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useChat } from "@/lib/chat-context"
import type { SearchResult } from "@/types/chat"

interface SearchResultsProps {
  onClose: () => void
}

export function SearchResults({ onClose }: SearchResultsProps) {
  const { searchResults, isSearching, searchQuery, jumpToMessage, currentChannel } = useChat()
  const [expandedChannels, setExpandedChannels] = useState<Record<string, boolean>>({})

  // Group results by channel
  const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>((acc, result) => {
    if (!acc[result.channel_id]) {
      acc[result.channel_id] = []
    }
    acc[result.channel_id].push(result)
    return acc
  }, {})

  const toggleChannel = (channelId: string) => {
    setExpandedChannels((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }))
  }

  const handleJumpToMessage = (result: SearchResult) => {
    jumpToMessage(result)
    onClose()
  }

  // Helper to highlight search terms in content
  const highlightSearchTerms = (content: string, query: string) => {
    if (!query) return content

    const parts = content.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  if (isSearching) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent" />
        <p className="mt-2 text-sm text-muted-foreground">Searching messages...</p>
      </div>
    )
  }

  if (searchResults.length === 0 && searchQuery) {
    return (
      <div className="p-8 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No results found</h3>
        <p className="mt-2 text-sm text-muted-foreground">We couldn't find any messages matching "{searchQuery}"</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="p-4 space-y-4">
        {searchQuery && (
          <div className="pb-2 mb-2 border-b">
            <p className="text-sm text-muted-foreground">
              {searchResults.length} {searchResults.length === 1 ? "result" : "results"} for "{searchQuery}"
            </p>
          </div>
        )}

        {Object.entries(groupedResults).map(([channelId, results]) => {
          const isExpanded = expandedChannels[channelId] !== false // Default to expanded
          const channelName = results[0]?.channel_name || "Unknown Channel"
          const isCurrentChannel = currentChannel?.id === channelId

          return (
            <div key={channelId} className="border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50"
                onClick={() => toggleChannel(channelId)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="font-medium">
                    {channelName} {isCurrentChannel && "(current)"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {results.length} {results.length === 1 ? "result" : "results"}
                  </span>
                </div>
              </Button>

              {isExpanded && (
                <div className="divide-y">
                  {results.map((result) => (
                    <Button
                      key={result.id}
                      variant="ghost"
                      className="w-full flex flex-col items-start p-3 text-left hover:bg-muted/50"
                      onClick={() => handleJumpToMessage(result)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="font-medium truncate">{result.user_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(result.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full text-left">
                        {highlightSearchTerms(result.content, searchQuery)}
                      </p>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
