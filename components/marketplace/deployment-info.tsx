import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Server,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ArrowUpCircle,
  GitCommit,
  User,
  Calendar,
  Activity,
  Cpu,
  HardDrive,
  BarChart,
  Timer,
} from "lucide-react"

interface DeploymentInfoProps {
  productId: string
}

export function DeploymentInfo({ productId }: DeploymentInfoProps) {
  // In a real app, this would fetch data from an API
  // For demo purposes, we'll use mock data
  const deploymentData = {
    environments: {
      production: {
        status: "healthy",
        uptime: "99.98%",
        version: "v1.2.3",
        url: "https://product-" + productId + ".example.com",
        lastDeployed: "2 days ago",
        performance: {
          cpu: 32,
          memory: 45,
          requests: 1243,
          responseTime: 187,
        },
        healthChecks: {
          api: "healthy",
          database: "healthy",
          cache: "healthy",
          worker: "degraded",
        },
      },
      staging: {
        status: "degraded",
        uptime: "98.76%",
        version: "v1.3.0-beta",
        url: "https://staging-product-" + productId + ".example.com",
        lastDeployed: "6 hours ago",
        performance: {
          cpu: 56,
          memory: 72,
          requests: 342,
          responseTime: 210,
        },
        healthChecks: {
          api: "healthy",
          database: "degraded",
          cache: "healthy",
          worker: "healthy",
        },
      },
    },
    deploymentHistory: [
      {
        id: "dep-123",
        environment: "production",
        status: "success",
        version: "v1.2.3",
        timestamp: "2 days ago",
        commit: "8f7e6d5",
        author: "jane.doe",
        message: "Fix security vulnerability in authentication flow",
      },
      {
        id: "dep-122",
        environment: "staging",
        status: "success",
        version: "v1.3.0-beta",
        timestamp: "6 hours ago",
        commit: "3a4b5c6",
        author: "john.smith",
        message: "Add new contract templates and improve gas optimization",
      },
      {
        id: "dep-121",
        environment: "staging",
        status: "failed",
        version: "v1.3.0-alpha",
        timestamp: "1 day ago",
        commit: "1f2e3d4",
        author: "john.smith",
        message: "Implement new transaction batching feature",
      },
      {
        id: "dep-120",
        environment: "production",
        status: "success",
        version: "v1.2.2",
        timestamp: "1 week ago",
        commit: "7g8h9i0",
        author: "jane.doe",
        message: "Performance improvements for large-scale transactions",
      },
    ],
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        )
      case "degraded":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        )
      case "down":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Down
          </Badge>
        )
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="production" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="staging">Staging</TabsTrigger>
        </TabsList>

        {Object.entries(deploymentData.environments).map(([env, data]) => (
          <TabsContent key={env} value={env} className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <Server className="mr-2 h-5 w-5" />
                      {env.charAt(0).toUpperCase() + env.slice(1)} Environment
                    </h2>
                    <div className="flex items-center mt-2">
                      {getStatusBadge(data.status)}
                      <span className="text-sm text-muted-foreground ml-2">Last deployed {data.lastDeployed}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Globe className="mr-1 h-4 w-4" />
                      <span>Visit Site</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <RotateCcw className="mr-1 h-4 w-4" />
                      <span>Redeploy</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-muted/50 rounded-md">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">URL</div>
                      <div className="font-medium text-sm truncate">{data.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-muted/50 rounded-md">
                    <ArrowUpCircle className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                      <div className="font-medium">{data.uptime}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-muted/50 rounded-md">
                    <GitCommit className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Version</div>
                      <div className="font-medium">{data.version}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Cpu className="h-4 w-4 mr-2 text-primary" />
                          <span>CPU Usage</span>
                        </div>
                        <span className="text-sm font-medium">{data.performance.cpu}%</span>
                      </div>
                      <Progress value={data.performance.cpu} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 mr-2 text-primary" />
                          <span>Memory Usage</span>
                        </div>
                        <span className="text-sm font-medium">{data.performance.memory}%</span>
                      </div>
                      <Progress value={data.performance.memory} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BarChart className="h-4 w-4 mr-2 text-primary" />
                          <span>Requests/min</span>
                        </div>
                        <span className="text-sm font-medium">{data.performance.requests}</span>
                      </div>
                      <Progress value={(data.performance.requests / 2000) * 100} max={100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Timer className="h-4 w-4 mr-2 text-primary" />
                          <span>Avg Response Time</span>
                        </div>
                        <span className="text-sm font-medium">{data.performance.responseTime}ms</span>
                      </div>
                      <Progress value={100 - (data.performance.responseTime / 500) * 100} max={100} className="h-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Health Checks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(data.healthChecks).map(([service, status]) => (
                      <div key={service} className="p-3 bg-muted/50 rounded-md">
                        <div className="text-sm font-medium capitalize mb-1">{service}</div>
                        <div>{getStatusBadge(status)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recent Deployments
          </h3>
          <div className="space-y-4">
            {deploymentData.deploymentHistory.map((deployment) => (
              <div key={deployment.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center">
                    {getStatusBadge(deployment.status)}
                    <Badge variant="outline" className="ml-2">
                      {deployment.environment}
                    </Badge>
                    <span className="ml-2 font-medium">{deployment.version}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {deployment.timestamp}
                  </div>
                </div>
                <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                  <div className="flex items-center">
                    <GitCommit className="h-3 w-3 mr-1 text-primary" />
                    <span className="font-mono">{deployment.commit}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {deployment.author}
                  </div>
                  <div className="text-muted-foreground truncate">{deployment.message}</div>
                </div>
                <div className="mt-3 flex gap-2 justify-end">
                  <Button variant="ghost" size="sm">
                    <span>Details</span>
                  </Button>
                  {deployment.status === "success" && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      <span>Rollback</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
