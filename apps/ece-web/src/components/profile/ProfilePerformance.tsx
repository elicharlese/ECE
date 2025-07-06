'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Gauge,
  Monitor,
  Smartphone,
  Globe,
  Eye,
  Users,
  Heart,
  Star,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Wifi,
  WifiOff,
  Database,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Shield,
  Lock,
  Unlock
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  target: number
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  change: number
  description: string
  icon: React.ComponentType<any>
  color: string
}

interface SystemHealth {
  overall: number
  components: {
    frontend: number
    backend: number
    database: number
    cdn: number
    security: number
  }
  uptime: number
  lastIncident: Date | null
}

interface UserExperience {
  loadTime: number
  interactionToNextPaint: number
  cumulativeLayoutShift: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  timeToInteractive: number
  bounceRate: number
  sessionDuration: number
}

interface DevicePerformance {
  desktop: {
    loadTime: number
    performance: number
    users: number
  }
  mobile: {
    loadTime: number
    performance: number
    users: number
  }
  tablet: {
    loadTime: number
    performance: number
    users: number
  }
}

interface ProfilePerformanceProps {
  className?: string
}

export function ProfilePerformance({ className = '' }: ProfilePerformanceProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('24h')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const [systemHealth] = useState<SystemHealth>({
    overall: 98.5,
    components: {
      frontend: 99.2,
      backend: 98.1,
      database: 97.8,
      cdn: 99.5,
      security: 98.9
    },
    uptime: 99.97,
    lastIncident: null
  })

  const [userExperience] = useState<UserExperience>({
    loadTime: 1.2,
    interactionToNextPaint: 89,
    cumulativeLayoutShift: 0.05,
    firstContentfulPaint: 0.8,
    largestContentfulPaint: 1.1,
    timeToInteractive: 1.5,
    bounceRate: 23.4,
    sessionDuration: 342
  })

  const [devicePerformance] = useState<DevicePerformance>({
    desktop: {
      loadTime: 0.9,
      performance: 95,
      users: 1247
    },
    mobile: {
      loadTime: 1.6,
      performance: 87,
      users: 892
    },
    tablet: {
      loadTime: 1.3,
      performance: 91,
      users: 234
    }
  })

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: 'load-time',
      name: 'Page Load Time',
      value: userExperience.loadTime,
      unit: 's',
      target: 2.0,
      status: userExperience.loadTime <= 1.5 ? 'good' : userExperience.loadTime <= 2.5 ? 'warning' : 'critical',
      trend: 'down',
      change: -12.5,
      description: 'Average time to fully load profile pages',
      icon: Clock,
      color: '#66D9EF'
    },
    {
      id: 'performance-score',
      name: 'Performance Score',
      value: 92,
      unit: '/100',
      target: 90,
      status: 'good',
      trend: 'up',
      change: 5.2,
      description: 'Overall performance rating based on Core Web Vitals',
      icon: Gauge,
      color: '#A6E22E'
    },
    {
      id: 'interaction-time',
      name: 'Interaction Time',
      value: userExperience.interactionToNextPaint,
      unit: 'ms',
      target: 100,
      status: userExperience.interactionToNextPaint <= 100 ? 'good' : userExperience.interactionToNextPaint <= 200 ? 'warning' : 'critical',
      trend: 'stable',
      change: 1.2,
      description: 'Time from user interaction to visual feedback',
      icon: Zap,
      color: '#E6DB74'
    },
    {
      id: 'uptime',
      name: 'System Uptime',
      value: systemHealth.uptime,
      unit: '%',
      target: 99.9,
      status: systemHealth.uptime >= 99.5 ? 'good' : systemHealth.uptime >= 99.0 ? 'warning' : 'critical',
      trend: 'stable',
      change: 0.1,
      description: 'System availability over the selected time period',
      icon: Activity,
      color: '#819AFF'
    },
    {
      id: 'bounce-rate',
      name: 'Bounce Rate',
      value: userExperience.bounceRate,
      unit: '%',
      target: 30,
      status: userExperience.bounceRate <= 30 ? 'good' : userExperience.bounceRate <= 50 ? 'warning' : 'critical',
      trend: 'down',
      change: -8.3,
      description: 'Percentage of single-page sessions',
      icon: TrendingDown,
      color: '#F92672'
    },
    {
      id: 'security-score',
      name: 'Security Score',
      value: systemHealth.components.security,
      unit: '/100',
      target: 95,
      status: 'good',
      trend: 'up',
      change: 2.1,
      description: 'Overall security posture and compliance',
      icon: Shield,
      color: '#3EBA7C'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Gauge },
    { id: 'user-experience', label: 'User Experience', icon: Users },
    { id: 'system-health', label: 'System Health', icon: Activity },
    { id: 'devices', label: 'Device Analytics', icon: Monitor }
  ]

  const timeRanges = [
    { id: '1h', label: '1 Hour' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' }
  ]

  const refreshMetrics = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#A6E22E'
      case 'warning': return '#E6DB74'
      case 'critical': return '#F92672'
      default: return '#75715E'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp
      case 'down': return ArrowDown
      case 'stable': return Minus
      default: return Minus
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getCoreWebVitalsScore = () => {
    let score = 0
    
    // First Contentful Paint (0.8s is good, 1.8s is needs improvement, 3.0s+ is poor)
    if (userExperience.firstContentfulPaint <= 1.8) score += 25
    else if (userExperience.firstContentfulPaint <= 3.0) score += 10
    
    // Largest Contentful Paint (2.5s is good, 4.0s is needs improvement, 4.0s+ is poor)
    if (userExperience.largestContentfulPaint <= 2.5) score += 25
    else if (userExperience.largestContentfulPaint <= 4.0) score += 10
    
    // Interaction to Next Paint (200ms is good, 500ms is needs improvement, 500ms+ is poor)
    if (userExperience.interactionToNextPaint <= 200) score += 25
    else if (userExperience.interactionToNextPaint <= 500) score += 10
    
    // Cumulative Layout Shift (0.1 is good, 0.25 is needs improvement, 0.25+ is poor)
    if (userExperience.cumulativeLayoutShift <= 0.1) score += 25
    else if (userExperience.cumulativeLayoutShift <= 0.25) score += 10
    
    return score
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#A6E22E]/20 to-[#66D9EF]/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#A6E22E]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#F8EFD6]">Performance Monitoring</h2>
                <p className="text-[#75715E]">Real-time profile performance and system health metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {timeRanges.map((range) => (
                  <Button
                    key={range.id}
                    variant={timeRange === range.id ? 'accent' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeRange(range.id)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshMetrics}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#272822"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#A6E22E"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - systemHealth.overall / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#A6E22E]">{systemHealth.overall}%</span>
                </div>
              </div>
              <div className="text-sm text-[#F8EFD6] font-medium">Overall Health</div>
            </div>

            {Object.entries(systemHealth.components).map(([component, value]) => (
              <div key={component} className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  value >= 99 ? 'bg-[#A6E22E]' : value >= 95 ? 'bg-[#E6DB74]' : 'bg-[#F92672]'
                }`} />
                <div className="text-sm font-bold text-[#F8EFD6]">{value}%</div>
                <div className="text-xs text-[#75715E] capitalize">{component}</div>
              </div>
            ))}
          </div>

          <div className="text-xs text-[#75715E] mt-4 flex items-center justify-between">
            <span>Last updated: {lastUpdate.toLocaleString()}</span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-[#A6E22E]" />
              <span>All systems operational</span>
            </span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric) => {
            const IconComponent = metric.icon
            const TrendIcon = getTrendIcon(metric.trend)
            
            return (
              <GlassCard key={metric.id} variant="dark" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: metric.color }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#F8EFD6]">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="text-sm text-[#F8EFD6]">{metric.name}</div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 ${
                    metric.trend === 'up' && metric.change > 0 ? 'text-[#A6E22E]' :
                    metric.trend === 'down' && metric.change < 0 ? 'text-[#A6E22E]' :
                    metric.trend === 'up' && metric.change < 0 ? 'text-[#F92672]' :
                    metric.trend === 'down' && metric.change > 0 ? 'text-[#F92672]' :
                    'text-[#75715E]'
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#75715E]">Target: {metric.target}{metric.unit}</span>
                  <Badge 
                    variant={metric.status === 'good' ? 'outline' : 'destructive'}
                    className={`text-xs ${
                      metric.status === 'good' ? 'text-[#A6E22E] border-[#A6E22E]/30' :
                      metric.status === 'warning' ? 'text-[#E6DB74] border-[#E6DB74]/30' :
                      'text-[#F92672] border-[#F92672]/30'
                    }`}
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
                
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-1 mb-2"
                />
                
                <p className="text-xs text-[#75715E]">{metric.description}</p>
              </GlassCard>
            )
          })}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard variant="dark" className="p-2">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 text-[#F8EFD6] border border-[#A6E22E]/30'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#A6E22E]' : ''}`} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Chart */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Performance Timeline</h3>
                <div className="h-64 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 rounded-lg flex items-center justify-center border border-[#75715E]/30">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 text-[#66D9EF] mx-auto mb-4" />
                    <span className="text-[#F8EFD6] text-lg">Performance Chart</span>
                    <div className="text-sm text-[#75715E] mt-2">
                      Real-time performance metrics over time
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Performance Insights</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-[#A6E22E]/10 border border-[#A6E22E]/30 rounded-lg">
                      <div className="text-[#A6E22E] font-medium mb-1">Excellent Load Times</div>
                      <div className="text-sm text-[#75715E]">Your profile loads 40% faster than average</div>
                    </div>
                    <div className="p-3 bg-[#66D9EF]/10 border border-[#66D9EF]/30 rounded-lg">
                      <div className="text-[#66D9EF] font-medium mb-1">High Uptime</div>
                      <div className="text-sm text-[#75715E]">99.97% uptime over the last 30 days</div>
                    </div>
                    <div className="p-3 bg-[#E6DB74]/10 border border-[#E6DB74]/30 rounded-lg">
                      <div className="text-[#E6DB74] font-medium mb-1">Mobile Optimization</div>
                      <div className="text-sm text-[#75715E]">Consider optimizing for mobile performance</div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">System Resources</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6] flex items-center space-x-2">
                          <Cpu className="w-4 h-4" />
                          <span>CPU Usage</span>
                        </span>
                        <span className="text-[#66D9EF] font-bold">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6] flex items-center space-x-2">
                          <MemoryStick className="w-4 h-4" />
                          <span>Memory</span>
                        </span>
                        <span className="text-[#A6E22E] font-bold">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6] flex items-center space-x-2">
                          <HardDrive className="w-4 h-4" />
                          <span>Storage</span>
                        </span>
                        <span className="text-[#E6DB74] font-bold">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6] flex items-center space-x-2">
                          <Network className="w-4 h-4" />
                          <span>Network</span>
                        </span>
                        <span className="text-[#819AFF] font-bold">12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Core Web Vitals */}
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6]">Core Web Vitals</h3>
                  <Badge 
                    variant="outline" 
                    className={`${
                      getCoreWebVitalsScore() >= 75 ? 'text-[#A6E22E] border-[#A6E22E]/30' :
                      getCoreWebVitalsScore() >= 50 ? 'text-[#E6DB74] border-[#E6DB74]/30' :
                      'text-[#F92672] border-[#F92672]/30'
                    }`}
                  >
                    Score: {getCoreWebVitalsScore()}/100
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                    <Clock className="w-8 h-8 text-[#66D9EF] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-[#66D9EF] mb-1">
                      {userExperience.firstContentfulPaint}s
                    </div>
                    <div className="text-sm text-[#F8EFD6] mb-1">First Contentful Paint</div>
                    <div className="text-xs text-[#75715E]">Target: ≤1.8s</div>
                  </div>
                  
                  <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                    <Eye className="w-8 h-8 text-[#A6E22E] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-[#A6E22E] mb-1">
                      {userExperience.largestContentfulPaint}s
                    </div>
                    <div className="text-sm text-[#F8EFD6] mb-1">Largest Contentful Paint</div>
                    <div className="text-xs text-[#75715E]">Target: ≤2.5s</div>
                  </div>
                  
                  <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                    <Zap className="w-8 h-8 text-[#E6DB74] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-[#E6DB74] mb-1">
                      {userExperience.interactionToNextPaint}ms
                    </div>
                    <div className="text-sm text-[#F8EFD6] mb-1">Interaction to Next Paint</div>
                    <div className="text-xs text-[#75715E]">Target: ≤200ms</div>
                  </div>
                  
                  <div className="text-center p-4 bg-[#272822]/30 rounded-lg">
                    <Target className="w-8 h-8 text-[#819AFF] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-[#819AFF] mb-1">
                      {userExperience.cumulativeLayoutShift}
                    </div>
                    <div className="text-sm text-[#F8EFD6] mb-1">Cumulative Layout Shift</div>
                    <div className="text-xs text-[#75715E]">Target: ≤0.1</div>
                  </div>
                </div>
              </GlassCard>

              {/* Performance Trends */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Performance Trends</h3>
                <div className="h-64 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 rounded-lg flex items-center justify-center border border-[#75715E]/30">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-[#A6E22E] mx-auto mb-4" />
                    <span className="text-[#F8EFD6] text-lg">Performance Trend Analysis</span>
                    <div className="text-sm text-[#75715E] mt-2">
                      Historical performance data and projections
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* User Experience Tab */}
          {activeTab === 'user-experience' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Metrics */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">User Experience Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F8EFD6]">Average Session Duration</span>
                      <span className="text-[#A6E22E] font-bold">
                        {formatDuration(userExperience.sessionDuration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[#F8EFD6]">Bounce Rate</span>
                      <span className="text-[#F92672] font-bold">{userExperience.bounceRate}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[#F8EFD6]">Time to Interactive</span>
                      <span className="text-[#66D9EF] font-bold">{userExperience.timeToInteractive}s</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[#F8EFD6]">Page Load Time</span>
                      <span className="text-[#E6DB74] font-bold">{userExperience.loadTime}s</span>
                    </div>
                  </div>
                </GlassCard>

                {/* User Satisfaction */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">User Satisfaction</h3>
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          stroke="#272822"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          stroke="#A6E22E"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          strokeDashoffset={`${2 * Math.PI * 35 * (1 - 0.87)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-[#A6E22E]">87%</span>
                      </div>
                    </div>
                    <div className="text-[#F8EFD6] font-medium mb-2">Satisfaction Score</div>
                    <div className="text-sm text-[#75715E]">Based on performance metrics and user feedback</div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* System Health Tab */}
          {activeTab === 'system-health' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(systemHealth.components).map(([component, value]) => (
                  <GlassCard key={component} variant="dark" className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          stroke="#272822"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          stroke={value >= 99 ? '#A6E22E' : value >= 95 ? '#E6DB74' : '#F92672'}
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 30}`}
                          strokeDashoffset={`${2 * Math.PI * 30 * (1 - value / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#F8EFD6]">{value}%</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-[#F8EFD6] mb-2 capitalize">{component}</div>
                    <Badge 
                      variant="outline"
                      className={`${
                        value >= 99 ? 'text-[#A6E22E] border-[#A6E22E]/30' :
                        value >= 95 ? 'text-[#E6DB74] border-[#E6DB74]/30' :
                        'text-[#F92672] border-[#F92672]/30'
                      }`}
                    >
                      {value >= 99 ? 'Excellent' : value >= 95 ? 'Good' : 'Needs Attention'}
                    </Badge>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Device Analytics Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(devicePerformance).map(([device, data]) => (
                  <GlassCard key={device} variant="dark" className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {device === 'desktop' ? (
                        <Monitor className="w-8 h-8 text-[#66D9EF]" />
                      ) : device === 'mobile' ? (
                        <Smartphone className="w-8 h-8 text-[#A6E22E]" />
                      ) : (
                        <Monitor className="w-8 h-8 text-[#E6DB74]" />
                      )}
                      <div>
                        <div className="text-lg font-bold text-[#F8EFD6] capitalize">{device}</div>
                        <div className="text-sm text-[#75715E]">{data.users.toLocaleString()} users</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#F8EFD6]">Load Time</span>
                        <span className="text-[#66D9EF] font-bold">{data.loadTime}s</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-[#F8EFD6]">Performance Score</span>
                          <span className="text-[#A6E22E] font-bold">{data.performance}/100</span>
                        </div>
                        <Progress value={data.performance} className="h-2" />
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
