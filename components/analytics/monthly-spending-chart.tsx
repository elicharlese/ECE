"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/lib/wallet-context"
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download } from "lucide-react"

type TimeRange = "3m" | "6m" | "12m" | "all"

// Mock categories for demo purposes
const TRANSACTION_CATEGORIES = {
  purchase: "Products",
  withdrawal: "Services",
  scheduled_deposit: "Savings",
  deposit: "Income",
  conversion: "Exchange",
}

export function MonthlySpendingChart() {
  const { transactions } = useWallet()
  const [timeRange, setTimeRange] = useState<TimeRange>("6m")

  // Get months to include based on selected time range
  const getMonthsToInclude = () => {
    const now = new Date()
    switch (timeRange) {
      case "3m":
        return 3
      case "6m":
        return 6
      case "12m":
        return 12
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
        Products: 0,
        Services: 0,
        Savings: 0,
        Income: 0,
        Exchange: 0,
        total: 0,
      })
    }

    // Fill in actual transaction data
    transactions.forEach((tx) => {
      const txDate = parseISO(tx.date)
      const monthKey = format(txDate, "yyyy-MM")

      const monthData = result.find((item) => item.month === monthKey)
      if (!monthData) return // Skip if month not in our range

      const category = TRANSACTION_CATEGORIES[tx.type as keyof typeof TRANSACTION_CATEGORIES] || "Other"

      if (tx.type === "deposit" || tx.type === "scheduled_deposit") {
        monthData[category] += tx.amount
        monthData.total += tx.amount
      } else if (tx.type === "withdrawal" || tx.type === "purchase") {
        monthData[category] += tx.amount
        monthData.total -= tx.amount // Negative impact on total
      }
    })

    return result
  }, [transactions, timeRange])

  // Calculate total spending by category
  const spendingByCategory = useMemo(() => {
    const categories: Record<string, number> = {
      Products: 0,
      Services: 0,
      Other: 0,
    }

    transactions
      .filter((tx) => tx.type === "withdrawal" || tx.type === "purchase")
      .forEach((tx) => {
        const category = TRANSACTION_CATEGORIES[tx.type as keyof typeof TRANSACTION_CATEGORIES] || "Other"
        categories[category] = (categories[category] || 0) + tx.amount
      })

    const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0)

    return Object.entries(categories)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  // Colors for the chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <Card className="bg-card border shadow-sm card-hover-subtle">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Your spending patterns over time</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
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
                Products: {
                  label: "Products",
                  color: "hsl(var(--chart-1))",
                },
                Services: {
                  label: "Services",
                  color: "hsl(var(--chart-2))",
                },
                Savings: {
                  label: "Savings",
                  color: "hsl(var(--chart-3))",
                },
                Income: {
                  label: "Income",
                  color: "hsl(var(--chart-4))",
                },
                Exchange: {
                  label: "Exchange",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="Products" stackId="a" fill="var(--color-Products)" />
                  <Bar dataKey="Services" stackId="a" fill="var(--color-Services)" />
                  <Bar dataKey="Savings" stackId="a" fill="var(--color-Savings)" />
                  <Bar dataKey="Income" stackId="a" fill="var(--color-Income)" />
                  <Bar dataKey="Exchange" stackId="a" fill="var(--color-Exchange)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No spending data available for the selected period.</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Spending by Category</h4>
          <div className="space-y-4">
            {spendingByCategory.map((category, index) => (
              <div key={category.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{category.category}</span>
                  <span>
                    {category.amount} ECE ({category.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export Spending Report
        </Button>
      </CardFooter>
    </Card>
  )
}
