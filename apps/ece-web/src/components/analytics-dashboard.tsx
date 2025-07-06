'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  Target,
  Gavel,
  Sword,
  Trophy,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface AnalyticsData {
  totalVolume: number
  volume24h: number
  volumeChange: number
  activeUsers: number
  usersChange: number
  totalTransactions: number
  transactionsChange: number
  averageTransactionValue: number
  topPerformers: Array<{
    name: string
    type: 'betting' | 'auction' | 'battle'
    volume: number
    change: number
  }>
  marketBreakdown: {
    betting: { volume: number, percentage: number, count: number }
    auctions: { volume: number, percentage: number, count: number }
    battles: { volume: number, percentage: number, count: number }
  }
  recentActivity: Array<{
    id: string
    type: 'bet' | 'bid' | 'vote' | 'win'
    user: string
    amount: number
    market: string
    time: string
  }>
  priceHistory: Array<{
    date: string
    betting: number
    auctions: number
    battles: number
    total: number
  }>
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData
}

const mockAnalyticsData: AnalyticsData = {
  totalVolume: 2850000,
  volume24h: 125000,
  volumeChange: 15.7,
  activeUsers: 15420,
  usersChange: 8.3,
  totalTransactions: 8750,
  transactionsChange: 12.1,
  averageTransactionValue: 320,
  topPerformers: [
    { name: 'Tesla Q4 Revenue', type: 'betting', volume: 25600, change: 22.5 },
    { name: 'Tesla Gold Edition', type: 'auction', volume: 18900, change: 18.7 },
    { name: 'Tesla vs Netflix', type: 'battle', volume: 15200, change: 9.4 },
    { name: 'OpenAI User Growth', type: 'betting', volume: 12800, change: 31.2 },
    { name: 'Netflix Streaming', type: 'auction', volume: 8500, change: -5.3 }
  ],
  marketBreakdown: {
    betting: { volume: 1200000, percentage: 42.1, count: 145 },
    auctions: { volume: 980000, percentage: 34.4, count: 89 },
    battles: { volume: 670000, percentage: 23.5, count: 34 }
  },
  recentActivity: [
    { id: '1', type: 'win', user: 'CryptoTrader2024', amount: 450, market: 'Tesla Q4 Revenue', time: '2m ago' },
    { id: '2', type: 'bid', user: 'AIEnthusiast', amount: 890, market: 'OpenAI Developer', time: '5m ago' },
    { id: '3', type: 'vote', user: 'StreamFan99', amount: 200, market: 'Tesla vs Netflix', time: '8m ago' },
    { id: '4', type: 'bet', user: 'TechInvestor', amount: 300, market: 'Shopify Performance', time: '12m ago' },
    { id: '5', type: 'win', user: 'MarketMaker', amount: 680, market: 'Netflix Growth', time: '15m ago' }
  ],
  priceHistory: [
    { date: '6/29', betting: 180000, auctions: 150000, battles: 95000, total: 425000 },
    { date: '6/30', betting: 195000, auctions: 165000, battles: 102000, total: 462000 },
    { date: '7/1', betting: 210000, auctions: 180000, battles: 110000, total: 500000 },
    { date: '7/2', betting: 225000, auctions: 195000, battles: 125000, total: 545000 },
    { date: '7/3', betting: 240000, auctions: 210000, battles: 135000, total: 585000 },
    { date: '7/4', betting: 255000, auctions: 225000, battles: 145000, total: 625000 }
  ]
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const formatCurrency = (num: number) => {
  return `${formatNumber(num)} ECE`
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'bet': return <Target className="h-4 w-4 text-[#F92672]" />
    case 'bid': return <Gavel className="h-4 w-4 text-[#A6E22E]" />
    case 'vote': return <Sword className="h-4 w-4 text-[#66D9EF]" />
    case 'win': return <Trophy className="h-4 w-4 text-[#E6DB74]" />
    default: return <Activity className="h-4 w-4 text-[#75715E]" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'betting': return '#F92672'
    case 'auction': return '#A6E22E'
    case 'battle': return '#66D9EF'
    default: return '#75715E'
  }
}

const VolumeChart = ({ data }: { data: AnalyticsData['priceHistory'] }) => {
  const maxVolume = Math.max(...data.map(d => d.total))
  
  return (
    <div className="relative h-64 w-full">
      <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="volumeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#66D9EF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#A6E22E" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F92672" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 50, 100, 150, 200].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="#75715E"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
        ))}
        
        {/* Volume area */}
        <polygon
          fill="url(#volumeGradient)"
          points={`0,200 ${data.map((point, i) => {
            const x = (i / (data.length - 1)) * 400
            const y = 200 - ((point.total / maxVolume) * 180)
            return `${x},${y}`
          }).join(' ')} 400,200`}
        />
        
        {/* Volume line */}
        <polyline
          fill="none"
          stroke="#66D9EF"
          strokeWidth="2"
          points={data.map((point, i) => {
            const x = (i / (data.length - 1)) * 400
            const y = 200 - ((point.total / maxVolume) * 180)
            return `${x},${y}`
          }).join(' ')}
        />
        
        {/* Data points */}
        {data.map((point, i) => {
          const x = (i / (data.length - 1)) * 400
          const y = 200 - ((point.total / maxVolume) * 180)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#66D9EF"
              stroke="#272822"
              strokeWidth="2"
            />
          )
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#75715E] px-2">
        {data.map((point, i) => (
          <span key={i}>{point.date}</span>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsDashboard({ data = mockAnalyticsData }: AnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('24h')

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent">
            Marketplace Analytics
          </h2>
          <p className="text-[#75715E] mt-2">
            Real-time insights into marketplace performance and user engagement
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {(['24h', '7d', '30d', '90d'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period)}
              className={
                timeframe === period 
                  ? 'bg-[#66D9EF] text-[#272822]' 
                  : 'border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10'
              }
            >
              {period}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 bg-gradient-to-br from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#A6E22E] font-mono">
                {formatCurrency(data.totalVolume)}
              </div>
              <div className="text-sm text-[#75715E]">Total Volume</div>
              <div className="flex items-center mt-2 text-xs">
                {data.volumeChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-[#A6E22E] mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-[#F92672] mr-1" />
                )}
                <span className={data.volumeChange >= 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'}>
                  {data.volumeChange > 0 ? '+' : ''}{data.volumeChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-[#A6E22E]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#66D9EF]/20 to-[#66D9EF]/10 border border-[#66D9EF]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#66D9EF] font-mono">
                {formatNumber(data.activeUsers)}
              </div>
              <div className="text-sm text-[#75715E]">Active Users</div>
              <div className="flex items-center mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-[#A6E22E] mr-1" />
                <span className="text-[#A6E22E]">
                  +{data.usersChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-[#66D9EF]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#F92672]/20 to-[#F92672]/10 border border-[#F92672]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#F92672] font-mono">
                {formatNumber(data.totalTransactions)}
              </div>
              <div className="text-sm text-[#75715E]">Transactions</div>
              <div className="flex items-center mt-2 text-xs">
                <ArrowUpRight className="h-3 w-3 text-[#A6E22E] mr-1" />
                <span className="text-[#A6E22E]">
                  +{data.transactionsChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <Activity className="h-8 w-8 text-[#F92672]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#E6DB74]/20 to-[#E6DB74]/10 border border-[#E6DB74]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#E6DB74] font-mono">
                {formatCurrency(data.averageTransactionValue)}
              </div>
              <div className="text-sm text-[#75715E]">Avg Transaction</div>
              <div className="flex items-center mt-2 text-xs">
                <BarChart3 className="h-3 w-3 text-[#E6DB74] mr-1" />
                <span className="text-[#75715E]">Per trade</span>
              </div>
            </div>
            <Zap className="h-8 w-8 text-[#E6DB74]" />
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#F8EFD6]">
                Volume Trends
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#F92672] rounded-full" />
                  <span className="text-[#75715E]">Betting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#A6E22E] rounded-full" />
                  <span className="text-[#75715E]">Auctions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#66D9EF] rounded-full" />
                  <span className="text-[#75715E]">Battles</span>
                </div>
              </div>
            </div>
            <VolumeChart data={data.priceHistory} />
          </Card>
        </motion.div>

        {/* Market Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 h-full">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-6">
              Market Breakdown
            </h3>
            
            <div className="space-y-6">
              {Object.entries(data.marketBreakdown).map(([market, stats]) => (
                <div key={market} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getTypeColor(market) }}
                      />
                      <span className="text-[#F8EFD6] capitalize font-medium">
                        {market}
                      </span>
                    </div>
                    <span className="text-[#75715E] text-sm">
                      {stats.percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={stats.percentage} 
                    className="h-2 bg-[#272822]"
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#75715E]">
                      {formatCurrency(stats.volume)}
                    </span>
                    <span className="text-[#75715E]">
                      {stats.count} active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-6">
              Top Performing Markets
            </h3>
            
            <div className="space-y-4">
              {data.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#272822]/50 rounded-lg border border-[#75715E]/20">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-[#E6DB74]">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-[#F8EFD6] font-medium">
                        {performer.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className="text-xs"
                        >
                          {performer.type}
                        </Badge>
                        <span className="text-xs text-[#75715E]">
                          {formatCurrency(performer.volume)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    {performer.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-[#A6E22E]" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-[#F92672]" />
                    )}
                    <span className={performer.change >= 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'}>
                      {performer.change > 0 ? '+' : ''}{performer.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-6">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-[#272822]/50 rounded-lg border border-[#75715E]/20"
                >
                  <div className="flex items-center gap-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <div className="text-[#F8EFD6] font-medium">
                        {activity.user}
                      </div>
                      <div className="text-xs text-[#75715E]">
                        {activity.type} • {activity.market}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-[#A6E22E] font-mono font-bold">
                      {formatCurrency(activity.amount)}
                    </div>
                    <div className="text-xs text-[#75715E]">
                      {activity.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
