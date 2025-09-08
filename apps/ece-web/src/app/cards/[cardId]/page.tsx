'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, Star, Heart, Share2, TrendingUp, Users, 
  Gavel, Trophy, Target, Zap, Shield, Sword,
  BarChart3, Clock, Eye, MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Card3DViewer } from '@/components/profile/Card3DViewer'
import { BattlePreparation } from '@/components/battles/BattlePreparation'
import { BidInterface } from '@/components/bidding/BidInterface'
import { BetInterface } from '@/components/betting/BetInterface'

export default function CardProfilePage() {
  const params = useParams()
  const cardId = params?.cardId as string
  const [activeTab, setActiveTab] = useState('overview')
  const [isLiked, setIsLiked] = useState(false)
  const [watchersCount, setWatchersCount] = useState(247)

  // Mock card data - replace with actual API call
  const cardData = {
    id: cardId,
    name: 'Tesla Model S Plaid',
    category: 'Technology',
    rarity: 'Mythic',
    currentPrice: 1250,
    marketCap: 25000000,
    owner: 'eceofficial',
    description: 'Revolutionary electric vehicle trading card representing the pinnacle of automotive innovation.',
    stats: {
      speed: 95,
      innovation: 98,
      marketImpact: 92,
      sustainability: 89
    },
    battleStats: {
      attack: 340,
      defense: 285,
      agility: 420,
      special: 380
    },
    priceHistory: [1180, 1200, 1220, 1250],
    tradingVolume: 890000,
    holders: 156,
    battles: { won: 23, lost: 4, total: 27 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Discovery
          </Button>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Card Viewer */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard variant="dark" className="p-6 sticky top-8">
              <Card3DViewer
                cardId={cardData.id}
                cardName={cardData.name}
                cardTier={cardData.rarity.toLowerCase()}
                cardImage={`/cards/${cardData.id}.jpg`}
                className="aspect-[3/4] mb-6"
              />
              
              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Button variant="default" size="sm">
                  <Sword className="w-4 h-4 mr-1" />
                  Battle
                </Button>
                <Button variant="outline" size="sm">
                  <Gavel className="w-4 h-4 mr-1" />
                  Bid
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-1" />
                  Bet
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right Column - Card Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard variant="light" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{cardData.name}</h1>
                    <p className="text-muted-foreground">Owned by @{cardData.owner}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-monokai-accent">${cardData.currentPrice.toLocaleString()}</div>
                    <div className="text-sm text-monokai-success">+12.5% today</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    cardData.rarity === 'Mythic' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300' :
                    cardData.rarity === 'Legendary' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300' :
                    'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300'
                  }`}>
                    {cardData.rarity}
                  </span>
                  <span className="text-sm text-muted-foreground">{cardData.category}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Eye className="w-4 h-4" />
                    {watchersCount} watching
                  </div>
                </div>

                <p className="text-foreground">{cardData.description}</p>
              </GlassCard>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {['overview', 'battle', 'trading', 'analytics'].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? 'default' : 'ghost'}
                    onClick={() => setActiveTab(tab)}
                    className="capitalize whitespace-nowrap"
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {activeTab === 'overview' && (
                <>
                  {/* Card Stats */}
                  <GlassCard variant="light" className="p-6">
                    <h3 className="text-xl font-bold mb-4">Performance Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(cardData.stats).map(([stat, value]) => (
                        <div key={stat} className="text-center">
                          <div className="text-2xl font-bold text-monokai-accent">{value}</div>
                          <div className="text-sm text-muted-foreground capitalize">{stat.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Market Data */}
                  <GlassCard variant="light" className="p-6">
                    <h3 className="text-xl font-bold mb-4">Market Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Market Cap</div>
                        <div className="text-xl font-bold">${cardData.marketCap.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">24h Volume</div>
                        <div className="text-xl font-bold">${cardData.tradingVolume.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Holders</div>
                        <div className="text-xl font-bold">{cardData.holders}</div>
                      </div>
                    </div>
                  </GlassCard>
                </>
              )}

              {activeTab === 'battle' && (
                <BattlePreparation 
                  card={cardData}
                  onBattleStart={(opponent) => console.log('Battle started against:', opponent)}
                />
              )}

              {activeTab === 'trading' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BidInterface 
                    cardId={cardData.id}
                    currentPrice={cardData.currentPrice}
                    onBidPlaced={(amount) => console.log('Bid placed:', amount)}
                  />
                  <BetInterface 
                    cardId={cardData.id}
                    currentPrice={cardData.currentPrice}
                    onBetPlaced={(prediction) => console.log('Bet placed:', prediction)}
                  />
                </div>
              )}

              {activeTab === 'analytics' && (
                <GlassCard variant="light" className="p-6">
                  <h3 className="text-xl font-bold mb-4">Performance Analytics</h3>
                  <div className="aspect-video bg-gradient-to-br from-monokai-bg/80 to-monokai-bg/60 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-monokai-accent mx-auto mb-4" />
                      <span className="text-foreground text-lg">Advanced Analytics</span>
                      <div className="text-sm text-muted-foreground mt-2">
                        Price trends, battle performance, and market insights
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
