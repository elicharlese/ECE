"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowDown, Clock, CreditCard } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { WalletSummary } from "@/components/wallet/wallet-summary"
import { WalletNotifications } from "@/components/wallet/wallet-notifications"
import { WalletForm } from "@/components/wallet/wallet-form"

export default function WalletManagementPage() {
  const router = useRouter()
  const { balance, currency, transactions, isLoading } = useWallet()
  const [activeTab, setActiveTab] = useState("overview")

  // Group transactions by date
  const groupedTransactions = transactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as Record<string, typeof transactions>,
  )

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit"
      case "scheduled_deposit":
        return "Scheduled Deposit"
      case "withdrawal":
        return "Withdrawal"
      case "purchase":
        return "Purchase"
      case "conversion":
        return "Currency Conversion"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "scheduled_deposit":
        return <Plus className="h-4 w-4 text-green-500" />
      case "withdrawal":
      case "purchase":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      case "conversion":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
          <p className="text-muted-foreground mt-1">Manage your wallet, transactions, and scheduled deposits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WalletForm />
        </div>
        <div className="space-y-6">
          <WalletSummary />
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Your wallet notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <WalletNotifications />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
