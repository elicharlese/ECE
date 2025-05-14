"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase-client"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { useToast } from "@/hooks/use-toast"

// Define the deletion reasons with colors
const DELETION_REASONS = [
  { id: "not-useful", label: "Not useful", color: "#FF6384" },
  { id: "too-complicated", label: "Too complicated", color: "#36A2EB" },
  { id: "found-alternative", label: "Found alternative", color: "#FFCE56" },
  { id: "privacy-concerns", label: "Privacy concerns", color: "#4BC0C0" },
  { id: "too-expensive", label: "Too expensive", color: "#9966FF" },
  { id: "bugs-issues", label: "Bugs/issues", color: "#FF9F40" },
  { id: "poor-support", label: "Poor support", color: "#C9CBCF" },
  { id: "temporary-break", label: "Temporary break", color: "#7FD8BE" },
  { id: "other", label: "Other", color: "#A0A0A0" },
]

// Define the feedback item type
interface FeedbackItem {
  id: string
  user_id: string
  reason: string
  additional_feedback: string | null
  created_at: string
}

// Define the aggregated data type
interface AggregatedData {
  reason: string
  count: number
  label: string
  color: string
}

export function DeletionFeedbackDashboard() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchFeedback() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("account_deletion_feedback")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setFeedbackItems(data || [])

        // Aggregate the data for charts
        const counts: Record<string, number> = {}
        data?.forEach((item) => {
          counts[item.reason] = (counts[item.reason] || 0) + 1
        })

        const aggregated = Object.keys(counts).map((reason) => {
          const reasonInfo = DELETION_REASONS.find((r) => r.id === reason) || {
            id: reason,
            label: reason,
            color: "#000000",
          }
          return {
            reason,
            count: counts[reason],
            label: reasonInfo.label,
            color: reasonInfo.color,
          }
        })

        setAggregatedData(aggregated)
      } catch (error) {
        console.error("Error fetching feedback:", error)
        toast({
          title: "Error",
          description: "Failed to load deletion feedback data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [toast])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Deletion Feedback</CardTitle>
          <CardDescription>Analysis of why users are deleting their accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="charts">
            <TabsList className="mb-4">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="details">Detailed Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading data...</p>
                </div>
              ) : aggregatedData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Deletion Reasons Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={aggregatedData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="label"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {aggregatedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Deletion Reasons Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={aggregatedData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8">
                              {aggregatedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p>No feedback data available yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading data...</p>
                </div>
              ) : feedbackItems.length > 0 ? (
                <div className="space-y-4">
                  {feedbackItems.map((item) => {
                    const reasonInfo = DELETION_REASONS.find((r) => r.id === item.reason)
                    return (
                      <Card key={item.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">{reasonInfo?.label || item.reason}</CardTitle>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        {item.additional_feedback && (
                          <CardContent className="py-2">
                            <p className="text-sm">{item.additional_feedback}</p>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p>No feedback data available yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
