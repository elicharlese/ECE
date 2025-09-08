'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, Users, Crown, Star, TrendingUp, 
  Heart, MessageSquare, Share2, Volume2, VolumeX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'

interface Player {
  id: string
  name: string
  avatar: string
  rank: string
  wins: number
  losses: number
  currentHP: number
  maxHP: number
  cardsInHand: number
  cardsInDeck: number
}

interface SpectatorViewProps {
  battleId: string
  player1: Player
  player2: Player
  currentTurn: string
  spectatorCount: number
}

export function SpectatorView({ 
  battleId, 
  player1, 
  player2, 
  currentTurn, 
  spectatorCount 
}: SpectatorViewProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isFollowingPlayer1, setIsFollowingPlayer1] = useState(false)
  const [isFollowingPlayer2, setIsFollowingPlayer2] = useState(false)

  const PlayerCard = ({ player, isCurrentTurn }: { player: Player; isCurrentTurn: boolean }) => (
    <GlassCard variant={isCurrentTurn ? "light" : "dark"} className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-monokai-accent to-monokai-info flex items-center justify-center text-lg font-bold">
            {player.name.charAt(0)}
          </div>
          {isCurrentTurn && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-monokai-success rounded-full"
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{player.name}</h3>
            <Crown className="w-4 h-4 text-monokai-warning" />
          </div>
          <div className="text-sm text-muted-foreground">
            {player.rank} • {player.wins}W - {player.losses}L
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => player.id === player1.id ? setIsFollowingPlayer1(!isFollowingPlayer1) : setIsFollowingPlayer2(!isFollowingPlayer2)}
        >
          <Heart className={`w-4 h-4 ${
            (player.id === player1.id && isFollowingPlayer1) || 
            (player.id === player2.id && isFollowingPlayer2)
              ? 'fill-monokai-accent text-monokai-accent' 
              : 'text-muted-foreground'
          }`} />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Health Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Health</span>
            <span className="text-sm font-medium">{player.currentHP}/{player.maxHP}</span>
          </div>
          <div className="w-full bg-monokai-bg/30 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(player.currentHP / player.maxHP) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-2 rounded-full bg-gradient-to-r from-monokai-accent to-monokai-success"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center p-2 bg-monokai-bg/20 rounded">
            <div className="text-muted-foreground">Hand</div>
            <div className="font-bold text-monokai-info">{player.cardsInHand}</div>
          </div>
          <div className="text-center p-2 bg-monokai-bg/20 rounded">
            <div className="text-muted-foreground">Deck</div>
            <div className="font-bold text-monokai-warning">{player.cardsInDeck}</div>
          </div>
        </div>
      </div>
    </GlassCard>
  )

  return (
    <div className="space-y-6">
      {/* Spectator Header */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-monokai-info" />
              <span className="font-semibold">Spectating Battle</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{spectatorCount.toLocaleString()} watching</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-monokai-success" />
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Players */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlayerCard player={player1} isCurrentTurn={currentTurn === player1.id} />
        <PlayerCard player={player2} isCurrentTurn={currentTurn === player2.id} />
      </div>

      {/* Battle Stats */}
      <GlassCard variant="light" className="p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Battle Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-monokai-bg/10 rounded-lg">
            <div className="text-2xl font-bold text-monokai-success">5</div>
            <div className="text-sm text-muted-foreground">Turn</div>
          </div>
          <div className="text-center p-3 bg-monokai-bg/10 rounded-lg">
            <div className="text-2xl font-bold text-monokai-info">3:42</div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </div>
          <div className="text-center p-3 bg-monokai-bg/10 rounded-lg">
            <div className="text-2xl font-bold text-monokai-warning">12</div>
            <div className="text-sm text-muted-foreground">Cards Played</div>
          </div>
          <div className="text-center p-3 bg-monokai-bg/10 rounded-lg">
            <div className="text-2xl font-bold text-monokai-accent">8.5k</div>
            <div className="text-sm text-muted-foreground">Damage Dealt</div>
          </div>
        </div>
      </GlassCard>

      {/* Spectator Actions */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-monokai-warning" />
            <span className="font-medium">Enjoying the battle?</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Tip Players
            </Button>
            <Button variant="gradient" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Join Chat
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
