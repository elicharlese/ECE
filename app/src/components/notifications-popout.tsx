'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  Clock, 
  Star, 
  TrendingUp, 
  AlertCircle,
  Check,
  Trash2
} from 'lucide-react'
import { GlassCard } from './ui/glass-card'
import { Button } from './ui/button'
import { useSubscription } from '@/contexts/subscription-context'

interface Notification {
  id: string
  type: 'market' | 'social' | 'trading' | 'ipo' | 'price_alert' | 'system'
  title: string
  message: string
  data?: any
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requiresSubscription?: 'pro' | 'enterprise'
  createdAt: Date
}

interface NotificationsPopoutProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  onNotificationUpdate?: () => void
}

export function NotificationsPopout({ isOpen, onClose, userId = 'user_pro_001', onNotificationUpdate }: NotificationsPopoutProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { subscription } = useSubscription()

  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications()
    }
  }, [isOpen, userId])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/notifications?userId=${userId}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_read',
          userId,
          notificationIds: [notificationId]
        })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        )
        onNotificationUpdate?.()
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_all_read',
          userId
        })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        )
        onNotificationUpdate?.()
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    onNotificationUpdate?.()
  }

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'ipo':
        return <Star className="w-4 h-4 text-monokai-purple" />
      case 'price_alert':
        return <TrendingUp className="w-4 h-4 text-monokai-orange" />
      case 'market':
        return <AlertCircle className="w-4 h-4 text-monokai-blue" />
      case 'social':
        return <Bell className="w-4 h-4 text-monokai-green" />
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500'
      case 'high':
        return 'border-l-monokai-orange'
      case 'medium':
        return 'border-l-monokai-blue'
      default:
        return 'border-l-muted'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Popout */}
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
                    <Bell className="w-5 h-5 text-foreground" />
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-1 bg-monokai-pink text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        onClick={markAllAsRead}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={onClose}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-ocean-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll notify you about trading opportunities
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-muted transition-colors border-l-2 ${getPriorityColor(notification.priority)} ${
                          notification.read ? 'opacity-70' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-foreground truncate">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center space-x-2 mt-2">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(new Date(notification.createdAt))}
                                  </span>
                                  {notification.requiresSubscription && (
                                    <span className="px-1.5 py-0.5 bg-monokai-pink/20 text-monokai-pink text-xs rounded">
                                      {notification.requiresSubscription}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                   
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                 
                                  onClick={() => dismissNotification(notification.id)}
                                  className="p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border/50 text-center">
                  <Button variant="ghost" className="text-xs">
                    View All Notifications
                  </Button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
