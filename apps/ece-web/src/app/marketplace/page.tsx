'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Gavel, 
  Sword, 
  DollarSign, 
  Users, 
  Trophy, 
  BarChart3,
  Target,
  Zap,
  Star,
  Flame,
  Eye,
  Timer,
  Activity
} from 'lucide-react'
import { BettingMarkets } from '@/components/betting-markets'
import { CardAuctions } from '@/components/card-auctions'
import { MABattles } from '@/components/ma-battles'

interface MarketplaceStats {
  totalVolume: number
  activeUsers: number
  dailyTransactions: number
  totalRewards: number
}

interface MarketplacePageProps {
  stats?: MarketplaceStats
}

const defaultStats: MarketplaceStats = {
  totalVolume: 2850000,
  activeUsers: 15420,
  dailyTransactions: 8750,
  totalRewards: 450000
}

export default function MarketplacePage({ stats = defaultStats }: MarketplacePageProps) {
  const [activeTab, setActiveTab] = useState('betting')
  const [userBalance, setUserBalance] = useState(5000)
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'bet_win', message: 'You won 250 ECE on Tesla Q4 prediction!', time: '2m ago' },
    { id: '2', type: 'auction_outbid', message: 'You were outbid on OpenAI Developer Edition', time: '15m ago' },
    { id: '3', type: 'battle_result', message: 'Tesla defeated Netflix in M&A Battle', time: '1h ago' }
  ])

  const handlePlaceBet = (marketId: string, direction: 'UP' | 'DOWN', amount: number) => {
    if (amount <= userBalance) {
      setUserBalance(prev => prev - amount)
      // Add success notification
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          type: 'bet_placed',
          message: `Placed ${amount} ECE bet ${direction} on market ${marketId}`,
          time: 'Just now'
        },
        ...prev.slice(0, 4)
      ])
    }
  }

  const handlePlaceBid = (auctionId: string, amount: number) => {
    if (amount <= userBalance) {
      setUserBalance(prev => prev - amount)
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          type: 'bid_placed',
          message: `Bid ${amount} ECE on auction ${auctionId}`,
          time: 'Just now'
        },
        ...prev.slice(0, 4)
      ])
    }
  }

  const handleInstantBuy = (auctionId: string) => {
    // Handle instant buy logic
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        type: 'instant_buy',
        message: `Instantly purchased card from auction ${auctionId}`,
        time: 'Just now'
      },
      ...prev.slice(0, 4)
    ])
  }

  const handleVote = (battleId: string, choice: 'challenger' | 'defender', amount: number) => {
    if (amount <= userBalance) {
      setUserBalance(prev => prev - amount)
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          type: 'battle_vote',
          message: `Voted ${amount} ECE for ${choice} in battle ${battleId}`,
          time: 'Just now'
        },
        ...prev.slice(0, 4)
      ])
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bet_win': return <Trophy className="h-4 w-4 text-[#A6E22E]" />
      case 'bet_placed': return <Target className="h-4 w-4 text-[#66D9EF]" />
      case 'auction_outbid': return <Gavel className="h-4 w-4 text-[#F92672]" />
      case 'bid_placed': return <Gavel className="h-4 w-4 text-[#66D9EF]" />
      case 'instant_buy': return <Zap className="h-4 w-4 text-[#A6E22E]" />
      case 'battle_result': return <Sword className="h-4 w-4 text-[#F92672]" />
      case 'battle_vote': return <Sword className="h-4 w-4 text-[#66D9EF]" />
      default: return <Star className="h-4 w-4 text-[#E6DB74]" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#272822] to-[#1a1a15]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[#75715E]/20 bg-[#272822]/50 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F92672] to-[#66D9EF] bg-clip-text text-transparent">
                ECE Marketplace
              </h1>
              <p className="text-sm text-[#75715E]">
                Trade, bet, and battle with trading cards
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* User Balance */}
              <Card className="px-4 py-2 bg-gradient-to-r from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#A6E22E]" />
                  <span className="font-mono font-bold text-[#A6E22E]">
                    {userBalance.toLocaleString()} ECE
                  </span>
                </div>
              </Card>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
                >
                  <Activity className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-[#F92672] text-[#F8EFD6] text-xs px-1 min-w-[16px] h-4">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-[#75715E]/10 bg-[#272822]/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#A6E22E]/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-[#A6E22E]" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#F8EFD6] font-mono">
                  ${(stats.totalVolume / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-[#75715E]">Total Volume</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#66D9EF]/20 rounded-lg">
                <Users className="h-4 w-4 text-[#66D9EF]" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#F8EFD6] font-mono">
                  {(stats.activeUsers / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-[#75715E]">Active Users</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F92672]/20 rounded-lg">
                <Activity className="h-4 w-4 text-[#F92672]" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#F8EFD6] font-mono">
                  {(stats.dailyTransactions / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-[#75715E]">Daily Trades</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E6DB74]/20 rounded-lg">
                <Trophy className="h-4 w-4 text-[#E6DB74]" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#F8EFD6] font-mono">
                  {(stats.totalRewards / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-[#75715E]">Rewards Paid</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#272822]/50 border border-[#75715E]/30 mb-8">
                <TabsTrigger 
                  value="betting" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F92672] data-[state=active]:to-[#FD5C63] data-[state=active]:text-[#F8EFD6]"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Prediction Markets
                </TabsTrigger>
                <TabsTrigger 
                  value="auctions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#A6E22E] data-[state=active]:to-[#3EBA7C] data-[state=active]:text-[#272822]"
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  Card Auctions
                </TabsTrigger>
                <TabsTrigger 
                  value="battles"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#66D9EF] data-[state=active]:to-[#819AFF] data-[state=active]:text-[#272822]"
                >
                  <Sword className="h-4 w-4 mr-2" />
                  M&A Battles
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="betting" className="mt-0">
                  <motion.div
                    key="betting"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BettingMarkets onPlaceBet={handlePlaceBet} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="auctions" className="mt-0">
                  <motion.div
                    key="auctions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardAuctions 
                      onPlaceBid={handlePlaceBid}
                      onInstantBuy={handleInstantBuy}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="battles" className="mt-0">
                  <motion.div
                    key="battles"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MABattles onVote={handleVote} />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-[#E6DB74]" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => setActiveTab('betting')}
                  className="w-full justify-start bg-gradient-to-r from-[#F92672]/20 to-[#F92672]/10 border border-[#F92672]/30 text-[#F92672] hover:from-[#F92672]/30 hover:to-[#F92672]/20"
                  variant="outline"
                >
                  <Target className="h-4 w-4 mr-2" />
                  View Hot Markets
                </Button>
                
                <Button
                  onClick={() => setActiveTab('auctions')}
                  className="w-full justify-start bg-gradient-to-r from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30 text-[#A6E22E] hover:from-[#A6E22E]/30 hover:to-[#A6E22E]/20"
                  variant="outline"
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  Ending Soon Auctions
                </Button>
                
                <Button
                  onClick={() => setActiveTab('battles')}
                  className="w-full justify-start bg-gradient-to-r from-[#66D9EF]/20 to-[#66D9EF]/10 border border-[#66D9EF]/30 text-[#66D9EF] hover:from-[#66D9EF]/30 hover:to-[#66D9EF]/20"
                  variant="outline"
                >
                  <Sword className="h-4 w-4 mr-2" />
                  Join M&A Battle
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-[#66D9EF]" />
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 bg-[#272822]/50 rounded-lg border border-[#75715E]/20"
                  >
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#F8EFD6] leading-tight">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#75715E] mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Trending */}
            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
                <Flame className="h-5 w-5 mr-2 text-[#F92672]" />
                Trending Now
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#F8EFD6]">Tesla Q4 Revenue</div>
                    <div className="text-xs text-[#75715E]">Prediction Market</div>
                  </div>
                  <Badge className="bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Hot
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#F8EFD6]">Tesla Gold Edition</div>
                    <div className="text-xs text-[#75715E]">Card Auction</div>
                  </div>
                  <Badge className="bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30">
                    <Timer className="h-3 w-3 mr-1" />
                    1h left
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#F8EFD6]">Tesla vs Netflix</div>
                    <div className="text-xs text-[#75715E]">M&A Battle</div>
                  </div>
                  <Badge className="bg-[#66D9EF]/20 text-[#66D9EF] border-[#66D9EF]/30">
                    <Eye className="h-3 w-3 mr-1" />
                    1.2K watching
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
