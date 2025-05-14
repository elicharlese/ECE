import type {
  Repository,
  RepositoryStats,
  RepositoryComparison,
  RepositoryComparisonRequest,
  RepositoryComparisonResponse,
} from "@/types/repository"

export const repositoryService = {
  async getRepositories(): Promise<Repository[]> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return mockRepositories
  },

  async getRepositoryById(id: string): Promise<Repository | null> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockRepositories.find((repo) => repo.id === id) || null
  },

  async getRepositoryStats(repositoryId: string): Promise<RepositoryStats | null> {
    // In a real implementation, this would be an API call
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    const mockStats = mockRepositoryStats[repositoryId]
    return mockStats || null
  },

  async compareRepositories(request: RepositoryComparisonRequest): Promise<RepositoryComparisonResponse> {
    // In a real implementation, this would be an API call
    console.log("Comparing repositories:", request)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Get repositories
      const repositories: Repository[] = []
      const stats: Record<string, RepositoryStats> = {}

      for (const repoId of request.repositories) {
        const repo = await this.getRepositoryById(repoId)
        if (!repo) {
          return {
            success: false,
            message: `Repository not found: ${repoId}`,
          }
        }

        repositories.push(repo)

        if (request.includeStats) {
          const repoStats = await this.getRepositoryStats(repoId)
          if (repoStats) {
            stats[repoId] = repoStats
          }
        }
      }

      if (repositories.length < 2) {
        return {
          success: false,
          message: "At least two repositories are required for comparison",
        }
      }

      // Generate mock comparison data
      const comparison: RepositoryComparison = {
        repositories,
        stats,
        commonFiles: ["README.md", "package.json", "tsconfig.json", "src/index.ts", "src/components/Button.tsx"],
        uniqueFiles: {
          [repositories[0].id]: [
            "src/features/unique-feature-a.ts",
            "src/components/FeatureA.tsx",
            "docs/feature-a.md",
          ],
          [repositories[1].id]: [
            "src/features/unique-feature-b.ts",
            "src/components/FeatureB.tsx",
            "docs/feature-b.md",
          ],
        },
        fileComparisons: [
          {
            path: "package.json",
            differences: {
              additions: 15,
              deletions: 10,
              changes: 25,
            },
            diffUrl: "#",
          },
          {
            path: "src/index.ts",
            differences: {
              additions: 5,
              deletions: 3,
              changes: 8,
            },
            diffUrl: "#",
          },
          {
            path: "src/components/Button.tsx",
            differences: {
              additions: 20,
              deletions: 15,
              changes: 35,
            },
            diffUrl: "#",
          },
        ],
        activityComparison: [
          {
            period: "Last Week",
            commits: {
              [repositories[0].id]: 12,
              [repositories[1].id]: 8,
            },
            pullRequests: {
              [repositories[0].id]: 5,
              [repositories[1].id]: 3,
            },
            issues: {
              [repositories[0].id]: 7,
              [repositories[1].id]: 4,
            },
          },
          {
            period: "Last Month",
            commits: {
              [repositories[0].id]: 45,
              [repositories[1].id]: 32,
            },
            pullRequests: {
              [repositories[0].id]: 18,
              [repositories[1].id]: 12,
            },
            issues: {
              [repositories[0].id]: 25,
              [repositories[1].id]: 15,
            },
          },
          {
            period: "Last Quarter",
            commits: {
              [repositories[0].id]: 120,
              [repositories[1].id]: 95,
            },
            pullRequests: {
              [repositories[0].id]: 48,
              [repositories[1].id]: 35,
            },
            issues: {
              [repositories[0].id]: 65,
              [repositories[1].id]: 42,
            },
          },
        ],
      }

      // Add performance metrics if requested
      if (request.includePerformance) {
        comparison.performanceMetrics = {
          buildTime: {
            [repositories[0].id]: 45, // seconds
            [repositories[1].id]: 38,
          },
          testCoverage: {
            [repositories[0].id]: 87, // percentage
            [repositories[1].id]: 92,
          },
          codeQuality: {
            [repositories[0].id]: {
              bugs: 5,
              vulnerabilities: 2,
              codeSmells: 15,
              duplications: 3.5, // percentage
            },
            [repositories[1].id]: {
              bugs: 3,
              vulnerabilities: 1,
              codeSmells: 10,
              duplications: 2.8,
            },
          },
        }
      }

      return {
        success: true,
        comparison,
      }
    } catch (error) {
      console.error("Error comparing repositories:", error)
      return {
        success: false,
        message: "Failed to compare repositories",
      }
    }
  },
}

// Mock data
const mockRepositories: Repository[] = [
  {
    id: "repo-001",
    name: "next-auth",
    owner: "nextjs-corp",
    description: "Authentication for Next.js",
    url: "https://github.com/nextjs-corp/next-auth",
    stars: 15200,
    forks: 1800,
    openIssues: 85,
    watchers: 320,
    defaultBranch: "main",
    createdAt: "2020-01-15T10:30:00Z",
    updatedAt: "2023-05-20T14:25:00Z",
    language: "TypeScript",
    isPrivate: false,
    size: 12500,
    topics: ["authentication", "nextjs", "react", "oauth"],
    license: "MIT",
    hasWiki: true,
    hasPages: true,
    hasProjects: true,
    hasDownloads: true,
    archived: false,
    disabled: false,
    visibility: "public",
  },
  {
    id: "repo-002",
    name: "next-auth-fork",
    owner: "acme-org",
    description: "Customized fork of Next.js Authentication",
    url: "https://github.com/acme-org/next-auth-fork",
    stars: 45,
    forks: 12,
    openIssues: 5,
    watchers: 8,
    defaultBranch: "main",
    createdAt: "2022-03-10T09:15:00Z",
    updatedAt: "2023-05-18T11:20:00Z",
    language: "TypeScript",
    isPrivate: false,
    size: 13200,
    topics: ["authentication", "nextjs", "react", "oauth", "custom"],
    license: "MIT",
    hasWiki: false,
    hasPages: false,
    hasProjects: true,
    hasDownloads: true,
    archived: false,
    disabled: false,
    visibility: "public",
  },
  {
    id: "repo-003",
    name: "blockchain-wallet",
    owner: "acme-org",
    description: "Secure blockchain wallet implementation",
    url: "https://github.com/acme-org/blockchain-wallet",
    stars: 320,
    forks: 45,
    openIssues: 12,
    watchers: 28,
    defaultBranch: "main",
    createdAt: "2021-07-22T15:45:00Z",
    updatedAt: "2023-05-15T10:10:00Z",
    language: "TypeScript",
    isPrivate: false,
    size: 8700,
    topics: ["blockchain", "wallet", "cryptocurrency", "web3"],
    license: "MIT",
    hasWiki: true,
    hasPages: true,
    hasProjects: true,
    hasDownloads: true,
    archived: false,
    disabled: false,
    visibility: "public",
  },
  {
    id: "repo-004",
    name: "smart-contracts",
    owner: "acme-org",
    description: "Collection of smart contracts for various use cases",
    url: "https://github.com/acme-org/smart-contracts",
    stars: 180,
    forks: 35,
    openIssues: 8,
    watchers: 15,
    defaultBranch: "main",
    createdAt: "2021-09-05T11:30:00Z",
    updatedAt: "2023-05-10T09:45:00Z",
    language: "Solidity",
    isPrivate: false,
    size: 5400,
    topics: ["smart-contracts", "solidity", "ethereum", "blockchain"],
    license: "MIT",
    hasWiki: true,
    hasPages: false,
    hasProjects: true,
    hasDownloads: true,
    archived: false,
    disabled: false,
    visibility: "public",
  },
  {
    id: "repo-005",
    name: "defi-protocol",
    owner: "acme-org",
    description: "Decentralized finance protocol implementation",
    url: "https://github.com/acme-org/defi-protocol",
    stars: 520,
    forks: 85,
    openIssues: 25,
    watchers: 45,
    defaultBranch: "main",
    createdAt: "2021-05-12T14:20:00Z",
    updatedAt: "2023-05-05T16:30:00Z",
    language: "TypeScript",
    isPrivate: false,
    size: 15800,
    topics: ["defi", "finance", "blockchain", "ethereum", "web3"],
    license: "MIT",
    hasWiki: true,
    hasPages: true,
    hasProjects: true,
    hasDownloads: true,
    archived: false,
    disabled: false,
    visibility: "public",
  },
]

// Mock repository stats
const mockRepositoryStats: Record<string, RepositoryStats> = {
  "repo-001": {
    commitCount: 1250,
    contributorCount: 85,
    branchCount: 12,
    releaseCount: 25,
    pullRequestCount: 450,
    openPullRequestCount: 15,
    closedPullRequestCount: 420,
    mergedPullRequestCount: 415,
    issueCount: 850,
    openIssueCount: 85,
    closedIssueCount: 765,
    lastCommitDate: "2023-05-20T10:15:00Z",
    averageTimeToMerge: 36, // hours
    averageTimeToClose: 48, // hours
    codeFrequency: [
      { date: "2023-04-23", additions: 1200, deletions: 800 },
      { date: "2023-04-30", additions: 950, deletions: 650 },
      { date: "2023-05-07", additions: 1500, deletions: 1100 },
      { date: "2023-05-14", additions: 1800, deletions: 1200 },
    ],
    languageBreakdown: [
      { language: "TypeScript", percentage: 78.5, color: "#3178c6" },
      { language: "JavaScript", percentage: 12.3, color: "#f1e05a" },
      { language: "CSS", percentage: 5.8, color: "#563d7c" },
      { language: "HTML", percentage: 3.4, color: "#e34c26" },
    ],
  },
  "repo-002": {
    commitCount: 320,
    contributorCount: 8,
    branchCount: 5,
    releaseCount: 6,
    pullRequestCount: 85,
    openPullRequestCount: 5,
    closedPullRequestCount: 75,
    mergedPullRequestCount: 70,
    issueCount: 45,
    openIssueCount: 5,
    closedIssueCount: 40,
    lastCommitDate: "2023-05-18T09:30:00Z",
    averageTimeToMerge: 24, // hours
    averageTimeToClose: 36, // hours
    codeFrequency: [
      { date: "2023-04-23", additions: 350, deletions: 200 },
      { date: "2023-04-30", additions: 420, deletions: 280 },
      { date: "2023-05-07", additions: 380, deletions: 250 },
      { date: "2023-05-14", additions: 450, deletions: 300 },
    ],
    languageBreakdown: [
      { language: "TypeScript", percentage: 82.1, color: "#3178c6" },
      { language: "JavaScript", percentage: 10.5, color: "#f1e05a" },
      { language: "CSS", percentage: 4.2, color: "#563d7c" },
      { language: "HTML", percentage: 3.2, color: "#e34c26" },
    ],
  },
  "repo-003": {
    commitCount: 580,
    contributorCount: 15,
    branchCount: 8,
    releaseCount: 12,
    pullRequestCount: 120,
    openPullRequestCount: 12,
    closedPullRequestCount: 100,
    mergedPullRequestCount: 98,
    issueCount: 150,
    openIssueCount: 12,
    closedIssueCount: 138,
    lastCommitDate: "2023-05-15T08:45:00Z",
    averageTimeToMerge: 30, // hours
    averageTimeToClose: 42, // hours
    codeFrequency: [
      { date: "2023-04-23", additions: 580, deletions: 320 },
      { date: "2023-04-30", additions: 620, deletions: 380 },
      { date: "2023-05-07", additions: 540, deletions: 290 },
      { date: "2023-05-14", additions: 680, deletions: 420 },
    ],
    languageBreakdown: [
      { language: "TypeScript", percentage: 75.8, color: "#3178c6" },
      { language: "JavaScript", percentage: 15.2, color: "#f1e05a" },
      { language: "CSS", percentage: 6.5, color: "#563d7c" },
      { language: "HTML", percentage: 2.5, color: "#e34c26" },
    ],
  },
  "repo-004": {
    commitCount: 320,
    contributorCount: 12,
    branchCount: 6,
    releaseCount: 8,
    pullRequestCount: 85,
    openPullRequestCount: 8,
    closedPullRequestCount: 72,
    mergedPullRequestCount: 70,
    issueCount: 95,
    openIssueCount: 8,
    closedIssueCount: 87,
    lastCommitDate: "2023-05-10T07:30:00Z",
    averageTimeToMerge: 28, // hours
    averageTimeToClose: 40, // hours
    codeFrequency: [
      { date: "2023-04-23", additions: 280, deletions: 150 },
      { date: "2023-04-30", additions: 320, deletions: 180 },
      { date: "2023-05-07", additions: 250, deletions: 120 },
      { date: "2023-05-14", additions: 350, deletions: 200 },
    ],
    languageBreakdown: [
      { language: "Solidity", percentage: 85.3, color: "#AA6746" },
      { language: "JavaScript", percentage: 8.7, color: "#f1e05a" },
      { language: "TypeScript", percentage: 4.5, color: "#3178c6" },
      { language: "Python", percentage: 1.5, color: "#3572A5" },
    ],
  },
  "repo-005": {
    commitCount: 780,
    contributorCount: 25,
    branchCount: 10,
    releaseCount: 15,
    pullRequestCount: 220,
    openPullRequestCount: 25,
    closedPullRequestCount: 185,
    mergedPullRequestCount: 180,
    issueCount: 280,
    openIssueCount: 25,
    closedIssueCount: 255,
    lastCommitDate: "2023-05-05T14:20:00Z",
    averageTimeToMerge: 32, // hours
    averageTimeToClose: 44, // hours
    codeFrequency: [
      { date: "2023-04-23", additions: 850, deletions: 520 },
      { date: "2023-04-30", additions: 920, deletions: 580 },
      { date: "2023-05-07", additions: 780, deletions: 480 },
      { date: "2023-05-14", additions: 950, deletions: 620 },
    ],
    languageBreakdown: [
      { language: "TypeScript", percentage: 68.5, color: "#3178c6" },
      { language: "Solidity", percentage: 20.3, color: "#AA6746" },
      { language: "JavaScript", percentage: 8.7, color: "#f1e05a" },
      { language: "CSS", percentage: 2.5, color: "#563d7c" },
    ],
  },
}
