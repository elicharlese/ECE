'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { GlassCard } from './ui/glass-card'
import { Button } from './ui/button'

interface ChatPopoutProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatPopout({ isOpen, onClose }: ChatPopoutProps) {
  const [newMessage, setNewMessage] = useState('')

  const mockChats = [
    { name: 'TradeMaster', lastMessage: 'Interested in your Tesla card', time: '2m', unread: 2 },
    { name: 'CardCollector99', lastMessage: 'Battle accepted!', time: '5m', unread: 0 },
    { name: 'TechEnthusiast', lastMessage: 'Thanks for the trade!', time: '1h', unread: 0 }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] md:w-96"
        >
          <GlassCard className="max-h-[70vh] overflow-hidden bg-card border border-border backdrop-blur-none">
            {/* Header */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-foreground" />
                  <h3 className="font-semibold text-foreground">Messages</h3>
                </div>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat List */}
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-3">
                  {mockChats.map((chat, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-info rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{chat.name}</span>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground truncate">{chat.lastMessage}</span>
                          {chat.unread > 0 && (
                            <span className="bg-accent text-white text-xs rounded-full px-2 py-1 ml-2">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Message */}
            <div className="p-4 border-t border-border/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Quick message..."
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button variant="default" size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
