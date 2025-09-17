'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sword, Shield, Zap, Users, Clock, Star, 
  Trophy, Target, AlertTriangle, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'

interface BattlePreparationProps {
  card: {
    id: string
    name: string
    battleStats: {
      attack: number
      defense: number
      agility: number
      special: number
    }
    battles: {
      won: number
      lost: number
      total: number
    }
  }
  onBattleStart: (opponent: string) => void
}

export function BattlePreparation({ card, onBattleStart }: BattlePreparationProps) {
  const [selectedOpponent, setSelectedOpponent] = useState<string>('')
  const [battleType, setBattleType] = useState<'ranked' | 'casual' | 'tournament'>('casual')
  const [isSearching, setIsSearching] = useState(false)

  const mockOpponents = [
    { id: '1', name: 'CyberKnight Alpha', owner: 'techmaster', winRate: 78, rating: 2450 },
    { id: '2', name: 'Dragon Empress', owner: 'firebird', winRate: 85, rating: 2680 },
    { id: '3', name: 'Stellar Warrior', owner: 'starfighter', winRate: 72, rating: 2350 },
    { id: '4', name: 'Mystic Guardian', owner: 'naturespirit', winRate: 91, rating: 2890 }
  ]

  const winRate = card.battles.total > 0 ? Math.round((card.battles.won / card.battles.total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Battle Stats Overview */}
      <GlassCard variant="dark" className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sword className="w-5 h-5 text-monokai-accent" />
          Battle Preparation
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-monokai-accent">{card.battleStats.attack}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Sword className="w-3 h-3" />
              Attack
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-monokai-info">{card.battleStats.defense}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Defense
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-monokai-success">{card.battleStats.agility}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" />
              Agility
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-monokai-warning">{card.battleStats.special}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Star className="w-3 h-3" />
              Special
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-monokai-bg/20 rounded-lg p-4">
          <div>
            <div className="text-sm text-muted-foreground">Battle Record</div>
            <div className="font-bold">{card.battles.won}W - {card.battles.lost}L ({winRate}% WR)</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Battles</div>
            <div className="font-bold">{card.battles.total}</div>
          </div>
        </div>
      </GlassCard>

      {/* Battle Type Selection */}
      <GlassCard variant="light" className="p-6">
        <h4 className="text-lg font-semibold mb-4">Select Battle Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'casual', label: 'Casual', desc: 'Practice battles with no ranking impact', icon: Users },
            { type: 'ranked', label: 'Ranked', desc: 'Competitive battles that affect your rating', icon: Trophy },
            { type: 'tournament', label: 'Tournament', desc: 'Enter active tournaments for prizes', icon: Target }
          ].map(({ type, label, desc, icon: Icon }) => (
            <motion.div
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => setBattleType(type as any)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  battleType === type
                    ? 'border-monokai-accent bg-monokai-accent/10'
                    : 'border-border hover:border-monokai-accent/50'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-monokai-accent" />
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-muted-foreground mt-1">{desc}</div>
              </button>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Opponent Selection */}
      <GlassCard variant="light" className="p-6">
        <h4 className="text-lg font-semibold mb-4">Choose Your Opponent</h4>
        <div className="space-y-3">
          {mockOpponents.map((opponent) => (
            <motion.div
              key={opponent.id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedOpponent === opponent.id
                  ? 'border-monokai-accent bg-monokai-accent/10'
                  : 'border-border hover:border-monokai-accent/50'
              }`}
              onClick={() => setSelectedOpponent(opponent.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{opponent.name}</div>
                  <div className="text-sm text-muted-foreground">@{opponent.owner}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{opponent.winRate}% WR</div>
                  <div className="text-sm text-muted-foreground">#{opponent.rating}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-monokai-warning/10 border border-monokai-warning/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-monokai-warning mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-monokai-warning">Battle Tips</div>
              <div className="text-muted-foreground mt-1">
                Choose opponents with similar power levels for balanced battles. 
                Higher-rated opponents offer better rewards but increased difficulty.
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Battle Actions */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            variant="gradient"
            size="lg"
            className="flex-1"
            disabled={!selectedOpponent || isSearching}
            onClick={() => {
              setIsSearching(true)
              setTimeout(() => {
                onBattleStart(selectedOpponent)
                setIsSearching(false)
              }, 2000)
            }}
          >
            {isSearching ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Finding Battle...
              </>
            ) : (
              <>
                <Sword className="w-4 h-4 mr-2" />
                Start Battle
              </>
            )}
          </Button>
          
          <Button variant="outline" size="lg" className="md:w-auto">
            <Users className="w-4 h-4 mr-2" />
            Quick Match
          </Button>
        </div>

        {selectedOpponent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-monokai-success/10 border border-monokai-success/30 rounded-lg"
          >
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-monokai-success" />
              <span className="text-monokai-success font-medium">Opponent Selected</span>
              <span className="text-muted-foreground">- Ready to battle!</span>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  )
}
