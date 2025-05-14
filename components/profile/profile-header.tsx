"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Trash2 } from "lucide-react"
import { AvatarUploadModal } from "@/components/profile/avatar-upload-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"

export function ProfileHeader() {
  const { user, updateUserAvatar } = useAuth()
  const { isDemoMode } = useDemo()
  const { toast } = useToast()
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [initials, setInitials] = useState("U")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (user) {
      // Get user name from metadata
      const name = user.user_metadata?.name || user.email?.split("@")[0] || "User"
      setUserName(name)

      // Get user email
      setUserEmail(user.email || "")

      // Get avatar URL from metadata
      const avatar = user.user_metadata?.avatar_url || ""
      setAvatarUrl(avatar)

      // Generate initials from name
      const nameParts = name.split(" ")
      if (nameParts.length > 1) {
        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase())
      } else if (name.length > 0) {
        setInitials(name[0].toUpperCase())
      }
    } else if (isDemoMode) {
      setUserName("Demo User")
      setUserEmail("demo@example.com")
      setInitials("D")
      setAvatarUrl("/diverse-user-avatars.png")
    }
  }, [user, isDemoMode])

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url)
  }

  // Function to remove the avatar
  const handleRemoveAvatar = async () => {
    setIsRemoving(true)

    try {
      if (isDemoMode) {
        // In demo mode, just clear the avatar URL
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        setAvatarUrl("")
        updateUserAvatar("")
        toast({
          title: "Avatar removed",
          description: "Your profile picture has been removed.",
          variant: "default",
        })
      } else {
        if (!user) {
          throw new Error("User not found")
        }

        // If there's a current avatar URL and it's from Supabase Storage, try to delete the file
        if (avatarUrl && avatarUrl.includes("avatars")) {
          try {
            // Extract the file path from the URL
            const urlParts = avatarUrl.split("avatars/")
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
        setAvatarUrl("")

        toast({
          title: "Avatar removed",
          description: "Your profile picture has been removed.",
          variant: "default",
        })
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
    <div className="flex flex-col items-center md:items-start">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={userName} />
          <AvatarFallback className="text-xl bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsUploadModalOpen(true)}>
              <Camera className="h-4 w-4 mr-2" />
              Change picture
            </DropdownMenuItem>
            {avatarUrl && (
              <DropdownMenuItem
                onClick={() => setShowRemoveConfirm(true)}
                className="text-red-500 hover:text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove picture
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h2 className="mt-4 text-xl font-semibold">{userName}</h2>
      <p className="text-sm text-muted-foreground">{userEmail}</p>
      {isDemoMode && (
        <Badge className="mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Demo Account
        </Badge>
      )}

      <AvatarUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAvatarChange={handleAvatarChange}
        currentAvatarUrl={avatarUrl}
      />

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
    </div>
  )
}
