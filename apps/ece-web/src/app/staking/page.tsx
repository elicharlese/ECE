'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Input } from '../../components/ui/input'
import { 
  TrendingUp, 
  Lock, 
  Unlock,
  Gift,
  Clock,
  Coins,
  BarChart3,
  Zap,
  Shield,
  DollarSign,
  Calendar,
  Award,
  ChevronRight,
  Info
} from 'lucide-react'

interface StakingPool {
  id: string
  name: string
  description: string
  poolType: 'MARKETPLACE_REWARDS' | 'GOVERNANCE_PARTICIPATION' | 'LIQUIDITY_PROVISION' | 'TRADING_BONUSES'
  totalStaked: number
  totalRewards: number
  apy: number
  minStakeAmount: number
  lockupPeriod: number
  isActive: boolean
  userStaked?: number
  userRewards?: number
}

interface StakingPosition {
  id: string
  poolId: string
  amount: number
  stakedAt: Date
  lockupEndsAt?: Date
  isActive: boolean
  rewards: number
  apy: number
}

const stakingPools: StakingPool[] = [
  {
    id: 'marketplace-rewards',
    name: 'Marketplace Revenue Sharing',
    description: 'Earn a share of marketplace trading fees and profits',
    poolType: 'MARKETPLACE_REWARDS',
    totalStaked: 2500000,
    totalRewards: 125000,
    apy: 15.2,
    minStakeAmount: 1000,
    lockupPeriod: 0,
    isActive: true,
    userStaked: 5000,
    userRewards: 45.20
  },
  {
    id: 'governance-participation',
    name: 'Governance Participation Pool',
    description: 'Stake to participate in governance voting and earn rewards',
    poolType: 'GOVERNANCE_PARTICIPATION',
    totalStaked: 1800000,
    totalRewards: 90000,
    apy: 18.5,
    minStakeAmount: 500,
    lockupPeriod: 30,
    isActive: true,
    userStaked: 2500,
    userRewards: 28.75
  },
  {
    id: 'liquidity-provision',
    name: 'Liquidity Provider Rewards',
    description: 'Provide liquidity for market making and automated trading',
    poolType: 'LIQUIDITY_PROVISION',
    totalStaked: 3200000,
    totalRewards: 180000,
    apy: 22.8,
    minStakeAmount: 2000,
    lockupPeriod: 90,
    isActive: true
  },
  {
    id: 'trading-bonuses',
    name: 'Active Trader Bonuses',
    description: 'Boost your trading rewards with staking multipliers',
    poolType: 'TRADING_BONUSES',
    totalStaked: 950000,
    totalRewards: 65000,
    apy: 25.4,
    minStakeAmount: 100,
    lockupPeriod: 7,
    isActive: true,
    userStaked: 1000,
    userRewards: 12.10
  }
]

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [userECEBalance] = useState(15750.50)
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('pools')

  const totalUserStaked = stakingPools.reduce((sum, pool) => sum + (pool.userStaked || 0), 0)
  const totalUserRewards = stakingPools.reduce((sum, pool) => sum + (pool.userRewards || 0), 0)
  const averageAPY = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length

  const handleStake = async (pool: StakingPool) => {
    if (!stakeAmount || parseFloat(stakeAmount) < pool.minStakeAmount) return
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update local state (in real app, refetch from API)
      pool.userStaked = (pool.userStaked || 0) + parseFloat(stakeAmount)
      
      setStakeAmount('')
      setSelectedPool(null)
    } catch (error) {
      console.error('Staking error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnstake = async (poolId: string, amount: number) => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update local state
      const pool = stakingPools.find(p => p.id === poolId)
      if (pool && pool.userStaked) {
        pool.userStaked -= amount
      }
    } catch (error) {
      console.error('Unstaking error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPoolIcon = (poolType: string) => {
    switch (poolType) {
      case 'MARKETPLACE_REWARDS': return BarChart3
      case 'GOVERNANCE_PARTICIPATION': return Shield
      case 'LIQUIDITY_PROVISION': return Zap
      case 'TRADING_BONUSES': return Award
      default: return Coins
    }
  }

  const getPoolColor = (poolType: string) => {
    switch (poolType) {
      case 'MARKETPLACE_REWARDS': return 'from-[#A6E22E] to-[#3EBA7C]'
      case 'GOVERNANCE_PARTICIPATION': return 'from-[#F92672] to-[#FD5C63]'
      case 'LIQUIDITY_PROVISION': return 'from-[#66D9EF] to-[#819AFF]'
      case 'TRADING_BONUSES': return 'from-[#E6DB74] to-[#F39C12]'
      default: return 'from-[#75715E] to-[#75715E]'
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(num)
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return formatNumber(num)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#272822] to-[#1a1a15] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A6E22E] to-[#66D9EF] bg-clip-text text-transparent mb-4">
            ECE Staking
          </h1>
          <p className="text-lg text-[#75715E] mb-6">
            Stake your ECE tokens to earn rewards and participate in governance
          </p>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Available ECE</p>
                  <p className="text-2xl font-bold text-[#F8EFD6]">{formatNumber(userECEBalance)}</p>
                </div>
                <Coins className="h-8 w-8 text-[#E6DB74]" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Total Staked</p>
                  <p className="text-2xl font-bold text-[#A6E22E]">{formatNumber(totalUserStaked)}</p>
                </div>
                <Lock className="h-8 w-8 text-[#A6E22E]" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Pending Rewards</p>
                  <p className="text-2xl font-bold text-[#66D9EF]">{formatNumber(totalUserRewards)}</p>
                </div>
                <Gift className="h-8 w-8 text-[#66D9EF]" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#75715E]">Average APY</p>
                  <p className="text-2xl font-bold text-[#F92672]">{averageAPY.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#F92672]" />
              </div>
            </Card>
          </div>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#272822]/50 border border-[#75715E]/30 mb-8">
            <TabsTrigger 
              value="pools"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#A6E22E] data-[state=active]:to-[#3EBA7C] data-[state=active]:text-[#272822]"
            >
              <Lock className="h-4 w-4 mr-2" />
              Staking Pools
            </TabsTrigger>
            <TabsTrigger 
              value="positions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#66D9EF] data-[state=active]:to-[#819AFF] data-[state=active]:text-[#272822]"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              My Positions
            </TabsTrigger>
            <TabsTrigger 
              value="rewards"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F92672] data-[state=active]:to-[#FD5C63] data-[state=active]:text-[#F8EFD6]"
            >
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="pools" className="mt-0">
              <motion.div
                key="pools"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {stakingPools.map((pool) => {
                  const PoolIcon = getPoolIcon(pool.poolType)
                  
                  return (
                    <Card key={pool.id} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 hover:border-[#66D9EF]/50 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 bg-gradient-to-r ${getPoolColor(pool.poolType)} rounded-lg`}>
                            <PoolIcon className="h-6 w-6 text-[#272822]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#F8EFD6]">{pool.name}</h3>
                            <p className="text-sm text-[#75715E]">{pool.description}</p>
                          </div>
                        </div>
                        <Badge className="text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30">
                          {pool.apy.toFixed(1)}% APY
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-[#75715E]">Total Staked</p>
                          <p className="text-lg font-semibold text-[#F8EFD6]">{formatLargeNumber(pool.totalStaked)} ECE</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#75715E]">Min Stake</p>
                          <p className="text-lg font-semibold text-[#F8EFD6]">{formatNumber(pool.minStakeAmount)} ECE</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#75715E]">Lockup Period</p>
                          <p className="text-lg font-semibold text-[#F8EFD6]">
                            {pool.lockupPeriod === 0 ? 'No lockup' : `${pool.lockupPeriod} days`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#75715E]">Your Stake</p>
                          <p className="text-lg font-semibold text-[#A6E22E]">
                            {pool.userStaked ? `${formatNumber(pool.userStaked)} ECE` : 'None'}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedPool(pool)}
                        className={`w-full bg-gradient-to-r ${getPoolColor(pool.poolType)} hover:opacity-80 text-[#272822] font-semibold`}
                      >
                        {pool.userStaked ? 'Manage Stake' : 'Stake Now'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Card>
                  )
                })}
              </motion.div>
            </TabsContent>

            <TabsContent value="positions" className="mt-0">
              <motion.div
                key="positions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {stakingPools.filter(pool => pool.userStaked).map((pool) => {
                  const PoolIcon = getPoolIcon(pool.poolType)
                  
                  return (
                    <Card key={pool.id} className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-gradient-to-r ${getPoolColor(pool.poolType)} rounded-lg`}>
                            <PoolIcon className="h-6 w-6 text-[#272822]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#F8EFD6]">{pool.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-[#75715E]">
                                Staked: {formatNumber(pool.userStaked!)} ECE
                              </span>
                              <span className="text-sm text-[#A6E22E]">
                                Rewards: {formatNumber(pool.userRewards!)} ECE
                              </span>
                              <Badge className="text-[#66D9EF] bg-[#66D9EF]/20 border-[#66D9EF]/30">
                                {pool.apy.toFixed(1)}% APY
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/10"
                          >
                            <Gift className="h-4 w-4 mr-2" />
                            Claim
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnstake(pool.id, pool.userStaked!)}
                            disabled={loading}
                            className="border-[#F92672]/30 text-[#F92672] hover:bg-[#F92672]/10"
                          >
                            <Unlock className="h-4 w-4 mr-2" />
                            Unstake
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
                
                {stakingPools.filter(pool => pool.userStaked).length === 0 && (
                  <Card className="p-12 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30 text-center">
                    <Lock className="h-12 w-12 text-[#75715E] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#F8EFD6] mb-2">No Active Positions</h3>
                    <p className="text-[#75715E] mb-4">You haven't staked any ECE tokens yet</p>
                    <Button
                      onClick={() => setSelectedTab('pools')}
                      className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
                    >
                      Browse Staking Pools
                    </Button>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="rewards" className="mt-0">
              <motion.div
                key="rewards"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 backdrop-blur-xl border border-[#75715E]/30">
                  <h3 className="text-lg font-semibold text-[#F8EFD6] mb-6 flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-[#66D9EF]" />
                    Reward History & Claims
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { type: 'Trading Fees', amount: 45.20, date: '2 hours ago', status: 'Available' },
                      { type: 'Governance Participation', amount: 28.75, date: '6 hours ago', status: 'Available' },
                      { type: 'Liquidity Rewards', amount: 15.30, date: '1 day ago', status: 'Claimed' },
                      { type: 'Marketplace Profits', amount: 62.80, date: '2 days ago', status: 'Claimed' }
                    ].map((reward, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#272822]/50 rounded-lg border border-[#75715E]/20">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#66D9EF]/20 rounded-lg">
                            <Gift className="h-4 w-4 text-[#66D9EF]" />
                          </div>
                          <div>
                            <p className="text-[#F8EFD6] font-medium">{reward.type}</p>
                            <p className="text-sm text-[#75715E]">{reward.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-[#A6E22E] font-semibold">+{formatNumber(reward.amount)} ECE</p>
                            <Badge className={
                              reward.status === 'Available' 
                                ? 'text-[#A6E22E] bg-[#A6E22E]/20 border-[#A6E22E]/30'
                                : 'text-[#75715E] bg-[#75715E]/20 border-[#75715E]/30'
                            }>
                              {reward.status}
                            </Badge>
                          </div>
                          
                          {reward.status === 'Available' && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#A6E22E] to-[#3EBA7C] hover:from-[#A6E22E]/80 hover:to-[#3EBA7C]/80 text-[#272822] font-semibold"
                            >
                              Claim
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Staking Modal */}
        <AnimatePresence>
          {selectedPool && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              onClick={() => setSelectedPool(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#272822] to-[#1a1a15] border border-[#75715E]/30 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 bg-gradient-to-r ${getPoolColor(selectedPool.poolType)} rounded-lg`}>
                    {React.createElement(getPoolIcon(selectedPool.poolType), { className: "h-6 w-6 text-[#272822]" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F8EFD6]">{selectedPool.name}</h3>
                    <p className="text-sm text-[#75715E]">{selectedPool.apy.toFixed(1)}% APY</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F8EFD6] mb-2">
                      Stake Amount
                    </label>
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`Min: ${selectedPool.minStakeAmount} ECE`}
                      className="bg-[#272822]/50 border-[#75715E]/30 text-[#F8EFD6]"
                    />
                    <div className="flex justify-between text-xs text-[#75715E] mt-1">
                      <span>Available: {formatNumber(userECEBalance)} ECE</span>
                      <button 
                        onClick={() => setStakeAmount(userECEBalance.toString())}
                        className="text-[#66D9EF] hover:underline"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  {selectedPool.lockupPeriod > 0 && (
                    <div className="p-3 bg-[#E6DB74]/20 border border-[#E6DB74]/30 rounded-lg flex items-start gap-2">
                      <Info className="h-4 w-4 text-[#E6DB74] mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-[#E6DB74] font-medium">Lockup Period</p>
                        <p className="text-[#F8EFD6]">
                          Your tokens will be locked for {selectedPool.lockupPeriod} days after staking.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPool(null)}
                      className="flex-1 border-[#75715E]/30 text-[#75715E] hover:bg-[#75715E]/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleStake(selectedPool)}
                      disabled={loading || !stakeAmount || parseFloat(stakeAmount) < selectedPool.minStakeAmount}
                      className={`flex-1 bg-gradient-to-r ${getPoolColor(selectedPool.poolType)} hover:opacity-80 text-[#272822] font-semibold`}
                    >
                      {loading ? 'Staking...' : 'Stake ECE'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
