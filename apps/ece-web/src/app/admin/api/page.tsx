'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Server,
  Key,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  Globe,
  Zap,
  Settings,
  Eye,
  Download
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface APIEndpoint {
  id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  requestsToday: number
  avgResponseTime: number
  errorRate: number
  status: 'active' | 'deprecated' | 'maintenance'
  rateLimitEnabled: boolean
  rateLimitRequests: number
  rateLimitWindow: number
  lastAccessed: Date
}

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  requestsToday: number
  requestsThisMonth: number
  rateLimit: number
  status: 'active' | 'suspended' | 'expired'
  createdAt: Date
  lastUsed: Date
  expiresAt?: Date
}

interface RateLimitRule {
  id: string
  name: string
  endpoint: string
  method: string
  requests: number
  window: number // in seconds
  enabled: boolean
  description: string
}

const mockEndpoints: APIEndpoint[] = [
  {
    id: '1',
    path: '/api/users',
    method: 'GET',
    description: 'Retrieve user list',
    requestsToday: 15420,
    avgResponseTime: 145,
    errorRate: 0.2,
    status: 'active',
    rateLimitEnabled: true,
    rateLimitRequests: 1000,
    rateLimitWindow: 3600,
    lastAccessed: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: '2',
    path: '/api/orders',
    method: 'POST',
    description: 'Create new order',
    requestsToday: 8930,
    avgResponseTime: 320,
    errorRate: 1.8,
    status: 'active',
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 3600,
    lastAccessed: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: '3',
    path: '/api/marketplace/listings',
    method: 'GET',
    description: 'Get marketplace listings',
    requestsToday: 25680,
    avgResponseTime: 180,
    errorRate: 0.5,
    status: 'active',
    rateLimitEnabled: true,
    rateLimitRequests: 2000,
    rateLimitWindow: 3600,
    lastAccessed: new Date(Date.now() - 1 * 60 * 1000)
  },
  {
    id: '4',
    path: '/api/analytics',
    method: 'GET',
    description: 'Analytics data retrieval',
    requestsToday: 3450,
    avgResponseTime: 890,
    errorRate: 0.1,
    status: 'active',
    rateLimitEnabled: true,
    rateLimitRequests: 500,
    rateLimitWindow: 3600,
    lastAccessed: new Date(Date.now() - 10 * 60 * 1000)
  }
]

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Mobile App Production',
    key: 'ece_prod_...k8s9',
    permissions: ['users:read', 'orders:write', 'marketplace:read'],
    requestsToday: 12450,
    requestsThisMonth: 456780,
    rateLimit: 10000,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date(Date.now() - 2 * 60 * 1000),
    expiresAt: new Date('2025-01-15')
  },
  {
    id: '2',
    name: 'Web Dashboard',
    key: 'ece_web_...m3n7',
    permissions: ['users:read', 'analytics:read', 'settings:write'],
    requestsToday: 8920,
    requestsThisMonth: 234560,
    rateLimit: 5000,
    status: 'active',
    createdAt: new Date('2024-03-10'),
    lastUsed: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Third Party Integration',
    key: 'ece_3rd_...p2q4',
    permissions: ['marketplace:read'],
    requestsToday: 1560,
    requestsThisMonth: 45230,
    rateLimit: 1000,
    status: 'suspended',
    createdAt: new Date('2024-06-01'),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
]

const mockRateLimitRules: RateLimitRule[] = [
  {
    id: '1',
    name: 'General API Limit',
    endpoint: '/api/*',
    method: '*',
    requests: 1000,
    window: 3600,
    enabled: true,
    description: 'Default rate limit for all API endpoints'
  },
  {
    id: '2',
    name: 'User Creation Limit',
    endpoint: '/api/users',
    method: 'POST',
    requests: 10,
    window: 60,
    enabled: true,
    description: 'Strict limit for user creation to prevent spam'
  },
  {
    id: '3',
    name: 'Order Processing Limit',
    endpoint: '/api/orders',
    method: 'POST',
    requests: 100,
    window: 3600,
    enabled: true,
    description: 'Rate limit for order creation'
  }
]

export default function APIDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'keys' | 'ratelimits'>('overview')
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>(mockEndpoints)
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys)
  const [rateLimitRules, setRateLimitRules] = useState<RateLimitRule[]>(mockRateLimitRules)

  const totalRequests = endpoints.reduce((sum, endpoint) => sum + endpoint.requestsToday, 0)
  const avgResponseTime = endpoints.reduce((sum, endpoint) => sum + endpoint.avgResponseTime, 0) / endpoints.length
  const totalErrorRate = endpoints.reduce((sum, endpoint) => sum + endpoint.errorRate, 0) / endpoints.length
  const activeEndpoints = endpoints.filter(e => e.status === 'active').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500'
      case 'deprecated': return 'text-yellow-500'
      case 'maintenance': return 'text-red-500'
      case 'suspended': return 'text-red-500'
      case 'expired': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'deprecated': return AlertTriangle
      case 'maintenance': return Clock
      case 'suspended': return AlertTriangle
      case 'expired': return Clock
      default: return Clock
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-500 bg-green-500/20'
      case 'POST': return 'text-blue-500 bg-blue-500/20'
      case 'PUT': return 'text-yellow-500 bg-yellow-500/20'
      case 'DELETE': return 'text-red-500 bg-red-500/20'
      case 'PATCH': return 'text-purple-500 bg-purple-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'endpoints', label: 'Endpoints', icon: Server },
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'ratelimits', label: 'Rate Limits', icon: Shield }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Server className="w-8 h-8 mr-3 text-blue-500" />
              API Dashboard
            </h1>
            <p className="text-muted-foreground">Monitor and manage API usage, keys, and rate limits</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              API Settings
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalRequests.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Requests Today</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{Math.round(avgResponseTime)}ms</p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalErrorRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activeEndpoints}</p>
                    <p className="text-sm text-muted-foreground">Active Endpoints</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recent API Activity */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4">Top Endpoints Today</h2>
              <div className="space-y-4">
                {endpoints.slice(0, 5).map((endpoint) => {
                  const StatusIcon = getStatusIcon(endpoint.status)
                  return (
                    <div key={endpoint.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{endpoint.path}</p>
                          <p className="text-xs text-muted-foreground">{endpoint.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-foreground">{endpoint.requestsToday.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Requests</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">{endpoint.avgResponseTime}ms</p>
                          <p className="text-xs text-muted-foreground">Avg Time</p>
                        </div>
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(endpoint.status)}`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">API Endpoints</h2>
              <Button>Add New Endpoint</Button>
            </div>
            
            <div className="space-y-4">
              {endpoints.map((endpoint) => {
                const StatusIcon = getStatusIcon(endpoint.status)
                return (
                  <div key={endpoint.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{endpoint.path}</p>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(endpoint.status)}`} />
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/30">
                      <div>
                        <p className="text-xs text-muted-foreground">Requests Today</p>
                        <p className="font-medium text-foreground">{endpoint.requestsToday.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Response</p>
                        <p className="font-medium text-foreground">{endpoint.avgResponseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Error Rate</p>
                        <p className="font-medium text-foreground">{endpoint.errorRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Access</p>
                        <p className="font-medium text-foreground">{formatTimeAgo(endpoint.lastAccessed)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        )}

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <Button>Generate New Key</Button>
            </div>
            
            <div className="space-y-4">
              {apiKeys.map((apiKey) => {
                const StatusIcon = getStatusIcon(apiKey.status)
                return (
                  <div key={apiKey.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{apiKey.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{apiKey.key}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(apiKey.status)}`} />
                        <Button variant="ghost" size="sm">Settings</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/30">
                      <div>
                        <p className="text-xs text-muted-foreground">Requests Today</p>
                        <p className="font-medium text-foreground">{apiKey.requestsToday.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Usage</p>
                        <p className="font-medium text-foreground">{apiKey.requestsThisMonth.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rate Limit</p>
                        <p className="font-medium text-foreground">{apiKey.rateLimit}/hour</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Used</p>
                        <p className="font-medium text-foreground">{formatTimeAgo(apiKey.lastUsed)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        )}

        {/* Rate Limits Tab */}
        {activeTab === 'ratelimits' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Rate Limit Rules</h2>
              <Button>Add New Rule</Button>
            </div>
            
            <div className="space-y-4">
              {rateLimitRules.map((rule) => (
                <div key={rule.id} className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Switch checked={rule.enabled} />
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">Endpoint</p>
                      <p className="font-medium text-foreground font-mono">{rule.endpoint}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Method</p>
                      <p className="font-medium text-foreground">{rule.method}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rate Limit</p>
                      <p className="font-medium text-foreground">{rule.requests} req/{rule.window}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className={`font-medium ${rule.enabled ? 'text-green-500' : 'text-gray-500'}`}>
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </AdminLayout>
  )
}
