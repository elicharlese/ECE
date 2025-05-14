"use client"

import { useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, Minus, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function WalletSummary() {
  const { balance, currency, transactions } = useWallet()
  const [expanded, setExpanded] = useState(false)

  // Get the last 3 transactions
  const recentTransactions = transactions.slice(0, 3)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "scheduled_deposit":
        return <Plus className="h-3 w-3 text-green-500" />
      case "withdrawal":
      case "purchase":
        return <Minus className="h-3 w-3 text-red-500" />
      case "conversion":
        return <RefreshCw className="h-3 w-3 text-blue-500" />
      default:
        return <RefreshCw className="h-3 w-3" />
    }
  }

  return (
    <Card className="md:hidden mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-semibold">Wallet Balance</span>
          </div>
          <div className="text-xl font-bold">
            {balance.toLocaleString()} {currency}
          </div>
        </div>

        <div className={`transition-all duration-300 ${expanded ? "max-h-[300px]" : "max-h-0"} overflow-hidden`}>
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
            {recentTransactions.length > 0 ? (
              <div className="space-y-2">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between text-sm border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted rounded-full p-1">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <div className="font-medium truncate max-w-[150px]">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                          ? "text-green-600 dark:text-green-400"
                          : transaction.type === "withdrawal" || transaction.type === "purchase"
                            ? "text-red-600 dark:text-red-400"
                            : ""
                      }`}
                    >
                      {transaction.type === "deposit" || transaction.type === "scheduled_deposit"
                        ? "+"
                        : transaction.type === "withdrawal" || transaction.type === "purchase"
                          ? "-"
                          : ""}
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">No transactions yet</div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full flex items-center justify-center py-2 rounded-none border-t"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"}
        </Button>
      </CardContent>
    </Card>
  )
}
