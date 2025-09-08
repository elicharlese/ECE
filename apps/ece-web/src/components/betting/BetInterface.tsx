'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, TrendingUp, TrendingDown, DollarSign, 
  Clock, Trophy, AlertCircle, Check, BarChart3, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'

interface BetInterfaceProps {
  cardId: string
  currentPrice: number
  onBetPlaced: (prediction: { direction: 'up' | 'down', amount: number, multiplier: number }) => void
}

export function BetInterface({ cardId, currentPrice, onBetPlaced }: BetInterfaceProps) {
  const [betAmount, setBetAmount] = useState(100)
  const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | null>(null)
  const [selectedMultiplier, setSelectedMultiplier] = useState(2)
  const [isPlacingBet, setIsPlacingBet] = useState(false)

  const predictions = [
    { direction: 'up' as const, label: 'Price Up', odds: 1.8, probability: 52 },
    { direction: 'down' as const, label: 'Price Down', odds: 2.2, probability: 48 }
  ]

  const multipliers = [
    { value: 1.5, label: '1.5x', risk: 'Low' },
    { value: 2, label: '2x', risk: 'Medium' },
    { value: 3, label: '3x', risk: 'High' },
    { value: 5, label: '5x', risk: 'Extreme' }
  ]

  const recentBets = [
    { user: 'cryptowiz', direction: 'up', amount: 250, multiplier: 2, status: 'pending' },
    { user: 'traderpro', direction: 'down', amount: 150, multiplier: 3, status: 'won' },
    { user: 'betmaster', direction: 'up', amount: 500, multiplier: 1.5, status: 'lost' }
  ]

  const handleBetSubmit = async () => {
    if (!selectedDirection || betAmount <= 0) return
    
    setIsPlacingBet(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onBetPlaced({
      direction: selectedDirection,
      amount: betAmount,
      multiplier: selectedMultiplier
    })
    
    setIsPlacingBet(false)
  }

  const potentialWinning = betAmount * selectedMultiplier

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <GlassCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-monokai-accent" />
            Price Prediction Market
          </h3>
          <div className="flex items-center gap-2 text-monokai-info">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Live Market</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-2xl font-bold text-foreground">
              ${currentPrice.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">24h Change</div>
            <div className="text-2xl font-bold text-monokai-success flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {predictions.map((prediction) => (
            <motion.button
              key={prediction.direction}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDirection(prediction.direction)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDirection === prediction.direction
                  ? prediction.direction === 'up'
                    ? 'border-monokai-success bg-monokai-success/10'
                    : 'border-monokai-accent bg-monokai-accent/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {prediction.direction === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-monokai-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-monokai-accent" />
                )}
                <span className="font-semibold">{prediction.label}</span>
              </div>
              <div className="text-sm text-muted-foreground mb-1">
                {prediction.probability}% probability
              </div>
              <div className="text-lg font-bold">
                {prediction.odds}x odds
              </div>
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* Bet Configuration */}
      <GlassCard variant="light" className="p-6">
        <h4 className="text-lg font-semibold mb-4">Configure Your Bet</h4>
        
        <div className="space-y-4">
          {/* Bet Amount */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Bet Amount</label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={10}
                max={10000}
                className="text-lg font-bold"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[50, 100, 250, 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Multiplier Selection */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Risk Multiplier</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {multipliers.map((mult) => (
                <motion.button
                  key={mult.value}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMultiplier(mult.value)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    selectedMultiplier === mult.value
                      ? 'border-monokai-warning bg-monokai-warning/10'
                      : 'border-border hover:border-monokai-warning/50'
                  }`}
                >
                  <div className="font-bold">{mult.label}</div>
                  <div className="text-xs text-muted-foreground">{mult.risk}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Bet Summary */}
          {selectedDirection && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-monokai-bg/20 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Your Prediction</div>
                  <div className="font-semibold flex items-center gap-1">
                    {selectedDirection === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-monokai-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-monokai-accent" />
                    )}
                    Price goes {selectedDirection}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Potential Win</div>
                  <div className="font-bold text-monokai-success">
                    ${potentialWinning.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={!selectedDirection || betAmount <= 0 || isPlacingBet}
            onClick={handleBetSubmit}
          >
            {isPlacingBet ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Placing Bet...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Place Bet ${betAmount} → Win ${potentialWinning}
              </>
            )}
          </Button>
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard variant="light" className="p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Recent Bets
        </h4>
        
        <div className="space-y-3">
          {recentBets.map((bet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-monokai-bg/10"
            >
              <div className="flex items-center gap-3">
                {bet.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-monokai-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-monokai-accent" />
                )}
                <div>
                  <div className="font-medium">@{bet.user}</div>
                  <div className="text-sm text-muted-foreground">
                    ${bet.amount} at {bet.multiplier}x
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  bet.status === 'won' ? 'bg-monokai-success/20 text-monokai-success' :
                  bet.status === 'lost' ? 'bg-monokai-accent/20 text-monokai-accent' :
                  'bg-monokai-warning/20 text-monokai-warning'
                }`}>
                  {bet.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Risk Warning */}
      <GlassCard variant="dark" className="p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-monokai-warning mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-monokai-warning">Risk Disclaimer</div>
            <div className="text-muted-foreground mt-1">
              Price prediction betting involves significant risk. Only bet what you can afford to lose. 
              Past performance does not guarantee future results.
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
