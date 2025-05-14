"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, HelpCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductPricingTiersProps {
  productId: string
  productName: string
  basePrice: number
  onSelectTier: (tier: string, price: number) => void
}

interface PricingFeature {
  name: string
  basic: boolean | string
  professional: boolean | string
  enterprise: boolean | string
  tooltip?: string
}

export function ProductPricingTiers({ productId, productName, basePrice, onSelectTier }: ProductPricingTiersProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual")
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  // Calculate prices based on base price
  const prices = {
    basic: {
      monthly: basePrice,
      annual: basePrice * 10, // 2 months free
    },
    professional: {
      monthly: basePrice * 2.5,
      annual: basePrice * 2.5 * 10,
    },
    enterprise: {
      monthly: basePrice * 5,
      annual: basePrice * 5 * 10,
    },
  }

  const discount = billingCycle === "annual" ? 16.7 : 0 // ~2 months free

  const features: PricingFeature[] = [
    {
      name: "Number of Projects",
      basic: "1",
      professional: "5",
      enterprise: "Unlimited",
      tooltip: "The number of distinct projects where you can use this product",
    },
    {
      name: "Team Members",
      basic: "2",
      professional: "10",
      enterprise: "Unlimited",
      tooltip: "Number of developers who can work with the product",
    },
    {
      name: "Updates & Support",
      basic: "12 months",
      professional: "24 months",
      enterprise: "36 months",
      tooltip: "Duration of updates and technical support",
    },
    {
      name: "Source Code Access",
      basic: true,
      professional: true,
      enterprise: true,
      tooltip: "Access to the product's source code for customization",
    },
    {
      name: "White Labeling",
      basic: false,
      professional: true,
      enterprise: true,
      tooltip: "Ability to remove branding and add your own",
    },
    {
      name: "Priority Support",
      basic: false,
      professional: true,
      enterprise: true,
      tooltip: "Faster response times for support requests",
    },
    {
      name: "SLA Guarantee",
      basic: false,
      professional: false,
      enterprise: true,
      tooltip: "Service Level Agreement with guaranteed response times",
    },
    {
      name: "Custom Integration",
      basic: false,
      professional: false,
      enterprise: true,
      tooltip: "Custom integration services with your existing systems",
    },
    {
      name: "Deployment Assistance",
      basic: false,
      professional: false,
      enterprise: true,
      tooltip: "Assistance with deploying the product in your environment",
    },
  ]

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier)
    const price =
      tier === "basic"
        ? prices.basic[billingCycle]
        : tier === "professional"
          ? prices.professional[billingCycle]
          : prices.enterprise[billingCycle]
    onSelectTier(tier, price)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-3xl font-bold text-center">Choose Your License</h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          Select the license tier that best fits your needs. All licenses include the core product functionality.
        </p>

        <Tabs
          defaultValue="annual"
          value={billingCycle}
          onValueChange={(value) => setBillingCycle(value as "monthly" | "annual")}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">
                <span>Monthly</span>
              </TabsTrigger>
              <TabsTrigger value="annual">
                <span>
                  Annual <Badge className="ml-2 bg-green-600">Save {discount}%</Badge>
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Tier */}
        <Card
          className={`border-2 transition-all ${selectedTier === "basic" ? "border-primary shadow-lg" : "border-border"}`}
        >
          <CardHeader>
            <CardTitle className="text-xl flex justify-between items-center">
              <span>Basic</span>
              <Badge variant="outline">Starter</Badge>
            </CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                ${(prices.basic[billingCycle] / (billingCycle === "annual" ? 12 : 1)).toFixed(2)}
              </span>
              <span className="text-muted-foreground ml-1">/ month</span>
              {billingCycle === "annual" && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed annually (${prices.basic[billingCycle].toFixed(2)})
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Perfect for individual developers or small projects.</p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.basic ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <span className="h-5 w-5 border border-muted rounded-full mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={feature.basic ? "" : "text-muted-foreground"}>
                    {feature.name}
                    {typeof feature.basic === "string" && feature.basic !== "true" && (
                      <span className="font-medium ml-1">: {feature.basic}</span>
                    )}
                  </span>
                  {feature.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <HelpCircle className="h-4 w-4 text-muted-foreground inline" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={selectedTier === "basic" ? "default" : "outline"}
              onClick={() => handleSelectTier("basic")}
            >
              <span>{selectedTier === "basic" ? "Selected" : "Select Basic"}</span>
            </Button>
          </CardFooter>
        </Card>

        {/* Professional Tier */}
        <Card
          className={`border-2 transition-all ${selectedTier === "professional" ? "border-primary shadow-lg" : "border-border"}`}
        >
          <CardHeader>
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <Badge className="bg-primary px-3 py-1">Most Popular</Badge>
            </div>
            <CardTitle className="text-xl flex justify-between items-center">
              <span>Professional</span>
              <Badge variant="outline">Team</Badge>
            </CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                ${(prices.professional[billingCycle] / (billingCycle === "annual" ? 12 : 1)).toFixed(2)}
              </span>
              <span className="text-muted-foreground ml-1">/ month</span>
              {billingCycle === "annual" && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed annually (${prices.professional[billingCycle].toFixed(2)})
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Ideal for growing teams and multiple projects.</p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.professional ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <span className="h-5 w-5 border border-muted rounded-full mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={feature.professional ? "" : "text-muted-foreground"}>
                    {feature.name}
                    {typeof feature.professional === "string" && feature.professional !== "true" && (
                      <span className="font-medium ml-1">: {feature.professional}</span>
                    )}
                  </span>
                  {feature.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <HelpCircle className="h-4 w-4 text-muted-foreground inline" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={selectedTier === "professional" ? "default" : "outline"}
              onClick={() => handleSelectTier("professional")}
            >
              <span>{selectedTier === "professional" ? "Selected" : "Select Professional"}</span>
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Tier */}
        <Card
          className={`border-2 transition-all ${selectedTier === "enterprise" ? "border-primary shadow-lg" : "border-border"}`}
        >
          <CardHeader>
            <CardTitle className="text-xl flex justify-between items-center">
              <span>Enterprise</span>
              <Badge variant="outline">Organization</Badge>
            </CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                ${(prices.enterprise[billingCycle] / (billingCycle === "annual" ? 12 : 1)).toFixed(2)}
              </span>
              <span className="text-muted-foreground ml-1">/ month</span>
              {billingCycle === "annual" && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed annually (${prices.enterprise[billingCycle].toFixed(2)})
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Complete solution for large organizations.</p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.enterprise ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <span className="h-5 w-5 border border-muted rounded-full mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={feature.enterprise ? "" : "text-muted-foreground"}>
                    {feature.name}
                    {typeof feature.enterprise === "string" && feature.enterprise !== "true" && (
                      <span className="font-medium ml-1">: {feature.enterprise}</span>
                    )}
                  </span>
                  {feature.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <HelpCircle className="h-4 w-4 text-muted-foreground inline" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={selectedTier === "enterprise" ? "default" : "outline"}
              onClick={() => handleSelectTier("enterprise")}
            >
              <span>{selectedTier === "enterprise" ? "Selected" : "Select Enterprise"}</span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8">
        <div className="flex items-start">
          <Info className="h-5 w-5 mr-3 mt-0.5 text-blue-500" />
          <div>
            <h3 className="font-medium mb-1">Need a custom solution?</h3>
            <p className="text-muted-foreground mb-4">
              For specialized requirements or volume licensing, our team can create a tailored solution for your
              organization.
            </p>
            <Button variant="outline">
              <span>Contact Sales</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
