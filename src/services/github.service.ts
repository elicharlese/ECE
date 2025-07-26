/**
 * GitHub Integration Service
 * Handles GitHub repository operations, CI/CD, and code management
 */

export interface GitHubRepository {
  id: string
  name: string
  fullName: string
  private: boolean
  htmlUrl: string
  cloneUrl: string
  sshUrl: string
  defaultBranch: string
  description?: string
  topics: string[]
  language: string
  size: number
  stargazersCount: number
  forksCount: number
  createdAt: Date
  updatedAt: Date
  pushedAt: Date
}

export interface GitHubBranch {
  name: string
  sha: string
  protected: boolean
  commit: {
    sha: string
    message: string
    author: {
      name: string
      email: string
      date: Date
    }
    committer: {
      name: string
      email: string
      date: Date
    }
  }
}

export interface GitHubCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: Date
  }
  committer: {
    name: string
    email: string
    date: Date
  }
  url: string
  htmlUrl: string
  stats: {
    additions: number
    deletions: number
    total: number
  }
  files: Array<{
    filename: string
    status: 'added' | 'modified' | 'removed' | 'renamed'
    additions: number
    deletions: number
    changes: number
    patch?: string
  }>
}

export interface GitHubPullRequest {
  id: string
  number: number
  title: string
  body: string
  state: 'open' | 'closed' | 'merged'
  htmlUrl: string
  head: {
    ref: string
    sha: string
  }
  base: {
    ref: string
    sha: string
  }
  user: {
    login: string
    avatarUrl: string
  }
  createdAt: Date
  updatedAt: Date
  mergedAt?: Date
}

export interface GitHubWorkflow {
  id: string
  name: string
  path: string
  state: 'active' | 'deleted'
  createdAt: Date
  updatedAt: Date
}

export interface GitHubWorkflowRun {
  id: string
  runNumber: number
  workflowId: string
  status: 'queued' | 'in_progress' | 'completed'
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out'
  htmlUrl: string
  createdAt: Date
  updatedAt: Date
  headSha: string
  headBranch: string
}

export class GitHubService {
  private readonly apiUrl = 'https://api.github.com'
  private readonly token = process.env.GITHUB_TOKEN
  private readonly organization = 'ece-platform' // Organization name
  
  // Repository operations
  
  /**
   * Create new repository for generated app
   */
  async createRepository(orderId: string, appName: string, isPrivate: boolean = true): Promise<GitHubRepository> {
    const repoName = this.sanitizeRepoName(`${appName}-${orderId}`)
    
    const repoData = {
      name: repoName,
      description: `Generated app: ${appName}`,
      private: isPrivate,
      auto_init: true,
      gitignore_template: 'Node',
      license_template: 'mit'
    }
    
    try {
      const response = await this.makeRequest('POST', '/user/repos', repoData)
      
      const repository: GitHubRepository = {
        id: response.id.toString(),
        name: response.name,
        fullName: response.full_name,
        private: response.private,
        htmlUrl: response.html_url,
        cloneUrl: response.clone_url,
        sshUrl: response.ssh_url,
        defaultBranch: response.default_branch,
        description: response.description,
        topics: response.topics || [],
        language: response.language || 'TypeScript',
        size: response.size,
        stargazersCount: response.stargazers_count,
        forksCount: response.forks_count,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
        pushedAt: new Date(response.pushed_at)
      }
      
      console.log(`📦 GitHub repository created: ${repository.fullName}`)
      
      // Set up repository with initial configuration
      await this.setupRepository(repository.fullName)
      
      return repository
    } catch (error) {
      console.error('Failed to create GitHub repository:', error)
      throw new Error(`GitHub repository creation failed: ${error}`)
    }
  }
  
  /**
   * Get repository information
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await this.makeRequest('GET', `/repos/${owner}/${repo}`)
      
      return {
        id: response.id.toString(),
        name: response.name,
        fullName: response.full_name,
        private: response.private,
        htmlUrl: response.html_url,
        cloneUrl: response.clone_url,
        sshUrl: response.ssh_url,
        defaultBranch: response.default_branch,
        description: response.description,
        topics: response.topics || [],
        language: response.language || 'TypeScript',
        size: response.size,
        stargazersCount: response.stargazers_count,
        forksCount: response.forks_count,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
        pushedAt: new Date(response.pushed_at)
      }
    } catch (error) {
      console.error('Failed to get GitHub repository:', error)
      throw new Error(`GitHub repository fetch failed: ${error}`)
    }
  }
  
  /**
   * Push generated code to repository
   */
  async pushCode(
    repoFullName: string,
    files: Array<{ path: string; content: string }>,
    commitMessage: string,
    branch: string = 'main'
  ): Promise<GitHubCommit> {
    try {
      // Get the current commit SHA
      const branchData = await this.makeRequest('GET', `/repos/${repoFullName}/branches/${branch}`)
      const parentSha = branchData.commit.sha
      
      // Create blobs for each file
      const blobs = await Promise.all(
        files.map(async (file) => {
          const blobResponse = await this.makeRequest('POST', `/repos/${repoFullName}/git/blobs`, {
            content: Buffer.from(file.content).toString('base64'),
            encoding: 'base64'
          })
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobResponse.sha
          }
        })
      )
      
      // Create tree
      const treeResponse = await this.makeRequest('POST', `/repos/${repoFullName}/git/trees`, {
        base_tree: parentSha,
        tree: blobs
      })
      
      // Create commit
      const commitResponse = await this.makeRequest('POST', `/repos/${repoFullName}/git/commits`, {
        message: commitMessage,
        tree: treeResponse.sha,
        parents: [parentSha]
      })
      
      // Update branch reference
      await this.makeRequest('PATCH', `/repos/${repoFullName}/git/refs/heads/${branch}`, {
        sha: commitResponse.sha
      })
      
      console.log(`📤 Code pushed to ${repoFullName}:${branch} - ${commitMessage}`)
      
      return {
        sha: commitResponse.sha,
        message: commitResponse.message,
        author: {
          name: commitResponse.author.name,
          email: commitResponse.author.email,
          date: new Date(commitResponse.author.date)
        },
        committer: {
          name: commitResponse.committer.name,
          email: commitResponse.committer.email,
          date: new Date(commitResponse.committer.date)
        },
        url: commitResponse.url,
        htmlUrl: commitResponse.html_url,
        stats: { additions: 0, deletions: 0, total: 0 }, // Would calculate from diff
        files: files.map(f => ({
          filename: f.path,
          status: 'added' as const,
          additions: f.content.split('\n').length,
          deletions: 0,
          changes: f.content.split('\n').length
        }))
      }
    } catch (error) {
      console.error('Failed to push code to GitHub:', error)
      throw new Error(`GitHub code push failed: ${error}`)
    }
  }
  
  /**
   * Create branch
   */
  async createBranch(repoFullName: string, branchName: string, fromBranch: string = 'main'): Promise<GitHubBranch> {
    try {
      // Get the source branch
      const sourceBranch = await this.makeRequest('GET', `/repos/${repoFullName}/branches/${fromBranch}`)
      
      // Create new branch
      await this.makeRequest('POST', `/repos/${repoFullName}/git/refs`, {
        ref: `refs/heads/${branchName}`,
        sha: sourceBranch.commit.sha
      })
      
      console.log(`🌿 Branch created: ${repoFullName}:${branchName}`)
      
      return {
        name: branchName,
        sha: sourceBranch.commit.sha,
        protected: false,
        commit: {
          sha: sourceBranch.commit.sha,
          message: sourceBranch.commit.commit.message,
          author: {
            name: sourceBranch.commit.commit.author.name,
            email: sourceBranch.commit.commit.author.email,
            date: new Date(sourceBranch.commit.commit.author.date)
          },
          committer: {
            name: sourceBranch.commit.commit.committer.name,
            email: sourceBranch.commit.commit.committer.email,
            date: new Date(sourceBranch.commit.commit.committer.date)
          }
        }
      }
    } catch (error) {
      console.error('Failed to create GitHub branch:', error)
      throw new Error(`GitHub branch creation failed: ${error}`)
    }
  }
  
  /**
   * Create pull request
   */
  async createPullRequest(
    repoFullName: string,
    title: string,
    body: string,
    head: string,
    base: string = 'main'
  ): Promise<GitHubPullRequest> {
    try {
      const response = await this.makeRequest('POST', `/repos/${repoFullName}/pulls`, {
        title,
        body,
        head,
        base
      })
      
      console.log(`🔀 Pull request created: ${repoFullName}#${response.number}`)
      
      return {
        id: response.id.toString(),
        number: response.number,
        title: response.title,
        body: response.body,
        state: response.state,
        htmlUrl: response.html_url,
        head: {
          ref: response.head.ref,
          sha: response.head.sha
        },
        base: {
          ref: response.base.ref,
          sha: response.base.sha
        },
        user: {
          login: response.user.login,
          avatarUrl: response.user.avatar_url
        },
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
        mergedAt: response.merged_at ? new Date(response.merged_at) : undefined
      }
    } catch (error) {
      console.error('Failed to create GitHub pull request:', error)
      throw new Error(`GitHub pull request creation failed: ${error}`)
    }
  }
  
  /**
   * Merge pull request
   */
  async mergePullRequest(
    repoFullName: string,
    pullNumber: number,
    commitTitle?: string,
    commitMessage?: string,
    mergeMethod: 'merge' | 'squash' | 'rebase' = 'squash'
  ): Promise<void> {
    try {
      await this.makeRequest('PUT', `/repos/${repoFullName}/pulls/${pullNumber}/merge`, {
        commit_title: commitTitle,
        commit_message: commitMessage,
        merge_method: mergeMethod
      })
      
      console.log(`🔀 Pull request merged: ${repoFullName}#${pullNumber}`)
    } catch (error) {
      console.error('Failed to merge GitHub pull request:', error)
      throw new Error(`GitHub pull request merge failed: ${error}`)
    }
  }
  
  // CI/CD Operations
  
  /**
   * Get repository workflows
   */
  async getWorkflows(repoFullName: string): Promise<GitHubWorkflow[]> {
    try {
      const response = await this.makeRequest('GET', `/repos/${repoFullName}/actions/workflows`)
      
      return response.workflows.map((workflow: any) => ({
        id: workflow.id.toString(),
        name: workflow.name,
        path: workflow.path,
        state: workflow.state,
        createdAt: new Date(workflow.created_at),
        updatedAt: new Date(workflow.updated_at)
      }))
    } catch (error) {
      console.error('Failed to get GitHub workflows:', error)
      throw new Error(`GitHub workflows fetch failed: ${error}`)
    }
  }
  
  /**
   * Trigger workflow
   */
  async triggerWorkflow(
    repoFullName: string,
    workflowId: string,
    ref: string = 'main',
    inputs?: Record<string, any>
  ): Promise<void> {
    try {
      await this.makeRequest('POST', `/repos/${repoFullName}/actions/workflows/${workflowId}/dispatches`, {
        ref,
        inputs
      })
      
      console.log(`🔄 Workflow triggered: ${repoFullName} - ${workflowId}`)
    } catch (error) {
      console.error('Failed to trigger GitHub workflow:', error)
      throw new Error(`GitHub workflow trigger failed: ${error}`)
    }
  }
  
  /**
   * Get workflow runs
   */
  async getWorkflowRuns(repoFullName: string, workflowId?: string): Promise<GitHubWorkflowRun[]> {
    try {
      const endpoint = workflowId 
        ? `/repos/${repoFullName}/actions/workflows/${workflowId}/runs`
        : `/repos/${repoFullName}/actions/runs`
      
      const response = await this.makeRequest('GET', endpoint)
      
      return response.workflow_runs.map((run: any) => ({
        id: run.id.toString(),
        runNumber: run.run_number,
        workflowId: run.workflow_id.toString(),
        status: run.status,
        conclusion: run.conclusion,
        htmlUrl: run.html_url,
        createdAt: new Date(run.created_at),
        updatedAt: new Date(run.updated_at),
        headSha: run.head_sha,
        headBranch: run.head_branch
      }))
    } catch (error) {
      console.error('Failed to get GitHub workflow runs:', error)
      throw new Error(`GitHub workflow runs fetch failed: ${error}`)
    }
  }
  
  /**
   * Set up repository with CI/CD workflows
   */
  async setupRepository(repoFullName: string): Promise<void> {
    const workflows = [
      {
        path: '.github/workflows/ci.yml',
        content: this.generateCIWorkflow()
      },
      {
        path: '.github/workflows/deploy.yml',
        content: this.generateDeployWorkflow()
      },
      {
        path: '.github/workflows/security.yml',
        content: this.generateSecurityWorkflow()
      }
    ]
    
    await this.pushCode(
      repoFullName,
      workflows,
      'Add CI/CD workflows and repository setup',
      'main'
    )
    
    // Set up branch protection rules
    await this.setupBranchProtection(repoFullName, 'main')
    
    console.log(`⚙️ Repository setup completed: ${repoFullName}`)
  }
  
  /**
   * Set up branch protection
   */
  async setupBranchProtection(repoFullName: string, branch: string): Promise<void> {
    try {
      await this.makeRequest('PUT', `/repos/${repoFullName}/branches/${branch}/protection`, {
        required_status_checks: {
          strict: true,
          contexts: ['build', 'test', 'security-scan']
        },
        enforce_admins: false,
        required_pull_request_reviews: {
          required_approving_review_count: 1,
          dismiss_stale_reviews: true,
          require_code_owner_reviews: false
        },
        restrictions: null
      })
      
      console.log(`🛡️ Branch protection enabled: ${repoFullName}:${branch}`)
    } catch (error) {
      console.error('Failed to set up branch protection:', error)
      // Don't throw - branch protection is optional
    }
  }
  
  /**
   * Add collaborator to repository
   */
  async addCollaborator(repoFullName: string, username: string, permission: 'pull' | 'push' | 'admin' = 'push'): Promise<void> {
    try {
      await this.makeRequest('PUT', `/repos/${repoFullName}/collaborators/${username}`, {
        permission
      })
      
      console.log(`👥 Collaborator added: ${username} to ${repoFullName}`)
    } catch (error) {
      console.error('Failed to add GitHub collaborator:', error)
      throw new Error(`GitHub collaborator addition failed: ${error}`)
    }
  }
  
  /**
   * Create repository from template
   */
  async createFromTemplate(
    templateOwner: string,
    templateRepo: string,
    newRepoName: string,
    newRepoOwner?: string,
    isPrivate: boolean = true
  ): Promise<GitHubRepository> {
    try {
      const response = await this.makeRequest('POST', `/repos/${templateOwner}/${templateRepo}/generate`, {
        owner: newRepoOwner || this.organization,
        name: newRepoName,
        description: `Generated from ${templateOwner}/${templateRepo}`,
        private: isPrivate
      })
      
      console.log(`📋 Repository created from template: ${response.full_name}`)
      
      return {
        id: response.id.toString(),
        name: response.name,
        fullName: response.full_name,
        private: response.private,
        htmlUrl: response.html_url,
        cloneUrl: response.clone_url,
        sshUrl: response.ssh_url,
        defaultBranch: response.default_branch,
        description: response.description,
        topics: response.topics || [],
        language: response.language || 'TypeScript',
        size: response.size,
        stargazersCount: response.stargazers_count,
        forksCount: response.forks_count,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
        pushedAt: new Date(response.pushed_at)
      }
    } catch (error) {
      console.error('Failed to create repository from template:', error)
      throw new Error(`GitHub template repository creation failed: ${error}`)
    }
  }
  
  // Private helper methods
  
  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.apiUrl}${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ECE-Platform-App-Generator'
      }
    }
    
    if (data) {
      options.body = JSON.stringify(data)
    }
    
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    return response.json()
  }
  
  private sanitizeRepoName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100) // GitHub repo name limit
  }
  
  private generateCIWorkflow(): string {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  test:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run security audit
      run: npm audit --audit-level high
    
    - name: Run dependency check
      uses: dependency-check/Dependency-Check_Action@main
      with:
        project: 'ECE-Generated-App'
        path: '.'
        format: 'ALL'
    
    - name: Upload security scan results
      uses: actions/upload-artifact@v3
      with:
        name: security-report
        path: reports/
`
  }
  
  private generateDeployWorkflow(): string {
    return `name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
    
    - name: Notify deployment success
      uses: 8398a7/action-slack@v3
      with:
        status: success
        webhook_url: \${{ secrets.SLACK_WEBHOOK }}
      if: success()
    
    - name: Notify deployment failure
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        webhook_url: \${{ secrets.SLACK_WEBHOOK }}
      if: failure()
`
  }
  
  private generateSecurityWorkflow(): string {
    return `name: Security Scan

on:
  schedule:
    - cron: '0 6 * * *' # Daily at 6 AM UTC
  workflow_dispatch:

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Run npm audit
      run: npm audit --json > audit-results.json || true
    
    - name: Upload audit results
      uses: actions/upload-artifact@v3
      with:
        name: security-audit
        path: audit-results.json
`
  }
}

// Export singleton instance
export const githubService = new GitHubService()
