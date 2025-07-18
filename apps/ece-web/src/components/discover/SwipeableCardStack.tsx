'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  X, 
  Star, 
  Eye, 
  TrendingUp,
  Zap,
  Award,
  Target,
  RotateCcw,
  Info
} from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

// Card data interface
export interface DiscoverCard {
  id: string
  title: string
  subtitle: string
  image: string
  currentPrice: number
  priceChange: number
  priceChangePercent: number
  marketCap: number
  volume24h: number
  description: string
  tags: string[]
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  category: string
  trending: boolean
  isWatched?: boolean
  hasActiveBids?: boolean
  hasActiveBets?: boolean
  hasActiveBattles?: boolean
}

interface SwipeableCardStackProps {
  cards: DiscoverCard[]
  onSwipeLeft?: (card: DiscoverCard) => void
  onSwipeRight?: (card: DiscoverCard) => void
  onSuperLike?: (card: DiscoverCard) => void
  onBoost?: (card: DiscoverCard) => void
  onWatchlist?: (card: DiscoverCard) => void
  onUndo?: () => void
  className?: string
  maxVisibleCards?: number
  swipeThreshold?: number
}

// Haptic feedback function
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    }
    navigator.vibrate(patterns[type])
  }
}

// Individual swipeable card component
function SwipeableCard({ 
  card, 
  index, 
  onSwipeLeft, 
  onSwipeRight,
  onSuperLike,
  isTop = false
}: {
  card: DiscoverCard
  index: number
  onSwipeLeft: (card: DiscoverCard) => void
  onSwipeRight: (card: DiscoverCard) => void
  onSuperLike: (card: DiscoverCard) => void
  isTop: boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  
  // Color transforms for swipe feedback
  const cardBackground = useTransform(
    x,
    [-200, -50, 0, 50, 200],
    [
      'rgba(248, 113, 113, 0.2)', // Red for left swipe
      'rgba(248, 113, 113, 0.1)',
      'rgba(255, 255, 255, 0.1)',
      'rgba(34, 197, 94, 0.1)',
      'rgba(34, 197, 94, 0.2)' // Green for right swipe
    ]
  )

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150
    const velocity = Math.abs(info.velocity.x)
    
    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      triggerHaptic('medium')
      
      if (info.offset.x > 0) {
        // Swipe right - like
        onSwipeRight(card)
      } else {
        // Swipe left - pass
        onSwipeLeft(card)
      }
    }
  }

  const handleSuperLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerHaptic('heavy')
    onSuperLike(card)
  }

  // Rarity gradient mapping
  const rarityGradients = {
    common: 'from-[#75715E] to-[#5A5750]',
    uncommon: 'from-[#A6E22E] to-[#8BC34A]',
    rare: 'from-[#66D9EF] to-[#4FC3F7]',
    epic: 'from-[#F92672] to-[#E91E63]',
    legendary: 'from-[#E6DB74] to-[#FFD700]',
    mythic: 'from-[#819AFF] to-[#7B1FA2]'
  }

  const rarityColors = {
    common: '#75715E',
    uncommon: '#A6E22E',
    rare: '#66D9EF',
    epic: '#F92672',
    legendary: '#E6DB74',
    mythic: '#819AFF'
  }

  return (
    <motion.div
      style={{ 
        x, 
        y, 
        rotate,
        opacity,
        zIndex: 10 - index
      }}
      initial={{ scale: 1 - index * 0.05, y: index * 10 }}
      animate={{ 
        scale: isTop ? 1 : 1 - index * 0.05, 
        y: isTop ? 0 : index * 10 
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <motion.div
        style={{ background: cardBackground }}
        className="w-full h-full rounded-2xl overflow-hidden"
      >
        <GlassCard variant="dark" className="w-full h-full border-2 border-white/20 relative overflow-hidden">
          {/* Card Header */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={card.image} 
              alt={card.title}
              className="w-full h-full object-cover"
            />
            
            {/* Trending Badge */}
            {card.trending && (
              <div className="absolute top-4 left-4">
                <Badge 
                  variant="default" 
                  className="bg-[#F92672]/20 text-[#F92672] border-[#F92672]/30"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              </div>
            )}

            {/* Rarity Badge */}
            <div className="absolute top-4 right-4">
              <Badge 
                variant="default" 
                className={`bg-gradient-to-r ${rarityGradients[card.rarity]} text-white border-0`}
              >
                <Award className="w-3 h-3 mr-1" />
                {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
              </Badge>
            </div>

            {/* Super Like Button */}
            <button
              onClick={handleSuperLike}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         w-16 h-16 rounded-full bg-[#66D9EF]/20 backdrop-blur-md border border-[#66D9EF]/30
                         flex items-center justify-center hover:bg-[#66D9EF]/30 transition-all duration-300
                         opacity-0 hover:opacity-100"
            >
              <Star className="w-8 h-8 text-[#66D9EF]" />
            </button>

            {/* Price Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    ${card.currentPrice.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${
                      card.priceChange >= 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'
                    }`}>
                      {card.priceChange >= 0 ? '+' : ''}${card.priceChange.toFixed(2)}
                    </span>
                    <span className={`text-sm ${
                      card.priceChangePercent >= 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'
                    }`}>
                      ({card.priceChangePercent >= 0 ? '+' : ''}{card.priceChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                {/* Activity Indicators */}
                <div className="flex space-x-1">
                  {card.hasActiveBids && (
                    <div className="w-2 h-2 rounded-full bg-[#E6DB74]" title="Active Bids" />
                  )}
                  {card.hasActiveBets && (
                    <div className="w-2 h-2 rounded-full bg-[#F92672]" title="Active Bets" />
                  )}
                  {card.hasActiveBattles && (
                    <div className="w-2 h-2 rounded-full bg-[#66D9EF]" title="Active Battles" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-1">{card.title}</h3>
              <p className="text-[#75715E] text-sm">{card.subtitle}</p>
            </div>

            <p className="text-[#F8EFD6] text-sm leading-relaxed line-clamp-3">
              {card.description}
            </p>

            {/* Market Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#75715E] text-xs">Market Cap</p>
                <p className="text-[#F8EFD6] font-semibold">
                  ${(card.marketCap / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-[#75715E] text-xs">24h Volume</p>
                <p className="text-[#F8EFD6] font-semibold">
                  ${(card.volume24h / 1000).toFixed(1)}K
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {card.tags.slice(0, 3).map((tag, idx) => (
                <Badge 
                  key={idx}
                  variant="secondary" 
                  className="bg-[#272822]/50 text-[#75715E] border-[#75715E]/30 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Swipe Indicators */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: useTransform(x, [-200, -50], [1, 0]) }}
          >
            <div className="w-24 h-24 rounded-full bg-[#F92672]/20 backdrop-blur-md border-4 border-[#F92672] 
                           flex items-center justify-center rotate-12">
              <X className="w-12 h-12 text-[#F92672]" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: useTransform(x, [50, 200], [0, 1]) }}
          >
            <div className="w-24 h-24 rounded-full bg-[#A6E22E]/20 backdrop-blur-md border-4 border-[#A6E22E] 
                           flex items-center justify-center -rotate-12">
              <Heart className="w-12 h-12 text-[#A6E22E]" />
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// Main SwipeableCardStack component
export function SwipeableCardStack({
  cards,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  onBoost,
  onWatchlist,
  onUndo,
  className = '',
  maxVisibleCards = 3,
  swipeThreshold = 150
}: SwipeableCardStackProps) {
  const [currentCards, setCurrentCards] = useState<DiscoverCard[]>([])
  const [swipeHistory, setSwipeHistory] = useState<DiscoverCard[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (cards.length > 0) {
      setCurrentCards(cards.slice(0, maxVisibleCards))
    }
  }, [cards, maxVisibleCards])

  const handleSwipeLeft = useCallback((card: DiscoverCard) => {
    setSwipeHistory(prev => [...prev, card])
    setCurrentCards(prev => {
      const newCards = prev.slice(1)
      const nextCard = cards[cards.length - newCards.length]
      if (nextCard) {
        return [...newCards, nextCard]
      }
      return newCards
    })
    onSwipeLeft?.(card)
  }, [cards, onSwipeLeft])

  const handleSwipeRight = useCallback((card: DiscoverCard) => {
    setSwipeHistory(prev => [...prev, card])
    setCurrentCards(prev => {
      const newCards = prev.slice(1)
      const nextCard = cards[cards.length - newCards.length]
      if (nextCard) {
        return [...newCards, nextCard]
      }
      return newCards
    })
    onSwipeRight?.(card)
  }, [cards, onSwipeRight])

  const handleSuperLike = useCallback((card: DiscoverCard) => {
    setSwipeHistory(prev => [...prev, card])
    setCurrentCards(prev => {
      const newCards = prev.slice(1)
      const nextCard = cards[cards.length - newCards.length]
      if (nextCard) {
        return [...newCards, nextCard]
      }
      return newCards
    })
    onSuperLike?.(card)
  }, [cards, onSuperLike])

  const handleUndo = useCallback(() => {
    if (swipeHistory.length > 0) {
      const lastCard = swipeHistory[swipeHistory.length - 1]
      setSwipeHistory(prev => prev.slice(0, -1))
      setCurrentCards(prev => [lastCard, ...prev.slice(0, maxVisibleCards - 1)])
      onUndo?.()
      triggerHaptic('light')
    }
  }, [swipeHistory, maxVisibleCards, onUndo])

  const currentCard = currentCards[0]

  return (
    <div className={`relative ${className}`}>
      {/* Card Stack Container */}
      <div className="relative w-full h-[600px] md:h-[700px]">
        <AnimatePresence>
          {currentCards.map((card, index) => (
            <SwipeableCard
              key={card.id}
              card={card}
              index={index}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onSuperLike={handleSuperLike}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {currentCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <GlassCard variant="dark" className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#66D9EF]/20 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-[#66D9EF]" />
              </div>
              <h3 className="text-xl font-bold text-[#F8EFD6] mb-2">No More Cards</h3>
              <p className="text-[#75715E] mb-4">
                You've reviewed all available cards. Check back later for new discoveries!
              </p>
              <Button onClick={() => window.location.reload()} variant="secondary">
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center items-center space-x-4 mt-6"
      >
        {/* Undo Button */}
        <Button
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
          variant="secondary"
          size="lg"
          className="w-14 h-14 rounded-full bg-[#75715E]/20 border-[#75715E]/30 hover:bg-[#75715E]/30 disabled:opacity-50"
        >
          <RotateCcw className="w-6 h-6 text-[#75715E]" />
        </Button>

        {/* Pass Button */}
        <Button
          onClick={() => currentCard && handleSwipeLeft(currentCard)}
          disabled={!currentCard}
          variant="secondary"
          size="lg"
          className="w-16 h-16 rounded-full bg-[#F92672]/20 border-[#F92672]/30 hover:bg-[#F92672]/30 disabled:opacity-50"
        >
          <X className="w-8 h-8 text-[#F92672]" />
        </Button>

        {/* Super Like Button */}
        <Button
          onClick={() => currentCard && handleSuperLike(currentCard)}
          disabled={!currentCard}
          variant="secondary"
          size="lg"
          className="w-14 h-14 rounded-full bg-[#66D9EF]/20 border-[#66D9EF]/30 hover:bg-[#66D9EF]/30 disabled:opacity-50"
        >
          <Star className="w-6 h-6 text-[#66D9EF]" />
        </Button>

        {/* Like Button */}
        <Button
          onClick={() => currentCard && handleSwipeRight(currentCard)}
          disabled={!currentCard}
          variant="secondary"
          size="lg"
          className="w-16 h-16 rounded-full bg-[#A6E22E]/20 border-[#A6E22E]/30 hover:bg-[#A6E22E]/30 disabled:opacity-50"
        >
          <Heart className="w-8 h-8 text-[#A6E22E]" />
        </Button>

        {/* Boost Button */}
        <Button
          onClick={() => currentCard && onBoost?.(currentCard)}
          disabled={!currentCard}
          variant="secondary"
          size="lg"
          className="w-14 h-14 rounded-full bg-[#E6DB74]/20 border-[#E6DB74]/30 hover:bg-[#E6DB74]/30 disabled:opacity-50"
        >
          <Zap className="w-6 h-6 text-[#E6DB74]" />
        </Button>
      </motion.div>

      {/* Info Bar */}
      {currentCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-[#75715E] text-sm">
            {currentCards.length} cards remaining • Swipe right to like, left to pass
          </p>
        </motion.div>
      )}
    </div>
  )
}
