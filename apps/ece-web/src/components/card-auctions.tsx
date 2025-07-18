'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Eye, 
  Gavel, 
  DollarSign, 
  BarChart3,
  Activity,
  Zap,
  Trophy,
  Users,
  Timer,
  Star,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface PriceHistory {
  timestamp: number
  price: number
  volume: number
}

interface CardAuction {
  id: string
  cardName: string
  cardCategory: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  currentBid: number
  minBidIncrement: number
  reservePrice: number
  instantBuyPrice?: number
  timeLeft: number
  totalBids: number
  uniqueBidders: number
  watchers: number
  volume24h: number
  priceHistory: PriceHistory[]
  highestBidder: string
  sellerReputation: number
  cardLevel: number
  cardPower: number
  isHot: boolean
  trending: boolean
  priceChange24h: number
  imageUrl?: string
  description: string
}

interface CardAuctionsProps {
  onPlaceBid?: (auctionId: string, amount: number) => void
  onInstantBuy?: (auctionId: string) => void
  onWatchAuction?: (auctionId: string) => void
}

const mockAuctions: CardAuction[] = [
  {
    id: '1',
    cardName: 'Tesla Motors Gold Edition',
    cardCategory: 'AUTOMOTIVE',
    rarity: 'LEGENDARY',
    currentBid: 2450,
    minBidIncrement: 50,
    reservePrice: 2000,
    instantBuyPrice: 3500,
    timeLeft: 3600000, // 1 hour
    totalBids: 47,
    uniqueBidders: 23,
    watchers: 156,
    volume24h: 18750,
    priceHistory: [
      { timestamp: Date.now() - 86400000, price: 2100, volume: 5 },
      { timestamp: Date.now() - 82800000, price: 2200, volume: 8 },
      { timestamp: Date.now() - 79200000, price: 2350, volume: 12 },
      { timestamp: Date.now() - 75600000, price: 2400, volume: 15 },
      { timestamp: Date.now() - 72000000, price: 2450, volume: 7 }
    ],
    highestBidder: 'CryptoTrader2024',
    sellerReputation: 98,
    cardLevel: 15,
    cardPower: 950,
    isHot: true,
    trending: true,
    priceChange24h: 16.7,
    description: 'Ultra-rare Tesla Motors card with premium gold finish. High-performance stats and exclusive artwork.'
  },
  {
    id: '2',
    cardName: 'OpenAI Developer Edition',
    cardCategory: 'TECHNOLOGY',
    rarity: 'EPIC',
    currentBid: 890,
    minBidIncrement: 25,
    reservePrice: 750,
    instantBuyPrice: 1200,
    timeLeft: 7200000, // 2 hours
    totalBids: 28,
    uniqueBidders: 19,
    watchers: 89,
    volume24h: 5420,
    priceHistory: [
      { timestamp: Date.now() - 86400000, price: 750, volume: 3 },
      { timestamp: Date.now() - 82800000, price: 800, volume: 6 },
      { timestamp: Date.now() - 79200000, price: 850, volume: 9 },
      { timestamp: Date.now() - 75600000, price: 875, volume: 7 },
      { timestamp: Date.now() - 72000000, price: 890, volume: 3 }
    ],
    highestBidder: 'AIEnthusiast',
    sellerReputation: 94,
    cardLevel: 12,
    cardPower: 720,
    isHot: false,
    trending: true,
    priceChange24h: 18.7,
    description: 'Limited edition OpenAI card featuring cutting-edge AI technology metrics and stunning digital artwork.'
  },
  {
    id: '3',
    cardName: 'Netflix Streaming King',
    cardCategory: 'ENTERTAINMENT',
    rarity: 'RARE',
    currentBid: 320,
    minBidIncrement: 15,
    reservePrice: 250,
    timeLeft: 14400000, // 4 hours
    totalBids: 15,
    uniqueBidders: 12,
    watchers: 34,
    volume24h: 1890,
    priceHistory: [
      { timestamp: Date.now() - 86400000, price: 280, volume: 2 },
      { timestamp: Date.now() - 82800000, price: 295, volume: 4 },
      { timestamp: Date.now() - 79200000, price: 310, volume: 5 },
      { timestamp: Date.now() - 75600000, price: 315, volume: 3 },
      { timestamp: Date.now() - 72000000, price: 320, volume: 1 }
    ],
    highestBidder: 'StreamFan99',
    sellerReputation: 87,
    cardLevel: 8,
    cardPower: 420,
    isHot: false,
    trending: false,
    priceChange24h: 14.3,
    description: 'Popular Netflix entertainment card with solid growth metrics and eye-catching design.'
  }
]

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'LEGENDARY': return '#F92672'
    case 'EPIC': return '#A6E22E'
    case 'RARE': return '#66D9EF'
    case 'COMMON': return '#75715E'
    default: return '#75715E'
  }
}

const getRarityGradient = (rarity: string) => {
  switch (rarity) {
    case 'LEGENDARY': return 'from-[#F92672]/20 to-[#FD5C63]/20'
    case 'EPIC': return 'from-[#A6E22E]/20 to-[#3EBA7C]/20'
    case 'RARE': return 'from-[#66D9EF]/20 to-[#819AFF]/20'
    case 'COMMON': return 'from-[#75715E]/20 to-[#75715E]/10'
    default: return 'from-[#75715E]/20 to-[#75715E]/10'
  }
}

const formatTimeLeft = (ms: number) => {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m`
  return 'Ending soon'
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const MiniChart = ({ data, color }: { data: PriceHistory[], color: string }) => {
  const maxPrice = Math.max(...data.map(d => d.price))
  const minPrice = Math.min(...data.map(d => d.price))
  const range = maxPrice - minPrice || 1

  return (
    <div className="relative h-16 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={data.map((point, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 50 - ((point.price - minPrice) / range) * 40
            return `${x},${y}`
          }).join(' ')}
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#gradient-${color})`}
          points={`0,50 ${data.map((point, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 50 - ((point.price - minPrice) / range) * 40
            return `${x},${y}`
          }).join(' ')} 100,50`}
        />
      </svg>
    </div>
  )
}

export function CardAuctions({ onPlaceBid, onInstantBuy, onWatchAuction }: CardAuctionsProps) {
  const [bidAmount, setBidAmount] = useState<{ [key: string]: number }>({})
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null)
  const [filterRarity, setFilterRarity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('ending-soon')

  const filteredAuctions = mockAuctions
    .filter(auction => filterRarity === 'all' || auction.rarity === filterRarity)
    .sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon': return a.timeLeft - b.timeLeft
        case 'price-high': return b.currentBid - a.currentBid
        case 'price-low': return a.currentBid - b.currentBid
        case 'most-bids': return b.totalBids - a.totalBids
        case 'trending': return b.priceChange24h - a.priceChange24h
        default: return 0
      }
    })

  const AuctionCard = ({ auction }: { auction: CardAuction }) => {
    const currentBidAmount = bidAmount[auction.id] || auction.currentBid + auction.minBidIncrement
    const rarityColor = getRarityColor(auction.rarity)
    const gradientClass = getRarityGradient(auction.rarity)

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group"
      >
        <Card className={`overflow-hidden bg-gradient-to-br ${gradientClass} backdrop-blur-xl border border-[#75715E]/30 hover:border-[${rarityColor}]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[${rarityColor}]/20`}>
          {/* Header */}
          <div className="p-4 border-b border-[#75715E]/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {auction.isHot && (
                    <Badge className="bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30">
                      🔥 Hot
                    </Badge>
                  )}
                  {auction.trending && (
                    <Badge className="bg-[#A6E22E]/20 text-[#A6E22E] border-[#A6E22E]/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <Badge>
                    {auction.rarity}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-[#F8EFD6] mb-1">
                  {auction.cardName}
                </h3>
                <p className="text-sm text-[#75715E] mb-2">
                  {auction.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-[#75715E]">
                  <span>Level {auction.cardLevel}</span>
                  <span>Power: {auction.cardPower}</span>
                  <span>Seller: ⭐ {auction.sellerReputation}%</span>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="flex items-center text-[#A6E22E] mb-1">
                  {auction.priceChange24h > 0 ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                  <span className="font-mono text-sm">
                    {auction.priceChange24h > 0 ? '+' : ''}{auction.priceChange24h.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-[#75715E]">24h change</div>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="mb-3">
              <MiniChart data={auction.priceHistory} color={rarityColor} />
            </div>
          </div>

          {/* Current Bid & Stats */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-[#F8EFD6] font-mono">
                  {auction.currentBid.toLocaleString()} ECE
                </div>
                <div className="text-sm text-[#75715E]">Current Bid</div>
                {auction.instantBuyPrice && (
                  <div className="text-sm text-[#66D9EF] mt-1">
                    Buy Now: {auction.instantBuyPrice.toLocaleString()} ECE
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#75715E]">Time Left:</span>
                  <span className="text-[#FD5C63] font-mono font-bold">
                    {formatTimeLeft(auction.timeLeft)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#75715E]">Bids:</span>
                  <span className="text-[#E6DB74]">{auction.totalBids}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#75715E]">Watchers:</span>
                  <span className="text-[#66D9EF]">{auction.watchers}</span>
                </div>
              </div>
            </div>

            {/* Webull-style Stats Bar */}
            <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-[#272822]/50 rounded-lg border border-[#75715E]/20">
              <div className="text-center">
                <div className="flex items-center justify-center text-[#E6DB74] mb-1">
                  <Gavel className="h-4 w-4 mr-1" />
                  <span className="font-mono text-sm font-bold">{auction.totalBids}</span>
                </div>
                <div className="text-xs text-[#75715E]">Bids</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center text-[#66D9EF] mb-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="font-mono text-sm font-bold">{auction.uniqueBidders}</span>
                </div>
                <div className="text-xs text-[#75715E]">Bidders</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center text-[#A6E22E] mb-1">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="font-mono text-sm font-bold">{auction.watchers}</span>
                </div>
                <div className="text-xs text-[#75715E]">Watching</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center text-[#F92672] mb-1">
                  <Activity className="h-4 w-4 mr-1" />
                  <span className="font-mono text-sm font-bold">{formatNumber(auction.volume24h)}</span>
                </div>
                <div className="text-xs text-[#75715E]">Volume</div>
              </div>
            </div>

            {/* Bidding Interface */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={currentBidAmount}
                    onChange={(e) => setBidAmount({
                      ...bidAmount,
                      [auction.id]: Number(e.target.value)
                    })}
                    min={auction.currentBid + auction.minBidIncrement}
                    step={auction.minBidIncrement}
                    className="w-full px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] font-mono focus:border-[#66D9EF]/50 focus:outline-none"
                    placeholder="Your bid"
                  />
                  <div className="text-xs text-[#75715E] mt-1">
                    Min: {(auction.currentBid + auction.minBidIncrement).toLocaleString()} ECE
                  </div>
                </div>
                
                <Button
                  onClick={() => onPlaceBid?.(auction.id, currentBidAmount)}
                  className="bg-gradient-to-r from-[#819AFF] to-[#66D9EF] hover:from-[#819AFF]/80 hover:to-[#66D9EF]/80 text-[#272822] font-semibold px-6"
                  disabled={currentBidAmount < auction.currentBid + auction.minBidIncrement}
                >
                  <Gavel className="h-4 w-4 mr-1" />
                  Place Bid
                </Button>
              </div>

              <div className="flex gap-2">
                {auction.instantBuyPrice && (
                  <Button
                    onClick={() => onInstantBuy?.(auction.id)}
                    className="flex-1 bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Buy Now - {auction.instantBuyPrice.toLocaleString()} ECE
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => onWatchAuction?.(auction.id)}
                  className="border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Watch
                </Button>
              </div>
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A6E22E] to-[#66D9EF] bg-clip-text text-transparent mb-4">
          Card Auctions
        </h1>
        <p className="text-lg text-[#75715E] max-w-2xl mx-auto">
          Webull-style analytics for trading card auctions. Track price movements, bid strategically, win exclusive cards.
        </p>
      </motion.div>

      {/* Filters & Controls */}
      <div className="mb-8">
        <Tabs value={filterRarity} onValueChange={setFilterRarity} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#272822]/50 border border-[#75715E]/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#A6E22E] data-[state=active]:text-[#272822]">
              All Rarities
            </TabsTrigger>
            <TabsTrigger value="LEGENDARY" className="data-[state=active]:bg-[#F92672] data-[state=active]:text-[#F8EFD6]">
              Legendary
            </TabsTrigger>
            <TabsTrigger value="EPIC" className="data-[state=active]:bg-[#A6E22E] data-[state=active]:text-[#272822]">
              Epic
            </TabsTrigger>
            <TabsTrigger value="RARE" className="data-[state=active]:bg-[#66D9EF] data-[state=active]:text-[#272822]">
              Rare
            </TabsTrigger>
            <TabsTrigger value="COMMON" className="data-[state=active]:bg-[#75715E] data-[state=active]:text-[#F8EFD6]">
              Common
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] focus:border-[#66D9EF]/50 focus:outline-none"
            >
              <option value="ending-soon">Ending Soon</option>
              <option value="price-high">Highest Price</option>
              <option value="price-low">Lowest Price</option>
              <option value="most-bids">Most Bids</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#75715E]">
            <Gavel className="h-4 w-4" />
            <span>{filteredAuctions.length} active auctions</span>
          </div>
        </div>
      </div>

      {/* Auctions Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Market Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-4 bg-gradient-to-br from-[#F92672]/20 to-[#F92672]/10 border border-[#F92672]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#F92672]">
                {formatNumber(mockAuctions.reduce((sum, a) => sum + a.currentBid, 0))}
              </div>
              <div className="text-sm text-[#75715E]">Total Auction Value</div>
            </div>
            <DollarSign className="h-8 w-8 text-[#F92672]" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#A6E22E]">
                {mockAuctions.reduce((sum, a) => sum + a.totalBids, 0)}
              </div>
              <div className="text-sm text-[#75715E]">Total Bids</div>
            </div>
            <Gavel className="h-8 w-8 text-[#A6E22E]" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#66D9EF]/20 to-[#66D9EF]/10 border border-[#66D9EF]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#66D9EF]">
                {mockAuctions.reduce((sum, a) => sum + a.uniqueBidders, 0)}
              </div>
              <div className="text-sm text-[#75715E]">Active Bidders</div>
            </div>
            <Users className="h-8 w-8 text-[#66D9EF]" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#E6DB74]/20 to-[#E6DB74]/10 border border-[#E6DB74]/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#E6DB74]">
                {mockAuctions.filter(a => a.trending).length}
              </div>
              <div className="text-sm text-[#75715E]">Trending Items</div>
            </div>
            <TrendingUp className="h-8 w-8 text-[#E6DB74]" />
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
