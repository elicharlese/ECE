'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, DollarSign } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface TrendingCard {
  id: string
  name: string
  category: string
  currentPrice: number
  priceChange: number
  priceChangePercentage: number
  volume: number
  rank: number
  isNew?: boolean
}

interface MarketTrendsProps {
  trendingCards: TrendingCard[]
  onViewCard?: (cardId: string) => void
  onTradeCard?: (cardId: string) => void
}

export function MarketTrends({ trendingCards, onViewCard, onTradeCard }: MarketTrendsProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  
  // Format volume
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market Trends</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Live</span>
        </div>
      </div>
      
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Market Cap</p>
                <p className="text-xl font-bold">$1.2B</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-green-500 mt-1">+12.4% (24h)</p>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-xl font-bold">$45.6M</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-green-500 mt-1">+8.2% (24h)</p>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cards</p>
                <p className="text-xl font-bold">24.8K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-green-500 mt-1">+3.1% (24h)</p>
          </div>
        </GlassCard>
      </div>
      
      {/* Trending Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold">Trending Cards</h3>
        
        {trendingCards.length > 0 ? (
          trendingCards
            .sort((a, b) => a.rank - b.rank)
            .map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Card Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded bg-primary text-primary-foreground font-bold">
                      #{card.rank}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{card.name}</h4>
                        {card.isNew && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">NEW</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {card.category}
                      </p>
                    </div>
                  </div>
                  
                  {/* Price Info */}
                  <div className="text-right mr-4">
                    <p className="font-bold">{formatCurrency(card.currentPrice)}</p>
                    <div className="flex items-center justify-end gap-1">
                      {card.priceChange >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${card.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercentage(card.priceChangePercentage)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Vol: {formatVolume(card.volume)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onViewCard && onViewCard(card.id)}
                      className="px-3 py-1.5 text-sm rounded border bg-background hover:bg-accent transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => onTradeCard && onTradeCard(card.id)}
                      className="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Trade
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No trending cards</h3>
            <p className="text-sm">
              No cards are currently trending in the marketplace
            </p>
          </div>
        )}
      </div>
      
      {/* Market Insights */}
      <GlassCard>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3">Market Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Tech Sector Surge</p>
                <p className="text-sm text-muted-foreground">
                  Technology cards are up 15.2% this week, driven by new AI startups entering the market.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Gaming Sector Correction</p>
                <p className="text-sm text-muted-foreground">
                  Gaming cards have seen a 8.7% decline after several major titles missed earnings expectations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">New Listings Alert</p>
                <p className="text-sm text-muted-foreground">
                  12 new cards listed today, including 3 from emerging fintech companies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
