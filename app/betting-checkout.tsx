"use client"

import { useState } from "react"
import { X, TrendingUp, TrendingDown, DollarSign, Calculator, CreditCard, Shield, CheckCircle } from "lucide-react"

interface App {
  id: number
  name: string
  description: string
  category: string
  fundingGoal: number
  currentFunding: number
  daysLeft: number
  backers: number
  image: string
  tags: string[]
  odds: {
    for: string
    against: string
  }
  confidence: number
  riskLevel: "Low" | "Medium" | "High"
  founderExperience: string
  marketSize: string
  competition: string
  traction: string
}

interface BettingCheckoutProps {
  app: App
  betType: "for" | "against"
  onClose: () => void
}

export default function BettingCheckout({ app, betType, onClose }: BettingCheckoutProps) {
  const [betAmount, setBetAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [step, setStep] = useState<"amount" | "payment" | "confirmation">("amount")
  const [isProcessing, setIsProcessing] = useState(false)

  const odds = betType === "for" ? app.odds.for : app.odds.against
  const multiplier = Number.parseFloat(odds.replace("x", ""))
  const potentialPayout = betAmount ? (Number.parseFloat(betAmount) * multiplier).toFixed(2) : "0.00"
  const profit = betAmount ? (Number.parseFloat(potentialPayout) - Number.parseFloat(betAmount)).toFixed(2) : "0.00"

  const handleAmountSubmit = () => {
    if (betAmount && Number.parseFloat(betAmount) >= 1) {
      setStep("payment")
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setStep("confirmation")
  }

  const quickAmounts = [10, 25, 50, 100, 250, 500]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {step === "amount" && "Place Your Bet"}
            {step === "payment" && "Payment Details"}
            {step === "confirmation" && "Bet Confirmed!"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === "amount" && (
          <div className="p-6 space-y-6">
            {/* App Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={app.image || "/placeholder.svg"}
                  alt={app.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{app.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {betType === "for" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`font-medium ${betType === "for" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  Betting {betType.toUpperCase()} reaching ${app.fundingGoal.toLocaleString()} goal
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current: ${app.currentFunding.toLocaleString()} • {app.daysLeft} days left
              </div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bet Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount.toString())}
                    className="py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Calculation */}
            {betAmount && Number.parseFloat(betAmount) > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Payout Calculation</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bet Amount:</span>
                    <span className="font-medium">${betAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Odds:</span>
                    <span className="font-medium">{odds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Potential Payout:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">${potentialPayout}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2">
                    <span className="text-gray-600 dark:text-gray-400">Profit if Won:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">+${profit}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Risk Warning</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Betting involves risk. Only bet what you can afford to lose. Past performance doesn't guarantee
                    future results.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleAmountSubmit}
              disabled={!betAmount || Number.parseFloat(betAmount) < 1}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="p-6 space-y-6">
            {/* Bet Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Bet Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">App:</span>
                  <span>{app.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bet Type:</span>
                  <span
                    className={
                      betType === "for" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }
                  >
                    {betType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium">${betAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Potential Payout:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">${potentialPayout}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Credit/Debit Card</span>
                </label>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? "Processing..." : `Place Bet - $${betAmount}`}
              </button>
            </div>
          </div>
        )}

        {step === "confirmation" && (
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bet Placed Successfully!</h3>
              <p className="text-gray-600 dark:text-gray-400">Your bet has been confirmed and is now active.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bet Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bet ID:</span>
                  <span className="font-mono">#BET{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">App:</span>
                  <span>{app.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span
                    className={
                      betType === "for" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }
                  >
                    {betType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium">${betAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Potential Payout:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">${potentialPayout}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              You can track your bet progress in your profile under "My Bets"
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
