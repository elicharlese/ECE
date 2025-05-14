"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Info,
  Layers,
  ShoppingCart,
  CalendarClock,
  Smartphone,
  Settings,
  MessageSquare,
  CheckCircle2,
  Globe,
  AlertCircle,
  LightbulbIcon,
} from "lucide-react"
import { DetailedCostBreakdown } from "./detailed-cost-breakdown"

// Import the new component at the top of the file
import { PaymentScheduleTimeline } from "./payment-schedule-timeline"

// Define the form data structure
type OrderFormData = {
  projectName: string
  projectType: "mobile" | "web" | "both"
  description: string
  budget: number
  timeline: number
  expediteFactor: number
  features: {
    authentication: boolean
    payments: boolean
    userProfiles: boolean
    notifications: boolean
    analytics: boolean
    adminDashboard: boolean
    customDesign: boolean
    apiIntegration: boolean
  }
  platform: {
    ios: boolean
    android: boolean
    web: boolean
  }
  invoiceBilling: {
    enabled: boolean
    frequency: "weekly" | "biweekly" | "monthly"
    fixedAmount: number
  }
  paymentType: "invoice" | "escrow"
  paymentStructure: "milestone" | "onetime" | "hourly" | "fixed"
  contactName: string
  contactEmail: string
  contactPhone: string
  additionalInfo: string
  includeTax: boolean
  taxRate: number
  taxType: string
  taxId: string
}

// Define the steps in the flow
type Step = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

// Props for the component
interface ProjectOrderFlowProps {
  onSubmit: (data: OrderFormData) => void
  initialData?: Partial<OrderFormData>
  currency?: string
  balance?: number
}

export function ProjectOrderFlow({ onSubmit, initialData, currency = "ECE", balance = 5000 }: ProjectOrderFlowProps) {
  // Define the steps
  const steps: Step[] = [
    {
      id: "project-basics",
      title: "Project Basics",
      description: "Let's start with the basic information about your project",
      icon: <Layers className="h-6 w-6" />,
    },
    {
      id: "features",
      title: "Features",
      description: "Select the features you want in your application",
      icon: <Settings className="h-6 w-6" />,
    },
    {
      id: "platforms",
      title: "Platforms",
      description: "Choose which platforms your app will support",
      icon: <Smartphone className="h-6 w-6" />,
    },
    {
      id: "payment-details",
      title: "Payment Details",
      description: "Set up how you'd like to handle payments",
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      id: "timeline-budget",
      title: "Timeline & Budget",
      description: "Set your project timeline and budget preferences",
      icon: <CalendarClock className="h-6 w-6" />,
    },
    {
      id: "contact",
      title: "Contact Information",
      description: "Provide your contact details for project communication",
      icon: <MessageSquare className="h-6 w-6" />,
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review your project details before submitting",
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ]

  // Initialize form data with defaults or provided initial data
  const [formData, setFormData] = useState<OrderFormData>({
    projectName: initialData?.projectName || "",
    projectType: initialData?.projectType || "mobile",
    description: initialData?.description || "",
    budget: initialData?.budget || 5000,
    timeline: initialData?.timeline || 8,
    expediteFactor: initialData?.expediteFactor || 0,
    features: initialData?.features || {
      authentication: false,
      payments: false,
      userProfiles: false,
      notifications: false,
      analytics: false,
      adminDashboard: false,
      customDesign: false,
      apiIntegration: false,
    },
    platform: initialData?.platform || {
      ios: false,
      android: false,
      web: false,
    },
    invoiceBilling: initialData?.invoiceBilling || {
      enabled: true, // Changed from false to true to ensure it's always enabled
      frequency: "monthly",
      fixedAmount: 2500,
    },
    paymentType: initialData?.paymentType || "invoice",
    paymentStructure: initialData?.paymentStructure || "fixed",
    contactName: initialData?.contactName || "",
    contactEmail: initialData?.contactEmail || "",
    contactPhone: initialData?.contactPhone || "",
    additionalInfo: initialData?.additionalInfo || "",
    includeTax: initialData?.includeTax || false,
    taxRate: initialData?.taxRate || 20,
    taxType: initialData?.taxType || "",
    taxId: initialData?.taxId || "",
  })

  // State for current step
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [orderConfirmationOpen, setOrderConfirmationOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle checkbox changes for features and platforms
  const handleCheckboxChange = (category: "features" | "platform", name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: checked,
      },
    }))
  }

  // Handle expedite factor change
  const handleExpediteChange = (value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      expediteFactor: value[0],
    }))
  }

  // Handle budget update
  const handleBudgetUpdate = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      budget: value,
    }))
  }

  // Handle invoice billing update
  const handleInvoiceBillingUpdate = (value: { enabled: boolean; frequency: string; fixedAmount: number }) => {
    setFormData((prev) => ({
      ...prev,
      invoiceBilling: {
        enabled: value.enabled,
        frequency: value.frequency as "weekly" | "biweekly" | "monthly",
        fixedAmount: value.fixedAmount,
      },
    }))
  }

  // Handle payment type change
  const handlePaymentTypeChange = (value: "invoice" | "escrow") => {
    setFormData((prev) => ({
      ...prev,
      paymentType: value,
    }))
  }

  // Handle payment structure change
  const handlePaymentStructureChange = (value: "milestone" | "onetime" | "hourly" | "fixed") => {
    setFormData((prev) => ({
      ...prev,
      paymentStructure: value,
    }))
  }

  // Handle tax inclusion change
  const handleTaxInclusionChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      includeTax: checked,
    }))
  }

  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index)
      window.scrollTo(0, 0)
    }
  }

  // Calculate base cost based on features and platforms
  const calculateBaseCost = () => {
    let cost = formData.budget

    // Add costs for selected features
    const featureCosts = {
      authentication: 500,
      payments: 1000,
      userProfiles: 600,
      notifications: 400,
      analytics: 800,
      adminDashboard: 1200,
      customDesign: 1500,
      apiIntegration: 900,
    }

    Object.entries(formData.features).forEach(([feature, isSelected]) => {
      if (isSelected) {
        cost += featureCosts[feature as keyof typeof featureCosts]
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
    const featureTimeAdds = {
      authentication: 1,
      payments: 2,
      userProfiles: 1,
      notifications: 1,
      analytics: 1.5,
      adminDashboard: 2,
      customDesign: 2,
      apiIntegration: 1.5,
    }

    Object.entries(formData.features).forEach(([feature, isSelected]) => {
      if (isSelected) {
        weeks += featureTimeAdds[feature as keyof typeof featureTimeAdds]
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
    }
  }

  // Get the final timeline and cost
  const getFinalEstimate = () => {
    const expedited = calculateExpedited()
    return {
      timeline: expedited.timeline,
      cost: expedited.cost,
      timelineSaved: expedited.timelineSaved,
      costIncrease: expedited.costIncrease,
    }
  }

  const finalEstimate = getFinalEstimate()

  // Handle form submission
  const handleSubmit = () => {
    setOrderConfirmationOpen(true)
  }

  // Confirm order submission
  const confirmOrderSubmission = () => {
    setIsSubmitting(true)

    // Submit the form data
    onSubmit(formData)

    // Close the confirmation dialog
    setOrderConfirmationOpen(false)
  }

  // Check if the current step is valid
  const isCurrentStepValid = () => {
    switch (steps[currentStepIndex].id) {
      case "project-basics":
        return formData.projectName.trim() !== "" && formData.description.trim() !== ""
      case "features":
        // At least one feature should be selected
        return Object.values(formData.features).some((isSelected) => isSelected)
      case "platforms":
        // At least one platform should be selected
        return Object.values(formData.platform).some((isSelected) => isSelected)
      case "payment-details":
        // Always valid as we have default values
        return true
      case "timeline-budget":
        // Always valid as we have default values
        return true
      case "contact":
        return (
          formData.contactName.trim() !== "" &&
          formData.contactEmail.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
        )
      case "review":
        // All previous steps should be valid
        return true
      default:
        return false
    }
  }

  // Render the current step content
  const renderStepContent = () => {
    const currentStep = steps[currentStepIndex]

    switch (currentStep.id) {
      case "project-basics":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="projectType" className="text-base font-medium">
                  Project Type
                </Label>
                <div className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <div
                    className="flex items-center gap-1 cursor-help"
                    title="This affects development approach and pricing"
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>Why this matters</span>
                  </div>
                </div>
              </div>

              <RadioGroup
                value={formData.projectType}
                onValueChange={(value: "mobile" | "web" | "both") => setFormData({ ...formData, projectType: value })}
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                <div
                  className={`border rounded-md p-3 transition-all ${
                    formData.projectType === "mobile"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  } cursor-pointer`}
                  onClick={() => setFormData({ ...formData, projectType: "mobile" })}
                >
                  <div className="flex items-start gap-2">
                    <RadioGroupItem value="mobile" id="mobile" className="mt-1" />
                    <div>
                      <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Smartphone className="h-4 w-4" />
                        Mobile App
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Native mobile experience for iOS and/or Android devices
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-md p-3 transition-all ${
                    formData.projectType === "web"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  } cursor-pointer`}
                  onClick={() => setFormData({ ...formData, projectType: "web" })}
                >
                  <div className="flex items-start gap-2">
                    <RadioGroupItem value="web" id="web" className="mt-1" />
                    <div>
                      <Label htmlFor="web" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Globe className="h-4 w-4" />
                        Web App
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Browser-based application accessible from any device
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-md p-3 transition-all ${
                    formData.projectType === "both"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  } cursor-pointer`}
                  onClick={() => setFormData({ ...formData, projectType: "both" })}
                >
                  <div className="flex items-start gap-2">
                    <RadioGroupItem value="both" id="both" className="mt-1" />
                    <div>
                      <Label htmlFor="both" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Layers className="h-4 w-4" />
                        Both
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete solution with mobile and web applications
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded-md">
                <p className="flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    Selecting "Both" will increase development time and cost but provides the most comprehensive
                    solution.
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project requirements in detail"
                className="min-h-[120px]"
                required
              />
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-muted">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Core Features</CardTitle>
                  <CardDescription>Essential features for your application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="authentication"
                      checked={formData.features.authentication}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", "authentication", checked as boolean)
                      }
                    />
                    <Label htmlFor="authentication" className="cursor-pointer">
                      User Authentication
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="userProfiles"
                      checked={formData.features.userProfiles}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", "userProfiles", checked as boolean)
                      }
                    />
                    <Label htmlFor="userProfiles" className="cursor-pointer">
                      User Profiles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifications"
                      checked={formData.features.notifications}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", "notifications", checked as boolean)
                      }
                    />
                    <Label htmlFor="notifications" className="cursor-pointer">
                      Push Notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="customDesign"
                      checked={formData.features.customDesign}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", "customDesign", checked as boolean)
                      }
                    />
                    <Label htmlFor="customDesign" className="cursor-pointer">
                      Custom UI/UX Design
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-muted">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Advanced Features</CardTitle>
                  <CardDescription>Additional functionality for your application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payments"
                      checked={formData.features.payments}
                      onCheckedChange={(checked) => handleCheckboxChange("features", "payments", checked as boolean)}
                    />
                    <Label htmlFor="payments" className="cursor-pointer">
                      Payment Processing
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="analytics"
                      checked={formData.features.analytics}
                      onCheckedChange={(checked) => handleCheckboxChange("features", "analytics", checked as boolean)}
                    />
                    <Label htmlFor="analytics" className="cursor-pointer">
                      Analytics Dashboard
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="adminDashboard"
                      checked={formData.features.adminDashboard}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", "adminDashboard", checked as boolean)
                      }
                    />
                    <Label htmlFor="adminDashboard" className="cursor-pointer">
                      Admin Dashboard
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="apiIntegration"
                      checked={formData.features.apiIntegration}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", "apiIntegration", checked as boolean)
                      }
                    />
                    <Label htmlFor="apiIntegration" className="cursor-pointer">
                      Third-party API Integration
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="bg-muted/50 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Feature Selection</AlertTitle>
              <AlertDescription>
                Each feature you select will affect the project timeline and cost. Choose the features that are most
                important for your application.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "platforms":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`border ${formData.platform.ios ? "border-primary" : "border-muted"} transition-all`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">iOS</CardTitle>
                    {formData.platform.ios && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <CardDescription>Apple iPhone and iPad devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ios"
                      checked={formData.platform.ios}
                      onCheckedChange={(checked) => handleCheckboxChange("platform", "ios", checked as boolean)}
                    />
                    <Label htmlFor="ios" className="cursor-pointer">
                      Include iOS Platform
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`border ${formData.platform.android ? "border-primary" : "border-muted"} transition-all`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Android</CardTitle>
                    {formData.platform.android && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <CardDescription>Google Android phones and tablets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="android"
                      checked={formData.platform.android}
                      onCheckedChange={(checked) => handleCheckboxChange("platform", "android", checked as boolean)}
                    />
                    <Label htmlFor="android" className="cursor-pointer">
                      Include Android Platform
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border ${formData.platform.web ? "border-primary" : "border-muted"} transition-all`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Web</CardTitle>
                    {formData.platform.web && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <CardDescription>Browser-based web application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="web"
                      checked={formData.platform.web}
                      onCheckedChange={(checked) => handleCheckboxChange("platform", "web", checked as boolean)}
                    />
                    <Label htmlFor="web" className="cursor-pointer">
                      Include Web Platform
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="bg-muted/50 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Platform Selection</AlertTitle>
              <AlertDescription>
                Each additional platform increases development time and cost. The first platform is included in your
                base cost, and each additional platform adds approximately 2 weeks to the timeline and 2,000 {currency}{" "}
                to the cost.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "payment-details":
        return (
          <div className="space-y-6">
            <Card className="border border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payment Method</CardTitle>
                <CardDescription>Select how you'd like the client to pay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.paymentType}
                  onValueChange={(value: "invoice" | "escrow") => handlePaymentTypeChange(value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div
                    className={`border rounded-md p-4 transition-all ${
                      formData.paymentType === "invoice"
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    } cursor-pointer`}
                    onClick={() => handlePaymentTypeChange("invoice")}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="invoice" id="invoice" className="mt-1" />
                      <div>
                        <Label htmlFor="invoice" className="flex items-center gap-2 cursor-pointer font-medium">
                          Invoice billing
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Client gets invoiced regularly, based on a fixed fee or hours worked. Ideal for existing
                          relationships.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-md p-4 transition-all ${
                      formData.paymentType === "escrow"
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    } cursor-pointer`}
                    onClick={() => handlePaymentTypeChange("escrow")}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="escrow" id="escrow" className="mt-1" />
                      <div>
                        <Label htmlFor="escrow" className="flex items-center gap-2 cursor-pointer font-medium">
                          Escrow payments
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Client pays upfront with funds held until milestone or project completion. Perfect for new
                          relationships.
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {formData.paymentType === "invoice" && (
                  <div className="space-y-4 pt-4">
                    <h4 className="text-base font-medium">Invoice Details</h4>
                    <RadioGroup
                      value={formData.paymentStructure}
                      onValueChange={(value: "fixed" | "hourly") =>
                        handlePaymentStructureChange(value as "fixed" | "hourly")
                      }
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      <div
                        className={`border rounded-md p-3 transition-all ${
                          formData.paymentStructure === "fixed"
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        } cursor-pointer`}
                        onClick={() => handlePaymentStructureChange("fixed")}
                      >
                        <div className="flex items-start gap-2">
                          <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
                          <div>
                            <Label htmlFor="fixed" className="cursor-pointer font-medium">
                              Fixed payments
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Regular payments of a fixed amount on a set schedule
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border rounded-md p-3 transition-all ${
                          formData.paymentStructure === "hourly"
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        } cursor-pointer`}
                        onClick={() => handlePaymentStructureChange("hourly")}
                      >
                        <div className="flex items-start gap-2">
                          <RadioGroupItem value="hourly" id="hourly" className="mt-1" />
                          <div>
                            <Label htmlFor="hourly" className="cursor-pointer font-medium">
                              Hourly payments
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Payments based on hours worked and submitted
                            </p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    <Alert className="bg-amber-50 border-amber-200">
                      <LightbulbIcon className="h-4 w-4 text-amber-500" />
                      <AlertTitle>Please review before proceeding:</AlertTitle>
                      <AlertDescription className="text-sm">
                        For invoice billing projects with hourly submissions, clients will be billed for hours worked.
                        This means that{" "}
                        <span className="font-medium">funds are not secured upfront and are instead paid once</span> the
                        freelancer submits hours for work completed. For new relationships, we recommend considering an
                        escrow project instead, where funds are held in escrow and paid out at the end of the project.{" "}
                        <Button
                          variant="link"
                          className="h-auto p-0 text-primary"
                          onClick={() => handlePaymentTypeChange("escrow")}
                        >
                          Switch to an escrow project.
                        </Button>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Payment Frequency</Label>
                        <select
                          id="frequency"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.invoiceBilling.frequency}
                          onChange={(e) =>
                            handleInvoiceBillingUpdate({
                              ...formData.invoiceBilling,
                              frequency: e.target.value as "weekly" | "biweekly" | "monthly",
                            })
                          }
                        >
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fixedAmount">Fixed Amount (per payment)</Label>
                        <div className="flex items-center">
                          <span className="mr-2">{currency}</span>
                          <Input
                            id="fixedAmount"
                            type="number"
                            value={formData.invoiceBilling.fixedAmount}
                            onChange={(e) =>
                              handleInvoiceBillingUpdate({
                                ...formData.invoiceBilling,
                                fixedAmount: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentType === "escrow" && (
                  <div className="space-y-4 pt-4">
                    <h4 className="text-base font-medium">Escrow Structure</h4>
                    <RadioGroup
                      value={formData.paymentStructure}
                      onValueChange={(value: "milestone" | "onetime") =>
                        handlePaymentStructureChange(value as "milestone" | "onetime")
                      }
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      <div
                        className={`border rounded-md p-3 transition-all ${
                          formData.paymentStructure === "milestone"
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        } cursor-pointer`}
                        onClick={() => handlePaymentStructureChange("milestone")}
                      >
                        <div className="flex items-start gap-2">
                          <RadioGroupItem value="milestone" id="milestone" className="mt-1" />
                          <div>
                            <Label htmlFor="milestone" className="cursor-pointer font-medium">
                              Milestone payments
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Break the project into milestones with separate payments
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border rounded-md p-3 transition-all ${
                          formData.paymentStructure === "onetime"
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        } cursor-pointer`}
                        onClick={() => handlePaymentStructureChange("onetime")}
                      >
                        <div className="flex items-start gap-2">
                          <RadioGroupItem value="onetime" id="onetime" className="mt-1" />
                          <div>
                            <Label htmlFor="onetime" className="cursor-pointer font-medium">
                              One-time payment
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Single payment for the entire project</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tax Information</CardTitle>
                <CardDescription>Add tax details if applicable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.includeTax ? "yes" : "no"}
                  onValueChange={(value) => handleTaxInclusionChange(value === "yes")}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div
                    className={`border rounded-md p-3 transition-all ${
                      formData.includeTax ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                    } cursor-pointer`}
                    onClick={() => handleTaxInclusionChange(true)}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="yes" id="tax-yes" className="mt-1" />
                      <div>
                        <Label htmlFor="tax-yes" className="cursor-pointer font-medium">
                          Yes
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Add tax to invoices</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-md p-3 transition-all ${
                      !formData.includeTax ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                    } cursor-pointer`}
                    onClick={() => handleTaxInclusionChange(false)}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="no" id="tax-no" className="mt-1" />
                      <div>
                        <Label htmlFor="tax-no" className="cursor-pointer font-medium">
                          No
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">No tax will be added</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {formData.includeTax && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="taxType">Tax Type</Label>
                      <select
                        id="taxType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.taxType}
                        onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
                      >
                        <option value="">Select tax type</option>
                        <option value="VAT">VAT</option>
                        <option value="GST">GST</option>
                        <option value="HST">HST</option>
                        <option value="PST">PST</option>
                        <option value="Sales Tax">Sales Tax</option>
                      </select>
                      <p className="text-xs text-muted-foreground">e.g. VAT, GST, HST, PST</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">ID/account number</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        placeholder="Tax ID or account number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax rate</Label>
                      <div className="flex items-center">
                        <Input
                          id="taxRate"
                          type="number"
                          value={formData.taxRate}
                          onChange={(e) => setFormData({ ...formData, taxRate: Number.parseInt(e.target.value) || 0 })}
                          className="flex-1"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "timeline-budget":
        return (
          <div className="space-y-6">
            <DetailedCostBreakdown
              formData={formData}
              currency={currency}
              onUpdateExpedite={handleExpediteChange}
              onUpdateBudget={handleBudgetUpdate}
              onUpdateInvoiceBilling={handleInvoiceBillingUpdate}
            />

            {/* Add the payment schedule timeline */}
            <PaymentScheduleTimeline
              paymentType={formData.paymentType}
              paymentStructure={formData.paymentStructure}
              startDate={new Date()} // Use current date as start date
              timeline={finalEstimate.timeline}
              totalAmount={finalEstimate.cost}
              currency={currency}
              invoiceBilling={{
                enabled: true,
                frequency: formData.invoiceBilling.frequency,
                fixedAmount: formData.invoiceBilling.fixedAmount,
              }}
              taxRate={formData.includeTax ? formData.taxRate : 0}
            />
          </div>
        )

      case "contact":
        return (
          <div className="space-y-6">
            <Card className="border border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contact Information</CardTitle>
                <CardDescription>How we'll communicate with you about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone (optional)</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any other details you'd like to share"
                className="min-h-[80px]"
              />
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-6">
            <Card className="border border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Project Summary</CardTitle>
                <CardDescription>Review your project details before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Project Details</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {formData.projectName}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)} App
                    </p>
                    <p>
                      <span className="font-medium">Description:</span> {formData.description}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Features</h4>
                  <div className="text-sm grid grid-cols-2 gap-2">
                    {Object.entries(formData.features).map(
                      ([feature, isSelected]) =>
                        isSelected && (
                          <div key={feature} className="flex items-center">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                            <span>{feature.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Platforms</h4>
                  <div className="text-sm grid grid-cols-3 gap-2">
                    {Object.entries(formData.platform).map(
                      ([platform, isSelected]) =>
                        isSelected && (
                          <div key={platform} className="flex items-center">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                            <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Payment Details</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Payment Type:</span>{" "}
                      {formData.paymentType === "invoice" ? "Invoice Billing" : "Escrow Payments"}
                    </p>
                    <p>
                      <span className="font-medium">Payment Structure:</span>{" "}
                      {formData.paymentStructure.charAt(0).toUpperCase() + formData.paymentStructure.slice(1)}{" "}
                      {formData.paymentStructure === "fixed" || formData.paymentStructure === "hourly"
                        ? "Payments"
                        : formData.paymentStructure === "milestone"
                          ? "Payments"
                          : "Payment"}
                    </p>
                    {formData.paymentType === "invoice" && (
                      <p>
                        <span className="font-medium">Frequency:</span>{" "}
                        {formData.invoiceBilling.frequency.charAt(0).toUpperCase() +
                          formData.invoiceBilling.frequency.slice(1)}
                      </p>
                    )}
                    {formData.includeTax && (
                      <p>
                        <span className="font-medium">Tax:</span> {formData.taxRate}% {formData.taxType}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Timeline & Cost</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Estimated Timeline:</span> {finalEstimate.timeline} weeks
                    </p>
                    <p>
                      <span className="font-medium">Total Cost:</span> {finalEstimate.cost} {currency}
                    </p>
                  </div>
                </div>
                {formData.invoiceBilling.enabled && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Invoice Billing</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Frequency:</span>{" "}
                          {formData.invoiceBilling.frequency.charAt(0).toUpperCase() +
                            formData.invoiceBilling.frequency.slice(1)}
                        </p>
                        <p>
                          <span className="font-medium">Fixed Amount:</span> {formData.invoiceBilling.fixedAmount}{" "}
                          {currency}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {formData.contactName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {formData.contactEmail}
                    </p>
                    {formData.contactPhone && (
                      <p>
                        <span className="font-medium">Phone:</span> {formData.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Payment</h4>
                  <div className="text-sm">
                    <p>
                      Your wallet balance: {balance} {currency}
                    </p>
                    {balance < finalEstimate.cost ? (
                      <p className="text-red-500 mt-1">
                        Insufficient funds. You need {finalEstimate.cost - balance} {currency} more.
                      </p>
                    ) : (
                      <p className="text-green-500 mt-1">You have sufficient funds for this order.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add the payment schedule timeline */}
            <PaymentScheduleTimeline
              paymentType={formData.paymentType}
              paymentStructure={formData.paymentStructure}
              startDate={new Date()} // Use current date as start date
              timeline={finalEstimate.timeline}
              totalAmount={finalEstimate.cost}
              currency={currency}
              invoiceBilling={{
                enabled: true,
                frequency: formData.invoiceBilling.frequency,
                fixedAmount: formData.invoiceBilling.fixedAmount,
              }}
              taxRate={formData.includeTax ? formData.taxRate : 0}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span>{steps[currentStepIndex].title}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step header */}
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {steps[currentStepIndex].icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{steps[currentStepIndex].title}</h2>
          <p className="text-muted-foreground">{steps[currentStepIndex].description}</p>
        </div>
      </div>

      {/* Step content */}
      <div>{renderStepContent()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          {currentStepIndex < steps.length - 1 ? (
            <Button onClick={goToNextStep} disabled={!isCurrentStepValid()} className="flex items-center gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentStepValid() || isSubmitting}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Submit Order
            </Button>
          )}
        </div>
      </div>

      {/* Step indicators */}
      <div className="hidden md:flex justify-center gap-2 pt-4">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => goToStep(index)}
            className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              index === currentStepIndex
                ? "text-primary"
                : index < currentStepIndex
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
            }`}
            disabled={index > currentStepIndex}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                index === currentStepIndex
                  ? "bg-primary"
                  : index < currentStepIndex
                    ? "bg-primary/50"
                    : "bg-muted-foreground/30"
              }`}
            />
            <span className="text-xs">{step.title}</span>
          </button>
        ))}
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={orderConfirmationOpen} onOpenChange={setOrderConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription>Please review your order details before submitting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Project Details</h4>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Name:</span> {formData.projectName}
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)} App
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Timeline & Cost</h4>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Estimated Timeline:</span> {finalEstimate.timeline} weeks
                </p>
                <p>
                  <span className="font-medium">Total Cost:</span> {finalEstimate.cost} {currency}
                </p>
              </div>
            </div>
            {formData.invoiceBilling.enabled && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Invoice Billing</h4>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Frequency:</span>{" "}
                      {formData.invoiceBilling.frequency.charAt(0).toUpperCase() +
                        formData.invoiceBilling.frequency.slice(1)}
                    </p>
                    <p>
                      <span className="font-medium">Fixed Amount:</span> {formData.invoiceBilling.fixedAmount}{" "}
                      {currency}
                    </p>
                  </div>
                </div>
              </>
            )}
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Payment</h4>
              <div className="text-sm">
                <p>
                  Your wallet balance: {balance} {currency}
                </p>
                {balance < finalEstimate.cost ? (
                  <p className="text-red-500 mt-1">
                    Insufficient funds. You need {finalEstimate.cost - balance} {currency} more.
                  </p>
                ) : (
                  <p className="text-green-500 mt-1">You have sufficient funds for this order.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderConfirmationOpen(false)}>
              Go Back
            </Button>
            <Button onClick={confirmOrderSubmission} disabled={balance < finalEstimate.cost || isSubmitting}>
              <CreditCard className="mr-2 h-4 w-4" />
              {balance < finalEstimate.cost ? "Add Funds" : isSubmitting ? "Processing..." : "Confirm & Pay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
