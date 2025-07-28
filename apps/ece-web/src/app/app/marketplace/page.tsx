'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Filter, 
  Grid, 
  List, 
  TrendingUp, 
  Clock, 
  Eye,
  Heart,
  ShoppingCart,
  Gavel,
  Sparkles,
  Crown,
  Star,
  Plus,
  Github
} from 'lucide-react'
import { GlassCard } from '../../../components/ui/glass-card'
import { Button } from '../../../components/ui/button'
import { useSubscription } from '../../../contexts/subscription-context'
import { FeatureLock, SubscriptionBadge, ProEnhancedCard } from '../../../components/subscription-ui'
import { ConnectRepoModal } from '../../../components/repo/ConnectRepoModal'
import { GitHubRepoCard } from '../../../data/github-repo-cards'

const marketplaceItems = [
  {
    id: 1,
    name: 'Tesla Model S Plaid IPO',
    seller: '@eceofficial',
    currentBid: '$1,200',
    buyNow: '$1,500',
    bids: 45,
    timeLeft: '30m',
    watchers: 120,
    type: 'ipo',
    rarity: 'Mythic',
    trending: true,
    earlyAccess: true,
    isNew: true
  },
  {
    id: 2,
    name: 'Ethereal Dragon Lord',
    seller: '@dragonmaster',
    currentBid: '$3,200',
    buyNow: '$4,500',
    bids: 23,
    timeLeft: '2h 15m',
    watchers: 45,
    type: 'auction',
    rarity: 'Mythic',
    trending: true,
    earlyAccess: false
  },
  {
    id: 3,
    name: 'Apple Vision Pro Limited',
    seller: '@eceofficial',
    currentBid: '$890',
    buyNow: '$1,100',
    bids: 67,
    timeLeft: '1h 45m',
    watchers: 89,
    type: 'ipo',
    rarity: 'Legendary',
    trending: true,
    earlyAccess: true,
    isNew: true
  },
  {
    id: 4,
    name: 'Cyber Knight Alpha',
    seller: '@techcollector',
    currentBid: '$890',
    buyNow: '$1,200',
    bids: 12,
    timeLeft: '1d 8h',
    watchers: 28,
    type: 'auction',
    rarity: 'Legendary',
    trending: false,
    earlyAccess: false
  },
  {
    id: 5,
    name: 'Mystic Forest Guardian',
    seller: '@naturespirit',
    currentBid: null,
    buyNow: '$650',
    bids: 0,
    timeLeft: null,
    watchers: 15,
    type: 'fixed',
    rarity: 'Epic',
    trending: false,
    earlyAccess: false
  },
  {
    id: 6,
    name: 'SpaceX Starship Token',
    seller: '@eceofficial',
    currentBid: '$2,100',
    buyNow: '$2,800',
    bids: 156,
    timeLeft: '45m',
    watchers: 234,
    type: 'ipo',
    rarity: 'Mythic',
    trending: true,
    earlyAccess: true,
    isNew: true
  },
  {
    id: 7,
    name: 'Stellar Voyager',
    seller: '@spacehunter',
    currentBid: '$1,450',
    buyNow: '$2,000',
    bids: 18,
    timeLeft: '6h 32m',
    watchers: 33,
    type: 'auction',
    rarity: 'Legendary',
    trending: true,
    earlyAccess: false
  },
  {
    id: 8,
    name: 'Ancient Rune Master',
    seller: '@runekeeper',
    currentBid: null,
    buyNow: '$420',
    bids: 0,
    timeLeft: null,
    watchers: 8,
    type: 'fixed',
    rarity: 'Rare',
    trending: false
  },
  {
    id: 6,
    name: 'Phoenix Empress',
    seller: '@firebird',
    currentBid: '$2,100',
    buyNow: '$2,800',
    bids: 31,
    timeLeft: '4h 45m',
    watchers: 52,
    type: 'auction',
    rarity: 'Mythic',
    trending: true
  }
]

const categories = ['All', 'Auctions', 'Buy Now', 'Trending', 'Ending Soon']
const sortOptions = [
  'Recently Listed', 'Price: Low to High', 'Price: High to Low', 'Most Bids', 'Ending Soon'
]

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSort, setSelectedSort] = useState('Recently Listed')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [watchedItems, setWatchedItems] = useState<number[]>([])
  const [isConnectRepoModalOpen, setIsConnectRepoModalOpen] = useState(false)
  
  const { 
    subscription, 
    isPro, 
    isEnterprise, 
    hasFeature, 
    showUpgradePrompt 
  } = useSubscription()

  const toggleWatch = (itemId: number) => {
    setWatchedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleCardsGenerated = (newCards: GitHubRepoCard[]) => {
    setIsConnectRepoModalOpen(false)
    // In a real app, you might want to refresh the marketplace or show a success message
    console.log('Generated cards:', newCards)
  }

  // Filter items based on subscription level
  const filteredItems = marketplaceItems.filter(item => {
    if (item.earlyAccess && !hasFeature('earlyMarketplaceAccess')) {
      return false
    }
    return true
  })

  return (
    <div className="container mx-auto px-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                <span className="bg-gradient-tide bg-clip-text text-transparent">Marketplace</span>
              </h1>
              <p className="text-muted-foreground">
                Buy, sell, and bid on exclusive trading cards
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="gradient"
                onClick={() => setIsConnectRepoModalOpen(true)}
                className="flex items-center"
              >
                <Github className="w-4 h-4 mr-2" />
                Upload Your Apps
              </Button>
              
              {subscription && (
                <SubscriptionBadge plan={subscription.plan} />
              )}
            </div>
          </div>
          
          {/* Pro/Enterprise Features Banner */}
          {hasFeature('earlyMarketplaceAccess') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4"
            >
              <ProEnhancedCard 
                isPro={isPro} 
                isEnterprise={isEnterprise}
                className="p-4 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-monokai-purple" />
                    <span className="font-semibold text-foreground">
                      {isEnterprise ? 'Enterprise' : 'Pro'} Early Access
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Access to IPO listings and new releases before the general public
                  </div>
                </div>
              </ProEnhancedCard>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Active Listings', value: '1,234' },
            { label: 'Total Volume', value: '$2.4M' },
            { label: 'Average Sale', value: '$890' },
            { label: 'Success Rate', value: '94%' }
          ].map((stat) => (
            <GlassCard key={stat.label} variant="light" animation="breathe" className="p-4 text-center">
              <div className="text-2xl font-bold text-ocean-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="dark" className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "gradient" : "ghost"}
                   
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className="bg-background">
                      {option}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex items-center bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-ocean-primary text-white' : 'text-muted-foreground'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-ocean-primary text-white' : 'text-muted-foreground'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Marketplace Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {marketplaceItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <GlassCard 
                  variant="light" 
                  animation="float" 
                  className={`p-4 cursor-pointer group ${
                    viewMode === 'list' ? 'flex items-center space-x-6' : ''
                  }`}
                >
                  {/* Card Image */}
                  <div className={`bg-gradient-tide rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
                    viewMode === 'list' ? 'w-24 h-32 flex-shrink-0' : 'aspect-[3/4] mb-4'
                  }`}>
                    <span className="text-white font-bold text-center px-2">
                      {item.name}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className={`flex-grow ${viewMode === 'list' ? 'flex items-center justify-between' : 'space-y-3'}`}>
                    <div className={viewMode === 'list' ? '' : 'space-y-2'}>
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {item.trending && (
                            <TrendingUp className="w-4 h-4 text-ocean-success" />
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.rarity === 'Mythic' ? 'bg-gradient-monokai text-white' :
                            item.rarity === 'Legendary' ? 'bg-monokai-warning text-black' :
                            item.rarity === 'Epic' ? 'bg-ocean-primary text-white' :
                            'bg-ocean-muted text-white'
                          }`}>
                            {item.rarity}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleWatch(item.id)}
                          className="p-1 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <Eye 
                            className={`w-4 h-4 ${
                              watchedItems.includes(item.id) 
                                ? 'text-ocean-accent' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </button>
                      </div>

                      {/* Title and Seller */}
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-ocean-accent transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">by {item.seller}</p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {item.type === 'auction' && (
                          <>
                            <div className="flex items-center space-x-1">
                              <Gavel className="w-3 h-3" />
                              <span>{item.bids} bids</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.timeLeft}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.watchers} watching</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Actions */}
                    <div className={`${viewMode === 'list' ? 'text-right' : 'space-y-3'}`}>
                      <div>
                        {item.currentBid && (
                          <div className="text-sm text-muted-foreground">
                            Current bid: <span className="text-ocean-primary font-semibold">{item.currentBid}</span>
                          </div>
                        )}
                        <div className="text-lg font-bold text-foreground">
                          {item.buyNow}
                        </div>
                      </div>

                      <div className={`flex gap-2 ${viewMode === 'list' ? 'justify-end' : ''}`}>
                        {item.type === 'auction' ? (
                          <Button variant="gradient">
                            Place Bid
                          </Button>
                        ) : (
                          <Button variant="gradient">
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Buy Now
                          </Button>
                        )}
                        <Button variant="ghost">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button variant="ghost" size="lg">
            Load More Items
          </Button>
        </motion.div>

      {/* Connect Repository Modal */}
      <ConnectRepoModal
        isOpen={isConnectRepoModalOpen}
        onClose={() => setIsConnectRepoModalOpen(false)}
        userEmail="elicharles.e@gmail.com" // In real app, get from session
        onCardsGenerated={handleCardsGenerated}
      />
    </div>
  )
}
