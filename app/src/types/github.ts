export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  html_url: string
  clone_url: string
  ssh_url: string
  default_branch: string
  language: string | null
  languages: Record<string, number>
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  archived: boolean
  disabled: boolean
  visibility: 'public' | 'private' | 'internal'
  topics: string[]
  owner: {
    login: string
    id: number
    avatar_url: string
    type: 'User' | 'Organization'
  }
}

export interface PullRequest {
  id: number
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed' | 'merged'
  html_url: string
  created_at: string
  updated_at: string
  merged_at: string | null
  closed_at: string | null
  user: {
    login: string
    id: number
    avatar_url: string
  }
  head: {
    ref: string
    sha: string
    repo: Repository
  }
  base: {
    ref: string
    sha: string
    repo: Repository
  }
  mergeable: boolean | null
  mergeable_state: string
  merged_by: {
    login: string
    id: number
    avatar_url: string
  } | null
  comments: number
  review_comments: number
  commits: number
  additions: number
  deletions: number
  changed_files: number
}

export interface Issue {
  id: number
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed'
  html_url: string
  created_at: string
  updated_at: string
  closed_at: string | null
  user: {
    login: string
    id: number
    avatar_url: string
  }
  assignees: Array<{
    login: string
    id: number
    avatar_url: string
  }>
  labels: Array<{
    id: number
    name: string
    color: string
    description: string | null
  }>
  comments: number
  locked: boolean
  pull_request?: {
    url: string
    html_url: string
    diff_url: string
    patch_url: string
  }
}

export interface Branch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
  protection?: {
    enabled: boolean
    required_status_checks: {
      enforcement_level: string
      contexts: string[]
    }
  }
}

export interface Commit {
  sha: string
  url: string
  html_url: string
  author: {
    name: string
    email: string
    date: string
  }
  committer: {
    name: string
    email: string
    date: string
  }
  message: string
  tree: {
    sha: string
    url: string
  }
  parents: Array<{
    sha: string
    url: string
    html_url: string
  }>
  verification: {
    verified: boolean
    reason: string
    signature: string | null
    payload: string | null
  }
  stats?: {
    additions: number
    deletions: number
    total: number
  }
  files?: Array<{
    filename: string
    status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged'
    additions: number
    deletions: number
    changes: number
    blob_url: string
    raw_url: string
    contents_url: string
    patch?: string
  }>
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: 'User' | 'Bot' | 'Organization'
  site_admin: boolean
  name?: string
  company?: string | null
  blog?: string | null
  location?: string | null
  email?: string | null
  hireable?: boolean | null
  bio?: string | null
  twitter_username?: string | null
  public_repos?: number
  public_gists?: number
  followers?: number
  following?: number
  created_at?: string
  updated_at?: string
}

export interface GitHubError {
  message: string
  documentation_url?: string
  errors?: Array<{
    resource: string
    field: string
    code: string
  }>
}
