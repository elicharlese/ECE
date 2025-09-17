'use client'

import { 
  PlusCircle,
  CreditCard,
  ArrowDownLeft,
  Settings
} from 'lucide-react'

interface WalletAction {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  onClick: () => void
}

interface WalletActionsProps {
  onRoundUpClick: () => void
  onCashCardOffersClick: () => void
  onDirectDepositClick: () => void
  onEditProfileClick: () => void
}

export function WalletActions({
  onRoundUpClick,
  onCashCardOffersClick,
  onDirectDepositClick,
  onEditProfileClick
}: WalletActionsProps) {
  const actions: WalletAction[] = [
    {
      id: 'round-up',
      title: 'Round-Up',
      icon: PlusCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      onClick: onRoundUpClick
    },
    {
      id: 'cash-card-offers',
      title: 'Cash Card Offers',
      icon: CreditCard,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      onClick: onCashCardOffersClick
    },
    {
      id: 'direct-deposit',
      title: 'Direct Deposit',
      icon: ArrowDownLeft,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      onClick: onDirectDepositClick
    },
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      icon: Settings,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      onClick: onEditProfileClick
    }
  ]

  return (
    <div className="mb-8">
      <div className="text-lg font-medium text-black mb-4">Actions</div>
      
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-8 h-8 ${action.iconBg} rounded-full flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${action.iconColor}`} />
              </div>
              <span className="font-medium text-black">{action.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
