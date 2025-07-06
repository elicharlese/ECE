'use client'

import React, { useState, useEffect } from 'react'
import { SwipeableCardStack } from '@/components/discover/SwipeableCardStack'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Filter, 
  Settings, 
  BarChart3,
  Heart,
  Eye,
  Star,
  Zap
} from 'lucide-react'

// Mock card data for development
const mockCards = [
  {
    id: '1',
    name: 'Tesla Model S',
    description: 'Revolutionary electric luxury sedan with cutting-edge autopilot technology and industry-leading range.',
    imageUrl: '/cards/tesla-model-s.jpg',
    emoji: '🚗',
    rarity: 'legendary' as const,
    price: 89990,
    marketTrend: '+15.2%',
    volume: '4.2K',
    category: 'automotive',
    tier: 6
  },
  {
    id: '2',
    name: 'Apple iPhone 15 Pro',
    description: 'Next-generation smartphone with titanium design, A17 Pro chip, and advanced camera system.',
    imageUrl: '/cards/iphone-15-pro.jpg',
    emoji: '📱',
    rarity: 'epic' as const,
    price: 1199,
    marketTrend: '+8.7%',
    volume: '12.5K',
    category: 'technology',
    tier: 5
  },
  {
    id: '3',
    name: 'Bitcoin',
    description: 'The world\'s first and most valuable cryptocurrency, digital gold for the modern era.',
    imageUrl: '/cards/bitcoin.jpg',
    emoji: '₿',
    rarity: 'legendary' as const,
    price: 67500,
    marketTrend: '-3.1%',
    volume: '28.9K',
    category: 'cryptocurrency',
    tier: 6
  },
  {
    id: '4',
    name: 'NVIDIA RTX 4090',
    description: 'Ultimate gaming and AI graphics card with unprecedented performance and ray tracing capabilities.',
    imageUrl: '/cards/rtx-4090.jpg',
    emoji: '🎮',
    rarity: 'epic' as const,
    price: 1599,
    marketTrend: '+22.3%',
    volume: '3.8K',
    category: 'technology',
    tier: 5
  },
  {
    id: '5',
    name: 'Rolex Submariner',
    description: 'Iconic luxury dive watch with Swiss precision, timeless design, and exceptional craftsmanship.',
    imageUrl: '/cards/rolex-submariner.jpg',
    emoji: '⌚',
    rarity: 'rare' as const,
    price: 14500,
    marketTrend: '+5.9%',
    volume: '892',
    category: 'luxury',
    tier: 4
  }
]

export default function Discover() {
  const [likedCards, setLikedCards] = useState<string[]>([])
  const [watchlistCards, setWatchlistCards] = useState<string[]>([])
  const [superLikedCards, setSuperLikedCards] = useState<string[]>([])
  const [passedCards, setPassedCards] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])

  // Filter cards based on user preferences
  const filteredCards = mockCards.filter(card => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(card.category)) {
      return false
    }
    if (selectedRarities.length > 0 && !selectedRarities.includes(card.rarity)) {
      return false
    }
    // Don't show cards that have already been interacted with
    return !passedCards.includes(card.id) && 
           !likedCards.includes(card.id) && 
           !watchlistCards.includes(card.id) &&
           !superLikedCards.includes(card.id)
  })

  // Swipe handlers
  const handleSwipeLeft = (card: any) => {
    setPassedCards(prev => [...prev, card.id])
    console.log('Passed on:', card.name)
  }

  const handleSwipeRight = (card: any) => {
    setLikedCards(prev => [...prev, card.id])
    console.log('Liked:', card.name)
  }

  const handleSwipeUp = (card: any) => {
    setSuperLikedCards(prev => [...prev, card.id])
    console.log('Super liked:', card.name)
  }

  const handleSwipeDown = (card: any) => {
    setWatchlistCards(prev => [...prev, card.id])
    console.log('Added to watchlist:', card.name)
  }

  const handleCardTap = (card: any) => {
    console.log('Tapped card:', card.name)
    // Could open detailed view modal
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleRarity = (rarity: string) => {
    setSelectedRarities(prev => 
      prev.includes(rarity) 
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    )
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedRarities([])
  }

  const categories = ['automotive', 'technology', 'cryptocurrency', 'luxury']
  const rarities = ['common', 'rare', 'epic', 'legendary']

  return (
    <div className="min-h-screen bg-gradient-to-br from-beach-monokai-bg via-beach-monokai-bg/95 to-beach-monokai-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-beach-monokai-text mb-2">
              Discover Cards
            </h1>
            <p className="text-beach-monokai-muted">
              Swipe to explore the latest trading cards and opportunities
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(selectedCategories.length > 0 || selectedRarities.length > 0) && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {selectedCategories.length + selectedRarities.length}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <GlassCard className="mb-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-beach-monokai-text">
                Filter Cards
              </h3>
              <Button
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                className="text-beach-monokai-muted hover:text-beach-monokai-text"
              >
                Reset All
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-beach-monokai-text mb-3">
                  Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Rarities */}
              <div>
                <h4 className="text-sm font-medium text-beach-monokai-text mb-3">
                  Rarity
                </h4>
                <div className="flex flex-wrap gap-2">
                  {rarities.map(rarity => (
                    <Badge
                      key={rarity}
                      variant={selectedRarities.includes(rarity) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => toggleRarity(rarity)}
                    >
                      {rarity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4 text-center">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-beach-monokai-text">
              {likedCards.length}
            </div>
            <div className="text-sm text-beach-monokai-muted">Liked</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <Star className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-beach-monokai-text">
              {superLikedCards.length}
            </div>
            <div className="text-sm text-beach-monokai-muted">Super Liked</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <Eye className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-beach-monokai-text">
              {watchlistCards.length}
            </div>
            <div className="text-sm text-beach-monokai-muted">Watching</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-beach-monokai-text">
              {filteredCards.length}
            </div>
            <div className="text-sm text-beach-monokai-muted">Remaining</div>
          </GlassCard>
        </div>

        {/* Swipeable Card Stack */}
        <div className="flex justify-center">
          <SwipeableCardStack
            cards={filteredCards}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipeUp={handleSwipeUp}
            onSwipeDown={handleSwipeDown}
            onCardTap={handleCardTap}
            showActionButtons={true}
            enableKeyboardNavigation={true}
            swipeThreshold={100}
            maxStackSize={3}
            preloadCount={5}
          />
        </div>

        {/* Action Legend */}
        <div className="mt-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-beach-monokai-text mb-4 text-center">
              Swipe Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  ←
                </div>
                <span className="text-sm text-beach-monokai-muted">
                  Swipe Left to Pass
                </span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  →
                </div>
                <span className="text-sm text-beach-monokai-muted">
                  Swipe Right to Like
                </span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  ↑
                </div>
                <span className="text-sm text-beach-monokai-muted">
                  Swipe Up for Super Like
                </span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  ↓
                </div>
                <span className="text-sm text-beach-monokai-muted">
                  Swipe Down to Watch
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
