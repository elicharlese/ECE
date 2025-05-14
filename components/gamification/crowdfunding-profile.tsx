"use client"

import { useCrowdfundingGamification } from "@/context/crowdfunding-gamification-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Award, Gift, Shield, Star, TrendingUp, Calendar, Zap, CheckCircle, Edit, Info, RefreshCw } from "lucide-react"
import { useState } from "react"

export function CrowdfundingProfile() {
  const { stats, backerTier, creatorTier, milestones, badges, collectDailyReward, refreshStats, isLoading } =
    useCrowdfundingGamification()

  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading gamification profile...</p>
        </div>
      </div>
    )
  }

  if (!stats || !backerTier) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Gamification Profile Not Available</CardTitle>
            <CardDescription>There was an error loading your gamification profile.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={refreshStats}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Filter milestones
  const completedMilestones = milestones.filter((m) => m.reached)
  const upcomingMilestones = milestones.filter((m) => !m.reached)

  // Filter badges
  const unlockedBadges = badges.filter((b) => b.unlockedAt)
  const inProgressBadges = badges.filter((b) => !b.unlockedAt && b.progress)

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Backer Tier Card */}
        <Card className="border-l-4" style={{ borderLeftColor: `rgb(var(--${backerTier.color}-500))` }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Backer Tier
            </CardTitle>
            <CardDescription>Your status as a project backer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-${backerTier.color}-100 dark:bg-${backerTier.color}-900/20`}
              >
                <Award className={`h-6 w-6 text-${backerTier.color}-500`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{backerTier.name}</h3>
                <p className="text-sm text-muted-foreground">{backerTier.description}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Benefits:</h4>
              <ul className="text-sm space-y-1">
                {backerTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Creator Tier Card */}
        <Card className="border-l-4" style={{ borderLeftColor: `rgb(var(--${creatorTier.color}-500))` }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5 text-primary" />
              Creator Tier
            </CardTitle>
            <CardDescription>Your status as a project creator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-${creatorTier.color}-100 dark:bg-${creatorTier.color}-900/20`}
              >
                <Star className={`h-6 w-6 text-${creatorTier.color}-500`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{creatorTier.name}</h3>
                <p className="text-sm text-muted-foreground">{creatorTier.description}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Benefits:</h4>
              <ul className="text-sm space-y-1">
                {creatorTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Daily Reward Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Gift className="mr-2 h-5 w-5 text-primary" />
              Daily Rewards
            </CardTitle>
            <CardDescription>Collect your daily bonus</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-xl">25+ XP</h3>
                <p className="text-sm text-muted-foreground">Available daily</p>
              </div>
              <Button className="w-full" onClick={collectDailyReward}>
                Collect Reward
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Streak: {stats.currentFundingStreak} days</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Best: {stats.longestFundingStreak} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Summary Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Crowdfunding Summary</CardTitle>
                <CardDescription>Your crowdfunding activity overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Contributions</p>
                    <p className="text-2xl font-bold">{stats.totalAmountContributed} ECE</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Projects Backed</p>
                    <p className="text-2xl font-bold">{stats.projectsBacked}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Projects Created</p>
                    <p className="text-2xl font-bold">{stats.projectsCreated}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Milestones Achieved</p>
                    <p className="text-2xl font-bold">
                      {stats.milestonesMet} / {milestones.length}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Next Milestone Progress</h3>
                  {upcomingMilestones.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>{upcomingMilestones[0].name}</span>
                        <span className="text-muted-foreground">
                          {stats.totalAmountContributed} / {upcomingMilestones[0].target} ECE
                        </span>
                      </div>
                      <Progress
                        value={(stats.totalAmountContributed / upcomingMilestones[0].target) * 100}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">{upcomingMilestones[0].description}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">You've completed all available milestones!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Badges Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Badges</CardTitle>
                <CardDescription>Your latest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {unlockedBadges.length > 0 ? (
                  <div className="space-y-4">
                    {unlockedBadges.slice(0, 3).map((badge) => (
                      <div key={badge.id} className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center bg-${getBadgeTierColor(badge.tier)}-100 dark:bg-${getBadgeTierColor(badge.tier)}-900/20`}
                        >
                          <Award className={`h-5 w-5 text-${getBadgeTierColor(badge.tier)}-500`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                      </div>
                    ))}

                    {unlockedBadges.length > 3 && (
                      <Button variant="outline" className="w-full text-sm" onClick={() => setActiveTab("badges")}>
                        View All Badges ({unlockedBadges.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Award className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">No badges unlocked yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Keep participating to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contribution Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Contribution Categories</CardTitle>
              <CardDescription>Projects you've backed by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.contributionsByCategory).map(([category, amount]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{category}</span>
                      <span>{amount} ECE</span>
                    </div>
                    <Progress value={(amount / stats.totalAmountContributed) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Completed Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Completed Milestones</CardTitle>
                <CardDescription>
                  You've completed {completedMilestones.length} out of {milestones.length} milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedMilestones.length > 0 ? (
                  <div className="space-y-6">
                    {completedMilestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{milestone.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {milestone.reachedAt && new Date(milestone.reachedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>

                          {milestone.reward && (
                            <div className="mt-3 p-3 bg-primary/5 rounded-md">
                              <h4 className="text-sm font-medium flex items-center">
                                <Gift className="h-4 w-4 mr-1 text-primary" />
                                Reward
                              </h4>
                              <p className="text-sm mt-1">{milestone.reward.description}</p>
                              <div className="flex gap-4 mt-2">
                                {milestone.reward.points && (
                                  <Badge variant="secondary" className="text-primary bg-primary/10">
                                    +{milestone.reward.points} XP
                                  </Badge>
                                )}
                                {milestone.reward.badgeId && (
                                  <Badge variant="secondary">
                                    <Award className="h-3 w-3 mr-1" />
                                    Badge
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <TrendingUp className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">No milestones completed yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start backing projects to reach your first milestone!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
                <CardDescription>Your next achievements to unlock</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingMilestones.length > 0 ? (
                  <div className="space-y-6">
                    {upcomingMilestones.map((milestone) => (
                      <div key={milestone.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{milestone.name}</h3>
                          <Badge variant="outline">
                            {stats.totalAmountContributed} / {milestone.target} ECE
                          </Badge>
                        </div>
                        <Progress value={(stats.totalAmountContributed / milestone.target) * 100} className="h-2" />
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>

                        {milestone.reward && (
                          <div className="p-3 bg-muted/40 rounded-md">
                            <h4 className="text-sm font-medium flex items-center">
                              <Gift className="h-4 w-4 mr-1 text-muted-foreground" />
                              Reward Preview
                            </h4>
                            <p className="text-sm mt-1 text-muted-foreground">{milestone.reward.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Award className="h-10 w-10 text-primary mb-2 opacity-70" />
                    <p className="font-medium">All Milestones Completed!</p>
                    <p className="text-sm text-muted-foreground mt-1">You've reached all available milestones.</p>
                    <p className="text-xs text-muted-foreground">Check back later for new challenges.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Badges Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>
                  You've earned {unlockedBadges.length} out of {badges.length} badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="unlocked">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="locked">Locked</TabsTrigger>
                  </TabsList>

                  {/* Unlocked Badges */}
                  <TabsContent value="unlocked" className="mt-4">
                    {unlockedBadges.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unlockedBadges.map((badge) => (
                          <Card
                            key={badge.id}
                            className="overflow-hidden border-t-4"
                            style={{ borderTopColor: `rgb(var(--${getBadgeTierColor(badge.tier)}-500))` }}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div
                                  className={`w-16 h-16 rounded-full flex items-center justify-center bg-${getBadgeTierColor(badge.tier)}-100 dark:bg-${getBadgeTierColor(badge.tier)}-900/20 mb-3`}
                                >
                                  <Award className={`h-8 w-8 text-${getBadgeTierColor(badge.tier)}-500`} />
                                </div>
                                <h3 className="font-medium">{badge.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>

                                <div className="mt-3 flex gap-2">
                                  <Badge
                                    variant="secondary"
                                    className={`bg-${getBadgeTierColor(badge.tier)}-100 text-${getBadgeTierColor(badge.tier)}-700 dark:bg-${getBadgeTierColor(badge.tier)}-900/20 dark:text-${getBadgeTierColor(badge.tier)}-300`}
                                  >
                                    {formatBadgeTier(badge.tier)}
                                  </Badge>
                                  <Badge variant="outline">{badge.rarity}</Badge>
                                </div>

                                <p className="text-xs text-muted-foreground mt-3">
                                  Unlocked {badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <Award className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                        <p className="text-muted-foreground">No badges unlocked yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Keep participating in crowdfunding to earn badges!
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* In Progress Badges */}
                  <TabsContent value="in-progress" className="mt-4">
                    {inProgressBadges.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inProgressBadges.map((badge) => (
                          <Card key={badge.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted mb-3">
                                  <Award className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-medium">{badge.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>

                                <div className="w-full mt-3">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>
                                      {badge.progress?.current || 0} / {badge.progress?.target || 0}
                                    </span>
                                  </div>
                                  <Progress
                                    value={((badge.progress?.current || 0) / (badge.progress?.target || 1)) * 100}
                                    className="h-2"
                                  />
                                </div>

                                <div className="mt-3 flex gap-2">
                                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                    {formatBadgeTier(badge.tier)}
                                  </Badge>
                                  <Badge variant="outline">{badge.rarity}</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <TrendingUp className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                        <p className="text-muted-foreground">No badges in progress</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Explore more crowdfunding activities to progress towards new badges!
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Locked Badges */}
                  <TabsContent value="locked" className="mt-4">
                    {badges.filter((b) => !b.unlockedAt && !b.progress).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {badges
                          .filter((b) => !b.unlockedAt && !b.progress)
                          .map((badge) => (
                            <Card key={badge.id} className="overflow-hidden opacity-70">
                              <CardContent className="p-4">
                                <div className="flex flex-col items-center text-center">
                                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted mb-3">
                                    <Award className="h-8 w-8 text-muted-foreground opacity-50" />
                                  </div>
                                  <h3 className="font-medium">{badge.name}</h3>
                                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>

                                  <div className="mt-3 flex gap-2">
                                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
                                      {formatBadgeTier(badge.tier)}
                                    </Badge>
                                    <Badge variant="outline" className="opacity-50">
                                      {badge.rarity}
                                    </Badge>
                                  </div>

                                  <p className="text-xs text-muted-foreground mt-3">
                                    Keep participating to unlock this badge
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <Info className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                        <p className="text-muted-foreground">No locked badges</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You've unlocked or started progress on all available badges!
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backing Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Backing Statistics</CardTitle>
                <CardDescription>Your project backing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Total Contributions</dt>
                    <dd className="text-2xl font-bold">{stats.totalAmountContributed} ECE</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Projects Backed</dt>
                    <dd className="text-2xl font-bold">{stats.projectsBacked}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Average Contribution</dt>
                    <dd className="text-2xl font-bold">{stats.averageContribution.toFixed(2)} ECE</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Largest Contribution</dt>
                    <dd className="text-2xl font-bold">{stats.largestContribution} ECE</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Referrals</dt>
                    <dd className="text-2xl font-bold">{stats.referrals}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Last Contribution</dt>
                    <dd className="text-xl font-bold">{new Date(stats.lastContributionDate).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Creator Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Creator Statistics</CardTitle>
                <CardDescription>Your project creation activity</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.projectsCreated > 0 ? (
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <dt className="text-muted-foreground">Projects Created</dt>
                      <dd className="text-2xl font-bold">{stats.projectsCreated}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-muted-foreground">Milestones Met</dt>
                      <dd className="text-2xl font-bold">{stats.milestonesMet}</dd>
                    </div>
                    <div className="col-span-2 pt-4">
                      <p className="text-center text-muted-foreground">
                        Create more projects to see detailed creator statistics
                      </p>
                    </div>
                  </dl>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Edit className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">No projects created yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start creating projects to see your creator statistics!
                    </p>
                    <Button variant="outline" className="mt-4">
                      Create a Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Streak Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Activity Streaks</CardTitle>
                <CardDescription>Your continuous participation record</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Streak</h3>
                    <p className="text-3xl font-bold">{stats.currentFundingStreak} days</p>
                    <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Longest Streak</h3>
                    <p className="text-3xl font-bold">{stats.longestFundingStreak} days</p>
                    <p className="text-xs text-muted-foreground mt-1">Your personal best</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Activity</h3>
                    <p className="text-2xl font-bold">{new Date(stats.lastContributionDate).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(stats.lastContributionDate)}</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Activity streaks increase your daily rewards and unlock special achievements. Contribute to a
                    project every day to build your streak!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function getBadgeTierColor(tier: string): string {
  switch (tier) {
    case "bronze":
      return "orange"
    case "silver":
      return "zinc"
    case "gold":
      return "yellow"
    case "platinum":
      return "cyan"
    default:
      return "gray"
  }
}

function formatBadgeTier(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
}
