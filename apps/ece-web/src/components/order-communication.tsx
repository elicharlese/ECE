'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  FileText, 
  Paperclip,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface OrderMessage {
  id: string
  orderId: string
  userId: string
  messageType: 'MESSAGE' | 'PROGRESS_UPDATE' | 'REVISION_REQUEST' | 'DELIVERY_NOTIFICATION' | 'SYSTEM_ALERT'
  subject?: string
  message: string
  isFromAdmin: boolean
  attachments?: any[]
  read: boolean
  important: boolean
  createdAt: Date
  updatedAt: Date
}

interface OrderCommunicationProps {
  orderId: string
  userId: string
  isAdmin?: boolean
  onClose?: () => void
}

export function OrderCommunication({ orderId, userId, isAdmin = false, onClose }: OrderCommunicationProps) {
  const [messages, setMessages] = useState<OrderMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [messageType, setMessageType] = useState<OrderMessage['messageType']>('MESSAGE')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  // Mock sample messages for demonstration
  const sampleMessages: OrderMessage[] = [
    {
      id: 'msg_001',
      orderId,
      userId,
      messageType: 'SYSTEM_ALERT',
      subject: 'Order Created Successfully',
      message: 'Your order has been created and is pending review. We\'ll begin work shortly and keep you updated on progress.',
      isFromAdmin: true,
      read: true,
      important: true,
      createdAt: new Date('2024-12-01T10:00:00'),
      updatedAt: new Date('2024-12-01T10:00:00')
    },
    {
      id: 'msg_002',
      orderId,
      userId,
      messageType: 'PROGRESS_UPDATE',
      subject: 'Work Started',
      message: 'Great news! We\'ve started working on your project. Initial wireframes and component structure are being developed.',
      isFromAdmin: true,
      read: true,
      important: false,
      createdAt: new Date('2024-12-02T14:30:00'),
      updatedAt: new Date('2024-12-02T14:30:00')
    },
    {
      id: 'msg_003',
      orderId,
      userId,
      messageType: 'MESSAGE',
      subject: 'Quick Question',
      message: 'Hi! Could you clarify the color scheme preferences? Should we stick to the brand colors you mentioned, or would you like us to suggest a modern palette?',
      isFromAdmin: false,
      read: true,
      important: false,
      createdAt: new Date('2024-12-03T09:15:00'),
      updatedAt: new Date('2024-12-03T09:15:00')
    },
    {
      id: 'msg_004',
      orderId,
      userId,
      messageType: 'MESSAGE',
      subject: 'Re: Quick Question',
      message: 'Thanks for asking! Please use the brand colors I provided in the initial brief. They should work well with a modern, clean design aesthetic.',
      isFromAdmin: true,
      read: false,
      important: false,
      createdAt: new Date('2024-12-03T16:45:00'),
      updatedAt: new Date('2024-12-03T16:45:00')
    }
  ]

  useEffect(() => {
    // Simulate loading messages
    setTimeout(() => {
      setMessages(sampleMessages)
      setIsLoading(false)
    }, 500)
  }, [orderId])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)

    const message: OrderMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      userId,
      messageType,
      subject: subject || undefined,
      message: newMessage,
      isFromAdmin: isAdmin,
      read: false,
      important: messageType === 'SYSTEM_ALERT' || messageType === 'DELIVERY_NOTIFICATION',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    try {
      // In a real app, this would make an API call
      // const response = await fetch('/api/admin/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     action: 'send_message',
      //     orderId,
      //     data: message
      //   })
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMessages(prev => [...prev, message])
      setNewMessage('')
      setSubject('')
      setMessageType('MESSAGE')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const getMessageIcon = (type: OrderMessage['messageType']) => {
    switch (type) {
      case 'PROGRESS_UPDATE': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'REVISION_REQUEST': return <AlertCircle className="w-4 h-4 text-orange-500" />
      case 'DELIVERY_NOTIFICATION': return <FileText className="w-4 h-4 text-green-500" />
      case 'SYSTEM_ALERT': return <AlertCircle className="w-4 h-4 text-purple-500" />
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  const getMessageTypeColor = (type: OrderMessage['messageType']) => {
    switch (type) {
      case 'PROGRESS_UPDATE': return 'bg-blue-100 text-blue-800'
      case 'REVISION_REQUEST': return 'bg-orange-100 text-orange-800'
      case 'DELIVERY_NOTIFICATION': return 'bg-green-100 text-green-800'
      case 'SYSTEM_ALERT': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Order Communication</h3>
              <p className="text-sm text-gray-600">Order ID: {orderId}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xl ${message.isFromAdmin ? 'mr-auto' : 'ml-auto'}`}>
                    <Card className={`${message.isFromAdmin ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {message.isFromAdmin ? (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-900">Admin</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-900">Client</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getMessageTypeColor(message.messageType)}`}>
                              {getMessageIcon(message.messageType)}
                              <span className="ml-1">{message.messageType.replace('_', ' ')}</span>
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {message.subject && (
                          <CardTitle className="text-sm font-medium text-gray-900">
                            {message.subject}
                          </CardTitle>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {message.attachments.length} attachment(s)
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-4">
            {isAdmin && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Subject (optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value as OrderMessage['messageType'])}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="MESSAGE">General Message</option>
                  <option value="PROGRESS_UPDATE">Progress Update</option>
                  <option value="REVISION_REQUEST">Revision Request</option>
                  <option value="DELIVERY_NOTIFICATION">Delivery</option>
                  <option value="SYSTEM_ALERT">System Alert</option>
                </select>
              </div>
            )}
            
            <div className="flex gap-4">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    sendMessage()
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
                className="self-end"
              >
                {isSending ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              Press Ctrl+Enter to send quickly
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
