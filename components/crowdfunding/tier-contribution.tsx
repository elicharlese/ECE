"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Info, Star, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MatcapCard } from "@/components/3d/MatcapCard"

interface TierBenefit {
  id: string
  description: string
  highlighted?: boolean
}

interface Tier {
  id: string
  name: string
  amount: number
  description: string
  benefits: TierBenefit[]
  popular?: boolean
  color?: string
  shape?: "cube" | "rounded" | "cylinder" | "torus" | "sphere"
  maxContributors?: number
  currentContributors?: number
}

interface TierContributionProps {
  projectId: string | number
  projectTitle: string
  tiers?: Tier[]
  onContribute?: (tierId: string, amount: number) => void
}

const defaultTiers: Tier[] = [
  {
    id: "seed",
    name: "Seed Investor",
    amount: 100,
    description: "Get early access and basic benefits",
    color: "#0e5f59",
    shape: "sphere",
    benefits: [
      { id: "1", description: "Early access to the platform" },
      { id: "2", description: "Name in credits" },
      { id: "3", description: "Exclusive updates" },
      { id: "4", description: "Digital certificate of contribution" },
    ],
  },
  {
    id: "growth",
    name: "Growth Investor",
    amount: 500,
    description: "Enhanced benefits and token allocation",
    popular: true,
    color: "#0e5f59",
    shape: "cylinder",
    benefits: [
      { id: "1", description: "All Seed Investor benefits", highlighted: true },
      { id: "2", description: "500 ECE tokens allocation" },
      { id: "3", description: "Quarterly team calls" },
      { id: "4", description: "Premium features access" },
      { id: "5", description: "Voting rights on minor features" },
    ],
  },
  {
    id: "venture",
    name: "Venture Investor",
    amount: 2500,
    description: "Premium benefits with governance rights",
    color: "#0e5f59",
    shape: "torus",
    benefits: [
      { id: "1", description: "All Growth Investor benefits", highlighted: true },
      { id: "2", description: "3000 ECE tokens allocation" },
      { id: "3", description: "Monthly team calls" },
      { id: "4", description: "Governance rights" },
      { id: "5", description: "Custom feature request" },
      { id: "6", description: "Limited edition NFT" },
    ],
    maxContributors: 20,
    currentContributors: 8,
  },
  {
    id: "angel",
    name: "Angel Investor",
    amount: 10000,
    description: "Strategic partner with executive benefits",
    color: "#0e5f59",
    shape: "cube",
    benefits: [
      { id: "1", description: "All Venture Investor benefits", highlighted: true },
      { id: "2", description: "15000 ECE tokens allocation" },
      { id: "3", description: "Direct access to founding team" },
      { id: "4", description: "Advisory board position" },
      { id: "5", description: "Early access to future projects" },
      { id: "6", description: "Revenue sharing opportunities" },
      { id: "7", description: "Exclusive in-person events" },
    ],
    maxContributors: 5,
    currentContributors: 2,
  },
]

export function TierContribution({
  projectId,
  projectTitle,
  tiers = defaultTiers,
  onContribute,
}: TierContributionProps) {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [customAmount, setCustomAmount] = useState<number | "">("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet")
  const { toast } = useToast()

  const handleSelectTier = (tier: Tier) => {
    setSelectedTier(tier)
    setCustomAmount(tier.amount)
    setIsDialogOpen(true)
  }

  const handleContribute = () => {
    if (!selectedTier || !customAmount) return

    // In a real app, this would process the payment
    // For now, we'll just show a toast and call the onContribute callback
    toast({
      title: "Contribution successful!",
      description: `You've contributed ${customAmount} ECE to ${projectTitle} as a ${selectedTier.name}.`,
    })

    if (onContribute) {
      onContribute(selectedTier.id, typeof customAmount === "string" ? Number.parseInt(customAmount) : customAmount)
    }

    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Become an Investor</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your investment tier and contribute to the future of blockchain innovation. Each tier comes with unique
          benefits and rewards.
        </p>
      </div>

      <Tabs defaultValue="tiers" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="tiers">Investment Tiers</TabsTrigger>
          <TabsTrigger value="custom">Custom Amount</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative overflow-hidden transition-all hover:shadow-md ${
                  tier.popular ? "border-primary/50 shadow-md" : "border-border"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" /> Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-0">
                  <div className="h-24 -mx-6 -mt-6 mb-4 bg-muted/30 flex items-center justify-center">
                    <MatcapCard
                      title={tier.name}
                      shape={tier.shape || "sphere"}
                      color={tier.color || "#0e5f59"}
                      width="100%"
                      height="100%"
                      rotationSpeed={0.002}
                    />
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="mb-4">
                    <p className="text-3xl font-bold">
                      {tier.amount} <span className="text-lg font-normal text-muted-foreground">ECE</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <div
                        key={benefit.id}
                        className={`flex items-start gap-2 ${benefit.highlighted ? "text-primary font-medium" : ""}`}
                      >
                        <Check className={`h-4 w-4 mt-1 ${benefit.highlighted ? "text-primary" : "text-green-500"}`} />
                        <span className="text-sm">{benefit.description}</span>
                      </div>
                    ))}
                  </div>

                  {tier.maxContributors && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Limited: {tier.currentContributors} of {tier.maxContributors} spots taken
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${tier.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    onClick={() => handleSelectTier(tier)}
                  >
                    <span className="flex items-center">
                      {tier.popular && <Zap className="mr-2 h-4 w-4" />}
                      Select Tier
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Custom Contribution</CardTitle>
              <CardDescription>
                Enter your own contribution amount and receive benefits proportional to your investment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Contribution Amount (ECE)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    min={10}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value === "" ? "" : Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">You'll receive:</p>
                  <div className="space-y-2 text-sm">
                    {customAmount && typeof customAmount === "number" && (
                      <>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 mt-0.5 text-green-500" />
                          <span>
                            {customAmount >= 10000
                              ? "Angel Investor benefits"
                              : customAmount >= 2500
                                ? "Venture Investor benefits"
                                : customAmount >= 500
                                  ? "Growth Investor benefits"
                                  : customAmount >= 100
                                    ? "Seed Investor benefits"
                                    : "Basic supporter benefits"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 mt-0.5 text-green-500" />
                          <span>
                            {customAmount >= 100
                              ? `${Math.floor(customAmount * 2)} ECE tokens allocation`
                              : "Digital certificate of contribution"}
                          </span>
                        </div>
                        {customAmount >= 500 && (
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>Quarterly team calls</span>
                          </div>
                        )}
                        {customAmount >= 2500 && (
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>Governance rights</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  if (!customAmount) {
                    toast({
                      title: "Please enter an amount",
                      description: "You need to enter a contribution amount.",
                      variant: "destructive",
                    })
                    return
                  }

                  // Find the appropriate tier based on the custom amount
                  let appropriateTier = tiers[0]
                  for (let i = tiers.length - 1; i >= 0; i--) {
                    if (typeof customAmount === "number" && customAmount >= tiers[i].amount) {
                      appropriateTier = tiers[i]
                      break
                    }
                  }

                  setSelectedTier(appropriateTier)
                  setIsDialogOpen(true)
                }}
                disabled={!customAmount}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Contribution</DialogTitle>
            <DialogDescription>
              You're contributing to {projectTitle} as a {selectedTier?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contribution-amount">Contribution Amount</Label>
              <Input
                id="contribution-amount"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value === "" ? "" : Number.parseInt(e.target.value))}
                min={selectedTier?.amount || 10}
              />
              {selectedTier && typeof customAmount === "number" && customAmount < selectedTier.amount && (
                <p className="text-xs text-red-500">Amount must be at least {selectedTier.amount} ECE for this tier.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={paymentMethod === "wallet" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                    Crypto Wallet
                  </span>
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setPaymentMethod("card")}
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    Credit Card
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleContribute}
              disabled={
                !selectedTier ||
                !customAmount ||
                (typeof customAmount === "number" && customAmount < (selectedTier?.amount || 0))
              }
            >
              Complete Contribution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
