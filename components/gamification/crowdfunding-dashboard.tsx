"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrowdfundingProfile } from "./crowdfunding-profile"
import { CrowdfundingEvents } from "./crowdfunding-events"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Award, Calendar, TrendingUp, Trophy, Users, Zap, Gift, Clock } from "lucide-react"
import { useCrowdfundingGamification } from "@/context/crowdfunding-gamification-context"

export function CrowdfundingGamificationDashboard() {
  const { stats, trendingProjects, leaderboards, collectDailyReward, isLoading } = useCrowdfundingGamification()

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading gamification dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Get the daily contributions leaderboard
  const dailyContributionsLeaderboard = leaderboards.dailyContributions || {
    timeframe: "daily",
    category: "contributions",
    entries: [],
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crowdfunding Gamification</h1>
          <p className="text-muted-foreground">Track your achievements and rewards</p>
        </div>

        <Button onClick={collectDailyReward} className="flex items-center">
          <Gift className="mr-2 h-4 w-4" />
          Collect Daily Reward
        </Button>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contributions</p>
                <h3 className="text-2xl font-bold">{stats?.totalAmountContributed || 0} ECE</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projects Backed</p>
                <h3 className="text-2xl font-bold">{stats?.projectsBacked || 0}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <h3 className="text-2xl font-bold">{stats?.currentFundingStreak || 0} days</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <h3 className="text-2xl font-bold">
                  {badges.filter((b) => b.unlockedAt).length || 0} / {badges.length || 0}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile and Stats */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <Trophy className="h-4 w-4 mr-2" />
                My Profile
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="h-4 w-4 mr-2" />
                Special Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <CrowdfundingProfile />
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <CrowdfundingEvents />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Leaderboards and Trending Projects */}
        <div className="space-y-8">
          {/* Leaderboard Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-primary" />
                Daily Leaderboard
              </CardTitle>
              <CardDescription>Top contributors today</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyContributionsLeaderboard.entries.length > 0 ? (
                <div className="space-y-4">
                  {dailyContributionsLeaderboard.entries.map((entry, index) => (
                    <div key={entry.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-center">
                          <span className={index < 3 ? "text-primary font-bold" : ""}>{entry.rank}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={entry.avatar || "/placeholder.svg"}
                            alt={entry.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-sm">{entry.username}</p>
                            <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold">{entry.points} pts</span>
                        {entry.change !== 0 && (
                          <span className={`text-xs ml-1 ${entry.change > 0 ? "text-green-500" : "text-red-500"}`}>
                            {entry.change > 0 ? "↑" : "↓"}
                            {Math.abs(entry.change)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Users className="h-10 w-10 text-muted-foreground opacity-40 mx-auto mb-2" />
                  <p className="text-muted-foreground">No leaderboard data available</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border/50">
                <Button variant="outline" className="w-full text-sm">
                  View Full Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trending Projects Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Bonus Projects
              </CardTitle>
              <CardDescription>Projects with bonus rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {trendingProjects.length > 0 ? (
                <div className="space-y-4">
                  {trendingProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium mb-1">{project.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{project.backerCount} backers</span>
                            </div>
                            <Progress value={project.fundingPercentage} className="h-1.5 w-40" />
                            <p className="text-xs mt-1">{project.fundingPercentage}% funded</p>
                          </div>
                          {project.gamificationBonus && (
                            <div className="bg-primary/10 text-primary p-2 rounded-md text-center">
                              <p className="text-xs font-medium uppercase">
                                {formatBonusType(project.gamificationBonus.type)}
                              </p>
                              <p className="text-lg font-bold">+{project.gamificationBonus.bonusPoints} XP</p>
                              {project.gamificationBonus.endTime && (
                                <div className="flex items-center justify-center text-xs mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{formatTimeRemaining(project.gamificationBonus.endTime)}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <TrendingUp className="h-10 w-10 text-muted-foreground opacity-40 mx-auto mb-2" />
                  <p className="text-muted-foreground">No bonus projects available</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border/50">
                <Button variant="outline" className="w-full text-sm">
                  View All Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Inject these variables which should come from the parent component
const badges = [] // This should be populated from the crowdfunding gamification context

// Helper functions
function formatBonusType(type: string): string {
  switch (type) {
    case "trending":
      return "Trending"
    case "almostFunded":
      return "Almost Funded"
    case "communityFavorite":
      return "Fan Favorite"
    case "staffPick":
      return "Staff Pick"
    default:
      return type
  }
}

function formatTimeRemaining(endDateString: string): string {
  const endDate = new Date(endDateString)
  const now = new Date()

  const diffInMs = endDate.getTime() - now.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

  if (diffInHours < 24) {
    return `${diffInHours}h left`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d left`
}
