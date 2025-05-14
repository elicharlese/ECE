"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { supabase } from "@/lib/supabase-client"
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Trash2 } from "lucide-react"
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AvatarUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onAvatarChange: (url: string) => void
  currentAvatarUrl: string
}

export function AvatarUploadModal({ isOpen, onClose, onAvatarChange, currentAvatarUrl }: AvatarUploadModalProps) {
  const { toast } = useToast()
  const { user, updateUserAvatar } = useAuth()
  const { isDemoMode } = useDemo()
  const [isLoading, setIsLoading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState<CropType>()
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Reset crop, rotation and zoom
      setCrop(undefined)
      setRotation(0)
      setZoom(1)
    }
  }

  // Function to center and create a default crop when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget

    // Create a centered crop with a 1:1 aspect ratio
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // 1:1 aspect ratio
        width,
        height,
      ),
      width,
      height,
    )

    setCrop(crop)
  }, [])

  // Function to handle rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Function to handle zoom
  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  // Function to reset the upload
  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCrop(undefined)
    setRotation(0)
    setZoom(1)
  }

  // Function to get the cropped image as a blob
  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!imgRef.current || !crop) return null

    const canvas = document.createElement("canvas")
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    const pixelRatio = window.devicePixelRatio

    // Set canvas size to the cropped area
    canvas.width = crop.width * scaleX * pixelRatio
    canvas.height = crop.height * scaleY * pixelRatio

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // Set pixel ratio for higher quality
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = "high"

    // Calculate crop position
    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
    const cropWidth = crop.width * scaleX
    const cropHeight = crop.height * scaleY

    // Apply rotation if needed
    if (rotation > 0) {
      ctx.save()

      // Move to the center of the canvas
      ctx.translate(canvas.width / (2 * pixelRatio), canvas.height / (2 * pixelRatio))

      // Rotate around the center
      ctx.rotate((rotation * Math.PI) / 180)

      // Draw the image centered and rotated
      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -canvas.width / (2 * pixelRatio),
        -canvas.height / (2 * pixelRatio),
        canvas.width / pixelRatio,
        canvas.height / pixelRatio,
      )

      ctx.restore()
    } else {
      // Draw the image without rotation
      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width / pixelRatio,
        canvas.height / pixelRatio,
      )
    }

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob)
        },
        "image/jpeg",
        0.95,
      ) // High quality JPEG
    })
  }

  // Function to save the cropped avatar
  const handleSave = async () => {
    if (!selectedFile) return

    setIsLoading(true)

    try {
      if (isDemoMode) {
        // In demo mode, just use the preview URL
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        onAvatarChange(previewUrl || "")
        updateUserAvatar(previewUrl || "")
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
          variant: "default",
        })
        onClose()
      } else {
        // Get the cropped image
        const croppedBlob = await getCroppedImg()
        if (!croppedBlob || !user) {
          throw new Error("Failed to crop image or user not found")
        }

        // Create a file from the blob
        const fileName = `avatar-${user.id}-${Date.now()}.jpg`
        const avatarFile = new File([croppedBlob], fileName, { type: "image/jpeg" })

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage.from("avatars").upload(fileName, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        })

        if (error) throw error

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(data.path)

        // Update user metadata with the new avatar URL
        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl },
        })

        if (updateError) throw updateError

        // Update the avatar in the UI
        onAvatarChange(publicUrl)

        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
          variant: "default",
        })

        onClose()
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to remove the avatar
  const handleRemoveAvatar = async () => {
    setIsRemoving(true)

    try {
      if (isDemoMode) {
        // In demo mode, just clear the avatar URL
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        onAvatarChange("")
        updateUserAvatar("")
        toast({
          title: "Avatar removed",
          description: "Your profile picture has been removed.",
          variant: "default",
        })
        onClose()
      } else {
        if (!user) {
          throw new Error("User not found")
        }

        // If there's a current avatar URL and it's from Supabase Storage, try to delete the file
        if (currentAvatarUrl && currentAvatarUrl.includes("avatars")) {
          try {
            // Extract the file path from the URL
            const urlParts = currentAvatarUrl.split("avatars/")
            if (urlParts.length > 1) {
              const filePath = urlParts[1]
              // Delete the file from storage
              await supabase.storage.from("avatars").remove([filePath])
            }
          } catch (storageError) {
            console.error("Error removing avatar from storage:", storageError)
            // Continue even if storage removal fails
          }
        }

        // Update user metadata to remove the avatar URL
        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: null },
        })

        if (updateError) throw updateError

        // Update the avatar in the UI
        onAvatarChange("")

        toast({
          title: "Avatar removed",
          description: "Your profile picture has been removed.",
          variant: "default",
        })

        onClose()
      }
    } catch (error: any) {
      console.error("Error removing avatar:", error)
      toast({
        title: "Removal failed",
        description: error.message || "Failed to remove avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
      setShowRemoveConfirm(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
            <DialogDescription>
              Upload and crop your profile picture. You can adjust the crop, rotation, and zoom.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!previewUrl ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop an image here, or click to select</p>
                <p className="text-xs text-muted-foreground mb-4">PNG, JPG or GIF (max. 5MB)</p>
                <Button variant="outline" onClick={() => document.getElementById("avatar-upload")?.click()}>
                  Select Image
                </Button>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 z-10"
                    onClick={handleReset}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="overflow-hidden rounded-lg max-h-[300px] flex items-center justify-center bg-muted">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      aspect={1}
                      circularCrop
                      className="max-h-[300px]"
                    >
                      <img
                        ref={imgRef}
                        src={previewUrl || "/placeholder.svg"}
                        alt="Upload preview"
                        style={{
                          transform: `rotate(${rotation}deg) scale(${zoom})`,
                          maxHeight: "300px",
                          width: "auto",
                          transition: "transform 0.3s ease",
                        }}
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Zoom</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Slider value={[zoom]} min={0.5} max={3} step={0.01} onValueChange={handleZoomChange} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rotation</span>
                    <Button variant="outline" size="sm" onClick={handleRotate}>
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate 90°
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <div className="flex flex-row space-x-2 mt-2 sm:mt-0">
              {currentAvatarUrl && (
                <Button
                  variant="outline"
                  onClick={() => setShowRemoveConfirm(true)}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
            <LoadingButton
              onClick={handleSave}
              isLoading={isLoading}
              loadingText="Saving..."
              disabled={!selectedFile || !crop}
              className="bg-primary hover:bg-primary/90"
            >
              Save
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Profile Picture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your profile picture? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAvatar}
              className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
