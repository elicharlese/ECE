'use client'

import { ArrowDownLeft, ArrowUpRight, PlusCircle, CreditCard } from 'lucide-react'

export interface Transaction {
  id: string
  type: 'purchase' | 'deposit' | 'round_up' | 'reward'
  merchant?: string
  amount: number
  currency: 'ECE' | 'USD'
  description: string
  timestamp: Date
  status: 'completed' | 'pending'
  category?: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  onShowMore?: () => void
  showRefundBadges?: boolean
  limit?: number
}

export function TransactionHistory({ 
  transactions, 
  onShowMore, 
  showRefundBadges = false,
  limit 
}: TransactionHistoryProps) {
  const formatCurrency = (amount: number, currency: string = 'ECE') => {
    if (currency === 'ECE') {
      return `${Math.abs(amount).toFixed(2)}`
    }
    return `$${Math.abs(amount).toFixed(2)}`
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: diffDays > 365 ? 'numeric' : undefined
      })
    }
    if (diffHours > 0) {
      return `${diffHours}h ago`
    }
    return 'Just now'
  }

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'purchase':
        return <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium">{transaction.merchant?.[0] ?? 'P'}</span>
        </div>
      case 'deposit':
        return <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <ArrowDownLeft className="w-4 h-4 text-green-600" />
        </div>
      case 'round_up':
        return <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <PlusCircle className="w-4 h-4 text-blue-600" />
        </div>
      default:
        return <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-gray-600" />
        </div>
    }
  }

  const displayTransactions = limit ? transactions.slice(0, limit) : transactions

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-black">Recent History</h2>
        {onShowMore && (
          <button 
            onClick={onShowMore}
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
          >
            Show more
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTransactionIcon(transaction)}
              <div>
                <div className="font-medium text-black">{transaction.description}</div>
                <div className="text-sm text-gray-500">
                  {formatTime(transaction.timestamp)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${
                transaction.amount < 0 ? 'text-black' : 'text-green-600'
              }`}>
                {transaction.amount < 0 ? '-' : '+'}${formatCurrency(transaction.amount)}
              </div>
              {showRefundBadges && transaction.type === 'purchase' && (
                <div className="text-xs text-white bg-red-500 px-2 py-1 rounded inline-block mt-1">
                  REFUND
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayTransactions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No transactions yet</p>
        </div>
      )}
    </div>
  )
}
