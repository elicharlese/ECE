"use client"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./search-bar"
import { SearchResults } from "./search-results"
import { useChat } from "@/lib/chat-context"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { searchQuery } = useChat()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>Search Messages</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="mt-2">
            <SearchBar />
          </div>
        </DialogHeader>

        <div className="min-h-[300px]">
          {searchQuery ? (
            <SearchResults onClose={() => onOpenChange(false)} />
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Enter a search term to find messages</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
