'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  Clock, 
  Gavel, 
  DollarSign, 
  Star, 
  TrendingUp,
  TrendingDown,
  Eye,
  Users
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

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

interface AuctionCardProps {
  auction: Auction
  onBidPlaced?: (auctionId: string, amount: number) => void
  formatTimeLeft: (milliseconds: number) => string
}

const rarityColors = {
  COMMON: 'bg-gray-200 text-gray-800',
  RARE: 'bg-blue-200 text-blue-800',
  EPIC: 'bg-purple-200 text-purple-800',
  LEGENDARY: 'bg-yellow-200 text-yellow-800',
  MYTHIC: 'bg-red-200 text-red-800'
}

export function AuctionCard({ auction, onBidPlaced, formatTimeLeft }: AuctionCardProps) {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minBidIncrement)
  
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

  const getRarityColor = () => {
    return rarityColors[auction.rarity] || 'bg-gray-200 text-gray-800'
  }

  const getPriceChangeIcon = () => {
    if (auction.volume24h > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (auction.volume24h < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <TrendingUp className="h-4 w-4 text-gray-500" />
  }

  return (
    <GlassCard className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg truncate">{auction.cardName}</h3>
            <p className="text-sm text-muted-foreground truncate">{auction.cardCategory}</p>
          </div>
          <Badge className={getRarityColor()}>{auction.rarity}</Badge>
        </div>
        
        <div className="absolute top-4 right-4 flex items-center gap-1">
          {getPriceChangeIcon()}
          <span className="text-xs font-medium">
            {auction.volume24h > 0 ? '+' : ''}{auction.volume24h.toFixed(2)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {/* Card Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
          {auction.imageUrl ? (
            <img 
              src={auction.imageUrl} 
              alt={auction.cardName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Star className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Time Left Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeLeft(auction.timeLeft)}
          </div>
          
          {/* Watchers */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {auction.watchers}
          </div>
        </div>
        
        {/* Auction Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Bid</p>
              <p className="font-bold text-xl">{auction.currentBid.toFixed(2)} ECE</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Bid Increment</p>
              <p className="font-medium">+{auction.minBidIncrement.toFixed(2)} ECE</p>
            </div>
          </div>
          
          {auction.reservePrice > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Reserve Price</p>
              <p className="font-medium">{auction.reservePrice.toFixed(2)} ECE</p>
              <Progress 
                value={(auction.currentBid / auction.reservePrice) * 100} 
                className="mt-1"
              />
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <Gavel className="h-4 w-4 text-muted-foreground" />
              <span>{auction.totalBids} bids</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{auction.uniqueBidders} bidders</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
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
            size="sm" 
            onClick={handleBid}
            disabled={bidAmount < auction.currentBid + auction.minBidIncrement}
          >
            <Gavel className="h-4 w-4 mr-1" />
            Bid
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
      </CardFooter>
    </GlassCard>
  )
}
