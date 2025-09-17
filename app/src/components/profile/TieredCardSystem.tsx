'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Crown, 
  Zap, 
  Diamond, 
  Flame,
  Shield,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  TrendingUp,
  Award,
  Sparkles,
  Eye
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

// Card Tier Definitions
export interface CardTier {
  id: string
  name: string
  rarity: number // percentage (0-100)
  color: string
  gradient: string
  icon: React.ElementType
  description: string
  minValue: number
  maxValue: number
  effects: string[]
}

export interface TradingCard {
  id: string
  name: string
  tier: string
  image: string
  value: number
  description: string
  owned: boolean
  quantity?: number
  dateAcquired?: string
  lastTrade?: string
  marketTrend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

// Define card tiers from most common to rarest
const cardTiers: CardTier[] = [
  {
    id: 'common',
    name: 'Common',
    rarity: 60,
    color: '#75715E',
    gradient: 'linear-gradient(135deg, #75715E, #5A5750)',
    icon: Shield,
    description: 'Standard cards with basic features',
    minValue: 1,
    maxValue: 50,
    effects: ['Basic animations', 'Standard glow']
  },
  {
    id: 'uncommon',
    name: 'Uncommon',
    rarity: 25,
    color: '#A6E22E',
    gradient: 'linear-gradient(135deg, #A6E22E, #8BC34A)',
    icon: Star,
    description: 'Enhanced cards with improved aesthetics',
    minValue: 51,
    maxValue: 200,
    effects: ['Enhanced glow', 'Subtle particle effects']
  },
  {
    id: 'rare',
    name: 'Rare',
    rarity: 10,
    color: '#66D9EF',
    gradient: 'linear-gradient(135deg, #66D9EF, #4FC3F7)',
    icon: Zap,
    description: 'Valuable cards with special effects',
    minValue: 201,
    maxValue: 1000,
    effects: ['Electric glow', 'Animated borders', 'Floating particles']
  },
  {
    id: 'epic',
    name: 'Epic',
    rarity: 4,
    color: '#F92672',
    gradient: 'linear-gradient(135deg, #F92672, #E91E63)',
    icon: Flame,
    description: 'Premium cards with exceptional features',
    minValue: 1001,
    maxValue: 5000,
    effects: ['Flame effects', 'Pulsing animation', 'Color shifting']
  },
  {
    id: 'legendary',
    name: 'Legendary',
    rarity: 1,
    color: '#E6DB74',
    gradient: 'linear-gradient(135deg, #E6DB74, #FFD700)',
    icon: Crown,
    description: 'Ultra-rare cards with unique abilities',
    minValue: 5001,
    maxValue: 50000,
    effects: ['Golden aura', 'Royal crown', 'Majestic glow', 'Rotating halo']
  },
  {
    id: 'mythic',
    name: 'Mythic',
    rarity: 0.1,
    color: '#819AFF',
    gradient: 'linear-gradient(135deg, #819AFF, #7B1FA2)',
    icon: Diamond,
    description: 'Legendary cards that defy reality',
    minValue: 50001,
    maxValue: 1000000,
    effects: ['Cosmic effects', 'Reality distortion', 'Prismatic aura', 'Dimensional rifts']
  }
]

// Sample card data
const sampleCards: TradingCard[] = [
  {
    id: '1',
    name: 'Digital Phoenix',
    tier: 'legendary',
    image: '/api/placeholder/300/400',
    value: 15000,
    description: 'A mystical phoenix that embodies the spirit of digital transformation',
    owned: true,
    quantity: 1,
    dateAcquired: '2024-01-15',
    marketTrend: 'up',
    trendPercentage: 12.5
  },
  {
    id: '2',
    name: 'Cyber Dragon',
    tier: 'epic',
    image: '/api/placeholder/300/400',
    value: 3500,
    description: 'A powerful dragon infused with cybernetic enhancements',
    owned: true,
    quantity: 2,
    dateAcquired: '2024-02-03',
    marketTrend: 'up',
    trendPercentage: 8.3
  },
  {
    id: '3',
    name: 'Quantum Warrior',
    tier: 'rare',
    image: '/api/placeholder/300/400',
    value: 750,
    description: 'A warrior capable of existing in multiple dimensions',
    owned: true,
    quantity: 1,
    dateAcquired: '2024-02-20',
    marketTrend: 'stable',
    trendPercentage: 0
  },
  {
    id: '4',
    name: 'Code Sprite',
    tier: 'uncommon',
    image: '/api/placeholder/300/400',
    value: 125,
    description: 'A mischievous sprite that manipulates programming languages',
    owned: true,
    quantity: 5,
    dateAcquired: '2024-03-01',
    marketTrend: 'down',
    trendPercentage: -2.1
  },
  {
    id: '5',
    name: 'Void Emperor',
    tier: 'mythic',
    image: '/api/placeholder/300/400',
    value: 250000,
    description: 'The ruler of the digital void, possessing reality-bending powers',
    owned: false,
    quantity: 0,
    marketTrend: 'up',
    trendPercentage: 25.7
  }
]

interface TieredCardSystemProps {
  className?: string
}

export const TieredCardSystem: React.FC<TieredCardSystemProps> = ({ className = '' }) => {
  const [cards, setCards] = useState<TradingCard[]>(sampleCards)
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'rarity' | 'value' | 'name' | 'date'>('rarity')
  const [showOwned, setShowOwned] = useState<'all' | 'owned' | 'unowned'>('all')

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => {
      if (selectedTier !== 'all' && card.tier !== selectedTier) return false
      if (showOwned === 'owned' && !card.owned) return false
      if (showOwned === 'unowned' && card.owned) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          const aTier = cardTiers.find(t => t.id === a.tier)
          const bTier = cardTiers.find(t => t.id === b.tier)
          return (aTier?.rarity || 0) - (bTier?.rarity || 0)
        case 'value':
          return b.value - a.value
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.dateAcquired || '').getTime() - new Date(a.dateAcquired || '').getTime()
        default:
          return 0
      }
    })

  // Calculate tier statistics
  const tierStats = cardTiers.map(tier => {
    const tierCards = cards.filter(card => card.tier === tier.id)
    const ownedCards = tierCards.filter(card => card.owned)
    const totalValue = ownedCards.reduce((sum, card) => sum + (card.value * (card.quantity || 1)), 0)
    
    return {
      ...tier,
      totalCards: tierCards.length,
      ownedCards: ownedCards.length,
      completionPercentage: tierCards.length > 0 ? (ownedCards.length / tierCards.length) * 100 : 0,
      totalValue
    }
  })

  const getTierEffectStyle = (tier: CardTier) => {
    switch (tier.id) {
      case 'legendary':
        return {
          boxShadow: `0 0 20px ${tier.color}40, 0 0 40px ${tier.color}20`,
          borderImage: `${tier.gradient} 1`,
          borderWidth: '2px',
          borderStyle: 'solid'
        }
      case 'mythic':
        return {
          boxShadow: `0 0 30px ${tier.color}60, 0 0 60px ${tier.color}30, 0 0 90px ${tier.color}10`,
          borderImage: `linear-gradient(45deg, ${tier.color}, transparent, ${tier.color}) 1`,
          borderWidth: '3px',
          borderStyle: 'solid',
          background: `linear-gradient(135deg, ${tier.color}10, transparent)`
        }
      case 'epic':
        return {
          boxShadow: `0 0 15px ${tier.color}50, 0 0 30px ${tier.color}25`,
          borderColor: tier.color,
          borderWidth: '2px',
          borderStyle: 'solid'
        }
      default:
        return {
          borderColor: `${tier.color}60`,
          borderWidth: '0',
          borderStyle: 'solid'
        }
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tier Statistics Overview */}
      <GlassCard variant="dark" className="p-6">
        <h3 className="text-xl font-bold text-[#F8EFD6] mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Tier Collection Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tierStats.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div 
                className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-3 relative overflow-hidden"
                style={{ background: tier.gradient }}
              >
                <tier.icon className="w-8 h-8 text-white" />
                {tier.ownedCards > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#A6E22E] rounded-full flex items-center justify-center text-xs font-bold text-[#272822]">
                    {tier.ownedCards}
                  </div>
                )}
              </div>
              
              <div className="text-sm font-semibold text-[#F8EFD6] mb-1">
                {tier.name}
              </div>
              
              <div className="text-xs text-[#75715E] mb-2">
                {tier.rarity < 1 ? `${tier.rarity}%` : `${tier.rarity}%`} rarity
              </div>
              
              <div className="w-full bg-[#272822] rounded-full h-2 mb-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: tier.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${tier.completionPercentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </div>
              
              <div className="text-xs text-[#66D9EF]">
                {tier.ownedCards}/{tier.totalCards}
              </div>
              
              {tier.totalValue > 0 && (
                <div className="text-xs text-[#A6E22E] mt-1">
                  ${tier.totalValue.toLocaleString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Filters and Controls */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Tier Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#66D9EF]" />
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-[#272822] border border-[#75715E] rounded-lg px-3 py-2 text-[#F8EFD6] text-sm focus:border-[#66D9EF] focus:outline-none"
            >
              <option value="all">All Tiers</option>
              {cardTiers.map(tier => (
                <option key={tier.id} value={tier.id}>{tier.name}</option>
              ))}
            </select>
          </div>

          {/* Ownership Filter */}
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-[#66D9EF]" />
            <select
              value={showOwned}
              onChange={(e) => setShowOwned(e.target.value as 'all' | 'owned' | 'unowned')}
              className="bg-[#272822] border border-[#75715E] rounded-lg px-3 py-2 text-[#F8EFD6] text-sm focus:border-[#66D9EF] focus:outline-none"
            >
              <option value="all">All Cards</option>
              <option value="owned">Owned Only</option>
              <option value="unowned">Not Owned</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-[#66D9EF]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rarity' | 'value' | 'name' | 'date')}
              className="bg-[#272822] border border-[#75715E] rounded-lg px-3 py-2 text-[#F8EFD6] text-sm focus:border-[#66D9EF] focus:outline-none"
            >
              <option value="rarity">Sort by Rarity</option>
              <option value="value">Sort by Value</option>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
             
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
             
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Cards Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCards.map((card, index) => {
              const tier = cardTiers.find(t => t.id === card.tier)!
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative group cursor-pointer"
                >
                  <GlassCard
                    variant="dark"
                    className="p-4 h-full relative overflow-hidden transition-all duration-300"
                  >
                    {/* Tier Badge */}
                    <div 
                      className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                      style={{ backgroundColor: `${tier.color}20`, color: tier.color, border: `none` }}
                    >
                      <tier.icon className="w-3 h-3" />
                      <span>{tier.name}</span>
                    </div>

                    {/* Ownership Indicator */}
                    {card.owned && (
                      <div className="absolute top-2 left-2 w-3 h-3 bg-[#A6E22E] rounded-full animate-pulse" />
                    )}

                    {/* Card Image */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-[#272822] to-[#75715E]/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                      <Sparkles className="w-12 h-12 text-[#75715E]" />
                      
                      {/* Tier-specific effects overlay */}
                      {tier.id === 'legendary' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#E6DB74]/10 via-transparent to-[#E6DB74]/10 animate-pulse" />
                      )}
                      {tier.id === 'mythic' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#819AFF]/20 via-transparent to-[#819AFF]/20 animate-pulse" />
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#F8EFD6] group-hover:text-white transition-colors">
                        {card.name}
                      </h4>
                      
                      <p className="text-xs text-[#75715E] line-clamp-2">
                        {card.description}
                      </p>

                      {/* Value and Trend */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold" style={{ color: tier.color }}>
                          ${card.value.toLocaleString()}
                        </div>
                        
                        <div className={`flex items-center text-xs ${
                          card.marketTrend === 'up' ? 'text-[#A6E22E]' :
                          card.marketTrend === 'down' ? 'text-[#F92672]' :
                          'text-[#75715E]'
                        }`}>
                          <TrendingUp className={`w-3 h-3 mr-1 ${
                            card.marketTrend === 'down' ? 'rotate-180' : ''
                          }`} />
                          {card.trendPercentage > 0 ? '+' : ''}{card.trendPercentage}%
                        </div>
                      </div>

                      {/* Quantity for owned cards */}
                      {card.owned && card.quantity && card.quantity > 1 && (
                        <div className="text-xs text-[#66D9EF]">
                          Owned: {card.quantity}
                        </div>
                      )}
                    </div>

                    {/* Hover Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredCards.map((card, index) => {
              const tier = cardTiers.find(t => t.id === card.tier)!
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <GlassCard
                    variant="dark"
                    className="p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer border-l-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Tier Icon */}
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: tier.gradient }}
                        >
                          <tier.icon className="w-5 h-5 text-white" />
                        </div>

                        {/* Card Info */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-[#F8EFD6]">{card.name}</h4>
                            {card.owned && (
                              <div className="w-2 h-2 bg-[#A6E22E] rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-[#75715E]">{tier.name} • {card.description}</p>
                        </div>
                      </div>

                      {/* Value and Actions */}
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: tier.color }}>
                          ${card.value.toLocaleString()}
                        </div>
                        <div className={`text-sm flex items-center ${
                          card.marketTrend === 'up' ? 'text-[#A6E22E]' :
                          card.marketTrend === 'down' ? 'text-[#F92672]' :
                          'text-[#75715E]'
                        }`}>
                          <TrendingUp className={`w-3 h-3 mr-1 ${
                            card.marketTrend === 'down' ? 'rotate-180' : ''
                          }`} />
                          {card.trendPercentage > 0 ? '+' : ''}{card.trendPercentage}%
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredCards.length === 0 && (
        <GlassCard variant="dark" className="p-12 text-center">
          <Star className="w-16 h-16 text-[#75715E] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F8EFD6] mb-2">No Cards Found</h3>
          <p className="text-[#75715E]">
            No cards match your current filters. Try adjusting your search criteria.
          </p>
        </GlassCard>
      )}
    </div>
  )
}

export default TieredCardSystem
