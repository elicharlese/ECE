"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { ProjectRepositoryInfo } from "@/components/project/project-repository-info"
import { ProjectDeploymentInfo } from "@/components/project/project-deployment-info"

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch project details
    const fetchProject = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockProject = {
          id: id as string,
          name: `Blockchain Project ${id}`,
          description:
            "A comprehensive blockchain solution for enterprise needs with smart contract capabilities and secure transaction processing.",
          status: "In Progress",
          progress: 65,
          startDate: "2023-09-15",
          endDate: "2024-03-15",
          budget: 75000,
          spent: 42500,
          client: "TechCorp Industries",
          team: [
            { id: "1", name: "Jane Smith", role: "Project Manager" },
            { id: "2", name: "John Doe", role: "Lead Developer" },
            { id: "3", name: "Alice Johnson", role: "Blockchain Architect" },
            { id: "4", name: "Bob Williams", role: "Smart Contract Developer" },
            { id: "5", name: "Carol Brown", role: "QA Engineer" },
          ],
          milestones: [
            { id: "m1", name: "Project Kickoff", status: "completed", date: "2023-09-15" },
            { id: "m2", name: "Architecture Design", status: "completed", date: "2023-10-30" },
            { id: "m3", name: "Core Development", status: "in-progress", date: "2023-12-15" },
            { id: "m4", name: "Testing Phase", status: "pending", date: "2024-01-30" },
            { id: "m5", name: "Deployment", status: "pending", date: "2024-02-28" },
            { id: "m6", name: "Project Handover", status: "pending", date: "2024-03-15" },
          ],
          risks: [
            { id: "r1", name: "Technical Complexity", severity: "high", mitigation: "Regular architecture reviews" },
            { id: "r2", name: "Resource Availability", severity: "medium", mitigation: "Cross-training team members" },
            { id: "r3", name: "Regulatory Changes", severity: "medium", mitigation: "Ongoing compliance monitoring" },
          ],
        }

        setProject(mockProject)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-muted rounded-lg"></div>
            <div className="h-40 bg-muted rounded-lg"></div>
            <div className="h-40 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
              <p className="text-muted-foreground">
                The project you are looking for does not exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
      case "in-progress":
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">In Progress</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-4 flex items-center" onClick={() => router.back()}>
        <span className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </span>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <div className="flex items-center gap-2 mb-2">
          {getStatusBadge(project.status)}
          <span className="text-muted-foreground">
            <Calendar className="inline-block mr-1 h-4 w-4" />
            {project.startDate} to {project.endDate}
          </span>
        </div>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repository">Repository</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Budget: ${project.budget.toLocaleString()}</span>
                        <span>Spent: ${project.spent.toLocaleString()}</span>
                      </div>
                      <Progress value={(project.spent / project.budget) * 100} className="h-2 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.team.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-muted-foreground">{member.role}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Risks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.risks.map((risk: any) => (
                      <div key={risk.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{risk.name}</span>
                          {getSeverityBadge(risk.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone: any, index: number) => (
                    <div key={milestone.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{milestone.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {milestone.date}
                          </div>
                        </div>
                        {getStatusBadge(milestone.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repository">
            <ProjectRepositoryInfo projectId={project.id} />
          </TabsContent>

          <TabsContent value="deployment">
            <ProjectDeploymentInfo projectId={project.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
