'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MoreHorizontal,
  CreditCard
} from 'lucide-react'
import { useSubscription } from '../../contexts/subscription-context'
import { RoundUpCard } from '../../components/wallet/round-up-card'
import { TransferMoneySection } from '../../components/wallet/transfer-money-section'
import { TransactionHistory, Transaction } from '../../components/wallet/transaction-history'
import { WalletActions } from '../../components/wallet/wallet-actions'

interface WalletData {
  eceBalance: number
  roundUpBalance: number
  totalSaved: number
  cardNumber: string
  isLocked: boolean
  recentTransactions: Transaction[]
}

export default function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [roundUpEnabled, setRoundUpEnabled] = useState(false)
  const { subscription, isPro, isEnterprise } = useSubscription()

  const mockAccounts = [
    { id: '1', name: '360 Performance Savings', type: 'savings' as const, balance: 5234.67 },
    { id: '2', name: 'Spending', type: 'spending' as const, balance: 250.47 },
    { id: '3', name: 'Chase Checking', type: 'checking' as const, balance: 1856.23 }
  ]

  useEffect(() => {
    // Mock data for the Robinhood-style interface
    setWalletData({
      eceBalance: 250.47,
      roundUpBalance: 12.34,
      totalSaved: 1247.89,
      cardNumber: '**** **** **** 4521',
      isLocked: true,
      recentTransactions: [
        {
          id: '1',
          type: 'purchase',
          merchant: 'Apple',
          amount: -2.99,
          currency: 'ECE',
          description: 'Apple',
          timestamp: new Date('2025-09-17T13:55:00'),
          status: 'completed',
          category: 'Technology'
        },
        {
          id: '2', 
          type: 'purchase',
          merchant: 'Zip Chrome',
          amount: -8.44,
          currency: 'ECE',
          description: 'Zip Chrome',
          timestamp: new Date('2025-09-17T07:09:00'),
          status: 'completed',
          category: 'Software'
        },
        {
          id: '3',
          type: 'purchase',
          merchant: 'Amazon.com',
          amount: -14.95,
          currency: 'ECE',
          description: 'Amazon.com',
          timestamp: new Date('2025-09-16T15:30:00'),
          status: 'completed',
          category: 'Shopping'
        },
        {
          id: '4',
          type: 'round_up',
          amount: 0.01,
          currency: 'ECE',
          description: 'Round-up from Apple purchase',
          timestamp: new Date('2025-09-17T13:55:00'),
          status: 'completed'
        },
        {
          id: '5',
          type: 'deposit',
          amount: 100.00,
          currency: 'ECE',
          description: 'Direct Deposit',
          timestamp: new Date('2025-09-16T09:00:00'),
          status: 'completed'
        }
      ]
    })
    setIsLoading(false)
  }, [])

  const formatCurrency = (amount: number, currency: string = 'ECE') => {
    if (currency === 'ECE') {
      return `${Math.abs(amount).toFixed(2)}`
    }
    return `$${Math.abs(amount).toFixed(2)}`
  }

  const handleTransfer = (fromAccountId: string, toAccountId: string, amount: number, frequency: string) => {
    console.log('Transfer:', { fromAccountId, toAccountId, amount, frequency })
    // Handle transfer logic here
  }

  const handleRoundUpToggle = () => {
    setRoundUpEnabled(!roundUpEnabled)
  }

  const handleManageRoundUp = () => {
    console.log('Manage round-up clicked')
    // Handle round-up management
  }

  const handleShowMoreTransactions = () => {
    console.log('Show more transactions clicked')
    // Handle showing more transactions
  }

  const handleWalletAction = (actionId: string) => {
    console.log(`${actionId} clicked`)
    // Handle different wallet actions
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black">Spending</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 mb-6">
        <div className="text-4xl font-light text-black mb-2">
          ${formatCurrency(walletData?.eceBalance || 0)}
        </div>
        <div className="flex items-center text-gray-500 mb-4">
          <CreditCard className="w-4 h-4 mr-2" />
          <span className="text-sm">Your card is locked.</span>
        </div>
      </div>

      {/* Round-Up Section */}
      <div className="px-4 mb-8">
        <RoundUpCard
          roundUpBalance={walletData?.roundUpBalance || 0}
          isEnabled={roundUpEnabled}
          onToggle={handleRoundUpToggle}
          onManage={handleManageRoundUp}
        />
      </div>

      {/* Transfer Money Section */}
      <div className="px-4 mb-6">
        <TransferMoneySection
          accounts={mockAccounts}
          onTransfer={handleTransfer}
        />
      </div>

      {/* Recent History */}
      <div className="px-4">
        <TransactionHistory
          transactions={walletData?.recentTransactions || []}
          onShowMore={handleShowMoreTransactions}
          showRefundBadges={true}
          limit={3}
        />
      </div>

      {/* Actions Section */}
      <div className="px-4 mt-8">
        <WalletActions
          onRoundUpClick={() => handleWalletAction('round-up')}
          onCashCardOffersClick={() => handleWalletAction('cash-card-offers')}
          onDirectDepositClick={() => handleWalletAction('direct-deposit')}
          onEditProfileClick={() => handleWalletAction('edit-profile')}
        />
      </div>
    </div>
  )
}
