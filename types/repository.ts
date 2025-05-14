export interface Repository {
  id: string
  name: string
  owner: string
  description: string
  url: string
  stars: number
  forks: number
  openIssues: number
  watchers: number
  defaultBranch: string
  createdAt: string
  updatedAt: string
  language: string
  isPrivate: boolean
  size: number // in KB
  topics: string[]
  license?: string
  hasWiki: boolean
  hasPages: boolean
  hasProjects: boolean
  hasDownloads: boolean
  archived: boolean
  disabled: boolean
  visibility: "public" | "private" | "internal"
}

export interface RepositoryStats {
  commitCount: number
  contributorCount: number
  branchCount: number
  releaseCount: number
  pullRequestCount: number
  openPullRequestCount: number
  closedPullRequestCount: number
  mergedPullRequestCount: number
  issueCount: number
  openIssueCount: number
  closedIssueCount: number
  lastCommitDate: string
  averageTimeToMerge?: number // in hours
  averageTimeToClose?: number // in hours
  codeFrequency: {
    date: string
    additions: number
    deletions: number
  }[]
  languageBreakdown: {
    language: string
    percentage: number
    color: string
  }[]
}

export interface RepositoryComparison {
  repositories: Repository[]
  stats: Record<string, RepositoryStats>
  commonFiles: string[]
  uniqueFiles: Record<string, string[]>
  fileComparisons: {
    path: string
    differences: {
      additions: number
      deletions: number
      changes: number
    }
    diffUrl?: string
  }[]
  activityComparison: {
    period: string
    commits: Record<string, number>
    pullRequests: Record<string, number>
    issues: Record<string, number>
  }[]
  performanceMetrics?: {
    buildTime: Record<string, number> // in seconds
    testCoverage: Record<string, number> // percentage
    codeQuality: Record<
      string,
      {
        bugs: number
        vulnerabilities: number
        codeSmells: number
        duplications: number // percentage
      }
    >
  }
}

export interface RepositoryComparisonRequest {
  repositories: string[] // repository IDs or full names (owner/repo)
  branch?: string
  includeDiff?: boolean
  includeStats?: boolean
  includePerformance?: boolean
  period?: "week" | "month" | "quarter" | "year"
}

export interface RepositoryComparisonResponse {
  success: boolean
  message?: string
  comparison?: RepositoryComparison
}
