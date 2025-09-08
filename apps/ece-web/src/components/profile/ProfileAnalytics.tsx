'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Calendar,
  Activity,
  Star,
  Heart,
  Zap,
  Target,
  Award,
  DollarSign,
  RefreshCw,
  Download,
  Filter,
  PieChart,
  LineChart,
  Share2,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface ProfileAnalyticsData {
  visits: {
    total: number
    unique: number
    returning: number
    trend: 'up' | 'down' | 'stable'
    changePercentage: number
    dailyData: number[]
  }
  engagement: {
    avgSessionDuration: number
    pageViews: number
    bounceRate: number
    interactionRate: number
    topSections: Array<{
      name: string
      views: number
      percentage: number
    }>
  }
  trading: {
    profileTriggeredTrades: number
    cardViewConversions: number
    wishlistAdditions: number
    battleInvites: number
    socialConnections: number
  }
  demographics: {
    topCountries: Array<{
      country: string
      percentage: number
      visitors: number
    }>
    deviceTypes: {
      desktop: number
      mobile: number
      tablet: number
    }
    referralSources: Array<{
      source: string
      visits: number
      percentage: number
    }>
  }
}

interface AnalyticsMetric {
  id: string
  label: string
  value: number | string
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<any>
  color: string
  description: string
}

interface ProfileAnalyticsProps {
  className?: string
}

export function ProfileAnalytics({ className = '' }: ProfileAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const [analyticsData] = useState<ProfileAnalyticsData>({
    visits: {
      total: 1247,
      unique: 892,
      returning: 355,
      trend: 'up',
      changePercentage: 12.5,
      dailyData: [145, 167, 198, 156, 203, 189, 234]
    },
    engagement: {
      avgSessionDuration: 342, // seconds
      pageViews: 3892,
      bounceRate: 23.4,
      interactionRate: 76.6,
      topSections: [
        { name: 'Collection', views: 892, percentage: 22.9 },
        { name: 'Trading', views: 673, percentage: 17.3 },
        { name: 'Battles', views: 456, percentage: 11.7 },
        { name: 'Wishlist', views: 389, percentage: 10.0 },
        { name: 'Performance', views: 234, percentage: 6.0 }
      ]
    },
    trading: {
      profileTriggeredTrades: 89,
      cardViewConversions: 156,
      wishlistAdditions: 234,
      battleInvites: 67,
      socialConnections: 45
    },
    demographics: {
      topCountries: [
        { country: 'United States', percentage: 45.2, visitors: 564 },
        { country: 'Canada', percentage: 18.7, visitors: 233 },
        { country: 'United Kingdom', percentage: 12.3, visitors: 153 },
        { country: 'Germany', percentage: 8.9, visitors: 111 },
        { country: 'Japan', percentage: 6.1, visitors: 76 }
      ],
      deviceTypes: {
        desktop: 52.3,
        mobile: 38.7,
        tablet: 9.0
      },
      referralSources: [
        { source: 'Direct', visits: 498, percentage: 39.9 },
        { source: 'Social Media', visits: 312, percentage: 25.0 },
        { source: 'Search', visits: 234, percentage: 18.8 },
        { source: 'Referral', visits: 156, percentage: 12.5 },
        { source: 'Email', visits: 47, percentage: 3.8 }
      ]
    }
  })

  const metrics: AnalyticsMetric[] = [
    {
      id: 'total-visits',
      label: 'Total Visits',
      value: analyticsData.visits.total.toLocaleString(),
      change: analyticsData.visits.changePercentage,
      changeType: analyticsData.visits.trend === 'up' ? 'positive' : 'negative',
      icon: Eye,
      color: '#66D9EF',
      description: 'Total profile page visits this period'
    },
    {
      id: 'unique-visitors',
      label: 'Unique Visitors',
      value: analyticsData.visits.unique.toLocaleString(),
      change: 8.7,
      changeType: 'positive',
      icon: Users,
      color: '#A6E22E',
      description: 'Unique users who visited your profile'
    },
    {
      id: 'avg-session',
      label: 'Avg Session',
      value: `${Math.floor(analyticsData.engagement.avgSessionDuration / 60)}:${String(analyticsData.engagement.avgSessionDuration % 60).padStart(2, '0')}`,
      change: 15.3,
      changeType: 'positive',
      icon: Clock,
      color: '#E6DB74',
      description: 'Average time spent on your profile'
    },
    {
      id: 'interaction-rate',
      label: 'Interaction Rate',
      value: `${analyticsData.engagement.interactionRate}%`,
      change: 4.2,
      changeType: 'positive',
      icon: Activity,
      color: '#F92672',
      description: 'Percentage of visitors who interact with content'
    },
    {
      id: 'trade-conversions',
      label: 'Trade Conversions',
      value: analyticsData.trading.profileTriggeredTrades.toString(),
      change: 23.1,
      changeType: 'positive',
      icon: Target,
      color: '#819AFF',
      description: 'Trades initiated from your profile'
    },
    {
      id: 'social-connections',
      label: 'New Connections',
      value: analyticsData.trading.socialConnections.toString(),
      change: -2.1,
      changeType: 'negative',
      icon: Heart,
      color: '#3EBA7C',
      description: 'New social connections made'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'engagement', label: 'Engagement', icon: Activity },
    { id: 'trading', label: 'Trading Impact', icon: TrendingUp },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'insights', label: 'Insights', icon: Star }
  ]

  const timeRanges = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ]

  const refreshAnalytics = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const exportAnalytics = () => {
    // Simulate export functionality
    const data = {
      timeRange,
      generatedAt: new Date().toISOString(),
      metrics: analyticsData
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profile-analytics-${timeRange}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatPercentage = (value: number) => {
    return value > 0 ? `+${value}%` : `${value}%`
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
            <div>
              <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2">Profile Analytics</h2>
              <p className="text-[#75715E]">Track your profile performance and visitor engagement</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {timeRanges.map((range) => (
                  <Button
                    key={range.id}
                    variant={timeRange === range.id ? 'default' : 'ghost'}
                   
                    onClick={() => setTimeRange(range.id)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="ghost"
               
                onClick={refreshAnalytics}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button variant="ghost" onClick={exportAnalytics}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric) => {
              const IconComponent = metric.icon
              return (
                <div key={metric.id} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <IconComponent className="w-5 h-5" style={{ color: metric.color }} />
                  </div>
                  <div className="text-lg font-bold text-[#F8EFD6]">{metric.value}</div>
                  <div className="text-xs text-[#75715E]">{metric.label}</div>
                  <div className={`text-xs font-medium ${
                    metric.changeType === 'positive' ? 'text-[#A6E22E]' : 
                    metric.changeType === 'negative' ? 'text-[#F92672]' : 'text-[#75715E]'
                  }`}>
                    {formatPercentage(metric.change)}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-xs text-[#75715E] mt-4">
            Last updated: {lastUpdate.toLocaleString()}
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
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
              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric) => {
                  const IconComponent = metric.icon
                  return (
                    <GlassCard key={metric.id} variant="dark" className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <IconComponent className="w-6 h-6" style={{ color: metric.color }} />
                            <span className="text-lg font-bold text-[#F8EFD6]">{metric.value}</span>
                          </div>
                          <h3 className="text-sm font-medium text-[#F8EFD6] mb-1">{metric.label}</h3>
                          <p className="text-xs text-[#75715E]">{metric.description}</p>
                        </div>
                        
                        <div className={`text-right ${
                          metric.changeType === 'positive' ? 'text-[#A6E22E]' : 
                          metric.changeType === 'negative' ? 'text-[#F92672]' : 'text-[#75715E]'
                        }`}>
                          <div className="flex items-center space-x-1">
                            {metric.changeType === 'positive' ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : metric.changeType === 'negative' ? (
                              <TrendingDown className="w-3 h-3" />
                            ) : null}
                            <span className="text-xs font-medium">
                              {formatPercentage(metric.change)}
                            </span>
                          </div>
                          <div className="text-xs text-[#75715E]">vs last period</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-[#272822]/30 rounded-full h-1">
                        <div 
                          className="h-1 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${Math.min(Math.abs(metric.change) * 5, 100)}%`,
                            backgroundColor: metric.color
                          }}
                        />
                      </div>
                    </GlassCard>
                  )
                })}
              </div>

              {/* Visit Trends */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Visit Trends</h3>
                <div className="h-64 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 rounded-lg flex items-center justify-center border border-[#75715E]/30">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 text-[#66D9EF] mx-auto mb-4" />
                    <span className="text-[#F8EFD6] text-lg">Visit Trend Chart</span>
                    <div className="text-sm text-[#75715E] mt-2">
                      Interactive chart showing daily visit patterns
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Sections */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Most Viewed Sections</h3>
                  <div className="space-y-4">
                    {analyticsData.engagement.topSections.map((section, index) => (
                      <div key={section.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 rounded-full flex items-center justify-center text-sm font-bold text-[#F8EFD6]">
                            {index + 1}
                          </div>
                          <span className="text-[#F8EFD6] font-medium">{section.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[#A6E22E] font-bold">{section.views.toLocaleString()}</div>
                          <div className="text-xs text-[#75715E]">{section.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Engagement Metrics */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Engagement Metrics</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6]">Interaction Rate</span>
                        <span className="text-[#A6E22E] font-bold">{analyticsData.engagement.interactionRate}%</span>
                      </div>
                      <Progress value={analyticsData.engagement.interactionRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6]">Bounce Rate</span>
                        <span className="text-[#F92672] font-bold">{analyticsData.engagement.bounceRate}%</span>
                      </div>
                      <Progress value={100 - analyticsData.engagement.bounceRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6]">Page Views</span>
                        <span className="text-[#66D9EF] font-bold">{analyticsData.engagement.pageViews.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-[#75715E]">Total views this period</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Trading Impact Tab */}
          {activeTab === 'trading' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard variant="dark" className="p-6 text-center">
                  <Target className="w-12 h-12 text-[#F92672] mx-auto mb-4" />
                  <div className="text-3xl font-bold text-[#F92672] mb-2">
                    {analyticsData.trading.profileTriggeredTrades}
                  </div>
                  <div className="text-[#F8EFD6] font-medium mb-1">Profile-Triggered Trades</div>
                  <div className="text-sm text-[#75715E]">Trades initiated from your profile</div>
                </GlassCard>

                <GlassCard variant="dark" className="p-6 text-center">
                  <Eye className="w-12 h-12 text-[#66D9EF] mx-auto mb-4" />
                  <div className="text-3xl font-bold text-[#66D9EF] mb-2">
                    {analyticsData.trading.cardViewConversions}
                  </div>
                  <div className="text-[#F8EFD6] font-medium mb-1">Card View Conversions</div>
                  <div className="text-sm text-[#75715E]">Views that led to actions</div>
                </GlassCard>

                <GlassCard variant="dark" className="p-6 text-center">
                  <Heart className="w-12 h-12 text-[#E6DB74] mx-auto mb-4" />
                  <div className="text-3xl font-bold text-[#E6DB74] mb-2">
                    {analyticsData.trading.wishlistAdditions}
                  </div>
                  <div className="text-[#F8EFD6] font-medium mb-1">Wishlist Additions</div>
                  <div className="text-sm text-[#75715E]">Cards added to wishlists</div>
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard variant="dark" className="p-6 text-center">
                  <Zap className="w-12 h-12 text-[#A6E22E] mx-auto mb-4" />
                  <div className="text-3xl font-bold text-[#A6E22E] mb-2">
                    {analyticsData.trading.battleInvites}
                  </div>
                  <div className="text-[#F8EFD6] font-medium mb-1">Battle Invites</div>
                  <div className="text-sm text-[#75715E]">Battle challenges received</div>
                </GlassCard>

                <GlassCard variant="dark" className="p-6 text-center">
                  <Users className="w-12 h-12 text-[#819AFF] mx-auto mb-4" />
                  <div className="text-3xl font-bold text-[#819AFF] mb-2">
                    {analyticsData.trading.socialConnections}
                  </div>
                  <div className="text-[#F8EFD6] font-medium mb-1">New Connections</div>
                  <div className="text-sm text-[#75715E]">Social connections made</div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Demographics Tab */}
          {activeTab === 'demographics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Countries */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Top Countries</h3>
                  <div className="space-y-3">
                    {analyticsData.demographics.topCountries.map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 rounded flex items-center justify-center text-xs font-bold text-[#F8EFD6]">
                            {index + 1}
                          </div>
                          <span className="text-[#F8EFD6]">{country.country}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[#A6E22E] font-bold">{country.percentage}%</div>
                          <div className="text-xs text-[#75715E]">{country.visitors} visitors</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Device Types */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Device Types</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6]">Desktop</span>
                        <span className="text-[#66D9EF] font-bold">{analyticsData.demographics.deviceTypes.desktop}%</span>
                      </div>
                      <Progress value={analyticsData.demographics.deviceTypes.desktop} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6]">Mobile</span>
                        <span className="text-[#A6E22E] font-bold">{analyticsData.demographics.deviceTypes.mobile}%</span>
                      </div>
                      <Progress value={analyticsData.demographics.deviceTypes.mobile} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F8EFD6]">Tablet</span>
                        <span className="text-[#E6DB74] font-bold">{analyticsData.demographics.deviceTypes.tablet}%</span>
                      </div>
                      <Progress value={analyticsData.demographics.deviceTypes.tablet} className="h-2" />
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Referral Sources */}
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Referral Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {analyticsData.demographics.referralSources.map((source) => (
                    <div key={source.source} className="text-center p-4 bg-[#272822]/30 rounded-lg">
                      <div className="text-2xl font-bold text-[#A6E22E] mb-1">{source.percentage}%</div>
                      <div className="text-[#F8EFD6] font-medium mb-1">{source.source}</div>
                      <div className="text-xs text-[#75715E]">{source.visits} visits</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Positive Insights */}
                <GlassCard variant="dark" className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-[#A6E22E]" />
                    <h3 className="text-xl font-bold text-[#F8EFD6]">Positive Trends</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-[#A6E22E]/10 border border-[#A6E22E]/30 rounded-lg">
                      <div className="text-[#A6E22E] font-medium mb-1">High Engagement Rate</div>
                      <div className="text-sm text-[#75715E]">Your profile interaction rate is 76.6%, which is 23% above average</div>
                    </div>
                    <div className="p-3 bg-[#66D9EF]/10 border border-[#66D9EF]/30 rounded-lg">
                      <div className="text-[#66D9EF] font-medium mb-1">Growing Trade Conversions</div>
                      <div className="text-sm text-[#75715E]">Profile-triggered trades increased by 23% this week</div>
                    </div>
                    <div className="p-3 bg-[#E6DB74]/10 border border-[#E6DB74]/30 rounded-lg">
                      <div className="text-[#E6DB74] font-medium mb-1">Strong Return Visitor Rate</div>
                      <div className="text-sm text-[#75715E]">28% of visitors return to your profile within 7 days</div>
                    </div>
                  </div>
                </GlassCard>

                {/* Improvement Opportunities */}
                <GlassCard variant="dark" className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#F92672]" />
                    <h3 className="text-xl font-bold text-[#F8EFD6]">Growth Opportunities</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-[#F92672]/10 border border-[#F92672]/30 rounded-lg">
                      <div className="text-[#F92672] font-medium mb-1">Mobile Optimization</div>
                      <div className="text-sm text-[#75715E]">38% of visitors use mobile - consider mobile-specific features</div>
                    </div>
                    <div className="p-3 bg-[#819AFF]/10 border border-[#819AFF]/30 rounded-lg">
                      <div className="text-[#819AFF] font-medium mb-1">International Reach</div>
                      <div className="text-sm text-[#75715E]">Consider localization for your top international markets</div>
                    </div>
                    <div className="p-3 bg-[#3EBA7C]/10 border border-[#3EBA7C]/30 rounded-lg">
                      <div className="text-[#3EBA7C] font-medium mb-1">Social Features</div>
                      <div className="text-sm text-[#75715E]">Social connections are growing slowly - promote more social features</div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Recommendations */}
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="w-6 h-6 text-[#E6DB74]" />
                  <h3 className="text-xl font-bold text-[#F8EFD6]">Recommended Actions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#272822]/30 rounded-lg text-center">
                    <Award className="w-8 h-8 text-[#A6E22E] mx-auto mb-3" />
                    <div className="text-[#F8EFD6] font-medium mb-2">Showcase Achievements</div>
                    <div className="text-sm text-[#75715E]">Highlight your trading achievements more prominently</div>
                  </div>
                  <div className="p-4 bg-[#272822]/30 rounded-lg text-center">
                    <Share2 className="w-8 h-8 text-[#66D9EF] mx-auto mb-3" />
                    <div className="text-[#F8EFD6] font-medium mb-2">Social Sharing</div>
                    <div className="text-sm text-[#75715E]">Add easy sharing options for your profile sections</div>
                  </div>
                  <div className="p-4 bg-[#272822]/30 rounded-lg text-center">
                    <Activity className="w-8 h-8 text-[#F92672] mx-auto mb-3" />
                    <div className="text-[#F8EFD6] font-medium mb-2">Live Updates</div>
                    <div className="text-sm text-[#75715E]">Enable real-time activity feeds to boost engagement</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
