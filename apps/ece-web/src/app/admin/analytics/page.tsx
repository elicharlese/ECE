'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  ShoppingCart,
  Zap,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    revenueChange: number
    totalUsers: number
    userGrowth: number
    activeUsers: number
    activeUserChange: number
    conversionRate: number
    conversionChange: number
  }
  revenue: {
    daily: Array<{ date: string; amount: number }>
    monthly: Array<{ month: string; amount: number }>
    sources: Array<{ source: string; amount: number; percentage: number }>
  }
  users: {
    registrations: Array<{ date: string; count: number }>
    retention: Array<{ period: string; rate: number }>
    demographics: Array<{ segment: string; count: number; percentage: number }>
  }
  marketplace: {
    transactions: Array<{ date: string; count: number; volume: number }>
    topCategories: Array<{ category: string; volume: number; change: number }>
    popularCards: Array<{ cardName: string; sales: number; revenue: number }>
  }
  engagement: {
    pageViews: Array<{ page: string; views: number; change: number }>
    sessionDuration: Array<{ date: string; duration: number }>
    bounceRate: Array<{ date: string; rate: number }>
  }
}

const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalRevenue: 125400,
    revenueChange: 12.5,
    totalUsers: 15420,
    userGrowth: 8.3,
    activeUsers: 8950,
    activeUserChange: 5.7,
    conversionRate: 3.2,
    conversionChange: -1.2
  },
  revenue: {
    daily: [
      { date: '2025-06-29', amount: 2400 },
      { date: '2025-06-30', amount: 2800 },
      { date: '2025-07-01', amount: 3200 },
      { date: '2025-07-02', amount: 2900 },
      { date: '2025-07-03', amount: 3500 },
      { date: '2025-07-04', amount: 4100 },
      { date: '2025-07-05', amount: 3800 }
    ],
    monthly: [
      { month: 'Jan', amount: 45000 },
      { month: 'Feb', amount: 52000 },
      { month: 'Mar', amount: 48000 },
      { month: 'Apr', amount: 61000 },
      { month: 'May', amount: 58000 },
      { month: 'Jun', amount: 67000 }
    ],
    sources: [
      { source: 'Card Sales', amount: 78000, percentage: 62 },
      { source: 'Auctions', amount: 28000, percentage: 22 },
      { source: 'Betting', amount: 15000, percentage: 12 },
      { source: 'Premium Subscriptions', amount: 4400, percentage: 4 }
    ]
  },
  users: {
    registrations: [
      { date: '2025-06-29', count: 45 },
      { date: '2025-06-30', count: 62 },
      { date: '2025-07-01', count: 78 },
      { date: '2025-07-02', count: 56 },
      { date: '2025-07-03', count: 89 },
      { date: '2025-07-04', count: 103 },
      { date: '2025-07-05', count: 92 }
    ],
    retention: [
      { period: 'Day 1', rate: 85 },
      { period: 'Day 7', rate: 62 },
      { period: 'Day 30', rate: 45 },
      { period: 'Day 90', rate: 32 }
    ],
    demographics: [
      { segment: '18-24', count: 3200, percentage: 21 },
      { segment: '25-34', count: 5800, percentage: 38 },
      { segment: '35-44', count: 4100, percentage: 27 },
      { segment: '45+', count: 2320, percentage: 14 }
    ]
  },
  marketplace: {
    transactions: [
      { date: '2025-06-29', count: 120, volume: 15000 },
      { date: '2025-06-30', count: 145, volume: 18500 },
      { date: '2025-07-01', count: 168, volume: 22000 },
      { date: '2025-07-02', count: 134, volume: 17800 },
      { date: '2025-07-03', count: 189, volume: 24500 },
      { date: '2025-07-04', count: 210, volume: 28000 },
      { date: '2025-07-05', count: 198, volume: 26200 }
    ],
    topCategories: [
      { category: 'Technology', volume: 45000, change: 15.2 },
      { category: 'Healthcare', volume: 32000, change: 8.7 },
      { category: 'Finance', volume: 28000, change: -3.1 },
      { category: 'Energy', volume: 20400, change: 12.9 }
    ],
    popularCards: [
      { cardName: 'Tesla Inc.', sales: 45, revenue: 6750 },
      { cardName: 'Apple Inc.', sales: 38, revenue: 5700 },
      { cardName: 'Microsoft Corp.', sales: 32, revenue: 4800 },
      { cardName: 'Amazon.com Inc.', sales: 29, revenue: 4350 }
    ]
  },
  engagement: {
    pageViews: [
      { page: 'Marketplace', views: 25400, change: 12.3 },
      { page: 'Trading Floor', views: 18600, change: 8.9 },
      { page: 'Profile', views: 15200, change: -2.4 },
      { page: 'Auctions', views: 12800, change: 15.7 }
    ],
    sessionDuration: [
      { date: '2025-06-29', duration: 8.2 },
      { date: '2025-06-30', duration: 9.1 },
      { date: '2025-07-01', duration: 10.3 },
      { date: '2025-07-02', duration: 8.9 },
      { date: '2025-07-03', duration: 11.2 },
      { date: '2025-07-04', duration: 12.1 },
      { date: '2025-07-05', duration: 10.8 }
    ],
    bounceRate: [
      { date: '2025-06-29', rate: 32 },
      { date: '2025-06-30', rate: 28 },
      { date: '2025-07-01', rate: 25 },
      { date: '2025-07-02', rate: 30 },
      { date: '2025-07-03', rate: 23 },
      { date: '2025-07-04', rate: 21 },
      { date: '2025-07-05', rate: 26 }
    ]
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')

  const refreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      // In a real app, fetch fresh data here
      setData({ ...mockAnalyticsData })
    } catch (error) {
      console.error('Error refreshing analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

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
              Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive insights into platform performance and user behavior
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={refreshData}
              disabled={loading}
              variant="outline"
              className="border-border/30 text-muted-foreground hover:bg-white/10"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                </motion.div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            
            <Button className="bg-gradient-to-r from-monokai-blue to-monokai-purple hover:from-monokai-blue/80 hover:to-monokai-purple/80 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-border/30 mb-8">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-blue data-[state=active]:to-monokai-purple data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="revenue"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-green data-[state=active]:to-ocean-accent data-[state=active]:text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-purple data-[state=active]:to-monokai-pink data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-orange data-[state=active]:to-monokai-yellow data-[state=active]:text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger 
              value="engagement"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-monokai-pink data-[state=active]:to-monokai-orange data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Engagement
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
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-monokai-green/20 rounded-lg">
                        <DollarSign className="h-6 w-6 text-monokai-green" />
                      </div>
                      {data.overview.revenueChange >= 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-monokai-green" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-monokai-pink" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {formatCurrency(data.overview.totalRevenue)}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                    <p className={`text-sm font-medium ${
                      data.overview.revenueChange >= 0 ? 'text-monokai-green' : 'text-monokai-pink'
                    }`}>
                      {formatPercentage(data.overview.revenueChange)} from last month
                    </p>
                  </Card>

                  <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-monokai-blue/20 rounded-lg">
                        <Users className="h-6 w-6 text-monokai-blue" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-monokai-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {data.overview.totalUsers.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Total Users</p>
                    <p className="text-sm font-medium text-monokai-green">
                      {formatPercentage(data.overview.userGrowth)} growth
                    </p>
                  </Card>

                  <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-monokai-purple/20 rounded-lg">
                        <Activity className="h-6 w-6 text-monokai-purple" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-monokai-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {data.overview.activeUsers.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Active Users</p>
                    <p className="text-sm font-medium text-monokai-green">
                      {formatPercentage(data.overview.activeUserChange)} this week
                    </p>
                  </Card>

                  <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-monokai-orange/20 rounded-lg">
                        <Target className="h-6 w-6 text-monokai-orange" />
                      </div>
                      {data.overview.conversionChange >= 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-monokai-green" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-monokai-pink" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {data.overview.conversionRate}%
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Conversion Rate</p>
                    <p className={`text-sm font-medium ${
                      data.overview.conversionChange >= 0 ? 'text-monokai-green' : 'text-monokai-pink'
                    }`}>
                      {formatPercentage(data.overview.conversionChange)} from last month
                    </p>
                  </Card>
                </div>

                {/* Revenue Chart */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Daily Revenue Trend</h3>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs">7D</Button>
                      <Button size="sm" variant="outline" className="text-xs">30D</Button>
                      <Button size="sm" variant="outline" className="text-xs">90D</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {data.revenue.daily.map((day, index) => (
                      <div key={day.date} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-muted-foreground">
                          {formatDate(day.date)}
                        </div>
                        <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.amount / 5000) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-monokai-green to-ocean-accent"
                          />
                        </div>
                        <div className="w-20 text-right text-sm font-medium text-foreground">
                          {formatCurrency(day.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Performance Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-monokai-yellow" />
                      Top Performing Cards
                    </h3>
                    <div className="space-y-3">
                      {data.marketplace.popularCards.map((card, index) => (
                        <div key={card.cardName} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-monokai-blue to-monokai-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{card.cardName}</p>
                              <p className="text-sm text-muted-foreground">{card.sales} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-monokai-green">
                              {formatCurrency(card.revenue)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-monokai-blue" />
                      Page Performance
                    </h3>
                    <div className="space-y-3">
                      {data.engagement.pageViews.map((page) => (
                        <div key={page.page} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{page.page}</p>
                            <p className="text-sm text-muted-foreground">
                              {page.views.toLocaleString()} views
                            </p>
                          </div>
                          <div className={`text-sm font-medium ${
                            page.change >= 0 ? 'text-monokai-green' : 'text-monokai-pink'
                          }`}>
                            {formatPercentage(page.change)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Additional tab contents would be implemented similarly */}
            <TabsContent value="revenue" className="mt-0">
              <motion.div
                key="revenue"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Analytics</h3>
                  <p className="text-muted-foreground">Detailed revenue analytics coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">User Analytics</h3>
                  <p className="text-muted-foreground">User analytics dashboard coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="marketplace" className="mt-0">
              <motion.div
                key="marketplace"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Marketplace Analytics</h3>
                  <p className="text-muted-foreground">Marketplace analytics coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="engagement" className="mt-0">
              <motion.div
                key="engagement"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Analytics</h3>
                  <p className="text-muted-foreground">Engagement analytics coming soon...</p>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
