'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Bell,
  History,
  Calculator,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface BalanceData {
  current: number
  previous24h: number
  change24h: number
  changePercentage: number
  trend: 'up' | 'down' | 'stable'
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade' | 'reward' | 'fee'
  amount: number
  description: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  relatedCard?: string
}

interface PerformanceMetric {
  id: string
  label: string
  value: number
  previousValue: number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  trend: number[]
  unit: string
  icon: React.ComponentType<any>
}

interface ECEBalancePerformanceProps {
  className?: string
}

export function ECEBalancePerformance({ className = '' }: ECEBalancePerformanceProps) {
  const [balanceData, setBalanceData] = useState<BalanceData>({
    current: 25430,
    previous24h: 23890,
    change24h: 1540,
    changePercentage: 6.45,
    trend: 'up'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'trade',
      amount: 2500,
      description: 'Sold Digital Phoenix card',
      timestamp: new Date('2025-07-05T10:30:00'),
      status: 'completed',
      relatedCard: 'Digital Phoenix'
    },
    {
      id: '2',
      type: 'deposit',
      amount: 1000,
      description: 'Daily login bonus',
      timestamp: new Date('2025-07-05T08:00:00'),
      status: 'completed'
    },
    {
      id: '3',
      type: 'fee',
      amount: -50,
      description: 'Trading fee',
      timestamp: new Date('2025-07-05T10:35:00'),
      status: 'completed'
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: -500,
      description: 'Card upgrade materials',
      timestamp: new Date('2025-07-04T16:20:00'),
      status: 'completed'
    },
    {
      id: '5',
      type: 'reward',
      amount: 750,
      description: 'Battle victory reward',
      timestamp: new Date('2025-07-04T14:15:00'),
      status: 'completed'
    }
  ]

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: 'roi',
      label: 'Portfolio ROI',
      value: 18.5,
      previousValue: 15.2,
      change: 3.3,
      changeType: 'positive',
      trend: [10, 12, 15, 16, 18.5],
      unit: '%',
      icon: TrendingUp
    },
    {
      id: 'trading-volume',
      label: 'Trading Volume (30d)',
      value: 45600,
      previousValue: 38200,
      change: 7400,
      changeType: 'positive',
      trend: [30000, 35000, 38200, 42000, 45600],
      unit: 'ECE',
      icon: BarChart3
    },
    {
      id: 'win-rate',
      label: 'Trade Win Rate',
      value: 78.5,
      previousValue: 76.2,
      change: 2.3,
      changeType: 'positive',
      trend: [72, 74, 76.2, 77, 78.5],
      unit: '%',
      icon: Target
    },
    {
      id: 'avg-profit',
      label: 'Avg Profit per Trade',
      value: 156,
      previousValue: 142,
      change: 14,
      changeType: 'positive',
      trend: [120, 135, 142, 150, 156],
      unit: 'ECE',
      icon: Calculator
    }
  ]

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setBalanceData(prev => {
        const variation = (Math.random() - 0.5) * 100
        const newCurrent = Math.max(0, prev.current + variation)
        const change = newCurrent - prev.previous24h
        const changePercentage = (change / prev.previous24h) * 100

        return {
          current: Math.round(newCurrent),
          previous24h: prev.previous24h,
          change24h: Math.round(change),
          changePercentage: Math.round(changePercentage * 100) / 100,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        }
      })
      setLastUpdate(new Date())
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const refreshBalance = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const exportReport = () => {
    const report = {
      balance: balanceData,
      transactions: transactions,
      metrics: performanceMetrics,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ece-balance-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowUpRight className="w-4 h-4 text-[#A6E22E]" />
      case 'withdrawal': return <ArrowDownRight className="w-4 h-4 text-[#F92672]" />
      case 'trade': return <RefreshCw className="w-4 h-4 text-[#66D9EF]" />
      case 'reward': return <Zap className="w-4 h-4 text-[#E6DB74]" />
      case 'fee': return <Calculator className="w-4 h-4 text-[#F92672]" />
      default: return <DollarSign className="w-4 h-4 text-[#75715E]" />
    }
  }

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2 flex items-center">
            <Wallet className="w-6 h-6 mr-2" />
            ECE Balance Performance
          </h2>
          <p className="text-[#75715E]">
            Real-time balance tracking and performance analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
           
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'text-[#A6E22E]' : 'text-[#75715E]'}
          >
            {autoRefresh ? <Bell className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
           
            onClick={refreshBalance}
            disabled={isLoading}
            className="text-[#66D9EF]"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
           
            onClick={exportReport}
            className="text-[#E6DB74]"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#F8EFD6] mb-1">Current Balance</h3>
              <p className="text-sm text-[#75715E]">
                Last updated: {formatTime(lastUpdate)}
              </p>
            </div>
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${
              balanceData.trend === 'up' 
                ? 'bg-[#A6E22E]/20 border-[#A6E22E]/30 text-[#A6E22E]'
                : balanceData.trend === 'down'
                ? 'bg-[#F92672]/20 border-[#F92672]/30 text-[#F92672]'
                : 'bg-[#75715E]/20 border-[#75715E]/30 text-[#75715E]'
            }`}>
              {balanceData.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : balanceData.trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4 border border-current rounded-full" />
              )}
              <span className="text-sm font-medium">
                {balanceData.changePercentage > 0 ? '+' : ''}{balanceData.changePercentage}%
              </span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-[#F8EFD6] mb-2">
              {balanceData.current.toLocaleString()} ECE
            </div>
            <div className={`text-lg ${getTransactionColor(balanceData.change24h)}`}>
              {balanceData.change24h > 0 ? '+' : ''}{balanceData.change24h.toLocaleString()} ECE (24h)
            </div>
          </div>

          {/* Balance Trend Visualization */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-[#75715E]">
              <span>24h Range</span>
              <span>Previous: {balanceData.previous24h.toLocaleString()} ECE</span>
            </div>
            <Progress 
              value={Math.max(0, Math.min(100, balanceData.changePercentage + 50))} 
              className="h-2"
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {performanceMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          
          return (
            <GlassCard key={metric.id} variant="dark" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[#272822]/50 rounded-lg">
                  <IconComponent className="w-5 h-5 text-[#66D9EF]" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.changeType === 'positive' ? 'text-[#A6E22E]' :
                  metric.changeType === 'negative' ? 'text-[#F92672]' :
                  'text-[#75715E]'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : metric.changeType === 'negative' ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : null}
                  <span>{metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}</span>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-[#F8EFD6] mb-1">
                {metric.value}{metric.unit}
              </div>
              
              <div className="text-sm text-[#75715E] mb-3">
                {metric.label}
              </div>

              {/* Mini trend chart */}
              <div className="h-8 flex items-end space-x-1">
                {metric.trend.map((value, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#A6E22E]/20 to-[#A6E22E]/40 rounded-sm"
                    style={{ 
                      height: `${(value / Math.max(...metric.trend)) * 100}%`,
                      minHeight: '2px'
                    }}
                  />
                ))}
              </div>
            </GlassCard>
          )
        })}
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard variant="dark" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#F8EFD6] flex items-center">
              <History className="w-5 h-5 mr-2" />
              Recent Transactions
            </h3>
            <Button variant="ghost" className="text-[#66D9EF]">
              <Calendar className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-[#272822]/30 rounded-lg border border-[#75715E]/20 hover:border-[#75715E]/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#272822]/50 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#F8EFD6]">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-[#75715E]">
                      <span>{formatDate(transaction.timestamp)}</span>
                      <span>•</span>
                      <span>{formatTime(transaction.timestamp)}</span>
                      {transaction.relatedCard && (
                        <>
                          <span>•</span>
                          <span className="text-[#66D9EF]">{transaction.relatedCard}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} ECE
                  </div>
                  <div className={`text-xs px-2 py-1 rounded border ${
                    transaction.status === 'completed' 
                      ? 'bg-[#A6E22E]/20 border-[#A6E22E]/30 text-[#A6E22E]'
                      : transaction.status === 'pending'
                      ? 'bg-[#E6DB74]/20 border-[#E6DB74]/30 text-[#E6DB74]'
                      : 'bg-[#F92672]/20 border-[#F92672]/30 text-[#F92672]'
                  }`}>
                    {transaction.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Balance Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Balance Alerts & Notifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#A6E22E]/10 border border-[#A6E22E]/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#A6E22E]" />
                <span className="font-medium text-[#A6E22E]">Portfolio Growth</span>
              </div>
              <p className="text-sm text-[#75715E]">
                Your portfolio has grown by 18.5% this month
              </p>
            </div>
            
            <div className="p-4 bg-[#66D9EF]/10 border border-[#66D9EF]/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-[#66D9EF]" />
                <span className="font-medium text-[#66D9EF]">Trading Milestone</span>
              </div>
              <p className="text-sm text-[#75715E]">
                You've completed 100+ successful trades
              </p>
            </div>
            
            <div className="p-4 bg-[#E6DB74]/10 border border-[#E6DB74]/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-[#E6DB74]" />
                <span className="font-medium text-[#E6DB74]">Bonus Available</span>
              </div>
              <p className="text-sm text-[#75715E]">
                Daily login bonus ready to claim
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
