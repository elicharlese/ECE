"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Paperclip, Smile, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownToolbar } from "./markdown-toolbar"
import { FileAttachment } from "./file-attachment"
import { EmojiPicker } from "./emoji-picker"
import ReactMarkdown from "react-markdown"
import { useChat } from "@/lib/chat-context"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

export function ChatInput() {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [files, setFiles] = useState<File[]>([])
  const [fileUploads, setFileUploads] = useState<Record<string, { progress: number; url?: string }>>({})
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const { sendMessage, setTyping } = useChat()
  const { user } = useAuth()
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleTyping = () => {
    setTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false)
    }, 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && files.length === 0) return

    // Upload files first if any
    const attachments = []

    if (files.length > 0) {
      for (const file of files) {
        const fileId = Object.keys(fileUploads).find((id) => fileUploads[id].url && fileUploads[id].progress === 100)
        if (fileId) {
          attachments.push({
            name: file.name,
            size: file.size,
            type: file.type,
            url: fileUploads[fileId].url,
          })
        }
      }
    }

    await sendMessage(message, undefined, attachments)
    setMessage("")
    setFiles([])
    setFileUploads({})
    setActiveTab("write")

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

  const insertMarkdown = useCallback(
    (markdown: string, selectionOffset?: number) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = message.substring(start, end)

      let newText
      let newCursorPos

      if (selectedText) {
        // If text is selected, wrap it with markdown
        const before = message.substring(0, start)
        const after = message.substring(end)

        // Replace placeholders in markdown with selected text
        const formattedMarkdown = markdown.replace(/text|item|quote|Heading|link text/, selectedText)

        newText = before + formattedMarkdown + after
        newCursorPos = start + formattedMarkdown.length
      } else {
        // If no text is selected, just insert the markdown
        const before = message.substring(0, start)
        const after = message.substring(start)

        newText = before + markdown + after
        newCursorPos = start + (selectionOffset !== undefined ? selectionOffset : markdown.length)
      }

      setMessage(newText)

      // Focus and set cursor position after state update
      setTimeout(() => {
        if (textarea) {
          textarea.focus()
          textarea.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [message],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      // Start uploading each file
      newFiles.forEach((file) => {
        uploadFile(file)
      })
    }
  }

  const uploadFile = async (file: File) => {
    if (!user) return

    const fileId = uuidv4()
    setFileUploads((prev) => ({
      ...prev,
      [fileId]: { progress: 0 },
    }))

    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}/${fileId}.${fileExt}`

      const { data, error } = await supabase.storage.from("chat-attachments").upload(filePath, file, {
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          setFileUploads((prev) => ({
            ...prev,
            [fileId]: { ...prev[fileId], progress: percent },
          }))
        },
      })

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-attachments").getPublicUrl(filePath)

      setFileUploads((prev) => ({
        ...prev,
        [fileId]: { ...prev[fileId], url: publicUrl },
      }))
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })

      // Remove the file from the list
      setFiles((prev) => prev.filter((f) => f !== file))
      setFileUploads((prev) => {
        const newUploads = { ...prev }
        delete newUploads[fileId]
        return newUploads
      })
    }
  }

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove))
  }

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = message.substring(0, start) + emoji + message.substring(end)

    setMessage(newText)

    // Set cursor position after the inserted emoji
    setTimeout(() => {
      if (textarea) {
        const newPosition = start + emoji.length
        textarea.focus()
        textarea.setSelectionRange(newPosition, newPosition)
      }
    }, 0)

    setIsEmojiPickerOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="border-t">
      <MarkdownToolbar onInsert={insertMarkdown} />

      {files.length > 0 && (
        <div className="px-4 py-2 space-y-2">
          {files.map((file, index) => (
            <FileAttachment
              key={index}
              file={file}
              onRemove={() => removeFile(file)}
              progress={Object.values(fileUploads)[index]?.progress}
            />
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList className="grid w-40 grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-1">
              <Edit className="h-3.5 w-3.5" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-1">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <div className="relative">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                <Smile className="h-4 w-4" />
                <span className="sr-only">Add emoji</span>
              </Button>

              {isEmojiPickerOpen && (
                <div className="absolute bottom-full right-0 mb-2">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setIsEmojiPickerOpen(false)} />
                </div>
              )}
            </div>
          </div>
        </div>

        <TabsContent value="write" className="mt-0">
          <div className="relative p-4">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                handleTyping()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (supports markdown)"
              className="min-h-[80px] resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="p-4 min-h-[120px] border rounded-md m-4 bg-muted/30">
            {message ? (
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{message}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground text-sm">Preview will appear here...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 pt-0">
        <Button
          type="submit"
          className="w-full"
          disabled={
            (!message.trim() && files.length === 0) ||
            Object.values(fileUploads).some((upload) => upload.progress < 100)
          }
        >
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>
    </form>
  )
}
