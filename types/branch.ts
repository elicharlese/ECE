export interface Branch {
  id: string
  name: string
  lastCommitId: string
  lastCommitMessage: string
  lastCommitAuthor: string
  lastCommitDate: string
  isDefault: boolean
  isProtected: boolean
  aheadBy?: number
  behindBy?: number
}

export interface BranchComparison {
  base: Branch
  compare: Branch
  commits: BranchCommit[]
  files: BranchFile[]
  stats: BranchComparisonStats
  diffText?: string
}

export interface BranchCommit {
  id: string
  message: string
  author: string
  date: string
  avatarUrl?: string
}

export interface BranchFile {
  filename: string
  status: "added" | "modified" | "removed"
  additions: number
  deletions: number
  changes: number
}

export interface BranchComparisonStats {
  commits: number
  files: number
  additions: number
  deletions: number
  mergeStatus: "clean" | "conflicts" | "unknown"
}
