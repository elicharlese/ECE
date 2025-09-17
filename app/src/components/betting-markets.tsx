'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
// Tabs removed from this component; category tabs will be rendered by parent
import { Progress } from './ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  DollarSign, 
  Target,
  Zap,
  BarChart3,
  Timer,
  Trophy,
  Flame
} from 'lucide-react'

interface BettingMarket {
  id: string
  title: string
  description: string
  metricType: string
  currentValue: number
  predictionTarget: number
  targetDirection: 'UP' | 'DOWN'
  odds: number
  totalPot: number
  minimumBet: number
  timeLeft: number
  participantCount: number
  trendingScore: number
  cardName: string
  cardCategory: string
  isHot: boolean
  volume24h: number
}

interface BettingMarketsProps {
  onPlaceBet?: (marketId: string, direction: 'UP' | 'DOWN', amount: number) => void
  // External control of category filter
  filterCategory?: string
}

const mockMarkets: BettingMarket[] = [
  {
    id: '1',
    title: 'Tesla Acquisition Success',
    description: 'Will Tesla successfully complete its next major acquisition by Q4 2025?',
    metricType: 'REVENUE_GROWTH',
    currentValue: 28.5,
    predictionTarget: 30.0,
    targetDirection: 'UP',
    odds: 2.4,
    totalPot: 15420,
    minimumBet: 10,
    timeLeft: 86400000, // 24 hours
    participantCount: 234,
    trendingScore: 95,
    cardName: 'Tesla Motors',
    cardCategory: 'AUTOMOTIVE',
    isHot: true,
    volume24h: 8750
  },
  {
    id: '2',
    title: 'OpenAI Acquisition Value',
    description: 'Will OpenAI be acquired for more than $150B by a major tech company this year?',
    metricType: 'USER_GROWTH',
    currentValue: 180,
    predictionTarget: 200,
    targetDirection: 'UP',
    odds: 1.8,
    totalPot: 22100,
    minimumBet: 25,
    timeLeft: 432000000, // 5 days
    participantCount: 567,
    trendingScore: 88,
    cardName: 'OpenAI',
    cardCategory: 'TECHNOLOGY',
    isHot: true,
    volume24h: 12340
  },
  {
    id: '3',
    title: 'Shopify Stock Performance',
    description: 'Will Shopify stock price drop below $45 this quarter?',
    metricType: 'VALUATION_CHANGE',
    currentValue: 52.3,
    predictionTarget: 45.0,
    targetDirection: 'DOWN',
    odds: 3.2,
    totalPot: 8900,
    minimumBet: 15,
    timeLeft: 1728000000, // 20 days
    participantCount: 123,
    trendingScore: 72,
    cardName: 'Shopify',
    cardCategory: 'TECHNOLOGY',
    isHot: false,
    volume24h: 4200
  },
  {
    id: '4',
    title: 'Netflix Subscriber Growth',
    description: 'Will Netflix gain 10M+ new subscribers in Q1?',
    metricType: 'USER_GROWTH',
    currentValue: 260,
    predictionTarget: 270,
    targetDirection: 'UP',
    odds: 2.1,
    totalPot: 18750,
    minimumBet: 20,
    timeLeft: 2592000000, // 30 days
    participantCount: 445,
    trendingScore: 82,
    cardName: 'Netflix',
    cardCategory: 'ENTERTAINMENT',
    isHot: false,
    volume24h: 6800
  }
]

const getMetricIcon = (type: string) => {
  switch (type) {
    case 'REVENUE_GROWTH': return <DollarSign className="h-4 w-4" />
    case 'USER_GROWTH': return <Users className="h-4 w-4" />
    case 'VALUATION_CHANGE': return <BarChart3 className="h-4 w-4" />
    default: return <Target className="h-4 w-4" />
  }
}

const formatTimeLeft = (ms: number) => {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h`
  return 'Ending soon'
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function BettingMarkets({ onPlaceBet, filterCategory }: BettingMarketsProps) {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState<number>(50)
  const [selectedDirection, setSelectedDirection] = useState<'UP' | 'DOWN'>('UP')
  // Use externally provided category if available; default to 'all'
  const category = filterCategory ?? 'all'
  const [sortBy, setSortBy] = useState<string>('trending')

  const filteredMarkets = mockMarkets
    .filter(market => category === 'all' || market.cardCategory === category)
    .sort((a, b) => {
      switch (sortBy) {
        case 'trending': return b.trendingScore - a.trendingScore
        case 'volume': return b.volume24h - a.volume24h
        case 'pot': return b.totalPot - a.totalPot
        case 'time': return a.timeLeft - b.timeLeft
        default: return 0
      }
    })

  const MarketCard = ({ market }: { market: BettingMarket }) => {
    const progress = (market.currentValue / market.predictionTarget) * 100
    const isUp = market.targetDirection === 'UP'
    const potentialWin = betAmount * market.odds

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group"
      >
        <Card className="p-6 bg-card border border-border transition-all duration-300 hover:shadow-lg">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {market.isHot && (
                  <Badge className="bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30">
                    <Flame className="h-3 w-3 mr-1" />
                    Hot
                  </Badge>
                )}
                <Badge variant="outline" className="border-[#66D9EF]/30 text-[#66D9EF]">
                  {market.cardCategory}
                </Badge>
                <Badge variant="outline" className="border-[#E6DB74]/30 text-[#E6DB74]">
                  {getMetricIcon(market.metricType)}
                  <span className="ml-1">{market.metricType.replace('_', ' ')}</span>
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {market.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {market.description}
              </p>
            </div>

            <div className="flex flex-col items-end text-right ml-4">
              <div className="flex items-center text-[#A6E22E] font-mono text-lg font-bold">
                {isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {market.odds}x
              </div>
              <div className="text-xs text-muted-foreground">odds</div>
            </div>
          </div>

          {/* Progress & Current Value */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current: {market.currentValue}</span>
              <span className="text-sm text-muted-foreground">Target: {market.predictionTarget}</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-muted border border-border"
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-muted-foreground">{progress.toFixed(1)}% to target</span>
              <span className="text-info">
                {isUp ? 'Bullish' : 'Bearish'} prediction
              </span>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted rounded-lg border border-border">
            <div className="text-center">
              <div className="flex items-center justify-center text-[#E6DB74] mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="font-mono font-bold">{formatNumber(market.totalPot)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Total Pot</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-[#66D9EF] mb-1">
                <Users className="h-4 w-4 mr-1" />
                <span className="font-mono font-bold">{market.participantCount}</span>
              </div>
              <div className="text-xs text-muted-foreground">Players</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-[#FD5C63] mb-1">
                <Timer className="h-4 w-4 mr-1" />
                <span className="font-mono font-bold">{formatTimeLeft(market.timeLeft)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
          </div>

          {/* Betting Interface */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={selectedDirection === 'UP' ? 'default' : 'outline'}
               
                onClick={() => setSelectedDirection('UP')}
                className={`flex-1 ${
                  selectedDirection === 'UP' 
                    ? 'bg-success text-success-foreground hover:bg-success/90' 
                    : 'border-success/30 text-success hover:bg-success/10'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Bet UP
              </Button>
              
              <Button
                variant={selectedDirection === 'DOWN' ? 'default' : 'outline'}
               
                onClick={() => setSelectedDirection('DOWN')}
                className={`flex-1 ${
                  selectedDirection === 'DOWN' 
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                    : 'border-accent/30 text-accent hover:bg-accent/10'
                }`}
              >
                <TrendingDown className="h-4 w-4 mr-1" />
                Bet DOWN
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min={market.minimumBet}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-info"
                  placeholder="Bet amount"
                />
              </div>
              
              <Button
                onClick={() => onPlaceBet?.(market.id, selectedDirection, betAmount)}
                className="bg-gradient-to-r from-[#819AFF] to-[#66D9EF] hover:from-[#819AFF]/80 hover:to-[#66D9EF]/80 text-[#272822] font-semibold px-6"
                disabled={betAmount < market.minimumBet}
              >
                <Zap className="h-4 w-4 mr-1" />
                Place Bet
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Min bet: {market.minimumBet} ECE</span>
              <span>Potential win: <span className="text-success font-mono">{potentialWin.toFixed(0)} ECE</span></span>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent mb-4">
          Prediction Markets
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Prize Picks style betting on company performance metrics. Predict the future, win ECE tokens.
        </p>
      </motion.div>
      

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-4 bg-gradient-to-br from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#A6E22E]">
                {formatNumber(mockMarkets.reduce((sum, m) => sum + m.totalPot, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Pot Value</div>
            </div>
            <DollarSign className="h-8 w-8 text-[#A6E22E]" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#66D9EF]/20 to-[#66D9EF]/10 border border-[#66D9EF]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#66D9EF]">
                {mockMarkets.reduce((sum, m) => sum + m.participantCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <Users className="h-8 w-8 text-[#66D9EF]" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#F92672]/20 to-[#F92672]/10 border border-[#F92672]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#F92672]">
                {mockMarkets.length}
              </div>
              <div className="text-sm text-muted-foreground">Live Markets</div>
            </div>
            <BarChart3 className="h-8 w-8 text-[#F92672]" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#E6DB74]/20 to-[#E6DB74]/10 border border-[#E6DB74]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#E6DB74]">
                {formatNumber(mockMarkets.reduce((sum, m) => sum + m.volume24h, 0))}
              </div>
              <div className="text-sm text-muted-foreground">24h Volume</div>
            </div>
            <TrendingUp className="h-8 w-8 text-[#E6DB74]" />
          </div>
        </Card>
      </motion.div>

      {/* Filters & Controls */}
      <div className="mb-8">
        <div className="flex items-center justify-between mt-0">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-info"
            >
              <option value="trending">Sort by Trending</option>
              <option value="volume">Sort by Volume</option>
              <option value="pot">Sort by Pot Size</option>
              <option value="time">Sort by Time Left</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{filteredMarkets.length} active markets</span>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  )
}
