'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  Crown, 
  Star, 
  DollarSign, 
  Bell, 
  Store,
  TrendingUp,
  Settings,
  Send,
  Shield,
  BarChart3,
  Package,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { SubscriptionBadge } from '@/components/subscription-ui'
import { StatsCard, QuickAction, ActivityItem, SystemStatus } from '@/components/admin/widgets'

interface DashboardData {
  totalUsers: number
  activeSubscriptions: number
  subscriptionStats: {
    free: number
    pro: number
    enterprise: number
  }
  totalRevenue: number
  notifications: number
  marketplaceListings: number
  pendingOrders: number
  activeMarkets: number
  systemAlerts: number
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  href: string
  color: string
  count?: number
}

const quickActions: QuickAction[] = [
  {
    id: 'users',
    title: 'Manage Users',
    description: 'User accounts and subscriptions',
    icon: Users,
    href: '/admin/users',
    color: 'blue'
  },
  {
    id: 'orders',
    title: 'Process Orders',
    description: 'Order fulfillment and tracking',
    icon: Package,
    href: '/admin/orders',
    color: 'green',
    count: 12
  },
  {
    id: 'marketplace',
    title: 'Marketplace Control',
    description: 'Trading and market operations',
    icon: Store,
    href: '/admin/marketplace',
    color: 'purple'
  },
  {
    id: 'analytics',
    title: 'View Analytics',
    description: 'Platform insights and reports',
    icon: BarChart3,
    href: '/admin/analytics',
    color: 'yellow'
  }
]

export default function AdminDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string
    type: 'user' | 'order' | 'marketplace' | 'system'
    message: string
    timestamp: Date
    status: 'success' | 'warning' | 'error'
  }>>([])

  const services = [
    { name: 'API Gateway', status: 'operational' as const, responseTime: 120, uptime: 99.9 },
    { name: 'Database', status: 'operational' as const, responseTime: 45, uptime: 99.8 },
    { name: 'Payment Service', status: 'operational' as const, responseTime: 180, uptime: 99.7 }
  ]
  useEffect(() => {
    fetchDashboardData()
    fetchRecentActivity()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin?action=dashboard', {
        headers: {
          'Authorization': 'Bearer admin_token_demo'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setDashboardData({
          ...data.dashboard,
          pendingOrders: 12,
          activeMarkets: 8,
          systemAlerts: 2
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      // Mock recent activity data
      setRecentActivity([
        {
          id: '1',
          type: 'user',
          message: 'New user registered: john.doe@example.com',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: 'success'
        },
        {
          id: '2',
          type: 'order',
          message: 'Order #1234 completed and delivered',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: 'success'
        },
        {
          id: '3',
          type: 'marketplace',
          message: 'High trading volume detected in Tesla cards',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'warning'
        },
        {
          id: '4',
          type: 'system',
          message: 'Database backup completed successfully',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          status: 'success'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch recent activity:', error)
    } finally {
      setIsLoading(false)
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-ocean-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to ECE Admin
          </h1>
          <p className="text-muted-foreground">
            Complete platform management and control center
          </p>
        </motion.div>

        {/* Stats Grid */}
        {dashboardData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >            <StatsCard 
              title="Total Users" 
              value={dashboardData.totalUsers.toString()} 
              change={12} 
              icon={Users}
            />
            <StatsCard 
              title="Pending Orders" 
              value={dashboardData.pendingOrders.toString()} 
              change={8} 
              icon={Package}
            />
            <StatsCard 
              title="Active Markets" 
              value={dashboardData.activeMarkets.toString()} 
              change={-3} 
              icon={Store}
            />
            <StatsCard 
              title="Monthly Revenue" 
              value={`$${dashboardData.totalRevenue}`} 
              change={15} 
              icon={DollarSign}
            />
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAction 
              title="Manage Users" 
              description="User accounts & permissions" 
              onClick={() => router.push('/admin/users')}
              icon={Users} 
              color="blue" 
            />
            <QuickAction 
              title="Process Orders" 
              description="Order fulfillment & tracking" 
              onClick={() => router.push('/admin/orders')}
              icon={Package} 
              color="green"
            />
            <QuickAction 
              title="Marketplace Control" 
              description="Trading & market operations" 
              onClick={() => router.push('/admin/marketplace')}
              icon={Store} 
              color="purple" 
            />
            <QuickAction 
              title="View Analytics" 
              description="Platform insights & reports" 
              onClick={() => router.push('/admin/analytics')}
              icon={BarChart3} 
              color="yellow" 
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-ocean-accent" />
                  Recent Activity
                </h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    title={activity.message}
                    description={`${activity.type} activity`}
                    type={activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : activity.status === 'error' ? 'error' : 'info'}
                    timestamp={activity.timestamp}
                  />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SystemStatus services={services} />
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
