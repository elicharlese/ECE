'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompanyCard, CompanyCardData, sampleCompanyCards } from '@/components/cards/CompanyCard'
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  TrendingDown,
  Star,
  Heart,
  Share2,
  Download,
  Upload,
  Settings,
  BarChart3,
  PieChart,
  DollarSign,
  Target,
  Crown,
  Award,
  Zap,
  Shield,
  Eye,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  Calendar,
  MapPin,
  Users,
  Building2,
  Briefcase,
  Globe
} from 'lucide-react'

interface CollectionStats {
  totalCards: number
  totalValue: number
  averageValue: number
  rarityDistribution: Record<string, number>
  sectorDistribution: Record<string, number>
  nftCount: number
  powerupCount: number
  monthlyGrowth: number
  portfolioRank: number
}

interface UserCollectionProps {
  userId?: string
  className?: string
}

export const UserCollection: React.FC<UserCollectionProps> = ({
  userId = 'current-user',
  className
}) => {
  // Collection state
  const [userCards, setUserCards] = useState<CompanyCardData[]>(sampleCompanyCards)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterRarity, setFilterRarity] = useState('all')
  const [filterSector, setFilterSector] = useState('all')
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('collection')

  // Wishlist and favorites
  const [wishlist, setWishlist] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>(['company-001'])

  // Calculate collection statistics
  const collectionStats: CollectionStats = useMemo(() => {
    const totalCards = userCards.length
    const totalValue = userCards.reduce((sum, card) => sum + card.marketCap, 0)
    const averageValue = totalValue / totalCards || 0
    
    const rarityDistribution = userCards.reduce((acc, card) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const sectorDistribution = userCards.reduce((acc, card) => {
      acc[card.sector] = (acc[card.sector] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const nftCount = userCards.filter(card => card.isNFT).length
    const powerupCount = userCards.reduce((sum, card) => 
      sum + (card.activePowerups?.length || 0), 0
    )

    return {
      totalCards,
      totalValue,
      averageValue,
      rarityDistribution,
      sectorDistribution,
      nftCount,
      powerupCount,
      monthlyGrowth: 12.5, // Mock data
      portfolioRank: 247 // Mock data
    }
  }, [userCards])

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    const filtered = userCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.sector.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity
      const matchesSector = filterSector === 'all' || card.sector === filterSector
      
      return matchesSearch && matchesRarity && matchesSector
    })

    // Sort cards
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'value':
          comparison = a.marketCap - b.marketCap
          break
        case 'rarity':
          const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 }
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity]
          break
        case 'sector':
          comparison = a.sector.localeCompare(b.sector)
          break
        case 'performance':
          comparison = a.priceChange24h - b.priceChange24h
          break
        default:
          comparison = 0
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [userCards, searchQuery, filterRarity, filterSector, sortBy, sortOrder])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  const handleCardSelect = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on cards:`, selectedCards)
    setSelectedCards([])
  }

  const toggleFavorite = (cardId: string) => {
    setFavorites(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  const toggleWishlist = (cardId: string) => {
    setWishlist(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  // Collection overview cards
  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: React.ElementType
    title: string
    value: string | number
    change?: number
    color: string
  }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              change >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
        <Icon className={cn('w-8 h-8', color)} />
      </div>
    </Card>
  )

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-monokai-accent to-monokai-info bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            📦 My Collection
          </motion.h1>
          <p className="text-muted-foreground">
            Manage and analyze your M&A trading card portfolio
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Collection tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collection">
            Collection ({userCards.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            Wishlist ({wishlist.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Collection overview stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard
            icon={Building2}
            title="Total Cards"
            value={collectionStats.totalCards}
            color="text-monokai-accent"
          />
          <StatCard
            icon={DollarSign}
            title="Portfolio Value"
            value={formatCurrency(collectionStats.totalValue)}
            change={collectionStats.monthlyGrowth}
            color="text-monokai-success"
          />
          <StatCard
            icon={Crown}
            title="NFT Cards"
            value={collectionStats.nftCount}
            color="text-monokai-warning"
          />
          <StatCard
            icon={Zap}
            title="Active Powerups"
            value={collectionStats.powerupCount}
            color="text-monokai-info"
          />
        </div>

        <TabsContent value="collection" className="space-y-6">
          {/* Search and controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search your collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="name">Name</option>
                <option value="value">Value</option>
                <option value="rarity">Rarity</option>
                <option value="sector">Sector</option>
                <option value="performance">Performance</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Rarity</label>
                      <select 
                        value={filterRarity} 
                        onChange={(e) => setFilterRarity(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="all">All Rarities</option>
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                        <option value="mythic">Mythic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sector</label>
                      <select 
                        value={filterSector} 
                        onChange={(e) => setFilterSector(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="all">All Sectors</option>
                        <option value="TECH">Technology</option>
                        <option value="FINANCE">Finance</option>
                        <option value="HEALTHCARE">Healthcare</option>
                        <option value="ENERGY">Energy</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option value="all">All Types</option>
                        <option value="nft">NFT Only</option>
                        <option value="regular">Regular Only</option>
                        <option value="powerup">With Powerups</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk actions */}
          {selectedCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-monokai-accent/10 border border-monokai-accent/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedCards.length} card{selectedCards.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('trade')}>
                  Trade
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('sell')}>
                  Sell
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('favorite')}>
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedCards([])}>
                  Clear
                </Button>
              </div>
            </motion.div>
          )}

          {/* Cards display */}
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          )}>
            {filteredAndSortedCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                {viewMode === 'grid' ? (
                  <div className="relative">
                    <CompanyCard
                      card={card}
                      variant="default"
                      onView={() => console.log('View card:', card.id)}
                      onTrade={() => console.log('Trade card:', card.id)}
                      className={cn(
                        'cursor-pointer transition-all duration-200',
                        selectedCards.includes(card.id) && 'ring-2 ring-monokai-accent'
                      )}
                    />
                    
                    {/* Selection overlay */}
                    <div 
                      className="absolute top-2 left-2 z-10"
                      onClick={() => handleCardSelect(card.id)}
                    >
                      <div className={cn(
                        'w-6 h-6 border-2 rounded-full cursor-pointer transition-all',
                        selectedCards.includes(card.id)
                          ? 'bg-monokai-accent border-monokai-accent'
                          : 'border-white/50 hover:border-white'
                      )}>
                        {selectedCards.includes(card.id) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => toggleFavorite(card.id)}
                        >
                          <Heart className={cn(
                            'w-4 h-4',
                            favorites.includes(card.id) && 'fill-current text-red-400'
                          )} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List view
                  <Card className="p-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className={cn(
                          'w-6 h-6 border-2 rounded-full cursor-pointer transition-all',
                          selectedCards.includes(card.id)
                            ? 'bg-monokai-accent border-monokai-accent'
                            : 'border-gray-300 hover:border-monokai-accent'
                        )}
                        onClick={() => handleCardSelect(card.id)}
                      />
                      
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{card.name}</h3>
                        <p className="text-sm text-muted-foreground">{card.ticker} • {card.sector}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={card.rarity as any}>{card.rarity}</Badge>
                          {card.isNFT && <Badge variant="monokai">NFT</Badge>}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(card.marketCap)}</div>
                        <div className={cn(
                          'text-sm flex items-center gap-1',
                          card.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {card.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(card.priceChange24h).toFixed(2)}%
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFavorite(card.id)}
                        >
                          <Heart className={cn(
                            'w-4 h-4',
                            favorites.includes(card.id) && 'fill-current text-red-400'
                          )} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>

          {filteredAndSortedCards.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No cards found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more cards.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userCards
              .filter(card => favorites.includes(card.id))
              .map((card) => (
                <CompanyCard
                  key={card.id}
                  card={card}
                  variant="default"
                />
              ))
            }
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-6">
          <div className="text-center py-12">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground">
              Add cards you want to your wishlist to track them here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio composition */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Portfolio Composition
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {Object.entries(collectionStats.rarityDistribution).map(([rarity, count]) => (
                    <div key={rarity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={rarity as any}>{rarity}</Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{count}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({((count / collectionStats.totalCards) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sector distribution */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Sector Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {Object.entries(collectionStats.sectorDistribution).map(([sector, count]) => (
                    <div key={sector} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{sector}</Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{count}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({((count / collectionStats.totalCards) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}