"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChevronDown, Tag } from "lucide-react"
import Link from "next/link"
import type { ProjectWithMilestones } from "./project-card-expanded"
import { useCallback } from "react"
import { MatcapCard } from "@/components/3d/MatcapCard"
import { LazyImage } from "@/components/ui/lazy-image"

interface ProjectCardProps {
  project: ProjectWithMilestones
  featured?: boolean
  endingSoon?: boolean
  onExpand: () => void
  useMatcap?: boolean
}

export function ProjectCard({
  project,
  featured = false,
  endingSoon = false,
  onExpand,
  useMatcap = false,
}: ProjectCardProps) {
  const progress = Math.round((project.raised / project.goal) * 100)

  const handleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onExpand()
      // Log analytics event
      console.log("Project details button clicked:", project.id)
    },
    [onExpand, project.id],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onExpand()
        // Log analytics event
        console.log("Project details button activated via keyboard:", project.id)
      }
    },
    [onExpand, project.id],
  )

  // Determine which shape to use based on project ID for variety
  const getShape = () => {
    const shapes = ["cube", "rounded", "cylinder", "torus", "sphere"]
    return shapes[project.id % shapes.length] as "cube" | "rounded" | "cylinder" | "torus" | "sphere"
  }

  // Generate tags based on project properties
  const getTags = () => {
    const tags = []

    // Add tags based on project properties
    if (project.tags && Array.isArray(project.tags)) {
      return project.tags
    }

    // Fallback tags if project doesn't have tags property
    if (project.category === "DeFi") {
      tags.push("Finance", "Yield", "Staking")
    } else if (project.category === "NFT") {
      tags.push("Art", "Collectibles", "Gaming")
    } else if (project.category === "DAO") {
      tags.push("Governance", "Community", "Voting")
    } else if (project.category === "Infrastructure") {
      tags.push("Scaling", "Layer 2", "Protocol")
    } else {
      tags.push("Blockchain", "Web3", "Innovation")
    }

    // Return a subset of tags (2-3 tags)
    return tags.slice(0, project.id % 2 === 0 ? 2 : 3)
  }

  return (
    <Card
      className="overflow-hidden bg-card border shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] group focus-within:ring-2 focus-within:ring-primary/50"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${project.title} - ${project.description.substring(0, 100)}...`}
    >
      <div className="relative">
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          {featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
          {endingSoon && <Badge className="bg-red-500 text-white">Ending Soon</Badge>}
        </div>
        <div className="h-48 bg-primary/5 flex items-center justify-center overflow-hidden">
          {useMatcap ? (
            <MatcapCard
              title={project.title}
              shape={getShape()}
              color="#0e5f59"
              width="100%"
              height="100%"
              rotationSpeed={0.001}
            />
          ) : (
            <LazyImage
              src={project.image || "/placeholder.svg"}
              alt=""
              fallbackSrc="/placeholder.svg"
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              aspectRatio="aspect-[16/9]"
            />
          )}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-muted/50 hover:bg-muted">
            {project.category}
          </Badge>
          <div className={`flex items-center ${endingSoon ? "text-red-500" : "text-muted-foreground"}`}>
            <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
            <span className={`text-sm ${endingSoon ? "font-medium" : ""}`}>{project.daysLeft} days left</span>
          </div>
        </div>
        <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

        {/* Tags section */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {getTags().map((tag, index) => (
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
          value={progress}
          className="h-2 bg-muted"
          aria-label={`${progress}% funded`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        />
        <div className="flex justify-between text-sm mt-2 mb-4">
          <span className="font-medium">{progress}% funded</span>
          <span className="font-medium">{project.raised.toLocaleString()} ECE</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" aria-hidden="true" />
            <span className="text-sm">{project.backers} backers</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExpand}
              aria-label={`Show details for ${project.title}`}
              aria-expanded="false"
            >
              <span className="flex items-center">
                <ChevronDown className="h-4 w-4 mr-1" aria-hidden="true" />
                Details
              </span>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" size="sm" asChild>
              <Link
                href={`/crowdfunding/project/${project.id}`}
                aria-label={`View ${project.title} project page`}
                className="px-3 py-2 w-full flex items-center justify-center"
              >
                <span>View</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
