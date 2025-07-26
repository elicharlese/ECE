'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity, 
  Target,
  AlertTriangle,
  Bell,
  Eye,
  Calendar,
  Users,
  Building,
  Globe,
  Zap
} from 'lucide-react'

interface MarketData {
  currentPrice: number
  priceChange24h: number
  priceChangePercent24h: number
  volume24h: number
  marketCap: number
  high24h: number
  low24h: number
  ath: number
  athDate: string
  atl: number
  atlDate: string
  circulatingSupply: number
  totalSupply: number
  holders: number
  transactions24h: number
}

interface TechnicalIndicator {
  name: string
  value: number
  signal: 'buy' | 'sell' | 'neutral'
  description: string
  timeframe: string
}

interface MarketSentiment {
  score: number
  label: 'Very Bearish' | 'Bearish' | 'Neutral' | 'Bullish' | 'Very Bullish'
  socialVolume: number
  newsVolume: number
  whaleActivity: number
  retailSentiment: number
}

interface PriceAlert {
  id: string
  type: 'above' | 'below' | 'percent_change'
  value: number
  isActive: boolean
  frequency: 'once' | 'recurring'
}

interface ValuationDisplayProps {
  cardId: string
  symbol: string
  name: string
  marketData: MarketData
  technicalIndicators: TechnicalIndicator[]
  sentiment: MarketSentiment
  priceAlerts: PriceAlert[]
  onCreateAlert: (alert: Omit<PriceAlert, 'id'>) => void
  onToggleAlert: (alertId: string) => void
  className?: string
}

// Mock data generator for development
const generateMockData = (symbol: string): { marketData: MarketData; technicalIndicators: TechnicalIndicator[]; sentiment: MarketSentiment } => {
  const basePrice = Math.random() * 1000 + 10
  const changePercent = (Math.random() - 0.5) * 20
  
  return {
    marketData: {
      currentPrice: basePrice,
      priceChange24h: basePrice * (changePercent / 100),
      priceChangePercent24h: changePercent,
      volume24h: Math.random() * 10000000,
      marketCap: basePrice * Math.random() * 1000000,
      high24h: basePrice * 1.1,
      low24h: basePrice * 0.9,
      ath: basePrice * 2.5,
      athDate: '2024-11-15',
      atl: basePrice * 0.1,
      atlDate: '2023-06-12',
      circulatingSupply: Math.random() * 1000000,
      totalSupply: Math.random() * 2000000,
      holders: Math.floor(Math.random() * 100000),
      transactions24h: Math.floor(Math.random() * 50000)
    },
    technicalIndicators: [
      {
        name: 'RSI (14)',
        value: Math.random() * 100,
        signal: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'neutral' : 'sell',
        description: 'Relative Strength Index indicates momentum',
        timeframe: '1D'
      },
      {
        name: 'MACD',
        value: (Math.random() - 0.5) * 10,
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        description: 'Moving Average Convergence Divergence',
        timeframe: '1D'
      },
      {
        name: 'SMA (50)',
        value: basePrice * (0.95 + Math.random() * 0.1),
        signal: 'neutral',
        description: '50-day Simple Moving Average',
        timeframe: '1D'
      }
    ],
    sentiment: {
      score: Math.random() * 100,
      label: ['Very Bearish', 'Bearish', 'Neutral', 'Bullish', 'Very Bullish'][Math.floor(Math.random() * 5)] as any,
      socialVolume: Math.random() * 10000,
      newsVolume: Math.random() * 1000,
      whaleActivity: Math.random() * 100,
      retailSentiment: Math.random() * 100
    }
  }
}

export function ValuationDisplay({
  cardId,
  symbol,
  name,
  marketData: initialMarketData,
  technicalIndicators: initialIndicators,
  sentiment: initialSentiment,
  priceAlerts = [],
  onCreateAlert,
  onToggleAlert,
  className = ''
}: ValuationDisplayProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1H' | '1D' | '7D' | '30D' | '1Y'>('1D')
  const [showTechnicals, setShowTechnicals] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [newAlertPrice, setNewAlertPrice] = useState('')
  const [marketData, setMarketData] = useState(initialMarketData)
  const [technicalIndicators, setTechnicalIndicators] = useState(initialIndicators)
  const [sentiment, setSentiment] = useState(initialSentiment)

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const mockData = generateMockData(symbol)
      setMarketData(mockData.marketData)
      setTechnicalIndicators(mockData.technicalIndicators)
      setSentiment(mockData.sentiment)
    }, 5000)

    return () => clearInterval(interval)
  }, [symbol])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toFixed(2)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown
  }

  const getSentimentColor = (score: number) => {
    if (score >= 80) return 'text-[#A6E22E]'
    if (score >= 60) return 'text-[#66D9EF]'
    if (score >= 40) return 'text-[#E6DB74]'
    if (score >= 20) return 'text-[#FD5C63]'
    return 'text-[#F92672]'
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-[#A6E22E]'
      case 'sell': return 'text-[#F92672]'
      default: return 'text-[#E6DB74]'
    }
  }

  const handleCreateAlert = () => {
    const price = parseFloat(newAlertPrice)
    if (isNaN(price) || price <= 0) return

    onCreateAlert({
      type: price > marketData.currentPrice ? 'above' : 'below',
      value: price,
      isActive: true,
      frequency: 'once'
    })
    setNewAlertPrice('')
    setShowAlerts(false)
  }

  const timeframes = ['1H', '1D', '7D', '30D', '1Y'] as const

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Price Display */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-[#F8EFD6]">
              {formatPrice(marketData.currentPrice)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {React.createElement(getChangeIcon(marketData.priceChange24h), {
                className: `h-4 w-4 ${getChangeColor(marketData.priceChange24h)}`
              })}
              <span className={`font-medium ${getChangeColor(marketData.priceChange24h)}`}>
                {formatPrice(Math.abs(marketData.priceChange24h))} ({Math.abs(marketData.priceChangePercent24h).toFixed(2)}%)
              </span>
              <span className="text-[#75715E]">24h</span>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className={`${getSentimentColor(sentiment.score)} bg-opacity-20`}>
              {sentiment.label}
            </Badge>
            <div className="text-sm text-[#75715E] mt-1">
              Sentiment: {sentiment.score.toFixed(0)}/100
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 mb-4">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe}
             
              variant={selectedTimeframe === timeframe ? "primary" : "ghost"}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={selectedTimeframe === timeframe 
                ? "bg-[#66D9EF] text-[#272822]" 
                : "text-[#75715E] hover:text-[#F8EFD6]"
              }
            >
              {timeframe}
            </Button>
          ))}
        </div>

        {/* Mock Chart Area */}
        <div className="h-32 bg-[#272822]/50 rounded-lg border border-[#75715E]/20 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#75715E] text-sm">
              Interactive Chart ({selectedTimeframe})
            </div>
          </div>
          
          {/* Animated price line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#66D9EF] to-[#A6E22E]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#75715E]">24h High</span>
              <span className="text-[#F8EFD6]">{formatPrice(marketData.high24h)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">24h Low</span>
              <span className="text-[#F8EFD6]">{formatPrice(marketData.low24h)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">Volume</span>
              <span className="text-[#F8EFD6]">{formatNumber(marketData.volume24h)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#75715E]">Market Cap</span>
              <span className="text-[#F8EFD6]">{formatNumber(marketData.marketCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">Holders</span>
              <span className="text-[#F8EFD6]">{formatNumber(marketData.holders)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">Transactions</span>
              <span className="text-[#F8EFD6]">{formatNumber(marketData.transactions24h)}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowTechnicals(!showTechnicals)}
          variant={showTechnicals ? "primary" : "ghost"}
          className={showTechnicals 
            ? "bg-[#819AFF] text-[#F8EFD6]" 
            : "text-[#75715E] hover:text-[#F8EFD6]"
          }
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Technical Analysis
        </Button>
        
        <Button
          onClick={() => setShowAlerts(!showAlerts)}
          variant={showAlerts ? "primary" : "ghost"}
          className={showAlerts 
            ? "bg-[#E6DB74] text-[#272822]" 
            : "text-[#75715E] hover:text-[#F8EFD6]"
          }
        >
          <Bell className="h-4 w-4 mr-2" />
          Price Alerts ({priceAlerts.filter(a => a.isActive).length})
        </Button>
      </div>

      {/* Technical Indicators */}
      <AnimatePresence>
        {showTechnicals && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="dark" className="p-4">
              <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Technical Indicators
              </h4>
              
              <div className="space-y-3">
                {technicalIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#272822]/30 rounded-lg">
                    <div>
                      <div className="font-medium text-[#F8EFD6]">{indicator.name}</div>
                      <div className="text-sm text-[#75715E]">{indicator.description}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-mono text-[#F8EFD6]">
                        {indicator.value.toFixed(2)}
                      </div>
                      <Badge className={`${getSignalColor(indicator.signal)} bg-opacity-20 mt-1`}>
                        {indicator.signal.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Alerts */}
      <AnimatePresence>
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="dark" className="p-4">
              <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Price Alerts
              </h4>
              
              {/* Create New Alert */}
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={newAlertPrice}
                  onChange={(e) => setNewAlertPrice(e.target.value)}
                  placeholder="Alert price"
                  className="flex-1 px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] placeholder-[#75715E]"
                />
                <Button onClick={handleCreateAlert} className="bg-[#A6E22E] text-[#272822]">
                  <Target className="h-4 w-4 mr-1" />
                  Add Alert
                </Button>
              </div>
              
              {/* Active Alerts */}
              <div className="space-y-2">
                {priceAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-[#272822]/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.type === 'above' ? '↗' : '↘'} {formatPrice(alert.value)}
                      </Badge>
                      <span className="text-[#F8EFD6] text-sm">
                        Alert when price goes {alert.type} {formatPrice(alert.value)}
                      </span>
                    </div>
                    
                    <Button
                     
                      variant="ghost"
                      onClick={() => onToggleAlert(alert.id)}
                      className={alert.isActive ? "text-[#A6E22E]" : "text-[#75715E]"}
                    >
                      {alert.isActive ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4 opacity-50" />}
                    </Button>
                  </div>
                ))}
                
                {priceAlerts.length === 0 && (
                  <div className="text-center py-4 text-[#75715E]">
                    No price alerts set
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Market Sentiment Details */}
      <GlassCard variant="dark" className="p-4">
        <h4 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Market Sentiment
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#75715E]">Social Volume</span>
              <span className="text-[#F8EFD6]">{formatNumber(sentiment.socialVolume)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">News Volume</span>
              <span className="text-[#F8EFD6]">{formatNumber(sentiment.newsVolume)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#75715E]">Whale Activity</span>
              <span className="text-[#F8EFD6]">{sentiment.whaleActivity.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75715E]">Retail Sentiment</span>
              <span className="text-[#F8EFD6]">{sentiment.retailSentiment.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default ValuationDisplay
