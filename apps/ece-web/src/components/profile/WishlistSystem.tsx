'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart,
  Star,
  Search,
  Filter,
  SortAsc,
  Plus,
  X,
  Share2,
  Bell,
  Tag,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Calendar,
  DollarSign,
  Target,
  Folder,
  Grid3X3,
  List,
  Eye,
  Settings
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface WishlistCard {
  id: string
  name: string
  tier: string
  image: string
  currentPrice: number
  targetPrice?: number
  priceHistory: number[]
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
  priority: 'high' | 'medium' | 'low'
  dateAdded: Date
  category: string
  tags: string[]
  availability: 'available' | 'limited' | 'rare' | 'unavailable'
  seller?: string
  description: string
}

interface WishlistFolder {
  id: string
  name: string
  description: string
  cardCount: number
  totalValue: number
  color: string
}

interface WishlistSystemProps {
  className?: string
}

export function WishlistSystem({ className = '' }: WishlistSystemProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'priority' | 'price' | 'date' | 'name'>('priority')
  const [filterBy, setFilterBy] = useState<'all' | 'available' | 'limited' | 'rare'>('all')
  const [showPriceAlerts, setShowPriceAlerts] = useState(true)

  const folders: WishlistFolder[] = [
    {
      id: 'all',
      name: 'All Items',
      description: 'Complete wishlist',
      cardCount: 24,
      totalValue: 45600,
      color: '#66D9EF'
    },
    {
      id: 'priority-high',
      name: 'High Priority',
      description: 'Must-have cards',
      cardCount: 6,
      totalValue: 18500,
      color: '#F92672'
    },
    {
      id: 'gaming-cards',
      name: 'Gaming Collection',
      description: 'Gaming-themed cards',
      cardCount: 12,
      totalValue: 22100,
      color: '#A6E22E'
    },
    {
      id: 'investment',
      name: 'Investment Cards',
      description: 'High-value potential',
      cardCount: 6,
      totalValue: 30000,
      color: '#E6DB74'
    }
  ]

  const wishlistCards: WishlistCard[] = [
    {
      id: '1',
      name: 'Quantum Nexus',
      tier: 'mythic',
      image: '/api/placeholder/300/400',
      currentPrice: 25000,
      targetPrice: 20000,
      priceHistory: [28000, 26500, 25800, 25000],
      trend: 'down',
      trendPercentage: -10.7,
      priority: 'high',
      dateAdded: new Date('2024-06-15'),
      category: 'sci-fi',
      tags: ['mythic', 'rare', 'quantum'],
      availability: 'limited',
      seller: 'QuantumCollector',
      description: 'Ultra-rare quantum-powered card with reality-bending abilities'
    },
    {
      id: '2',
      name: 'Dragon Emperor',
      tier: 'legendary',
      image: '/api/placeholder/300/400',
      currentPrice: 8500,
      targetPrice: 7000,
      priceHistory: [7200, 7800, 8200, 8500],
      trend: 'up',
      trendPercentage: 18.1,
      priority: 'medium',
      dateAdded: new Date('2024-06-20'),
      category: 'fantasy',
      tags: ['dragon', 'emperor', 'fire'],
      availability: 'available',
      seller: 'DragonMaster99',
      description: 'Majestic dragon ruler with flame control abilities'
    },
    {
      id: '3',
      name: 'Cyber Samurai',
      tier: 'epic',
      image: '/api/placeholder/300/400',
      currentPrice: 3200,
      targetPrice: 2800,
      priceHistory: [3000, 3100, 3150, 3200],
      trend: 'up',
      trendPercentage: 6.7,
      priority: 'high',
      dateAdded: new Date('2024-07-01'),
      category: 'cyberpunk',
      tags: ['samurai', 'cyber', 'warrior'],
      availability: 'available',
      description: 'Futuristic warrior combining ancient honor with modern technology'
    },
    {
      id: '4',
      name: 'Starlight Mage',
      tier: 'rare',
      image: '/api/placeholder/300/400',
      currentPrice: 1500,
      priceHistory: [1400, 1450, 1480, 1500],
      trend: 'up',
      trendPercentage: 7.1,
      priority: 'low',
      dateAdded: new Date('2024-07-03'),
      category: 'magic',
      tags: ['mage', 'stars', 'light'],
      availability: 'available',
      description: 'Celestial spellcaster wielding the power of distant stars'
    }
  ]

  const filteredCards = wishlistCards.filter(card => {
    if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterBy !== 'all' && card.availability !== filterBy) return false
    if (selectedFolder !== 'all') {
      if (selectedFolder === 'priority-high' && card.priority !== 'high') return false
      if (selectedFolder === 'gaming-cards' && !['cyberpunk', 'sci-fi'].includes(card.category)) return false
      if (selectedFolder === 'investment' && card.currentPrice < 5000) return false
    }
    return true
  })

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'price':
        return b.currentPrice - a.currentPrice
      case 'date':
        return b.dateAdded.getTime() - a.dateAdded.getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      common: '#75715E',
      uncommon: '#A6E22E',
      rare: '#66D9EF',
      epic: '#F92672',
      legendary: '#E6DB74',
      mythic: '#819AFF'
    }
    return colors[tier] || '#75715E'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'medium': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'low': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
      case 'limited': return 'text-[#E6DB74] bg-[#E6DB74]/20 border-[#E6DB74]/30'
      case 'rare': return 'text-[#F92672] bg-[#F92672]/20 border-[#F92672]/30'
      case 'unavailable': return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
      default: return 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
    }
  }

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-[#A6E22E]" />
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-[#F92672]" />
    return <div className="w-3 h-3 border border-[#75715E] rounded-full" />
  }

  const calculateTotalWishlistValue = () => {
    return filteredCards.reduce((sum, card) => sum + card.currentPrice, 0)
  }

  const removeFromWishlist = (cardId: string) => {
    // In a real app, this would remove the card from the wishlist
    console.log('Removing card from wishlist:', cardId)
  }

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Card Wishlist',
        text: `Check out my wishlist of ${filteredCards.length} cards worth ${calculateTotalWishlistValue().toLocaleString()} ECE!`,
        url: window.location.href
      })
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-[#F8EFD6] mb-2 flex items-center">
            <Heart className="w-6 h-6 mr-2" />
            Wishlist System
          </h2>
          <p className="text-[#75715E]">
            Track and manage cards you want to acquire
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
           
            onClick={shareWishlist}
            className="text-[#66D9EF]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant={showPriceAlerts ? "accent" : "ghost"}
           
            onClick={() => setShowPriceAlerts(!showPriceAlerts)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
      </motion.div>

      {/* Wishlist Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <GlassCard variant="dark" className="p-4 text-center">
          <div className="text-2xl font-bold text-[#A6E22E] mb-1">
            {filteredCards.length}
          </div>
          <div className="text-sm text-[#75715E]">Total Items</div>
        </GlassCard>
        
        <GlassCard variant="dark" className="p-4 text-center">
          <div className="text-2xl font-bold text-[#66D9EF] mb-1">
            {calculateTotalWishlistValue().toLocaleString()}
          </div>
          <div className="text-sm text-[#75715E]">Total Value (ECE)</div>
        </GlassCard>
        
        <GlassCard variant="dark" className="p-4 text-center">
          <div className="text-2xl font-bold text-[#E6DB74] mb-1">
            {filteredCards.filter(card => card.availability === 'available').length}
          </div>
          <div className="text-sm text-[#75715E]">Available Now</div>
        </GlassCard>
        
        <GlassCard variant="dark" className="p-4 text-center">
          <div className="text-2xl font-bold text-[#F92672] mb-1">
            {filteredCards.filter(card => card.priority === 'high').length}
          </div>
          <div className="text-sm text-[#75715E]">High Priority</div>
        </GlassCard>
      </motion.div>

      {/* Folders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Folder className="w-5 h-5 text-[#66D9EF]" />
          <span className="font-semibold text-[#F8EFD6]">Wishlist Categories</span>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`flex-shrink-0 p-3 rounded-lg border transition-all ${
                selectedFolder === folder.id
                  ? 'bg-[#A6E22E]/20 border-[#A6E22E]/30 text-[#A6E22E]'
                  : 'bg-[#272822]/30 border-[#75715E]/30 text-[#75715E] hover:border-[#75715E]/60'
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{folder.name}</div>
                <div className="text-xs opacity-75">
                  {folder.cardCount} cards • {folder.totalValue.toLocaleString()} ECE
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard variant="dark" className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#75715E]" />
                <Input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#272822]/50"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="rare">Rare</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#272822]/50 border border-[#75715E]/30 rounded-lg text-[#F8EFD6] text-sm"
              >
                <option value="priority">Priority</option>
                <option value="price">Price</option>
                <option value="date">Date Added</option>
                <option value="name">Name</option>
              </select>

              <div className="flex border border-[#75715E]/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#A6E22E]/20 text-[#A6E22E]' : 'text-[#75715E]'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#A6E22E]/20 text-[#A6E22E]' : 'text-[#75715E]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Wishlist Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {sortedCards.length === 0 ? (
          <GlassCard variant="dark" className="p-8 text-center">
            <Heart className="w-16 h-16 text-[#75715E] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#F8EFD6] mb-2">
              No cards in your wishlist
            </h3>
            <p className="text-[#75715E] mb-4">
              Start building your wishlist by browsing the marketplace
            </p>
            <Button variant="gradient">
              <Plus className="w-4 h-4 mr-2" />
              Browse Cards
            </Button>
          </GlassCard>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {sortedCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard variant="dark" className={`p-4 ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}>
                  {/* Card Image */}
                  <div className={`${viewMode === 'list' ? 'w-16 h-20' : 'aspect-[3/4] mb-4'} relative overflow-hidden rounded-lg border-2`}
                    style={{ borderColor: getTierColor(card.tier) }}
                  >
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => removeFromWishlist(card.id)}
                        className="p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className={viewMode === 'list' ? 'flex-grow' : ''}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-[#F8EFD6]">{card.name}</h3>
                      <Badge className={getPriorityColor(card.priority)}>
                        {card.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        className="border"
                        style={{ 
                          color: getTierColor(card.tier),
                          backgroundColor: `${getTierColor(card.tier)}20`,
                          borderColor: `${getTierColor(card.tier)}30`
                        }}
                      >
                        {card.tier}
                      </Badge>
                      <Badge className={getAvailabilityColor(card.availability)}>
                        {card.availability}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-lg font-bold text-[#E6DB74]">
                          {card.currentPrice.toLocaleString()} ECE
                        </div>
                        {card.targetPrice && (
                          <div className="text-sm text-[#75715E]">
                            Target: {card.targetPrice.toLocaleString()} ECE
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm">
                        {getTrendIcon(card.trend, card.trendPercentage)}
                        <span className={card.trend === 'up' ? 'text-[#A6E22E]' : card.trend === 'down' ? 'text-[#F92672]' : 'text-[#75715E]'}>
                          {Math.abs(card.trendPercentage)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-[#272822]/50 text-[#75715E] text-xs rounded border border-[#75715E]/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#75715E]">
                        Added {card.dateAdded.toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {card.availability === 'available' && (
                          <Button variant="gradient">
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Buy Now
                          </Button>
                        )}
                        <Button variant="ghost">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Price Alerts */}
      {showPriceAlerts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard variant="dark" className="p-6">
            <h3 className="text-lg font-semibold text-[#F8EFD6] mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Price Alerts
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#A6E22E]/10 border border-[#A6E22E]/30 rounded-lg">
                <div>
                  <span className="font-medium text-[#F8EFD6]">Quantum Nexus</span>
                  <span className="text-sm text-[#75715E] ml-2">price dropped 10.7%</span>
                </div>
                <span className="text-[#A6E22E] font-bold">25,000 ECE</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#66D9EF]/10 border border-[#66D9EF]/30 rounded-lg">
                <div>
                  <span className="font-medium text-[#F8EFD6]">Cyber Samurai</span>
                  <span className="text-sm text-[#75715E] ml-2">now available</span>
                </div>
                <span className="text-[#66D9EF] font-bold">3,200 ECE</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
