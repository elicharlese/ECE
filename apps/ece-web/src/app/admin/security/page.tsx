'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserX,
  Activity,
  MapPin,
  Calendar,
  Clock,
  Smartphone,
  Monitor,
  Globe,
  Key,
  RefreshCw,
  Download,
  Filter,
  Search,
  Ban,
  Flag,
  Zap,
  Database,
  Server,
  Wifi,
  CreditCard
} from 'lucide-react'

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'suspicious_activity' | 'data_breach' | 'failed_payment' | 'account_takeover' | 'bot_detection'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'investigating' | 'resolved' | 'false_positive'
  timestamp: Date
  user: {
    id: string
    username: string
    email: string
  }
  details: {
    ip: string
    location: string
    device: string
    userAgent: string
    description: string
  }
  actions: string[]
}

interface SecurityMetric {
  id: string
  name: string
  value: number
  change: number
  status: 'good' | 'warning' | 'danger'
  icon: React.ComponentType<any>
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'suspicious_activity',
    severity: 'high',
    status: 'investigating',
    timestamp: new Date('2025-07-05T14:30:00'),
    user: {
      id: 'user_123',
      username: 'suspicious_trader',
      email: 'trader@example.com'
    },
    details: {
      ip: '192.168.1.100',
      location: 'Unknown Location',
      device: 'Desktop',
      userAgent: 'Mozilla/5.0...',
      description: 'Multiple rapid trades with unusual patterns detected'
    },
    actions: ['Account flagged', 'Trades suspended']
  },
  {
    id: '2',
    type: 'login_attempt',
    severity: 'medium',
    status: 'resolved',
    timestamp: new Date('2025-07-05T13:15:00'),
    user: {
      id: 'user_456',
      username: 'regular_user',
      email: 'user@example.com'
    },
    details: {
      ip: '10.0.0.5',
      location: 'New York, US',
      device: 'Mobile',
      userAgent: 'Mobile Safari...',
      description: '5 failed login attempts within 10 minutes'
    },
    actions: ['Account temporarily locked', 'Password reset required']
  },
  {
    id: '3',
    type: 'bot_detection',
    severity: 'low',
    status: 'resolved',
    timestamp: new Date('2025-07-05T12:00:00'),
    user: {
      id: 'user_789',
      username: 'automated_user',
      email: 'bot@example.com'
    },
    details: {
      ip: '203.0.113.0',
      location: 'Singapore',
      device: 'Unknown',
      userAgent: 'Python requests...',
      description: 'Automated behavior detected in API calls'
    },
    actions: ['API access limited', 'CAPTCHA required']
  }
]

const securityMetrics: SecurityMetric[] = [
  {
    id: 'threat_level',
    name: 'Threat Level',
    value: 85,
    change: -5,
    status: 'good',
    icon: Shield
  },
  {
    id: 'failed_logins',
    name: 'Failed Logins',
    value: 42,
    change: 12,
    status: 'warning',
    icon: Lock
  },
  {
    id: 'blocked_ips',
    name: 'Blocked IPs',
    value: 156,
    change: 8,
    status: 'good',
    icon: Ban
  },
  {
    id: 'active_alerts',
    name: 'Active Alerts',
    value: 7,
    change: -3,
    status: 'warning',
    icon: AlertTriangle
  },
  {
    id: 'security_score',
    name: 'Security Score',
    value: 92,
    change: 2,
    status: 'good',
    icon: CheckCircle
  }
]

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'high': return 'text-[#FD5C63] bg-[#FD5C63]/20 border-[#FD5C63]/30'
      case 'medium': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'low': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'investigating': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'active': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'false_positive': return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return Lock
      case 'suspicious_activity': return AlertTriangle
      case 'data_breach': return Database
      case 'failed_payment': return CreditCard
      case 'account_takeover': return UserX
      case 'bot_detection': return Zap
      default: return Shield
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

  const handleEventAction = async (eventId: string, action: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          switch (action) {
            case 'resolve':
              return { ...event, status: 'resolved' as const }
            case 'investigate':
              return { ...event, status: 'investigating' as const }
            case 'false_positive':
              return { ...event, status: 'false_positive' as const }
            default:
              return event
          }
        }
        return event
      }))
    } catch (error) {
      console.error('Error handling security event:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.details.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    
    return matchesSearch && matchesSeverity && matchesStatus
  })

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
              Security & Compliance
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor threats, manage security policies, and ensure platform safety
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-border/30 text-muted-foreground hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button className="bg-gradient-to-r from-monokai-pink to-monokai-orange hover:from-monokai-pink/80 hover:to-monokai-orange/80 text-white">
              <Download className="h-4 w-4 mr-2" />
              Security Report
            </Button>
          </div>
        </motion.div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {securityMetrics.map((metric) => (
            <Card key={metric.id} className="p-4 bg-white/10 backdrop-blur-xl border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  metric.status === 'good' ? 'bg-monokai-green/20' :
                  metric.status === 'warning' ? 'bg-monokai-yellow/20' :
                  'bg-monokai-pink/20'
                }`}>
                  <metric.icon className={`h-5 w-5 ${
                    metric.status === 'good' ? 'text-monokai-green' :
                    metric.status === 'warning' ? 'text-monokai-yellow' :
                    'text-monokai-pink'
                  }`} />
                </div>
                <div className={`text-xs font-medium ${
                  metric.change >= 0 ? 'text-monokai-green' : 'text-monokai-pink'
                }`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{metric.value}</h3>
              <p className="text-sm text-muted-foreground">{metric.name}</p>
            </Card>
          ))}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-border/30 mb-8">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-pink data-[state=active]:to-monokai-orange data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-orange data-[state=active]:to-monokai-yellow data-[state=active]:text-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Security Events
            </TabsTrigger>
            <TabsTrigger 
              value="access"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-blue data-[state=active]:to-monokai-purple data-[state=active]:text-white"
            >
              <Lock className="h-4 w-4 mr-2" />
              Access Control
            </TabsTrigger>
            <TabsTrigger 
              value="audit"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-green data-[state=active]:to-ocean-accent data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger 
              value="policies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-purple data-[state=active]:to-monokai-pink data-[state=active]:text-white"
            >
              <Key className="h-4 w-4 mr-2" />
              Policies
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
                {/* Real-time Threat Monitor */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-monokai-green" />
                    Real-time Threat Monitor
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-border/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">System Status</span>
                        <div className="w-3 h-3 bg-monokai-green rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xl font-bold text-monokai-green">Secure</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-lg border border-border/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Active Threats</span>
                        <AlertTriangle className="h-4 w-4 text-monokai-yellow" />
                      </div>
                      <p className="text-xl font-bold text-foreground">3</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-lg border border-border/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Last Scan</span>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xl font-bold text-foreground">2m ago</p>
                    </div>
                  </div>
                </Card>

                {/* Recent Security Events */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-monokai-blue" />
                    Recent Security Events
                  </h3>
                  
                  <div className="space-y-3">
                    {events.slice(0, 5).map((event) => {
                      const TypeIcon = getTypeIcon(event.type)
                      return (
                        <div key={event.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-border/20">
                          <div className={`p-2 rounded-lg ${
                            event.severity === 'high' ? 'bg-monokai-pink/20' :
                            event.severity === 'medium' ? 'bg-monokai-yellow/20' :
                            'bg-monokai-green/20'
                          }`}>
                            <TypeIcon className={`h-4 w-4 ${
                              event.severity === 'high' ? 'text-monokai-pink' :
                              event.severity === 'medium' ? 'text-monokai-yellow' :
                              'text-monokai-green'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">{event.user.username}</p>
                              <Badge className={getSeverityColor(event.severity)}>
                                {event.severity}
                              </Badge>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.details.description}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{formatTimeAgo(event.timestamp)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <motion.div
                key="events"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Filters */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search security events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-border/30 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-border/30 rounded-lg text-foreground"
                      >
                        <option value="all">All Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-border/30 rounded-lg text-foreground"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                        <option value="false_positive">False Positive</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Events List */}
                <Card className="bg-white/10 backdrop-blur-xl border border-border/30">
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredEvents.map((event) => {
                        const TypeIcon = getTypeIcon(event.type)
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-white/5 rounded-lg border border-border/20"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${
                                  event.severity === 'critical' ? 'bg-monokai-pink/20' :
                                  event.severity === 'high' ? 'bg-monokai-orange/20' :
                                  event.severity === 'medium' ? 'bg-monokai-yellow/20' :
                                  'bg-monokai-green/20'
                                }`}>
                                  <TypeIcon className={`h-6 w-6 ${
                                    event.severity === 'critical' ? 'text-monokai-pink' :
                                    event.severity === 'high' ? 'text-monokai-orange' :
                                    event.severity === 'medium' ? 'text-monokai-yellow' :
                                    'text-monokai-green'
                                  }`} />
                                </div>
                                
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h3>
                                    <Badge className={getSeverityColor(event.severity)}>
                                      {event.severity}
                                    </Badge>
                                    <Badge className={getStatusColor(event.status)}>
                                      {event.status}
                                    </Badge>
                                  </div>
                                  <p className="text-muted-foreground mb-2">{event.details.description}</p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>User: {event.user.username}</span>
                                    <span>IP: {event.details.ip}</span>
                                    <span>Location: {event.details.location}</span>
                                    <span>{formatTimeAgo(event.timestamp)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {event.status !== 'resolved' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleEventAction(event.id, 'resolve')}
                                      className="bg-gradient-to-r from-monokai-green to-ocean-accent hover:from-monokai-green/80 hover:to-ocean-accent/80 text-white"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Resolve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEventAction(event.id, 'investigate')}
                                      className="border-border/30 text-muted-foreground hover:bg-white/10"
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      Investigate
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {event.actions.length > 0 && (
                              <div className="pt-4 border-t border-border/20">
                                <p className="text-sm text-muted-foreground mb-2">Actions taken:</p>
                                <div className="flex flex-wrap gap-2">
                                  {event.actions.map((action, index) => (
                                    <Badge key={index} className="text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>

                    {filteredEvents.length === 0 && (
                      <div className="text-center py-12">
                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No security events found</h3>
                        <p className="text-muted-foreground">
                          {searchTerm ? 'Try adjusting your search terms' : 'No events match the current filters'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Additional tabs would be implemented similarly */}
            <TabsContent value="access" className="mt-0">
              <motion.div
                key="access"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Access Control Management</h3>
                  <p className="text-muted-foreground">Access control features coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <motion.div
                key="audit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Audit Logs</h3>
                  <p className="text-muted-foreground">Audit log viewer coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="policies" className="mt-0">
              <motion.div
                key="policies"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Security Policies</h3>
                  <p className="text-muted-foreground">Security policy management coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
