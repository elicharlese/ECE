"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { demoCrowdfundingProjects, demoCrowdfundingCategories } from "@/lib/demo-data"
import { ProjectSkeleton } from "@/components/skeletons/project-skeleton"
import { useLoadingState } from "@/hooks/use-loading-state"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useCallback } from "react"
import { ProjectCard } from "@/components/crowdfunding/project-card"
import { ProjectCardExpanded } from "@/components/crowdfunding/project-card-expanded"
import { useToast } from "@/hooks/use-toast"

export default function CrowdfundingPage() {
  const [isLoading] = useLoadingState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null)
  const { toast } = useToast()

  // Sample projects - using demo data
  const featuredProjects = demoCrowdfundingProjects.slice(0, 3)
  const categories = demoCrowdfundingCategories

  // Get ending soon projects (those with fewer days left)
  const endingSoonProjects = [...demoCrowdfundingProjects].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3)

  const handleExpandProject = useCallback((projectId: number) => {
    setExpandedProjectId(projectId)
    // Log analytics event
    console.log("Project expanded:", projectId)
  }, [])

  const handleCloseExpanded = useCallback(() => {
    setExpandedProjectId(null)
    // Log analytics event
    console.log("Project collapsed")
  }, [])

  const handleCategoryChange = useCallback((value: string) => {
    setActiveCategory(value)
    // Log analytics event
    console.log("Category changed:", value)
  }, [])

  const handleLearnMoreClick = useCallback(
    (step: string) => {
      // In a real app, this would navigate to a specific page
      // For now, we'll just show a toast
      toast({
        title: `Learn more about: ${step}`,
        description: `You clicked to learn more about the "${step}" step in the crowdfunding process.`,
        duration: 3000,
      })
      // Log analytics event
      console.log("Learn more clicked:", step)
    },
    [toast],
  )

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge className="mb-4 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                ECE Crowdfunding
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Fund Your <span className="text-primary">Blockchain Vision</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Connect with backers and secure funding for your next blockchain innovation. Turn your ideas into
                reality.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  aria-label="Start a new crowdfunding project"
                >
                  <Link href="/app">
                    <span className="flex items-center">Start a Project</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" aria-label="Explore all crowdfunding projects">
                  <Link href="/crowdfunding/explore">
                    <span className="flex items-center">Explore Projects</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-70"></div>
                <img
                  src="/blockchain-crowdfunding.png"
                  alt="Crowdfunding Platform Concept"
                  className="relative z-10 rounded-2xl shadow-xl"
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Badge className="mb-2 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                Browse Projects
              </Badge>
              <h2 className="text-3xl font-bold">Discover By Category</h2>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="mb-8 w-full justify-start overflow-auto pb-1">
              <TabsTrigger value="all" className="text-sm md:text-base">
                All Categories
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm md:text-base">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, index) => (
              <Link
                key={category.id}
                href={`/crowdfunding/category/${category.id}`}
                className="group"
                aria-label={`Browse ${category.name} projects`}
              >
                <div className="p-6 bg-card dark:bg-[#010817] rounded-xl shadow-sm border border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] h-full flex flex-col justify-between">
                  <div className="mb-4">
                    <img
                      src={`/abstract-geometric-shapes.png?height=120&width=200&query=${category.name} blockchain category in teal color`}
                      alt={category.name}
                      className="w-full h-[120px] object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.count} projects</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Badge className="mb-2 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                Featured Projects
              </Badge>
              <h2 className="text-3xl font-bold">Handpicked Innovations</h2>
            </div>
            <Button variant="outline" asChild aria-label="View all crowdfunding projects">
              <Link href="/crowdfunding/all">
                <span className="flex items-center">View All Projects</span>
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) =>
                expandedProjectId === project.id ? (
                  <div key={project.id} className="md:col-span-3">
                    <ProjectCardExpanded project={project} onClose={handleCloseExpanded} />
                  </div>
                ) : (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    featured={true}
                    onExpand={() => handleExpandProject(project.id)}
                    useMatcap={true}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* Ending Soon */}
      <section className="py-16 px-4 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Badge className="mb-2 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">Last Chance</Badge>
              <h2 className="text-3xl font-bold">Ending Soon</h2>
            </div>
            <Button variant="outline" asChild aria-label="View all projects ending soon">
              <Link href="/crowdfunding/ending-soon">
                <span className="flex items-center">View All Ending Soon</span>
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {endingSoonProjects.map((project) =>
                expandedProjectId === project.id ? (
                  <div key={project.id} className="md:col-span-3">
                    <ProjectCardExpanded project={project} onClose={handleCloseExpanded} />
                  </div>
                ) : (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    endingSoon={true}
                    onExpand={() => handleExpandProject(project.id)}
                    useMatcap={true}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-2 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 inline-block">
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our platform makes it easy to fund and launch your blockchain projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center p-6 bg-card dark:bg-[#010817] rounded-xl shadow-sm border border-border/40 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="mb-6">
                <img
                  src="/placeholder-bodse.png"
                  alt="Step 1"
                  className="rounded-full shadow-md"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="font-semibold text-xl mb-3">Create Your Project</h3>
              <p className="text-muted-foreground mb-4">
                Define your blockchain project, set funding goals, and create rewards for your backers.
              </p>
              <Button
                variant="link"
                className="mt-auto text-primary flex items-center gap-1"
                onClick={() => handleLearnMoreClick("Create Your Project")}
                aria-label="Learn more about creating your project"
              >
                <span className="flex items-center">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </span>
              </Button>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card dark:bg-[#010817] rounded-xl shadow-sm border border-border/40 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="mb-6">
                <img
                  src="/teal-circle-number-2.png"
                  alt="Step 2"
                  className="rounded-full shadow-md"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="font-semibold text-xl mb-3">Get Funded</h3>
              <p className="text-muted-foreground mb-4">
                Connect with backers who believe in your vision and secure ECE tokens for development.
              </p>
              <Button
                variant="link"
                className="mt-auto text-primary flex items-center gap-1"
                onClick={() => handleLearnMoreClick("Get Funded")}
                aria-label="Learn more about getting funded"
              >
                <span className="flex items-center">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </span>
              </Button>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card dark:bg-[#010817] rounded-xl shadow-sm border border-border/40 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
              <div className="mb-6">
                <img
                  src="/placeholder-phrqc.png"
                  alt="Step 3"
                  className="rounded-full shadow-md"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="font-semibold text-xl mb-3">Build & Deliver</h3>
              <p className="text-muted-foreground mb-4">
                Use the funds to build your project and deliver rewards to backers who supported you.
              </p>
              <Button
                variant="link"
                className="mt-auto text-primary flex items-center gap-1"
                onClick={() => handleLearnMoreClick("Build & Deliver")}
                aria-label="Learn more about building and delivering your project"
              >
                <span className="flex items-center">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to launch your blockchain project?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Join thousands of innovators who have successfully funded their blockchain projects on our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                    aria-label="Start your crowdfunding project"
                  >
                    <Link href="/app">
                      <span className="flex items-center">Start a Project</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" aria-label="Contact our support team">
                    <Link href="/contact">
                      <span className="flex items-center">Contact Us</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <img
                  src="/teal-rocket-launch.png"
                  alt="Launch Project"
                  className="rounded-xl shadow-lg"
                  width={250}
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
