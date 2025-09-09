'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, TrendingUp, Filter, Search, Star, Clock, DollarSign, Users, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RepositoryCard } from '@/components/repository-card'
import { RepositoryCollection } from '@/components/repository-collection'
import { ELICHARLESE_REPO_CARDS, GitHubRepoCard, getRepositoriesByCategory, calculatePortfolioValue } from '@/data/github-repo-cards'
import toast from 'react-hot-toast'

interface MarketplaceProps {
  onPurchase?: (repoId: string, price: number) => void
  onSell?: (repoId: string, price: number) => void
  onAuction?: (repoId: string, startingBid: number) => void
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  onPurchase,
  onSell,
  onAuction
}) => {
  const [activeTab, setActiveTab] = useState('buy')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('price-low')
  const [priceRange, setPriceRange] = useState('all')
  const [cart, setCart] = useState<string[]>([])
  const [watchlist, setWatchlist] = useState<string[]>([])

  // Mock market data
  const marketData = useMemo(() => {
    return ELICHARLESE_REPO_CARDS.map(card => ({
      ...card,
      marketPrice: card.estimatedValue + Math.floor((Math.random() - 0.5) * card.estimatedValue * 0.3),
      priceChange24h: (Math.random() - 0.5) * 20,
      volume24h: Math.floor(Math.random() * 50) + 5,
      lastSale: card.estimatedValue + Math.floor((Math.random() - 0.5) * card.estimatedValue * 0.2),
      isOnSale: Math.random() > 0.3,
      seller: Math.random() > 0.5 ? 'AI Trader' : 'Community Member',
      timeRemaining: Math.floor(Math.random() * 24) + 1
    }))
  }, [])

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = [...marketData]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(card => card.category === selectedCategory)
    }

    // Price range filter
    if (priceRange !== 'all') {
      const ranges = {
        'under-1k': [0, 1000],
        '1k-5k': [1000, 5000],
        '5k-10k': [5000, 10000],
        'over-10k': [10000, Infinity]
      }
      const [min, max] = ranges[priceRange as keyof typeof ranges] || [0, Infinity]
      filtered = filtered.filter(card => card.marketPrice >= min && card.marketPrice <= max)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.marketPrice - b.marketPrice
        case 'price-high':
          return b.marketPrice - a.marketPrice
        case 'name':
          return a.displayName.localeCompare(b.displayName)
        case 'trending':
          return b.priceChange24h - a.priceChange24h
        case 'volume':
          return b.volume24h - a.volume24h
        default:
          return 0
      }
    })

    return filtered
  }, [marketData, searchTerm, selectedCategory, sortBy, priceRange])

  const handlePurchase = (card: any) => {
    setCart(prev => [...prev, card.id])
    toast.success(`🛒 ${card.displayName} added to cart! (${card.marketPrice.toLocaleString()} ECE)`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #66D9EF'
      }
    })
    onPurchase?.(card.id, card.marketPrice)
  }

  const handleSell = (card: any) => {
    toast.success(`💰 ${card.displayName} listed for sale! (${card.marketPrice.toLocaleString()} ECE)`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #A6E22E'
      }
    })
    onSell?.(card.id, card.marketPrice)
  }

  const handleAuction = (card: any) => {
    const startingBid = Math.floor(card.marketPrice * 0.8)
    toast.success(`🎯 ${card.displayName} auction started! (Starting bid: ${startingBid.toLocaleString()} ECE)`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #F92672'
      }
    })
    onAuction?.(card.id, startingBid)
  }

  const handleWatchlist = (cardId: string) => {
    if (watchlist.includes(cardId)) {
      setWatchlist(prev => prev.filter(id => id !== cardId))
      toast.success('Removed from watchlist', {
        duration: 2000,
        style: {
          background: 'rgba(39, 40, 34, 0.9)',
          color: '#F8EFD6',
          border: '1px solid #75715E'
        }
      })
    } else {
      setWatchlist(prev => [...prev, cardId])
      toast.success('Added to watchlist!', {
        duration: 2000,
        style: {
          background: 'rgba(39, 40, 34, 0.9)',
          color: '#F8EFD6',
          border: '1px solid #819AFF'
        }
      })
    }
  }

  const cartValue = cart.reduce((total, cardId) => {
    const card = marketData.find(c => c.id === cardId)
    return total + (card?.marketPrice || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent text-shadow-strong">
            🏪 Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trade repository cards, discover valuable collections, and build your coding portfolio
          </p>
        </motion.div>

        {/* Market Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-lg font-bold text-monokai-warning">
              {calculatePortfolioValue(ELICHARLESE_REPO_CARDS).toLocaleString()} ECE
            </div>
            <div className="text-xs text-muted-foreground">Total Market Cap</div>
          </div>
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-lg font-bold text-monokai-success">+12.5%</div>
            <div className="text-xs text-muted-foreground">24h Change</div>
          </div>
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-lg font-bold text-monokai-info">{filteredCards.filter(c => c.isOnSale).length}</div>
            <div className="text-xs text-muted-foreground">For Sale</div>
          </div>
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">🛒</div>
            <div className="text-lg font-bold text-monokai-accent">{cartValue.toLocaleString()} ECE</div>
            <div className="text-xs text-muted-foreground">Cart Value</div>
          </div>
        </motion.div>

        {/* Marketplace Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8 shadow-soft">
            <TabsTrigger value="buy">🛒 Buy Cards</TabsTrigger>
            <TabsTrigger value="sell">💰 Sell Cards</TabsTrigger>
            <TabsTrigger value="auctions">🎯 Auctions</TabsTrigger>
            <TabsTrigger value="watchlist">⭐ Watchlist</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <motion.div 
            className="glass-card p-6 mb-8 shadow-card-ece"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 shadow-soft"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="shadow-soft">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="majors">👑 Majors</SelectItem>
                  <SelectItem value="minors">⭐ Minors</SelectItem>
                  <SelectItem value="mvps">🚀 MVPs</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="shadow-soft">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-1k">Under $1K</SelectItem>
                  <SelectItem value="1k-5k">$1K - $5K</SelectItem>
                  <SelectItem value="5k-10k">$5K - $10K</SelectItem>
                  <SelectItem value="over-10k">Over $10K</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="shadow-soft">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Buy Cards Tab */}
          <TabsContent value="buy">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.filter(card => card.isOnSale).map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="relative"
                >
                  <div className="absolute top-2 right-2 z-10 space-y-1">
                    <Badge 
                      className={`${card.priceChange24h >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}
                    >
                      {card.priceChange24h >= 0 ? '+' : ''}{card.priceChange24h.toFixed(1)}%
                    </Badge>
                    {watchlist.includes(card.id) && (
                      <Badge className="bg-yellow-500 text-white block">
                        ⭐
                      </Badge>
                    )}
                  </div>

                  <Card className="glass-card shadow-card-ece hover:shadow-card-ece-hover transition-all duration-300 h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{card.displayName}</CardTitle>
                          <p className="text-sm text-muted-foreground">by {card.seller}</p>
                        </div>
                        <Button
                          variant="ghost"
                         
                          onClick={() => handleWatchlist(card.id)}
                          className="p-1"
                        >
                          <Star className={`h-4 w-4 ${watchlist.includes(card.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video bg-gradient-to-br from-monokai-accent/20 to-monokai-info/20 rounded-lg flex items-center justify-center">
                        <div className="text-4xl">🎴</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Price:</span>
                          <span className="font-bold text-monokai-warning">{card.marketPrice.toLocaleString()} ECE</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Sale:</span>
                          <span>{card.lastSale.toLocaleString()} ECE</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>24h Volume:</span>
                          <span>{card.volume24h}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePurchase(card)}
                          className="flex-1 shadow-soft"
                          disabled={cart.includes(card.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {cart.includes(card.id) ? 'In Cart' : 'Buy Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Sell Cards Tab */}
          <TabsContent value="sell">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-2">Sell Your Repository Cards</h3>
              <p className="text-muted-foreground mb-6">List your cards for sale or create auctions</p>
              <Button onClick={() => toast.success('Sell interface coming soon!')}>
                <DollarSign className="h-4 w-4 mr-2" />
                Start Selling
              </Button>
            </div>
          </TabsContent>

          {/* Auctions Tab */}
          <TabsContent value="auctions">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2">Repository Card Auctions</h3>
              <p className="text-muted-foreground mb-6">Bid on rare cards and create your own auctions</p>
              <Button onClick={() => toast.success('Auction system coming soon!')}>
                <Target className="h-4 w-4 mr-2" />
                View Auctions
              </Button>
            </div>
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist">
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCards.filter(card => watchlist.includes(card.id)).map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <RepositoryCard
                      repository={card}
                      variant="default"
                      onView={(id) => window.open(card.githubUrl, '_blank')}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold mb-2">Your Watchlist is Empty</h3>
                <p className="text-muted-foreground">Add cards to your watchlist to track their prices</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
