import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturesPage() {
  const featureSections = [
    {
      title: "Custom Development",
      description: "Our expert team builds your blockchain application from start to finish",
      icon: "🛠️",
      features: [
        "Personalized consultation and requirements gathering",
        "Custom smart contract development",
        "Tailored UI/UX design for your brand",
        "Comprehensive testing and quality assurance",
        "Deployment to your preferred blockchain networks",
      ],
      shape: "cube" as const,
      learnMoreLink: "/app/development-tools",
    },
    {
      title: "Project Management",
      description: "Track your project's progress with our comprehensive dashboard",
      icon: "📊",
      features: [
        "Real-time development status updates",
        "Milestone tracking and notifications",
        "Direct communication with development team",
        "Approval workflows for key deliverables",
        "Transparent timeline visualization",
      ],
      shape: "cylinder" as const,
      learnMoreLink: "/app/crowdfunding",
    },
    {
      title: "Delivery & Support",
      description: "Seamless delivery and ongoing support for your application",
      icon: "🚀",
      features: [
        "Smooth handover process",
        "Comprehensive documentation",
        "Training for your team",
        "Ongoing maintenance packages",
        "Future enhancement options",
      ],
      shape: "torus" as const,
      learnMoreLink: "/marketplace",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
              Our Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Custom <span className="text-primary">Blockchain App Development</span> Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover how our expert team builds and delivers custom blockchain applications tailored to your specific
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/app">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      {featureSections.map((section, index) => (
        <section key={section.title} className={`py-16 px-4 ${index % 2 === 1 ? "bg-muted/50 dark:bg-muted/20" : ""}`}>
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className={`flex-1 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 text-sm text-primary mb-4">
                  <span className="text-lg" aria-hidden="true">
                    {section.icon}
                  </span>
                  <span>{section.title}</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">{section.description}</p>
                <ul className="space-y-4">
                  {section.features.map((feature) => (
                    <li key={feature} className="flex items-start group transition-all duration-200">
                      <div className="mr-3 mt-1 flex-shrink-0 rounded-full bg-primary/10 p-1 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="link"
                  className="mt-6 p-0 flex items-center gap-1 text-primary hover:underline focus:ring-2 focus:ring-primary/20 focus:outline-none rounded-md"
                >
                  <Link href={section.learnMoreLink} className="inline-flex items-center">
                    <span>Learn more</span> <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className={`flex-1 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
                  <div className="relative w-full" style={{ height: "360px" }}>
                    <iframe
                      src={
                        index === 0
                          ? "https://my.spline.design/ecepathicons-y99pyhUtHckD6kO4V6kvKC3q/"
                          : index === 1
                            ? "https://my.spline.design/ecegantticon-Wu2xevSUDxiMge9dkxVkcUHF/"
                            : "https://my.spline.design/ececrossicon-TpuUOtOV9JbVqLuctxAHqEED/"
                      }
                      frameBorder="0"
                      width="100%"
                      height="100%"
                      title={`${section.title} 3D Icon`}
                      className="absolute inset-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-card dark:bg-[#010817] border rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:max-w-xs">
                <h2 className="text-3xl font-bold mb-4">Ready to build your blockchain application?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Join our satisfied clients who have transformed their ideas into reality with our custom development
                  services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <Link href="/app">Place an Order</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <Link href="/contact">Request Consultation</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-[500px] h-80 relative">
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <iframe
                    src="https://my.spline.design/eceflatwave-Y69u366c7TIynMdbjBBiXNwA/"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    title="Blockchain Wave Animation"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
