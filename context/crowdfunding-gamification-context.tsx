"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type {
  CrowdfundingStats,
  FundingMilestone,
  BackerTier,
  CreatorTier,
  CrowdfundingEvent,
  CrowdfundingLeaderboard,
  CrowdfundingBadge,
  GamifiedProject,
} from "@/types/gamification"

interface CrowdfundingGamificationContextProps {
  stats: CrowdfundingStats | null
  backerTier: BackerTier | null
  creatorTier: CreatorTier | null
  milestones: FundingMilestone[]
  badges: CrowdfundingBadge[]
  events: CrowdfundingEvent[]
  leaderboards: Record<string, CrowdfundingLeaderboard>
  trendingProjects: GamifiedProject[]
  isLoading: boolean

  // Actions
  trackContribution: (projectId: number, amount: number, category: string) => Promise<void>
  trackProjectCreation: (projectId: number, goal: number, category: string) => Promise<void>
  trackReferral: (projectId: number, referredUserId: string) => Promise<void>
  claimMilestoneReward: (milestoneId: string) => Promise<void>
  participateInEvent: (eventId: string) => Promise<void>
  refreshStats: () => Promise<void>
  shareProject: (projectId: number) => Promise<void>
  collectDailyReward: () => Promise<void>
}

const CrowdfundingGamificationContext = createContext<CrowdfundingGamificationContextProps | undefined>(undefined)

export function CrowdfundingGamificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [stats, setStats] = useState<CrowdfundingStats | null>(null)
  const [backerTier, setBackerTier] = useState<BackerTier | null>(null)
  const [creatorTier, setCreatorTier] = useState<CreatorTier | null>(null)
  const [milestones, setMilestones] = useState<FundingMilestone[]>([])
  const [badges, setBadges] = useState<CrowdfundingBadge[]>([])
  const [events, setEvents] = useState<CrowdfundingEvent[]>([])
  const [leaderboards, setLeaderboards] = useState<Record<string, CrowdfundingLeaderboard>>({})
  const [trendingProjects, setTrendingProjects] = useState<GamifiedProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // For this demo, we'll use mock data
        setStats(getMockStats())
        setBackerTier(getMockBackerTier())
        setCreatorTier(getMockCreatorTier())
        setMilestones(getMockMilestones())
        setBadges(getMockBadges())
        setEvents(getMockEvents())
        setLeaderboards(getMockLeaderboards())
        setTrendingProjects(getMockTrendingProjects())
      } catch (error) {
        console.error("Error loading crowdfunding gamification data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Track user contribution to a project
  const trackContribution = async (projectId: number, amount: number, category: string) => {
    try {
      // Update stats
      setStats((prev) => {
        if (!prev) return prev

        const contributionsByCategory = { ...prev.contributionsByCategory }
        contributionsByCategory[category] = (contributionsByCategory[category] || 0) + amount

        return {
          ...prev,
          totalAmountContributed: prev.totalAmountContributed + amount,
          projectsBacked: prev.projectsBacked + 1,
          averageContribution: (prev.totalAmountContributed + amount) / (prev.projectsBacked + 1),
          largestContribution: Math.max(prev.largestContribution, amount),
          lastContributionDate: new Date().toISOString(),
          currentFundingStreak: prev.currentFundingStreak + 1,
          longestFundingStreak: Math.max(prev.longestFundingStreak, prev.currentFundingStreak + 1),
          contributionsByCategory,
        }
      })

      // Check for new backer tier
      checkAndUpdateBackerTier()

      // Check for milestone achievements
      checkMilestones()

      // Award XP
      const xpAwarded = Math.floor(amount / 10) + 5 // Base formula: 5 XP + 1 XP per 10 units contributed

      // Show toast
      toast({
        title: `+${xpAwarded} XP`,
        description: `Thank you for your contribution of ${amount} ECE!`,
      })

      // Store in localStorage for persistence
      const history = JSON.parse(localStorage.getItem("contributionHistory") || "[]")
      history.push({
        projectId,
        amount,
        category,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("contributionHistory", JSON.stringify(history))
    } catch (error) {
      console.error("Error tracking contribution:", error)
      toast({
        title: "Error",
        description: "Failed to track your contribution. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Track project creation
  const trackProjectCreation = async (projectId: number, goal: number, category: string) => {
    try {
      // Update stats
      setStats((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          projectsCreated: prev.projectsCreated + 1,
        }
      })

      // Check for new creator tier
      checkAndUpdateCreatorTier()

      // Award XP for creating a project
      const xpAwarded = 50 // Base XP for creating a project

      // Show toast
      toast({
        title: `+${xpAwarded} XP`,
        description: "Congratulations on creating a new project!",
      })

      // Store in localStorage for persistence
      const history = JSON.parse(localStorage.getItem("projectCreationHistory") || "[]")
      history.push({
        projectId,
        goal,
        category,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("projectCreationHistory", JSON.stringify(history))
    } catch (error) {
      console.error("Error tracking project creation:", error)
      toast({
        title: "Error",
        description: "Failed to track your project creation. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Track referral
  const trackReferral = async (projectId: number, referredUserId: string) => {
    try {
      // Update stats
      setStats((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          referrals: prev.referrals + 1,
        }
      })

      // Award XP for referring a user
      const xpAwarded = 20 // Base XP for referral

      // Show toast
      toast({
        title: `+${xpAwarded} XP`,
        description: "Thanks for referring a new backer!",
      })

      // Update referral badge progress
      updateBadgeProgress("referral-networker")
    } catch (error) {
      console.error("Error tracking referral:", error)
      toast({
        title: "Error",
        description: "Failed to track your referral. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Claim milestone reward
  const claimMilestoneReward = async (milestoneId: string) => {
    try {
      // Find the milestone
      const milestone = milestones.find((m) => m.id === milestoneId)
      if (!milestone) throw new Error("Milestone not found")

      if (milestone.reached && milestone.reward) {
        // Award points
        if (milestone.reward.points) {
          // Logic to award points

          toast({
            title: `+${milestone.reward.points} XP`,
            description: `Rewarded for reaching the "${milestone.name}" milestone!`,
          })
        }

        // Award badge if applicable
        if (milestone.reward.badgeId) {
          // Logic to award badge

          toast({
            title: "New Badge Unlocked!",
            description: `You've earned the ${getBadgeName(milestone.reward.badgeId)} badge!`,
          })
        }

        // Special rewards
        if (milestone.reward.specialItem) {
          toast({
            title: "Special Reward Unlocked!",
            description: `You've received: ${milestone.reward.specialItem}`,
          })
        }
      }

      // Update the milestone as claimed
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId
            ? { ...m, reward: undefined } // Remove reward to indicate it's been claimed
            : m,
        ),
      )
    } catch (error) {
      console.error("Error claiming milestone reward:", error)
      toast({
        title: "Error",
        description: "Failed to claim your milestone reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Participate in event
  const participateInEvent = async (eventId: string) => {
    try {
      // Update events
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, participants: event.participants + 1 } : event)),
      )

      // Find the event
      const event = events.find((e) => e.id === eventId)
      if (!event) throw new Error("Event not found")

      // Award XP
      const xpAwarded = 15 // Base XP for event participation

      toast({
        title: `Joined Event: ${event.name}`,
        description: `+${xpAwarded} XP for participating!`,
      })
    } catch (error) {
      console.error("Error participating in event:", error)
      toast({
        title: "Error",
        description: "Failed to join the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Refresh stats
  const refreshStats = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would make API calls to refresh data
      // For this demo, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Refresh data
      setStats(getMockStats())
      checkAndUpdateBackerTier()
      checkAndUpdateCreatorTier()
      checkMilestones()
    } catch (error) {
      console.error("Error refreshing stats:", error)
      toast({
        title: "Error",
        description: "Failed to refresh your stats. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Share project
  const shareProject = async (projectId: number) => {
    try {
      // Award XP for sharing
      const xpAwarded = 10 // Base XP for sharing

      toast({
        title: `+${xpAwarded} XP`,
        description: "Thanks for sharing this project!",
      })

      // Update sharing badge progress
      updateBadgeProgress("project-promoter")
    } catch (error) {
      console.error("Error tracking share:", error)
      toast({
        title: "Error",
        description: "Failed to track your share. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Collect daily reward
  const collectDailyReward = async () => {
    try {
      // Check if already collected today
      const lastCollection = localStorage.getItem("lastDailyRewardCollection")
      const today = new Date().toDateString()

      if (lastCollection === today) {
        toast({
          title: "Already Collected",
          description: "You've already collected your daily reward today. Come back tomorrow!",
        })
        return
      }

      // Award XP
      const xpAwarded = 25 // Base daily reward

      // Check streak
      const streak = getLoginStreak()
      let streakBonus = 0

      if (streak > 1) {
        streakBonus = Math.min(25, streak * 5) // Cap at 25 bonus points

        toast({
          title: `Daily Reward: +${xpAwarded + streakBonus} XP`,
          description: `${xpAwarded} base + ${streakBonus} streak bonus (${streak} day streak)!`,
        })
      } else {
        toast({
          title: `Daily Reward: +${xpAwarded} XP`,
          description: "Come back tomorrow for a streak bonus!",
        })
      }

      // Update last collection date
      localStorage.setItem("lastDailyRewardCollection", today)
    } catch (error) {
      console.error("Error collecting daily reward:", error)
      toast({
        title: "Error",
        description: "Failed to collect your daily reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper functions
  const checkAndUpdateBackerTier = () => {
    if (!stats) return

    // Mock backer tiers
    const tiers: BackerTier[] = [
      {
        id: "novice-backer",
        name: "Novice Backer",
        description: "You've started your backing journey.",
        minimumPoints: 0,
        benefits: ["Access to basic features"],
        icon: "seedling",
        color: "green",
      },
      {
        id: "regular-backer",
        name: "Regular Backer",
        description: "You're regularly supporting projects.",
        minimumPoints: 100,
        benefits: ["5% bonus on contributions", "Early access to new projects"],
        icon: "leaf",
        color: "emerald",
      },
      {
        id: "expert-backer",
        name: "Expert Backer",
        description: "You're an experienced project backer.",
        minimumPoints: 500,
        benefits: ["10% bonus on contributions", "Special profile badge", "Monthly rewards"],
        icon: "tree",
        color: "teal",
      },
      {
        id: "legendary-backer",
        name: "Legendary Backer",
        description: "Your support is legendary in the community.",
        minimumPoints: 2000,
        benefits: [
          "15% bonus on all contributions",
          "VIP access to projects",
          "Exclusive rewards",
          "Direct contact with creators",
        ],
        icon: "award",
        color: "cyan",
      },
    ]

    // Determine current tier based on points
    const currentPoints = stats.totalAmountContributed / 2 // Simplified calculation
    let newTier = tiers[0]

    for (let i = tiers.length - 1; i >= 0; i--) {
      if (currentPoints >= tiers[i].minimumPoints) {
        newTier = tiers[i]
        break
      }
    }

    // Check if tier has changed
    if (!backerTier || backerTier.id !== newTier.id) {
      setBackerTier(newTier)

      // Notify user if it's an upgrade
      if (backerTier && newTier.minimumPoints > backerTier.minimumPoints) {
        toast({
          title: "Tier Upgraded!",
          description: `You are now a ${newTier.name}! Enjoy new benefits.`,
        })
      }
    }
  }

  const checkAndUpdateCreatorTier = () => {
    if (!stats) return

    // Mock creator tiers
    const tiers: CreatorTier[] = [
      {
        id: "novice-creator",
        name: "Novice Creator",
        description: "You've started your creator journey.",
        minimumProjectsCreated: 0,
        minimumFundsRaised: 0,
        benefits: ["Access to basic creator tools"],
        icon: "edit",
        color: "purple",
      },
      {
        id: "established-creator",
        name: "Established Creator",
        description: "You're building a reputation as a creator.",
        minimumProjectsCreated: 2,
        minimumFundsRaised: 1000,
        benefits: ["5% lower platform fees", "Featured in creator spotlight"],
        icon: "edit-3",
        color: "indigo",
      },
      {
        id: "expert-creator",
        name: "Expert Creator",
        description: "You're an experienced project creator.",
        minimumProjectsCreated: 5,
        minimumFundsRaised: 5000,
        benefits: ["10% lower platform fees", "Creator badge", "Priority support"],
        icon: "pen-tool",
        color: "blue",
      },
      {
        id: "legendary-creator",
        name: "Legendary Creator",
        description: "Your projects have made a significant impact.",
        minimumProjectsCreated: 10,
        minimumFundsRaised: 20000,
        benefits: [
          "15% lower platform fees",
          "VIP creator status",
          "Mentorship program access",
          "Early access to platform features",
        ],
        icon: "award",
        color: "cyan",
      },
    ]

    // Determine current tier
    let newTier = tiers[0]

    for (let i = tiers.length - 1; i >= 0; i--) {
      if (
        stats.projectsCreated >= tiers[i].minimumProjectsCreated &&
        stats.totalAmountContributed >= tiers[i].minimumFundsRaised
      ) {
        newTier = tiers[i]
        break
      }
    }

    // Check if tier has changed
    if (!creatorTier || creatorTier.id !== newTier.id) {
      setCreatorTier(newTier)

      // Notify user if it's an upgrade
      if (
        creatorTier &&
        (newTier.minimumProjectsCreated > creatorTier.minimumProjectsCreated ||
          newTier.minimumFundsRaised > creatorTier.minimumFundsRaised)
      ) {
        toast({
          title: "Creator Tier Upgraded!",
          description: `You are now a ${newTier.name}! Enjoy new creator benefits.`,
        })
      }
    }
  }

  const checkMilestones = () => {
    if (!stats) return

    setMilestones((prev) =>
      prev.map((milestone) => {
        // Check if milestone should be marked as reached
        if (!milestone.reached && stats.totalAmountContributed >= milestone.target) {
          // This milestone has just been reached
          toast({
            title: "Milestone Achieved!",
            description: `You've reached the "${milestone.name}" milestone!`,
          })

          return {
            ...milestone,
            reached: true,
            reachedAt: new Date().toISOString(),
          }
        }
        return milestone
      }),
    )
  }

  const updateBadgeProgress = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((badge) => {
        if (badge.id === badgeId && !badge.unlockedAt) {
          // Update progress for this badge
          const currentProgress = badge.progress?.current || 0
          const targetProgress = badge.progress?.target || 1

          if (currentProgress + 1 >= targetProgress) {
            // Badge unlocked
            toast({
              title: "Badge Unlocked!",
              description: `You've earned the ${badge.name} badge!`,
            })

            return {
              ...badge,
              unlockedAt: new Date().toISOString(),
            }
          } else {
            // Progress updated
            return {
              ...badge,
              progress: {
                current: currentProgress + 1,
                target: targetProgress,
              },
            }
          }
        }
        return badge
      }),
    )
  }

  const getBadgeName = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId)
    return badge ? badge.name : "Unknown Badge"
  }

  const getLoginStreak = () => {
    try {
      const streakData = JSON.parse(localStorage.getItem("loginStreak") || '{"days":0,"lastLogin":""}')
      const today = new Date().toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      if (streakData.lastLogin === yesterday) {
        // Consecutive day
        streakData.days += 1
      } else if (streakData.lastLogin !== today) {
        // Streak broken
        streakData.days = 1
      }

      streakData.lastLogin = today
      localStorage.setItem("loginStreak", JSON.stringify(streakData))

      return streakData.days
    } catch (error) {
      console.error("Error calculating login streak:", error)
      return 1
    }
  }

  // Mock data generators
  const getMockStats = (): CrowdfundingStats => {
    return {
      totalAmountContributed: 2350,
      projectsBacked: 7,
      projectsCreated: 1,
      milestonesMet: 3,
      averageContribution: 335.71,
      largestContribution: 750,
      longestFundingStreak: 4,
      currentFundingStreak: 2,
      lastContributionDate: "2023-05-12T14:30:00Z",
      contributionsByCategory: {
        DeFi: 850,
        NFT: 500,
        Infrastructure: 750,
        Gaming: 250,
      },
      referrals: 3,
    }
  }

  const getMockBackerTier = (): BackerTier => {
    return {
      id: "regular-backer",
      name: "Regular Backer",
      description: "You're regularly supporting projects.",
      minimumPoints: 100,
      benefits: ["5% bonus on contributions", "Early access to new projects"],
      icon: "leaf",
      color: "emerald",
    }
  }

  const getMockCreatorTier = (): CreatorTier => {
    return {
      id: "novice-creator",
      name: "Novice Creator",
      description: "You've started your creator journey.",
      minimumProjectsCreated: 0,
      minimumFundsRaised: 0,
      benefits: ["Access to basic creator tools"],
      icon: "edit",
      color: "purple",
    }
  }

  const getMockMilestones = (): FundingMilestone[] => {
    return [
      {
        id: "first-contribution",
        name: "First Steps",
        description: "Make your first contribution to any project",
        target: 1,
        reached: true,
        reachedAt: "2023-04-10T09:15:00Z",
        reward: {
          description: "Welcome badge and starter bonus",
          badgeId: "first-contribution",
          points: 50,
        },
      },
      {
        id: "contributor-500",
        name: "Dedicated Backer",
        description: "Contribute a total of 500 ECE to projects",
        target: 500,
        reached: true,
        reachedAt: "2023-04-25T16:30:00Z",
        reward: {
          description: "Dedicated Backer badge and points",
          badgeId: "dedicated-backer",
          points: 100,
        },
      },
      {
        id: "contributor-1000",
        name: "Major Supporter",
        description: "Contribute a total of 1,000 ECE to projects",
        target: 1000,
        reached: true,
        reachedAt: "2023-05-10T11:45:00Z",
        reward: {
          description: "Major Supporter badge, points, and exclusive avatar frame",
          badgeId: "major-supporter",
          points: 200,
          specialItem: "Exclusive Avatar Frame",
        },
      },
      {
        id: "contributor-5000",
        name: "Angel Investor",
        description: "Contribute a total of 5,000 ECE to projects",
        target: 5000,
        reached: false,
        reward: {
          description: "Angel Investor badge, major point bonus, and early access to premium projects",
          badgeId: "angel-investor",
          points: 500,
          specialItem: "Early Access to Premium Projects",
        },
      },
      {
        id: "contributor-10000",
        name: "Visionary Patron",
        description: "Contribute a total of 10,000 ECE to projects",
        target: 10000,
        reached: false,
        reward: {
          description: "Visionary Patron badge, huge point bonus, and exclusive community membership",
          badgeId: "visionary-patron",
          points: 1000,
          specialItem: "Exclusive Community Membership",
        },
      },
    ]
  }

  const getMockBadges = (): CrowdfundingBadge[] => {
    return [
      {
        id: "first-contribution",
        name: "First Steps",
        description: "Made your first contribution to any project",
        icon: "award",
        tier: "bronze",
        category: "backer",
        unlockedAt: "2023-04-10T09:15:00Z",
        rarity: "common",
      },
      {
        id: "dedicated-backer",
        name: "Dedicated Backer",
        description: "Contributed a total of 500 ECE to projects",
        icon: "shield",
        tier: "silver",
        category: "backer",
        unlockedAt: "2023-04-25T16:30:00Z",
        rarity: "uncommon",
      },
      {
        id: "major-supporter",
        name: "Major Supporter",
        description: "Contributed a total of 1,000 ECE to projects",
        icon: "star",
        tier: "silver",
        category: "backer",
        unlockedAt: "2023-05-10T11:45:00Z",
        rarity: "uncommon",
      },
      {
        id: "angel-investor",
        name: "Angel Investor",
        description: "Contributed a total of 5,000 ECE to projects",
        icon: "award",
        tier: "gold",
        category: "backer",
        rarity: "rare",
      },
      {
        id: "visionary-patron",
        name: "Visionary Patron",
        description: "Contributed a total of 10,000 ECE to projects",
        icon: "award",
        tier: "platinum",
        category: "backer",
        rarity: "epic",
      },
      {
        id: "project-creator",
        name: "Project Creator",
        description: "Created your first crowdfunding project",
        icon: "edit",
        tier: "bronze",
        category: "creator",
        unlockedAt: "2023-04-28T14:20:00Z",
        rarity: "common",
      },
      {
        id: "category-explorer",
        name: "Category Explorer",
        description: "Backed projects in at least 3 different categories",
        icon: "compass",
        tier: "silver",
        category: "backer",
        unlockedAt: "2023-05-05T10:30:00Z",
        rarity: "uncommon",
      },
      {
        id: "early-bird",
        name: "Early Bird",
        description: "Backed 3 projects in their first day",
        icon: "sunrise",
        tier: "silver",
        category: "backer",
        progress: {
          current: 2,
          target: 3,
        },
        rarity: "uncommon",
      },
      {
        id: "project-promoter",
        name: "Project Promoter",
        description: "Shared 10 projects on social media",
        icon: "share-2",
        tier: "silver",
        category: "community",
        progress: {
          current: 7,
          target: 10,
        },
        rarity: "uncommon",
      },
      {
        id: "referral-networker",
        name: "Referral Networker",
        description: "Referred 5 friends who backed projects",
        icon: "users",
        tier: "gold",
        category: "community",
        progress: {
          current: 3,
          target: 5,
        },
        rarity: "rare",
      },
    ]
  }

  const getMockEvents = (): CrowdfundingEvent[] => {
    const now = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(now.getDate() + 7)

    return [
      {
        id: "defi-festival",
        name: "DeFi Innovation Festival",
        description: "Back DeFi projects during this week-long event to earn bonus rewards and exclusive badges.",
        startDate: now.toISOString(),
        endDate: nextWeek.toISOString(),
        rewards: {
          points: 100,
          badges: ["defi-enthusiast"],
          specialRewards: ["Limited Edition DeFi NFT"],
        },
        requirements: [
          "Back at least one DeFi project during the event",
          "Share at least one DeFi project on social media",
        ],
        participants: 156,
        completed: false,
      },
      {
        id: "creator-spotlight",
        name: "Creator Spotlight: Emerging Talent",
        description: "Discover and support first-time project creators in this special event.",
        startDate: now.toISOString(),
        endDate: nextWeek.toISOString(),
        rewards: {
          points: 75,
          badges: ["talent-scout"],
          specialRewards: ["Early Access to Next Spotlight Projects"],
        },
        requirements: [
          "Back at least one project from a first-time creator",
          "Leave constructive feedback on the project",
        ],
        participants: 87,
        completed: false,
      },
      {
        id: "infrastructure-week",
        name: "Infrastructure Innovation Week",
        description: "Focus on groundbreaking infrastructure projects this week for special rewards.",
        startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        rewards: {
          points: 125,
          badges: ["infrastructure-pioneer"],
          specialRewards: ["Access to Infrastructure Projects Webinar"],
        },
        requirements: ["Back at least one infrastructure project", "Share the event with your network"],
        participants: 0,
        completed: false,
      },
    ]
  }

  const getMockLeaderboards = (): Record<string, CrowdfundingLeaderboard> => {
    return {
      dailyContributions: {
        timeframe: "daily",
        category: "contributions",
        entries: [
          {
            userId: "user123",
            username: "BlockchainBacker",
            avatar: "/diverse-user-avatars.png",
            points: 450,
            level: 5,
            achievements: 12,
            rank: 1,
            change: 2,
          },
          {
            userId: "user456",
            username: "CryptoContributor",
            avatar: "/diverse-user-avatars.png",
            points: 350,
            level: 4,
            achievements: 8,
            rank: 2,
            change: -1,
          },
          {
            userId: "user789",
            username: "TokenSupporter",
            avatar: "/diverse-user-avatars.png",
            points: 300,
            level: 3,
            achievements: 5,
            rank: 3,
            change: 0,
          },
        ],
      },
      weeklyCreators: {
        timeframe: "weekly",
        category: "projectsCreated",
        entries: [
          {
            userId: "user789",
            username: "InnovationDeveloper",
            avatar: "/diverse-user-avatars.png",
            points: 1200,
            level: 6,
            achievements: 15,
            rank: 1,
            change: 0,
          },
          {
            userId: "user234",
            username: "BlockchainBuilder",
            avatar: "/diverse-user-avatars.png",
            points: 950,
            level: 5,
            achievements: 10,
            rank: 2,
            change: 1,
          },
          {
            userId: "user567",
            username: "CryptoCreator",
            avatar: "/diverse-user-avatars.png",
            points: 800,
            level: 4,
            achievements: 7,
            rank: 3,
            change: -1,
          },
        ],
      },
    }
  }

  const getMockTrendingProjects = (): GamifiedProject[] => {
    return [
      {
        id: 1,
        title: "Decentralized Identity Solution",
        backerCount: 78,
        fundingPercentage: 65,
        gamificationBonus: {
          type: "trending",
          bonusPoints: 10,
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        },
      },
      {
        id: 2,
        title: "Cross-Chain DeFi Protocol",
        backerCount: 142,
        fundingPercentage: 85,
        gamificationBonus: {
          type: "almostFunded",
          bonusPoints: 15,
          endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
        },
      },
      {
        id: 3,
        title: "NFT Gaming Platform",
        backerCount: 95,
        fundingPercentage: 72,
        gamificationBonus: {
          type: "communityFavorite",
          bonusPoints: 12,
        },
      },
    ]
  }

  return (
    <CrowdfundingGamificationContext.Provider
      value={{
        stats,
        backerTier,
        creatorTier,
        milestones,
        badges,
        events,
        leaderboards,
        trendingProjects,
        isLoading,
        trackContribution,
        trackProjectCreation,
        trackReferral,
        claimMilestoneReward,
        participateInEvent,
        refreshStats,
        shareProject,
        collectDailyReward,
      }}
    >
      {children}
    </CrowdfundingGamificationContext.Provider>
  )
}

export const useCrowdfundingGamification = () => {
  const context = useContext(CrowdfundingGamificationContext)
  if (context === undefined) {
    throw new Error("useCrowdfundingGamification must be used within a CrowdfundingGamificationProvider")
  }
  return context
}
