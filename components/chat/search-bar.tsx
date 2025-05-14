"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from "@/lib/chat-context"

interface SearchBarProps {
  onFocus?: () => void
}

export function SearchBar({ onFocus }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const { searchMessages, isSearching, clearSearch } = useChat()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      searchMessages(query)
    }
  }

  const handleClear = () => {
    setQuery("")
    clearSearch()
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!query) {
      clearSearch()
    }
  }, [query, clearSearch])

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <div className="absolute left-2.5 text-muted-foreground">
          <Search size={18} />
        </div>
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search messages..."
          className="pl-9 pr-10 h-9 bg-muted/50 border-none focus-visible:ring-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            onFocus?.()
          }}
          onBlur={() => setIsFocused(false)}
        />
        {query && (
          <div className="absolute right-2.5 flex items-center">
            {isSearching ? (
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                <X size={16} />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
