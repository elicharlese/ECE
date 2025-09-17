'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, Star, Sword, Shield, Zap, 
  Plus, Minus, Check, X, Shuffle, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'

interface Card {
  id: string
  name: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'
  cost: number
  attack: number
  defense: number
  health: number
  type: 'Creature' | 'Spell' | 'Artifact'
  abilities: string[]
  image?: string
}

interface DeckSelectorProps {
  onDeckSelected: (cards: Card[]) => void
  selectedCards: Card[]
  maxCards: number
}

export function DeckSelector({ onDeckSelected, selectedCards, maxCards }: DeckSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'creature' | 'spell' | 'artifact'>('all')
  const [availableCards, setAvailableCards] = useState<Card[]>([])
  const [deckCards, setDeckCards] = useState<Card[]>(selectedCards)

  // Mock card collection
  useEffect(() => {
    const mockCards: Card[] = [
      {
        id: '1', name: 'Cyber Dragon', rarity: 'Legendary', cost: 5, attack: 8, defense: 6, health: 10,
        type: 'Creature', abilities: ['Flying', 'First Strike']
      },
      {
        id: '2', name: 'Lightning Bolt', rarity: 'Common', cost: 1, attack: 0, defense: 0, health: 0,
        type: 'Spell', abilities: ['Deal 3 damage']
      },
      {
        id: '3', name: 'Steel Guardian', rarity: 'Rare', cost: 3, attack: 4, defense: 8, health: 7,
        type: 'Creature', abilities: ['Defender', 'Shield']
      },
      {
        id: '4', name: 'Mystic Orb', rarity: 'Epic', cost: 2, attack: 0, defense: 0, health: 0,
        type: 'Artifact', abilities: ['Draw a card', 'Gain 1 energy']
      },
      {
        id: '5', name: 'Fire Phoenix', rarity: 'Mythic', cost: 7, attack: 12, defense: 4, health: 8,
        type: 'Creature', abilities: ['Flying', 'Rebirth']
      },
      {
        id: '6', name: 'Healing Potion', rarity: 'Common', cost: 1, attack: 0, defense: 0, health: 0,
        type: 'Spell', abilities: ['Restore 5 health']
      },
      {
        id: '7', name: 'Shadow Assassin', rarity: 'Rare', cost: 4, attack: 7, defense: 3, health: 5,
        type: 'Creature', abilities: ['Stealth', 'Quick Strike']
      },
      {
        id: '8', name: 'Energy Crystal', rarity: 'Rare', cost: 2, attack: 0, defense: 0, health: 0,
        type: 'Artifact', abilities: ['Gain 2 energy per turn']
      }
    ]
    setAvailableCards(mockCards)
  }, [])

  const filteredCards = availableCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || card.type.toLowerCase() === selectedFilter
    const notInDeck = !deckCards.find(deckCard => deckCard.id === card.id)
    return matchesSearch && matchesFilter && notInDeck
  })

  const addToDeck = (card: Card) => {
    if (deckCards.length < maxCards) {
      const newDeck = [...deckCards, card]
      setDeckCards(newDeck)
      onDeckSelected(newDeck)
    }
  }

  const removeFromDeck = (cardId: string) => {
    const newDeck = deckCards.filter(card => card.id !== cardId)
    setDeckCards(newDeck)
    onDeckSelected(newDeck)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Mythic': return 'from-purple-600 to-pink-600'
      case 'Legendary': return 'from-yellow-500 to-orange-500'
      case 'Epic': return 'from-blue-500 to-cyan-500'
      case 'Rare': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Creature': return <Sword className="w-4 h-4" />
      case 'Spell': return <Zap className="w-4 h-4" />
      case 'Artifact': return <Star className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  const shuffleDeck = () => {
    if (availableCards.length >= maxCards) {
      const shuffled = [...availableCards].sort(() => Math.random() - 0.5).slice(0, maxCards)
      setDeckCards(shuffled)
      onDeckSelected(shuffled)
    }
  }

  return (
    <div className="space-y-6">
      {/* Deck Status */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Battle Deck Builder</h3>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${
              deckCards.length === maxCards ? 'text-monokai-success' : 'text-monokai-warning'
            }`}>
              {deckCards.length}/{maxCards}
            </span>
            <span className="text-sm text-muted-foreground">cards</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={shuffleDeck}>
            <Shuffle className="w-4 h-4 mr-1" />
            Random Deck
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setDeckCards([]); onDeckSelected([]) }}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Collection */}
        <div className="space-y-4">
          <GlassCard variant="light" className="p-4">
            <h4 className="text-lg font-semibold mb-4">Your Collection</h4>
            
            {/* Search and Filters */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="bg-background border border-border rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="creature">Creatures</option>
                <option value="spell">Spells</option>
                <option value="artifact">Artifacts</option>
              </select>
            </div>

            {/* Available Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredCards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -2 }}
                    className={`bg-gradient-to-br ${getRarityColor(card.rarity)}/20 border border-current/30 rounded-lg p-3 cursor-pointer transition-all hover:border-current/60`}
                    onClick={() => addToDeck(card)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-sm">{card.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          {getTypeIcon(card.type)}
                          {card.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs bg-background/50 rounded px-1">{card.cost}⚡</div>
                      </div>
                    </div>

                    {card.type === 'Creature' && (
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-red-400">{card.attack}⚔️</span>
                        <span className="text-blue-400">{card.defense}🛡️</span>
                        <span className="text-green-400">{card.health}❤️</span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      {card.abilities.slice(0, 2).join(', ')}
                    </div>

                    <div className="mt-2 flex justify-center">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Current Deck */}
        <div className="space-y-4">
          <GlassCard variant="dark" className="p-4">
            <h4 className="text-lg font-semibold mb-4">Current Deck</h4>
            
            {deckCards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sword className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your deck is empty</p>
                <p className="text-sm mt-1">Add cards from your collection</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {deckCards.map((card, index) => (
                    <motion.div
                      key={`${card.id}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`bg-gradient-to-r ${getRarityColor(card.rarity)}/20 border border-current/30 rounded-lg p-3 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        {getTypeIcon(card.type)}
                        <div>
                          <div className="font-medium text-sm">{card.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {card.cost}⚡ • {card.rarity}
                          </div>
                        </div>
                      </div>
                      
                      {card.type === 'Creature' && (
                        <div className="flex gap-2 text-xs">
                          <span className="text-red-400">{card.attack}</span>
                          <span className="text-blue-400">{card.defense}</span>
                          <span className="text-green-400">{card.health}</span>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => removeFromDeck(card.id)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Deck Stats */}
            {deckCards.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold">Avg Cost</div>
                    <div className="text-monokai-info">
                      {(deckCards.reduce((sum, card) => sum + card.cost, 0) / deckCards.length).toFixed(1)}⚡
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Creatures</div>
                    <div className="text-monokai-success">
                      {deckCards.filter(card => card.type === 'Creature').length}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Spells</div>
                    <div className="text-monokai-accent">
                      {deckCards.filter(card => card.type === 'Spell').length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Deck Validation */}
          <GlassCard variant="light" className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {deckCards.length === maxCards ? (
                  <Check className="w-4 h-4 text-monokai-success" />
                ) : (
                  <X className="w-4 h-4 text-monokai-accent" />
                )}
                <span className="text-sm">
                  Deck size: {deckCards.length}/{maxCards}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {deckCards.filter(card => card.type === 'Creature').length >= 2 ? (
                  <Check className="w-4 h-4 text-monokai-success" />
                ) : (
                  <X className="w-4 h-4 text-monokai-accent" />
                )}
                <span className="text-sm">
                  Minimum 2 creatures required
                </span>
              </div>

              {deckCards.length === maxCards && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-monokai-success/10 border border-monokai-success/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-sm text-monokai-success">
                    <Check className="w-4 h-4" />
                    Deck is ready for battle!
                  </div>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
