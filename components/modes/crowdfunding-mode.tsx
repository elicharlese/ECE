"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/crowdfunding/project-card"
import { ProjectCardExpanded } from "@/components/crowdfunding/project-card-expanded"
import { ProjectCardGamified } from "@/components/crowdfunding/project-card-gamified"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Award, Trophy, Gift } from "lucide-react"
import { demoCrowdfundingProjects, demoCrowdfundingCategories } from "@/lib/demo-data"
import { GamificationProvider } from "@/context/gamification-context"
import { CrowdfundingGamificationProvider } from "@/context/crowdfunding-gamification-context"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CrowdfundingMode() {
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [gamificationEnabled, setGamificationEnabled] = useState(true)

  // Convert demo projects to the expected format
  const projects = demoCrowdfundingProjects.map((project) => ({
    ...project,
    creator: {
      name: project.creator,
      avatar: "/diverse-user-avatars.png",
    },
    milestones: project.milestones.map((m, index) => ({
      id: index + 1,
      title: m.title,
      description: m.description,
      date: `Q${Math.floor(index / 3) + 1} 2023`,
      completed: index === 0, // First milestone is completed
    })),
  }))

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === "all" || project.category.toLowerCase() === activeCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const handleExpandProject = (projectId: number) => {
    setExpandedProjectId(projectId)
  }

  const handleCloseExpanded = () => {
    setExpandedProjectId(null)
  }

  return (
    <CrowdfundingGamificationProvider>
      <GamificationProvider>
        <div className="container py-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Crowdfunding Projects</h1>
              <p className="text-muted-foreground">Discover and support innovative blockchain projects</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>

              <Button asChild>
                <Link href="/app/crowdfunding-rewards">
                  <Trophy className="h-4 w-4 mr-2" />
                  Gamification Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Gamification banner */}
          {gamificationEnabled && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Gamification Enabled</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn XP and unlock achievements as you explore and support projects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/crowdfunding-rewards">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setGamificationEnabled(false)}>
                  Disable
                </Button>
              </div>
            </div>
          )}

          {/* Search and categories */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-9">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="defi" className="text-xs">
                    DeFi
                  </TabsTrigger>
                  <TabsTrigger value="nft" className="text-xs">
                    NFT
                  </TabsTrigger>
                  <TabsTrigger value="gaming" className="text-xs">
                    Gaming
                  </TabsTrigger>
                  <TabsTrigger value="identity" className="text-xs">
                    Identity
                  </TabsTrigger>
                  <TabsTrigger value="infrastructure" className="text-xs">
                    Infra
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-wrap gap-2">
              {demoCrowdfundingCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className={cn(
                    "cursor-pointer",
                    activeCategory === category.id ? "bg-primary/10 text-primary border-primary/20" : "",
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Daily quests reminder */}
          {gamificationEnabled && (
            <div className="bg-muted/30 border border-border rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Daily Quests Available</h3>
                  <p className="text-xs text-muted-foreground">Complete quests to earn XP and unlock special rewards</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/app/crowdfunding-rewards">View Quests</Link>
              </Button>
            </div>
          )}

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id}>
                {expandedProjectId === project.id ? (
                  <ProjectCardExpanded project={project} onClose={handleCloseExpanded} />
                ) : gamificationEnabled ? (
                  <ProjectCardGamified
                    project={project}
                    featured={project.id === 2} // Example featured project
                    endingSoon={project.daysLeft <= 7}
                    onExpand={() => handleExpandProject(project.id)}
                    useMatcap={true}
                  />
                ) : (
                  <ProjectCard
                    project={project}
                    featured={project.id === 2} // Example featured project
                    endingSoon={project.daysLeft <= 7}
                    onExpand={() => handleExpandProject(project.id)}
                    useMatcap={true}
                  />
                )}
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </GamificationProvider>
    </CrowdfundingGamificationProvider>
  )
}
