"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { GitHubRepositoryCard, type GitHubRepository } from "./github-repository-card"
import { VercelDeploymentCard, type VercelProject } from "./vercel-deployment-card"
import { GitHubWebhookEvents } from "./github-webhook-events"
import { VercelWebhookEvents } from "./vercel-webhook-events"
import { IntegrationSettings } from "./integration-settings"
import { Cog, RefreshCw, CodeIcon as VercelLogoIcon, Bell, Github } from "lucide-react"

// Mock data for GitHub repositories
const mockGitHubRepositories: GitHubRepository[] = [
  {
    name: "ece-app",
    owner: "yourusername",
    description: "ECE application with marketplace, crowdfunding, and wallet features",
    url: "https://github.com/yourusername/ece-app",
    stars: 42,
    forks: 12,
    watchers: 8,
    defaultBranch: "main",
    branches: ["main", "develop", "feature/wallet", "feature/marketplace"],
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    commits: [
      {
        id: "c1",
        message: "Add wallet balance display and transaction history",
        author: {
          name: "Jane Developer",
          avatar: "/diverse-group.png",
          username: "janedeveloper",
        },
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        sha: "a1b2c3d4e5f6g7h8i9j0",
        branch: "feature/wallet",
      },
      {
        id: "c2",
        message: "Fix responsive layout issues on marketplace page",
        author: {
          name: "John Coder",
          avatar: "/diverse-group.png",
          username: "johncoder",
        },
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        sha: "b2c3d4e5f6g7h8i9j0k1",
        branch: "feature/marketplace",
      },
      {
        id: "c3",
        message: "Merge pull request #15 from feature/wallet",
        author: {
          name: "Team Lead",
          avatar: "/diverse-group.png",
          username: "teamlead",
        },
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        sha: "c3d4e5f6g7h8i9j0k1l2",
        branch: "main",
      },
    ],
    pullRequests: [
      {
        id: "pr1",
        title: "Add marketplace search functionality",
        number: 16,
        author: {
          name: "John Coder",
          avatar: "/diverse-group.png",
          username: "johncoder",
        },
        status: "open",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        branch: "feature/marketplace",
        targetBranch: "develop",
        comments: 3,
      },
      {
        id: "pr2",
        title: "Implement wallet notifications",
        number: 15,
        author: {
          name: "Jane Developer",
          avatar: "/diverse-group.png",
          username: "janedeveloper",
        },
        status: "merged",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        branch: "feature/wallet",
        targetBranch: "main",
        comments: 5,
      },
    ],
    issues: [
      {
        id: "i1",
        title: "Mobile navigation menu not working on iOS",
        number: 23,
        author: {
          name: "QA Tester",
          avatar: "/diverse-group.png",
          username: "qatester",
        },
        status: "open",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        labels: [
          { name: "bug", color: "d73a4a" },
          { name: "mobile", color: "0075ca" },
          { name: "priority: high", color: "b60205" },
        ],
        comments: 2,
        assignees: [
          {
            name: "John Coder",
            avatar: "/diverse-group.png",
            username: "johncoder",
          },
        ],
      },
      {
        id: "i2",
        title: "Add dark mode support",
        number: 22,
        author: {
          name: "UI Designer",
          avatar: "/diverse-group.png",
          username: "uidesigner",
        },
        status: "closed",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        labels: [
          { name: "enhancement", color: "a2eeef" },
          { name: "ui", color: "7057ff" },
        ],
        comments: 4,
        assignees: [
          {
            name: "Jane Developer",
            avatar: "/diverse-group.png",
            username: "janedeveloper",
          },
        ],
      },
    ],
  },
]

// Mock data for Vercel projects
const mockVercelProjects: VercelProject[] = [
  {
    id: "proj_1",
    name: "ece-app",
    framework: "Next.js",
    url: "https://vercel.com/yourusername/ece-app",
    productionBranch: "main",
    team: {
      name: "Your Team",
      slug: "your-team",
    },
    domains: [
      { name: "ece-app.vercel.app", verified: true, primary: true },
      { name: "ece-app.com", verified: true, primary: false },
      { name: "www.ece-app.com", verified: true, primary: false },
    ],
    latestDeployment: {
      id: "dpl_1",
      url: "https://ece-app.vercel.app",
      name: "Production Deployment",
      status: "ready",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      readyAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
      branch: "main",
      commit: {
        sha: "a1b2c3d4e5f6g7h8i9j0",
        message: "Merge pull request #15 from feature/wallet",
        author: "teamlead",
      },
      meta: {
        buildTime: 120000, // 2 minutes
        region: "sfo1",
        framework: "Next.js",
        nodeVersion: "18.x",
      },
    },
    deployments: [
      {
        id: "dpl_1",
        url: "https://ece-app.vercel.app",
        name: "Production Deployment",
        status: "ready",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        readyAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
        branch: "main",
        commit: {
          sha: "a1b2c3d4e5f6g7h8i9j0",
          message: "Merge pull request #15 from feature/wallet",
          author: "teamlead",
        },
        meta: {
          buildTime: 120000, // 2 minutes
          region: "sfo1",
          framework: "Next.js",
          nodeVersion: "18.x",
        },
        buildLogs: [
          { timestamp: "12:30:15", message: "Build started", type: "info" },
          { timestamp: "12:30:45", message: "Installing dependencies", type: "info" },
          { timestamp: "12:31:30", message: "Running build command", type: "info" },
          { timestamp: "12:32:15", message: "Build completed", type: "info" },
        ],
      },
      {
        id: "dpl_2",
        url: "https://feature-marketplace-ece-app.vercel.app",
        name: "Preview Deployment",
        status: "ready",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        readyAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(), // 23.5 hours ago
        branch: "feature/marketplace",
        commit: {
          sha: "b2c3d4e5f6g7h8i9j0k1",
          message: "Fix responsive layout issues on marketplace page",
          author: "johncoder",
        },
        meta: {
          buildTime: 105000, // 1.75 minutes
          region: "sfo1",
          framework: "Next.js",
          nodeVersion: "18.x",
        },
      },
      {
        id: "dpl_3",
        url: "",
        name: "Preview Deployment",
        status: "error",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        branch: "feature/experimental",
        commit: {
          sha: "d4e5f6g7h8i9j0k1l2m3",
          message: "Experimental feature implementation",
          author: "janedeveloper",
        },
        meta: {
          region: "sfo1",
          framework: "Next.js",
          nodeVersion: "18.x",
        },
        buildLogs: [
          { timestamp: "09:15:10", message: "Build started", type: "info" },
          { timestamp: "09:15:40", message: "Installing dependencies", type: "info" },
          { timestamp: "09:16:25", message: "Running build command", type: "info" },
          { timestamp: "09:17:05", message: "Error: Module not found", type: "error" },
          { timestamp: "09:17:06", message: "Build failed", type: "error" },
        ],
      },
    ],
  },
]

export function IntegrationDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [gitHubRepositories, setGitHubRepositories] = useState(mockGitHubRepositories)
  const [vercelProjects, setVercelProjects] = useState(mockVercelProjects)

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call to refresh data
    setTimeout(() => {
      // In a real app, this would fetch fresh data from the APIs
      setIsRefreshing(false)

      toast({
        title: "Data Refreshed",
        description: "Integration data has been updated.",
      })
    }, 1500)
  }

  const handleRedeployVercel = (deploymentId: string) => {
    toast({
      title: "Redeployment Initiated",
      description: "The deployment has been queued for rebuild.",
    })
  }

  const handleSaveSettings = (settings: any) => {
    // In a real app, this would save the settings to the backend
    setShowSettings(false)
  }

  return (
    <div className="space-y-6">
      {showSettings ? (
        <IntegrationSettings onSave={handleSaveSettings} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Integrations Dashboard</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Cog className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </TabsTrigger>
              <TabsTrigger value="vercel" className="flex items-center gap-2">
                <VercelLogoIcon className="h-4 w-4" />
                Vercel
              </TabsTrigger>
              <TabsTrigger value="github-webhooks" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                GitHub Webhooks
              </TabsTrigger>
              <TabsTrigger value="vercel-webhooks" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Vercel Webhooks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                  <CardDescription>Overview of your connected services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Github className="h-5 w-5" />
                        <h3 className="font-medium">GitHub</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {gitHubRepositories.length} repositories connected
                      </p>
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span>Open Pull Requests</span>
                          <span className="font-medium">
                            {gitHubRepositories.reduce(
                              (count, repo) => count + repo.pullRequests.filter((pr) => pr.status === "open").length,
                              0,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>Open Issues</span>
                          <span className="font-medium">
                            {gitHubRepositories.reduce(
                              (count, repo) => count + repo.issues.filter((issue) => issue.status === "open").length,
                              0,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Recent Commits</span>
                          <span className="font-medium">
                            {gitHubRepositories.reduce((count, repo) => count + repo.commits.length, 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <VercelLogoIcon className="h-5 w-5" />
                        <h3 className="font-medium">Vercel</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{vercelProjects.length} projects connected</p>
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span>Active Deployments</span>
                          <span className="font-medium">
                            {vercelProjects.reduce(
                              (count, project) =>
                                count + project.deployments.filter((d) => d.status === "ready").length,
                              0,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>Failed Deployments</span>
                          <span className="font-medium">
                            {vercelProjects.reduce(
                              (count, project) =>
                                count + project.deployments.filter((d) => d.status === "error").length,
                              0,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Custom Domains</span>
                          <span className="font-medium">
                            {vercelProjects.reduce(
                              (count, project) =>
                                count + project.domains.filter((d) => !d.name.includes("vercel.app")).length,
                              0,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6">
                {gitHubRepositories.map((repo) => (
                  <GitHubRepositoryCard key={repo.name} repository={repo} onRefresh={handleRefresh} />
                ))}
                {vercelProjects.map((project) => (
                  <VercelDeploymentCard
                    key={project.id}
                    project={project}
                    onRefresh={handleRefresh}
                    onRedeploy={handleRedeployVercel}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="github" className="mt-0 space-y-6">
              {gitHubRepositories.map((repo) => (
                <GitHubRepositoryCard key={repo.name} repository={repo} onRefresh={handleRefresh} />
              ))}
            </TabsContent>

            <TabsContent value="vercel" className="mt-0 space-y-6">
              {vercelProjects.map((project) => (
                <VercelDeploymentCard
                  key={project.id}
                  project={project}
                  onRefresh={handleRefresh}
                  onRedeploy={handleRedeployVercel}
                />
              ))}
            </TabsContent>

            <TabsContent value="github-webhooks" className="mt-0 space-y-6">
              <GitHubWebhookEvents />
            </TabsContent>

            <TabsContent value="vercel-webhooks" className="mt-0 space-y-6">
              <VercelWebhookEvents />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
