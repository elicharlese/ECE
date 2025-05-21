"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, X, ChevronRight, Calendar, Target } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useCallback } from "react"

export interface Milestone {
  id: number
  title: string
  description: string
  date: string
  completed: boolean
}

export interface ProjectWithMilestones {
  id: number
  title: string
  description: string
  image: string
  category: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  creator: {
    name: string
    avatar: string
  }
  milestones: Milestone[]
}

interface ProjectCardExpandedProps {
  project: ProjectWithMilestones
  onClose: () => void
}

export function ProjectCardExpanded({ project, onClose }: ProjectCardExpandedProps) {
  const progress = Math.round((project.raised / project.goal) * 100)

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onClose()
      // Log analytics event
      console.log("Project details closed:", project.id)
    },
    [onClose, project.id],
  )

  // Determine which shape to use based on project ID for variety
  const getShape = () => {
    const shapes = ["cube", "rounded", "cylinder", "torus", "sphere"]
    return shapes[project.id % shapes.length] as "cube" | "rounded" | "cylinder" | "torus" | "sphere"
  }

  return (
    <Card className="overflow-hidden bg-card border shadow-md">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
          onClick={handleClose}
          aria-label="Close project details"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="md:col-span-1 h-full">
            <div className="h-full bg-primary/5 flex items-center justify-center">
              <img
                src={`/placeholder.svg?height=300&width=300&query=${project.title} blockchain project detailed view`}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-2 p-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="bg-muted/50 hover:bg-muted">
                {project.category}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{project.daysLeft} days left</span>
              </div>
            </div>
            <h3 className="font-semibold text-2xl mb-3">{project.title}</h3>
            <p className="text-muted-foreground mb-6">{project.description}</p>

            <div className="mb-6">
              <Progress
                value={progress}
                className="h-2 bg-muted"
                aria-label={`${progress}% funded`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              />
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium">{progress}% funded</span>
                <span className="font-medium">
                  {project.raised.toLocaleString()} / {project.goal.toLocaleString()} ECE
                </span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Backers</p>
                      <p className="font-medium">{project.backers}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Goal</p>
                      <p className="font-medium">{project.goal.toLocaleString()} ECE</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={project.creator.avatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                    alt={project.creator.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <p className="font-medium">{project.creator.name}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="milestones" className="space-y-4">
                <div className="space-y-4">
                  {project.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                          milestone.completed ? "bg-green-500" : "bg-primary/20"
                        }`}
                      >
                        {milestone.completed ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <span className="text-xs text-primary">{milestone.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{milestone.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={handleClose} aria-label="Close project details">
                Close
              </Button>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link
                  href={`/crowdfunding/project/${project.id}`}
                  aria-label={`View ${project.title} project page`}
                  className="flex items-center"
                >
                  View Project <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
