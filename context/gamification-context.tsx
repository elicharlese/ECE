"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { GamificationProfile, Achievement, LeaderboardEntry } from "@/types/gamification"
import { useToast } from "@/hooks/use-toast"

type GamificationContextType = {
  profile: GamificationProfile | null
  leaderboard: LeaderboardEntry[]
  isLoading: boolean
  awardPoints: (points: number, reason: string) => void
  unlockAchievement: (achievementId: string) => void
  startQuest: (questId: string) => void
  completeQuestStep: (questId: string, stepId: string) => void
  refreshProfile: () => Promise<void>
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<GamificationProfile | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch user's gamification profile
  const fetchProfile = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockProfile: GamificationProfile = {
        userId: "user1",
        username: "CryptoEnthusiast",
        avatar: "/diverse-user-avatars.png",
        level: {
          level: 3,
          title: "Blockchain Pioneer",
          points: 350,
          pointsToNextLevel: 150,
          benefits: ["Early access to new projects", "5% bonus on contributions"],
        },
        points: 350,
        achievements: [
          {
            id: "first-contribution",
            name: "First Steps",
            description: "Make your first contribution to a project",
            icon: "rocket",
            category: "backer",
            tier: "bronze",
            points: 50,
            unlockedAt: "2023-04-15T10:30:00Z",
          },
          {
            id: "three-projects",
            name: "Diversified Portfolio",
            description: "Back 3 different projects",
            icon: "layout-grid",
            category: "backer",
            tier: "silver",
            points: 100,
            unlockedAt: "2023-04-22T14:15:00Z",
          },
        ],
        quests: [
          {
            id: "weekly-explorer",
            name: "Weekly Explorer",
            description: "Discover and interact with new projects this week",
            icon: "compass",
            rewards: {
              points: 75,
              badges: ["explorer"],
            },
            steps: [
              { id: "view-5", description: "View 5 new projects", completed: true },
              { id: "bookmark-3", description: "Bookmark 3 interesting projects", completed: true },
              { id: "back-1", description: "Back at least 1 new project", completed: false },
            ],
            expiresAt: "2023-05-20T23:59:59Z",
          },
        ],
        streak: {
          current: 3,
          longest: 5,
          lastContribution: "2023-05-12T09:45:00Z",
        },
        totalContributions: 450,
        projectsBacked: 5,
        projectsCreated: 1,
      }

      setProfile(mockProfile)

      // Mock leaderboard data
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          userId: "user2",
          username: "BlockchainBuilder",
          avatar: "/diverse-user-avatars.png",
          points: 780,
          level: 5,
          achievements: 12,
          rank: 1,
          change: 0,
        },
        {
          userId: "user3",
          username: "CryptoVenture",
          avatar: "/diverse-user-avatars.png",
          points: 650,
          level: 4,
          achievements: 9,
          rank: 2,
          change: 1,
        },
        {
          userId: "user1", // Current user
          username: "CryptoEnthusiast",
          avatar: "/diverse-user-avatars.png",
          points: 350,
          level: 3,
          achievements: 2,
          rank: 3,
          change: -1,
        },
      ]

      setLeaderboard(mockLeaderboard)
    } catch (error) {
      console.error("Error fetching gamification profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const refreshProfile = async () => {
    setIsLoading(true)
    await fetchProfile()
  }

  const awardPoints = (points: number, reason: string) => {
    if (!profile) return

    // Update profile with new points
    setProfile((prev) => {
      if (!prev) return prev

      const newPoints = prev.points + points
      const currentLevel = prev.level

      // Check if user leveled up (simplified logic)
      let newLevel = { ...currentLevel }
      if (newPoints >= currentLevel.points + currentLevel.pointsToNextLevel) {
        newLevel = {
          level: currentLevel.level + 1,
          title: `Level ${currentLevel.level + 1} Explorer`, // This would be more sophisticated in a real app
          points: newPoints,
          pointsToNextLevel: currentLevel.pointsToNextLevel + 100, // Simple progression
          benefits: [...currentLevel.benefits, "New benefit unlocked!"],
        }

        // Show level up toast
        toast({
          title: "Level Up!",
          description: `Congratulations! You've reached level ${newLevel.level}!`,
          variant: "default",
        })
      }

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      }
    })

    // Show points toast
    toast({
      title: `+${points} XP`,
      description: reason,
      variant: "default",
    })
  }

  const unlockAchievement = (achievementId: string) => {
    // In a real app, this would verify if the achievement is actually unlocked
    // For demo purposes, we'll just add it to the profile

    // Mock achievement data
    const newAchievement: Achievement = {
      id: achievementId,
      name: "Achievement Unlocked",
      description: "You've unlocked a new achievement!",
      icon: "award",
      category: "backer",
      tier: "silver",
      points: 75,
      unlockedAt: new Date().toISOString(),
    }

    setProfile((prev) => {
      if (!prev) return prev

      // Check if achievement already exists
      if (prev.achievements.some((a) => a.id === achievementId)) {
        return prev
      }

      // Add achievement and points
      return {
        ...prev,
        achievements: [...prev.achievements, newAchievement],
        points: prev.points + newAchievement.points,
      }
    })

    // Show achievement toast
    toast({
      title: "Achievement Unlocked!",
      description: newAchievement.name,
      variant: "default",
    })
  }

  const startQuest = (questId: string) => {
    // In a real app, this would start a quest for the user
    toast({
      title: "Quest Started",
      description: "You've started a new quest!",
      variant: "default",
    })
  }

  const completeQuestStep = (questId: string, stepId: string) => {
    setProfile((prev) => {
      if (!prev) return prev

      const updatedQuests = prev.quests.map((quest) => {
        if (quest.id === questId) {
          const updatedSteps = quest.steps.map((step) => {
            if (step.id === stepId) {
              return { ...step, completed: true }
            }
            return step
          })

          // Check if all steps are completed
          const allCompleted = updatedSteps.every((step) => step.completed)

          if (allCompleted && !quest.completedAt) {
            // Quest completed
            toast({
              title: "Quest Completed!",
              description: `You've completed the "${quest.name}" quest!`,
              variant: "default",
            })

            // Award points
            setTimeout(() => {
              awardPoints(quest.rewards.points, `Completed quest: ${quest.name}`)
            }, 500)

            return {
              ...quest,
              steps: updatedSteps,
              completedAt: new Date().toISOString(),
            }
          }

          return {
            ...quest,
            steps: updatedSteps,
          }
        }
        return quest
      })

      return {
        ...prev,
        quests: updatedQuests,
      }
    })
  }

  return (
    <GamificationContext.Provider
      value={{
        profile,
        leaderboard,
        isLoading,
        awardPoints,
        unlockAchievement,
        startQuest,
        completeQuestStep,
        refreshProfile,
      }}
    >
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider")
  }
  return context
}
