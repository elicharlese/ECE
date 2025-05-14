"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitHubRepositoryCard } from "@/components/integrations/github-repository-card"
import { VercelDeploymentCard } from "@/components/integrations/vercel-deployment-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useDemo } from "@/lib/demo-context"
import { Skeleton } from "@/components/ui/skeleton"
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  RefreshCw,
  Rocket,
  Package,
  ArrowRight,
  ShoppingCart,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

// Mock data for demonstration
import { mockGitHubRepository, mockVercelProject } from "@/lib/demo-data"

export default function ProjectDashboardPage() {
  const { toast } = useToast()
  const { isDemoMode } = useDemo()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  // In a real app, you would fetch the user's projects from your API
  // For now, we'll assume no projects exist for real users
  const hasProjects = isDemoMode

  const handleRefresh = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Dashboard Refreshed",
        description: "Project information has been updated.",
      })
    }, 1500)
  }

  const handleRedeploy = (deploymentId: string) => {
    toast({
      title: "Redeployment Initiated",
      description: `Redeploying build ${deploymentId.substring(0, 8)}...`,
    })
  }

  const handleGoToMarketplace = () => {
    router.push("/app/marketplace")
  }

  // Render null state when no projects exist
  const renderNullState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
          <Package className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">No Projects Yet</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Purchase your first blockchain application to start building. Once you have a project, you'll be able to track
          its GitHub repository and Vercel deployments here.
        </p>
        <div className="grid gap-4 w-full max-w-md">
          <Button className="w-full" size="lg" onClick={() => router.push("/app/order")}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Order Your App
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or explore demo</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              toast({
                title: "Demo Mode",
                description: "This would enable demo mode to explore the dashboard features.",
              })
            }
          >
            View Demo Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // If no projects exist and not in demo mode, show null state
  if (!hasProjects && !isDemoMode) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
            <p className="text-muted-foreground">Monitor your project's GitHub repository and Vercel deployments</p>
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="p-0">{renderNullState()}</CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Ready to Build?
              </CardTitle>
              <CardDescription>Get started with your first blockchain application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Browse our marketplace to find the perfect blockchain application for your needs. We offer a variety of
                applications, from DeFi protocols to NFT platforms.
              </p>
              <Button className="w-full" onClick={handleGoToMarketplace}>
                Go to Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                What You'll Get
              </CardTitle>
              <CardDescription>Benefits of our blockchain applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">GitHub repository with complete source code</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">Automatic Vercel deployment setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">Comprehensive documentation and support</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">Regular updates and security patches</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
          <p className="text-muted-foreground">Monitor your project's GitHub repository and Vercel deployments</p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="vercel">Vercel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  GitHub Repository
                </CardTitle>
                <CardDescription>View your repository details, commits, and pull requests</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Repository</h3>
                      <p className="text-sm text-muted-foreground">
                        {mockGitHubRepository.owner}/{mockGitHubRepository.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <GitCommit className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{mockGitHubRepository.commits.length} recent commits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitPullRequest className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{mockGitHubRepository.pullRequests.length} pull requests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">{mockGitHubRepository.branches?.length || 3} branches</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("github")}>
                      View Repository Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Vercel Deployments
                </CardTitle>
                <CardDescription>Monitor your deployment status and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Latest Deployment</h3>
                      <p className="text-sm text-muted-foreground">
                        {mockVercelProject.latestDeployment?.name || "No deployments yet"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            mockVercelProject.latestDeployment?.status === "ready"
                              ? "bg-green-500"
                              : mockVercelProject.latestDeployment?.status === "building"
                                ? "bg-blue-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm capitalize">
                          {mockVercelProject.latestDeployment?.status || "No status"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{mockVercelProject.deployments.length} total deployments</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("vercel")}>
                      View Deployment Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your project</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {[...mockGitHubRepository.commits, ...mockVercelProject.deployments]
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime(),
                    )
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                        {"message" in item ? (
                          // This is a commit
                          <>
                            <GitCommit className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium">{item.message}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.author.name} committed {new Date(item.date).toLocaleString()}
                              </p>
                            </div>
                          </>
                        ) : (
                          // This is a deployment
                          <>
                            <Rocket className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Deployment {item.status} {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github">
          <GitHubRepositoryCard repository={mockGitHubRepository} onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="vercel">
          <VercelDeploymentCard project={mockVercelProject} onRefresh={handleRefresh} onRedeploy={handleRedeploy} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
