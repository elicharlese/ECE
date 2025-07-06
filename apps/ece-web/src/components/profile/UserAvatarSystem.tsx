'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, Crop, X, Check, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'

interface UserAvatarSystemProps {
  currentAvatar?: string
  userName: string
  onAvatarUpdate: (avatarUrl: string) => void
  className?: string
}

export function UserAvatarSystem({ 
  currentAvatar, 
  userName, 
  onAvatarUpdate, 
  className = '' 
}: UserAvatarSystemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewImage(result)
      setIsEditing(true)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveAvatar = async () => {
    if (!previewImage) return

    setIsUploading(true)
    try {
      // In a real app, this would upload to a cloud storage service
      // For now, we'll simulate the upload and use the data URL
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate upload
      
      onAvatarUpdate(previewImage)
      setIsEditing(false)
      setPreviewImage(null)
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#75715E]/30 hover:border-[#A6E22E]/50 transition-colors"
        >
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt={`${userName}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#F92672]/80 to-[#66D9EF]/80 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(userName)}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* Edit button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 p-2 bg-[#A6E22E] hover:bg-[#A6E22E]/90 text-[#272822] rounded-full shadow-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Avatar Editor Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#272822]/95 backdrop-blur-xl border border-[#75715E]/30 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#F8EFD6]">
                Update Profile Picture
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-[#75715E]/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#75715E]" />
              </button>
            </div>

            {/* Preview */}
            {previewImage && (
              <div className="mb-6">
                <div className="aspect-square max-w-48 mx-auto rounded-xl overflow-hidden border-2 border-[#75715E]/30">
                  <img
                    src={previewImage}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-[#75715E] text-center mt-2">
                  Preview of your new profile picture
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="flex-1 text-[#75715E] hover:bg-[#75715E]/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAvatar}
                disabled={isUploading || !previewImage}
                className="flex-1 bg-[#A6E22E] hover:bg-[#A6E22E]/90 text-[#272822]"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-[#272822]/30 border-t-[#272822] rounded-full animate-spin mr-2" />
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Save Avatar
                  </div>
                )}
              </Button>
            </div>

            {/* Tips */}
            <div className="mt-4 p-3 bg-[#75715E]/10 rounded-lg">
              <p className="text-xs text-[#75715E]">
                <strong>Tips:</strong> Use a square image for best results. 
                Supported formats: JPG, PNG, GIF. Max size: 5MB.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
