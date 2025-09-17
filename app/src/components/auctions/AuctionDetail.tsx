'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Clock, 
  Gavel, 
  DollarSign, 
  Star, 
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  History,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Calendar
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { PriceHistoryChart } from '@/components/analytics/PriceHistoryChart'

interface Auction {
  id: string
  cardName: string
  cardCategory: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'
  currentBid: number
  minBidIncrement: number
  reservePrice: number
  instantBuyPrice?: number
  timeLeft: number
  totalBids: number
  uniqueBidders: number
  watchers: number
  volume24h: number
  highestBidder: string
  sellerName: string
  imageUrl: string
  description: string
  stats: any
}

interface Bid {
  id: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: Date
}

interface AuctionDetailProps {
  auction: Auction
  bids: Bid[]
  onBidPlaced?: (auctionId: string, amount: number) => void
  onAuctionEnded?: (auctionId: string) => void
  formatTimeLeft: (milliseconds: number) => string
}

const rarityColors = {
  COMMON: 'bg-gray-200 text-gray-800',
  RARE: 'bg-blue-200 text-blue-800',
  EPIC: 'bg-purple-200 text-purple-800',
  LEGENDARY: 'bg-yellow-200 text-yellow-800',
  MYTHIC: 'bg-red-200 text-red-800'
}

export function AuctionDetail({ auction, bids, onBidPlaced, onAuctionEnded, formatTimeLeft }: AuctionDetailProps) {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minBidIncrement)
  const [watching, setWatching] = useState(false)
  
  // Simple synthetic price history using auction values to satisfy chart props
  const chartData = Array.from({ length: 10 }, (_, i) => ({
    date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
    price: Math.max(0, auction.currentBid - (9 - i) * auction.minBidIncrement),
  }))
  
  const handleBid = () => {
    if (onBidPlaced) {
      onBidPlaced(auction.id, bidAmount)
    }
  }

  const handleInstantBuy = () => {
    if (onBidPlaced && auction.instantBuyPrice) {
      onBidPlaced(auction.id, auction.instantBuyPrice)
    }
  }

  const handleEndAuction = () => {
    if (onAuctionEnded) {
      onAuctionEnded(auction.id)
    }
  }

  const getRarityColor = () => {
    return rarityColors[auction.rarity] || 'bg-gray-200 text-gray-800'
  }

  const getPriceChangeIcon = () => {
    if (auction.volume24h > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (auction.volume24h < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <TrendingUp className="h-4 w-4 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Card and Auction Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Display */}
          <GlassCard>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{auction.cardName}</h1>
                  <p className="text-muted-foreground">{auction.cardCategory}</p>
                </div>
                <Badge className={getRarityColor()}>{auction.rarity}</Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                {auction.imageUrl ? (
                  <img 
                    src={auction.imageUrl} 
                    alt={auction.cardName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Time Left Badge */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatTimeLeft(auction.timeLeft)}</span>
                </div>
                
                {/* Watch Button */}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute top-4 right-4"
                  onClick={() => setWatching(!watching)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {watching ? 'Watching' : 'Watch'}
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">{auction.description}</p>
                
                {/* Card Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {auction.stats && Object.entries(auction.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground capitalize">{key}</p>
                      <p className="font-bold">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </GlassCard>
          
          {/* Price History Chart */}
          <GlassCard>
            <CardHeader>
              <h2 className="text-xl font-bold">Price History</h2>
            </CardHeader>
            <CardContent>
              <PriceHistoryChart cardName={auction.cardName} data={chartData} />
            </CardContent>
          </GlassCard>
        </div>
        
        {/* Right Column - Auction Details and Bidding */}
        <div className="space-y-6">
          {/* Auction Details */}
          <GlassCard>
            <CardHeader>
              <h2 className="text-xl font-bold">Auction Details</h2>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{auction.sellerName}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="text-2xl font-bold">{auction.currentBid.toFixed(2)} ECE</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bid Increment</p>
                  <p className="font-medium">+{auction.minBidIncrement.toFixed(2)} ECE</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Reserve Price</p>
                  <p className="font-medium">{auction.reservePrice.toFixed(2)} ECE</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Total Bids</p>
                  <p className="font-medium">{auction.totalBids}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Unique Bidders</p>
                  <p className="font-medium">{auction.uniqueBidders}</p>
                </div>
              </div>
              
              {auction.reservePrice > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to Reserve</span>
                    <span>{((auction.currentBid / auction.reservePrice) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={(auction.currentBid / auction.reservePrice) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                {getPriceChangeIcon()}
                <span>24h Change: {auction.volume24h > 0 ? '+' : ''}{auction.volume24h.toFixed(2)}%</span>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              <div className="flex gap-2 w-full">
                <Input 
                  type="number" 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                  min={auction.currentBid + auction.minBidIncrement}
                  step={auction.minBidIncrement}
                  className="flex-1"
                />
                <Button 
                  onClick={handleBid}
                  disabled={bidAmount < auction.currentBid + auction.minBidIncrement}
                >
                  <Gavel className="h-4 w-4 mr-1" />
                  Place Bid
                </Button>
              </div>
              
              {auction.instantBuyPrice && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleInstantBuy}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Buy Now: {auction.instantBuyPrice.toFixed(2)} ECE
                </Button>
              )}
              
              {auction.sellerName === 'CurrentUser' && (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleEndAuction}
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  End Auction Early
                </Button>
              )}
            </CardFooter>
          </GlassCard>
          
          {/* Bid History */}
          <GlassCard>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <h2 className="text-xl font-bold">Bid History</h2>
                <Badge variant="secondary">{bids.length} bids</Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bids.length > 0 ? (
                  bids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{bid.bidderName}</p>
                          <p className="text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(bid.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{bid.amount.toFixed(2)} ECE</p>
                        {bid.bidderName === auction.highestBidder && (
                          <Badge variant="default" className="text-xs mt-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Leading
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2" />
                    <p>No bids yet</p>
                    <p className="text-sm mt-1">Be the first to place a bid!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
