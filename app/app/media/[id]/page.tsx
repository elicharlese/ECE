"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMedia } from "@/context/media-context"
import { MediaPlayer } from "@/components/media/media-player"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2, Download, Flag, Bookmark, ArrowLeft } from "lucide-react"
import type { MediaItem } from "@/types/media"
import { useToast } from "@/hooks/use-toast"
import { MediaCard } from "@/components/media/media-card"

export default function MediaDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { getMediaById, mediaItems, likeMedia, addView, shareMedia } = useMedia()
  const [media, setMedia] = useState<MediaItem | undefined>(undefined)
  const [relatedMedia, setRelatedMedia] = useState<MediaItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (typeof id !== "string") return

    const mediaItem = getMediaById(id)
    setMedia(mediaItem)

    if (mediaItem) {
      // Record view
      addView(mediaItem.id)

      // Find related media (same category, excluding current item)
      const related = mediaItems
        .filter(
          (item) =>
            item.id !== mediaItem.id &&
            (item.category === mediaItem.category || item.tags.some((tag) => mediaItem.tags.includes(tag))),
        )
        .slice(0, 6)

      setRelatedMedia(related)
    }
  }, [id, getMediaById, mediaItems, addView])

  if (!media) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Media Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The media you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => router.push("/app/media")}>Back to Media</Button>
        </div>
      </div>
    )
  }

  const handleLike = () => {
    likeMedia(media.id)
    toast({
      title: "Liked",
      description: "You liked this media",
    })
  }

  const handleShare = () => {
    shareMedia(media.id)

    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied",
        description: "Media link copied to clipboard",
      })
    })
  }

  const handleDownload = () => {
    // In a real app, this would trigger a download
    toast({
      title: "Download started",
      description: "Your download will begin shortly",
    })
  }

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Media saved to your collection",
    })
  }

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe",
    })
  }

  // Format the creation date
  const formattedDate = formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })

  return (
    <div className="container py-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Media player */}
          <MediaPlayer media={media} autoPlay={false} />

          {/* Media info */}
          <div>
            <h1 className="text-2xl font-bold">{media.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{media.views.toLocaleString()} views</span>
                  <span className="mx-2">•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {media.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Creator info and actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={media.creatorAvatar || "/placeholder.svg"} alt={media.creatorName} />
                <AvatarFallback>{media.creatorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{media.creatorName}</h3>
                <p className="text-sm text-muted-foreground">Creator</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleLike}>
                <Heart className={`mr-1 h-4 w-4 ${media.likes > 0 ? "fill-primary text-primary" : ""}`} />
                {media.likes}
              </Button>

              <Button variant="outline" size="sm">
                <MessageCircle className="mr-1 h-4 w-4" />
                {media.comments}
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>

              <Button variant="outline" size="sm" onClick={handleSave}>
                <Bookmark className="mr-1 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tabs for description, comments, etc. */}
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="comments">Comments ({media.comments})</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-4">
              <p className="whitespace-pre-line">{media.description}</p>

              <div className="mt-4">
                <h4 className="font-medium mb-2">License</h4>
                <p className="text-sm">{media.license}</p>
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>

                <Button variant="ghost" size="sm" onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="pt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Comments are not available in this demo</p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Category</h4>
                  <p>{media.category}</p>
                </div>

                <div>
                  <h4 className="font-medium">Upload Date</h4>
                  <p>{new Date(media.createdAt).toLocaleDateString()}</p>
                </div>

                {media.fileSize && (
                  <div>
                    <h4 className="font-medium">File Size</h4>
                    <p>{(media.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}

                {media.duration && (
                  <div>
                    <h4 className="font-medium">Duration</h4>
                    <p>
                      {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium">License</h4>
                  <p>{media.license}</p>
                </div>

                <div>
                  <h4 className="font-medium">Visibility</h4>
                  <p>{media.isPublic ? "Public" : "Private"}</p>
                </div>

                <div>
                  <h4 className="font-medium">Content Type</h4>
                  <p>{media.isExclusive ? "Premium" : "Standard"}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar with related media */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Related Media</h3>
            {relatedMedia.length > 0 ? (
              <div className="space-y-4">
                {relatedMedia.map((item) => (
                  <MediaCard key={item.id} media={item} variant="compact" />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No related media found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
