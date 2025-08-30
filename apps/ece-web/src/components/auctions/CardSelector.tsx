'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Star, 
  Filter,
  Check
} from 'lucide-react'
import type { CardSummary } from '@ece-platform/shared-types'

interface CardSelectorProps {
  cards: CardSummary[]
  selectedCard: CardSummary | null
  onCardSelect: (card: CardSummary) => void
}

const rarityColors: Record<CardSummary['rarity'], string> = {
  COMMON: 'bg-gray-200 text-gray-800',
  RARE: 'bg-blue-200 text-blue-800',
  EPIC: 'bg-purple-200 text-purple-800',
  LEGENDARY: 'bg-yellow-200 text-yellow-800',
  MYTHIC: 'bg-red-200 text-red-800'
}

export function CardSelector({ cards, selectedCard, onCardSelect }: CardSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rarityFilter, setRarityFilter] = useState('all')
  
  // Get unique categories from cards
  const categories = [...new Set(cards.map(card => card.category))]
  
  // Filter cards based on search and filters
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        card.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || card.category === categoryFilter
    const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter
    
    return matchesSearch && matchesCategory && matchesRarity
  })
  
  const getRarityColor = (rarity: string) => {
    return rarityColors[rarity as keyof typeof rarityColors] || 'bg-gray-200 text-gray-800'
  }
  
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your cards..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={categoryFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            value={rarityFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRarityFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Rarity</option>
            <option value="COMMON">Common</option>
            <option value="RARE">Rare</option>
            <option value="EPIC">Epic</option>
            <option value="LEGENDARY">Legendary</option>
            <option value="MYTHIC">Mythic</option>
          </select>
        </div>
      </div>
      
      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedCard?.id === card.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'}`}
              onClick={() => onCardSelect(card)}
            >
              <div className="aspect-square bg-muted relative">
                {card.imageUrl ? (
                  <img 
                    src={card.imageUrl} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                {/* Rarity Badge */}
                <Badge className={`absolute top-2 left-2 ${getRarityColor(card.rarity)}`}>
                  {card.rarity}
                </Badge>
                
                {/* Valuation */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {card.valuation > 0 ? `${card.valuation.toFixed(2)} ECE` : 'No valuation'}
                </div>
                
                {/* Selected Indicator */}
                {selectedCard?.id === card.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-2">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-2 bg-background">
                <p className="text-xs font-medium truncate">{card.name}</p>
                <p className="text-xs text-muted-foreground truncate">{card.category}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2" />
            <p>No cards found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {selectedCard && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Selected Card:</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-10 h-10 rounded bg-muted relative">
              {selectedCard.imageUrl ? (
                <img 
                  src={selectedCard.imageUrl} 
                  alt={selectedCard.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{selectedCard.name}</p>
              <p className="text-xs text-muted-foreground">{selectedCard.category} • {selectedCard.rarity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
