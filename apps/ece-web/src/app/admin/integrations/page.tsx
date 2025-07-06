'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Settings, 
  Power, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  Key,
  Clock,
  Activity,
  Trash2,
  Edit
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'

interface Integration {
  id: string
  name: string
  description: string
  type: 'payment' | 'analytics' | 'notification' | 'storage' | 'social' | 'other'
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  lastSync: string
  config: Record<string, any>
  apiCalls: number
  rateLimit: number
}

const mockIntegrations: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    type: 'payment',
    status: 'connected',
    lastSync: '2 minutes ago',
    config: { webhookUrl: 'https://api.ece.com/webhooks/stripe' },
    apiCalls: 1247,
    rateLimit: 5000
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Website traffic and user behavior analytics',
    type: 'analytics',
    status: 'connected',
    lastSync: '5 minutes ago',
    config: { trackingId: 'GA-XXXXXXXXX' },
    apiCalls: 892,
    rateLimit: 10000
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery and marketing campaigns',
    type: 'notification',
    status: 'error',
    lastSync: '2 hours ago',
    config: { apiKey: 'SG.***' },
    apiCalls: 456,
    rateLimit: 2000
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Cloud storage for files and backups',
    type: 'storage',
    status: 'connected',
    lastSync: '1 minute ago',
    config: { bucket: 'ece-storage', region: 'us-east-1' },
    apiCalls: 2341,
    rateLimit: 50000
  }
]

const integrationTypes = [
  { value: 'payment', label: 'Payment Processing', icon: '💳' },
  { value: 'analytics', label: 'Analytics & Tracking', icon: '📊' },
  { value: 'notification', label: 'Notifications & Email', icon: '📧' },
  { value: 'storage', label: 'Cloud Storage', icon: '☁️' },
  { value: 'social', label: 'Social Media', icon: '📱' },
  { value: 'other', label: 'Other Services', icon: '🔧' }
]

export default function ExternalIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const statusColors = {
    connected: 'text-green-500',
    disconnected: 'text-gray-500',
    error: 'text-red-500',
    pending: 'text-yellow-500'
  }

  const statusIcons = {
    connected: CheckCircle,
    disconnected: Power,
    error: AlertCircle,
    pending: Clock
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesTab = selectedTab === 'all' || integration.type === selectedTab
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected' 
          }
        : integration
    ))
  }

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">External Integrations</h1>
            <p className="text-muted-foreground mt-1">
              Manage third-party service connections and API integrations
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Integration</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Integrations</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold text-green-500">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues</p>
                <p className="text-2xl font-bold text-red-500">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API Calls Today</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.apiCalls, 0).toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedTab === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All Types
            </button>
            {integrationTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedTab(type.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedTab === type.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredIntegrations.map((integration) => {
            const StatusIcon = statusIcons[integration.status]
            
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-lg">
                        {integrationTypes.find(t => t.value === integration.type)?.icon || '🔧'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`w-5 h-5 ${statusColors[integration.status]}`} />
                    <span className={`text-sm font-medium ${statusColors[integration.status]}`}>
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span>{integration.lastSync}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API Calls:</span>
                    <span>{integration.apiCalls.toLocaleString()} / {integration.rateLimit.toLocaleString()}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(integration.apiCalls / integration.rateLimit) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        integration.status === 'connected'
                          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                      }`}
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                    
                    <button className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-sm font-medium transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteIntegration(integration.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedTab !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first integration'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80"
            >
              Add Integration
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
