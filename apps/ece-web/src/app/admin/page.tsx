'use client'

import { useState, useEffect } from 'react'
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
  BarChart3
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { SubscriptionBadge } from '@/components/subscription-ui'

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
}

interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  tier: string
  eceBalance: number
  isVerified: boolean
  role: string
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    status: string
    features: any
  }
  createdAt: string
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    fetchDashboardData()
    fetchUsers()
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
        setDashboardData(data.dashboard)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin?action=users', {
        headers: {
          'Authorization': 'Bearer admin_token_demo'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserSubscription = async (userId: string, plan: 'pro' | 'enterprise') => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin_token_demo'
        },
        body: JSON.stringify({
          action: 'update_subscription',
          userId,
          data: { plan, status: 'active' }
        })
      })
      
      if (response.ok) {
        fetchUsers()
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Failed to update subscription:', error)
    }
  }

  const sendNotification = async (userId: string | 'all', notification: any) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin_token_demo'
        },
        body: JSON.stringify({
          action: 'send_notification',
          userId,
          data: { notification }
        })
      })
      
      if (response.ok) {
        alert('Notification sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-ocean-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-monokai-purple" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">ECE Admin</h1>
                <p className="text-sm text-muted-foreground">Platform Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@ece.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-monokai-purple to-monokai-blue rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1 max-w-md">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-ocean text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-ocean-accent/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-ocean-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{dashboardData.totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-monokai-pink/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-monokai-pink" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{dashboardData.activeSubscriptions}</p>
                    <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-monokai-green/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-monokai-green" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">${dashboardData.totalRevenue}</p>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-monokai-blue/20 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-monokai-blue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{dashboardData.marketplaceListings}</p>
                    <p className="text-sm text-muted-foreground">Marketplace Items</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Subscription Breakdown */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Subscription Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-muted-foreground">{dashboardData.subscriptionStats.free}</p>
                  <p className="text-sm text-muted-foreground">Free Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-monokai-pink">{dashboardData.subscriptionStats.pro}</p>
                  <p className="text-sm text-muted-foreground">Pro Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-monokai-purple">{dashboardData.subscriptionStats.enterprise}</p>
                  <p className="text-sm text-muted-foreground">Enterprise Users</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">User Management</h2>
              <div className="text-sm text-muted-foreground">{users.length} total users</div>
            </div>

            <div className="grid gap-4">
              {users.map((user) => (
                <GlassCard key={user.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-tide rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-foreground">{user.firstName} {user.lastName}</h3>
                          <SubscriptionBadge plan={user.subscription.plan} />
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username} • {user.email}</p>
                        <p className="text-xs text-muted-foreground">Balance: {user.eceBalance} ECE</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateUserSubscription(user.id, 'pro')}
                        disabled={user.subscription.plan === 'pro' || user.subscription.plan === 'enterprise'}
                      >
                        Upgrade to Pro
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateUserSubscription(user.id, 'enterprise')}
                        disabled={user.subscription.plan === 'enterprise'}
                      >
                        Upgrade to Enterprise
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-foreground">Send Notifications</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="font-semibold text-foreground mb-4">IPO Alert (Pro/Enterprise)</h3>
                <Button
                  onClick={() => sendNotification('all', {
                    type: 'ipo',
                    title: 'New IPO Available!',
                    message: 'Tesla Cybertruck card is now available for early access trading.',
                    requiresSubscription: 'pro',
                    priority: 'high'
                  })}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send IPO Alert
                </Button>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Enterprise Support (Enterprise)</h3>
                <Button
                  onClick={() => sendNotification('all', {
                    type: 'system',
                    title: '24/7 Support Available',
                    message: 'Your dedicated account manager is now available for immediate assistance.',
                    requiresSubscription: 'enterprise',
                    priority: 'medium'
                  })}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Support Notice
                </Button>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
