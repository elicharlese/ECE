"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChevronDown, Tag, Award, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { useGamification } from "@/context/gamification-context"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ProjectWithMilestones } from "./project-card-expanded"

interface ProjectCardGamifiedProps {
  project: ProjectWithMilestones
  featured?: boolean
  endingSoon?: boolean
  onExpand: () => void
  useMatcap?: boolean
}

export function ProjectCardGamified({
  project,
  featured = false,
  endingSoon = false,
  onExpand,
  useMatcap = false,
}: ProjectCardGamifiedProps) {
  const { awardPoints, unlockAchievement } = useGamification()
  const [liked, setLiked] = useState(false)
  const [shared, setShared] = useState(false)
  const progress = Math.round((project.raised / project.goal) * 100)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!liked) {
      setLiked(true)
      awardPoints(5, `Liked project: ${project.title}`)

      // Check if this is the first like
      if (!localStorage.getItem("first-like")) {
        localStorage.setItem("first-like", "true")
        setTimeout(() => {
          unlockAchievement("first-like")
        }, 1000)
      }
    } else {
      setLiked(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!shared) {
      setShared(true)
      awardPoints(10, `Shared project: ${project.title}`)

      // Progress on the project promoter achievement
      if (!localStorage.getItem("shared-count")) {
        localStorage.setItem("shared-count", "1")
      } else {
        const count = Number.parseInt(localStorage.getItem("shared-count") || "0")
        localStorage.setItem("shared-count", (count + 1).toString())

        // If shared 10 projects, unlock achievement
        if (count + 1 >= 10) {
          setTimeout(() => {
            unlockAchievement("project-promoter")
          }, 1000)
        }
      }
    }
  }

  const handleViewProject = () => {
    // Award points for viewing a project
    awardPoints(2, `Viewed project: ${project.title}`)

    // Track viewed projects for the explorer quest
    if (!localStorage.getItem("viewed-projects")) {
      localStorage.setItem("viewed-projects", JSON.stringify([project.id]))
    } else {
      try {
        const viewedProjects = JSON.parse(localStorage.getItem("viewed-projects") || "[]")
        if (!viewedProjects.includes(project.id)) {
          viewedProjects.push(project.id)
          localStorage.setItem("viewed-projects", JSON.stringify(viewedProjects))

          // If viewed 5 projects, progress on the explorer quest
          if (viewedProjects.length >= 5) {
            // This would be handled by the quest system in a real app
            console.log("Explorer quest progress: 5 projects viewed")
          }
        }
      } catch (e) {
        console.error("Error parsing viewed projects", e)
      }
    }
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
      aria-label={`${project.title} - ${project.description.substring(0, 100)}...`}
    >
      <div className="relative">
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          {featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
          {endingSoon && <Badge className="bg-red-500 text-white">Ending Soon</Badge>}
        </div>
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={liked ? "default" : "outline"}
                  className={cn(
                    "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
                    liked ? "bg-primary hover:bg-primary/90" : "hover:bg-background",
                  )}
                  onClick={handleLike}
                >
                  <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                  <span className="sr-only">Like project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{liked ? "Unlike project" : "Like project"}</p>
                {!liked && <p className="text-xs text-muted-foreground">+5 XP</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={shared ? "default" : "outline"}
                  className={cn(
                    "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
                    shared ? "bg-primary hover:bg-primary/90" : "hover:bg-background",
                  )}
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{shared ? "Shared!" : "Share project"}</p>
                {!shared && <p className="text-xs text-muted-foreground">+10 XP</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="h-48 bg-primary/5 flex items-center justify-center overflow-hidden">
          {useMatcap ? (
            <div className="h-full w-full">
              {/* MatcapCard would be here */}
              <img
                src={project.image || "/placeholder.svg"}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <img
              src={project.image || "/placeholder.svg"}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              onClick={onExpand}
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
                onClick={handleViewProject}
              >
                <span>View</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* XP indicator */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Award className="h-3.5 w-3.5 mr-1 text-primary" />
              <span>Earn XP:</span>
            </div>
            <div className="flex gap-3">
              <span>View: +2 XP</span>
              <span>Like: +5 XP</span>
              <span>Share: +10 XP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
