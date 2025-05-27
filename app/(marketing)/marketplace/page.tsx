import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Tag, Shield, Award, Users, Gift } from "lucide-react"
import { MatcapCard } from "@/components/3d/MatcapCard"
import { VerticalCardStack } from "@/components/marketplace/vertical-card-stack"

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-6 py-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Pre-Built <span className="text-primary">Blockchain App Ideas</span> Ready to Develop
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse our catalog of pre-designed blockchain application concepts. Place an order, and our team will build
            it for you while you track progress through our custom dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/app/marketplace">
                <span className="flex items-center">Browse App Ideas</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">
                <span className="flex items-center">Request Custom App</span>
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/app/marketplace/vertical-feed">
                <span className="flex items-center">Try Vertical View</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="/placeholder-byvq9.png"
            alt="Blockchain Solutions"
            className="rounded-lg object-cover shadow-lg"
            width={500}
            height={300}
          />
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">App Categories</h2>
          <Button variant="ghost" asChild>
            <Link href="/app/marketplace">
              <span className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/app/marketplace?category=${category.id}`} className="group block">
              <div className="bg-card dark:bg-[#010817] border rounded-lg p-6 h-full transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <div className="mb-4 text-primary">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground">{category.description}</p>
                <div className="mt-4 text-sm text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore {category.name} <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured App Ideas</h2>
          <Button variant="ghost" asChild>
            <Link href="/app/marketplace">
              <span className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <VerticalCardStack products={featuredProducts.slice(0, 2)} title="Security & Infrastructure" />
          <VerticalCardStack products={featuredProducts.slice(2, 4)} title="DeFi & NFT Solutions" />
        </div>
      </div>

      {/* Become a Seller */}
      <div className="mb-16 bg-muted rounded-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="flex-1 p-8 lg:p-12 space-y-6">
            <h2 className="text-3xl font-bold">Custom App Development</h2>
            <p className="text-muted-foreground">
              Don't see what you're looking for? We can build a completely custom blockchain application tailored to
              your specific requirements and business needs.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span>Personalized consultation and requirements gathering</span>
              </li>
              <li className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                  <Tag className="h-5 w-5" />
                </div>
                <span>Transparent pricing and development timeline</span>
              </li>
              <li className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <span>Real-time progress tracking through our dashboard</span>
              </li>
            </ul>
            <Button size="lg" asChild>
              <Link href="/auth/signup" className="px-6 py-3 w-full flex items-center justify-start">
                <span className="flex items-center">Request Custom App</span>
              </Link>
            </Button>
          </div>
          <div className="flex-1 h-full">
            <div className="rounded-lg overflow-hidden h-full" style={{ maxHeight: "400px" }}>
              <MatcapCard
                title="Developer Tools"
                shape="cube"
                color="#0e5f59"
                width="100%"
                height="100%"
                rotationSpeed={0.001}
                fixedScroll={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get different shapes for different products
function getShapeForProduct(id: number) {
  const shapes = ["cube", "rounded", "cylinder", "torus", "sphere"] as const
  return shapes[id % shapes.length]
}

// Sample data
const categories = [
  {
    id: "security",
    name: "Security Applications",
    description: "Blockchain security tools, audit platforms, and vulnerability scanners for your organization.",
    icon: <Shield className="h-8 w-8" />,
  },
  {
    id: "defi",
    name: "DeFi Solutions",
    description: "Custom decentralized finance applications including lending, borrowing, and yield platforms.",
    icon: <Gift className="h-8 w-8" />,
  },
  {
    id: "nft",
    name: "NFT Platforms",
    description: "NFT marketplaces, creation tools, and management systems for digital assets.",
    icon: <Award className="h-8 w-8" />,
  },
  {
    id: "dao",
    name: "DAO Governance",
    description: "Decentralized autonomous organization frameworks and voting systems.",
    icon: <Users className="h-8 w-8" />,
  },
  {
    id: "infrastructure",
    name: "Blockchain Infrastructure",
    description: "Core infrastructure components, nodes, and development frameworks for your business.",
    icon: <ShoppingBag className="h-8 w-8" />,
  },
  {
    id: "analytics",
    name: "Analytics Platforms",
    description: "Data analysis tools, dashboards, and insights for blockchain networks and transactions.",
    icon: <Tag className="h-8 w-8" />,
  },
]

const featuredProducts = [
  {
    id: 1,
    name: "Blockchain Security Scanner",
    description: "A comprehensive security scanner for smart contracts with automated vulnerability detection.",
    price: 12999,
    image: "/images/products/security-scanner.png",
    seller: "4-6 weeks",
    rating: 4.8,
    badge: "Popular",
    tags: ["Security", "Smart Contracts", "Auditing"],
  },
  {
    id: 2,
    name: "Cross-Chain Bridge",
    description: "Secure bridge application for transferring assets between different blockchain networks.",
    price: 15999,
    image: "/images/products/blockchain-bridge.png",
    seller: "6-8 weeks",
    rating: 4.7,
    badge: "New",
    tags: ["Cross-Chain", "Interoperability", "Asset Transfer"],
  },
  {
    id: 3,
    name: "DeFi Yield Aggregator",
    description: "Platform that automatically finds and allocates assets to the highest yielding DeFi protocols.",
    price: 18999,
    image: "/images/products/defi-protocol.png",
    seller: "8-10 weeks",
    rating: 4.5,
    tags: ["DeFi", "Yield Farming", "Aggregator"],
  },
  {
    id: 4,
    name: "NFT Gaming Platform",
    description: "Complete platform for creating and monetizing blockchain games with NFT assets.",
    price: 24999,
    image: "/images/products/nft-gaming.png",
    seller: "10-12 weeks",
    rating: 4.9,
    badge: "Complex",
    tags: ["NFT", "Gaming", "Marketplace"],
  },
]
