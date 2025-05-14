"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/lib/wallet-context"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function TransactionCategories() {
  const { transactions } = useWallet()

  const categoryData = useMemo(() => {
    // Group transactions by type and calculate totals
    const categories = transactions.reduce(
      (acc, transaction) => {
        const type = transaction.type
        if (!acc[type]) {
          acc[type] = 0
        }
        acc[type] += transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Format for chart
    return Object.entries(categories).map(([name, value]) => {
      // Rename categories for better display
      const displayName = name
        .replace("_", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return { name: displayName, value }
    })
  }, [transactions])

  // Colors for different transaction types
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // If no transactions, show demo data
  const chartData =
    categoryData.length > 0
      ? categoryData
      : [
          { name: "Deposit", value: 1200 },
          { name: "Withdrawal", value: 800 },
          { name: "Purchase", value: 500 },
          { name: "Scheduled Deposit", value: 300 },
        ]

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Transaction Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Amount"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
