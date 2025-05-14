"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/lib/wallet-context"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function WalletBalanceHistory() {
  const { transactions, currency } = useWallet()
  const [balanceHistory, setBalanceHistory] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d")

  useEffect(() => {
    // Generate balance history based on transactions
    if (transactions.length > 0) {
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )

      let runningBalance = 0
      const history = sortedTransactions.map((tx) => {
        if (tx.type === "deposit" || tx.type === "scheduled_deposit") {
          runningBalance += tx.amount
        } else if (tx.type === "withdrawal" || tx.type === "purchase") {
          runningBalance -= tx.amount
        }

        return {
          date: new Date(tx.date),
          balance: runningBalance,
          amount: tx.amount,
          type: tx.type,
        }
      })

      // Filter based on timeframe
      const now = new Date()
      let cutoffDate: Date

      switch (timeframe) {
        case "7d":
          cutoffDate = new Date(now.setDate(now.getDate() - 7))
          break
        case "30d":
          cutoffDate = new Date(now.setDate(now.getDate() - 30))
          break
        case "90d":
          cutoffDate = new Date(now.setDate(now.getDate() - 90))
          break
        case "1y":
          cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1))
          break
      }

      const filteredHistory = history.filter((item) => item.date >= cutoffDate)

      // Add data points for empty periods to make the chart smoother
      const formattedHistory = filteredHistory.map((item) => ({
        date: item.date.toLocaleDateString(),
        balance: item.balance,
        amount: item.amount,
        type: item.type,
      }))

      setBalanceHistory(formattedHistory)
    }
  }, [transactions, timeframe])

  // If no transactions, generate demo data
  useEffect(() => {
    if (transactions.length === 0) {
      const demoData = []
      const now = new Date()
      let balance = 1000

      // Generate data points based on timeframe
      let days: number
      switch (timeframe) {
        case "7d":
          days = 7
          break
        case "30d":
          days = 30
          break
        case "90d":
          days = 90
          break
        case "1y":
          days = 365
          break
      }

      for (let i = days; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Random fluctuation between -50 and +100
        const change = Math.floor(Math.random() * 150) - 50
        balance += change

        // Ensure balance doesn't go below 0
        if (balance < 0) balance = 0

        demoData.push({
          date: date.toLocaleDateString(),
          balance: balance,
          amount: Math.abs(change),
          type: change > 0 ? "deposit" : "withdrawal",
        })
      }

      setBalanceHistory(demoData)
    }
  }, [transactions, timeframe])

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Balance History</CardTitle>
        <Tabs defaultValue={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList className="grid grid-cols-4 h-8">
            <TabsTrigger value="7d" className="text-xs">
              7D
            </TabsTrigger>
            <TabsTrigger value="30d" className="text-xs">
              30D
            </TabsTrigger>
            <TabsTrigger value="90d" className="text-xs">
              90D
            </TabsTrigger>
            <TabsTrigger value="1y" className="text-xs">
              1Y
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer
            config={{
              balance: {
                label: `Balance (${currency})`,
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Show fewer ticks for better readability
                    const date = new Date(value)
                    return timeframe === "7d"
                      ? date.toLocaleDateString(undefined, { weekday: "short" })
                      : date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
