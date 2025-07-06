'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { SystemStatus } from '@/components/admin/widgets'

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  lastUpdated: Date
  threshold: {
    warning: number
    critical: number
  }
}

interface DatabaseMetrics {
  connectionPool: number
  activeConnections: number
  slowQueries: number
  indexEfficiency: number
  storageUsed: number
  backupStatus: 'success' | 'pending' | 'failed'
  lastBackup: Date
}

interface APIMetrics {
  requestsPerMinute: number
  averageResponseTime: number
  errorRate: number
  activeEndpoints: number
  rateLimitHits: number
  peakLoad: number
}

const mockSystemMetrics: SystemMetric[] = [
  {
    id: 'cpu',
    name: 'CPU Usage',
    value: 45,
    unit: '%',
    status: 'healthy',
    trend: 'stable',
    lastUpdated: new Date(),
    threshold: { warning: 70, critical: 90 }
  },
  {
    id: 'memory',
    name: 'Memory Usage',
    value: 68,
    unit: '%',
    status: 'warning',
    trend: 'up',
    lastUpdated: new Date(),
    threshold: { warning: 75, critical: 90 }
  },
  {
    id: 'disk',
    name: 'Disk Usage',
    value: 42,
    unit: '%',
    status: 'healthy',
    trend: 'stable',
    lastUpdated: new Date(),
    threshold: { warning: 80, critical: 95 }
  },
  {
    id: 'network',
    name: 'Network I/O',
    value: 156,
    unit: 'MB/s',
    status: 'healthy',
    trend: 'down',
    lastUpdated: new Date(),
    threshold: { warning: 500, critical: 800 }
  }
]

const mockDatabaseMetrics: DatabaseMetrics = {
  connectionPool: 95,
  activeConnections: 23,
  slowQueries: 2,
  indexEfficiency: 98.5,
  storageUsed: 2.4,
  backupStatus: 'success',
  lastBackup: new Date(Date.now() - 3600000) // 1 hour ago
}

const mockAPIMetrics: APIMetrics = {
  requestsPerMinute: 1250,
  averageResponseTime: 145,
  errorRate: 0.8,
  activeEndpoints: 47,
  rateLimitHits: 12,
  peakLoad: 2100
}

export default function SystemMonitoringPage() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>(mockSystemMetrics)
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetrics>(mockDatabaseMetrics)
  const [apiMetrics, setApiMetrics] = useState<APIMetrics>(mockAPIMetrics)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const services = [
    { name: 'API Gateway', status: 'operational' as const, responseTime: 120, uptime: 99.9 },
    { name: 'Database', status: 'operational' as const, responseTime: 45, uptime: 99.8 },
    { name: 'File Storage', status: 'degraded' as const, responseTime: 250, uptime: 98.5 },
    { name: 'Payment Service', status: 'operational' as const, responseTime: 180, uptime: 99.7 }
  ]

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshMetrics()
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const refreshMetrics = async () => {
    setIsRefreshing(true)
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update metrics with slight variations
      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 10),
        lastUpdated: new Date()
      })))
      
      setDatabaseMetrics(prev => ({
        ...prev,
        activeConnections: Math.max(1, prev.activeConnections + Math.floor((Math.random() - 0.5) * 10)),
        slowQueries: Math.max(0, prev.slowQueries + Math.floor((Math.random() - 0.5) * 3))
      }))
      
      setApiMetrics(prev => ({
        ...prev,
        requestsPerMinute: Math.max(100, prev.requestsPerMinute + Math.floor((Math.random() - 0.5) * 200)),
        averageResponseTime: Math.max(50, prev.averageResponseTime + Math.floor((Math.random() - 0.5) * 50))
      }))
    } catch (error) {
      console.error('Failed to refresh metrics:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle
      case 'warning': return AlertTriangle
      case 'critical': return AlertTriangle
      default: return Clock
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp
      case 'down': return TrendingDown
      default: return Activity
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Activity className="w-8 h-8 mr-3 text-blue-500" />
              System Monitoring
            </h1>
            <p className="text-muted-foreground">Real-time system health and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-green-500/20 text-green-500' : ''}
            >
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </Button>
            <Button
              onClick={refreshMetrics}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <SystemStatus services={services} />

        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric) => {
            const StatusIcon = getStatusIcon(metric.status)
            const TrendIcon = getTrendIcon(metric.trend)
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {metric.id === 'cpu' && <Cpu className="w-5 h-5 text-blue-500" />}
                      {metric.id === 'memory' && <MemoryStick className="w-5 h-5 text-purple-500" />}
                      {metric.id === 'disk' && <HardDrive className="w-5 h-5 text-green-500" />}
                      {metric.id === 'network' && <Wifi className="w-5 h-5 text-orange-500" />}
                      <h3 className="font-medium text-foreground">{metric.name}</h3>
                    </div>
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(metric.status)}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-foreground">
                        {metric.value.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                      <TrendIcon className={`w-4 h-4 ml-auto ${
                        metric.trend === 'up' ? 'text-red-500' : 
                        metric.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                      }`} />
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          metric.status === 'healthy' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (metric.value / metric.threshold.critical) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Updated {formatTimeAgo(metric.lastUpdated)}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Database Metrics */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-500" />
              Database Performance
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Connection Pool</p>
                  <p className="text-lg font-semibold text-foreground">
                    {databaseMetrics.connectionPool}%
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Active Connections</p>
                  <p className="text-lg font-semibold text-foreground">
                    {databaseMetrics.activeConnections}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Slow Queries</p>
                  <p className="text-lg font-semibold text-foreground">
                    {databaseMetrics.slowQueries}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Index Efficiency</p>
                  <p className="text-lg font-semibold text-foreground">
                    {databaseMetrics.indexEfficiency}%
                  </p>
                </div>
              </div>
              
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Backup</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      databaseMetrics.backupStatus === 'success' ? 'bg-green-500' :
                      databaseMetrics.backupStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-foreground">
                      {formatTimeAgo(databaseMetrics.lastBackup)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* API Metrics */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Server className="w-6 h-6 mr-2 text-green-500" />
              API Performance
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Requests/Min</p>
                  <p className="text-lg font-semibold text-foreground">
                    {apiMetrics.requestsPerMinute.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-lg font-semibold text-foreground">
                    {apiMetrics.averageResponseTime}ms
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <p className="text-lg font-semibold text-foreground">
                    {apiMetrics.errorRate}%
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Active Endpoints</p>
                  <p className="text-lg font-semibold text-foreground">
                    {apiMetrics.activeEndpoints}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rate Limit Hits</span>
                  <span className="text-sm text-foreground">{apiMetrics.rateLimitHits}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Peak Load Today</span>
                  <span className="text-sm text-foreground">{apiMetrics.peakLoad}/min</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <Database className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="font-medium">Force Backup</p>
                <p className="text-xs text-muted-foreground">Create database backup</p>
              </div>
            </Button>
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <Activity className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="font-medium">Clear Cache</p>
                <p className="text-xs text-muted-foreground">Reset system cache</p>
              </div>
            </Button>
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <Server className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="font-medium">Restart Services</p>
                <p className="text-xs text-muted-foreground">Restart API services</p>
              </div>
            </Button>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}
