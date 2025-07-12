'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Activity, 
  Calendar, 
  Clock, 
  BarChart3, 
  PieChart, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Download,
  Plus,
  Filter,
  Search,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Flame,
  Shield,
  Users,
  Award,
  Timer,
  Calculator,
  Percent,
  Info
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

interface BetMarket {
  id: string
  title: string
  description: string
  category: 'stock_price' | 'market_cap' | 'revenue' | 'performance' | 'event'
  status: 'active' | 'closing_soon' | 'settled' | 'cancelled'
  endTime: Date
  totalVolume: number
  participants: number
  outcomes: BetOutcome[]
  rules: string[]
  metadata: {
    company?: string
    metric?: string
    currentValue?: number
    targetValue?: number
    timeframe?: string
  }
}

interface BetOutcome {
  id: string
  title: string
  description: string
  odds: number
  impliedProbability: number
  totalBacked: number
  backerCount: number
  type: 'up' | 'down' | 'exact' | 'range'
  payout?: number
}

interface UserBet {
  id: string
  marketId: string
  outcomeId: string
  amount: number
  odds: number
  potentialWinning: number
  status: 'active' | 'won' | 'lost' | 'refunded' | 'pending'
  placedAt: Date
  settledAt?: Date
  actualPayout?: number
}

interface BetStrategy {
  id: string
  name: string
  description: string
  rules: BetRule[]
  isActive: boolean
  performance: {
    totalBets: number
    winRate: number
    totalProfit: number
    roi: number
  }
}

interface BetRule {
  condition: string
  action: string
  amount: number
  maxLoss: number
}

interface Portfolio {
  totalValue: number
  activeBets: number
  totalProfit: number
  winRate: number
  bestStreak: number
  currentStreak: number
  riskScore: number
  diversification: number
}

interface BettingSystemProps {
  className?: string
}

export function BettingSystem({ className = '' }: BettingSystemProps) {
  const [activeTab, setActiveTab] = useState<'markets' | 'portfolio' | 'strategies' | 'history' | 'analytics'>('markets')
  const [selectedMarket, setSelectedMarket] = useState<BetMarket | null>(null)
  const [betAmount, setBetAmount] = useState(100)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Mock data
  const [userBalance] = useState(15420)
  const [portfolio] = useState<Portfolio>({
    totalValue: 12450,
    activeBets: 8,
    totalProfit: 2340,
    winRate: 64.2,
    bestStreak: 7,
    currentStreak: 3,
    riskScore: 6.5,
    diversification: 8.2
  })

  const [markets] = useState<BetMarket[]>([
    {
      id: '1',
      title: 'Tesla Q4 2024 Revenue',
      description: 'Will Tesla exceed $25B in Q4 2024 revenue?',
      category: 'revenue',
      status: 'active',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalVolume: 145600,
      participants: 234,
      outcomes: [
        {
          id: '1a',
          title: 'Above $25B',
          description: 'Tesla Q4 revenue will be above $25 billion',
          odds: 1.75,
          impliedProbability: 57.1,
          totalBacked: 82400,
          backerCount: 145,
          type: 'up'
        },
        {
          id: '1b',
          title: 'Below $25B',
          description: 'Tesla Q4 revenue will be below $25 billion',
          odds: 2.10,
          impliedProbability: 47.6,
          totalBacked: 63200,
          backerCount: 89,
          type: 'down'
        }
      ],
      rules: [
        'Based on official Tesla earnings report',
        'Revenue must be confirmed by SEC filing',
        'Deadline: 30 days after earnings announcement'
      ],
      metadata: {
        company: 'Tesla',
        metric: 'Revenue',
        currentValue: 23500000000,
        targetValue: 25000000000,
        timeframe: 'Q4 2024'
      }
    },
    {
      id: '2',
      title: 'OpenAI Valuation Target',
      description: 'Will OpenAI reach $100B valuation by end of 2024?',
      category: 'market_cap',
      status: 'closing_soon',
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      totalVolume: 89200,
      participants: 167,
      outcomes: [
        {
          id: '2a',
          title: 'Reaches $100B',
          description: 'OpenAI will be valued at $100B or more',
          odds: 2.45,
          impliedProbability: 40.8,
          totalBacked: 45100,
          backerCount: 98,
          type: 'up'
        },
        {
          id: '2b',
          title: 'Below $100B',
          description: 'OpenAI valuation will remain below $100B',
          odds: 1.55,
          impliedProbability: 64.5,
          totalBacked: 44100,
          backerCount: 69,
          type: 'down'
        }
      ],
      rules: [
        'Based on confirmed funding rounds or acquisition',
        'Valuation must be publicly reported',
        'Market closes December 31, 2024'
      ],
      metadata: {
        company: 'OpenAI',
        metric: 'Valuation',
        currentValue: 86000000000,
        targetValue: 100000000000,
        timeframe: 'End of 2024'
      }
    }
  ])

  const [userBets] = useState<UserBet[]>([
    {
      id: '1',
      marketId: '1',
      outcomeId: '1a',
      amount: 500,
      odds: 1.75,
      potentialWinning: 875,
      status: 'active',
      placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      marketId: '2',
      outcomeId: '2b',
      amount: 300,
      odds: 1.55,
      potentialWinning: 465,
      status: 'active',
      placedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ])

  const handlePlaceBet = (marketId: string, outcomeId: string, amount: number) => {
    // Logic to place bet
    console.log('Placing bet:', { marketId, outcomeId, amount })
  }

  const calculatePotentialWinning = (amount: number, odds: number) => {
    return amount * odds
  }

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#A6E22E'
      case 'closing_soon': return '#E6DB74'
      case 'settled': return '#66D9EF'
      case 'cancelled': return '#F92672'
      default: return '#75715E'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stock_price': return TrendingUp
      case 'market_cap': return BarChart3
      case 'revenue': return DollarSign
      case 'performance': return Target
      case 'event': return Calendar
      default: return Activity
    }
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-[#A6E22E]" />
                Betting Markets
              </h2>
              <p className="text-[#75715E]">
                Predict market outcomes and earn rewards for accurate forecasts
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-lg font-bold text-[#A6E22E]">{userBalance} ECE</div>
                <div className="text-sm text-[#75715E]">Available Balance</div>
              </div>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
                Create Market
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Portfolio Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Portfolio Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">{portfolio.totalValue}</div>
              <div className="text-xs text-[#75715E]">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">{portfolio.activeBets}</div>
              <div className="text-xs text-[#75715E]">Active Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74] mb-1">+{portfolio.totalProfit}</div>
              <div className="text-xs text-[#75715E]">Total Profit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672] mb-1">{portfolio.winRate}%</div>
              <div className="text-xs text-[#75715E]">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">{portfolio.currentStreak}</div>
              <div className="text-xs text-[#75715E]">Win Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">{portfolio.bestStreak}</div>
              <div className="text-xs text-[#75715E]">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74] mb-1">{portfolio.riskScore}/10</div>
              <div className="text-xs text-[#75715E]">Risk Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672] mb-1">{portfolio.diversification}/10</div>
              <div className="text-xs text-[#75715E]">Diversification</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard variant="dark" className="p-2">
          <div className="flex space-x-1">
            {[
              { id: 'markets', label: 'Markets', icon: TrendingUp },
              { id: 'portfolio', label: 'Portfolio', icon: PieChart },
              { id: 'strategies', label: 'Strategies', icon: Target },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 flex-1 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A6E22E]/20 to-[#66D9EF]/20 text-[#F8EFD6] border border-[#A6E22E]/30'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#A6E22E]' : ''}`} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Markets Tab */}
        {activeTab === 'markets' && (
          <motion.div
            key="markets"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <GlassCard variant="dark" className="p-4">
              <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#75715E]" />
                  <Input
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Active Markets */}
            <div className="space-y-4">
              {markets.map((market) => {
                const CategoryIcon = getCategoryIcon(market.category)
                
                return (
                  <motion.div
                    key={market.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <GlassCard variant="dark" className="p-6 hover:border-[#A6E22E]/50 transition-all cursor-pointer">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Market Info */}
                        <div className="flex-grow">
                          <div className="flex items-start space-x-4">
                            <CategoryIcon className="w-6 h-6 text-[#A6E22E] mt-1" />
                            <div className="flex-grow">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-lg font-semibold text-[#F8EFD6]">{market.title}</h4>
                                <Badge 
                                  className="bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30"
                                >
                                  {market.status.replace('_', ' ').charAt(0).toUpperCase() + market.status.slice(1)}
                                </Badge>
                                {market.status === 'closing_soon' && (
                                  <Badge variant="destructive" className="bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30">
                                    <Timer className="w-3 h-3 mr-1" />
                                    Closing Soon
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[#75715E] mb-3">{market.description}</p>
                              
                              {/* Market Stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <div className="text-[#A6E22E] font-medium">{market.totalVolume.toLocaleString()} ECE</div>
                                  <div className="text-[#75715E]">Total Volume</div>
                                </div>
                                <div>
                                  <div className="text-[#66D9EF] font-medium">{market.participants}</div>
                                  <div className="text-[#75715E]">Participants</div>
                                </div>
                                <div>
                                  <div className="text-[#E6DB74] font-medium">{formatTimeLeft(market.endTime)}</div>
                                  <div className="text-[#75715E]">Time Left</div>
                                </div>
                                <div>
                                  <div className="text-[#F92672] font-medium">{market.outcomes.length}</div>
                                  <div className="text-[#75715E]">Outcomes</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Betting Interface */}
                        <div className="lg:w-80 lg:ml-6">
                          <div className="space-y-3">
                            {market.outcomes.map((outcome) => (
                              <div 
                                key={outcome.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-[#272822]/30 border border-[#75715E]/30 hover:border-[#A6E22E]/50 transition-all"
                              >
                                <div className="flex-grow">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {outcome.type === 'up' ? (
                                      <ArrowUp className="w-4 h-4 text-[#A6E22E]" />
                                    ) : (
                                      <ArrowDown className="w-4 h-4 text-[#F92672]" />
                                    )}
                                    <span className="font-medium text-[#F8EFD6]">{outcome.title}</span>
                                  </div>
                                  <div className="text-xs text-[#75715E]">
                                    {outcome.backerCount} backers • {outcome.impliedProbability.toFixed(1)}% probability
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-[#A6E22E]">{outcome.odds.toFixed(2)}x</div>
                                  <Button 
                                    size="sm" 
                                    className="mt-1"
                                    onClick={() => handlePlaceBet(market.id, outcome.id, betAmount)}
                                  >
                                    Bet
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Bet Amount */}
                          <div className="mt-4 p-3 rounded-lg bg-[#272822]/30 border border-[#75715E]/30">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#F8EFD6]">Bet Amount</span>
                              <span className="text-sm text-[#75715E]">{betAmount} ECE</span>
                            </div>
                            <Slider
                              value={[betAmount]}
                              onValueChange={(value) => setBetAmount(value[0])}
                              max={Math.min(userBalance, 5000)}
                              min={10}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-[#75715E] mt-1">
                              <span>10 ECE</span>
                              <span>{Math.min(userBalance, 5000)} ECE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">Active Bets</h3>
              
              <div className="space-y-4">
                {userBets.map((bet) => {
                  const market = markets.find(m => m.id === bet.marketId)
                  const outcome = market?.outcomes.find(o => o.id === bet.outcomeId)
                  
                  return (
                    <motion.div
                      key={bet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-[#75715E]/30 hover:border-[#A6E22E]/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-[#F8EFD6]">{market?.title}</h4>
                            <Badge 
                              variant="secondary" 
                              className={`${
                                bet.status === 'active' 
                                  ? 'bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30'
                                  : bet.status === 'won'
                                  ? 'bg-[#66D9EF]/20 text-[#66D9EF] border-[#66D9EF]/30'
                                  : 'bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30'
                              }`}
                            >
                              {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-sm text-[#75715E] mb-3">
                            Outcome: {outcome?.title} • Placed: {bet.placedAt.toLocaleDateString()}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-[#A6E22E] font-medium">{bet.amount} ECE</div>
                              <div className="text-[#75715E]">Bet Amount</div>
                            </div>
                            <div>
                              <div className="text-[#66D9EF] font-medium">{bet.odds.toFixed(2)}x</div>
                              <div className="text-[#75715E]">Odds</div>
                            </div>
                            <div>
                              <div className="text-[#E6DB74] font-medium">{bet.potentialWinning} ECE</div>
                              <div className="text-[#75715E]">Potential Winning</div>
                            </div>
                            <div>
                              <div className="text-[#F92672] font-medium">
                                {((bet.potentialWinning - bet.amount) / bet.amount * 100).toFixed(1)}%
                              </div>
                              <div className="text-[#75715E]">Potential ROI</div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
