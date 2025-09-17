'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid3X3, List, Zap, Trophy, Target, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RepositoryCard } from '@/components/repository-card'
import { ELICHARLESE_REPO_CARDS, GitHubRepoCard, getRepositoriesByCategory, calculatePortfolioValue } from '@/data/github-repo-cards'
import toast from 'react-hot-toast'

interface RepositoryCollectionProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  showFilters?: boolean
  showStats?: boolean
  showHeader?: boolean
  defaultCategory?: string
  maxCards?: number
  variant?: 'grid' | 'carousel' | 'list'
  cardSize?: 'default' | 'compact' | 'detailed'
  onBattle?: (repoId: string) => void
  onBid?: (repoId: string) => void
  onBet?: (repoId: string) => void
  onView?: (repoId: string) => void
}

export const RepositoryCollection: React.FC<RepositoryCollectionProps> = ({
  title = "Repository Trading Cards",
  subtitle = "Discover, battle, and trade innovative GitHub repositories",
  showSearch = true,
  showFilters = true,
  showStats = true,
  showHeader = true,
  defaultCategory = 'all',
  maxCards,
  variant = 'grid',
  cardSize = 'default',
  onBattle,
  onBid,
  onBet,
  onView
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [selectedComplexity, setSelectedComplexity] = useState('all')
  const [sortBy, setSortBy] = useState('value')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter and sort repositories
  const filteredRepositories = useMemo(() => {
    let filtered = [...ELICHARLESE_REPO_CARDS]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = getRepositoriesByCategory(selectedCategory as any)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Rarity filter
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(repo => repo.rarity === selectedRarity)
    }

    // Complexity filter
    if (selectedComplexity !== 'all') {
      filtered = filtered.filter(repo => repo.complexity === selectedComplexity)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.estimatedValue - a.estimatedValue
        case 'name':
          return a.displayName.localeCompare(b.displayName)
        case 'innovation':
          return b.stats.innovation - a.stats.innovation
        case 'rarity':
          const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 }
          return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder]
        default:
          return 0
      }
    })

    // Limit results
    if (maxCards) {
      filtered = filtered.slice(0, maxCards)
    }

    return filtered
  }, [searchTerm, selectedCategory, selectedRarity, selectedComplexity, sortBy, maxCards])

  // Calculate stats
  const stats = useMemo(() => {
    const totalValue = calculatePortfolioValue(filteredRepositories)
    const avgValue = filteredRepositories.length > 0 ? totalValue / filteredRepositories.length : 0
    const topTech = filteredRepositories
      .flatMap(repo => repo.techStack)
      .reduce((acc, tech) => {
        acc[tech] = (acc[tech] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    const mostUsedTech = Object.entries(topTech)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tech]) => tech)

    return {
      totalValue,
      avgValue,
      count: filteredRepositories.length,
      mostUsedTech
    }
  }, [filteredRepositories])

  const handleBattle = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    toast.success(`⚔️ ${repo?.displayName} enters battle mode!`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #F92672'
      }
    })
    onBattle?.(repoId)
  }

  const handleBid = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    toast.success(`💰 Bidding on ${repo?.displayName}!`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #66D9EF'
      }
    })
    onBid?.(repoId)
  }

  const handleBet = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    toast.success(`🎲 Placing bet on ${repo?.displayName}!`, {
      duration: 3000,
      style: {
        background: 'rgba(39, 40, 34, 0.9)',
        color: '#F8EFD6',
        border: '1px solid #A6E22E'
      }
    })
    onBet?.(repoId)
  }

  const handleView = (repoId: string) => {
    const repo = ELICHARLESE_REPO_CARDS.find(r => r.id === repoId)
    if (repo) {
      window.open(repo.githubUrl, '_blank')
    }
    onView?.(repoId)
  }

  const gridLayout = {
    default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    compact: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    detailed: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold text-foreground mb-2 text-shadow-strong"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        </div>
      )}

      {/* Stats */}
      {showStats && (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-lg font-bold text-monokai-warning">${stats.totalValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Value</div>
          </div>
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-lg font-bold text-monokai-info">${Math.round(stats.avgValue).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Avg Value</div>
          </div>
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">🎴</div>
            <div className="text-lg font-bold text-monokai-success">{stats.count}</div>
            <div className="text-xs text-muted-foreground">Total Cards</div>
          </div>
          <div className="glass-card p-4 text-center shadow-card-ece">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm font-bold text-monokai-accent">{stats.mostUsedTech[0] || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">Top Tech</div>
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <motion.div 
          className="glass-card p-6 space-y-4 shadow-card-ece"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories by name, description, or tech stack..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-soft"
              />
            </div>
          )}

          {/* Filters and Controls */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Category Tabs */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="shadow-soft">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="majors">👑 Majors</TabsTrigger>
                    <TabsTrigger value="minors">⭐ Minors</TabsTrigger>
                    <TabsTrigger value="mvps">🚀 MVPs</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Rarity Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="shadow-soft">
                      <Filter className="h-4 w-4 mr-1" />
                      Rarity: {selectedRarity === 'all' ? 'All' : selectedRarity}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedRarity('all')}>All Rarities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity('mythic')}>🔥 Mythic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity('legendary')}>⭐ Legendary</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity('epic')}>💜 Epic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity('rare')}>💙 Rare</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity('common')}>⚪ Common</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="shadow-soft">
                      Sort: {sortBy === 'value' ? 'Value' : sortBy === 'name' ? 'Name' : sortBy === 'innovation' ? 'Innovation' : 'Rarity'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('value')}>💰 Value</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>📝 Name</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('innovation')}>💡 Innovation</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('rarity')}>⭐ Rarity</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                 
                  onClick={() => setViewMode('grid')}
                  className="shadow-soft"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                 
                  onClick={() => setViewMode('list')}
                  className="shadow-soft"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Repository Cards */}
      <motion.div
        layout
        className={
          viewMode === 'grid' 
            ? `grid ${gridLayout[cardSize]} gap-6` 
            : 'space-y-4'
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredRepositories.map((repo, index) => (
            <motion.div
              key={repo.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ y: -5 }}
            >
              <RepositoryCard
                repository={repo}
                variant={cardSize}
                onBattle={handleBattle}
                onBid={handleBid}
                onBet={handleBet}
                onView={handleView}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredRepositories.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">No repositories found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Load More (if maxCards is set) */}
      {maxCards && ELICHARLESE_REPO_CARDS.length > maxCards && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="shadow-soft hover:shadow-soft-lg"
            onClick={() => {
              // This would typically load more cards or navigate to a full view
              toast.success('Showing all repository cards!', {
                duration: 2000,
                style: {
                  background: 'rgba(39, 40, 34, 0.9)',
                  color: '#F8EFD6',
                  border: '1px solid #A6E22E'
                }
              })
            }}
          >
            View All {ELICHARLESE_REPO_CARDS.length} Repository Cards
          </Button>
        </motion.div>
      )}
    </div>
  )
}
