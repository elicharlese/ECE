'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompanyCard, CompanyCardData, sampleCompanyCards } from '@/components/cards/CompanyCard'
import { 
  Gavel, 
  TrendingUp, 
  Sword, 
  Timer, 
  Users,
  DollarSign,
  Target,
  Zap,
  Crown,
  Filter,
  Search,
  ArrowUpDown,
  BarChart3,
  Flame,
  Trophy,
  Shield,
  Eye,
  Heart,
  Share2,
  Plus,
  Minus,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react'

// Auction system interfaces
interface AuctionListing {
  id: string
  card: CompanyCardData
  currentBid: number
  startingBid: number
  reservePrice?: number
  bidIncrement: number
  endTime: Date
  bidCount: number
  watchers: number
  seller: string
  status: 'active' | 'ending_soon' | 'ended' | 'completed'
  bids: AuctionBid[]
  autoExtend: boolean
}

interface AuctionBid {
  id: string
  bidder: string
  amount: number
  timestamp: Date
  isWinning: boolean
}

// Betting market interfaces
interface BettingMarket {
  id: string
  card: CompanyCardData
  metricType: 'REVENUE_GROWTH' | 'USER_GROWTH' | 'STOCK_PRICE' | 'MARKET_CAP'
  title: string
  description: string
  currentValue: number
  targetValue: number
  direction: 'UP' | 'DOWN'
  odds: number
  totalPot: number
  expiryDate: Date
  status: 'active' | 'settled' | 'cancelled'
  positions: BettingPosition[]
}

interface BettingPosition {
  id: string
  user: string
  direction: 'UP' | 'DOWN'
  amount: number
  odds: number
  potentialWinning: number
}

// M&A Battle interfaces
interface MABattle {
  id: string
  initiatorCard: CompanyCardData
  targetCard: CompanyCardData
  battleType: 'MERGER' | 'ACQUISITION' | 'STRATEGIC_ALLIANCE'
  title: string
  description: string
  stakes: number
  votingEndTime: Date
  status: 'pending' | 'active' | 'voting' | 'completed'
  votes: BattleVote[]
  proposals: BattleProposal[]
}

interface BattleVote {
  id: string
  voter: string
  choice: 'APPROVE' | 'REJECT'
  weight: number
  reasoning?: string
}

interface BattleProposal {
  id: string
  proposer: string
  title: string
  terms: string
  valuation: number
  supportVotes: number
  againstVotes: number
}

interface AdvancedMarketplaceProps {
  className?: string
}

export const AdvancedMarketplace: React.FC<AdvancedMarketplaceProps> = ({
  className
}) => {
  const [activeTab, setActiveTab] = useState('auctions')
  const [selectedCard, setSelectedCard] = useState<CompanyCardData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('ending_soon')
  const [filterRarity, setFilterRarity] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Sample data - in real app this would come from API
  const [auctions, setAuctions] = useState<AuctionListing[]>([
    {
      id: 'auction-001',
      card: sampleCompanyCards[0],
      currentBid: 15000,
      startingBid: 10000,
      reservePrice: 20000,
      bidIncrement: 500,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      bidCount: 23,
      watchers: 156,
      seller: 'CorporateStrategist',
      status: 'active',
      bids: [
        {
          id: 'bid-001',
          bidder: 'MAExpert',
          amount: 15000,
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isWinning: true
        }
      ],
      autoExtend: true
    }
  ])

  const [bettingMarkets, setBettingMarkets] = useState<BettingMarket[]>([
    {
      id: 'market-001',
      card: sampleCompanyCards[0],
      metricType: 'REVENUE_GROWTH',
      title: 'Q4 Revenue Growth',
      description: 'Will TechNova Corp achieve >15% revenue growth in Q4?',
      currentValue: 12.3,
      targetValue: 15.0,
      direction: 'UP',
      odds: 2.4,
      totalPot: 45000,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'active',
      positions: []
    }
  ])

  const [maBattles, setMABattles] = useState<MABattle[]>([
    {
      id: 'battle-001',
      initiatorCard: sampleCompanyCards[0],
      targetCard: sampleCompanyCards[1],
      battleType: 'ACQUISITION',
      title: 'Tech vs Finance Showdown',
      description: 'TechNova Corp attempts hostile takeover of MegaBank Financial',
      stakes: 100000,
      votingEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'active',
      votes: [],
      proposals: []
    }
  ])

  // Time formatting utilities
  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  // Auction components
  const AuctionCard = ({ auction }: { auction: AuctionListing }) => {
    const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.bidIncrement)
    const timeRemaining = formatTimeRemaining(auction.endTime)
    const isEndingSoon = auction.endTime.getTime() - Date.now() < 60 * 60 * 1000 // 1 hour

    const handleBid = () => {
      // In real app, this would call API
      console.log('Placing bid:', bidAmount)
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className={cn(
          'overflow-hidden transition-all duration-300',
          'hover:shadow-card-ece-hover border-2',
          isEndingSoon ? 'border-red-400/50 shadow-red-400/20' : 'border-border/50'
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-bold">{auction.card.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={isEndingSoon ? 'destructive' : 'secondary'}>
                    <Timer className="w-3 h-3 mr-1" />
                    {timeRemaining}
                  </Badge>
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {auction.watchers}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-monokai-accent">
                  {formatCurrency(auction.currentBid)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {auction.bidCount} bids
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Company card preview */}
            <div className="relative">
              <CompanyCard
                card={auction.card}
                variant="compact"
                showActions={false}
                isInteractive={false}
                className="pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white text-sm font-medium">
                  Reserve: {auction.reservePrice ? formatCurrency(auction.reservePrice) : 'None'}
                </div>
              </div>
            </div>

            {/* Bidding interface */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={auction.currentBid + auction.bidIncrement}
                  step={auction.bidIncrement}
                  className="flex-1"
                />
                <Button
                  onClick={handleBid}
                  disabled={bidAmount < auction.currentBid + auction.bidIncrement}
                  className="bg-monokai-accent hover:bg-monokai-accent/90"
                >
                  <Gavel className="w-4 h-4 mr-2" />
                  BID
                </Button>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min bid: {formatCurrency(auction.currentBid + auction.bidIncrement)}</span>
                <span>Increment: {formatCurrency(auction.bidIncrement)}</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                Watch
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-1" />
                History
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Betting market component
  const BettingMarketCard = ({ market }: { market: BettingMarket }) => {
    const [betAmount, setBetAmount] = useState(100)
    const [selectedDirection, setSelectedDirection] = useState<'UP' | 'DOWN' | null>(null)
    const timeRemaining = formatTimeRemaining(market.expiryDate)

    const handlePlaceBet = () => {
      if (!selectedDirection) return
      console.log('Placing bet:', { amount: betAmount, direction: selectedDirection })
    }

    const progressPercentage = (market.currentValue / market.targetValue) * 100

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden hover:shadow-card-ece-hover transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-bold">{market.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {market.description}
                </p>
              </div>
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {timeRemaining}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: {market.currentValue}%</span>
                <span>Target: {market.targetValue}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-monokai-accent to-monokai-info h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Market stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-monokai-accent">
                  {market.odds}x
                </div>
                <div className="text-xs text-muted-foreground">Odds</div>
              </div>
              <div>
                <div className="text-lg font-bold text-monokai-success">
                  {formatCurrency(market.totalPot)}
                </div>
                <div className="text-xs text-muted-foreground">Total Pot</div>
              </div>
              <div>
                <div className="text-lg font-bold text-monokai-info">
                  {market.positions.length}
                </div>
                <div className="text-xs text-muted-foreground">Positions</div>
              </div>
            </div>

            {/* Betting interface */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedDirection === 'UP' ? 'default' : 'outline'}
                  onClick={() => setSelectedDirection('UP')}
                  className={cn(
                    selectedDirection === 'UP' && 'bg-green-500 hover:bg-green-600'
                  )}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  UP
                </Button>
                <Button
                  variant={selectedDirection === 'DOWN' ? 'default' : 'outline'}
                  onClick={() => setSelectedDirection('DOWN')}
                  className={cn(
                    selectedDirection === 'DOWN' && 'bg-red-500 hover:bg-red-600'
                  )}
                >
                  <TrendingUp className="w-4 h-4 mr-2 rotate-180" />
                  DOWN
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min={10}
                  placeholder="Bet amount"
                  className="flex-1"
                />
                <Button
                  onClick={handlePlaceBet}
                  disabled={!selectedDirection || betAmount < 10}
                  className="bg-monokai-accent hover:bg-monokai-accent/90"
                >
                  BET
                </Button>
              </div>

              {selectedDirection && (
                <div className="text-xs text-muted-foreground text-center">
                  Potential winning: {formatCurrency(betAmount * market.odds)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // M&A Battle component
  const MABattleCard = ({ battle }: { battle: MABattle }) => {
    const [selectedVote, setSelectedVote] = useState<'APPROVE' | 'REJECT' | null>(null)
    const timeRemaining = formatTimeRemaining(battle.votingEndTime)

    const handleVote = () => {
      if (!selectedVote) return
      console.log('Voting:', selectedVote)
    }

    const totalVotes = battle.votes.length
    const approveVotes = battle.votes.filter(v => v.choice === 'APPROVE').length
    const approvalRate = totalVotes > 0 ? (approveVotes / totalVotes) * 100 : 0

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden hover:shadow-card-ece-hover transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sword className="w-5 h-5 text-red-400" />
                  {battle.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {battle.description}
                </p>
              </div>
              <Badge variant="secondary">
                <Timer className="w-3 h-3 mr-1" />
                {timeRemaining}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Battle cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-monokai-accent mb-2">INITIATOR</div>
                <CompanyCard
                  card={battle.initiatorCard}
                  variant="compact"
                  showActions={false}
                  isInteractive={false}
                  className="pointer-events-none scale-75 origin-center"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-monokai-info mb-2">TARGET</div>
                <CompanyCard
                  card={battle.targetCard}
                  variant="compact"
                  showActions={false}
                  isInteractive={false}
                  className="pointer-events-none scale-75 origin-center"
                />
              </div>
            </div>

            {/* Battle stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-monokai-warning">
                  {formatCurrency(battle.stakes)}
                </div>
                <div className="text-xs text-muted-foreground">Stakes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-monokai-success">
                  {totalVotes}
                </div>
                <div className="text-xs text-muted-foreground">Votes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-monokai-info">
                  {approvalRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Approval</div>
              </div>
            </div>

            {/* Voting interface */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedVote === 'APPROVE' ? 'default' : 'outline'}
                  onClick={() => setSelectedVote('APPROVE')}
                  className={cn(
                    selectedVote === 'APPROVE' && 'bg-green-500 hover:bg-green-600'
                  )}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  APPROVE
                </Button>
                <Button
                  variant={selectedVote === 'REJECT' ? 'default' : 'outline'}
                  onClick={() => setSelectedVote('REJECT')}
                  className={cn(
                    selectedVote === 'REJECT' && 'bg-red-500 hover:bg-red-600'
                  )}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  REJECT
                </Button>
              </div>

              <Button
                onClick={handleVote}
                disabled={!selectedVote}
                className="w-full bg-monokai-accent hover:bg-monokai-accent/90"
              >
                CAST VOTE
              </Button>
            </div>

            {/* Voting progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Approve: {approveVotes}</span>
                <span className="text-red-400">Reject: {totalVotes - approveVotes}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${approvalRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-monokai-accent to-monokai-info bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🏪 Advanced M&A Marketplace
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Trade company cards, place strategic bets, and participate in M&A battles with advanced marketplace features.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, auctions, markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Sort By</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="ending_soon">Ending Soon</option>
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="most_watched">Most Watched</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Rarity</label>
                  <select 
                    value={filterRarity} 
                    onChange={(e) => setFilterRarity(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">All Rarities</option>
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                    <option value="mythic">Mythic</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option value="all">All Categories</option>
                    <option value="TECH">Technology</option>
                    <option value="FINANCE">Finance</option>
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="ENERGY">Energy</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main marketplace tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="auctions" className="flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            Auctions ({auctions.length})
          </TabsTrigger>
          <TabsTrigger value="betting" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Betting Markets ({bettingMarkets.length})
          </TabsTrigger>
          <TabsTrigger value="battles" className="flex items-center gap-2">
            <Sword className="w-4 h-4" />
            M&A Battles ({maBattles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auctions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="betting" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bettingMarkets.map((market) => (
              <BettingMarketCard key={market.id} market={market} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="battles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {maBattles.map((battle) => (
              <MABattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Gavel className="w-8 h-8 mx-auto mb-2 text-monokai-accent" />
          <div className="text-2xl font-bold">{auctions.length}</div>
          <div className="text-sm text-muted-foreground">Active Auctions</div>
        </Card>
        <Card className="p-4 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-monokai-success" />
          <div className="text-2xl font-bold">{bettingMarkets.length}</div>
          <div className="text-sm text-muted-foreground">Betting Markets</div>
        </Card>
        <Card className="p-4 text-center">
          <Sword className="w-8 h-8 mx-auto mb-2 text-monokai-warning" />
          <div className="text-2xl font-bold">{maBattles.length}</div>
          <div className="text-sm text-muted-foreground">M&A Battles</div>
        </Card>
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-monokai-info" />
          <div className="text-2xl font-bold">$2.4M</div>
          <div className="text-sm text-muted-foreground">Total Volume</div>
        </Card>
      </div>
    </div>
  )
}