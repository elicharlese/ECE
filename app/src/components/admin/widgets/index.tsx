'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ComponentType<any>
  color?: 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'orange'
  loading?: boolean
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  color = 'blue',
  loading = false 
}: StatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-monokai-green/20 text-monokai-green'
      case 'yellow': return 'bg-monokai-yellow/20 text-monokai-yellow'
      case 'pink': return 'bg-monokai-pink/20 text-monokai-pink'
      case 'purple': return 'bg-monokai-purple/20 text-monokai-purple'
      case 'orange': return 'bg-monokai-orange/20 text-monokai-orange'
      default: return 'bg-monokai-blue/20 text-monokai-blue'
    }
  }

  const getChangeIcon = () => {
    if (change === undefined || change === 0) return <Minus className="h-4 w-4" />
    return change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />
  }

  const getChangeColor = () => {
    if (change === undefined || change === 0) return 'text-muted-foreground'
    return change > 0 ? 'text-monokai-green' : 'text-monokai-pink'
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30 hover:bg-white/15 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <Icon className="h-6 w-6" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center ${getChangeColor()}`}>
            {getChangeIcon()}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/5 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            <p className="text-sm text-muted-foreground">{title}</p>
            {change !== undefined && (
              <p className={`text-xs font-medium ${getChangeColor()}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}% {changeLabel || 'from last period'}
              </p>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ComponentType<any>
  onClick: () => void
  color?: 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'orange'
  disabled?: boolean
}

export function QuickAction({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  color = 'blue',
  disabled = false 
}: QuickActionProps) {
  const getGradientClasses = (color: string) => {
    switch (color) {
      case 'green': return 'from-monokai-green to-ocean-accent'
      case 'yellow': return 'from-monokai-yellow to-monokai-orange'
      case 'pink': return 'from-monokai-pink to-monokai-orange'
      case 'purple': return 'from-monokai-purple to-monokai-pink'
      case 'orange': return 'from-monokai-orange to-monokai-yellow'
      default: return 'from-monokai-blue to-monokai-purple'
    }
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full p-4 rounded-lg border border-border/30 text-left transition-all
        bg-gradient-to-r ${getGradientClasses(color)} hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        text-white
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-white/60" />
      </div>
    </motion.button>
  )
}

interface ActivityItemProps {
  title: string
  description: string
  timestamp: Date
  type: 'info' | 'success' | 'warning' | 'error'
  icon?: React.ComponentType<any>
}

export function ActivityItem({ 
  title, 
  description, 
  timestamp, 
  type, 
  icon: Icon 
}: ActivityItemProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-monokai-green bg-monokai-green/20'
      case 'warning': return 'text-monokai-yellow bg-monokai-yellow/20'
      case 'error': return 'text-monokai-pink bg-monokai-pink/20'
      default: return 'text-monokai-blue bg-monokai-blue/20'
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
    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-border/20">
      {Icon && (
        <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(timestamp)}</p>
      </div>
    </div>
  )
}

interface SystemStatusProps {
  services: Array<{
    name: string
    status: 'operational' | 'degraded' | 'down'
    responseTime?: number
    uptime?: number
  }>
}

export function SystemStatus({ services }: SystemStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-monokai-green bg-monokai-green'
      case 'degraded': return 'text-monokai-yellow bg-monokai-yellow'
      case 'down': return 'text-monokai-pink bg-monokai-pink'
      default: return 'text-muted-foreground bg-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'operational': return 'Operational'
      case 'degraded': return 'Degraded'
      case 'down': return 'Down'
      default: return 'Unknown'
    }
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
      <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status).split(' ')[1]} animate-pulse`} />
              <span className="font-medium text-foreground">{service.name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {service.responseTime && (
                <span>{service.responseTime}ms</span>
              )}
              {service.uptime && (
                <span>{service.uptime}% uptime</span>
              )}
              <span className={getStatusColor(service.status).split(' ')[0]}>
                {getStatusLabel(service.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
