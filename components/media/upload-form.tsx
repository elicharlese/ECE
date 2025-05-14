"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMedia } from "@/context/media-context"
import type { MediaType } from "@/types/media"
import { Upload, X, ImageIcon as Image, Video, Music, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UploadForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isExclusive, setIsExclusive] = useState(false)
  const [license, setLicense] = useState("Standard")
  const [mediaType, setMediaType] = useState<MediaType>("image")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { categories } = useMedia()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    const fileType = selectedFile.type.split("/")[0]
    let validType: MediaType = "image"

    if (fileType === "image") validType = "image"
    else if (fileType === "video") validType = "video"
    else if (fileType === "audio") validType = "audio"
    else validType = "document"

    setMediaType(validType)
    setFile(selectedFile)

    // Create preview for images and videos
    if (validType === "image" || validType === "video") {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    // Validate file type
    const fileType = droppedFile.type.split("/")[0]
    let validType: MediaType = "image"

    if (fileType === "image") validType = "image"
    else if (fileType === "video") validType = "video"
    else if (fileType === "audio") validType = "audio"
    else validType = "document"

    setMediaType(validType)
    setFile(droppedFile)

    // Create preview for images and videos
    if (validType === "image" || validType === "video") {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
    } else {
      setPreview(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    if (!title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your media",
        variant: "destructive",
      })
      return
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for your media",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would upload to a server
    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)

        // Reset form
        setTitle("")
        setDescription("")
        setCategory("")
        setTags("")
        setFile(null)
        setPreview(null)

        toast({
          title: "Upload successful",
          description: "Your media has been uploaded successfully",
          variant: "default",
        })
      }, 500)
    }, 4000)
  }

  const getMediaTypeIcon = () => {
    switch (mediaType) {
      case "image":
        return <Image className="h-8 w-8" />
      case "video":
        return <Video className="h-8 w-8" />
      case "audio":
        return <Music className="h-8 w-8" />
      case "document":
        return <FileText className="h-8 w-8" />
      default:
        return <FileText className="h-8 w-8" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* File upload area */}
          <div
            className="border-2 border-dashed rounded-md p-6 mb-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  {preview ? (
                    <div className="relative w-40 h-40">
                      <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile()
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {getMediaTypeIcon()}
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile()
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Click or drag to replace this file</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Drag and drop or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">Support for images, videos, audio, and documents</p>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          {/* Media details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your media"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your media"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="license">License</Label>
                <Select value={license} onValueChange={setLicense}>
                  <SelectTrigger id="license">
                    <SelectValue placeholder="Select a license" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard License</SelectItem>
                    <SelectItem value="Premium">Premium License</SelectItem>
                    <SelectItem value="CC BY">Creative Commons (CC BY)</SelectItem>
                    <SelectItem value="CC BY-SA">CC BY-SA</SelectItem>
                    <SelectItem value="CC BY-NC">CC BY-NC</SelectItem>
                    <SelectItem value="CC BY-ND">CC BY-ND</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
              <p className="text-xs text-muted-foreground mt-1">Tags help others discover your content</p>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public">Public</Label>
                  <p className="text-xs text-muted-foreground">Make this media visible to everyone</p>
                </div>
                <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="exclusive">Premium Content</Label>
                  <p className="text-xs text-muted-foreground">Mark as premium content (for subscribers only)</p>
                </div>
                <Switch id="exclusive" checked={isExclusive} onCheckedChange={setIsExclusive} />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isUploading ? (
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <Button type="submit" onClick={handleSubmit}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
