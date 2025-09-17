'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Wallet, 
  X, 
  Plus, 
  Minus, 
  CreditCard, 
  Smartphone,
  Download,
  Shield,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  ExternalLink
} from 'lucide-react'
import { GlassCard } from './ui/glass-card'
import { Button } from './ui/button'
import { useSubscription } from '@/contexts/subscription-context'

interface WalletPopoutProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  onBalanceUpdate?: (newBalance: number) => void
}

interface WalletData {
  eceBalance: number
  cryptoBalance: {
    btc: number
    eth: number
    usdc: number
  }
  physicalCard: {
    hasCard: boolean
    cardNumber?: string
    expiryDate?: string
    status?: 'active' | 'pending' | 'blocked'
  }
  recentTransactions: Array<{
    id: string
    type: 'load' | 'withdraw' | 'purchase' | 'reward'
    amount: number
    currency: 'ECE' | 'USD' | 'BTC' | 'ETH'
    description: string
    timestamp: Date
    status: 'completed' | 'pending' | 'failed'
  }>
}

export function WalletPopout({ isOpen, onClose, userId = 'user_pro_001', onBalanceUpdate }: WalletPopoutProps) {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'load' | 'withdraw' | 'card'>('overview')
  const [loadAmount, setLoadAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { subscription, isPro, isEnterprise } = useSubscription()
  const router = useRouter()

  useEffect(() => {
    if (isOpen && userId) {
      fetchWalletData()
    }
  }, [isOpen, userId])

  const fetchWalletData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/wallet?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setWalletData(data.wallet)
      } else {
        // Mock data for demo
        setWalletData({
          eceBalance: 1250.50,
          cryptoBalance: {
            btc: 0.00234,
            eth: 0.156,
            usdc: 500.00
          },
          physicalCard: {
            hasCard: isPro || isEnterprise,
            cardNumber: isPro || isEnterprise ? '**** **** **** 4521' : undefined,
            expiryDate: '12/27',
            status: 'active'
          },
          recentTransactions: [
            {
              id: '1',
              type: 'purchase',
              amount: -150.00,
              currency: 'ECE',
              description: 'Tesla Model S Card Purchase',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              status: 'completed'
            },
            {
              id: '2',
              type: 'load',
              amount: 500.00,
              currency: 'ECE',
              description: 'Apple Pay Load',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              status: 'completed'
            },
            {
              id: '3',
              type: 'reward',
              amount: 25.00,
              currency: 'ECE',
              description: 'Trading Milestone Bonus',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              status: 'completed'
            }
          ]
        })
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadECE = async (amount: number, method: 'apple_pay' | 'google_pay' | 'paypal') => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'load',
          userId,
          amount,
          method
        })
      })

      if (response.ok) {
        setLoadAmount('')
        fetchWalletData()
        if (walletData) {
          const newBalance = walletData.eceBalance + amount
          onBalanceUpdate?.(newBalance)
        }
        alert(`Successfully loaded ${amount} ECE via ${method}`)
      }
    } catch (error) {
      console.error('Failed to load ECE:', error)
    }
  }

  const handleWithdrawECE = async (amount: number, method: 'bank' | 'paypal' | 'crypto') => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'withdraw',
          userId,
          amount,
          method
        })
      })

      if (response.ok) {
        setWithdrawAmount('')
        fetchWalletData()
        if (walletData) {
          const newBalance = walletData.eceBalance - amount
          onBalanceUpdate?.(newBalance)
        }
        alert(`Withdrawal of ${amount} ECE initiated`)
      }
    } catch (error) {
      console.error('Failed to withdraw ECE:', error)
    }
  }

  const requestPhysicalCard = async () => {
    if (!isPro && !isEnterprise) {
      alert('Physical cards are available for Pro and Enterprise users only')
      return
    }

    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'request_card',
          userId
        })
      })

      if (response.ok) {
        fetchWalletData()
        alert('Physical card request submitted! You will receive it in 5-7 business days.')
      }
    } catch (error) {
      console.error('Failed to request physical card:', error)
    }
  }

  const addToAppleWallet = () => {
    // This would integrate with Apple Wallet API
    alert('Adding ECE Card to Apple Wallet...')
  }

  const copyCardNumber = () => {
    if (walletData?.physicalCard.cardNumber) {
      navigator.clipboard.writeText(walletData.physicalCard.cardNumber.replace(/\*/g, ''))
      alert('Card number copied to clipboard')
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'ECE') {
      return `${amount.toFixed(2)} ECE`
    }
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`
    }
    if (currency === 'BTC') {
      return `₿${amount.toFixed(8)}`
    }
    if (currency === 'ETH') {
      return `Ξ${amount.toFixed(6)}`
    }
    return `${amount} ${currency}`
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'load', label: 'Load', icon: Plus },
    { id: 'withdraw', label: 'Withdraw', icon: Minus },
    { id: 'card', label: 'Physical Card', icon: CreditCard }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Popout */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] md:w-96"
          >
            <GlassCard className="max-h-[80vh] overflow-hidden bg-card border border-border backdrop-blur-none">
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-foreground" />
                    <h3 className="font-semibold text-foreground">ECE Wallet</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setShowBalances(!showBalances)}
                    >
                      {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={onClose}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    router.push('/wallet')
                    onClose()
                  }}
                  className="w-full bg-gradient-ocean text-white hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Wallet
                </Button>
              </div>

              {/* Tabs */}
              <div className="p-4 border-b border-border/50">
                <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center space-x-1 py-2 px-2 rounded-md transition-all duration-200 text-xs ${
                          activeTab === tab.id
                            ? 'bg-gradient-ocean text-white shadow-lg'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span className="font-medium hidden sm:inline">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-ocean-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading wallet...</p>
                  </div>
                ) : walletData ? (
                  <div className="p-4">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        {/* Balance Cards */}
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-monokai-blue/20 to-monokai-purple/20 rounded-lg p-4 border border-monokai-blue/30">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">ECE Balance</p>
                                <p className="text-2xl font-bold text-foreground">
                                  {showBalances ? formatCurrency(walletData.eceBalance, 'ECE') : '••••••'}
                                </p>
                              </div>
                              <div className="w-10 h-10 bg-monokai-blue/30 rounded-full flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-monokai-blue" />
                              </div>
                            </div>
                          </div>

                          {(isPro || isEnterprise) && (
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-xs text-muted-foreground">Bitcoin</p>
                                <p className="text-sm font-semibold text-foreground">
                                  {showBalances ? formatCurrency(walletData.cryptoBalance.btc, 'BTC') : '••••'}
                                </p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-xs text-muted-foreground">Ethereum</p>
                                <p className="text-sm font-semibold text-foreground">
                                  {showBalances ? formatCurrency(walletData.cryptoBalance.eth, 'ETH') : '••••'}
                                </p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-xs text-muted-foreground">USDC</p>
                                <p className="text-sm font-semibold text-foreground">
                                  {showBalances ? formatCurrency(walletData.cryptoBalance.usdc, 'USD') : '••••'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Recent Transactions */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Recent Transactions</h4>
                          <div className="space-y-2">
                            {walletData.recentTransactions.slice(0, 4).map((transaction) => (
                              <div key={transaction.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    transaction.type === 'load' ? 'bg-monokai-green/20' :
                                    transaction.type === 'withdraw' ? 'bg-monokai-orange/20' :
                                    transaction.type === 'purchase' ? 'bg-monokai-blue/20' :
                                    'bg-monokai-purple/20'
                                  }`}>
                                    {transaction.type === 'load' ? <ArrowDownLeft className="w-4 h-4 text-monokai-green" /> :
                                     transaction.type === 'withdraw' ? <ArrowUpRight className="w-4 h-4 text-monokai-orange" /> :
                                     transaction.type === 'purchase' ? <Minus className="w-4 h-4 text-monokai-blue" /> :
                                     <Plus className="w-4 h-4 text-monokai-purple" />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                                    <p className="text-xs text-muted-foreground">{formatTimeAgo(transaction.timestamp)}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-semibold ${
                                    transaction.amount > 0 ? 'text-monokai-green' : 'text-monokai-orange'
                                  }`}>
                                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Load Tab */}
                    {activeTab === 'load' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Amount to Load</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={loadAmount}
                              onChange={(e) => setLoadAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-white/10 border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-accent"
                            />
                            <span className="absolute right-3 top-3 text-sm text-muted-foreground">ECE</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Payment Methods</p>
                          
                          <Button
                            onClick={() => handleLoadECE(parseFloat(loadAmount) || 0, 'apple_pay')}
                            disabled={!loadAmount || parseFloat(loadAmount) <= 0}
                            className="w-full justify-start bg-black text-white hover:bg-black/80"
                          >
                            <Smartphone className="w-4 h-4 mr-2" />
                            Apple Pay
                          </Button>
                          
                          <Button
                            onClick={() => handleLoadECE(parseFloat(loadAmount) || 0, 'google_pay')}
                            disabled={!loadAmount || parseFloat(loadAmount) <= 0}
                            variant="secondary"
                            className="w-full justify-start"
                          >
                            <Smartphone className="w-4 h-4 mr-2" />
                            Google Pay
                          </Button>
                          
                          <Button
                            onClick={() => handleLoadECE(parseFloat(loadAmount) || 0, 'paypal')}
                            disabled={!loadAmount || parseFloat(loadAmount) <= 0}
                            variant="secondary"
                            className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            PayPal
                          </Button>
                        </div>

                        <div className="bg-monokai-blue/10 border border-monokai-blue/30 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <Shield className="w-4 h-4 text-monokai-blue mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-monokai-blue">Secure Transaction</p>
                              <p className="text-xs text-muted-foreground">Your payment information is encrypted and secure</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Withdraw Tab */}
                    {activeTab === 'withdraw' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Amount to Withdraw</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="0.00"
                              max={walletData.eceBalance}
                              className="w-full bg-white/10 border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-accent"
                            />
                            <span className="absolute right-3 top-3 text-sm text-muted-foreground">ECE</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Available: {formatCurrency(walletData.eceBalance, 'ECE')}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Withdrawal Methods</p>
                          
                          <Button
                            onClick={() => handleWithdrawECE(parseFloat(withdrawAmount) || 0, 'bank')}
                            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletData.eceBalance}
                            variant="secondary"
                            className="w-full justify-start"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Bank Transfer (1-3 days)
                          </Button>
                          
                          <Button
                            onClick={() => handleWithdrawECE(parseFloat(withdrawAmount) || 0, 'paypal')}
                            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletData.eceBalance}
                            variant="secondary"
                            className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            PayPal (Instant)
                          </Button>
                          
                          {(isPro || isEnterprise) && (
                            <Button
                              onClick={() => handleWithdrawECE(parseFloat(withdrawAmount) || 0, 'crypto')}
                              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletData.eceBalance}
                              variant="secondary"
                              className="w-full justify-start"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Crypto Wallet (Pro/Enterprise)
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Physical Card Tab */}
                    {activeTab === 'card' && (
                      <div className="space-y-4">
                        {walletData.physicalCard.hasCard ? (
                          <div className="space-y-4">
                            {/* Card Display */}
                            <div className="bg-gradient-to-br from-monokai-blue via-monokai-purple to-monokai-pink rounded-xl p-6 text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                  <div>
                                    <p className="text-sm opacity-80">ECE CARD</p>
                                    <p className="text-xs opacity-60">{subscription?.plan?.toUpperCase()}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                    <div className="w-8 h-8 bg-white/30 rounded-full -ml-4"></div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <p className="text-lg font-mono tracking-wider">{walletData.physicalCard.cardNumber}</p>
                                    <Button
                                      variant="ghost"
                                     
                                      onClick={copyCardNumber}
                                      className="p-1 text-white/60 hover:text-white"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs opacity-60">VALID THRU</p>
                                      <p className="text-sm font-mono">{walletData.physicalCard.expiryDate}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs opacity-60">STATUS</p>
                                      <p className="text-sm font-semibold capitalize">{walletData.physicalCard.status}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Actions */}
                            <div className="space-y-2">
                              <Button
                                onClick={addToAppleWallet}
                                className="w-full bg-black text-white hover:bg-black/80"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Add to Apple Wallet
                              </Button>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <Button variant="secondary">
                                  <Shield className="w-4 h-4 mr-2" />
                                  Lock Card
                                </Button>
                                <Button variant="secondary">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Settings
                                </Button>
                              </div>
                            </div>

                            {/* Crypto Storage Info */}
                            <div className="bg-monokai-purple/10 border border-monokai-purple/30 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-monokai-purple mt-0.5" />
                                <div>
                                  <h4 className="text-sm font-medium text-foreground">Hardware Wallet</h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Your ECE Card includes secure crypto storage with cold wallet capabilities.
                                    Store Bitcoin, Ethereum, and other cryptocurrencies directly on your card.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-monokai-blue to-monokai-purple rounded-xl flex items-center justify-center mx-auto">
                              <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-semibold text-foreground">Get Your ECE Card</h4>
                              <p className="text-sm text-muted-foreground">
                                Physical card with crypto storage and Apple Wallet support
                              </p>
                            </div>

                            {isPro || isEnterprise ? (
                              <div className="space-y-3">
                                <Button onClick={requestPhysicalCard} className="w-full">
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Request Physical Card
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  Free for {subscription?.plan} members • 5-7 business days delivery
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                  Physical cards are available for Pro and Enterprise users
                                </p>
                                <Button variant="secondary" onClick={() => alert('Upgrade to Pro or Enterprise')}>
                                  Upgrade to Get Card
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">Failed to load wallet data</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
