'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  Target,
  Gavel,
  Sword,
  BarChart3,
  PieChart,
  Zap,
  Eye,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface MarketAnalytics {
  totalVolume: number
  dailyVolume: number
  activeUsers: number
  totalTransactions: number
  avgTransactionSize: number
  topPerformers: Array<{
    name: string
    type: 'bet' | 'auction' | 'battle'
    volume: number
    change: number
  }>
  recentActivity: Array<{
    id: string
    type: 'bet_placed' | 'auction_bid' | 'battle_vote' | 'market_settled'
    user: string
    amount: number
    description: string
    timestamp: Date
  }>
  marketBreakdown: {
    betting: { volume: number, count: number }
    auctions: { volume: number, count: number }
    battles: { volume: number, count: number }
  }
}

const mockAnalytics: MarketAnalytics = {
  totalVolume: 2850000,
  dailyVolume: 125000,
  activeUsers: 1542,
  totalTransactions: 8750,
  avgTransactionSize: 325,
  topPerformers: [
    { name: 'Tesla Q4 Revenue', type: 'bet', volume: 15420, change: 23.5 },
    { name: 'Tesla Gold Edition', type: 'auction', volume: 12300, change: 18.7 },
    { name: 'Tesla vs Netflix', type: 'battle', volume: 8900, change: 45.2 },
    { name: 'OpenAI User Growth', type: 'bet', volume: 7650, change: 12.3 },
    { name: 'Coinbase Legendary', type: 'auction', volume: 6800, change: -5.4 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'bet_placed',
      user: 'CryptoTrader2024',
      amount: 500,
      description: 'Bet UP on Tesla Q4 Revenue',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '2',
      type: 'auction_bid',
      user: 'AIEnthusiast',
      amount: 2450,
      description: 'Bid on Tesla Gold Edition',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '3',
      type: 'battle_vote',
      user: 'TechInvestor',
      amount: 300,
      description: 'Voted for Tesla in M&A Battle',
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: '4',
      type: 'market_settled',
      user: 'System',
      amount: 1250,
      description: 'Shopify valuation market settled',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    }
  ],
  marketBreakdown: {
    betting: { volume: 1250000, count: 45 },
    auctions: { volume: 980000, count: 23 },
    battles: { volume: 620000, count: 12 }
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
  return `$${num}`
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

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'bet_placed': return <Target className="h-4 w-4 text-[#F92672]" />
    case 'auction_bid': return <Gavel className="h-4 w-4 text-[#A6E22E]" />
    case 'battle_vote': return <Sword className="h-4 w-4 text-[#66D9EF]" />
    case 'market_settled': return <Zap className="h-4 w-4 text-[#E6DB74]" />
    default: return <Activity className="h-4 w-4 text-[#75715E]" />
  }
}

const getPerformerIcon = (type: string) => {
  switch (type) {
    case 'bet': return <Target className="h-5 w-5 text-[#F92672]" />
    case 'auction': return <Gavel className="h-5 w-5 text-[#A6E22E]" />
    case 'battle': return <Sword className="h-5 w-5 text-[#66D9EF]" />
    default: return <Activity className="h-5 w-5 text-[#75715E]" />
  }
}

export function MarketplaceDashboard() {
  const [analytics, setAnalytics] = useState<MarketAnalytics>(mockAnalytics)
  const [refreshing, setRefreshing] = useState(false)

  const refreshData = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add some random variation to simulate real data
    setAnalytics(prev => ({
      ...prev,
      dailyVolume: prev.dailyVolume + Math.random() * 10000 - 5000,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
      totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 10),
    }))
    setRefreshing(false)
  }

  useEffect(() => {
    const interval = setInterval(refreshData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const totalMarketVolume = Object.values(analytics.marketBreakdown).reduce((sum, market) => sum + market.volume, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent">
            Marketplace Analytics
          </h1>
          <p className="text-[#75715E] mt-2">Real-time insights into trading activity</p>
        </div>
        
        <motion.div
          animate={refreshing ? { rotate: 360 } : {}}
          transition={{ duration: 1, ease: "linear" }}
          className="cursor-pointer"
          onClick={refreshData}
        >
          <Activity className={`h-6 w-6 ${refreshing ? 'text-[#A6E22E]' : 'text-[#75715E]'}`} />
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#A6E22E] font-mono">
                {formatNumber(analytics.totalVolume)}
              </div>
              <div className="text-sm text-[#75715E]">Total Volume</div>
            </div>
            <DollarSign className="h-8 w-8 text-[#A6E22E]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#66D9EF]/20 to-[#66D9EF]/10 border border-[#66D9EF]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#66D9EF] font-mono">
                {formatNumber(analytics.dailyVolume)}
              </div>
              <div className="text-sm text-[#75715E]">Daily Volume</div>
            </div>
            <BarChart3 className="h-8 w-8 text-[#66D9EF]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#F92672]/20 to-[#F92672]/10 border border-[#F92672]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#F92672] font-mono">
                {analytics.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm text-[#75715E]">Active Users</div>
            </div>
            <Users className="h-8 w-8 text-[#F92672]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#E6DB74]/20 to-[#E6DB74]/10 border border-[#E6DB74]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#E6DB74] font-mono">
                {analytics.totalTransactions.toLocaleString()}
              </div>
              <div className="text-sm text-[#75715E]">Transactions</div>
            </div>
            <Activity className="h-8 w-8 text-[#E6DB74]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#819AFF]/20 to-[#819AFF]/10 border border-[#819AFF]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#819AFF] font-mono">
                {formatNumber(analytics.avgTransactionSize)}
              </div>
              <div className="text-sm text-[#75715E]">Avg. Transaction</div>
            </div>
            <TrendingUp className="h-8 w-8 text-[#819AFF]" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Breakdown */}
        <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-[#66D9EF]" />
            Market Breakdown
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-[#F92672]" />
                <div>
                  <div className="text-sm font-medium text-[#F8EFD6]">Betting Markets</div>
                  <div className="text-xs text-[#75715E]">{analytics.marketBreakdown.betting.count} active</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#F92672]">
                  {formatNumber(analytics.marketBreakdown.betting.volume)}
                </div>
                <div className="text-xs text-[#75715E]">
                  {((analytics.marketBreakdown.betting.volume / totalMarketVolume) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gavel className="h-5 w-5 text-[#A6E22E]" />
                <div>
                  <div className="text-sm font-medium text-[#F8EFD6]">Card Auctions</div>
                  <div className="text-xs text-[#75715E]">{analytics.marketBreakdown.auctions.count} active</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#A6E22E]">
                  {formatNumber(analytics.marketBreakdown.auctions.volume)}
                </div>
                <div className="text-xs text-[#75715E]">
                  {((analytics.marketBreakdown.auctions.volume / totalMarketVolume) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sword className="h-5 w-5 text-[#66D9EF]" />
                <div>
                  <div className="text-sm font-medium text-[#F8EFD6]">M&A Battles</div>
                  <div className="text-xs text-[#75715E]">{analytics.marketBreakdown.battles.count} active</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#66D9EF]">
                  {formatNumber(analytics.marketBreakdown.battles.volume)}
                </div>
                <div className="text-xs text-[#75715E]">
                  {((analytics.marketBreakdown.battles.volume / totalMarketVolume) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-[#A6E22E]" />
            Top Performers
          </h3>
          
          <div className="space-y-3">
            {analytics.topPerformers.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-[#272822]/50 rounded-lg border border-[#75715E]/20"
              >
                <div className="flex items-center gap-3">
                  {getPerformerIcon(item.type)}
                  <div>
                    <div className="text-sm font-medium text-[#F8EFD6]">{item.name}</div>
                    <div className="text-xs text-[#75715E] capitalize">{item.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#F8EFD6]">
                    {formatNumber(item.volume)}
                  </div>
                  <div className={`text-xs flex items-center ${item.change > 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'}`}>
                    {item.change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(item.change).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#E6DB74]" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-[#272822]/50 rounded-lg border border-[#75715E]/20"
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#F8EFD6]">{activity.description}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-[#75715E]">{activity.user}</div>
                    <div className="text-xs text-[#75715E]">{formatTimeAgo(activity.timestamp)}</div>
                  </div>
                  {activity.amount > 0 && (
                    <div className="text-xs font-mono text-[#A6E22E] mt-1">
                      {formatNumber(activity.amount)} ECE
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
