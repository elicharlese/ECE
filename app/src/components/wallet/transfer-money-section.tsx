'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface TransferAccount {
  id: string
  name: string
  type: 'checking' | 'savings' | 'spending'
  balance?: number
}

interface TransferMoneySectionProps {
  accounts: TransferAccount[]
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number, frequency: string) => void
}

export function TransferMoneySection({ accounts, onTransfer }: TransferMoneySectionProps) {
  const [amount, setAmount] = useState('')
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '')
  const [toAccount, setToAccount] = useState(accounts[1]?.id || '')
  const [frequency, setFrequency] = useState('Just once')

  const quickAmounts = [100, 300, 1000]

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
  }

  const handleTransfer = () => {
    if (amount && fromAccount && toAccount) {
      onTransfer(fromAccount, toAccount, parseFloat(amount), frequency)
    }
  }

  const formatAccountName = (account: TransferAccount) => {
    if (account.name.length > 15) {
      return account.name.substring(0, 15) + '...'
    }
    return account.name
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-black">Transfer money</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 text-sm">Amount</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$0.00"
              className="text-gray-400 bg-transparent border-none text-right w-20 focus:outline-none"
            />
            <div className="flex space-x-1">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <div>
            <div className="text-sm text-gray-500">From</div>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="font-medium bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {formatAccountName(account)}
                </option>
              ))}
            </select>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <div>
            <div className="text-sm text-gray-500">To</div>
            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="font-medium bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {formatAccountName(account)}
                </option>
              ))}
            </select>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <div>
            <div className="text-sm text-gray-500">Frequency</div>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="font-medium bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="Just once">Just once</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 mb-3">Daily deposit limit: $200,000</div>
        <button
          onClick={handleTransfer}
          disabled={!amount || !fromAccount || !toAccount}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            amount && fromAccount && toAccount
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Review transfer
        </button>
      </div>
    </div>
  )
}
