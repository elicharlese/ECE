"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/lib/wallet-context"
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download } from "lucide-react"

type TimeRange = "6m" | "12m" | "24m" | "all"

export function MonthlyActivityChart() {
  const { transactions } = useWallet()
  const [timeRange, setTimeRange] = useState<TimeRange>("12m")

  // Get months to include based on selected time range
  const getMonthsToInclude = () => {
    const now = new Date()
    switch (timeRange) {
      case "6m":
        return 6
      case "12m":
        return 12
      case "24m":
        return 24
      case "all":
      default:
        // Calculate months since first transaction or default to 12
        if (transactions.length === 0) return 12

        const dates = transactions.map((tx) => parseISO(tx.date))
        const oldestDate = new Date(Math.min(...dates.map((d) => d.getTime())))
        const monthDiff = (now.getFullYear() - oldestDate.getFullYear()) * 12 + (now.getMonth() - oldestDate.getMonth())
        return Math.max(monthDiff, 1)
    }
  }

  // Prepare data for the chart
  const chartData = useMemo(() => {
    const monthsToInclude = getMonthsToInclude()
    const result = []

    // Generate empty data for each month
    for (let i = monthsToInclude - 1; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i)
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)
      const monthKey = format(monthDate, "yyyy-MM")

      result.push({
        month: monthKey,
        name: format(monthDate, "MMM yyyy"),
        deposits: 0,
        withdrawals: 0,
        net: 0,
        transactionCount: 0,
      })
    }

    // Fill in actual transaction data
    transactions.forEach((tx) => {
      const txDate = parseISO(tx.date)
      const monthKey = format(txDate, "yyyy-MM")

      const monthData = result.find((item) => item.month === monthKey)
      if (!monthData) return // Skip if month not in our range

      monthData.transactionCount++

      if (tx.type === "deposit" || tx.type === "scheduled_deposit") {
        monthData.deposits += tx.amount
        monthData.net += tx.amount
      } else if (tx.type === "withdrawal" || tx.type === "purchase") {
        monthData.withdrawals += tx.amount
        monthData.net -= tx.amount
      }
    })

    return result
  }, [transactions, timeRange])

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalNet: 0,
        avgMonthlyDeposits: 0,
        avgMonthlyWithdrawals: 0,
        avgMonthlyNet: 0,
        totalTransactions: 0,
      }
    }

    const totalDeposits = chartData.reduce((sum, month) => sum + month.deposits, 0)
    const totalWithdrawals = chartData.reduce((sum, month) => sum + month.withdrawals, 0)
    const totalNet = totalDeposits - totalWithdrawals
    const totalTransactions = chartData.reduce((sum, month) => sum + month.transactionCount, 0)

    return {
      totalDeposits,
      totalWithdrawals,
      totalNet,
      avgMonthlyDeposits: Math.round(totalDeposits / chartData.length),
      avgMonthlyWithdrawals: Math.round(totalWithdrawals / chartData.length),
      avgMonthlyNet: Math.round(totalNet / chartData.length),
      totalTransactions,
    }
  }, [chartData])

  return (
    <Card className="bg-card border shadow-sm card-hover-subtle">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Your transaction activity by month</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="24m">Last 24 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
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
                net: {
                  label: "Net Change",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#888" />
                  <Bar dataKey="deposits" fill="var(--color-deposits)" name="Deposits" />
                  <Bar dataKey="withdrawals" fill="var(--color-withdrawals)" name="Withdrawals" />
                  <Bar dataKey="net" fill="var(--color-net)" name="Net Change" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No activity data available for the selected period.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
            <div className="text-xs text-muted-foreground">Total Transactions</div>
            <div className="text-lg font-bold">{stats.totalTransactions}</div>
          </div>
          <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
            <div className="text-xs text-muted-foreground">Total Deposits</div>
            <div className="text-lg font-bold text-green-500">+{stats.totalDeposits}</div>
          </div>
          <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
            <div className="text-xs text-muted-foreground">Total Withdrawals</div>
            <div className="text-lg font-bold text-red-500">-{stats.totalWithdrawals}</div>
          </div>
          <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
            <div className="text-xs text-muted-foreground">Net Change</div>
            <div className={`text-lg font-bold ${stats.totalNet >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.totalNet >= 0 ? "+" : ""}
              {stats.totalNet}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </CardFooter>
    </Card>
  )
}
