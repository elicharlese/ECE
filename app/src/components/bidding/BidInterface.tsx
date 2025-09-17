'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Gavel, TrendingUp, Clock, Users, DollarSign, 
  AlertTriangle, Check, Plus, Minus, Timer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'

interface BidInterfaceProps {
  cardId: string
  currentPrice: number
  onBidPlaced: (amount: number) => void
}

export function BidInterface({ cardId, currentPrice, onBidPlaced }: BidInterfaceProps) {
  const [bidAmount, setBidAmount] = useState(currentPrice + 50)
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [activeBids, setActiveBids] = useState([
    { id: '1', user: 'techmaster', amount: currentPrice, time: '2m ago', isWinning: true },
    { id: '2', user: 'cryptoking', amount: currentPrice - 25, time: '5m ago', isWinning: false },
    { id: '3', user: 'cardcollector', amount: currentPrice - 50, time: '8m ago', isWinning: false }
  ])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const handleBidSubmit = async () => {
    if (bidAmount <= currentPrice) return
    
    setIsPlacingBid(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onBidPlaced(bidAmount)
    setActiveBids(prev => [
      { id: Date.now().toString(), user: 'you', amount: bidAmount, time: 'now', isWinning: true },
      ...prev.map(bid => ({ ...bid, isWinning: false }))
    ])
    
    setIsPlacingBid(false)
  }

  const quickBidAmounts = [25, 50, 100, 250]

  return (
    <div className="space-y-6">
      {/* Auction Header */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Gavel className="w-5 h-5 text-monokai-accent" />
            Live Auction
          </h3>
          <div className="flex items-center gap-2 text-monokai-warning">
            <Timer className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Bid</div>
            <div className="text-2xl font-bold text-monokai-accent">
              ${currentPrice.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Bids</div>
            <div className="text-2xl font-bold text-monokai-info">
              {activeBids.length}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-monokai-success/10 border border-monokai-success/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-monokai-success" />
            <span className="text-monokai-success">Bidding is active</span>
            <span className="text-muted-foreground">- {activeBids.length} participants</span>
          </div>
        </div>
      </GlassCard>

      {/* Bid Placement */}
      <GlassCard variant="light" className="p-6">
        <h4 className="text-lg font-semibold mb-4">Place Your Bid</h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={currentPrice + 1}
              className="text-lg font-bold"
              placeholder="Enter bid amount"
            />
          </div>

          {/* Quick Bid Buttons */}
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground self-center">Quick add:</span>
            {quickBidAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBidAmount(prev => prev + amount)}
              >
                +${amount}
              </Button>
            ))}
          </div>

          {/* Bid Validation */}
          {bidAmount <= currentPrice && (
            <div className="flex items-center gap-2 text-monokai-warning text-sm">
              <AlertTriangle className="w-4 h-4" />
              Bid must be higher than current price
            </div>
          )}

          {bidAmount > currentPrice && (
            <div className="flex items-center gap-2 text-monokai-success text-sm">
              <Check className="w-4 h-4" />
              Valid bid amount (+${bidAmount - currentPrice})
            </div>
          )}

          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={bidAmount <= currentPrice || isPlacingBid}
            onClick={handleBidSubmit}
          >
            {isPlacingBid ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Placing Bid...
              </>
            ) : (
              <>
                <Gavel className="w-4 h-4 mr-2" />
                Place Bid ${bidAmount.toLocaleString()}
              </>
            )}
          </Button>
        </div>
      </GlassCard>

      {/* Active Bids */}
      <GlassCard variant="light" className="p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Bid History
        </h4>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activeBids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                bid.isWinning 
                  ? 'bg-monokai-success/10 border border-monokai-success/30' 
                  : 'bg-monokai-bg/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  bid.isWinning ? 'bg-monokai-success' : 'bg-muted-foreground'
                }`} />
                <div>
                  <div className="font-medium">
                    @{bid.user}
                    {bid.user === 'you' && (
                      <span className="text-xs text-monokai-accent ml-1">(You)</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{bid.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">${bid.amount.toLocaleString()}</div>
                {bid.isWinning && (
                  <div className="text-xs text-monokai-success">Winning</div>
                )}
              </div>
            </motion.div>
          ))}

          {activeBids.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No bids yet. Be the first to bid!
            </div>
          )}
        </div>
      </GlassCard>

      {/* Bidding Tips */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-monokai-warning mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-monokai-warning">Bidding Tips</div>
            <ul className="text-muted-foreground mt-1 space-y-1">
              <li>• Bids are binding once placed</li>
              <li>• Auto-extend: Auction extends if bid placed in last 5 minutes</li>
              <li>• Higher bids have priority in case of ties</li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
