'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sword, Shield, Zap, Target, Crown, Star, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RepositoryCard } from '@/components/repository-card'
import { ELICHARLESE_REPO_CARDS, GitHubRepoCard } from '@/data/github-repo-cards'
import toast from 'react-hot-toast'

interface BattleState {
  player1: GitHubRepoCard | null
  player2: GitHubRepoCard | null
  battlePhase: 'selection' | 'preparation' | 'battle' | 'results'
  winner: GitHubRepoCard | null
  battleLog: string[]
  playerScore: number
  opponentScore: number
}

export const BattleArena: React.FC = () => {
  const [battleState, setBattleState] = useState<BattleState>({
    player1: null,
    player2: null,
    battlePhase: 'selection',
    winner: null,
    battleLog: [],
    playerScore: 0,
    opponentScore: 0
  })

  const [selectedCards, setSelectedCards] = useState<GitHubRepoCard[]>([])
  const [battleAnimation, setBattleAnimation] = useState(false)

  // Get random opponent card
  const getRandomOpponent = (excludeId?: string): GitHubRepoCard => {
    const availableCards = ELICHARLESE_REPO_CARDS.filter(card => card.id !== excludeId)
    return availableCards[Math.floor(Math.random() * availableCards.length)]
  }

  // Calculate battle outcome based on stats
  const calculateBattleOutcome = (card1: GitHubRepoCard, card2: GitHubRepoCard) => {
    const card1Power = 
      card1.battleStats.attack * 0.3 +
      card1.battleStats.defense * 0.2 +
      card1.battleStats.speed * 0.25 +
      card1.battleStats.utility * 0.25

    const card2Power = 
      card2.battleStats.attack * 0.3 +
      card2.battleStats.defense * 0.2 +
      card2.battleStats.speed * 0.25 +
      card2.battleStats.utility * 0.25

    // Add some randomness (±20%)
    const randomFactor1 = 0.8 + Math.random() * 0.4
    const randomFactor2 = 0.8 + Math.random() * 0.4

    const finalPower1 = card1Power * randomFactor1
    const finalPower2 = card2Power * randomFactor2

    return {
      winner: finalPower1 > finalPower2 ? card1 : card2,
      powerDifference: Math.abs(finalPower1 - finalPower2),
      card1Power: Math.round(finalPower1),
      card2Power: Math.round(finalPower2)
    }
  }

  const startBattle = (playerCard: GitHubRepoCard) => {
    const opponent = getRandomOpponent(playerCard.id)
    
    setBattleState(prev => ({
      ...prev,
      player1: playerCard,
      player2: opponent,
      battlePhase: 'preparation',
      battleLog: [
        `🎯 ${playerCard.displayName} vs ${opponent.displayName}`,
        `⚔️ Battle commencing...`
      ]
    }))

    // Auto-start battle after preparation
    setTimeout(() => {
      setBattleState(prev => ({ ...prev, battlePhase: 'battle' }))
      setBattleAnimation(true)
      
      setTimeout(() => {
        const outcome = calculateBattleOutcome(playerCard, opponent)
        const isPlayerWin = outcome.winner.id === playerCard.id
        
        setBattleState(prev => ({
          ...prev,
          winner: outcome.winner,
          battlePhase: 'results',
          playerScore: isPlayerWin ? prev.playerScore + 1 : prev.playerScore,
          opponentScore: isPlayerWin ? prev.opponentScore : prev.opponentScore + 1,
          battleLog: [
            ...prev.battleLog,
            `💥 Battle Power: ${playerCard.displayName} (${outcome.card1Power}) vs ${opponent.displayName} (${outcome.card2Power})`,
            `🏆 Winner: ${outcome.winner.displayName}!`,
            isPlayerWin ? '🎉 Victory!' : '💔 Defeat...'
          ]
        }))

        setBattleAnimation(false)

        // Show result toast
        if (isPlayerWin) {
          toast.success(`🏆 Victory! ${playerCard.displayName} wins!`, {
            duration: 4000,
            style: {
              background: 'rgba(39, 40, 34, 0.9)',
              color: '#F8EFD6',
              border: '1px solid #A6E22E'
            }
          })
        } else {
          toast.error(`💔 Defeat! ${opponent.displayName} wins!`, {
            duration: 4000,
            style: {
              background: 'rgba(39, 40, 34, 0.9)',
              color: '#F8EFD6',
              border: '1px solid #F92672'
            }
          })
        }
      }, 3000)
    }, 2000)
  }

  const resetBattle = () => {
    setBattleState({
      player1: null,
      player2: null,
      battlePhase: 'selection',
      winner: null,
      battleLog: [],
      playerScore: battleState.playerScore,
      opponentScore: battleState.opponentScore
    })
    setBattleAnimation(false)
  }

  const getTopCards = () => {
    return ELICHARLESE_REPO_CARDS
      .sort((a, b) => {
        const aPower = a.battleStats.attack + a.battleStats.defense + a.battleStats.speed + a.battleStats.utility
        const bPower = b.battleStats.attack + b.battleStats.defense + b.battleStats.speed + b.battleStats.utility
        return bPower - aPower
      })
      .slice(0, 6)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
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
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-shadow-strong">
            ⚔️ Battle Arena
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enter the ultimate coding battleground where repositories clash in epic stat-based combat
          </p>
        </motion.div>

        {/* Score Board */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="glass-card p-6 shadow-card-ece">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{battleState.playerScore}</div>
                <div className="text-sm text-muted-foreground">Your Wins</div>
              </div>
              <div className="text-4xl">🆚</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{battleState.opponentScore}</div>
                <div className="text-sm text-muted-foreground">AI Wins</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Battle State Content */}
        <AnimatePresence mode="wait">
          {battleState.battlePhase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Fighter</h2>
                <p className="text-muted-foreground">Select a repository card to enter battle</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTopCards().map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => startBattle(card)}
                  >
                    <RepositoryCard
                      repository={card}
                      variant="default"
                      showActions={false}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(battleState.battlePhase === 'preparation' || battleState.battlePhase === 'battle') && battleState.player1 && battleState.player2 && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {battleState.battlePhase === 'preparation' ? '⚡ Preparing for Battle' : '⚔️ Battle in Progress'}
                </h2>
                <div className="flex justify-center">
                  {battleState.battlePhase === 'battle' && (
                    <Progress value={battleAnimation ? 100 : 0} className="w-64 h-2" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Player Card */}
                <motion.div
                  animate={battleAnimation ? { 
                    x: [0, 20, -20, 0],
                    rotateY: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 0.5, repeat: battleAnimation ? 6 : 0 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <Badge className="absolute -top-2 -left-2 z-10 bg-green-500">YOU</Badge>
                    <RepositoryCard
                      repository={battleState.player1}
                      variant="default"
                      showActions={false}
                    />
                  </div>
                </motion.div>

                {/* VS Indicator */}
                <div className="flex justify-center lg:col-span-2 lg:row-start-1 lg:col-start-1 lg:col-end-3">
                  <motion.div 
                    className="text-6xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent"
                    animate={battleAnimation ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 1, repeat: battleAnimation ? 3 : 0 }}
                  >
                    VS
                  </motion.div>
                </div>

                {/* Opponent Card */}
                <motion.div
                  animate={battleAnimation ? { 
                    x: [0, -20, 20, 0],
                    rotateY: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.5, repeat: battleAnimation ? 6 : 0 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <Badge className="absolute -top-2 -right-2 z-10 bg-red-500">AI</Badge>
                    <RepositoryCard
                      repository={battleState.player2}
                      variant="default"
                      showActions={false}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {battleState.battlePhase === 'results' && battleState.winner && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-4xl font-bold text-foreground mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  🏆 Battle Results
                </motion.h2>
                <p className="text-xl text-muted-foreground">
                  Winner: <span className="text-yellow-400 font-bold">{battleState.winner.displayName}</span>
                </p>
              </div>

              {/* Winner Display */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl" />
                  <RepositoryCard
                    repository={battleState.winner}
                    variant="detailed"
                    showActions={false}
                  />
                  <motion.div 
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-6xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👑
                  </motion.div>
                </motion.div>
              </div>

              {/* Battle Log */}
              <div className="max-w-2xl mx-auto">
                <Card className="glass-card shadow-card-ece">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Battle Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {battleState.battleLog.map((log, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-2 bg-background/20 rounded text-sm"
                        >
                          {log}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetBattle}
                  variant="default"
                  size="lg"
                  className="shadow-soft hover:shadow-soft-lg"
                >
                  <Sword className="h-5 w-5 mr-2" />
                  Battle Again
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="shadow-soft hover:shadow-soft-lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Back to Arena
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
