'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sword, Shield, Zap, Users, Trophy, Target, Clock, 
  Flame, Heart, Star, ArrowRight, Crown, Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { BattleField } from '@/components/battles/BattleField'
import { DeckSelector } from '@/components/battles/DeckSelector'
import { LiveChat } from '@/components/battles/LiveChat'
import { SpectatorView } from '@/components/battles/SpectatorView'

type BattlePhase = 'lobby' | 'deck-selection' | 'battle' | 'results'
type BattleMode = 'quick' | 'ranked' | 'tournament' | 'spectate'

interface Player {
  id: string
  username: string
  level: number
  rating: number
  avatar?: string
  deck?: any[]
  isReady: boolean
}

export default function BattleArenaPage() {
  const [currentPhase, setCurrentPhase] = useState<BattlePhase>('lobby')
  const [battleMode, setBattleMode] = useState<BattleMode>('quick')
  const [isSearching, setIsSearching] = useState(false)
  const [connectedPlayers, setConnectedPlayers] = useState<Player[]>([])
  const [currentBattle, setCurrentBattle] = useState<any>(null)
  const [playerDeck, setPlayerDeck] = useState<any[]>([])

  // Mock current player
  const currentPlayer: Player = {
    id: 'player-1',
    username: 'alexrivera',
    level: 42,
    rating: 2450,
    isReady: false
  }

  // Mock live battles for spectating
  const liveBattles = [
    { id: '1', players: ['DragonMaster', 'CyberKnight'], viewers: 234, phase: 'active' },
    { id: '2', players: ['TechWizard', 'CardCollector'], viewers: 156, phase: 'active' },
    { id: '3', players: ['BattleQueen', 'SwordMaster'], viewers: 89, phase: 'ending' }
  ]

  const handleQuickMatch = async () => {
    setIsSearching(true)
    setCurrentPhase('deck-selection')
    
    // Simulate matchmaking
    setTimeout(() => {
      setConnectedPlayers([
        currentPlayer,
        { id: 'opponent-1', username: 'cyberknight', level: 38, rating: 2380, isReady: false }
      ])
      setIsSearching(false)
    }, 3000)
  }

  const startBattle = () => {
    if (playerDeck.length >= 5) {
      setCurrentPhase('battle')
      setCurrentBattle({
        id: 'battle-' + Date.now(),
        players: connectedPlayers,
        startTime: new Date()
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8">
        
        {/* Arena Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-monokai-accent via-monokai-info to-monokai-success bg-clip-text text-transparent">
            Battle Arena
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enter the ultimate multiplayer battleground. Challenge opponents, 
            climb the rankings, and prove your strategic mastery.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* LOBBY PHASE */}
          {currentPhase === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Player Stats */}
              <GlassCard variant="dark" className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-monokai-accent to-monokai-info rounded-full flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">@{currentPlayer.username}</h3>
                      <p className="text-muted-foreground">Level {currentPlayer.level} • Rating {currentPlayer.rating}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Battle Record</div>
                    <div className="text-xl font-bold text-monokai-success">23W - 4L</div>
                  </div>
                </div>
              </GlassCard>

              {/* Battle Mode Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { mode: 'quick', label: 'Quick Match', desc: 'Fast-paced battles', icon: Zap, color: 'monokai-success' },
                  { mode: 'ranked', label: 'Ranked', desc: 'Competitive ladder', icon: Trophy, color: 'monokai-warning' },
                  { mode: 'tournament', label: 'Tournament', desc: 'Join tournaments', icon: Crown, color: 'monokai-accent' },
                  { mode: 'spectate', label: 'Spectate', desc: 'Watch live battles', icon: Users, color: 'monokai-info' }
                ].map(({ mode, label, desc, icon: Icon, color }) => (
                  <motion.div
                    key={mode}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GlassCard 
                      variant="light" 
                      className={`p-6 cursor-pointer transition-all ${
                        battleMode === mode ? `border-${color} bg-${color}/10` : 'hover:border-muted-foreground'
                      }`}
                      onClick={() => setBattleMode(mode as BattleMode)}
                    >
                      <div className="text-center">
                        <Icon className={`w-12 h-12 mx-auto mb-4 text-${color}`} />
                        <h3 className="text-lg font-bold mb-2">{label}</h3>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                {battleMode === 'spectate' ? (
                  <div className="w-full max-w-2xl">
                    <h3 className="text-xl font-bold mb-4 text-center">Live Battles</h3>
                    <div className="space-y-3">
                      {liveBattles.map((battle) => (
                        <GlassCard key={battle.id} variant="light" className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">
                                {battle.players[0]} vs {battle.players[1]}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {battle.viewers} viewers • {battle.phase}
                              </div>
                            </div>
                            <Button variant="gradient" size="sm">
                              <Play className="w-4 h-4 mr-1" />
                              Watch
                            </Button>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={handleQuickMatch}
                    disabled={isSearching}
                    className="px-12 py-6 text-lg"
                  >
                    {isSearching ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Finding Opponent...
                      </>
                    ) : (
                      <>
                        <Sword className="w-5 h-5 mr-2" />
                        Enter Battle
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* DECK SELECTION PHASE */}
          {currentPhase === 'deck-selection' && (
            <motion.div
              key="deck-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Prepare for Battle</h2>
                <p className="text-muted-foreground">Select your battle deck and prepare your strategy</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Opponent Info */}
                <GlassCard variant="dark" className="p-6">
                  <h3 className="text-xl font-bold mb-4">Your Opponent</h3>
                  {connectedPlayers.length > 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-monokai-accent to-monokai-warning rounded-full" />
                        <div>
                          <div className="font-semibold">@{connectedPlayers[1].username}</div>
                          <div className="text-sm text-muted-foreground">
                            Level {connectedPlayers[1].level} • #{connectedPlayers[1].rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Status:</span>
                        <span className={connectedPlayers[1].isReady ? 'text-monokai-success' : 'text-monokai-warning'}>
                          {connectedPlayers[1].isReady ? 'Ready' : 'Preparing...'}
                        </span>
                      </div>
                    </div>
                  )}
                </GlassCard>

                {/* Deck Selection */}
                <div className="lg:col-span-2">
                  <DeckSelector
                    onDeckSelected={setPlayerDeck}
                    selectedCards={playerDeck}
                    maxCards={5}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={startBattle}
                  disabled={playerDeck.length < 5}
                  className="px-8 py-4"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Ready to Battle ({playerDeck.length}/5)
                </Button>
              </div>
            </motion.div>
          )}

          {/* BATTLE PHASE */}
          {currentPhase === 'battle' && currentBattle && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Battle Field */}
                <div className="lg:col-span-3">
                  <BattleField
                    battle={currentBattle}
                    playerDeck={playerDeck}
                    onBattleEnd={(result) => {
                      setCurrentPhase('results')
                      console.log('Battle ended:', result)
                    }}
                  />
                </div>

                {/* Side Panel */}
                <div className="space-y-4">
                  {/* Battle Info */}
                  <GlassCard variant="dark" className="p-4">
                    <h4 className="font-bold mb-2">Battle Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mode:</span>
                        <span className="capitalize">{battleMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Turn:</span>
                        <span className="text-monokai-accent">Your Turn</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="text-monokai-warning">00:45</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Live Chat */}
                  <LiveChat 
                    battleId={currentBattle.id} 
                    currentUser="Guest User"
                    userRole="spectator"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
