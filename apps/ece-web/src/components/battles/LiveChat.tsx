'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, Send, Users, Crown, Shield, 
  Smile, Heart, ThumbsUp, Zap 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  user: string
  message: string
  timestamp: Date
  type: 'message' | 'system' | 'emote'
  userRole?: 'player' | 'spectator' | 'mod'
}

interface LiveChatProps {
  battleId: string
  currentUser: string
  userRole: 'player' | 'spectator' | 'mod'
}

export function LiveChat({ battleId, currentUser, userRole }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'System',
      message: 'Battle started! Good luck to both players!',
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '2',
      user: 'CryptoWizard',
      message: 'Let\'s see what you got! 🔥',
      timestamp: new Date(),
      type: 'message',
      userRole: 'player'
    },
    {
      id: '3',
      user: 'TradeMaster',
      message: 'May the best deck win!',
      timestamp: new Date(),
      type: 'message',
      userRole: 'player'
    },
    {
      id: '4',
      user: 'Spectator123',
      message: 'This is going to be epic!',
      timestamp: new Date(),
      type: 'message',
      userRole: 'spectator'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickEmotes = [
    { icon: Heart, label: 'GG', color: 'text-monokai-accent' },
    { icon: ThumbsUp, label: 'Nice!', color: 'text-monokai-success' },
    { icon: Zap, label: 'Epic!', color: 'text-monokai-warning' },
    { icon: Smile, label: 'LOL', color: 'text-monokai-info' }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      user: currentUser,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message',
      userRole: userRole
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleQuickEmote = (emoteLabel: string) => {
    const message: Message = {
      id: Date.now().toString(),
      user: currentUser,
      message: emoteLabel,
      timestamp: new Date(),
      type: 'emote',
      userRole: userRole
    }

    setMessages(prev => [...prev, message])
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'player':
        return <Shield className="w-3 h-3 text-monokai-warning" />
      case 'mod':
        return <Crown className="w-3 h-3 text-monokai-accent" />
      default:
        return null
    }
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'player':
        return 'text-monokai-warning'
      case 'mod':
        return 'text-monokai-accent'
      case 'spectator':
        return 'text-monokai-info'
      default:
        return 'text-foreground'
    }
  }

  return (
    <GlassCard variant="dark" className="h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-monokai-info" />
            Live Chat
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>127 watching</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              message.type === 'system' 
                ? 'text-center text-xs text-muted-foreground italic' 
                : 'flex items-start gap-2'
            }`}
          >
            {message.type !== 'system' && (
              <>
                <div className="flex items-center gap-1 min-w-0">
                  {getRoleIcon(message.userRole)}
                  <span className={`text-sm font-medium truncate ${getRoleColor(message.userRole)}`}>
                    {message.user}:
                  </span>
                </div>
                <div className={`text-sm flex-1 ${
                  message.type === 'emote' 
                    ? 'font-bold text-monokai-warning' 
                    : 'text-foreground'
                }`}>
                  {message.message}
                </div>
              </>
            )}
            {message.type === 'system' && (
              <div className="text-monokai-info">
                {message.message}
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emotes */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex gap-2">
          {quickEmotes.map((emote, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleQuickEmote(emote.label)}
              className="flex items-center gap-1 text-xs"
            >
              <emote.icon className={`w-3 h-3 ${emote.color}`} />
              {emote.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            maxLength={200}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            variant="gradient"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {newMessage.length}/200
        </div>
      </div>
    </GlassCard>
  )
}
