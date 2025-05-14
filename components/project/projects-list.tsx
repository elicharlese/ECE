"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Clock, Calendar, Users, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Project } from "./project-tracker"

interface ProjectsListProps {
  projects: Project[]
  onSelectProject: (projectId: string) => void
}

export function ProjectsList({ projects, onSelectProject }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Planning
          </Badge>
        )
      case "development":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            Development
          </Badge>
        )
      case "testing":
        return (
          <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
            Testing
          </Badge>
        )
      case "review":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            Review
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Completed
          </Badge>
        )
      case "on-hold":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            On Hold
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>New Project</Button>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No projects found. Try adjusting your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {getStatusBadge(project.status)}
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Started: {format(new Date(project.startDate), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Est. Completion: {format(new Date(project.estimatedEndDate), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Progress</span>
                      <span className="font-medium">
                        {Math.round(
                          (project.milestones
                            .filter((m) => m.paymentStatus === "paid")
                            .reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0) /
                            project.milestones.reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (project.milestones
                          .filter((m) => m.paymentStatus === "paid")
                          .reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0) /
                          project.milestones.reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0)) *
                          100,
                      )}
                      className="h-2 bg-blue-100 dark:bg-blue-900"
                    >
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${Math.round(
                            (project.milestones
                              .filter((m) => m.paymentStatus === "paid")
                              .reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0) /
                              project.milestones.reduce((sum, milestone) => sum + (milestone.paymentAmount || 0), 0)) *
                              100,
                          )}%`,
                        }}
                      />
                    </Progress>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="border-2 border-background w-6 h-6">
                        <AvatarImage src={member.avatar || `/placeholder.svg?height=24&width=24&query=person`} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium border-2 border-background">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onSelectProject(project.id)}>
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
