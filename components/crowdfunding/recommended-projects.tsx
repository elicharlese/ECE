"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, TrendingUp, Tag, Users, Clock } from "lucide-react"
import Link from "next/link"
import { demoCrowdfundingProjects } from "@/lib/demo-data"

interface RecommendedProjectsProps {
  currentProjectId?: number
  limit?: number
}

export function RecommendedProjects({ currentProjectId, limit = 6 }: RecommendedProjectsProps) {
  const [activeTab, setActiveTab] = useState("trending")

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
    // Log analytics event
    console.log("Recommended projects tab changed:", value)
  }, [])

  // Filter out current project if viewing a project detail page
  const allProjects = currentProjectId
    ? demoCrowdfundingProjects.filter((project) => project.id !== currentProjectId)
    : demoCrowdfundingProjects

  // Get projects based on active tab
  const getFilteredProjects = () => {
    const filteredProjects = [...allProjects]

    switch (activeTab) {
      case "trending":
        // Sort by backers count (higher is more trending)
        filteredProjects.sort((a, b) => b.backers - a.backers)
        break
      case "popular":
        // Sort by percentage funded (higher is more popular)
        filteredProjects.sort((a, b) => (b.raised / b.goal) * 100 - (a.raised / a.goal) * 100)
        break
      case "new":
        // Sort by creation date (newer first)
        filteredProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filteredProjects.slice(0, limit)
  }

  // Determine which shape to use based on project ID for variety
  const getShape = (projectId: number) => {
    const shapes = ["cube", "rounded", "cylinder", "torus", "sphere"]
    return shapes[projectId % shapes.length] as "cube" | "rounded" | "cylinder" | "torus" | "sphere"
  }

  // Generate tags based on project properties
  const getTags = (project: any) => {
    const tags = []

    // Add tags based on project properties
    if (project.tags && Array.isArray(project.tags)) {
      return project.tags.slice(0, 2) // Limit to 2 tags for space
    }

    // Fallback tags if project doesn't have tags property
    if (project.category === "DeFi") {
      tags.push("Finance", "Yield")
    } else if (project.category === "NFT") {
      tags.push("Art", "Gaming")
    } else if (project.category === "DAO") {
      tags.push("Governance", "Voting")
    } else if (project.category === "Infrastructure") {
      tags.push("Scaling", "Protocol")
    } else {
      tags.push("Blockchain", "Web3")
    }

    // Return a subset of tags (2 tags)
    return tags.slice(0, 2)
  }

  const projects = getFilteredProjects()

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Badge className="mb-2 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">Discover More</Badge>
          <h2 className="text-2xl md:text-3xl font-bold">Recommended Projects</h2>
        </div>
        <Tabs defaultValue="trending" value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="trending">
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
                Trending
              </span>
            </TabsTrigger>
            <TabsTrigger value="popular">
              <span className="flex items-center">
                <Flame className="h-4 w-4 mr-2" aria-hidden="true" />
                Popular
              </span>
            </TabsTrigger>
            <TabsTrigger value="new">
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-2" aria-hidden="true" />
                New
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="overflow-hidden bg-card border shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] group"
          >
            <div className="h-40 bg-primary/5 flex items-center justify-center overflow-hidden">
              <img
                src={`/placeholder.svg?height=160&width=300&query=${project.title} blockchain project concept`}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-muted/50 hover:bg-muted">
                  {project.category}
                </Badge>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span className="text-sm">{project.daysLeft} days left</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

              {/* Tags section */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {getTags(project).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <span className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
                      {tag}
                    </span>
                  </Badge>
                ))}
              </div>

              <Progress
                value={(project.raised / project.goal) * 100}
                className="h-2 bg-muted"
                aria-label={`${Math.round((project.raised / project.goal) * 100)}% funded`}
              />
              <div className="flex justify-between text-xs mt-2 mb-3">
                <span className="font-medium">{Math.round((project.raised / project.goal) * 100)}% funded</span>
                <span className="font-medium">{project.raised.toLocaleString()} ECE</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span className="text-xs">{project.backers} backers</span>
                </div>
                <Button className="bg-primary hover:bg-primary/90" size="sm" asChild>
                  <Link href={`/crowdfunding/project/${project.id}`} aria-label={`View ${project.title} project page`}>
                    <span>View Project</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" asChild>
          <Link href="/crowdfunding/explore" aria-label="View all projects">
            <span className="flex items-center">View All Projects</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
