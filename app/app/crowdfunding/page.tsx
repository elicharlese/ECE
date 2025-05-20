"use client"

import { useState, useEffect } from "react"
import type { BettingProject } from "@/components/crowdfunding/betting-project-card"
import { BettingSlip } from "@/components/crowdfunding/betting-slip"
import { FilterTags } from "@/components/crowdfunding/filter-tags"
import { VerticalProjectCard } from "@/components/crowdfunding/vertical-project-card"
import { BettingStyleLayout } from "@/components/crowdfunding/betting-style-layout"
import { BettingThemeToggle } from "@/components/theme/betting-theme-toggle"
import { LiveUpdatesTicker } from "@/components/crowdfunding/live-updates-ticker"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Receipt, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock project data
const mockProjects = [
  {
    id: 1,
    title: "Decentralized Identity Solution",
    description:
      "A blockchain-based identity verification system with privacy-preserving features and integration with existing systems.",
    image: "/images/projects/identity-solution.png",
    category: "Infrastructure",
    raised: 35000,
    goal: 50000,
    backers: 78,
    daysLeft: 12,
    trending: true,
    hot: false,
    endingSoon: false,
    odds: "+175",
    potentialReturn: 175,
  },
  {
    id: 2,
    title: "Cross-Chain DeFi Protocol",
    description:
      "An interoperable DeFi protocol enabling seamless asset transfers and interactions across multiple blockchains.",
    image: "/images/projects/defi-protocol.png",
    category: "DeFi",
    raised: 67500,
    goal: 80000,
    backers: 142,
    daysLeft: 21,
    trending: false,
    hot: true,
    endingSoon: false,
    odds: "+320",
    potentialReturn: 320,
  },
  {
    id: 3,
    title: "NFT Gaming Platform",
    description:
      "A gaming platform where players can earn, trade, and utilize NFTs across multiple game worlds and ecosystems.",
    image: "/images/projects/nft-gaming.png",
    category: "Gaming",
    raised: 54000,
    goal: 75000,
    backers: 95,
    daysLeft: 18,
    trending: true,
    hot: false,
    endingSoon: false,
    odds: "+210",
    potentialReturn: 210,
  },
  {
    id: 4,
    title: "Zero-Knowledge Privacy Solution",
    description: "A zero-knowledge proof system enabling private transactions and computations on public blockchains.",
    image: "/images/projects/zero-knowledge.png",
    category: "Privacy",
    raised: 88000,
    goal: 120000,
    backers: 113,
    daysLeft: 5,
    trending: false,
    hot: false,
    endingSoon: true,
    odds: "+145",
    potentialReturn: 145,
  },
  {
    id: 5,
    title: "Decentralized Storage Network",
    description:
      "A distributed storage solution with enhanced security, redundancy, and resilience against censorship.",
    image: "/images/projects/decentralized-storage.png",
    category: "Infrastructure",
    raised: 42000,
    goal: 100000,
    backers: 64,
    daysLeft: 25,
    trending: false,
    hot: false,
    endingSoon: false,
    odds: "+250",
    potentialReturn: 250,
  },
  {
    id: 6,
    title: "Blockchain Social Media",
    description:
      "A decentralized social media platform with user data ownership, content monetization, and censorship resistance.",
    image: "/images/projects/blockchain-social.png",
    category: "Social",
    raised: 29000,
    goal: 60000,
    backers: 51,
    daysLeft: 9,
    trending: false,
    hot: true,
    endingSoon: true,
    odds: "+190",
    potentialReturn: 190,
  },
]

// Ticker updates
const tickerUpdates = [
  "DeFi Protocol just reached 85% of funding goal!",
  "Zero-Knowledge Privacy Solution has 127 new backers today",
  "NFT Gaming Platform trending with +24% in the last hour",
  "New project launched: Metaverse Integration Platform",
  "Blockchain Social Media featured in Crypto Weekly Newsletter",
  "Decentralized Identity Solution milestone reached: KYC Integration",
]

export default function CrowdfundingBettingPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [bettingSlip, setBettingSlip] = useState<BettingProject[]>([])
  const [filters, setFilters] = useState<any>({})
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const { toast } = useToast()

  // Reset current project index when projects change
  useEffect(() => {
    setCurrentProjectIndex(0)
  }, [projects])

  // Add a project to betting slip
  const addToBettingSlip = (bet: BettingProject) => {
    // Check if already in slip
    const existing = bettingSlip.find((b) => b.id === bet.id)

    if (existing) {
      // Update existing bet
      setBettingSlip(bettingSlip.map((b) => (b.id === bet.id ? { ...b, amount: bet.amount } : b)))
    } else {
      // Add new bet
      setBettingSlip([...bettingSlip, bet])
    }

    toast({
      title: "Added to betting slip",
      description: `${bet.title} added with ${bet.amount} ECE`,
    })

    // Open the sheet when adding a new bet
    setSheetOpen(true)
  }

  // Remove a project from betting slip
  const removeFromBettingSlip = (id: number) => {
    setBettingSlip(bettingSlip.filter((bet) => bet.id !== id))
  }

  // Clear betting slip
  const clearBettingSlip = () => {
    setBettingSlip([])
  }

  // Place all bets
  const placeBets = () => {
    // In a real app, this would call APIs to place the bets
    // For now, we just clear the slip
    toast({
      title: "Bets placed successfully!",
      description: `${bettingSlip.length} bets have been placed`,
      variant: "success",
    })
    clearBettingSlip()
    setSheetOpen(false)
  }

  // Apply filters
  const applyFilters = (newFilters: any) => {
    setFilters(newFilters)

    // Filter projects based on the criteria
    let filtered = [...mockProjects]

    if (newFilters.search) {
      const search = newFilters.search.toLowerCase()
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
      )
    }

    if (newFilters.categories && newFilters.categories.length > 0) {
      filtered = filtered.filter((p) => newFilters.categories.includes(p.category))
    }

    if (newFilters.trending) {
      filtered = filtered.filter((p) => p.trending)
    }

    if (newFilters.hot) {
      filtered = filtered.filter((p) => p.hot)
    }

    if (newFilters.endingSoon) {
      filtered = filtered.filter((p) => p.endingSoon)
    }

    if (newFilters.returnRange) {
      filtered = filtered.filter(
        (p) => p.potentialReturn >= newFilters.returnRange[0] && p.potentialReturn <= newFilters.returnRange[1],
      )
    }

    setProjects(filtered)
  }

  const nextProject = () => {
    if (currentProjectIndex < projects.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1)
    }
  }

  const prevProject = () => {
    if (currentProjectIndex > 0) {
      setCurrentProjectIndex(currentProjectIndex - 1)
    }
  }

  const currentProject = projects[currentProjectIndex]

  return (
    <BettingStyleLayout className="min-h-screen">
      <div className="flex flex-col h-screen max-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-border/30">
          <h1 className="text-2xl font-bold tracking-tight">Project Betting</h1>
          <div className="flex items-center gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Receipt className="h-5 w-5" />
                  {bettingSlip.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {bettingSlip.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <BettingSlip
                      bets={bettingSlip}
                      onRemoveBet={removeFromBettingSlip}
                      onClearSlip={clearBettingSlip}
                      onPlaceBets={placeBets}
                      className="h-auto border-none shadow-none"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <BettingThemeToggle />
          </div>
        </div>

        <LiveUpdatesTicker updates={tickerUpdates} />

        <div className="p-4 border-b border-border/30">
          <FilterTags onFilter={applyFilters} activeFilters={filters} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
          {projects.length > 0 ? (
            <>
              <div className="w-full max-w-2xl mx-auto">
                <VerticalProjectCard project={currentProject} onAddToBettingSlip={addToBettingSlip} />
              </div>

              <div className="flex items-center justify-between w-full max-w-2xl mt-4 px-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevProject}
                  disabled={currentProjectIndex === 0}
                  className="h-10 w-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous project</span>
                </Button>

                <div className="text-sm text-muted-foreground">
                  {currentProjectIndex + 1} of {projects.length}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextProject}
                  disabled={currentProjectIndex === projects.length - 1}
                  className="h-10 w-10"
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next project</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border/50 w-full max-w-2xl">
              <p className="text-lg text-muted-foreground">No projects match your filters</p>
              <Button variant="link" onClick={() => applyFilters({})}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </BettingStyleLayout>
  )
}
