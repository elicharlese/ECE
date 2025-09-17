'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
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
  Activity,
  PieChart
} from 'lucide-react'
import { BettingMarkets } from '../../components/betting-markets'
import { CardAuctions } from '../../components/card-auctions'
import { MABattles } from '../../components/ma-battles'

interface MarketplaceStats {
  totalVolume: number
  activeUsers: number
  dailyTransactions: number
  totalRewards: number
}

const defaultStats: MarketplaceStats = {
  totalVolume: 2850000,
  activeUsers: 15420,
  dailyTransactions: 8750,
  totalRewards: 450000
}

export default function MarketplacePage() {
  const stats = defaultStats
  const [activeTab, setActiveTab] = useState('betting')
  const [userBalance, setUserBalance] = useState(5000)
  const [marketCategory, setMarketCategory] = useState<string>('all')
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
      case 'bet_win': return <Trophy className="h-4 w-4 text-success" />
      case 'bet_placed': return <Target className="h-4 w-4 text-info" />
      case 'auction_outbid': return <Gavel className="h-4 w-4 text-accent" />
      case 'bid_placed': return <Gavel className="h-4 w-4 text-info" />
      case 'instant_buy': return <Zap className="h-4 w-4 text-success" />
      case 'battle_result': return <Sword className="h-4 w-4 text-accent" />
      case 'battle_vote': return <Sword className="h-4 w-4 text-info" />
      default: return <Star className="h-4 w-4 text-warning" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card border border-border mb-1">
                <TabsTrigger 
                  value="betting" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent/80 data-[state=active]:text-accent-foreground"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Corporate Prediction Markets
                </TabsTrigger>
                <TabsTrigger 
                  value="auctions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-success/80 data-[state=active]:text-success-foreground"
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  M&A Card Auctions
                </TabsTrigger>
                <TabsTrigger 
                  value="battles"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-info data-[state=active]:to-info/80 data-[state=active]:text-info-foreground"
                >
                  <Sword className="h-4 w-4 mr-2" />
                  M&A Battles
                </TabsTrigger>
                <TabsTrigger 
                  value="portfolio"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-warning data-[state=active]:to-warning/80 data-[state=active]:text-warning-foreground"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Portfolio Analytics
                </TabsTrigger>
              </TabsList>

              <AnimatePresence>
                <TabsContent key="betting" value="betting" className="mt-0">
                  <motion.div
                    key="betting"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Category Tabs for Prediction Markets */}
                    <div className="mt-1 mb-4">
                      <Tabs value={marketCategory} onValueChange={setMarketCategory} className="w-full">
                        <TabsList className="grid w-full grid-cols-6 bg-card border border-border h-9">
                          <TabsTrigger value="all" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                            All Markets
                          </TabsTrigger>
                          <TabsTrigger value="TECHNOLOGY" className="data-[state=active]:bg-info data-[state=active]:text-info-foreground">
                            Tech
                          </TabsTrigger>
                          <TabsTrigger value="AUTOMOTIVE" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                            Auto
                          </TabsTrigger>
                          <TabsTrigger value="ENTERTAINMENT" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
                            Entertainment
                          </TabsTrigger>
                          <TabsTrigger value="FINANCE" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                            Finance
                          </TabsTrigger>
                          <TabsTrigger value="trending" className="data-[state=active]:bg-info data-[state=active]:text-info-foreground">
                            Hot
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <BettingMarkets onPlaceBet={handlePlaceBet} filterCategory={marketCategory} />
                  </motion.div>
                </TabsContent>

                <TabsContent key="auctions" value="auctions" className="mt-0">
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

                <TabsContent key="battles" value="battles" className="mt-0">
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
                
                <TabsContent key="portfolio" value="portfolio" className="mt-0">
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="p-6 bg-card border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-success" />
                          Portfolio Performance
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Value</span>
                            <span className="text-foreground font-mono">12,500 ECE</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">24h Change</span>
                            <span className="text-success font-mono">+2.3%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Best Performer</span>
                            <span className="text-foreground font-mono">Tesla Inc.</span>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-6 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                          <PieChart className="h-5 w-5 mr-2 text-info" />
                          Asset Allocation
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                              <span className="text-foreground">Technology</span>
                            </div>
                            <span className="text-muted-foreground font-mono">65%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                              <span className="text-foreground">Entertainment</span>
                            </div>
                            <span className="text-muted-foreground font-mono">10%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-info rounded-full mr-2"></div>
                              <span className="text-foreground">E-commerce</span>
                            </div>
                            <span className="text-muted-foreground font-mono">25%</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <Card className="p-6 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-warning" />
                        Market Trends
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg border border-border">
                          <div>
                            <div className="text-foreground font-medium">Tesla Inc.</div>
                            <div className="text-xs text-muted-foreground">Technology • Legendary</div>
                          </div>
                          <div className="text-right">
                            <div className="text-success font-mono">+8.6%</div>
                            <div className="text-xs text-muted-foreground">15,200 ECE</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg border border-border">
                          <div>
                            <div className="text-foreground font-medium">Google LLC</div>
                            <div className="text-xs text-muted-foreground">Technology • Legendary</div>
                          </div>
                          <div className="text-right">
                            <div className="text-success font-mono">+6.6%</div>
                            <div className="text-xs text-muted-foreground">13,800 ECE</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg border border-border">
                          <div>
                            <div className="text-foreground font-medium">Meta Platforms</div>
                            <div className="text-xs text-muted-foreground">Technology • Epic</div>
                          </div>
                          <div className="text-right">
                            <div className="text-accent font-mono">-4.5%</div>
                            <div className="text-xs text-muted-foreground">9,600 ECE</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="p-4 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-warning" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => setActiveTab('betting')}
                  className="w-full justify-start bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-accent hover:from-accent/30 hover:to-accent/20"
                  variant="outline"
                >
                  <Target className="h-4 w-4 mr-2" />
                  View Hot Markets
                </Button>
                
                <Button
                  onClick={() => setActiveTab('auctions')}
                  className="w-full justify-start bg-gradient-to-r from-success/20 to-success/10 border border-success/30 text-success hover:from-success/30 hover:to-success/20"
                  variant="outline"
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  Ending Soon Auctions
                </Button>
                
                <Button
                  onClick={() => setActiveTab('battles')}
                  className="w-full justify-start bg-gradient-to-r from-info/20 to-info/10 border border-info/30 text-info hover:from-info/30 hover:to-info/20"
                  variant="outline"
                >
                  <Sword className="h-4 w-4 mr-2" />
                  Join M&A Battle
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-4 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-info" />
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-border"
                  >
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-tight">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Trending */}
            <Card className="p-4 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center">
                <Flame className="h-4 w-4 mr-2 text-accent" />
                Trending Now
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Tesla Q4 Revenue</div>
                    <div className="text-xs text-muted-foreground">Prediction Market</div>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Hot
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Tesla Gold Edition</div>
                    <div className="text-xs text-muted-foreground">Card Auction</div>
                  </div>
                  <Badge className="bg-accent/20 text-accent border-accent/30">
                    <Timer className="h-3 w-3 mr-1" />
                    1h left
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Tesla vs Netflix</div>
                    <div className="text-xs text-muted-foreground">M&A Battle</div>
                  </div>
                  <Badge className="bg-info/20 text-info border-info/30">
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
