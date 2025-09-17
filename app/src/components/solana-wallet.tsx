'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  Coins, 
  Gift, 
  Zap, 
  TrendingUp, 
  Star,
  Users,
  ArrowUpRight,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

interface SolanaWalletProps {
  userId: string
  onConnect?: (address: string) => void
  onDisconnect?: () => void
}

interface WalletState {
  connected: boolean
  address: string | null
  balance: {
    sol: number
    ece: number
  }
  rewards: {
    pending: number
    lifetime: number
    nextMilestone: number
  }
  transactions: Transaction[]
}

interface Transaction {
  id: string
  type: 'REWARD' | 'BOOST' | 'REFERRAL' | 'ORDER_COMPLETE' | 'PURCHASE'
  amount: number
  description: string
  timestamp: Date
  signature?: string
}

const SolanaWallet: React.FC<SolanaWalletProps> = ({
  userId,
  onConnect,
  onDisconnect
}) => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    balance: { sol: 0, ece: 0 },
    rewards: { pending: 0, lifetime: 0, nextMilestone: 1000 },
    transactions: []
  })
  
  const [loading, setLoading] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)

  // Mock wallet connection - in real app, integrate with @solana/wallet-adapter
  const connectWallet = async () => {
    setLoading(true)
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock wallet data
    const mockAddress = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    const mockWalletState: WalletState = {
      connected: true,
      address: mockAddress,
      balance: {
        sol: 2.45,
        ece: 1250.75
      },
      rewards: {
        pending: 125,
        lifetime: 3580,
        nextMilestone: 5000
      },
      transactions: [
        {
          id: 'tx_1',
          type: 'ORDER_COMPLETE',
          amount: 500,
          description: 'Order completion bonus',
          timestamp: new Date(Date.now() - 86400000),
          signature: '5VfYt...xT2p'
        },
        {
          id: 'tx_2',
          type: 'REFERRAL',
          amount: 250,
          description: 'Referral reward from @techdev',
          timestamp: new Date(Date.now() - 172800000),
          signature: '3Hj9s...mN4k'
        },
        {
          id: 'tx_3',
          type: 'BOOST',
          amount: -100,
          description: 'Portfolio boost purchase',
          timestamp: new Date(Date.now() - 259200000),
          signature: '8Pk2v...rX7q'
        }
      ]
    }
    
    setWalletState(mockWalletState)
    setLoading(false)
    
    if (onConnect) {
      onConnect(mockAddress)
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      connected: false,
      address: null,
      balance: { sol: 0, ece: 0 },
      rewards: { pending: 0, lifetime: 0, nextMilestone: 1000 },
      transactions: []
    })
    
    if (onDisconnect) {
      onDisconnect()
    }
  }

  const claimRewards = async () => {
    if (walletState.rewards.pending === 0) return
    
    setLoading(true)
    
    // Simulate claiming process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setWalletState(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        ece: prev.balance.ece + prev.rewards.pending
      },
      rewards: {
        ...prev.rewards,
        pending: 0,
        lifetime: prev.rewards.lifetime + prev.rewards.pending
      }
    }))
    
    setLoading(false)
  }

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address)
      // In real app, show toast notification
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'REWARD': return <Gift className="w-4 h-4 text-monokai-success" />
      case 'BOOST': return <Zap className="w-4 h-4 text-monokai-warning" />
      case 'REFERRAL': return <Users className="w-4 h-4 text-monokai-info" />
      case 'ORDER_COMPLETE': return <Star className="w-4 h-4 text-monokai-success" />
      case 'PURCHASE': return <ArrowUpRight className="w-4 h-4 text-monokai-accent" />
      default: return <Coins className="w-4 h-4 text-ocean-accent" />
    }
  }

  const milestoneProgress = (walletState.rewards.lifetime / walletState.rewards.nextMilestone) * 100

  if (!walletState.connected) {
    return (
      <Card className="p-8 glass-card text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-tide rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-ocean-dark dark:text-ocean-light mb-2">
              Connect Solana Wallet
            </h3>
            <p className="text-ocean-muted">
              Connect your Solana wallet to earn ECE tokens, claim rewards, and access premium features.
            </p>
          </div>
          
          <Button
            onClick={connectWallet}
            disabled={loading}
            className="bg-gradient-sunset text-white hover:opacity-90 px-8 py-3"
            size="lg"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
              </motion.div>
            ) : (
              <Wallet className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
          
          <div className="text-xs text-ocean-muted">
            Supports Phantom, Solflare, and other Solana wallets
          </div>
        </motion.div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <Card className="p-6 glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-tide rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-ocean-dark dark:text-ocean-light">
                Solana Wallet
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-ocean-muted">
                  {formatAddress(walletState.address!)}
                </span>
                <button onClick={copyAddress} className="text-ocean-muted hover:text-ocean-accent">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
        
        {/* Balances */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-white/20 dark:bg-ocean-dark/20 rounded-lg">
            <div className="text-2xl font-bold text-ocean-dark dark:text-ocean-light">
              {walletState.balance.sol.toFixed(2)}
            </div>
            <div className="text-sm text-ocean-muted">SOL</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 dark:bg-ocean-dark/20 rounded-lg">
            <div className="text-2xl font-bold text-monokai-success">
              {walletState.balance.ece.toLocaleString()}
            </div>
            <div className="text-sm text-ocean-muted">ECE</div>
          </div>
        </div>
        
        {/* Rewards Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-ocean-dark dark:text-ocean-light">
              Rewards
            </h4>
            {walletState.rewards.pending > 0 && (
              <Button
                onClick={claimRewards}
                disabled={loading}
               
                className="bg-monokai-success text-white hover:bg-monokai-success/80"
              >
                <Gift className="w-4 h-4 mr-1" />
                Claim {walletState.rewards.pending} ECE
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-monokai-warning">
                {walletState.rewards.pending}
              </div>
              <div className="text-xs text-ocean-muted">Pending</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-monokai-success">
                {walletState.rewards.lifetime.toLocaleString()}
              </div>
              <div className="text-xs text-ocean-muted">Lifetime</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-ocean-accent">
                {walletState.rewards.nextMilestone.toLocaleString()}
              </div>
              <div className="text-xs text-ocean-muted">Next Goal</div>
            </div>
          </div>
          
          {/* Milestone Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ocean-muted">Milestone Progress</span>
              <span className="text-ocean-accent">{milestoneProgress.toFixed(1)}%</span>
            </div>
            <Progress value={milestoneProgress} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 glass-card">
        <h4 className="font-medium text-ocean-dark dark:text-ocean-light mb-4">
          Quick Actions
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto p-4 flex-col">
            <Zap className="w-6 h-6 text-monokai-warning mb-2" />
            <span className="text-sm">Boost Portfolio</span>
            <span className="text-xs text-ocean-muted">100 ECE</span>
          </Button>
          
          <Button variant="outline" className="h-auto p-4 flex-col">
            <Users className="w-6 h-6 text-monokai-info mb-2" />
            <span className="text-sm">Refer Friend</span>
            <span className="text-xs text-ocean-muted">Earn 250 ECE</span>
          </Button>
        </div>
      </Card>

      {/* Transactions */}
      <Card className="p-6 glass-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-ocean-dark dark:text-ocean-light">
            Recent Transactions
          </h4>
          <Button
            variant="ghost"
           
            onClick={() => setShowTransactions(!showTransactions)}
          >
            {showTransactions ? 'Hide' : 'Show All'}
          </Button>
        </div>
        
        <div className="space-y-3">
          {walletState.transactions
            .slice(0, showTransactions ? undefined : 3)
            .map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white/20 dark:bg-ocean-dark/20 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <div className="text-sm font-medium text-ocean-dark dark:text-ocean-light">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-ocean-muted">
                    {transaction.timestamp.toLocaleDateString()}
                    {transaction.signature && (
                      <span className="ml-2">
                        • {transaction.signature}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`text-sm font-semibold ${
                transaction.amount > 0 ? 'text-monokai-success' : 'text-monokai-accent'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount} ECE
              </div>
            </motion.div>
          ))}
        </div>
        
        {walletState.transactions.length === 0 && (
          <div className="text-center py-8 text-ocean-muted">
            No transactions yet. Complete orders and refer friends to earn ECE!
          </div>
        )}
      </Card>
    </div>
  )
}

export default SolanaWallet
