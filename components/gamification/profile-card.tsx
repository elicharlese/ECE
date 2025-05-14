"use client"

import { useGamification } from "@/context/gamification-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Flame, Trophy, Star, Calendar, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function GamificationProfileCard() {
  const { profile, isLoading } = useGamification()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-3/4 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-1/2 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-muted h-20 rounded"></div>
            <div className="animate-pulse bg-muted h-32 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gamification Profile</CardTitle>
          <CardDescription>Sign in to view your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">Sign in to track your achievements and earn rewards</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = Math.min(
    100,
    Math.round((profile.level.points / (profile.level.points + profile.level.pointsToNextLevel)) * 100),
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>{profile.username}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Lvl {profile.level.level}
              </Badge>
            </CardTitle>
            <CardDescription>{profile.level.title}</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.username}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Level progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level Progress</span>
              <span className="font-medium">
                {profile.points - profile.level.points} / {profile.level.pointsToNextLevel} XP
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {profile.level.pointsToNextLevel - (profile.points - profile.level.points)} XP to Level{" "}
              {profile.level.level + 1}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Achievements</span>
              </div>
              <p className="text-2xl font-bold">{profile.achievements.length}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <p className="text-2xl font-bold">{profile.streak.current} days</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Backed</span>
              </div>
              <p className="text-2xl font-bold">{profile.projectsBacked}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Contributed</span>
              </div>
              <p className="text-2xl font-bold">{profile.totalContributions} ECE</p>
            </div>
          </div>

          {/* Recent achievements */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
            <div className="space-y-2">
              {profile.achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/20 border border-border/50"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      achievement.tier === "bronze" && "bg-amber-700/20 text-amber-700",
                      achievement.tier === "silver" && "bg-slate-400/20 text-slate-400",
                      achievement.tier === "gold" && "bg-yellow-500/20 text-yellow-500",
                      achievement.tier === "platinum" && "bg-cyan-500/20 text-cyan-500",
                    )}
                  >
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      achievement.tier === "bronze" && "border-amber-700/30 text-amber-700/80",
                      achievement.tier === "silver" && "border-slate-400/30 text-slate-400/80",
                      achievement.tier === "gold" && "border-yellow-500/30 text-yellow-500/80",
                      achievement.tier === "platinum" && "border-cyan-500/30 text-cyan-500/80",
                    )}
                  >
                    {achievement.tier}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Active quests */}
          {profile.quests.filter((q) => !q.completedAt).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Active Quests</h4>
              <div className="space-y-2">
                {profile.quests
                  .filter((q) => !q.completedAt)
                  .map((quest) => (
                    <div key={quest.id} className="p-3 rounded-md bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Calendar className="h-3 w-3" />
                          </div>
                          <p className="text-sm font-medium">{quest.name}</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                          {quest.rewards.points} XP
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{quest.description}</p>
                      <div className="space-y-1.5">
                        {quest.steps.map((step) => (
                          <div key={step.id} className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                step.completed
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground/30",
                              )}
                            >
                              {step.completed && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                            <p className={cn("text-xs", step.completed ? "text-foreground" : "text-muted-foreground")}>
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
