"use client"

import { useState } from "react"
import { useGamification } from "@/context/gamification-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, Lock, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

// Mock achievements data
const allAchievements = [
  // Backer achievements
  {
    id: "first-contribution",
    name: "First Steps",
    description: "Make your first contribution to a project",
    icon: "rocket",
    category: "backer",
    tier: "bronze",
    points: 50,
  },
  {
    id: "three-projects",
    name: "Diversified Portfolio",
    description: "Back 3 different projects",
    icon: "layout-grid",
    category: "backer",
    tier: "silver",
    points: 100,
  },
  {
    id: "big-supporter",
    name: "Big Supporter",
    description: "Contribute at least 500 ECE to a single project",
    icon: "heart",
    category: "backer",
    tier: "gold",
    points: 200,
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Be among the first 10 backers of a project that reaches its goal",
    icon: "alarm-clock",
    category: "backer",
    tier: "silver",
    points: 150,
  },
  {
    id: "blockchain-believer",
    name: "Blockchain Believer",
    description: "Back 5 different blockchain infrastructure projects",
    icon: "boxes",
    category: "backer",
    tier: "gold",
    points: 250,
  },

  // Creator achievements
  {
    id: "project-creator",
    name: "Visionary",
    description: "Create your first crowdfunding project",
    icon: "lightbulb",
    category: "creator",
    tier: "bronze",
    points: 100,
  },
  {
    id: "fully-funded",
    name: "Dream Realized",
    description: "Get a project 100% funded",
    icon: "target",
    category: "creator",
    tier: "silver",
    points: 300,
  },
  {
    id: "overachiever",
    name: "Overachiever",
    description: "Reach 150% of your funding goal",
    icon: "trending-up",
    category: "creator",
    tier: "gold",
    points: 500,
  },

  // Community achievements
  {
    id: "helpful-commenter",
    name: "Helpful Insight",
    description: "Get 10 likes on a project comment",
    icon: "message-square",
    category: "community",
    tier: "bronze",
    points: 50,
  },
  {
    id: "community-pillar",
    name: "Community Pillar",
    description: "Participate in 5 project discussions with meaningful comments",
    icon: "users",
    category: "community",
    tier: "silver",
    points: 150,
  },
  {
    id: "project-promoter",
    name: "Project Promoter",
    description: "Share 10 projects on social media",
    icon: "share-2",
    category: "community",
    tier: "bronze",
    points: 75,
  },

  // Special achievements
  {
    id: "streak-week",
    name: "Consistency is Key",
    description: "Maintain a 7-day platform activity streak",
    icon: "calendar",
    category: "special",
    tier: "bronze",
    points: 100,
  },
  {
    id: "streak-month",
    name: "Dedicated Supporter",
    description: "Maintain a 30-day platform activity streak",
    icon: "calendar-check",
    category: "special",
    tier: "gold",
    points: 500,
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Back a project between midnight and 4 AM",
    icon: "moon",
    category: "special",
    tier: "bronze",
    points: 50,
  },
  {
    id: "blockchain-pioneer",
    name: "Blockchain Pioneer",
    description: "Be among the first 100 users of the platform",
    icon: "flag",
    category: "special",
    tier: "platinum",
    points: 1000,
  },
]

export function AchievementsGallery() {
  const { profile, isLoading } = useGamification()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-3/4 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-1/2 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-64 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  // Get unlocked achievement IDs
  const unlockedIds = profile?.achievements.map((a) => a.id) || []

  // Filter achievements based on search and category
  const filteredAchievements = allAchievements.filter((achievement) => {
    const matchesSearch =
      achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      activeTab === "all" ||
      (activeTab === "unlocked" && unlockedIds.includes(achievement.id)) ||
      (activeTab === "locked" && !unlockedIds.includes(achievement.id)) ||
      activeTab === achievement.category

    return matchesSearch && matchesCategory
  })

  // Get stats
  const totalAchievements = allAchievements.length
  const unlockedCount = unlockedIds.length
  const lockedCount = totalAchievements - unlockedCount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements Gallery</CardTitle>
        <CardDescription>Unlock achievements by participating in the crowdfunding ecosystem</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search achievements..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Achievement stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-xl font-bold">{totalAchievements}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-primary/80 mb-1">Unlocked</p>
            <p className="text-xl font-bold text-primary">{unlockedCount}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Locked</p>
            <p className="text-xl font-bold">{lockedCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="backer">Backer</TabsTrigger>
            <TabsTrigger value="creator">Creator</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredAchievements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No achievements found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAchievements.map((achievement) => {
                  const isUnlocked = unlockedIds.includes(achievement.id)

                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        "p-3 rounded-md border",
                        isUnlocked ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-muted/20",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isUnlocked
                              ? (achievement.tier === "bronze" && "bg-amber-700/20 text-amber-700",
                                achievement.tier === "silver" && "bg-slate-400/20 text-slate-400",
                                achievement.tier === "gold" && "bg-yellow-500/20 text-yellow-500",
                                achievement.tier === "platinum" && "bg-cyan-500/20 text-cyan-500")
                              : "bg-muted/30 text-muted-foreground",
                          )}
                        >
                          {isUnlocked ? <Award className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={cn("font-medium", !isUnlocked && "text-muted-foreground")}>
                              {achievement.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                isUnlocked
                                  ? (achievement.tier === "bronze" && "border-amber-700/30 text-amber-700/80",
                                    achievement.tier === "silver" && "border-slate-400/30 text-slate-400/80",
                                    achievement.tier === "gold" && "border-yellow-500/30 text-yellow-500/80",
                                    achievement.tier === "platinum" && "border-cyan-500/30 text-cyan-500/80")
                                  : "border-muted-foreground/30 text-muted-foreground",
                              )}
                            >
                              {achievement.tier}
                            </Badge>
                          </div>
                          <p
                            className={cn("text-sm", isUnlocked ? "text-muted-foreground" : "text-muted-foreground/70")}
                          >
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                isUnlocked
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted/20 text-muted-foreground border-muted/30",
                              )}
                            >
                              {achievement.category}
                            </Badge>
                            <span
                              className={cn(
                                "text-xs font-medium",
                                isUnlocked ? "text-primary" : "text-muted-foreground",
                              )}
                            >
                              {achievement.points} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
