"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MatcapCard } from "@/components/3d/MatcapCard"
import { useToast } from "@/hooks/use-toast"
import { demoCrowdfundingProjects } from "@/lib/demo-data"
import { TierContribution } from "@/components/crowdfunding/tier-contribution"
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Flag,
  Github,
  Globe,
  Heart,
  MessageSquare,
  Share2,
  Shield,
  Tag,
  Users,
  Wallet,
} from "lucide-react"
import type { Milestone } from "@/components/crowdfunding/project-card-expanded"

// Extended project type with additional details for the project page
interface ProjectDetails {
  id: number
  title: string
  description: string
  longDescription?: string
  image: string
  category: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  creator: {
    name: string
    avatar: string
    bio?: string
    projects?: number
    backedProjects?: number
    joined?: string
  }
  milestones: Milestone[]
  tags?: string[]
  risks?: {
    title: string
    description: string
  }[]
  team?: {
    name: string
    role: string
    avatar: string
    bio?: string
    social?: {
      github?: string
      twitter?: string
      linkedin?: string
    }
  }[]
  updates?: {
    id: number
    date: string
    title: string
    content: string
    important?: boolean
  }[]
  faqs?: {
    question: string
    answer: string
  }[]
  comments?: {
    id: number
    user: {
      name: string
      avatar: string
    }
    date: string
    content: string
    likes: number
    replies?: {
      id: number
      user: {
        name: string
        avatar: string
      }
      date: string
      content: string
      likes: number
    }[]
  }[]
  rewards?: {
    id: number
    title: string
    amount: number
    description: string
    items: string[]
    backers: number
    estimatedDelivery: string
    limited?: boolean
    limitedQuantity?: number
    limitedRemaining?: number
  }[]
  website?: string
  github?: string
  whitepaper?: string
}

export default function ProjectPage() {
  const params = useParams()
  const { toast } = useToast()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReward, setSelectedReward] = useState<number | null>(null)
  const [pledgeAmount, setPledgeAmount] = useState<number>(0)
  const [isBackingModalOpen, setIsBackingModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    // Simulate API call to fetch project details
    const fetchProject = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo, we'll use the demo data and enhance it
        const projectId = Number(params.id)
        const baseProject = demoCrowdfundingProjects.find((p) => p.id === projectId)

        if (!baseProject) {
          throw new Error("Project not found")
        }

        // Enhance the project with additional details
        const enhancedProject: ProjectDetails = {
          ...baseProject,
          longDescription: `${baseProject.description} This innovative blockchain project aims to revolutionize the way we interact with decentralized applications. By leveraging cutting-edge technology and a dedicated team of experts, we're building a solution that addresses key challenges in the blockchain space.
          
          Our approach combines scalability, security, and user experience to create a platform that's accessible to both developers and end-users. We've already completed several key milestones and have a clear roadmap for the future.
          
          With your support, we can accelerate development and bring this vision to life. Join us in building the future of blockchain technology!`,
          creator: {
            ...baseProject.creator,
            bio: "Blockchain developer and entrepreneur with 5+ years of experience building decentralized applications. Previously worked at major blockchain companies and contributed to several open-source projects.",
            projects: 3,
            backedProjects: 12,
            joined: "January 2021",
          },
          risks: [
            {
              title: "Technical Challenges",
              description:
                "As with any blockchain project, we may encounter technical challenges during development. Our experienced team is prepared to address these issues as they arise.",
            },
            {
              title: "Regulatory Considerations",
              description:
                "The regulatory landscape for blockchain projects is evolving. We're working with legal experts to ensure compliance with relevant regulations.",
            },
            {
              title: "Market Adoption",
              description:
                "While we believe strongly in our vision, market adoption depends on various factors. We have a comprehensive marketing strategy to drive awareness and adoption.",
            },
          ],
          team: [
            {
              name: "Alex Johnson",
              role: "Lead Developer",
              avatar: "/diverse-group.png",
              bio: "Full-stack blockchain developer with expertise in Solidity and React. Previously built DeFi protocols with over $100M TVL.",
              social: {
                github: "https://github.com",
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
              },
            },
            {
              name: "Sarah Chen",
              role: "Product Manager",
              avatar: "/diverse-group.png",
              bio: "Product leader with experience at top Web3 companies. Passionate about creating user-friendly blockchain applications.",
              social: {
                github: "https://github.com",
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
              },
            },
            {
              name: "Michael Rodriguez",
              role: "Smart Contract Engineer",
              avatar: "/diverse-group.png",
              bio: "Security-focused smart contract developer with audit experience. Contributed to multiple EIPs and blockchain standards.",
              social: {
                github: "https://github.com",
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
              },
            },
          ],
          updates: [
            {
              id: 1,
              date: "2023-11-15",
              title: "Development Milestone Reached",
              content:
                "We're excited to announce that we've completed the core smart contract development ahead of schedule. Our team has been working tirelessly to ensure that the contracts are secure, efficient, and ready for audit.",
              important: true,
            },
            {
              id: 2,
              date: "2023-10-28",
              title: "New Team Member",
              content:
                "We're thrilled to welcome Sarah Chen to our team as Product Manager. Sarah brings valuable experience from her previous roles at leading blockchain companies.",
              important: false,
            },
            {
              id: 3,
              date: "2023-10-10",
              title: "Partnership Announcement",
              content:
                "We've secured a strategic partnership with a major blockchain infrastructure provider. This collaboration will help us scale our solution more effectively and reach a wider audience.",
              important: true,
            },
          ],
          faqs: [
            {
              question: "When will the project launch?",
              answer:
                "We're targeting a mainnet launch in Q2 2024, with a testnet release in Q1 2024. Backers will get early access to the testnet.",
            },
            {
              question: "How will funds be used?",
              answer:
                "The majority of funds (70%) will go directly to development. The remaining funds will be allocated to security audits (15%), marketing (10%), and legal/operational expenses (5%).",
            },
            {
              question: "Is there a token?",
              answer:
                "Yes, we plan to launch a utility token that will be used for governance and accessing premium features. Backers will receive token allocations based on their contribution tier.",
            },
            {
              question: "How can I get involved beyond funding?",
              answer:
                "We welcome community contributions! You can join our Discord to participate in discussions, contribute to our GitHub repository if you're a developer, or help spread the word about our project.",
            },
          ],
          comments: [
            {
              id: 1,
              user: {
                name: "CryptoEnthusiast",
                avatar: "/diverse-avatars.png",
              },
              date: "2023-11-10",
              content:
                "This project looks promising! I'm particularly interested in how you're addressing the scalability challenges. Will you be implementing layer 2 solutions?",
              likes: 5,
              replies: [
                {
                  id: 101,
                  user: {
                    name: baseProject.creator.name,
                    avatar: baseProject.creator.avatar,
                  },
                  date: "2023-11-10",
                  content:
                    "Thanks for your interest! Yes, we're implementing a custom layer 2 solution that will significantly improve transaction throughput while maintaining security. We'll share more technical details in our next update.",
                  likes: 2,
                },
              ],
            },
            {
              id: 2,
              user: {
                name: "BlockchainDev",
                avatar: "/diverse-avatars.png",
              },
              date: "2023-11-08",
              content:
                "I've been following similar projects in this space. What makes your approach different from existing solutions?",
              likes: 3,
            },
          ],
          rewards: [
            {
              id: 1,
              title: "Early Supporter",
              amount: 50,
              description: "Get early access to the platform and a special badge on your profile.",
              items: ["Early access to beta", "Supporter badge", "Name in credits"],
              backers: 78,
              estimatedDelivery: "March 2024",
            },
            {
              id: 2,
              title: "Premium Backer",
              amount: 200,
              description: "Everything in the Early Supporter tier plus token allocation and exclusive features.",
              items: [
                "All Early Supporter rewards",
                "Token allocation (500 tokens)",
                "Premium features access",
                "Quarterly team calls",
              ],
              backers: 45,
              estimatedDelivery: "April 2024",
            },
            {
              id: 3,
              title: "Founding Member",
              amount: 1000,
              description: "Become a founding member with governance rights and direct input on project direction.",
              items: [
                "All Premium Backer rewards",
                "Governance rights",
                "Monthly team calls",
                "Custom feature request",
                "Limited edition NFT",
              ],
              backers: 12,
              estimatedDelivery: "April 2024",
              limited: true,
              limitedQuantity: 20,
              limitedRemaining: 8,
            },
          ],
          website: "https://example.com",
          github: "https://github.com/example/project",
          whitepaper: "https://example.com/whitepaper.pdf",
          tags:
            baseProject.category === "DeFi"
              ? ["Finance", "Yield", "Staking"]
              : baseProject.category === "NFT"
                ? ["Art", "Collectibles", "Gaming"]
                : baseProject.category === "DAO"
                  ? ["Governance", "Community", "Voting"]
                  : baseProject.category === "Infrastructure"
                    ? ["Scaling", "Layer 2", "Protocol"]
                    : ["Blockchain", "Web3", "Innovation"],
        }

        setProject(enhancedProject)
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id, toast])

  const handleBackProject = () => {
    setActiveTab("invest")
    window.scrollTo({
      top: document.getElementById("project-tabs")?.offsetTop || 0,
      behavior: "smooth",
    })
  }

  const handleSelectReward = (rewardId: number) => {
    setSelectedReward(rewardId)
    const reward = project?.rewards?.find((r) => r.id === rewardId)
    if (reward) {
      setPledgeAmount(reward.amount)
      setIsBackingModalOpen(true)
    }
  }

  const handlePledge = () => {
    toast({
      title: "Pledge successful!",
      description: `You've pledged ${pledgeAmount} ECE to this project.`,
    })
    setIsBackingModalOpen(false)
  }

  const handleShare = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    toast({
      title: "Link copied!",
      description: "Project link copied to clipboard.",
    })
  }

  const handleFollow = () => {
    toast({
      title: "Following project",
      description: "You'll receive updates about this project.",
    })
  }

  const handleContribution = (tierId: string, amount: number) => {
    toast({
      title: "Investment successful!",
      description: `You've invested ${amount} ECE in this project as a ${tierId} tier investor.`,
    })
    console.log(`Investment of ${amount} ECE made with tier ${tierId}`)
    // In a real app, this would process the payment and update the database
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-8 w-2/3 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-muted rounded mb-8"></div>
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-32 bg-muted rounded mb-8"></div>
            </div>
            <div className="md:col-span-1">
              <div className="h-40 bg-muted rounded mb-4"></div>
              <div className="h-60 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/crowdfunding">
              <span className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </span>
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const progress = Math.round((project.raised / project.goal) * 100)

  return (
    <div className="min-h-screen">
      {/* Project Header */}
      <div className="bg-muted/30 dark:bg-muted/10 py-6">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Button variant="ghost" size="sm" asChild className="mb-2">
                <Link href="/crowdfunding">
                  <span className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                  </span>
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <span className="flex items-center">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleFollow}>
                <span className="flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Follow
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Project Image/Video */}
            <div className="rounded-lg overflow-hidden bg-muted/20 border border-border/40 aspect-video flex items-center justify-center">
              <MatcapCard
                title={project.title}
                shape="rounded"
                color="#0e5f59"
                width="100%"
                height="100%"
                rotationSpeed={0.001}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-muted/50 hover:bg-muted">
                {project.category}
              </Badge>
              {project.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  <span className="flex items-center">
                    <Tag className="mr-1 h-3 w-3" aria-hidden="true" />
                    {tag}
                  </span>
                </Badge>
              ))}
            </div>

            {/* Tabs Navigation */}
            <Tabs
              id="project-tabs"
              defaultValue="about"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-6 mb-8">
                <TabsTrigger value="about">
                  <span>About</span>
                </TabsTrigger>
                <TabsTrigger value="updates">
                  <span>Updates</span>
                </TabsTrigger>
                <TabsTrigger value="faqs">
                  <span>FAQs</span>
                </TabsTrigger>
                <TabsTrigger value="comments">
                  <span>Comments</span>
                </TabsTrigger>
                <TabsTrigger value="risks">
                  <span>Risks</span>
                </TabsTrigger>
                <TabsTrigger value="invest">
                  <span>Invest</span>
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-8">
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
                  <p className="whitespace-pre-line">{project.longDescription}</p>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Project Milestones</h3>
                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-muted/20"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                            milestone.completed ? "bg-green-500" : "bg-primary/20"
                          }`}
                        >
                          {milestone.completed ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
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
                            <span className="text-sm text-primary">{milestone.id}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-lg">{milestone.title}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{milestone.date}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mt-2">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Meet the Team</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {project.team?.map((member, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <CardTitle className="text-lg">{member.name}</CardTitle>
                              <CardDescription>{member.role}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                          <div className="flex gap-2">
                            {member.social?.github && (
                              <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                <Link href={member.social.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {member.social?.twitter && (
                              <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                <Link href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-twitter"
                                  >
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                  </svg>
                                </Link>
                              </Button>
                            )}
                            {member.social?.linkedin && (
                              <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                <Link href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-linkedin"
                                  >
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect width="4" height="12" x="2" y="9" />
                                    <circle cx="4" cy="4" r="2" />
                                  </svg>
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* External Links */}
                {(project.website || project.github || project.whitepaper) && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Resources</h3>
                    <div className="flex flex-wrap gap-4">
                      {project.website && (
                        <Button variant="outline" asChild>
                          <Link href={project.website} target="_blank" rel="noopener noreferrer">
                            <span className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              Website
                            </span>
                          </Link>
                        </Button>
                      )}
                      {project.github && (
                        <Button variant="outline" asChild>
                          <Link href={project.github} target="_blank" rel="noopener noreferrer">
                            <span className="flex items-center">
                              <Github className="mr-2 h-4 w-4" />
                              GitHub
                            </span>
                          </Link>
                        </Button>
                      )}
                      {project.whitepaper && (
                        <Button variant="outline" asChild>
                          <Link href={project.whitepaper} target="_blank" rel="noopener noreferrer">
                            <span className="flex items-center">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Whitepaper
                            </span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Updates Tab */}
              <TabsContent value="updates" className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Project Updates</h2>
                {project.updates?.length ? (
                  <div className="space-y-6">
                    {project.updates.map((update) => (
                      <Card key={update.id} className={update.important ? "border-primary/30" : ""}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{update.title}</CardTitle>
                              <CardDescription>
                                {new Date(update.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </CardDescription>
                            </div>
                            {update.important && (
                              <Badge className="bg-primary text-primary-foreground">Important</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-line">{update.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No updates have been posted yet.</p>
                )}
              </TabsContent>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                {project.faqs?.length ? (
                  <div className="space-y-4">
                    {project.faqs.map((faq, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No FAQs have been added yet.</p>
                )}
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Comments</h2>
                  <Button variant="outline">
                    <span className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Add Comment
                    </span>
                  </Button>
                </div>
                {project.comments?.length ? (
                  <div className="space-y-6">
                    {project.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={comment.user.avatar || "/placeholder.svg"}
                              alt={comment.user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{comment.user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comment.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <span className="flex items-center">
                              <Heart className="mr-1 h-4 w-4" />
                              {comment.likes}
                            </span>
                          </Button>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        {comment.replies?.length && (
                          <div className="pl-6 border-l-2 border-muted mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="space-y-2">
                                <div className="flex justify-between">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={reply.user.avatar || "/placeholder.svg"}
                                      alt={reply.user.name}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                      <p className="font-medium text-sm">{reply.user.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(reply.date).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <span className="flex items-center">
                                      <Heart className="mr-1 h-3 w-3" />
                                      {reply.likes}
                                    </span>
                                  </Button>
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            <span>Reply</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                )}
              </TabsContent>

              {/* Risks Tab */}
              <TabsContent value="risks" className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Risks & Challenges</h2>
                {project.risks?.length ? (
                  <div className="space-y-6">
                    {project.risks.map((risk, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
                              <Flag className="h-5 w-5 text-red-500" />
                            </div>
                            <CardTitle className="text-lg">{risk.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{risk.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="bg-muted/30 border border-border/40 rounded-lg p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <Shield className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium">Our Commitment</h3>
                      </div>
                      <p className="text-muted-foreground">
                        We're committed to transparency and will provide regular updates on our progress, including any
                        challenges we encounter. Our team has the expertise and experience to navigate these risks and
                        deliver a successful project.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No risks have been identified for this project.</p>
                )}
              </TabsContent>

              {/* Invest Tab */}
              <TabsContent value="invest" className="space-y-6">
                <TierContribution
                  projectId={project.id.toString()}
                  projectTitle={project.title}
                  onContribute={handleContribution}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Funding Status & Rewards */}
          <div className="md:col-span-1 space-y-6">
            {/* Funding Status */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-3xl font-bold">{project.raised.toLocaleString()} ECE</h3>
                      <p className="text-sm text-muted-foreground">of {project.goal.toLocaleString()} ECE goal</p>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2 bg-muted"
                      aria-label={`${progress}% funded`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold">{project.backers}</p>
                      <p className="text-xs text-muted-foreground">Backers</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold">{project.daysLeft}</p>
                      <p className="text-xs text-muted-foreground">Days Left</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold">{progress}%</p>
                      <p className="text-xs text-muted-foreground">Funded</p>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleBackProject}>
                    <span className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Back This Project
                    </span>
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">Campaign ends on</span>
                    </div>
                    <span className="font-medium">
                      {new Date(Date.now() + project.daysLeft * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={project.creator.avatar || "/placeholder.svg?height=60&width=60&query=avatar"}
                    alt={project.creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{project.creator.name}</p>
                    <p className="text-xs text-muted-foreground">Joined {project.creator.joined}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{project.creator.bio}</p>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="p-2 bg-muted/30 rounded-lg">
                    <p className="font-bold">{project.creator.projects}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded-lg">
                    <p className="font-bold">{project.creator.backedProjects}</p>
                    <p className="text-xs text-muted-foreground">Backed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Select a Reward</h3>
              {project.rewards?.map((reward) => (
                <Card
                  key={reward.id}
                  className={`border ${selectedReward === reward.id ? "border-primary" : "border-border/40"} hover:border-primary/60 transition-colors cursor-pointer`}
                  onClick={() => handleSelectReward(reward.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <Badge variant="outline" className="bg-muted/50">
                        {reward.amount} ECE
                      </Badge>
                    </div>
                    {reward.limited && (
                      <CardDescription>
                        Limited ({reward.limitedRemaining} of {reward.limitedQuantity} left)
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{reward.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium">INCLUDES:</p>
                      <ul className="text-sm space-y-1">
                        {reward.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary mt-0.5"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{reward.backers} backers</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">Est. {reward.estimatedDelivery}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
