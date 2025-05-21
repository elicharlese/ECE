"use client"

import { ProjectCard } from "@/components/project-card"
import { ProjectSkeleton } from "@/components/project-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"
import { useSupabase } from "@/providers/supabase-provider"
import type { Project, ProjectStatus } from "@/types"
import { v4 as uuidv4 } from "uuid"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { SwipeContainer } from "@/components/ui/swipe-container"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const categoryOptions = [
  { label: "All Categories", value: null },
  { label: "Technology", value: "technology" },
  { label: "Education", value: "education" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Environment", value: "environment" },
  { label: "Arts & Culture", value: "arts_culture" },
  { label: "Community", value: "community" },
  { label: "Other", value: "other" },
]

const statusOptions = [
  { label: "All Statuses", value: null },
  { label: "Funding", value: "funding" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
]

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.enum(["technology", "education", "healthcare", "environment", "arts_culture", "community", "other"]),
  goal: z.number().min(1, {
    message: "Goal must be at least $1.",
  }),
})

const CrowdfundingPage = () => {
  const { supabase, session } = useSupabase()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(null)
  const [creating, setCreating] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const router = useRouter()

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const projectFeedRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "technology",
      goal: 1000,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setCreating(true)
    try {
      if (!session?.user) {
        toast({
          title: "Unauthorized",
          description: "You must be logged in to create a project.",
        })
        return
      }

      const projectId = uuidv4()

      const { error } = await supabase
        .from("projects")
        .insert({
          id: projectId,
          creator_id: session.user.id,
          name: values.name,
          description: values.description,
          category: values.category,
          goal: values.goal,
          status: "funding",
        })
        .single()

      if (error) {
        console.error("Error creating project:", error)
        toast({
          title: "Error creating project",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Optimistically update the projects list
      setProjects((prevProjects) => [
        {
          id: projectId,
          creator_id: session.user.id,
          name: values.name,
          description: values.description,
          category: values.category,
          goal: values.goal,
          status: "funding",
          created_at: new Date().toISOString(),
          current_amount: 0,
          creator: {
            id: session.user.id,
            email: session.user.email ?? "",
            created_at: new Date().toISOString(),
            name: session.user.user_metadata.name ?? "",
            avatar_url: session.user.user_metadata.avatar_url ?? "",
          },
        },
        ...prevProjects,
      ])

      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      })

      form.reset()
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error creating project",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    setProjects([])
    setPage(0)
    setHasMore(true)
  }, [debouncedSearchQuery, selectedCategory, selectedStatus])

  const loadMoreProjects = async () => {
    if (!hasMore || loading) return

    setLoading(true)

    let query = supabase
      .from("projects")
      .select(
        `
        *,
        creator:profiles(*)
      `,
      )
      .order("created_at", { ascending: false })
      .range(page * 6, (page + 1) * 6 - 1)

    if (debouncedSearchQuery) {
      query = query.ilike("name", `%${debouncedSearchQuery}%`)
    }

    if (selectedCategory) {
      query = query.eq("category", selectedCategory)
    }

    if (selectedStatus) {
      query = query.eq("status", selectedStatus)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error fetching projects",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } else {
      const fetchedProjects = data as Project[]
      setProjects((prevProjects) => [...prevProjects, ...fetchedProjects])

      if (fetchedProjects.length < 6) {
        setHasMore(false)
      } else {
        setPage((prevPage) => prevPage + 1)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    loadMoreProjects()
  }, [debouncedSearchQuery, selectedCategory, selectedStatus, page])

  const filteredProjects = projects.filter((project) => {
    const searchRegex = new RegExp(debouncedSearchQuery, "i")
    const categoryMatch = selectedCategory ? project.category === selectedCategory : true
    const statusMatch = selectedStatus ? project.status === selectedStatus : true
    return searchRegex.test(project.name) && categoryMatch && statusMatch
  })

  // Reset current project index when filters change
  useEffect(() => {
    setCurrentProjectIndex(0)
  }, [searchQuery, selectedCategory, selectedStatus])

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
        if (currentProjectIndex < filteredProjects.length - 1) {
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
  }, [currentProjectIndex, filteredProjects.length])

  // Show navigation tip toast
  useEffect(() => {
    if (!loading && filteredProjects.length > 1) {
      toast({
        title: "Navigation tip",
        description: "Swipe up/down or use arrow keys to navigate between projects.",
        duration: 5000,
      })
    }
  }, [loading, filteredProjects.length, toast])

  return (
    <div className="container grid gap-6 lg:grid-cols-4 py-8">
      {/* Filters & Create Project */}
      <aside className="flex flex-col gap-4">
        <div className="border rounded-md bg-secondary p-4">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                type="search"
                id="search"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value || "all"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={selectedStatus || "all"}
                onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value || "all"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Create Project Form */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              Create Project <Icons.plus className="w-4 h-4 ml-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create a New Project</AlertDialogTitle>
              <AlertDialogDescription>Fill in the details below to create your project.</AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us more about your project..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.slice(1).map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000"
                          onChange={(e) => {
                            const parsedValue = Number.parseInt(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" disabled={creating}>
                    {creating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </aside>

      {/* Project Feed */}
      <div className="lg:col-span-3 space-y-6">
        {/* Project Feed */}
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
              disabled={currentProjectIndex === 0 || loading}
              className="h-8 w-8 p-0 rounded-full shadow-sm"
              aria-label="Previous project"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            {!loading && filteredProjects.length > 0 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-center">
                {currentProjectIndex + 1} / {filteredProjects.length}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentProjectIndex < filteredProjects.length - 1) {
                  setIsScrolling(true)
                  setCurrentProjectIndex(currentProjectIndex + 1)
                  setTimeout(() => setIsScrolling(false), 500)
                }
              }}
              disabled={currentProjectIndex === filteredProjects.length - 1 || loading}
              className="h-8 w-8 p-0 rounded-full shadow-sm"
              aria-label="Next project"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="h-[700px] flex items-center justify-center">
              <ProjectSkeleton className="w-full max-w-3xl mx-auto h-full" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <SwipeContainer
              ref={projectFeedRef}
              className="h-[700px] overflow-hidden"
              onSwipeUp={() => {
                if (currentProjectIndex < filteredProjects.length - 1) {
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
                {filteredProjects.map((project, index) => (
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
                {hasMore && (
                  <div className="h-full min-h-[700px] shrink-0 flex items-center justify-center">
                    <Button onClick={loadMoreProjects} className="gap-2">
                      <ChevronDown className="h-4 w-4" />
                      Load More Projects
                    </Button>
                  </div>
                )}
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
                    setSelectedStatus(null)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CrowdfundingPage
