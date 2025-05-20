"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  CreditCard,
  Info,
  Layers,
  ShoppingCart,
  CalendarClock,
  Smartphone,
  Globe,
  Settings,
  CheckCircle2,
  Lock,
  Users,
  Bell,
  BarChart,
  Palette,
  Code,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentOptionsForm from "./payment-options-form"

// Define the app template type
type AppTemplate = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  platforms: string[]
  estimatedCost: number
  estimatedTimeline: number
  popularityScore: number
}

// Define the form data structure
type OrderFormData = {
  projectName: string
  projectDescription: string
  selectedTemplate: string
  customizations: string[]
  platforms: {
    ios: boolean
    android: boolean
    web: boolean
  }
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
  timeline: {
    expediteFactor: number
  }
  contactInfo: {
    name: string
    email: string
    phone: string
  }
}

interface SimplifiedOrderFlowProps {
  onSubmit: (data: OrderFormData) => void
  currency?: string
  balance?: number
}

interface OrderStep {
  id: string
  title: string
  component: React.ReactNode
}

export default function SimplifiedOrderFlow({ onSubmit, currency = "$", balance = 10000 }: SimplifiedOrderFlowProps) {
  const [activeStep, setActiveStep] = useState("project-details")

  const steps: OrderStep[] = [
    {
      id: "project-details",
      title: "1. Project details",
      component: (
        <div className="p-6 border rounded-md">
          <h3 className="text-lg font-medium mb-4">Project details</h3>
          <p className="text-gray-500">This is where project details would go.</p>
        </div>
      ),
    },
    {
      id: "payment-details",
      title: "2. Payment details",
      component: <PaymentOptionsForm />,
    },
    {
      id: "review",
      title: "3. Review",
      component: (
        <div className="p-6 border rounded-md">
          <h3 className="text-lg font-medium mb-4">Review</h3>
          <p className="text-gray-500">This is where the review would go.</p>
        </div>
      ),
    },
  ]

  // App templates
  const appTemplates: AppTemplate[] = [
    {
      id: "ecommerce",
      name: "E-commerce App",
      description: "A complete online store with product listings, cart, and checkout",
      icon: <ShoppingCart className="h-6 w-6" />,
      features: ["authentication", "payments", "userProfiles", "notifications", "analytics", "adminDashboard"],
      platforms: ["ios", "android", "web"],
      estimatedCost: 8000,
      estimatedTimeline: 12,
      popularityScore: 95,
    },
    {
      id: "social",
      name: "Social Network",
      description: "Connect users with profiles, posts, comments, and messaging",
      icon: <Users className="h-6 w-6" />,
      features: ["authentication", "userProfiles", "notifications", "analytics"],
      platforms: ["ios", "android", "web"],
      estimatedCost: 7500,
      estimatedTimeline: 10,
      popularityScore: 90,
    },
    {
      id: "content",
      name: "Content Platform",
      description: "Share and monetize media content like videos, images, or articles",
      icon: <Layers className="h-6 w-6" />,
      features: ["authentication", "userProfiles", "notifications", "analytics", "payments"],
      platforms: ["ios", "android", "web"],
      estimatedCost: 7000,
      estimatedTimeline: 10,
      popularityScore: 85,
    },
    {
      id: "productivity",
      name: "Productivity Tool",
      description: "Help users organize tasks, notes, and collaborate with others",
      icon: <CheckCircle className="h-6 w-6" />,
      features: ["authentication", "userProfiles", "notifications"],
      platforms: ["ios", "android", "web"],
      estimatedCost: 6000,
      estimatedTimeline: 8,
      popularityScore: 80,
    },
    {
      id: "custom",
      name: "Custom App",
      description: "Build a completely custom application tailored to your needs",
      icon: <Settings className="h-6 w-6" />,
      features: [],
      platforms: [],
      estimatedCost: 5000,
      estimatedTimeline: 8,
      popularityScore: 75,
    },
  ]

  // Initialize form data
  const [formData, setFormData] = useState<OrderFormData>({
    projectName: "",
    projectDescription: "",
    selectedTemplate: "",
    customizations: [],
    platforms: {
      ios: false,
      android: false,
      web: false,
    },
    features: {
      authentication: false,
      payments: false,
      userProfiles: false,
      notifications: false,
      analytics: false,
      adminDashboard: false,
      customDesign: false,
      apiIntegration: false,
    },
    timeline: {
      expediteFactor: 0,
    },
    contactInfo: {
      name: "",
      email: "",
      phone: "",
    },
  })

  // State for current step
  const [currentStep, setCurrentStep] = useState<"template" | "details" | "features" | "review">("template")
  const [orderConfirmationOpen, setOrderConfirmationOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate progress percentage
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "template":
        return 25
      case "details":
        return 50
      case "features":
        return 75
      case "review":
        return 100
      default:
        return 0
    }
  }

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = appTemplates.find((t) => t.id === templateId)

    if (template) {
      // Update platforms based on template
      const platforms = {
        ios: template.platforms.includes("ios"),
        android: template.platforms.includes("android"),
        web: template.platforms.includes("web"),
      }

      // Update features based on template
      const features = {
        authentication: template.features.includes("authentication"),
        payments: template.features.includes("payments"),
        userProfiles: template.features.includes("userProfiles"),
        notifications: template.features.includes("notifications"),
        analytics: template.features.includes("analytics"),
        adminDashboard: template.features.includes("adminDashboard"),
        customDesign: false,
        apiIntegration: false,
      }

      setFormData({
        ...formData,
        selectedTemplate: templateId,
        platforms,
        features,
      })
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof OrderFormData],
          [field]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (section: "platforms" | "features", name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: checked,
      },
    })
  }

  // Handle expedite factor change
  const handleExpediteChange = (value: number[]) => {
    setFormData({
      ...formData,
      timeline: {
        ...formData.timeline,
        expediteFactor: value[0],
      },
    })
  }

  // Calculate estimated cost
  const calculateEstimatedCost = () => {
    // Start with base cost from template or default
    const selectedTemplate = appTemplates.find((t) => t.id === formData.selectedTemplate)
    let baseCost = selectedTemplate ? selectedTemplate.estimatedCost : 5000

    // Add costs for platforms
    let platformCount = 0
    if (formData.platforms.ios) platformCount++
    if (formData.platforms.android) platformCount++
    if (formData.platforms.web) platformCount++

    // First platform is included, additional platforms cost extra
    if (platformCount > 1) {
      baseCost += (platformCount - 1) * 2000
    }

    // Add costs for features not included in template
    const templateFeatures = selectedTemplate?.features || []

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
      if (isSelected && !templateFeatures.includes(feature)) {
        baseCost += featureCosts[feature as keyof typeof featureCosts]
      }
    })

    // Apply expedite factor (up to 100% increase)
    const expeditedCost = Math.round(baseCost * (1 + formData.timeline.expediteFactor / 100))

    return expeditedCost
  }

  // Calculate estimated timeline
  const calculateEstimatedTimeline = () => {
    // Start with base timeline from template or default
    const selectedTemplate = appTemplates.find((t) => t.id === formData.selectedTemplate)
    let baseTimeline = selectedTemplate ? selectedTemplate.estimatedTimeline : 8

    // Add time for platforms
    let platformCount = 0
    if (formData.platforms.ios) platformCount++
    if (formData.platforms.android) platformCount++
    if (formData.platforms.web) platformCount++

    // First platform is included, additional platforms add time
    if (platformCount > 1) {
      baseTimeline += (platformCount - 1) * 2
    }

    // Add time for features not included in template
    const templateFeatures = selectedTemplate?.features || []

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
      if (isSelected && !templateFeatures.includes(feature)) {
        baseTimeline += featureTimeAdds[feature as keyof typeof featureTimeAdds]
      }
    })

    // Apply expedite factor (up to 40% reduction)
    const expeditedTimeline = Math.max(
      Math.round(baseTimeline * (1 - (formData.timeline.expediteFactor / 100) * 0.4)),
      Math.ceil(baseTimeline * 0.6),
    )

    return expeditedTimeline
  }

  // Navigation functions
  const goToNextStep = () => {
    switch (currentStep) {
      case "template":
        setCurrentStep("details")
        break
      case "details":
        setCurrentStep("features")
        break
      case "features":
        setCurrentStep("review")
        break
      case "review":
        handleSubmit()
        break
    }
    window.scrollTo(0, 0)
  }

  const goToPreviousStep = () => {
    switch (currentStep) {
      case "details":
        setCurrentStep("template")
        break
      case "features":
        setCurrentStep("details")
        break
      case "review":
        setCurrentStep("features")
        break
    }
    window.scrollTo(0, 0)
  }

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case "template":
        return formData.selectedTemplate !== ""
      case "details":
        return (
          formData.projectName.trim() !== "" &&
          formData.projectDescription.trim() !== "" &&
          (formData.platforms.ios || formData.platforms.android || formData.platforms.web)
        )
      case "features":
        // At least one feature should be selected
        return Object.values(formData.features).some((isSelected) => isSelected)
      case "review":
        return (
          formData.contactInfo.name.trim() !== "" &&
          formData.contactInfo.email.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)
        )
      default:
        return false
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    if (isCurrentStepValid()) {
      setOrderConfirmationOpen(true)
    }
  }

  // Confirm order submission
  const confirmOrderSubmission = () => {
    setIsSubmitting(true)
    onSubmit(formData)
    setOrderConfirmationOpen(false)
  }

  // Render template selection step
  const renderTemplateStep = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.selectedTemplate === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">{template.icon}</div>
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                  </div>
                  {formData.selectedTemplate === template.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Cost</span>
                    <span className="font-medium">
                      {template.estimatedCost} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-medium">{template.estimatedTimeline} weeks</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </Badge>
                    ))}
                    {template.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Popularity</span>
                    <span>{template.popularityScore}%</span>
                  </div>
                  <Progress value={template.popularityScore} className="h-1" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Alert className="bg-muted/50 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>Choose a starting point</AlertTitle>
          <AlertDescription>
            Select a template that best matches your app idea. You'll be able to customize it in the next steps.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Render project details step
  const renderDetailsStep = () => {
    return (
      <div className="space-y-6">
        <Card className="border border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Project Details</CardTitle>
            <CardDescription>Tell us about your app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter a name for your app"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                placeholder="Describe what your app will do and who it's for"
                className="min-h-[120px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Platforms</CardTitle>
            <CardDescription>Select which platforms your app will support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.platforms.ios ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("platforms", "ios", !formData.platforms.ios)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="ios"
                    checked={formData.platforms.ios}
                    onCheckedChange={(checked) => handleCheckboxChange("platforms", "ios", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="ios" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Smartphone className="h-4 w-4" />
                      iOS
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">iPhone and iPad devices</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.platforms.android ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("platforms", "android", !formData.platforms.android)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="android"
                    checked={formData.platforms.android}
                    onCheckedChange={(checked) => handleCheckboxChange("platforms", "android", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="android" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Smartphone className="h-4 w-4" />
                      Android
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Android phones and tablets</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.platforms.web ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("platforms", "web", !formData.platforms.web)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="web"
                    checked={formData.platforms.web}
                    onCheckedChange={(checked) => handleCheckboxChange("platforms", "web", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="web" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Globe className="h-4 w-4" />
                      Web
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Browser-based web application</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="bg-muted/50 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>Platform Selection</AlertTitle>
          <AlertDescription>
            Each additional platform increases development time and cost. The first platform is included in your base
            cost, and each additional platform adds approximately 2 weeks to the timeline and 2,000 {currency} to the
            cost.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Render features step
  const renderFeaturesStep = () => {
    return (
      <div className="space-y-6">
        <Card className="border border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">App Features</CardTitle>
            <CardDescription>Select the features you want in your app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.authentication
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "authentication", !formData.features.authentication)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="authentication"
                    checked={formData.features.authentication}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("features", "authentication", checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="authentication" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Lock className="h-4 w-4" />
                      User Authentication
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Secure login and user management system</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.payments ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "payments", !formData.features.payments)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="payments"
                    checked={formData.features.payments}
                    onCheckedChange={(checked) => handleCheckboxChange("features", "payments", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="payments" className="flex items-center gap-2 cursor-pointer font-medium">
                      <CreditCard className="h-4 w-4" />
                      Payment Processing
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Integration with payment gateways</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.userProfiles
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "userProfiles", !formData.features.userProfiles)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="userProfiles"
                    checked={formData.features.userProfiles}
                    onCheckedChange={(checked) => handleCheckboxChange("features", "userProfiles", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="userProfiles" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Users className="h-4 w-4" />
                      User Profiles
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Customizable user profiles and preferences</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.notifications
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "notifications", !formData.features.notifications)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="notifications"
                    checked={formData.features.notifications}
                    onCheckedChange={(checked) => handleCheckboxChange("features", "notifications", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="notifications" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Bell className="h-4 w-4" />
                      Push Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Real-time alerts and messaging system</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.analytics ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "analytics", !formData.features.analytics)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="analytics"
                    checked={formData.features.analytics}
                    onCheckedChange={(checked) => handleCheckboxChange("features", "analytics", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="analytics" className="flex items-center gap-2 cursor-pointer font-medium">
                      <BarChart className="h-4 w-4" />
                      Analytics Dashboard
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Data visualization and reporting tools</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.adminDashboard
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "adminDashboard", !formData.features.adminDashboard)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="adminDashboard"
                    checked={formData.features.adminDashboard}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("features", "adminDashboard", checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="adminDashboard" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Settings className="h-4 w-4" />
                      Admin Dashboard
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Administrative controls and management interface
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.customDesign
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "customDesign", !formData.features.customDesign)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="customDesign"
                    checked={formData.features.customDesign}
                    onCheckedChange={(checked) => handleCheckboxChange("features", "customDesign", checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="customDesign" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Palette className="h-4 w-4" />
                      Custom UI/UX Design
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Unique visual identity and user experience</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.features.apiIntegration
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleCheckboxChange("features", "apiIntegration", !formData.features.apiIntegration)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="apiIntegration"
                    checked={formData.features.apiIntegration}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("features", "apiIntegration", checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="apiIntegration" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Code className="h-4 w-4" />
                      API Integration
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Connection with third-party services</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Development Timeline</CardTitle>
            <CardDescription>Adjust to balance timeline and cost</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Expedite Factor: {formData.timeline.expediteFactor}%</span>
              <Badge variant="outline">
                {formData.timeline.expediteFactor === 0
                  ? "Standard"
                  : formData.timeline.expediteFactor < 50
                    ? "Moderately Expedited"
                    : "Highly Expedited"}
              </Badge>
            </div>

            <Slider
              value={[formData.timeline.expediteFactor]}
              onValueChange={handleExpediteChange}
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
                  <CalendarClock className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Estimated Timeline</span>
                </div>
                <div className="text-lg font-bold">{calculateEstimatedTimeline()} weeks</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Estimated Cost</span>
                </div>
                <div className="text-lg font-bold">
                  {calculateEstimatedCost()} {currency}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render review step
  const renderReviewStep = () => {
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
                name="contactInfo.name"
                value={formData.contactInfo.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="contactInfo.email"
                type="email"
                value={formData.contactInfo.email}
                onChange={handleInputChange}
                placeholder="Your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone (optional)</Label>
              <Input
                id="contactPhone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
              />
            </div>
          </CardContent>
        </Card>

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
                  <span className="font-medium">Template:</span>{" "}
                  {appTemplates.find((t) => t.id === formData.selectedTemplate)?.name || "Custom App"}
                </p>
                <p>
                  <span className="font-medium">Description:</span> {formData.projectDescription}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Selected Platforms</h4>
              <div className="text-sm grid grid-cols-3 gap-2">
                {Object.entries(formData.platforms).map(
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
              <h4 className="font-medium">Timeline & Cost</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Estimated Timeline:</span> {calculateEstimatedTimeline()} weeks
                </p>
                <p>
                  <span className="font-medium">Expedite Factor:</span> {formData.timeline.expediteFactor}%
                </p>
                <p>
                  <span className="font-medium">Total Cost:</span> {calculateEstimatedCost()} {currency}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Payment</h4>
              <div className="text-sm">
                <p>
                  Your wallet balance: {balance} {currency}
                </p>
                {balance < calculateEstimatedCost() ? (
                  <p className="text-red-500 mt-1">
                    Insufficient funds. You need {calculateEstimatedCost() - balance} {currency} more.
                  </p>
                ) : (
                  <p className="text-green-500 mt-1">You have sufficient funds for this order.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "template":
        return renderTemplateStep()
      case "details":
        return renderDetailsStep()
      case "features":
        return renderFeaturesStep()
      case "review":
        return renderReviewStep()
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order an App</h1>

      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          {steps.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {steps.map((step) => (
          <TabsContent key={step.id} value={step.id}>
            {step.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
