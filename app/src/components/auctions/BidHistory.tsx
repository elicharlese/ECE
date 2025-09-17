'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Clock, 
  User
} from 'lucide-react'

interface Bid {
  id: string
  bidderId: string
  bidderName: string
  bidderAvatar?: string
  amount: number
  timestamp: string
  isWinningBid?: boolean
}

interface BidHistoryProps {
  bids: Bid[]
  currentPrice: number
  reservePrice?: number
  isAuctionEnded?: boolean
}

export function BidHistory({ bids, currentPrice, reservePrice, isAuctionEnded }: BidHistoryProps) {
  // Sort bids by timestamp (newest first)
  const sortedBids = [...bids].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const bidTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - bidTime.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }
  
  const getBidStatus = (bid: Bid) => {
    if (bid.isWinningBid) return 'winning'
    if (isAuctionEnded) return 'lost'
    return 'active'
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Bid History</h3>
        <Badge variant="secondary" className="text-sm">
          {bids.length} {bids.length === 1 ? 'Bid' : 'Bids'}
        </Badge>
      </div>
      
      {/* Auction Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Current Price</p>
          <p className="font-bold text-lg">{currentPrice.toFixed(2)} ECE</p>
        </div>
        
        {reservePrice && reservePrice > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Reserve Price</p>
            <p className="font-bold text-lg">{reservePrice.toFixed(2)} ECE</p>
            <p className={`text-xs ${currentPrice >= reservePrice ? 'text-green-500' : 'text-yellow-500'}`}>
              {currentPrice >= reservePrice ? 'Reserve Met' : 'Reserve Not Met'}
            </p>
          </div>
        )}
        
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="font-bold text-lg">
            {isAuctionEnded ? 'Ended' : 'Active'}
          </p>
        </div>
      </div>
      
      {/* Bid List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedBids.length > 0 ? (
          sortedBids.map((bid, index) => {
            const status = getBidStatus(bid)
            
            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${status === 'winning' ? 'border-green-500 bg-green-500/10' : status === 'lost' ? 'border-muted' : 'border-primary/20'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={bid.bidderAvatar ?? ''} alt={bid.bidderName} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{bid.bidderName}</p>
                        {status === 'winning' && (
                          <Badge variant="default" className="text-xs">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winning
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(bid.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">{bid.amount.toFixed(2)} ECE</p>
                    <p className="text-xs text-muted-foreground">
                      {((bid.amount / currentPrice - 1) * 100).toFixed(1)}% above
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p>No bids yet</p>
            <p className="text-sm mt-1">Be the first to place a bid on this auction</p>
          </div>
        )}
      </div>
    </div>
  )
}
