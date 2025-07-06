'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Webhook, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Copy,
  Trash2,
  Edit,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'

interface WebhookEvent {
  id: string
  timestamp: string
  event: string
  status: 'success' | 'failed' | 'pending' | 'retry'
  attempts: number
  responseTime: number
  payload: string
}

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'paused' | 'failed'
  direction: 'incoming' | 'outgoing'
  secret: string
  lastTriggered: string
  successRate: number
  totalEvents: number
  recentEvents: WebhookEvent[]
}

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: 'stripe-payments',
    name: 'Stripe Payment Events',
    url: 'https://api.ece.com/webhooks/stripe',
    events: ['payment.succeeded', 'payment.failed', 'subscription.updated'],
    status: 'active',
    direction: 'incoming',
    secret: 'whsec_***',
    lastTriggered: '2 minutes ago',
    successRate: 98.5,
    totalEvents: 1247,
    recentEvents: [
      {
        id: '1',
        timestamp: '2 min ago',
        event: 'payment.succeeded',
        status: 'success',
        attempts: 1,
        responseTime: 142,
        payload: '{"id": "pi_123", "amount": 2000}'
      }
    ]
  },
  {
    id: 'user-notifications',
    name: 'User Event Notifications',
    url: 'https://notifications.service.com/ece/events',
    events: ['user.created', 'user.updated', 'order.completed'],
    status: 'active',
    direction: 'outgoing',
    secret: 'sec_***',
    lastTriggered: '5 minutes ago',
    successRate: 94.2,
    totalEvents: 892,
    recentEvents: [
      {
        id: '2',
        timestamp: '5 min ago',
        event: 'user.created',
        status: 'success',
        attempts: 1,
        responseTime: 89,
        payload: '{"user_id": "usr_456", "email": "user@example.com"}'
      }
    ]
  }
]

const availableEvents = [
  'user.created', 'user.updated', 'user.deleted',
  'order.created', 'order.updated', 'order.completed', 'order.cancelled',
  'payment.succeeded', 'payment.failed', 'payment.refunded',
  'subscription.created', 'subscription.updated', 'subscription.cancelled',
  'system.maintenance', 'system.alert', 'system.backup'
]

export default function WebhookManagementPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhooks)
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const statusColors = {
    active: 'text-green-500',
    paused: 'text-yellow-500',
    failed: 'text-red-500'
  }

  const statusIcons = {
    active: CheckCircle,
    paused: Pause,
    failed: XCircle
  }

  const eventStatusColors = {
    success: 'text-green-500',
    failed: 'text-red-500',
    pending: 'text-yellow-500',
    retry: 'text-orange-500'
  }

  const filteredWebhooks = webhooks.filter(webhook => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'incoming') return webhook.direction === 'incoming'
    if (selectedTab === 'outgoing') return webhook.direction === 'outgoing'
    return webhook.status === selectedTab
  })

  const handleToggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id 
        ? { 
            ...webhook, 
            status: webhook.status === 'active' ? 'paused' : 'active' 
          }
        : webhook
    ))
  }

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id))
  }

  const handleTestWebhook = (id: string) => {
    console.log('Testing webhook:', id)
    // Simulate test event
  }

  const handleRetryEvent = (webhookId: string, eventId: string) => {
    console.log('Retrying event:', eventId, 'for webhook:', webhookId)
    // Simulate retry
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Webhook Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage incoming and outgoing webhook endpoints and monitor events
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Webhook</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Webhooks</p>
                <p className="text-2xl font-bold">{webhooks.length}</p>
              </div>
              <Webhook className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-500">
                  {webhooks.filter(w => w.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Today</p>
                <p className="text-2xl font-bold">
                  {webhooks.reduce((sum, w) => sum + w.totalEvents, 0).toLocaleString()}
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-500">
                  {(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { value: 'all', label: 'All Webhooks' },
            { value: 'incoming', label: 'Incoming' },
            { value: 'outgoing', label: 'Outgoing' },
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'failed', label: 'Failed' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedTab === tab.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Webhooks List */}
        <div className="space-y-4">
          {filteredWebhooks.map((webhook) => {
            const StatusIcon = statusIcons[webhook.status]
            const isExpanded = selectedWebhook === webhook.id
            
            return (
              <motion.div
                key={webhook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        webhook.direction === 'incoming' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                      }`}>
                        {webhook.direction === 'incoming' ? (
                          <ArrowDownLeft className={`w-5 h-5 ${
                            webhook.direction === 'incoming' ? 'text-blue-500' : 'text-purple-500'
                          }`} />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-purple-500" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{webhook.name}</h3>
                        <p className="text-sm text-muted-foreground">{webhook.url}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusIcon className={`w-4 h-4 ${statusColors[webhook.status]}`} />
                          <span className={`text-sm font-medium ${statusColors[webhook.status]}`}>
                            {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {webhook.direction.charAt(0).toUpperCase() + webhook.direction.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestWebhook(webhook.id)}
                        className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Test</span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleWebhook(webhook.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          webhook.status === 'active'
                            ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                            : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        }`}
                      >
                        {webhook.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => setSelectedWebhook(isExpanded ? null : webhook.id)}
                        className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-sm font-medium transition-colors"
                      >
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-lg font-semibold">{webhook.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <p className="text-lg font-semibold">{webhook.totalEvents.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Triggered</p>
                      <p className="text-lg font-semibold">{webhook.lastTriggered}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Events</p>
                      <p className="text-lg font-semibold">{webhook.events.length}</p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 space-y-6">
                      {/* Configuration */}
                      <div>
                        <h4 className="font-medium mb-3">Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-muted-foreground">Endpoint URL</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="flex-1 p-2 bg-muted rounded text-sm">{webhook.url}</code>
                              <button className="p-2 hover:bg-muted rounded">
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Secret</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="flex-1 p-2 bg-muted rounded text-sm">{webhook.secret}</code>
                              <button className="p-2 hover:bg-muted rounded">
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Event Types */}
                      <div>
                        <h4 className="font-medium mb-3">Subscribed Events</h4>
                        <div className="flex flex-wrap gap-2">
                          {webhook.events.map(event => (
                            <span
                              key={event}
                              className="px-2 py-1 bg-muted rounded-md text-sm"
                            >
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recent Events */}
                      <div>
                        <h4 className="font-medium mb-3">Recent Events</h4>
                        <div className="space-y-2">
                          {webhook.recentEvents.map(event => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  event.status === 'success' ? 'bg-green-500' :
                                  event.status === 'failed' ? 'bg-red-500' :
                                  event.status === 'pending' ? 'bg-yellow-500' :
                                  'bg-orange-500'
                                }`} />
                                <span className="font-medium">{event.event}</span>
                                <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                                <span className={`text-sm font-medium ${eventStatusColors[event.status]}`}>
                                  {event.status}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{event.responseTime}ms</span>
                                <span>{event.attempts} attempts</span>
                                <button className="hover:text-foreground">
                                  <Eye className="w-4 h-4" />
                                </button>
                                {event.status === 'failed' && (
                                  <button 
                                    onClick={() => handleRetryEvent(webhook.id, event.id)}
                                    className="hover:text-foreground"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {filteredWebhooks.length === 0 && (
          <div className="text-center py-12">
            <Webhook className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No webhooks found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first webhook to start receiving or sending events
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80"
            >
              Create Webhook
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
