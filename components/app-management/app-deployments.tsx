"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clock,
  Code,
  GitBranch,
  Loader2,
  RotateCcw,
  Rocket,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppDeploymentsProps {
  app: any // Using any for simplicity, but should be properly typed
}

export function AppDeployments({ app }: AppDeploymentsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("history")
  const [isDeploying, setIsDeploying] = useState(false)
  const [openDeploymentId, setOpenDeploymentId] = useState<string | null>(null)
  const [deployDialogOpen, setDeployDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(app.repository.branch)
  const [deploymentMessage, setDeploymentMessage] = useState("")

  const handleDeploy = () => {
    setDeployDialogOpen(false)
    setIsDeploying(true)

    // Simulate deployment
    toast({
      title: "Deployment started",
      description: `Deploying ${selectedBranch} branch...`,
    })

    setTimeout(() => {
      setIsDeploying(false)
      toast({
        title: "Deployment successful",
        description: "Your app has been deployed successfully.",
      })
    }, 3000)
  }

  const handleRollback = (deploymentId: string) => {
    toast({
      title: "Rollback initiated",
      description: `Rolling back to deployment ${deploymentId.substring(0, 8)}...`,
    })
  }

  const toggleDeploymentDetails = (deploymentId: string) => {
    setOpenDeploymentId(openDeploymentId === deploymentId ? null : deploymentId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Deployments</h2>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isDeploying}>
            <GitBranch className="mr-2 h-4 w-4" />
            View Branches
          </Button>
          <Dialog open={deployDialogOpen} onOpenChange={setDeployDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Deploy
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deploy Application</DialogTitle>
                <DialogDescription>Deploy your application to the production environment.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">main</SelectItem>
                      <SelectItem value="develop">develop</SelectItem>
                      <SelectItem value="feature/new-ui">feature/new-ui</SelectItem>
                      <SelectItem value="hotfix/auth-issue">hotfix/auth-issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Deployment Message (optional)</Label>
                  <Input
                    id="message"
                    placeholder="Enter a message for this deployment"
                    value={deploymentMessage}
                    onChange={(e) => setDeploymentMessage(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeployDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDeploy}>
                  <Rocket className="mr-2 h-4 w-4" />
                  Deploy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="history">Deployment History</TabsTrigger>
          <TabsTrigger value="settings">Deployment Settings</TabsTrigger>
          <TabsTrigger value="hooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {app.deployments.map((deployment: any, index: number) => (
                  <Collapsible
                    key={deployment.id}
                    open={openDeploymentId === deployment.id}
                    onOpenChange={() => toggleDeploymentDetails(deployment.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {getDeploymentStatusIcon(deployment.status)}
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{deployment.version}</span>
                            {index === 0 && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Latest
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{formatDate(deployment.timestamp)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getDeploymentStatusVariant(deployment.status)}>{deployment.status}</Badge>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="border-t p-4 bg-muted/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Deployment Details</h4>
                            <dl className="space-y-1">
                              <div className="flex justify-between">
                                <dt className="text-sm text-muted-foreground">Commit</dt>
                                <dd className="text-sm font-mono">{deployment.commit.substring(0, 7)}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-muted-foreground">Branch</dt>
                                <dd className="text-sm">{deployment.branch}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-muted-foreground">Author</dt>
                                <dd className="text-sm">{deployment.author}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-muted-foreground">Duration</dt>
                                <dd className="text-sm">{deployment.duration}s</dd>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Commit Message</h4>
                            <p className="text-sm bg-muted p-2 rounded">{deployment.message}</p>
                            <div className="flex justify-end mt-4 gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                  <Code className="mr-2 h-4 w-4" />
                                  View Code
                                </a>
                              </Button>
                              {index > 0 && (
                                <Button variant="outline" size="sm" onClick={() => handleRollback(deployment.id)}>
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Rollback
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Settings</CardTitle>
              <CardDescription>Configure how your application is deployed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Production Branch</Label>
                  <Select defaultValue="main">
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">main</SelectItem>
                      <SelectItem value="master">master</SelectItem>
                      <SelectItem value="production">production</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Changes to this branch will be automatically deployed to production.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Preview Branches</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All branches</SelectItem>
                      <SelectItem value="pr">Pull requests only</SelectItem>
                      <SelectItem value="none">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Control which branches get preview deployments.</p>
                </div>

                <div className="space-y-2">
                  <Label>Build Command</Label>
                  <Input defaultValue="npm run build" />
                  <p className="text-sm text-muted-foreground">The command used to build your application.</p>
                </div>

                <div className="space-y-2">
                  <Label>Output Directory</Label>
                  <Input defaultValue=".next" />
                  <p className="text-sm text-muted-foreground">The directory where your build output is located.</p>
                </div>

                <div className="space-y-2">
                  <Label>Node.js Version</Label>
                  <Select defaultValue="18.x">
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20.x">20.x (Latest)</SelectItem>
                      <SelectItem value="18.x">18.x (LTS)</SelectItem>
                      <SelectItem value="16.x">16.x</SelectItem>
                      <SelectItem value="14.x">14.x</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The Node.js version used to build and run your application.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hooks">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Webhooks</CardTitle>
              <CardDescription>Configure webhooks to notify external services about deployments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Slack Notifications</h3>
                      <p className="text-sm text-muted-foreground">Send deployment notifications to Slack</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Webhook URL: https://hooks.slack.com/services/T0****/B0****/***
                    </p>
                  </div>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Discord Notifications</h3>
                      <p className="text-sm text-muted-foreground">Send deployment notifications to Discord</p>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Webhook URL: https://discord.com/api/webhooks/***</p>
                  </div>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>

                <Button className="w-full">Add Webhook</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function getDeploymentStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "building":
    case "queued":
      return <Clock className="h-5 w-5 text-blue-500" />
    case "failed":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "canceled":
      return <XCircle className="h-5 w-5 text-amber-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />
  }
}

function getDeploymentStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "success":
      return "default"
    case "building":
    case "queued":
      return "secondary"
    case "failed":
    case "canceled":
      return "destructive"
    default:
      return "outline"
  }
}
