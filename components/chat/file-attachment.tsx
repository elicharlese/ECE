"use client"

import { useState } from "react"
import { type File, X, Download, FileText, ImageIcon, Film, Music, Archive, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatBytes } from "@/lib/utils"

interface FileAttachmentProps {
  file: File
  onRemove?: () => void
  progress?: number
  url?: string
  preview?: boolean
}

export function FileAttachment({ file, onRemove, progress, url, preview = false }: FileAttachmentProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getFileIcon = () => {
    const type = file.type.split("/")[0]
    const extension = file.name.split(".").pop()?.toLowerCase()

    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Film className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      default:
        if (extension === "pdf") {
          return <FileText className="h-4 w-4" />
        } else if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
          return <Archive className="h-4 w-4" />
        } else {
          return <FileIcon className="h-4 w-4" />
        }
    }
  }

  const isImage = file.type.startsWith("image/")

  return (
    <div
      className="relative flex items-center gap-2 p-2 rounded-md border bg-muted/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded bg-muted">{getFileIcon()}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>

        {progress !== undefined && progress < 100 && <Progress value={progress} className="h-1 mt-1" />}
      </div>

      <div className="flex-shrink-0">
        {onRemove && (
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onRemove}>
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Remove file</span>
          </Button>
        )}

        {url && (
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" asChild>
            <a href={url} download={file.name} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only">Download file</span>
            </a>
          </Button>
        )}
      </div>

      {preview && isImage && url && (
        <div
          className={`absolute left-0 bottom-full mb-2 p-1 bg-background border rounded-md shadow-md transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <img src={url || "/placeholder.svg"} alt={file.name} className="max-w-[200px] max-h-[200px] rounded" />
        </div>
      )}
    </div>
  )
}
