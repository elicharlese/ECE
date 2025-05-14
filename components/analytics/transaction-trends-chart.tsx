"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/lib/wallet-context"
import { format, subDays, isAfter, parseISO } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

type TimeRange = "7d" | "30d" | "90d" | "all"
type ChartType = "all" | "deposits" | "withdrawals"

export function TransactionTrendsChart() {
  const { transactions } = useWallet()
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [chartType, setChartType] = useState<ChartType>("all")

  // Get date threshold based on selected time range
  const getDateThreshold = () => {
    const now = new Date()
    switch (timeRange) {
      case "7d":
        return subDays(now, 7)
      case "30d":
        return subDays(now, 30)
      case "90d":
        return subDays(now, 90)
      case "all":
      default:
        return new Date(0) // Beginning of time
    }
  }

  // Filter transactions based on selected time range and type
  const filteredTransactions = useMemo(() => {
    const dateThreshold = getDateThreshold()

    return transactions.filter((tx) => {
      const txDate = parseISO(tx.date)
      const isAfterThreshold = isAfter(txDate, dateThreshold)

      if (!isAfterThreshold) return false

      if (chartType === "deposits") {
        return tx.type === "deposit" || tx.type === "scheduled_deposit"
      } else if (chartType === "withdrawals") {
        return tx.type === "withdrawal" || tx.type === "purchase"
      }

      return true
    })
  }, [transactions, timeRange, chartType])

  // Prepare data for the chart
  const chartData = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return []
    }

    // Sort transactions by date
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
    )

    // Group transactions by day
    const groupedByDay = sortedTransactions.reduce(
      (acc, tx) => {
        const txDate = parseISO(tx.date)
        const dateKey = format(txDate, "yyyy-MM-dd")

        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            deposits: 0,
            withdrawals: 0,
            balance: 0,
          }
        }

        if (tx.type === "deposit" || tx.type === "scheduled_deposit") {
          acc[dateKey].deposits += tx.amount
        } else if (tx.type === "withdrawal" || tx.type === "purchase") {
          acc[dateKey].withdrawals += tx.amount
        }

        return acc
      },
      {} as Record<string, { date: string; deposits: number; withdrawals: number; balance: number }>,
    )

    // Convert to array and calculate running balance
    const result = Object.values(groupedByDay)

    // Sort by date
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate running balance
    let runningBalance = 0
    for (const day of result) {
      runningBalance += day.deposits - day.withdrawals
      day.balance = runningBalance
    }

    return result
  }, [filteredTransactions])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDeposits = filteredTransactions
      .filter((tx) => tx.type === "deposit" || tx.type === "scheduled_deposit")
      .reduce((sum, tx) => sum + tx.amount, 0)

    const totalWithdrawals = filteredTransactions
      .filter((tx) => tx.type === "withdrawal" || tx.type === "purchase")
      .reduce((sum, tx) => sum + tx.amount, 0)

    const netChange = totalDeposits - totalWithdrawals

    return {
      totalDeposits,
      totalWithdrawals,
      netChange,
    }
  }, [filteredTransactions])

  // Format date for display on chart
  const formatXAxis = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d")
  }

  return (
    <Card className="bg-card border shadow-sm card-hover-subtle">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Transaction Trends</CardTitle>
            <CardDescription>Your transaction activity over time</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="deposits">Deposits Only</SelectItem>
                <SelectItem value="withdrawals">Withdrawals Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                deposits: {
                  label: "Deposits",
                  color: "hsl(var(--chart-1))",
                },
                withdrawals: {
                  label: "Withdrawals",
                  color: "hsl(var(--chart-2))",
                },
                balance: {
                  label: "Balance",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {(chartType === "all" || chartType === "deposits") && (
                    <Line
                      type="monotone"
                      dataKey="deposits"
                      stroke="var(--color-deposits)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Deposits"
                    />
                  )}
                  {(chartType === "all" || chartType === "withdrawals") && (
                    <Line
                      type="monotone"
                      dataKey="withdrawals"
                      stroke="var(--color-withdrawals)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Withdrawals"
                    />
                  )}
                  {chartType === "all" && (
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="var(--color-balance)"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Balance"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No transaction data available for the selected period.</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mt-6">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Deposits</div>
            <div className="text-lg font-bold text-green-500">+{stats.totalDeposits}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Withdrawals</div>
            <div className="text-lg font-bold text-red-500">-{stats.totalWithdrawals}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Net Change</div>
            <div className={`text-lg font-bold ${stats.netChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.netChange >= 0 ? "+" : ""}
              {stats.netChange}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Detailed Analytics
        </Button>
      </CardFooter>
    </Card>
  )
}
