'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gavel, 
  Clock, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Activity, 
  Users, 
  Star, 
  Award, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Timer, 
  BarChart3,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Download,
  Plus,
  Filter,
  Search,
  RefreshCw,
  Heart,
  Bookmark,
  Bell,
  BellOff,
  Calculator,
  Percent,
  Info,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Crown,
  Flame
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

interface AuctionListing {
  id: string
  cardId: string
  cardName: string
  cardTier: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  cardImage: string
  seller: {
    id: string
    username: string
    reputation: number
    totalSales: number
  }
  auctionType: 'standard' | 'reserve' | 'dutch' | 'sealed'
  status: 'active' | 'ending_soon' | 'ended' | 'sold' | 'cancelled'
  startPrice: number
  currentBid: number
  reservePrice?: number
  buyNowPrice?: number
  minBidIncrement: number
  startTime: Date
  endTime: Date
  totalBids: number
  bidders: number
  watchers: number
  isWatched: boolean
  isHot: boolean
  priceHistory: BidHistory[]
  description: string
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair'
}

interface BidHistory {
  id: string
  bidder: string
  amount: number
  timestamp: Date
  type: 'manual' | 'auto' | 'proxy'
  isWinning: boolean
}

interface UserBid {
  id: string
  auctionId: string
  amount: number
  maxAmount?: number
  type: 'manual' | 'auto' | 'proxy'
  status: 'active' | 'outbid' | 'winning' | 'won' | 'lost' | 'cancelled'
  placedAt: Date
  isProxy: boolean
  notifications: boolean
}

interface BidStrategy {
  id: string
  name: string
  description: string
  isActive: boolean
  rules: {
    maxBudget: number
    categories: string[]
    tiers: string[]
    conditions: string[]
    maxBidIncrement: number
    snipeTimeSeconds: number
    autoExtend: boolean
  }
}

interface BiddingStats {
  totalBids: number
  activeBids: number
  wonAuctions: number
  lostAuctions: number
  totalSpent: number
  avgWinPrice: number
  successRate: number
  watchedItems: number
}

interface BiddingSystemProps {
  className?: string
}

export function BiddingSystem({ className = '' }: BiddingSystemProps) {
  const [activeTab, setActiveTab] = useState<'auctions' | 'my_bids' | 'strategies' | 'watchlist' | 'history'>('auctions')
  const [selectedAuction, setSelectedAuction] = useState<AuctionListing | null>(null)
  const [bidAmount, setBidAmount] = useState(0)
  const [maxBidAmount, setMaxBidAmount] = useState(0)
  const [isProxyBid, setIsProxyBid] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'ending_soon' | 'price_low' | 'price_high' | 'most_watched'>('ending_soon')
  const [filterBy, setFilterBy] = useState<'all' | 'watched' | 'hot' | 'no_reserve'>('all')

  // Mock data
  const [userBalance] = useState(25600)
  const [biddingStats] = useState<BiddingStats>({
    totalBids: 147,
    activeBids: 8,
    wonAuctions: 23,
    lostAuctions: 19,
    totalSpent: 45600,
    avgWinPrice: 1983,
    successRate: 54.8,
    watchedItems: 34
  })

  const [auctions] = useState<AuctionListing[]>([
    {
      id: '1',
      cardId: 'tesla-gold-1',
      cardName: 'Tesla Motors Gold Edition',
      cardTier: 'legendary',
      cardImage: '/cards/tesla-gold.jpg',
      seller: {
        id: 'seller1',
        username: 'CryptoKing2024',
        reputation: 98.5,
        totalSales: 156
      },
      auctionType: 'standard',
      status: 'ending_soon',
      startPrice: 1000,
      currentBid: 2450,
      reservePrice: 2000,
      buyNowPrice: 3500,
      minBidIncrement: 50,
      startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      totalBids: 47,
      bidders: 23,
      watchers: 156,
      isWatched: true,
      isHot: true,
      priceHistory: [
        { id: '1', bidder: 'Bidder1', amount: 2400, timestamp: new Date(Date.now() - 30 * 60 * 1000), type: 'manual', isWinning: false },
        { id: '2', bidder: 'Bidder2', amount: 2450, timestamp: new Date(Date.now() - 15 * 60 * 1000), type: 'proxy', isWinning: true }
      ],
      description: 'Ultra-rare Tesla Motors card with premium gold finish and holographic effects.',
      condition: 'mint'
    },
    {
      id: '2',
      cardId: 'openai-dev-1',
      cardName: 'OpenAI Developer Edition',
      cardTier: 'epic',
      cardImage: '/cards/openai-dev.jpg',
      seller: {
        id: 'seller2',
        username: 'AIEnthusiast',
        reputation: 94.2,
        totalSales: 89
      },
      auctionType: 'reserve',
      status: 'active',
      startPrice: 500,
      currentBid: 890,
      reservePrice: 750,
      minBidIncrement: 25,
      startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      totalBids: 28,
      bidders: 19,
      watchers: 89,
      isWatched: false,
      isHot: false,
      priceHistory: [
        { id: '3', bidder: 'Bidder3', amount: 865, timestamp: new Date(Date.now() - 60 * 60 * 1000), type: 'manual', isWinning: false },
        { id: '4', bidder: 'Bidder4', amount: 890, timestamp: new Date(Date.now() - 30 * 60 * 1000), type: 'auto', isWinning: true }
      ],
      description: 'Limited edition OpenAI Developer card featuring exclusive artwork and enhanced stats.',
      condition: 'near_mint'
    }
  ])

  const [userBids] = useState<UserBid[]>([
    {
      id: '1',
      auctionId: '1',
      amount: 2400,
      maxAmount: 2800,
      type: 'proxy',
      status: 'outbid',
      placedAt: new Date(Date.now() - 60 * 60 * 1000),
      isProxy: true,
      notifications: true
    },
    {
      id: '2',
      auctionId: '2',
      amount: 865,
      type: 'manual',
      status: 'outbid',
      placedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isProxy: false,
      notifications: true
    }
  ])

  const [strategies] = useState<BidStrategy[]>([
    {
      id: '1',
      name: 'High-Value Legendaries',
      description: 'Target legendary cards under market value',
      isActive: true,
      rules: {
        maxBudget: 5000,
        categories: ['gaming', 'tech'],
        tiers: ['legendary'],
        conditions: ['mint', 'near_mint'],
        maxBidIncrement: 100,
        snipeTimeSeconds: 30,
        autoExtend: true
      }
    },
    {
      id: '2',
      name: 'Quick Flips',
      description: 'Target undervalued cards for quick resale',
      isActive: false,
      rules: {
        maxBudget: 2000,
        categories: ['all'],
        tiers: ['rare', 'epic'],
        conditions: ['excellent', 'near_mint'],
        maxBidIncrement: 50,
        snipeTimeSeconds: 10,
        autoExtend: false
      }
    }
  ])

  const handlePlaceBid = (auctionId: string, amount: number, isProxy = false, maxAmount?: number) => {
    // Logic to place bid
    console.log('Placing bid:', { auctionId, amount, isProxy, maxAmount })
  }

  const handleWatchAuction = (auctionId: string) => {
    // Logic to watch/unwatch auction
    console.log('Toggling watch for auction:', auctionId)
  }

  const handleBuyNow = (auctionId: string) => {
    // Logic for buy now
    console.log('Buy now for auction:', auctionId)
  }

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'common': return '#75715E'
      case 'rare': return '#66D9EF'
      case 'epic': return '#A6E22E'
      case 'legendary': return '#E6DB74'
      case 'mythic': return '#F92672'
      default: return '#75715E'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#A6E22E'
      case 'ending_soon': return '#F92672'
      case 'ended': return '#75715E'
      case 'sold': return '#66D9EF'
      case 'cancelled': return '#F92672'
      default: return '#75715E'
    }
  }

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'winning': return '#A6E22E'
      case 'outbid': return '#F92672'
      case 'won': return '#66D9EF'
      case 'lost': return '#75715E'
      case 'active': return '#E6DB74'
      default: return '#75715E'
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
                <Gavel className="w-6 h-6 mr-3 text-[#E6DB74]" />
                Auction House
              </h2>
              <p className="text-[#75715E]">
                Bid on exclusive cards and build your ultimate collection
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-lg font-bold text-[#A6E22E]">{userBalance} ECE</div>
                <div className="text-sm text-[#75715E]">Available Balance</div>
              </div>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
                Create Auction
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Bidding Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <GlassCard variant="dark" className="p-6">
          <h3 className="text-lg font-bold text-[#F8EFD6] mb-4">Bidding Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">{biddingStats.activeBids}</div>
              <div className="text-xs text-[#75715E]">Active Bids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">{biddingStats.totalBids}</div>
              <div className="text-xs text-[#75715E]">Total Bids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74] mb-1">{biddingStats.wonAuctions}</div>
              <div className="text-xs text-[#75715E]">Won</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672] mb-1">{biddingStats.successRate}%</div>
              <div className="text-xs text-[#75715E]">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A6E22E] mb-1">{biddingStats.totalSpent.toLocaleString()}</div>
              <div className="text-xs text-[#75715E]">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#66D9EF] mb-1">{biddingStats.avgWinPrice.toLocaleString()}</div>
              <div className="text-xs text-[#75715E]">Avg Win Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6DB74] mb-1">{biddingStats.watchedItems}</div>
              <div className="text-xs text-[#75715E]">Watched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F92672] mb-1">{(userBalance / 1000).toFixed(1)}k</div>
              <div className="text-xs text-[#75715E]">Buying Power</div>
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
              { id: 'auctions', label: 'Auctions', icon: Gavel },
              { id: 'my_bids', label: 'My Bids', icon: Target },
              { id: 'strategies', label: 'Strategies', icon: Zap },
              { id: 'watchlist', label: 'Watchlist', icon: Eye },
              { id: 'history', label: 'History', icon: Clock }
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
                      ? 'bg-gradient-to-r from-[#E6DB74]/20 to-[#A6E22E]/20 text-[#F8EFD6] border border-[#E6DB74]/30'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/30'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#E6DB74]' : ''}`} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Auctions Tab */}
        {activeTab === 'auctions' && (
          <motion.div
            key="auctions"
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
                    placeholder="Search auctions..."
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
                    Sort: {sortBy.replace('_', ' ')}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Active Auctions */}
            <div className="space-y-4">
              {auctions.map((auction) => (
                <motion.div
                  key={auction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <GlassCard variant="dark" className="p-6 hover:border-[#E6DB74]/50 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* Card Image & Info */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div 
                            className="w-32 h-48 rounded-lg border-2 bg-gradient-to-br from-[#272822] to-[#75715E]/20 flex items-center justify-center"
                            style={{ borderColor: getTierColor(auction.cardTier) }}
                          >
                            <span className="text-4xl">🎴</span>
                          </div>
                          {auction.isHot && (
                            <div className="absolute -top-2 -right-2">
                              <Badge variant="destructive" className="bg-[#F92672] text-white">
                                <Flame className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            </div>
                          )}
                          {auction.reservePrice && auction.currentBid >= auction.reservePrice && (
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                              <Badge variant="secondary" className="bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30">
                                Reserve Met
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Auction Details */}
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-bold text-[#F8EFD6]">{auction.cardName}</h4>
                              <Badge 
                                style={{
                                  backgroundColor: `${getTierColor(auction.cardTier)}20`,
                                  color: getTierColor(auction.cardTier),
                                  borderColor: `${getTierColor(auction.cardTier)}30`
                                }}
                              >
                                {auction.cardTier.charAt(0).toUpperCase() + auction.cardTier.slice(1)}
                              </Badge>
                              <Badge 
                                style={{
                                  backgroundColor: `${getStatusColor(auction.status)}20`,
                                  color: getStatusColor(auction.status),
                                  borderColor: `${getStatusColor(auction.status)}30`
                                }}
                              >
                                {auction.status.replace('_', ' ').charAt(0).toUpperCase() + auction.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-[#75715E] mb-2">
                              Seller: {auction.seller.username} ({auction.seller.reputation}% rating)
                            </div>
                            <p className="text-[#75715E] text-sm max-w-2xl">{auction.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWatchAuction(auction.id)}
                            className={auction.isWatched ? 'text-[#F92672]' : 'text-[#75715E]'}
                          >
                            {auction.isWatched ? <Heart className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />}
                          </Button>
                        </div>

                        {/* Auction Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div>
                            <div className="text-2xl font-bold text-[#A6E22E]">{auction.currentBid.toLocaleString()}</div>
                            <div className="text-xs text-[#75715E]">Current Bid</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#66D9EF]">{formatTimeLeft(auction.endTime)}</div>
                            <div className="text-xs text-[#75715E]">Time Left</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#E6DB74]">{auction.totalBids}</div>
                            <div className="text-xs text-[#75715E]">Total Bids</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#F92672]">{auction.bidders}</div>
                            <div className="text-xs text-[#75715E]">Bidders</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#75715E]">{auction.watchers}</div>
                            <div className="text-xs text-[#75715E]">Watching</div>
                          </div>
                        </div>
                      </div>

                      {/* Bidding Interface */}
                      <div className="lg:w-80 space-y-3">
                        {/* Current Bid Display */}
                        <div className="p-4 rounded-lg bg-[#272822]/30 border border-[#75715E]/30">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#A6E22E] mb-1">
                              {auction.currentBid.toLocaleString()} ECE
                            </div>
                            <div className="text-sm text-[#75715E]">
                              Next bid: {(auction.currentBid + auction.minBidIncrement).toLocaleString()} ECE
                            </div>
                          </div>
                        </div>

                        {/* Bid Input */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="Enter bid amount"
                              min={auction.currentBid + auction.minBidIncrement}
                              value={bidAmount || ''}
                              onChange={(e) => setBidAmount(Number(e.target.value))}
                              className="flex-grow"
                            />
                            <Button 
                              onClick={() => handlePlaceBid(auction.id, bidAmount)}
                              disabled={bidAmount < auction.currentBid + auction.minBidIncrement}
                            >
                              Bid
                            </Button>
                          </div>
                          
                          {/* Proxy Bid Option */}
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="proxy-bid"
                              checked={isProxyBid}
                              onCheckedChange={setIsProxyBid}
                            />
                            <label htmlFor="proxy-bid" className="text-sm text-[#F8EFD6]">
                              Proxy Bid
                            </label>
                            <Info className="w-4 h-4 text-[#75715E]" />
                          </div>

                          {isProxyBid && (
                            <Input
                              type="number"
                              placeholder="Maximum bid amount"
                              value={maxBidAmount || ''}
                              onChange={(e) => setMaxBidAmount(Number(e.target.value))}
                            />
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                          {auction.buyNowPrice && (
                            <Button 
                              variant="accent" 
                              className="w-full"
                              onClick={() => handleBuyNow(auction.id)}
                            >
                              Buy Now - {auction.buyNowPrice.toLocaleString()} ECE
                            </Button>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setBidAmount(auction.currentBid + auction.minBidIncrement)}
                            >
                              Min Bid
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setBidAmount(auction.currentBid + auction.minBidIncrement * 2)}
                            >
                              +{auction.minBidIncrement} ECE
                            </Button>
                          </div>
                        </div>

                        {/* Bid History (collapsed) */}
                        <div className="border-t border-[#75715E]/30 pt-3">
                          <Button variant="ghost" size="sm" className="w-full">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Bid History
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'my_bids' && (
          <motion.div
            key="my_bids"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard variant="dark" className="p-6">
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-6">My Active Bids</h3>
              
              <div className="space-y-4">
                {userBids.map((bid) => {
                  const auction = auctions.find(a => a.id === bid.auctionId)
                  
                  return (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-[#75715E]/30 hover:border-[#E6DB74]/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-[#F8EFD6]">{auction?.cardName}</h4>
                            <Badge 
                              style={{
                                backgroundColor: `${getBidStatusColor(bid.status)}20`,
                                color: getBidStatusColor(bid.status),
                                borderColor: `${getBidStatusColor(bid.status)}30`
                              }}
                            >
                              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                            </Badge>
                            {bid.isProxy && (
                              <Badge variant="secondary" className="bg-[#66D9EF]/20 text-[#66D9EF] border-[#66D9EF]/30">
                                Proxy
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-[#75715E] mb-3">
                            Placed: {bid.placedAt.toLocaleDateString()} • 
                            {auction && ` Ends: ${formatTimeLeft(auction.endTime)}`}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-[#A6E22E] font-medium">{bid.amount} ECE</div>
                              <div className="text-[#75715E]">Your Bid</div>
                            </div>
                            <div>
                              <div className="text-[#66D9EF] font-medium">{auction?.currentBid} ECE</div>
                              <div className="text-[#75715E]">Current Bid</div>
                            </div>
                            {bid.maxAmount && (
                              <div>
                                <div className="text-[#E6DB74] font-medium">{bid.maxAmount} ECE</div>
                                <div className="text-[#75715E]">Max Bid</div>
                              </div>
                            )}
                            <div>
                              <div className="text-[#F92672] font-medium">
                                {auction ? formatTimeLeft(auction.endTime) : 'Ended'}
                              </div>
                              <div className="text-[#75715E]">Time Left</div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {bid.notifications ? (
                            <Button variant="ghost" size="sm">
                              <Bell className="w-4 h-4 text-[#A6E22E]" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <BellOff className="w-4 h-4 text-[#75715E]" />
                            </Button>
                          )}
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
