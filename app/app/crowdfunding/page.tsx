"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { SwipeContainer } from "@/components/ui/swipe-container"
import { useToast } from "@/hooks/use-toast"

import { ProjectCard } from "@/components/project-card"
import { ProjectSkeleton } from "@/components/project-skeleton"

interface Props {
  projects: any[]
  isLoading: boolean
  searchQuery: string
  selectedCategory: string | null
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
}

export default function CrowdfundingPage({
  projects,
  isLoading,
  searchQuery,
  selectedCategory,
  setSearchQuery,
  setSelectedCategory,
}: Props) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const { toast } = useToast()

  // Add navigation tip toast
  useEffect(() => {
    if (!isLoading && projects.length > 1) {
      toast({
        title: "Navigation tip",
        description: "Swipe up/down or use arrow keys to navigate between projects.",
        duration: 5000,
      })
    }
  }, [isLoading, projects.length, toast])

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        if (currentProjectIndex > 0) {
          setIsScrolling(true)
          setCurrentProjectIndex(currentProjectIndex - 1)
          setTimeout(() => setIsScrolling(false), 500)
        }
      } else if (e.key === "ArrowDown") {
        if (currentProjectIndex < projects.length - 1) {
          setIsScrolling(true)
          setCurrentProjectIndex(currentProjectIndex + 1)
          setTimeout(() => setIsScrolling(false), 500)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentProjectIndex, projects.length])

  // Reset current project index when filters change
  useEffect(() => {
    setCurrentProjectIndex(0)
  }, [searchQuery, selectedCategory])

  return (
    <div className="relative">
      {/* Navigation Controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (currentProjectIndex > 0) {
              setIsScrolling(true)
              setCurrentProjectIndex(currentProjectIndex - 1)
              setTimeout(() => setIsScrolling(false), 500)
            }
          }}
          disabled={currentProjectIndex === 0 || isLoading}
          className="h-8 w-8 p-0 rounded-full shadow-sm"
          aria-label="Previous project"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        {!isLoading && projects.length > 0 && (
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-center">
            {currentProjectIndex + 1} / {projects.length}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (currentProjectIndex < projects.length - 1) {
              setIsScrolling(true)
              setCurrentProjectIndex(currentProjectIndex + 1)
              setTimeout(() => setIsScrolling(false), 500)
            }
          }}
          disabled={currentProjectIndex === projects.length - 1 || isLoading}
          className="h-8 w-8 p-0 rounded-full shadow-sm"
          aria-label="Next project"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="h-[700px] flex items-center justify-center">
          <ProjectSkeleton className="w-full max-w-3xl mx-auto h-full" />
        </div>
      ) : projects.length > 0 ? (
        <SwipeContainer
          className="h-[700px] overflow-hidden"
          onSwipeUp={() => {
            if (currentProjectIndex < projects.length - 1) {
              setIsScrolling(true)
              setCurrentProjectIndex(currentProjectIndex + 1)
              setTimeout(() => setIsScrolling(false), 500)
            }
          }}
          onSwipeDown={() => {
            if (currentProjectIndex > 0) {
              setIsScrolling(true)
              setCurrentProjectIndex(currentProjectIndex - 1)
              setTimeout(() => setIsScrolling(false), 500)
            }
          }}
          threshold={30}
        >
          <div
            className="flex flex-col transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateY(-${currentProjectIndex * 100}%)` }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={cn(
                  "h-full min-h-[700px] shrink-0",
                  index === currentProjectIndex ? "opacity-100" : "opacity-0",
                )}
                aria-hidden={index !== currentProjectIndex}
              >
                <ProjectCard project={project} expanded={true} />
              </div>
            ))}
          </div>
        </SwipeContainer>
      ) : (
        <div className="h-[700px] flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold mb-2">No projects found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
