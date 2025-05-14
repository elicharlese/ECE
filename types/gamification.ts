export type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  category: "backer" | "creator" | "community" | "special"
  tier: "bronze" | "silver" | "gold" | "platinum"
  points: number
  unlockedAt?: string
  progress?: {
    current: number
    target: number
  }
}

export type UserLevel = {
  level: number
  title: string
  points: number
  pointsToNextLevel: number
  benefits: string[]
}

export type Quest = {
  id: string
  name: string
  description: string
  icon: string
  rewards: {
    points: number
    badges?: string[]
    specialRewards?: string[]
  }
  steps: {
    id: string
    description: string
    completed: boolean
  }[]
  expiresAt?: string
  completedAt?: string
}

export type LeaderboardEntry = {
  userId: string
  username: string
  avatar: string
  points: number
  level: number
  achievements: number
  rank: number
  change?: number // position change since last week
}

export type Streak = {
  current: number
  longest: number
  lastContribution: string
}

export type GamificationProfile = {
  userId: string
  username: string
  avatar: string
  level: UserLevel
  points: number
  achievements: Achievement[]
  quests: Quest[]
  streak: Streak
  totalContributions: number
  projectsBacked: number
  projectsCreated: number
}

// Crowdfunding-specific types
export type CrowdfundingStats = {
  totalAmountContributed: number
  projectsBacked: number
  projectsCreated: number
  milestonesMet: number
  averageContribution: number
  largestContribution: number
  longestFundingStreak: number
  currentFundingStreak: number
  lastContributionDate: string
  contributionsByCategory: Record<string, number>
  referrals: number
}

export type FundingMilestone = {
  id: string
  name: string
  description: string
  target: number
  reached: boolean
  reachedAt?: string
  reward?: {
    description: string
    badgeId?: string
    points?: number
    specialItem?: string
  }
}

export type BackerTier = {
  id: string
  name: string
  description: string
  minimumPoints: number
  benefits: string[]
  icon: string
  color: string
}

export type CreatorTier = {
  id: string
  name: string
  description: string
  minimumProjectsCreated: number
  minimumFundsRaised: number
  benefits: string[]
  icon: string
  color: string
}

export type CrowdfundingEvent = {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  rewards: {
    points: number
    badges?: string[]
    specialRewards?: string[]
  }
  requirements: string[]
  participants: number
  completed: boolean
}

export type CrowdfundingLeaderboard = {
  timeframe: "daily" | "weekly" | "monthly" | "allTime"
  category: "contributions" | "projectsCreated" | "referrals"
  entries: LeaderboardEntry[]
}

export type CrowdfundingBadge = {
  id: string
  name: string
  description: string
  icon: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  category: "backer" | "creator" | "community" | "special"
  unlockedAt?: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export type GamifiedProject = {
  id: number
  title: string
  backerCount: number
  fundingPercentage: number
  gamificationBonus?: {
    type: "trending" | "almostFunded" | "communityFavorite" | "staffPick"
    bonusPoints: number
    endTime?: string
  }
}
