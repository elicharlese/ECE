"use client"

import { useState } from "react"
import { useGamification } from "@/context/gamification-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Gift, RefreshCw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

// Mock daily quests
const dailyQuests = [
  {
    id: "daily-visit",
    name: "Daily Visit",
    description: "Visit the platform today",
    icon: "calendar",
    rewards: {
      points: 10,
    },
    completed: true,
    expiresIn: 0, // Already completed
  },
  {
    id: "browse-projects",
    name: "Project Explorer",
    description: "Browse at least 3 projects today",
    icon: "search",
    rewards: {
      points: 15,
    },
    progress: {
      current: 2,
      target: 3,
    },
    completed: false,
    expiresIn: 12, // hours
  },
  {
    id: "share-project",
    name: "Project Promoter",
    description: "Share a project on social media",
    icon: "share",
    rewards: {
      points: 25,
    },
    completed: false,
    expiresIn: 12, // hours
  },
]

// Mock weekly challenges
const weeklyChallenges = [
  {
    id: "back-project",
    name: "Weekly Backer",
    description: "Back at least one project this week",
    icon: "heart",
    rewards: {
      points: 50,
      badge: "Weekly Supporter",
    },
    completed: false,
    expiresIn: 3 * 24, // 3 days in hours
  },
  {
    id: "comment-projects",
    name: "Community Contributor",
    description: "Leave thoughtful comments on 3 different projects",
    icon: "message-square",
    rewards: {
      points: 75,
    },
    progress: {
      current: 1,
      target: 3,
    },
    completed: false,
    expiresIn: 3 * 24, // 3 days in hours
  },
]

export function DailyQuests() {
  const { awardPoints, unlockAchievement } = useGamification()
  const [quests, setQuests] = useState(dailyQuests)
  const [challenges, setChallenges] = useState(weeklyChallenges)

  const handleCompleteQuest = (questId: string) => {
    // Find the quest
    const quest = quests.find((q) => q.id === questId)
    if (!quest || quest.completed) return

    // Update quest state
    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, completed: true } : q)))

    // Award points
    awardPoints(quest.rewards.points, `Completed quest: ${quest.name}`)

    // If it's the "share-project" quest, also unlock an achievement
    if (questId === "share-project") {
      setTimeout(() => {
        unlockAchievement("project-promoter")
      }, 1000)
    }
  }

  const handleProgressQuest = (questId: string) => {
    // Find the quest
    const quest = quests.find((q) => q.id === questId && q.progress)
    if (!quest || quest.completed) return

    // Update quest progress
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && q.progress) {
          const newProgress = Math.min(q.progress.current + 1, q.progress.target)
          const completed = newProgress >= q.progress.target

          // If completed, award points
          if (completed) {
            setTimeout(() => {
              awardPoints(q.rewards.points, `Completed quest: ${q.name}`)
            }, 500)
          }

          return {
            ...q,
            progress: { ...q.progress, current: newProgress },
            completed,
          }
        }
        return q
      }),
    )
  }

  const handleCompleteChallenge = (challengeId: string) => {
    // Find the challenge
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge || challenge.completed) return

    // Update challenge state
    setChallenges((prev) => prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c)))

    // Award points
    awardPoints(challenge.rewards.points, `Completed challenge: ${challenge.name}`)

    // If it has a badge reward, unlock it
    if (challenge.rewards.badge) {
      setTimeout(() => {
        unlockAchievement("weekly-supporter")
      }, 1000)
    }
  }

  const handleProgressChallenge = (challengeId: string) => {
    // Find the challenge
    const challenge = challenges.find((c) => c.id === challengeId && c.progress)
    if (!challenge || challenge.completed) return

    // Update challenge progress
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId && c.progress) {
          const newProgress = Math.min(c.progress.current + 1, c.progress.target)
          const completed = newProgress >= c.progress.target

          // If completed, award points
          if (completed) {
            setTimeout(() => {
              awardPoints(c.rewards.points, `Completed challenge: ${c.name}`)
            }, 500)
          }

          return {
            ...c,
            progress: { ...c.progress, current: newProgress },
            completed,
          }
        }
        return c
      }),
    )
  }

  const formatExpiryTime = (hours: number) => {
    if (hours === 0) return "Completed"
    if (hours < 1) return "Expires soon"
    if (hours < 24) return `${hours}h remaining`

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    if (remainingHours === 0) return `${days}d remaining`
    return `${days}d ${remainingHours}h remaining`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Quests & Challenges</CardTitle>
        <CardDescription>Complete quests to earn XP and unlock achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily quests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              Daily Quests
            </h3>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh in 12h
            </Button>
          </div>

          <div className="space-y-3">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={cn(
                  "p-3 rounded-md border",
                  quest.completed ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-muted/20",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        quest.completed ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground",
                      )}
                    >
                      <Gift className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{quest.name}</p>
                      <p className="text-xs text-muted-foreground">{quest.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      quest.completed
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted/20 text-muted-foreground border-muted/30",
                    )}
                  >
                    +{quest.rewards.points} XP
                  </Badge>
                </div>

                {quest.progress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {quest.progress.current} / {quest.progress.target}
                      </span>
                    </div>
                    <Progress value={(quest.progress.current / quest.progress.target) * 100} className="h-1.5" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatExpiryTime(quest.expiresIn)}</span>
                  </div>

                  {!quest.completed &&
                    (quest.progress ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleProgressQuest(quest.id)}
                      >
                        Progress
                      </Button>
                    ) : (
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleCompleteQuest(quest.id)}>
                        Complete
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly challenges */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center">
              <Trophy className="h-4 w-4 mr-1.5" />
              Weekly Challenges
            </h3>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={cn(
                  "p-3 rounded-md border",
                  challenge.completed ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-muted/20",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        challenge.completed ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground",
                      )}
                    >
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{challenge.name}</p>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        challenge.completed
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted/20 text-muted-foreground border-muted/30",
                      )}
                    >
                      +{challenge.rewards.points} XP
                    </Badge>
                    {challenge.rewards.badge && <div className="text-xs text-muted-foreground mt-1">+ Badge</div>}
                  </div>
                </div>

                {challenge.progress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {challenge.progress.current} / {challenge.progress.target}
                      </span>
                    </div>
                    <Progress
                      value={(challenge.progress.current / challenge.progress.target) * 100}
                      className="h-1.5"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatExpiryTime(challenge.expiresIn)}</span>
                  </div>

                  {!challenge.completed &&
                    (challenge.progress ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleProgressChallenge(challenge.id)}
                      >
                        Progress
                      </Button>
                    ) : (
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleCompleteChallenge(challenge.id)}>
                        Complete
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
