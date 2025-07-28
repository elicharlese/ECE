'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Icons for different card types and rarities
const RarityIcons = {
  common: '⚪',
  rare: '🔵', 
  epic: '🟣',
  legendary: '🟡',
  mythic: '🔴'
}

const StatIcons = {
  attack: '⚔️',
  defense: '🛡️',
  speed: '⚡',
  health: '❤️',
  mana: '💎'
}

const ActionIcons = {
  trade: '🤝',
  pass: '👎',
  collect: '⭐',
  mint: '🪙',
  view: '👁️'
}

interface TradingCardProps {
  card: {
    id: string
    name: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
    price: number
    image?: string
    category?: string
    stats?: {
      attack?: number
      defense?: number
      speed?: number
      health?: number
      mana?: number
    }
    abilities?: string[]
    isNFT?: boolean
  }
  onTrade?: () => void
  onPass?: () => void
  onCollect?: () => void
  onMint?: () => void
  onView?: () => void
  variant?: 'default' | 'compact' | 'showcase'
  className?: string
}

export const TradingCard: React.FC<TradingCardProps> = ({
  card,
  onTrade,
  onPass,
  onCollect,
  onMint,
  onView,
  variant = 'default',
  className
}) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
    mythic: 'from-red-400 to-pink-600'
  }

  const rarityBorderColors = {
    common: 'border-gray-400/50',
    rare: 'border-blue-400/50',
    epic: 'border-purple-400/50',
    legendary: 'border-yellow-400/50',
    mythic: 'border-red-400/50'
  }

  const rarityGlowColors = {
    common: 'shadow-gray-400/20',
    rare: 'shadow-blue-400/30',
    epic: 'shadow-purple-400/30',
    legendary: 'shadow-yellow-400/40',
    mythic: 'shadow-red-400/40'
  }

  const cardVariants = {
    default: 'w-80 h-[480px]',
    compact: 'w-64 h-80',
    showcase: 'w-96 h-[560px]'
  }

  return (
    <motion.div
      className={cn(
        'relative group cursor-pointer',
        cardVariants[variant],
        className
      )}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        z: 50
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <Card className={cn(
        'h-full relative overflow-hidden',
        'glass-card border-2',
        rarityBorderColors[card.rarity],
        'shadow-soft-xl hover:shadow-card-ece-hover',
        rarityGlowColors[card.rarity],
        'transition-all duration-300'
      )}>
        {/* NFT Badge */}
        {card.isNFT && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-gradient-to-r from-monokai-accent to-monokai-purple px-2 py-1 rounded-full text-xs font-bold text-white shadow-soft">
              🪙 NFT
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1 text-shadow-soft">
                {card.name}
              </h3>
              {card.category && (
                <p className="text-sm text-muted-foreground">
                  {card.category}
                </p>
              )}
            </div>
            
            {/* Rarity Badge */}
            <div className={cn(
              'px-3 py-1 rounded-full text-xs font-bold',
              'bg-gradient-to-r',
              rarityColors[card.rarity],
              'text-white shadow-soft flex items-center gap-1'
            )}>
              <span>{RarityIcons[card.rarity]}</span>
              {card.rarity.toUpperCase()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex flex-col h-full">
          {/* Card Image/3D Model Area */}
          <div className={cn(
            'relative flex-1 mb-4 rounded-lg overflow-hidden',
            'bg-gradient-to-br from-background/20 to-card/40',
            'border border-border/50',
            'flex items-center justify-center',
            'shadow-soft group-hover:shadow-soft-lg transition-all duration-300'
          )}>
            {card.image ? (
              <img 
                src={card.image} 
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2 drop-shadow-icon">
                  ✦
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  ECE CARD
                </div>
              </div>
            )}
            
            {/* 3D Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Card Stats */}
          {card.stats && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(card.stats).map(([stat, value]) => (
                <div 
                  key={stat}
                  className="text-center p-2 bg-background/20 rounded-lg border border-border/30 shadow-soft"
                >
                  <div className="text-lg drop-shadow-icon">
                    {StatIcons[stat as keyof typeof StatIcons]}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-medium">
                    {stat}
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Card Abilities */}
          {card.abilities && card.abilities.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2 font-medium">
                ABILITIES
              </div>
              <div className="flex flex-wrap gap-1">
                {card.abilities.map((ability, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-accent/10 text-accent text-xs rounded border border-accent/20 shadow-soft"
                  >
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mb-4 text-center p-3 bg-gradient-to-r from-monokai-warning/10 to-monokai-warning/5 rounded-lg border border-monokai-warning/20 shadow-soft">
            <div className="text-xs text-muted-foreground mb-1">MARKET PRICE</div>
            <div className="text-xl font-bold text-monokai-warning flex items-center justify-center gap-1">
              💰 ${card.price.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            {onPass && (
              <Button
                variant="outline"
               
                onClick={onPass}
                className="shadow-soft hover:shadow-soft-lg text-xs"
              >
                <span className="mr-1">{ActionIcons.pass}</span>
                PASS
              </Button>
            )}
            
            {onTrade && (
              <Button
                variant="default"
               
                onClick={onTrade}
                className="bg-gradient-to-r from-monokai-accent to-monokai-accent/80 shadow-soft hover:shadow-soft-lg text-xs"
              >
                <span className="mr-1">{ActionIcons.trade}</span>
                TRADE
              </Button>
            )}
            
            {onCollect && (
              <Button
                variant="secondary"
               
                onClick={onCollect}
                className="shadow-soft hover:shadow-soft-lg text-xs"
              >
                <span className="mr-1">{ActionIcons.collect}</span>
                COLLECT
              </Button>
            )}
            
            {onMint && (
              <Button
                variant="default"
               
                onClick={onMint}
                className="bg-gradient-to-r from-monokai-purple to-monokai-purple/80 shadow-soft hover:shadow-soft-lg text-xs"
              >
                <span className="mr-1">{ActionIcons.mint}</span>
                MINT NFT
              </Button>
            )}
            
            {onView && (
              <Button
                variant="ghost"
               
                onClick={onView}
                className="shadow-soft hover:shadow-soft-lg text-xs col-span-full"
              >
                <span className="mr-1">{ActionIcons.view}</span>
                VIEW DETAILS
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Sample trading cards data for showcase
export const sampleTradingCards = [
  {
    id: 'card-001',
    name: 'Ocean Warrior',
    rarity: 'legendary' as const,
    price: 299.99,
    category: 'Combat',
    stats: {
      attack: 95,
      defense: 87,
      speed: 73,
      health: 92
    },
    abilities: ['Tsunami Strike', 'Water Shield', 'Tidal Rage'],
    isNFT: true
  },
  {
    id: 'card-002',
    name: 'Coral Guardian',
    rarity: 'epic' as const,
    price: 149.99,
    category: 'Defense',
    stats: {
      attack: 65,
      defense: 98,
      speed: 42,
      health: 89,
      mana: 76
    },
    abilities: ['Reef Barrier', 'Healing Waters'],
    isNFT: false
  },
  {
    id: 'card-003',
    name: 'Storm Rider',
    rarity: 'rare' as const,
    price: 89.99,
    category: 'Speed',
    stats: {
      attack: 78,
      defense: 56,
      speed: 95,
      health: 71
    },
    abilities: ['Lightning Dash', 'Wind Walker'],
    isNFT: true
  },
  {
    id: 'card-004',
    name: 'Deep Sea Mystic',
    rarity: 'mythic' as const,
    price: 599.99,
    category: 'Magic',
    stats: {
      attack: 88,
      defense: 72,
      speed: 68,
      health: 85,
      mana: 99
    },
    abilities: ['Abyssal Magic', 'Soul Drain', 'Phantom Wave', 'Dark Portal'],
    isNFT: true
  },
  {
    id: 'card-005',
    name: 'Tide Hunter',
    rarity: 'common' as const,
    price: 29.99,
    category: 'Basic',
    stats: {
      attack: 45,
      defense: 38,
      speed: 52,
      health: 48
    },
    abilities: ['Basic Strike'],
    isNFT: false
  }
]
