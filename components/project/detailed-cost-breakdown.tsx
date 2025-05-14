"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts"
import {
  Info,
  Plus,
  Minus,
  Calendar,
  Code,
  Smartphone,
  Server,
  Paintbrush,
  Shield,
  Zap,
  Clock,
  DollarSign,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard } from "lucide-react"

// Define the types for our component
interface DetailedCostBreakdownProps {
  formData: {
    projectType: string
    features: Record<string, boolean>
    platform: Record<string, boolean>
    expediteFactor: number
    budget: number
    timeline: number
    invoiceBilling?: {
      enabled: boolean
      frequency: "weekly" | "biweekly" | "monthly"
      fixedAmount: number
    }
  }
  currency?: string
  onUpdateExpedite: (value: number[]) => void
  onUpdateBudget: (value: number) => void
  onUpdateInvoiceBilling?: (value: { enabled: boolean; frequency: string; fixedAmount: number }) => void
}

// Feature cost and time data
const featureData = {
  authentication: {
    cost: 500,
    time: 1,
    label: "User Authentication",
    description: "Secure login and user management system",
  },
  payments: {
    cost: 1000,
    time: 2,
    label: "Payment Processing",
    description: "Integration with payment gateways and transaction handling",
  },
  userProfiles: {
    cost: 600,
    time: 1,
    label: "User Profiles",
    description: "Customizable user profiles and preferences",
  },
  notifications: {
    cost: 400,
    time: 1,
    label: "Push Notifications",
    description: "Real-time alerts and messaging system",
  },
  analytics: {
    cost: 800,
    time: 1.5,
    label: "Analytics Dashboard",
    description: "Data visualization and reporting tools",
  },
  adminDashboard: {
    cost: 1200,
    time: 2,
    label: "Admin Dashboard",
    description: "Administrative controls and management interface",
  },
  customDesign: {
    cost: 1500,
    time: 2,
    label: "Custom UI/UX Design",
    description: "Unique visual identity and user experience",
  },
  apiIntegration: {
    cost: 900,
    time: 1.5,
    label: "API Integration",
    description: "Connection with third-party services and data sources",
  },
}

// Platform cost and time data
const platformData = {
  ios: { label: "iOS", description: "iPhone and iPad applications" },
  android: { label: "Android", description: "Android phones and tablets applications" },
  web: { label: "Web", description: "Browser-based web application" },
}

// Development phases with descriptions
const developmentPhases = [
  {
    name: "Planning",
    percentage: 10,
    description: "Requirements gathering, project scoping, and architecture planning",
  },
  { name: "Design", percentage: 20, description: "UI/UX design, wireframing, and prototyping" },
  { name: "Development", percentage: 40, description: "Frontend and backend implementation" },
  { name: "Testing", percentage: 15, description: "Quality assurance, bug fixing, and performance optimization" },
  { name: "Deployment", percentage: 10, description: "Launch preparation and application deployment" },
  { name: "Support", percentage: 5, description: "Post-launch support and maintenance" },
]

// Calculate payment schedule based on frequency and amount
const calculatePaymentSchedule = (
  frequency: string,
  amount: number,
  timelineWeeks: number,
  expedited: { cost: number }, // Add expedited to the parameters
) => {
  const payments: { date: string; amount: number }[] = []
  let totalAmount = 0
  let numberOfPayments = 0

  switch (frequency) {
    case "weekly":
      numberOfPayments = timelineWeeks
      break
    case "biweekly":
      numberOfPayments = Math.ceil(timelineWeeks / 2)
      break
    case "monthly":
      numberOfPayments = Math.ceil(timelineWeeks / 4)
      break
    default:
      numberOfPayments = 4
  }

  // Ensure at least one payment
  numberOfPayments = Math.max(1, numberOfPayments)

  for (let i = 0; i < numberOfPayments; i++) {
    payments.push({
      date: `Week ${i * (frequency === "weekly" ? 1 : frequency === "biweekly" ? 2 : 4) + 1}`,
      amount: amount,
    })
    totalAmount += amount
  }

  // Adjust the last payment to match the total cost
  if (payments.length > 0) {
    const lastPayment = payments[payments.length - 1]
    lastPayment.amount = lastPayment.amount + (expedited.cost - totalAmount)
  }

  return payments
}

export function DetailedCostBreakdown({
  formData,
  currency = "ECE",
  onUpdateExpedite,
  onUpdateBudget,
  onUpdateInvoiceBilling,
}: DetailedCostBreakdownProps) {
  const [activeTab, setActiveTab] = useState("breakdown")
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Calculate base cost based on features and platforms
  const calculateBaseCost = () => {
    let cost = formData.budget

    // Add costs for selected features
    Object.entries(formData.features).forEach(([feature, isSelected]) => {
      if (isSelected && feature in featureData) {
        cost += featureData[feature as keyof typeof featureData].cost
      }
    })

    // Add costs for selected platforms
    let platformCount = 0
    if (formData.platform.ios) platformCount++
    if (formData.platform.android) platformCount++
    if (formData.platform.web) platformCount++

    // First platform is included in base cost, additional platforms cost extra
    if (platformCount > 1) {
      cost += (platformCount - 1) * 2000
    }

    return cost
  }

  // Calculate timeline based on features and platforms
  const calculateBaseTimeline = () => {
    let weeks = formData.timeline

    // Add time for selected features
    Object.entries(formData.features).forEach(([feature, isSelected]) => {
      if (isSelected && feature in featureData) {
        weeks += featureData[feature as keyof typeof featureData].time
      }
    })

    // Add time for selected platforms
    let platformCount = 0
    if (formData.platform.ios) platformCount++
    if (formData.platform.android) platformCount++
    if (formData.platform.web) platformCount++

    // First platform is included in base timeline, additional platforms add time
    if (platformCount > 1) {
      weeks += (platformCount - 1) * 2
    }

    return weeks
  }

  // Calculate expedited timeline and cost
  const calculateExpedited = () => {
    const baseCost = calculateBaseCost()
    const baseTimeline = calculateBaseTimeline()

    // Calculate expedited timeline (reduce by up to 40% based on expedite factor)
    const expeditedTimeline = Math.max(
      Math.round(baseTimeline * (1 - (formData.expediteFactor / 100) * 0.4)),
      Math.ceil(baseTimeline * 0.6),
    )

    // Calculate expedited cost (increase by up to 100% based on expedite factor)
    const expeditedCost = Math.round(baseCost * (1 + (formData.expediteFactor / 100) * 1))

    return {
      timeline: expeditedTimeline,
      cost: expeditedCost,
      timelineSaved: baseTimeline - expeditedTimeline,
      costIncrease: expeditedCost - baseCost,
      baseTimeline,
      baseCost,
    }
  }

  const expedited = calculateExpedited()

  // Prepare data for the cost breakdown chart
  const prepareCostBreakdownData = () => {
    const baseCost = formData.budget
    let featureCost = 0
    let platformCost = 0
    const expediteCost = expedited.costIncrease

    // Calculate feature costs
    Object.entries(formData.features).forEach(([feature, isSelected]) => {
      if (isSelected && feature in featureData) {
        featureCost += featureData[feature as keyof typeof featureData].cost
      }
    })

    // Calculate platform costs
    let platformCount = 0
    if (formData.platform.ios) platformCount++
    if (formData.platform.android) platformCount++
    if (formData.platform.web) platformCount++

    // First platform is included in base cost, additional platforms cost extra
    if (platformCount > 1) {
      platformCost = (platformCount - 1) * 2000
    }

    return [
      { name: "Base Cost", value: baseCost, color: "#0e5f59" },
      { name: "Features", value: featureCost, color: "#14a89d" },
      { name: "Platforms", value: platformCost, color: "#2dd4bf" },
      { name: "Expedited Timeline", value: expediteCost, color: "#f59e0b" },
    ]
  }

  // Prepare data for the timeline breakdown chart
  const prepareTimelineBreakdownData = () => {
    const baseTimeline = formData.timeline
    let featureTime = 0
    let platformTime = 0
    const expediteSavings = expedited.timelineSaved

    // Calculate feature timeline
    Object.entries(formData.features).forEach(([feature, isSelected]) => {
      if (isSelected && feature in featureData) {
        featureTime += featureData[feature as keyof typeof featureData].time
      }
    })

    // Calculate platform timeline
    let platformCount = 0
    if (formData.platform.ios) platformCount++
    if (formData.platform.android) platformCount++
    if (formData.platform.web) platformCount++

    // First platform is included in base timeline, additional platforms add time
    if (platformCount > 1) {
      platformTime = (platformCount - 1) * 2
    }

    return [
      { name: "Base Timeline", weeks: baseTimeline },
      { name: "Features", weeks: featureTime },
      { name: "Platforms", weeks: platformTime },
      { name: "Expedited Savings", weeks: -expediteSavings },
    ]
  }

  // Prepare feature cost data
  const prepareFeatureCostData = () => {
    return Object.entries(formData.features)
      .filter(([_, isSelected]) => isSelected)
      .map(([feature, _]) => ({
        name: featureData[feature as keyof typeof featureData]?.label || feature,
        cost: featureData[feature as keyof typeof featureData]?.cost || 0,
      }))
      .sort((a, b) => b.cost - a.cost)
  }

  // Get selected platforms
  const getSelectedPlatforms = () => {
    return Object.entries(formData.platform)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform, _]) => platformData[platform as keyof typeof platformData]?.label || platform)
  }

  // Calculate total cost
  const totalCost = expedited.cost

  // Calculate cost distribution by development phase
  const costByPhase = developmentPhases.map((phase) => ({
    name: phase.name,
    cost: Math.round((phase.percentage / 100) * totalCost),
    percentage: phase.percentage,
    description: phase.description,
  }))

  // Prepare data for the pie chart
  const costBreakdownData = prepareCostBreakdownData()
  const timelineBreakdownData = prepareTimelineBreakdownData()
  const featureCostData = prepareFeatureCostData()

  // Handle budget adjustments
  const handleBudgetAdjustment = (amount: number) => {
    const newBudget = Math.max(1000, formData.budget + amount)
    onUpdateBudget(newBudget)
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Cost Breakdown</CardTitle>
            <CardDescription>Detailed analysis of your project costs</CardDescription>
          </div>
          <Badge variant="outline" className="text-lg font-semibold px-3 py-1">
            {totalCost} {currency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-6">
            {/* Cost Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Base Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formData.budget} {currency}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleBudgetAdjustment(-500)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="flex-1">
                      <Progress value={(formData.budget / 10000) * 100} className="h-2" />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleBudgetAdjustment(500)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Base development cost before features and platforms
                  </p>
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalCost} {currency}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex-1">
                      <Progress value={(totalCost / (formData.budget * 3)) * 100} className="h-2" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Final cost including all features, platforms, and expedited development
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown Chart */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: number) => [`${value} ${currency}`, "Cost"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Cost Breakdown */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Detailed Breakdown</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>Base Development Cost</span>
                  </div>
                  <span className="font-medium">
                    {formData.budget} {currency}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      <span>Selected Features</span>
                    </div>
                    <span className="font-medium">
                      {costBreakdownData.find((item) => item.name === "Features")?.value || 0} {currency}
                    </span>
                  </div>

                  <div className="pl-6 space-y-1">
                    {featureCostData.map((feature, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{feature.name}</span>
                        <span>
                          {feature.cost} {currency}
                        </span>
                      </div>
                    ))}
                    {featureCostData.length === 0 && (
                      <div className="text-sm text-muted-foreground">No features selected</div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <span>Platform Support</span>
                    </div>
                    <span className="font-medium">
                      {costBreakdownData.find((item) => item.name === "Platforms")?.value || 0} {currency}
                    </span>
                  </div>

                  <div className="pl-6 text-sm">
                    <div>Selected: {getSelectedPlatforms().join(", ") || "None"}</div>
                    {getSelectedPlatforms().length > 1 && (
                      <div className="text-muted-foreground">
                        First platform included, +2,000 {currency} per additional platform
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>Expedited Development</span>
                    </div>
                    <span className="font-medium">
                      {expedited.costIncrease > 0 ? `+${expedited.costIncrease}` : 0} {currency}
                    </span>
                  </div>

                  <div className="pl-6 text-sm">
                    <div className="flex justify-between">
                      <span>Expedite Factor</span>
                      <span>{formData.expediteFactor}%</span>
                    </div>
                    <div className="mt-1">
                      <Slider
                        value={[formData.expediteFactor]}
                        onValueChange={onUpdateExpedite}
                        max={100}
                        step={5}
                        className="py-1"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Standard</span>
                      <span>Expedited</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center font-medium text-lg pt-2">
                  <span>Total Cost</span>
                  <span>
                    {totalCost} {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Development Phases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Cost by Development Phase</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                  {showAdvancedOptions ? "Hide Details" : "Show Details"}
                </Button>
              </div>

              {showAdvancedOptions ? (
                <div className="space-y-4">
                  {costByPhase.map((phase, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>{phase.name}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{phase.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{phase.percentage}%</span>
                          <span className="font-medium">
                            {phase.cost} {currency}
                          </span>
                        </div>
                      </div>
                      <Progress value={phase.percentage} className="h-1.5" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costByPhase} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: number) => [`${value} ${currency}`, "Cost"]} />
                      <Bar dataKey="cost" fill="#0e5f59" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {/* Timeline Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Standard Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expedited.baseTimeline} weeks</div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex-1">
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Estimated timeline without expedited development</p>
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expedited Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expedited.timeline} weeks</div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex-1">
                      <Progress value={(expedited.timeline / expedited.baseTimeline) * 100} className="h-2" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {expedited.timelineSaved > 0
                      ? `Save ${expedited.timelineSaved} weeks with expedited development`
                      : "Standard development timeline"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Breakdown Chart */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Timeline Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timelineBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: number) => [`${value} weeks`, "Duration"]} />
                      <Bar dataKey="weeks" fill="#0e5f59" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expedite Factor */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Expedite Factor</CardTitle>
                <CardDescription>Adjust to balance timeline and cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Factor: {formData.expediteFactor}%</span>
                  <Badge variant="outline">
                    {formData.expediteFactor === 0
                      ? "Standard"
                      : formData.expediteFactor < 50
                        ? "Moderately Expedited"
                        : "Highly Expedited"}
                  </Badge>
                </div>

                <Slider
                  value={[formData.expediteFactor]}
                  onValueChange={onUpdateExpedite}
                  max={100}
                  step={5}
                  className="py-2"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Standard Timeline</span>
                  <span>Fastest Delivery</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Time Saved</span>
                    </div>
                    <div className="text-lg font-bold">
                      {expedited.timelineSaved} weeks
                      <span className="text-xs text-muted-foreground ml-2">
                        ({Math.round((expedited.timelineSaved / expedited.baseTimeline) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Additional Cost</span>
                    </div>
                    <div className="text-lg font-bold">
                      {expedited.costIncrease} {currency}
                      <span className="text-xs text-muted-foreground ml-2">
                        (+{Math.round((expedited.costIncrease / expedited.baseCost) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            {/* Standard vs Expedited Comparison */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Standard vs. Expedited</CardTitle>
                <CardDescription>Compare development options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-medium">Standard Development</h3>
                      <div className="text-3xl font-bold mt-2">
                        {expedited.baseCost} {currency}
                      </div>
                      <div className="text-sm text-muted-foreground">{expedited.baseTimeline} weeks</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Relaxed timeline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Lower overall cost</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Standard quality assurance</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-medium">Expedited Development</h3>
                      <div className="text-3xl font-bold mt-2">
                        {expedited.cost} {currency}
                      </div>
                      <div className="text-sm text-muted-foreground">{expedited.timeline} weeks</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Faster time to market</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Additional development resources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Parallel development workflows</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Expedite Factor Impact</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Timeline Reduction</span>
                      <span>{Math.round((expedited.timelineSaved / expedited.baseTimeline) * 100)}%</span>
                    </div>
                    <Progress
                      value={Math.round((expedited.timelineSaved / expedited.baseTimeline) * 100)}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Cost Increase</span>
                      <span>{Math.round((expedited.costIncrease / expedited.baseCost) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((expedited.costIncrease / expedited.baseCost) * 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Billing Options */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Invoice Billing Options</CardTitle>
                <CardDescription>Fixed amount billing schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium">Fixed Payment Schedule</span>
                    </div>
                    <Switch
                      checked={formData.invoiceBilling?.enabled || false}
                      onCheckedChange={(checked) => {
                        if (onUpdateInvoiceBilling) {
                          onUpdateInvoiceBilling({
                            enabled: checked,
                            frequency: formData.invoiceBilling?.frequency || "monthly",
                            fixedAmount: formData.invoiceBilling?.fixedAmount || Math.round(expedited.cost / 4),
                          })
                        }
                      }}
                    />
                  </div>

                  {formData.invoiceBilling?.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="invoice-frequency">Billing Frequency</Label>
                        <Select
                          value={formData.invoiceBilling.frequency}
                          onValueChange={(value) => {
                            if (onUpdateInvoiceBilling) {
                              onUpdateInvoiceBilling({
                                ...formData.invoiceBilling,
                                frequency: value as "weekly" | "biweekly" | "monthly",
                              })
                            }
                          }}
                        >
                          <SelectTrigger id="invoice-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fixed-amount">Fixed Amount</Label>
                        <div className="flex items-center gap-2">
                          <span>{currency}</span>
                          <Input
                            id="fixed-amount"
                            type="number"
                            value={formData.invoiceBilling.fixedAmount}
                            onChange={(e) => {
                              if (onUpdateInvoiceBilling) {
                                onUpdateInvoiceBilling({
                                  ...formData.invoiceBilling,
                                  fixedAmount: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            }}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">Payment Schedule</h4>
                        <div className="space-y-2 text-sm">
                          {calculatePaymentSchedule(
                            formData.invoiceBilling.frequency,
                            formData.invoiceBilling.fixedAmount,
                            expedited.timeline,
                            expedited,
                          ).map((payment, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                              <span>Payment {index + 1}</span>
                              <span className="font-medium">
                                {payment.amount} {currency}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t">
                          <span className="font-medium">Total</span>
                          <span className="font-bold">
                            {expedited.cost} {currency}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
