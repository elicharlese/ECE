export type Channel = {
  id: string
  name: string
  description: string | null
  type: "team" | "project" | "direct"
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  channel_id: string
  user_id: string
  content: string
  is_edited: boolean
  is_pinned?: boolean
  parent_id: string | null
  thread_count: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    avatar_url: string
  }
  attachments?: MessageAttachment[]
}

export type MessageAttachment = {
  id: string
  message_id: string
  name: string
  size: number
  type: string
  url: string
  created_at: string
}

export type SearchResult = {
  id: string
  channel_id: string
  channel_name: string
  user_id: string
  user_name: string
  content: string
  created_at: string
  parent_id: string | null
}

export type ChannelMember = {
  id: string
  channel_id: string
  user_id: string
  last_read_at: string
  created_at: string
}

export type MessageReaction = {
  id: string
  message_id: string
  user_id: string
  reaction: string
  created_at: string
}

export type ReadReceipt = {
  id: string
  message_id: string
  user_id: string
  read_at: string
}

export type TypingIndicator = {
  id: string
  channel_id: string
  user_id: string
  is_typing: boolean
  updated_at: string
  user?: {
    id: string
    name: string
  }
}

export type UserPresence = {
  user_id: string
  is_online: boolean
  last_seen: string
  updated_at: string
}
