export type MediaType = "image" | "video" | "audio" | "document"

export type MediaItem = {
  id: string
  title: string
  description: string
  type: MediaType
  url: string
  thumbnailUrl?: string
  creatorId: string
  creatorName: string
  creatorAvatar?: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: number
  shares: number
  duration?: number // For video and audio
  fileSize?: number
  tags: string[]
  category: string
  isPublic: boolean
  isFeatured: boolean
  isExclusive: boolean // Premium content
  license: string
}

export type MediaComment = {
  id: string
  mediaId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  likes: number
  replies?: MediaComment[]
}

export type MediaCollection = {
  id: string
  name: string
  description: string
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
  coverImage?: string
  mediaItems: string[] // Array of media IDs
  isPublic: boolean
}

export type MediaCategory = {
  id: string
  name: string
  description: string
  iconName: string
  coverImage?: string
  count: number
}
