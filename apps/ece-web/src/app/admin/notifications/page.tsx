'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  Bell, 
  Send, 
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Mail,
  MessageSquare,
  Globe,
  Target,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Filter,
  Search
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'announcement' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'scheduled' | 'sent' | 'active'
  target: 'all' | 'premium' | 'admins' | 'specific'
  targetUsers?: string[]
  channels: Array<'app' | 'email' | 'sms' | 'push'>
  scheduledFor?: Date
  sentAt?: Date
  createdAt: Date
  updatedAt: Date
  author: string
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
  }
}

interface NotificationTemplate {
  id: string
  name: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'announcement' | 'system'
  variables: string[]
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Weekly Market Summary',
    content: 'Your weekly trading performance summary is ready. You earned 250 ECE this week!',
    type: 'info',
    priority: 'medium',
    status: 'sent',
    target: 'all',
    channels: ['app', 'email'],
    sentAt: new Date('2025-07-05T09:00:00'),
    createdAt: new Date('2025-07-04T15:30:00'),
    updatedAt: new Date('2025-07-04T15:30:00'),
    author: 'System',
    stats: {
      sent: 15420,
      delivered: 15180,
      opened: 12340,
      clicked: 3420
    }
  },
  {
    id: '2',
    title: 'New Card Collection Available',
    content: 'The Tesla Q2 2025 Performance collection is now available in the marketplace!',
    type: 'announcement',
    priority: 'high',
    status: 'active',
    target: 'premium',
    channels: ['app', 'email', 'push'],
    sentAt: new Date('2025-07-05T14:00:00'),
    createdAt: new Date('2025-07-05T13:45:00'),
    updatedAt: new Date('2025-07-05T13:45:00'),
    author: 'Admin',
    stats: {
      sent: 2840,
      delivered: 2810,
      opened: 2250,
      clicked: 890
    }
  },
  {
    id: '3',
    title: 'System Maintenance Notice',
    content: 'Scheduled maintenance on July 7th from 2:00 AM - 4:00 AM UTC. Trading will be temporarily unavailable.',
    type: 'warning',
    priority: 'urgent',
    status: 'scheduled',
    target: 'all',
    channels: ['app', 'email', 'sms'],
    scheduledFor: new Date('2025-07-06T18:00:00'),
    createdAt: new Date('2025-07-05T10:00:00'),
    updatedAt: new Date('2025-07-05T11:30:00'),
    author: 'Technical Team',
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    }
  }
]

const mockTemplates: NotificationTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Message',
    title: 'Welcome to ECE Trading Cards!',
    content: 'Welcome {{username}}! Start your trading journey with 100 free ECE tokens.',
    type: 'success',
    variables: ['username']
  },
  {
    id: 'weekly_summary',
    name: 'Weekly Performance Summary',
    title: 'Your Weekly Trading Summary',
    content: 'This week you earned {{earnings}} ECE and completed {{trades}} trades. Keep it up!',
    type: 'info',
    variables: ['username', 'earnings', 'trades']
  },
  {
    id: 'maintenance',
    name: 'Maintenance Alert',
    title: 'Scheduled Maintenance Notice',
    content: 'System maintenance scheduled for {{date}} from {{start_time}} to {{end_time}}.',
    type: 'warning',
    variables: ['date', 'start_time', 'end_time']
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    type: 'info' as const,
    priority: 'medium' as const,
    target: 'all' as const,
    channels: ['app'] as Array<'app' | 'email' | 'sms' | 'push'>,
    scheduledFor: ''
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'warning': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'info': return 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30'
      case 'announcement': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'system': return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'high': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'medium': return 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30'
      case 'low': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'active': return 'text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30'
      case 'scheduled': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'draft': return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getEngagementRate = (stats: Notification['stats']) => {
    if (stats.sent === 0) return 0
    return Math.round((stats.opened / stats.sent) * 100)
  }

  const handleCreateNotification = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const notification: Notification = {
        id: Date.now().toString(),
        ...newNotification,
        status: newNotification.scheduledFor ? 'scheduled' : 'draft',
        scheduledFor: newNotification.scheduledFor ? new Date(newNotification.scheduledFor) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'Admin',
        stats: { sent: 0, delivered: 0, opened: 0, clicked: 0 }
      }
      
      setNotifications(prev => [notification, ...prev])
      setShowCreateForm(false)
      setNewNotification({
        title: '',
        content: '',
        type: 'info',
        priority: 'medium',
        target: 'all',
        channels: ['app'],
        scheduledFor: ''
      })
    } catch (error) {
      console.error('Error creating notification:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationStats = () => {
    const total = notifications.length
    const sent = notifications.filter(n => n.status === 'sent').length
    const scheduled = notifications.filter(n => n.status === 'scheduled').length
    const active = notifications.filter(n => n.status === 'active').length
    const totalSent = notifications.reduce((sum, n) => sum + n.stats.sent, 0)
    const totalOpened = notifications.reduce((sum, n) => sum + n.stats.opened, 0)
    const avgEngagement = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0

    return { total, sent, scheduled, active, totalSent, avgEngagement }
  }

  const stats = getNotificationStats()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-4">
              Notifications Center
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage system notifications, announcements, and user communications
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-monokai-blue to-monokai-purple hover:from-monokai-blue/80 hover:to-monokai-purple/80 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-monokai-blue" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold text-[#A6E22E]">{stats.sent}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#A6E22E]" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-[#E6DB74]">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-[#E6DB74]" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-[#66D9EF]">{stats.active}</p>
              </div>
              <Zap className="h-8 w-8 text-[#66D9EF]" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSent.toLocaleString()}</p>
              </div>
              <Send className="h-8 w-8 text-monokai-purple" />
            </div>
          </Card>

          <Card className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgEngagement}%</p>
              </div>
              <Target className="h-8 w-8 text-monokai-green" />
            </div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-border/30 mb-8">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-blue data-[state=active]:to-monokai-purple data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              All Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="templates"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-green data-[state=active]:to-ocean-accent data-[state=active]:text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-purple data-[state=active]:to-monokai-pink data-[state=active]:text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-orange data-[state=active]:to-monokai-yellow data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="mt-0">
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Search and Filters */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-border/30 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filterStatus === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('all')}
                        className="border-border/30"
                      >
                        All
                      </Button>
                      <Button
                        variant={filterStatus === 'sent' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('sent')}
                        className="border-border/30"
                      >
                        Sent
                      </Button>
                      <Button
                        variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('scheduled')}
                        className="border-border/30"
                      >
                        Scheduled
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Notifications List */}
                <Card className="bg-white/10 backdrop-blur-xl border border-border/30">
                  <div className="p-6">
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-white/5 rounded-lg border border-border/20"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {notification.title}
                                </h3>
                                <Badge className={getTypeColor(notification.type)}>
                                  {notification.type}
                                </Badge>
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority}
                                </Badge>
                                <Badge className={getStatusColor(notification.status)}>
                                  {notification.status}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-3 line-clamp-2">
                                {notification.content}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Target: {notification.target}</span>
                                <span>Channels: {notification.channels.join(', ')}</span>
                                <span>Author: {notification.author}</span>
                                <span>
                                  {notification.sentAt 
                                    ? `Sent: ${formatDate(notification.sentAt)}`
                                    : notification.scheduledFor
                                    ? `Scheduled: ${formatDate(notification.scheduledFor)}`
                                    : `Created: ${formatDate(notification.createdAt)}`
                                  }
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-monokai-pink">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.status === 'sent' && (
                            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border/20">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-foreground">{notification.stats.sent.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Sent</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-monokai-green">{notification.stats.delivered.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Delivered</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-monokai-blue">{notification.stats.opened.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Opened</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-monokai-purple">{getEngagementRate(notification.stats)}%</p>
                                <p className="text-sm text-muted-foreground">Engagement</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <motion.div
                key="templates"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notification Templates</h3>
                  <p className="text-muted-foreground">Template management coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notification Analytics</h3>
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
                  <p className="text-muted-foreground">Settings configuration coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Create Notification Modal would be implemented here */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-border/30">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Create New Notification</h3>
                <p className="text-muted-foreground mb-4">Create notification form coming soon...</p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNotification} disabled={loading}>
                    Create
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
