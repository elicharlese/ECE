import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertCircle, CheckCircle, FileText, HelpCircle, Info, Shield, AlertTriangle, Zap } from "lucide-react"

export const metadata = {
  title: "Listing Policy | ECE Crowdfunding",
  description: "Guidelines and requirements for listing your blockchain project on the ECE Crowdfunding platform.",
}

export default function ListingPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="text-center space-y-4">
            <Badge className="mb-4 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              Project Guidelines
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Listing Policy</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Guidelines and requirements for listing your blockchain project on the ECE Crowdfunding platform.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">
                <span className="flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Overview
                </span>
              </TabsTrigger>
              <TabsTrigger value="requirements">
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Requirements
                </span>
              </TabsTrigger>
              <TabsTrigger value="prohibited">
                <span className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Prohibited Content
                </span>
              </TabsTrigger>
              <TabsTrigger value="faq">
                <span className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6">Platform Overview</h2>
                <p>
                  ECE Crowdfunding is a specialized platform designed to help blockchain innovators secure funding for
                  their projects. Our platform connects visionary creators with backers who are passionate about
                  advancing blockchain technology and its applications.
                </p>
                <p>
                  Before submitting your project, please review our listing policies carefully. These guidelines ensure
                  that all projects on our platform maintain high standards of quality, transparency, and compliance
                  with applicable regulations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                        <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle className="text-lg">Quick Start</CardTitle>
                    </div>
                    <CardDescription>Essential steps to get your project listed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">1.</span>
                        <span>Create an account and verify your identity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">2.</span>
                        <span>Prepare your project details and funding goals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">3.</span>
                        <span>Submit your project for review</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">4.</span>
                        <span>Address any feedback from our review team</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">5.</span>
                        <span>Launch your approved project</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-lg">Our Commitment</CardTitle>
                    </div>
                    <CardDescription>How we support project creators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Dedicated support throughout your campaign</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Promotion to our community of blockchain enthusiasts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Secure and transparent funding process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Tools to engage with your backers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Post-campaign support and resources</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/20">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle className="text-lg">Key Considerations</CardTitle>
                    </div>
                    <CardDescription>Important factors to keep in mind</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>All projects undergo thorough review (3-5 business days)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Platform fee is 5% of funds raised</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Projects must comply with all applicable regulations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Creators are responsible for fulfilling rewards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Regular updates to backers are required</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted/30 border border-border/40 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Review Process</h3>
                <p className="mb-4">
                  All projects submitted to ECE Crowdfunding undergo a thorough review process to ensure they meet our
                  platform standards. Here's what to expect:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Initial Screening</h4>
                        <p className="text-sm text-muted-foreground">
                          Basic review of project details, goals, and creator information
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Technical Assessment</h4>
                        <p className="text-sm text-muted-foreground">
                          Evaluation of technical feasibility and blockchain implementation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Compliance Check</h4>
                        <p className="text-sm text-muted-foreground">
                          Review for regulatory compliance and legal considerations
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Team Verification</h4>
                        <p className="text-sm text-muted-foreground">Confirmation of team credentials and experience</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        5
                      </div>
                      <div>
                        <h4 className="font-medium">Feedback & Revisions</h4>
                        <p className="text-sm text-muted-foreground">
                          Suggestions for improvements and opportunity for revisions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        6
                      </div>
                      <div>
                        <h4 className="font-medium">Final Approval</h4>
                        <p className="text-sm text-muted-foreground">
                          Final review and approval for listing on the platform
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6">Project Requirements</h2>
                <p>
                  To ensure the quality and integrity of projects on our platform, all submissions must meet the
                  following requirements. Projects that don't meet these criteria will not be approved for listing.
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Basics</CardTitle>
                    <CardDescription>Fundamental requirements for all projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Clear Blockchain Use Case</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects must demonstrate a legitimate use case for blockchain technology
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Detailed Project Description</h4>
                          <p className="text-sm text-muted-foreground">
                            Comprehensive explanation of the project, its goals, and implementation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Realistic Funding Goal</h4>
                          <p className="text-sm text-muted-foreground">
                            Funding target must be reasonable and justified based on project scope
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Project Timeline</h4>
                          <p className="text-sm text-muted-foreground">
                            Clear development timeline with defined milestones and deliverables
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Requirements</CardTitle>
                    <CardDescription>Criteria for project teams and leadership</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Verified Identity</h4>
                          <p className="text-sm text-muted-foreground">
                            All team members must complete identity verification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Relevant Experience</h4>
                          <p className="text-sm text-muted-foreground">
                            Team must demonstrate experience relevant to the project
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Technical Expertise</h4>
                          <p className="text-sm text-muted-foreground">
                            At least one team member must have blockchain development experience
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Transparent Background</h4>
                          <p className="text-sm text-muted-foreground">
                            No history of fraudulent activities or failed projects without explanation
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Requirements</CardTitle>
                    <CardDescription>Technical standards for blockchain projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Technical Whitepaper</h4>
                          <p className="text-sm text-muted-foreground">
                            Detailed technical documentation explaining the project architecture
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Prototype or MVP</h4>
                          <p className="text-sm text-muted-foreground">
                            Working prototype or minimum viable product (preferred but not required)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Security Considerations</h4>
                          <p className="text-sm text-muted-foreground">
                            Clear plan for addressing security concerns and vulnerabilities
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Scalability Plan</h4>
                          <p className="text-sm text-muted-foreground">
                            Strategy for scaling the project as user base grows
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reward Structure</CardTitle>
                    <CardDescription>Requirements for backer rewards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Clear Reward Tiers</h4>
                          <p className="text-sm text-muted-foreground">
                            Multiple reward tiers with clear descriptions of what backers receive
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Realistic Delivery Dates</h4>
                          <p className="text-sm text-muted-foreground">
                            Achievable timeframes for reward delivery with reasonable buffer
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Value Proposition</h4>
                          <p className="text-sm text-muted-foreground">
                            Rewards must provide clear value relative to contribution amount
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Compliance with Regulations</h4>
                          <p className="text-sm text-muted-foreground">
                            Rewards must comply with securities laws and other regulations
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Legal & Compliance</CardTitle>
                    <CardDescription>Legal requirements for project listings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Legal Entity</h4>
                          <p className="text-sm text-muted-foreground">
                            Project must be backed by a registered legal entity in an eligible jurisdiction
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Terms & Conditions</h4>
                          <p className="text-sm text-muted-foreground">
                            Clear terms and conditions for backers, including refund policy
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Regulatory Compliance</h4>
                          <p className="text-sm text-muted-foreground">
                            Compliance with all applicable laws, including securities regulations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Intellectual Property</h4>
                          <p className="text-sm text-muted-foreground">
                            Clear ownership or rights to all intellectual property used in the project
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Info className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Documentation Checklist</h3>
                    <p className="text-muted-foreground mb-4">
                      Prepare these documents before submitting your project for review:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Technical whitepaper</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Business plan</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Team credentials & experience</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Project timeline & milestones</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Budget breakdown</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Legal entity documentation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Reward tier descriptions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Risk assessment</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Prohibited Content Tab */}
            <TabsContent value="prohibited" className="space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6">Prohibited Content</h2>
                <p>
                  To maintain the integrity of our platform and comply with legal requirements, the following types of
                  projects and content are prohibited on ECE Crowdfunding. Projects containing any of these elements
                  will be rejected during the review process or removed if discovered after approval.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="bg-red-50/50 dark:bg-red-900/10">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      Illegal Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Money Laundering</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects designed to facilitate money laundering or other financial crimes
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Illegal Goods or Services</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects involving illegal goods, services, or activities in any jurisdiction
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Sanctions Violations</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects that would violate international sanctions or involve sanctioned individuals
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="bg-red-50/50 dark:bg-red-900/10">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      Fraudulent Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Misleading Claims</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects making false or misleading claims about capabilities or team experience
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Impersonation</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects impersonating existing companies, teams, or individuals
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Pyramid or Ponzi Schemes</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects structured as pyramid schemes, Ponzi schemes, or other deceptive financial models
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="bg-red-50/50 dark:bg-red-900/10">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      Harmful Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Hate Speech</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects promoting hate speech, discrimination, or violence against any group
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Harassment Tools</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects designed to facilitate harassment, stalking, or invasion of privacy
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Harmful Technology</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects developing technology intended to cause harm to individuals or systems
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="bg-red-50/50 dark:bg-red-900/10">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      Regulatory Violations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Unregistered Securities</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects offering unregistered securities or investment contracts without proper exemptions
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Gambling</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects facilitating gambling without proper licensing and regulatory compliance
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Privacy Violations</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects that would violate privacy laws or regulations in applicable jurisdictions
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="bg-red-50/50 dark:bg-red-900/10">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      Intellectual Property Infringement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Unauthorized Use</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects using copyrighted material, trademarks, or patents without permission
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Counterfeit Products</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects involving counterfeit goods or services
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Plagiarism</h4>
                          <p className="text-sm text-muted-foreground">
                            Projects that plagiarize or copy existing projects without proper attribution or permission
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-amber-800 dark:text-amber-400">
                      Consequences of Violation
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300 mb-4">
                      Projects found to violate these prohibitions may face the following consequences:
                    </p>
                    <ul className="space-y-2 text-amber-700 dark:text-amber-300">
                      <li className="flex items-start gap-2">
                        <span className="font-medium">•</span>
                        <span>Immediate rejection during the review process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium">•</span>
                        <span>Removal from the platform if violations are discovered after approval</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium">•</span>
                        <span>Suspension or termination of creator accounts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium">•</span>
                        <span>Reporting to relevant authorities for illegal activities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium">•</span>
                        <span>Potential legal action for serious violations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                <p>
                  Find answers to common questions about listing your project on ECE Crowdfunding. If you don't see your
                  question answered here, please contact our support team.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How long does the review process take?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      The standard review process takes 3-5 business days from the time of submission. However, this
                      timeline may vary depending on:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>The complexity of your project</li>
                      <li>The completeness of your submission</li>
                      <li>The current volume of submissions</li>
                      <li>Any additional information or clarification needed</li>
                    </ul>
                    <p>
                      For projects requiring additional review or clarification, the process may take longer. We'll keep
                      you updated on the status of your submission throughout the review process.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What fees does ECE Crowdfunding charge?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">ECE Crowdfunding charges the following fees:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>
                        <strong>Platform Fee:</strong> 5% of the total funds raised (only charged if your funding goal
                        is reached)
                      </li>
                      <li>
                        <strong>Payment Processing Fee:</strong> 3% + $0.30 per transaction (passed through from payment
                        processors)
                      </li>
                      <li>
                        <strong>Listing Fee:</strong> None - there is no upfront cost to list your project
                      </li>
                    </ul>
                    <p>
                      For projects raising funds in cryptocurrency, gas fees and network fees may apply depending on the
                      blockchain used. These fees are not controlled by ECE Crowdfunding and vary based on network
                      conditions.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I edit my project after submission?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">Yes, but with some limitations:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>
                        <strong>During Review:</strong> You can make edits to your project while it's under review. Any
                        significant changes may restart the review process.
                      </li>
                      <li>
                        <strong>Before Launch:</strong> Once approved but before your campaign goes live, you can make
                        any edits you need.
                      </li>
                      <li>
                        <strong>During Campaign:</strong> After your campaign is live, you can make minor edits to the
                        project description, FAQs, and updates. However, you cannot change fundamental aspects such as
                        funding goals, campaign duration, or reward tiers.
                      </li>
                    </ul>
                    <p>
                      All edits made after approval but before the end of your campaign will be reviewed by our team to
                      ensure they don't substantially change the project that backers have already supported.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What happens if my project doesn't reach its funding goal?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">ECE Crowdfunding uses an "all-or-nothing" funding model. This means:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>
                        If your project doesn't reach its funding goal by the deadline, no funds are collected from
                        backers
                      </li>
                      <li>Backers are not charged for their pledges</li>
                      <li>No platform fees are charged</li>
                      <li>You can relaunch your project after making improvements</li>
                    </ul>
                    <p>
                      We recommend setting a realistic funding goal that represents the minimum amount needed to deliver
                      your project. If you exceed your goal, you'll still receive all funds raised.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I offer tokens or cryptocurrencies as rewards?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      Offering tokens or cryptocurrencies as rewards is subject to strict regulatory requirements:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>
                        <strong>Utility Tokens:</strong> You may offer utility tokens that provide access to your
                        platform or service, provided they are not marketed as investments or financial instruments.
                      </li>
                      <li>
                        <strong>Security Tokens:</strong> Tokens that represent ownership, profit-sharing, or investment
                        opportunities are generally not permitted as rewards unless you have obtained proper regulatory
                        approvals.
                      </li>
                      <li>
                        <strong>Existing Cryptocurrencies:</strong> Offering established cryptocurrencies (like Bitcoin
                        or Ethereum) as rewards is permitted, but may be subject to additional review.
                      </li>
                    </ul>
                    <p>
                      All token offerings must comply with applicable securities laws and regulations in all relevant
                      jurisdictions. We strongly recommend consulting with a legal expert before offering tokens as
                      rewards.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>How do I receive funds after a successful campaign?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      After your campaign successfully reaches its funding goal, the fund distribution process works as
                      follows:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>
                        <strong>Verification Period:</strong> There is a 3-day verification period after your campaign
                        ends to allow for payment processing and verification.
                      </li>
                      <li>
                        <strong>Fund Transfer:</strong> After the verification period, funds (minus platform fees) will
                        be transferred to your designated wallet or bank account.
                      </li>
                      <li>
                        <strong>Fiat Currencies:</strong> For funds raised in fiat currencies, transfers typically take
                        5-7 business days to complete.
                      </li>
                      <li>
                        <strong>Cryptocurrencies:</strong> For funds raised in cryptocurrencies, transfers are typically
                        completed within 24-48 hours.
                      </li>
                    </ul>
                    <p>
                      You must have completed all verification steps and provided valid payment information before funds
                      can be transferred. Any issues with verification or payment information may delay the transfer
                      process.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>What support does ECE Crowdfunding provide to creators?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">ECE Crowdfunding provides several support resources for project creators:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>
                        <strong>Creator Dashboard:</strong> A comprehensive dashboard to track your campaign's progress,
                        backer information, and analytics.
                      </li>
                      <li>
                        <strong>Creator Guide:</strong> Detailed documentation and best practices for running a
                        successful campaign.
                      </li>
                      <li>
                        <strong>Dedicated Support:</strong> Access to our support team for questions and assistance
                        throughout your campaign.
                      </li>
                      <li>
                        <strong>Marketing Support:</strong> Featured placement opportunities and promotion through our
                        channels for selected projects.
                      </li>
                      <li>
                        <strong>Community:</strong> Access to our creator community for networking and sharing
                        experiences.
                      </li>
                    </ul>
                    <p>
                      For projects raising over 100,000 ECE, we also offer enhanced support including personalized
                      campaign strategy sessions and priority support.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>What happens if I can't fulfill the rewards as promised?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      If you encounter challenges fulfilling rewards as promised, you should take the following steps:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>
                        <strong>Communicate Early:</strong> Inform your backers as soon as possible about any delays or
                        issues through project updates.
                      </li>
                      <li>
                        <strong>Provide Alternatives:</strong> If possible, offer alternative rewards or solutions to
                        backers.
                      </li>
                      <li>
                        <strong>Contact Support:</strong> Reach out to our support team for guidance on how to handle
                        the situation.
                      </li>
                      <li>
                        <strong>Refund Policy:</strong> In cases where fulfillment is impossible, you may need to
                        provide refunds to backers.
                      </li>
                    </ul>
                    <p>
                      Failure to fulfill rewards or communicate with backers may result in account restrictions and
                      could affect your ability to launch future projects on our platform. It may also have legal
                      implications, as backers have entered into an agreement with you when they pledged support.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold">Ready to Launch Your Project?</h2>
                <p className="text-lg text-muted-foreground">
                  Join the growing community of blockchain innovators on ECE Crowdfunding and bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link href="/app">Start a Project</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
