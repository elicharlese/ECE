'use client'

interface RoundUpCardProps {
  roundUpBalance: number
  isEnabled: boolean
  onToggle: () => void
  onManage: () => void
}

export function RoundUpCard({ roundUpBalance, isEnabled, onToggle, onManage }: RoundUpCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative elements similar to Robinhood */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 bg-green-400 rounded-full"></div>
          <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/50 rounded-full"></div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="inline-flex items-center px-3 py-1 bg-black text-white rounded-full text-sm mb-3">
          Round-ups
        </div>
        <p className="text-gray-600 text-sm mb-4 max-w-sm">
          {isEnabled 
            ? `You've saved $${roundUpBalance.toFixed(2)} in round-ups this month.`
            : 'Start spending to round up with your Robinhood Cash Card.'
          }
        </p>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onManage}
            className="text-black underline text-sm font-medium"
          >
            Manage round-ups →
          </button>
          {isEnabled && (
            <div className="text-sm text-gray-500">
              ${roundUpBalance.toFixed(2)} saved
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
