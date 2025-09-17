'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sword, Shield, Heart, Zap, Flame, Star, 
  Clock, Trophy, Target, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'

interface BattleFieldProps {
  battle: any
  playerDeck: any[]
  onBattleEnd: (result: 'win' | 'lose' | 'draw') => void
}

interface BattleCard {
  id: string
  name: string
  attack: number
  defense: number
  health: number
  maxHealth: number
  energy: number
  abilities: string[]
  image?: string
}

export function BattleField({ battle, playerDeck, onBattleEnd }: BattleFieldProps) {
  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing')
  const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player')
  const [turnTimeLeft, setTurnTimeLeft] = useState(30)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [opponentHealth, setOpponentHealth] = useState(100)
  const [playerEnergy, setPlayerEnergy] = useState(3)
  const [opponentEnergy, setOpponentEnergy] = useState(3)
  const [playerField, setPlayerField] = useState<BattleCard[]>([])
  const [opponentField, setOpponentField] = useState<BattleCard[]>([])
  const [playerHand, setPlayerHand] = useState<BattleCard[]>([])
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [battleLog, setBattleLog] = useState<string[]>(['Battle begins!'])

  // Initialize battle
  useEffect(() => {
    const initialHand = playerDeck.slice(0, 3).map((card, index) => ({
      id: `card-${index}`,
      name: card.name || `Card ${index + 1}`,
      attack: Math.floor(Math.random() * 5) + 2,
      defense: Math.floor(Math.random() * 4) + 1,
      health: Math.floor(Math.random() * 6) + 3,
      maxHealth: Math.floor(Math.random() * 6) + 3,
      energy: Math.floor(Math.random() * 3) + 1,
      abilities: []
    }))
    setPlayerHand(initialHand)

    // Mock opponent cards
    const opponentCards = Array.from({ length: 2 }, (_, i) => ({
      id: `opp-${i}`,
      name: `Enemy ${i + 1}`,
      attack: Math.floor(Math.random() * 4) + 2,
      defense: Math.floor(Math.random() * 3) + 1,
      health: Math.floor(Math.random() * 5) + 3,
      maxHealth: Math.floor(Math.random() * 5) + 3,
      energy: Math.floor(Math.random() * 3) + 1,
      abilities: []
    }))
    setOpponentField(opponentCards)
  }, [playerDeck])

  // Turn timer
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTurnTimeLeft(prev => {
          if (prev <= 1) {
            endTurn()
            return 30
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentTurn, gameState])

  const playCard = (cardId: string) => {
    const card = playerHand.find(c => c.id === cardId)
    if (!card || playerEnergy < card.energy) return

    setPlayerField(prev => [...prev, card])
    setPlayerHand(prev => prev.filter(c => c.id !== cardId))
    setPlayerEnergy(prev => prev - card.energy)
    setBattleLog(prev => [...prev, `You played ${card.name}`])
    setSelectedCard(null)
  }

  const attackWithCard = (attackerId: string, targetId?: string) => {
    const attacker = playerField.find(c => c.id === attackerId)
    if (!attacker) return

    if (targetId) {
      // Attack enemy card
      const target = opponentField.find(c => c.id === targetId)
      if (target) {
        const damage = Math.max(1, attacker.attack - target.defense)
        setOpponentField(prev => prev.map(c => 
          c.id === targetId 
            ? { ...c, health: Math.max(0, c.health - damage) }
            : c
        ).filter(c => c.health > 0))
        setBattleLog(prev => [...prev, `${attacker.name} attacks ${target.name} for ${damage} damage`])
      }
    } else {
      // Direct attack on opponent
      const damage = attacker.attack
      setOpponentHealth(prev => Math.max(0, prev - damage))
      setBattleLog(prev => [...prev, `${attacker.name} attacks directly for ${damage} damage`])
    }
  }

  const endTurn = () => {
    setCurrentTurn(prev => prev === 'player' ? 'opponent' : 'player')
    setTurnTimeLeft(30)
    
    if (currentTurn === 'player') {
      setPlayerEnergy(Math.min(10, playerEnergy + 1))
    } else {
      setOpponentEnergy(Math.min(10, opponentEnergy + 1))
      // Simple AI turn
      setTimeout(() => {
        if (opponentField.length > 0) {
          const randomCard = opponentField[Math.floor(Math.random() * opponentField.length)]
          const damage = randomCard.attack
          setPlayerHealth(prev => Math.max(0, prev - damage))
          setBattleLog(prev => [...prev, `${randomCard.name} attacks you for ${damage} damage`])
        }
      }, 1000)
    }
  }

  // Check win conditions
  useEffect(() => {
    if (playerHealth <= 0) {
      setGameState('ended')
      onBattleEnd('lose')
    } else if (opponentHealth <= 0) {
      setGameState('ended')
      onBattleEnd('win')
    }
  }, [playerHealth, opponentHealth])

  return (
    <div className="space-y-6">
      {/* Battle Status */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div className="w-32 bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${playerHealth}%` }}
                />
              </div>
              <span className="text-sm font-mono">{playerHealth}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-mono">{playerEnergy}/10</span>
            </div>
          </div>

          <div className="text-center">
            <div className={`text-lg font-bold ${
              currentTurn === 'player' ? 'text-monokai-success' : 'text-monokai-warning'
            }`}>
              {currentTurn === 'player' ? 'Your Turn' : 'Opponent\'s Turn'}
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{turnTimeLeft}s</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{opponentHealth}/100</span>
              <div className="w-32 bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${opponentHealth}%` }}
                />
              </div>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{opponentEnergy}/10</span>
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Battle Field */}
      <div className="grid grid-cols-1 gap-6">
        {/* Opponent Field */}
        <GlassCard variant="light" className="p-4">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Opponent's Field</h4>
          <div className="flex gap-3 min-h-[100px]">
            <AnimatePresence>
              {opponentField.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-20 bg-gradient-to-br from-monokai-accent/20 to-monokai-accent/10 border border-monokai-accent/30 rounded-lg p-2 cursor-pointer hover:border-monokai-accent"
                >
                  <div className="text-xs text-center mb-1 truncate">{card.name}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">{card.attack}</span>
                    <span className="text-blue-400">{card.defense}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded h-1 mt-1">
                    <div 
                      className="bg-green-500 h-1 rounded transition-all"
                      style={{ width: `${(card.health / card.maxHealth) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Player Field */}
        <GlassCard variant="light" className="p-4">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Your Field</h4>
          <div className="flex gap-3 min-h-[100px]">
            <AnimatePresence>
              {playerField.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`w-20 bg-gradient-to-br from-monokai-success/20 to-monokai-success/10 border rounded-lg p-2 cursor-pointer transition-all ${
                    selectedCard === card.id 
                      ? 'border-monokai-success ring-2 ring-monokai-success/50' 
                      : 'border-monokai-success/30 hover:border-monokai-success'
                  }`}
                  onClick={() => setSelectedCard(card.id === selectedCard ? null : card.id)}
                >
                  <div className="text-xs text-center mb-1 truncate">{card.name}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">{card.attack}</span>
                    <span className="text-blue-400">{card.defense}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded h-1 mt-1">
                    <div 
                      className="bg-green-500 h-1 rounded transition-all"
                      style={{ width: `${(card.health / card.maxHealth) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>

      {/* Player Hand */}
      <GlassCard variant="dark" className="p-4">
        <h4 className="text-sm font-semibold mb-3">Your Hand</h4>
        <div className="flex gap-3 overflow-x-auto">
          {playerHand.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -5, scale: 1.05 }}
              className={`min-w-[80px] bg-gradient-to-br from-monokai-info/20 to-monokai-info/10 border rounded-lg p-3 cursor-pointer transition-all ${
                playerEnergy >= card.energy 
                  ? 'border-monokai-info/50 hover:border-monokai-info' 
                  : 'border-gray-600 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => playerEnergy >= card.energy && playCard(card.id)}
            >
              <div className="text-xs text-center mb-2 truncate">{card.name}</div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400">{card.attack}</span>
                <span className="text-blue-400">{card.defense}</span>
              </div>
              <div className="text-center">
                <span className="text-yellow-400 text-xs">{card.energy}⚡</span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Battle Actions */}
      <div className="flex gap-4 justify-center">
        {selectedCard && (
          <>
            <Button
              variant="destructive"
              onClick={() => attackWithCard(selectedCard)}
            >
              <Sword className="w-4 h-4 mr-2" />
              Direct Attack
            </Button>
            {opponentField.length > 0 && (
              <Button
                variant="outline"
                onClick={() => attackWithCard(selectedCard, opponentField[0].id)}
              >
                <Target className="w-4 h-4 mr-2" />
                Attack Card
              </Button>
            )}
          </>
        )}
        
        {currentTurn === 'player' && (
          <Button
            variant="ghost"
            onClick={endTurn}
          >
            End Turn
          </Button>
        )}
      </div>

      {/* Battle Log */}
      <GlassCard variant="light" className="p-4">
        <h4 className="text-sm font-semibold mb-3">Battle Log</h4>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {battleLog.slice(-10).map((log, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              {log}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
