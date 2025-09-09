'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  SortDesc, 
  Clock, 
  Gavel, 
  DollarSign, 
  Star, 
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { AuctionCard } from './AuctionCard'

interface Auction {
  id: string
  cardName: string
  cardCategory: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'
  currentBid: number
  minBidIncrement: number
  reservePrice: number
  instantBuyPrice?: number
  timeLeft: number
  totalBids: number
  uniqueBidders: number
  watchers: number
  volume24h: number
  highestBidder: string
  sellerName: string
  imageUrl: string
  description: string
  stats: any
}

interface AuctionListProps {
  auctions: Auction[]
  onBidPlaced?: (auctionId: string, amount: number) => void
  onAuctionCreated?: () => void
}

export function AuctionList({ auctions, onBidPlaced, onAuctionCreated }: AuctionListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('ending-soon')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  // Get unique categories from auctions
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(auctions.map(auction => auction.cardCategory))]
    return uniqueCategories
  }, [auctions])

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    const filtered = auctions.filter(auction => {
      const matchesSearch = auction.cardName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          auction.cardCategory.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRarity = rarityFilter === 'all' || auction.rarity === rarityFilter
      const matchesCategory = categoryFilter === 'all' || auction.cardCategory === categoryFilter
      const matchesPrice = auction.currentBid >= priceRange[0] && auction.currentBid <= priceRange[1]
      
      return matchesSearch && matchesRarity && matchesCategory && matchesPrice
    })

    // Sort auctions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return a.timeLeft - b.timeLeft
        case 'price-high':
          return b.currentBid - a.currentBid
        case 'price-low':
          return a.currentBid - b.currentBid
        case 'most-bids':
          return b.totalBids - a.totalBids
        case 'trending':
          return b.volume24h - a.volume24h
        default:
          return a.timeLeft - b.timeLeft
      }
    })

    return filtered
  }, [auctions, searchTerm, rarityFilter, categoryFilter, sortBy, priceRange])

  // Format time left
  const formatTimeLeft = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarity</SelectItem>
                <SelectItem value="COMMON">Common</SelectItem>
                <SelectItem value="RARE">Rare</SelectItem>
                <SelectItem value="EPIC">Epic</SelectItem>
                <SelectItem value="LEGENDARY">Legendary</SelectItem>
                <SelectItem value="MYTHIC">Mythic</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="most-bids">Most Bids</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={onAuctionCreated}>
            <Gavel className="h-4 w-4 mr-2" />
            Create Auction
          </Button>
        </div>
      </div>

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAuctions.map((auction) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AuctionCard 
                auction={auction} 
                onBidPlaced={onBidPlaced}
                formatTimeLeft={formatTimeLeft}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAuctions.length === 0 && (
        <div className="text-center py-12">
          <Gavel className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No auctions found</h3>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}
