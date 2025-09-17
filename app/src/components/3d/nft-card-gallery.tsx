'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid, List, Filter, Search, Star, Zap, Crown, Gem } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { NFTCard3DModel } from './nft-card-3d'

interface NFTCard {
  id: string
  name: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: string
  price: number
  owned: boolean
  image?: string
  stats: {
    power: number
    speed: number
    innovation: number
    rarity: number
  }
}

const mockNFTCards: NFTCard[] = [
  {
    id: '1',
    name: 'Tesla Model S Plaid',
    rarity: 'legendary',
    category: 'Electric Vehicles',
    price: 2500,
    owned: true,
    stats: { power: 95, speed: 98, innovation: 99, rarity: 100 }
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    rarity: 'epic',
    category: 'Smartphones',
    price: 1200,
    owned: true,
    stats: { power: 90, speed: 85, innovation: 95, rarity: 85 }
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    rarity: 'rare',
    category: 'Laptops',
    price: 800,
    owned: false,
    stats: { power: 88, speed: 92, innovation: 90, rarity: 70 }
  },
  {
    id: '4',
    name: 'PlayStation 5',
    rarity: 'rare',
    category: 'Gaming',
    price: 650,
    owned: true,
    stats: { power: 85, speed: 80, innovation: 85, rarity: 75 }
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24',
    rarity: 'common',
    category: 'Smartphones',
    price: 400,
    owned: false,
    stats: { power: 75, speed: 78, innovation: 80, rarity: 50 }
  },
  {
    id: '6',
    name: 'NVIDIA RTX 4090',
    rarity: 'epic',
    category: 'Graphics Cards',
    price: 1800,
    owned: false,
    stats: { power: 100, speed: 95, innovation: 98, rarity: 90 }
  }
]

const rarityIcons = {
  common: Star,
  rare: Zap,
  epic: Crown,
  legendary: Gem
}

const rarityColors = {
  common: 'text-[#A6E22E]',
  rare: 'text-[#66D9EF]',
  epic: 'text-[#9966CC]',
  legendary: 'text-[#FFD700]'
}

const rarityBgColors = {
  common: 'bg-[#A6E22E]/20',
  rare: 'bg-[#66D9EF]/20',
  epic: 'bg-[#9966CC]/20',
  legendary: 'bg-[#FFD700]/20'
}

export function NFTCard3DGallery() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [filterRarity, setFilterRarity] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyOwned, setShowOnlyOwned] = useState(false)

  const filteredCards = useMemo(() => {
    return mockNFTCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity
      const matchesOwnership = !showOnlyOwned || card.owned
      
      return matchesSearch && matchesRarity && matchesOwnership
    })
  }, [searchTerm, filterRarity, showOnlyOwned])

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId)
  }

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#F8EFD6]">NFT Card Collection</h2>
          <p className="text-[#75715E]">Discover and collect exclusive 3D trading cards</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
           
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
           
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#75715E] w-4 h-4" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
              />
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterRarity === 'all' ? 'default' : 'ghost'}
             
              onClick={() => setFilterRarity('all')}
            >
              All
            </Button>
            {Object.keys(rarityColors).map((rarity) => {
              const Icon = rarityIcons[rarity as keyof typeof rarityIcons]
              return (
                <Button
                  key={rarity}
                  variant={filterRarity === rarity ? 'default' : 'ghost'}
                 
                  onClick={() => setFilterRarity(rarity)}
                  className={filterRarity === rarity ? rarityBgColors[rarity as keyof typeof rarityBgColors] : ''}
                >
                  <Icon className={`w-4 h-4 mr-1 ${rarityColors[rarity as keyof typeof rarityColors]}`} />
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </Button>
              )
            })}
          </div>

          {/* Ownership Filter */}
          <Button
            variant={showOnlyOwned ? 'default' : 'ghost'}
           
            onClick={() => setShowOnlyOwned(!showOnlyOwned)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Owned Only
          </Button>
        </div>
      </GlassCard>

      {/* Card Gallery */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
      }>
        <AnimatePresence>
          {filteredCards.map((card) => {
            const Icon = rarityIcons[card.rarity]
            const isSelected = selectedCard === card.id

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={viewMode === 'grid' ? '' : 'w-full'}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => handleCardSelect(card.id)}
                >
                  <GlassCard 
                    className={`p-4 transition-all duration-300 ${
                      isSelected ? 'ring-2 ring-[#F92672] scale-105' : 'hover:scale-102'
                    }`}
                  >
                  {viewMode === 'grid' ? (
                    <div className="space-y-4">
                      {/* 3D Card Model */}
                      <div className="h-48">
                        <NFTCard3DModel
                          cardType={card.rarity}
                          cardName={card.name}
                          animated={isSelected}
                          size={0.8}
                          showControls={isSelected}
                          className="h-full"
                        />
                      </div>

                      {/* Card Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[#F8EFD6] truncate">{card.name}</h3>
                          <Badge className={`${rarityBgColors[card.rarity]} ${rarityColors[card.rarity]}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {card.rarity}
                          </Badge>
                        </div>
                        
                        <p className="text-[#75715E] text-sm">{card.category}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[#A6E22E] font-semibold">{card.price} ECE</span>
                          {card.owned && (
                            <Badge variant="secondary" className="bg-[#A6E22E]/20 text-[#A6E22E]">
                              Owned
                            </Badge>
                          )}
                        </div>

                        {/* Stats Preview */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#75715E]">Power:</span>
                            <span className="text-[#F8EFD6]">{card.stats.power}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#75715E]">Speed:</span>
                            <span className="text-[#F8EFD6]">{card.stats.speed}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      {/* 3D Card Model (smaller) */}
                      <div className="w-24 h-32 flex-shrink-0">
                        <NFTCard3DModel
                          cardType={card.rarity}
                          cardName={card.name}
                          animated={isSelected}
                          size={0.4}
                          showControls={false}
                          className="h-full"
                        />
                      </div>

                      {/* Card Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[#F8EFD6]">{card.name}</h3>
                          <Badge className={`${rarityBgColors[card.rarity]} ${rarityColors[card.rarity]}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {card.rarity}
                          </Badge>
                        </div>
                        
                        <p className="text-[#75715E]">{card.category}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[#A6E22E] font-semibold">{card.price} ECE</span>
                          {card.owned && (
                            <Badge variant="secondary" className="bg-[#A6E22E]/20 text-[#A6E22E]">
                              Owned
                            </Badge>
                          )}
                        </div>

                        {/* Full Stats */}
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-[#75715E]">Power</div>
                            <div className="text-[#F8EFD6] font-semibold">{card.stats.power}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[#75715E]">Speed</div>
                            <div className="text-[#F8EFD6] font-semibold">{card.stats.speed}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[#75715E]">Innovation</div>
                            <div className="text-[#F8EFD6] font-semibold">{card.stats.innovation}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[#75715E]">Rarity</div>
                            <div className="text-[#F8EFD6] font-semibold">{card.stats.rarity}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#75715E] text-lg">No cards found matching your criteria</div>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchTerm('')
              setFilterRarity('all')
              setShowOnlyOwned(false)
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
