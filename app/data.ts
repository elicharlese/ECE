export interface App {
  id: number
  name: string
  description: string
  category: string
  fundingGoal?: number
  currentFunding?: number
  backers?: number
  location: string
  image: string
  images: string[] // Add this new field for multiple images
  type: "crowdfunding" | "marketplace"
  price?: number
  valuation?: number
  downloads?: number
  rating?: number
  revenue?: number
  ownershipPercentage?: number
  platform: "iOS" | "Android" | "Web" | "Cross-platform"
  stage: "Idea" | "MVP" | "Growth" | "Profitable"
  monthlyUsers?: number

  // Enhanced features
  founder: {
    name: string
    avatar: string
    background: string
    previousExits?: number
  }
  team: {
    size: number
    keyMembers: string[]
  }
  market: {
    size: string
    growth: string
    competition: "Low" | "Medium" | "High"
  }
  metrics: {
    userGrowthRate: string
    revenueGrowthRate?: string
    churnRate?: string
    ltv?: number
    cac?: number
  }
  risks: {
    level: "Low" | "Medium" | "High"
    factors: string[]
  }

  // Betting features for crowdfunding
  betting?: {
    willReachGoal: {
      odds: number
      totalBets: number
      percentage: number
    }
    wontReachGoal: {
      odds: number
      totalBets: number
      percentage: number
    }
    deadline: string
    totalBettingPool: number
    predictions: {
      bullish: number
      bearish: number
      neutral: number
    }
  }

  // Social proof
  social: {
    mentions: number
    sentiment: "Positive" | "Neutral" | "Negative"
    influencerBacked: boolean
    mediaFeatures: string[]
  }

  // Additional details
  businessModel: string
  revenueStreams: string[]
  keyPartners?: string[]
  achievements: string[]
  roadmap: {
    q1: string
    q2: string
    q3: string
    q4: string
  }
}

export const formatCurrency = (amount: number) => {
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " ECE"
  )
}

// Update each app to include multiple images
export const apps: App[] = [
  {
    id: 1,
    name: "MindfulMoments",
    description:
      "AI-powered meditation app with personalized sessions. Growing 40% month-over-month with 50K+ active users.",
    category: "Health & Wellness",
    fundingGoal: 25000000,
    currentFunding: 18000000,
    backers: 847,
    location: "San Francisco, CA",
    image: "/meditation-app-interface.png",
    images: [
      "/meditation-app-interface.png",
      "/placeholder.svg?height=600&width=400&text=Dashboard",
      "/placeholder.svg?height=600&width=400&text=Sessions",
      "/placeholder.svg?height=600&width=400&text=Progress",
    ],
    type: "crowdfunding",
    valuation: 200000000,
    downloads: 125000,
    rating: 4.8,
    platform: "Cross-platform",
    stage: "Growth",
    monthlyUsers: 52000,
    founder: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=50&width=50&text=SC",
      background: "Former Google PM, Stanford MBA",
      previousExits: 1,
    },
    team: {
      size: 8,
      keyMembers: ["CTO: Alex Kim (ex-Apple)", "Head of AI: Dr. Maria Santos"],
    },
    market: {
      size: "$4.2B",
      growth: "23% CAGR",
      competition: "Medium",
    },
    metrics: {
      userGrowthRate: "40% MoM",
      revenueGrowthRate: "35% MoM",
      churnRate: "5%",
      ltv: 18000,
      cac: 2500,
    },
    risks: {
      level: "Medium",
      factors: ["Market saturation", "User acquisition costs"],
    },
    betting: {
      willReachGoal: {
        odds: 1.65,
        totalBets: 4500000,
        percentage: 73,
      },
      wontReachGoal: {
        odds: 2.35,
        totalBets: 1650000,
        percentage: 27,
      },
      deadline: "Dec 31, 2024",
      totalBettingPool: 6150000,
      predictions: {
        bullish: 68,
        bearish: 22,
        neutral: 10,
      },
    },
    social: {
      mentions: 1250,
      sentiment: "Positive",
      influencerBacked: true,
      mediaFeatures: ["TechCrunch", "Forbes", "Wired"],
    },
    businessModel: "Freemium + Premium Subscriptions",
    revenueStreams: ["Premium subscriptions", "Corporate wellness", "In-app purchases"],
    keyPartners: ["Headspace", "Calm", "Mayo Clinic"],
    achievements: ["App Store Editor's Choice", "Google Play Award", "50K+ users in 6 months"],
    roadmap: {
      q1: "AI personalization engine",
      q2: "Corporate partnerships",
      q3: "International expansion",
      q4: "AR/VR integration",
    },
  },
  {
    id: 2,
    name: "TaskFlow Pro",
    description: "Premium productivity app with 10K+ paying subscribers. Proven revenue model, seeking new ownership.",
    category: "Productivity",
    location: "Austin, TX",
    image: "/placeholder-6x8w1.png",
    images: [
      "/placeholder-6x8w1.png",
      "/placeholder.svg?height=600&width=400&text=Tasks",
      "/placeholder.svg?height=600&width=400&text=Calendar",
      "/placeholder.svg?height=600&width=400&text=Analytics",
    ],
    type: "marketplace",
    price: 45000000,
    valuation: 120000000,
    downloads: 89000,
    rating: 4.6,
    revenue: 4500000,
    ownershipPercentage: 75,
    platform: "iOS",
    stage: "Profitable",
    monthlyUsers: 28000,
    founder: {
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=50&width=50&text=MR",
      background: "Serial entrepreneur, 2 successful exits",
      previousExits: 2,
    },
    team: {
      size: 5,
      keyMembers: ["Lead Dev: Jenny Park", "Marketing: Tom Wilson"],
    },
    market: {
      size: "$58B",
      growth: "8% CAGR",
      competition: "High",
    },
    metrics: {
      userGrowthRate: "12% MoM",
      revenueGrowthRate: "8% MoM",
      churnRate: "3%",
      ltv: 24000,
      cac: 3500,
    },
    risks: {
      level: "Low",
      factors: ["Market competition", "Platform dependency"],
    },
    social: {
      mentions: 890,
      sentiment: "Positive",
      influencerBacked: false,
      mediaFeatures: ["Product Hunt", "Hacker News"],
    },
    businessModel: "SaaS Subscription",
    revenueStreams: ["Monthly subscriptions", "Annual plans", "Enterprise licenses"],
    achievements: ["Product Hunt #1", "10K+ paying users", "99.9% uptime"],
    roadmap: {
      q1: "Team collaboration features",
      q2: "API integrations",
      q3: "Mobile app redesign",
      q4: "Enterprise features",
    },
  },
  {
    id: 3,
    name: "CryptoTracker",
    description:
      "Real-time crypto portfolio tracker with advanced analytics. Seeking funding for institutional features.",
    category: "Finance",
    fundingGoal: 50000000,
    currentFunding: 7500000,
    backers: 234,
    location: "New York, NY",
    image: "/cryptocurrency-trading-app.png",
    images: [
      "/cryptocurrency-trading-app.png",
      "/placeholder.svg?height=600&width=400&text=Portfolio",
      "/placeholder.svg?height=600&width=400&text=Charts",
      "/placeholder.svg?height=600&width=400&text=Alerts",
    ],
    type: "crowdfunding",
    valuation: 500000000,
    downloads: 45000,
    rating: 4.4,
    platform: "Cross-platform",
    stage: "MVP",
    monthlyUsers: 15000,
    founder: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=50&width=50&text=DK",
      background: "Ex-Goldman Sachs, Blockchain expert",
      previousExits: 0,
    },
    team: {
      size: 12,
      keyMembers: ["CTO: Lisa Zhang (ex-Coinbase)", "Head of Security: John Smith"],
    },
    market: {
      size: "$3.1B",
      growth: "45% CAGR",
      competition: "High",
    },
    metrics: {
      userGrowthRate: "25% MoM",
      churnRate: "8%",
      ltv: 12000,
      cac: 4500,
    },
    risks: {
      level: "High",
      factors: ["Regulatory uncertainty", "Market volatility", "Competition"],
    },
    betting: {
      willReachGoal: {
        odds: 3.2,
        totalBets: 1200000,
        percentage: 35,
      },
      wontReachGoal: {
        odds: 1.4,
        totalBets: 2200000,
        percentage: 65,
      },
      deadline: "Mar 15, 2025",
      totalBettingPool: 3400000,
      predictions: {
        bullish: 28,
        bearish: 58,
        neutral: 14,
      },
    },
    social: {
      mentions: 2100,
      sentiment: "Neutral",
      influencerBacked: true,
      mediaFeatures: ["CoinDesk", "Decrypt", "The Block"],
    },
    businessModel: "Freemium + Premium Features",
    revenueStreams: ["Premium subscriptions", "API access", "White-label solutions"],
    achievements: ["Featured on CoinDesk", "15K+ users", "SOC 2 compliance"],
    roadmap: {
      q1: "Institutional dashboard",
      q2: "DeFi integration",
      q3: "Tax reporting tools",
      q4: "Mobile trading features",
    },
  },
  {
    id: 4,
    name: "FoodieFinds",
    description:
      "Local restaurant discovery app with 25K+ monthly users. Established revenue from restaurant partnerships.",
    category: "Food & Drink",
    location: "Portland, OR",
    image: "/restaurant-discovery-app.png",
    images: [
      "/restaurant-discovery-app.png",
      "/placeholder.svg?height=600&width=400&text=Map",
      "/placeholder.svg?height=600&width=400&text=Reviews",
      "/placeholder.svg?height=600&width=400&text=Booking",
    ],
    type: "marketplace",
    price: 18000000,
    valuation: 60000000,
    downloads: 67000,
    rating: 4.7,
    revenue: 1200000,
    ownershipPercentage: 100,
    platform: "Cross-platform",
    stage: "Growth",
    monthlyUsers: 25000,
    founder: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=50&width=50&text=ET",
      background: "Former Yelp engineer, Food industry veteran",
      previousExits: 0,
    },
    team: {
      size: 6,
      keyMembers: ["Chef Advisor: Gordon Ramsay Jr.", "Marketing: Sarah Lee"],
    },
    market: {
      size: "$12B",
      growth: "15% CAGR",
      competition: "High",
    },
    metrics: {
      userGrowthRate: "18% MoM",
      revenueGrowthRate: "22% MoM",
      churnRate: "6%",
      ltv: 8500,
      cac: 1800,
    },
    risks: {
      level: "Medium",
      factors: ["Platform competition", "Restaurant partnerships"],
    },
    social: {
      mentions: 650,
      sentiment: "Positive",
      influencerBacked: true,
      mediaFeatures: ["Food & Wine", "Eater", "Local newspapers"],
    },
    businessModel: "Commission + Advertising",
    revenueStreams: ["Restaurant commissions", "Featured listings", "Advertising"],
    achievements: ["25K+ monthly users", "500+ restaurant partners", "4.7★ rating"],
    roadmap: {
      q1: "Delivery integration",
      q2: "Loyalty program",
      q3: "Expand to 5 new cities",
      q4: "AI recommendations",
    },
  },
  {
    id: 5,
    name: "StudyBuddy AI",
    description: "AI-powered study companion for students. Viral growth in universities, seeking expansion funding.",
    category: "Education",
    fundingGoal: 30000000,
    currentFunding: 22000000,
    backers: 1456,
    location: "Boston, MA",
    image: "/ai-study-app-interface.png",
    images: [
      "/ai-study-app-interface.png",
      "/placeholder.svg?height=600&width=400&text=Study+Plans",
      "/placeholder.svg?height=600&width=400&text=AI+Tutor",
      "/placeholder.svg?height=600&width=400&text=Progress",
    ],
    type: "crowdfunding",
    valuation: 350000000,
    downloads: 156000,
    rating: 4.9,
    platform: "Cross-platform",
    stage: "Growth",
    monthlyUsers: 78000,
    founder: {
      name: "Dr. Raj Patel",
      avatar: "/placeholder.svg?height=50&width=50&text=RP",
      background: "MIT PhD, Former Khan Academy",
      previousExits: 1,
    },
    team: {
      size: 15,
      keyMembers: ["Head of AI: Dr. Susan Lee", "Education Expert: Prof. James Wilson"],
    },
    market: {
      size: "$350B",
      growth: "16% CAGR",
      competition: "Medium",
    },
    metrics: {
      userGrowthRate: "55% MoM",
      revenueGrowthRate: "48% MoM",
      churnRate: "4%",
      ltv: 9500,
      cac: 1200,
    },
    risks: {
      level: "Low",
      factors: ["Academic partnerships", "Content moderation"],
    },
    betting: {
      willReachGoal: {
        odds: 1.25,
        totalBets: 8500000,
        percentage: 89,
      },
      wontReachGoal: {
        odds: 4.5,
        totalBets: 1050000,
        percentage: 11,
      },
      deadline: "Jan 20, 2025",
      totalBettingPool: 9550000,
      predictions: {
        bullish: 84,
        bearish: 8,
        neutral: 8,
      },
    },
    social: {
      mentions: 3200,
      sentiment: "Positive",
      influencerBacked: true,
      mediaFeatures: ["EdTech Magazine", "Chronicle of Higher Education", "MIT News"],
    },
    businessModel: "Freemium + Institutional Licenses",
    revenueStreams: ["Student subscriptions", "University licenses", "Tutoring marketplace"],
    achievements: ["78K+ students", "50+ university partnerships", "4.9★ rating"],
    roadmap: {
      q1: "Advanced AI tutoring",
      q2: "Group study features",
      q3: "International expansion",
      q4: "VR study environments",
    },
  },
  {
    id: 6,
    name: "PetCare Plus",
    description:
      "Comprehensive pet health tracking app. Profitable with veterinary partnerships. Partial ownership available.",
    category: "Lifestyle",
    location: "Denver, CO",
    image: "/pet-care-app-interface.png",
    images: [
      "/pet-care-app-interface.png",
      "/placeholder.svg?height=600&width=400&text=Health+Records",
      "/placeholder.svg?height=600&width=400&text=Vet+Chat",
      "/placeholder.svg?height=600&width=400&text=Reminders",
    ],
    type: "marketplace",
    price: 8500000,
    valuation: 40000000,
    downloads: 34000,
    rating: 4.5,
    revenue: 850000,
    ownershipPercentage: 30,
    platform: "iOS",
    stage: "Profitable",
    monthlyUsers: 12000,
    founder: {
      name: "Dr. Lisa Martinez",
      avatar: "/placeholder.svg?height=50&width=50&text=LM",
      background: "Veterinarian, Pet industry expert",
      previousExits: 0,
    },
    team: {
      size: 4,
      keyMembers: ["Vet Advisor: Dr. Robert Kim", "Developer: Anna Chen"],
    },
    market: {
      size: "$261B",
      growth: "6% CAGR",
      competition: "Low",
    },
    metrics: {
      userGrowthRate: "8% MoM",
      revenueGrowthRate: "12% MoM",
      churnRate: "2%",
      ltv: 18000,
      cac: 2800,
    },
    risks: {
      level: "Low",
      factors: ["Vet partnerships", "User engagement"],
    },
    social: {
      mentions: 420,
      sentiment: "Positive",
      influencerBacked: false,
      mediaFeatures: ["Pet Industry News", "Veterinary Practice News"],
    },
    businessModel: "Subscription + Marketplace",
    revenueStreams: ["Monthly subscriptions", "Vet consultations", "Pet product sales"],
    achievements: ["12K+ pet owners", "200+ vet partners", "Profitable since month 8"],
    roadmap: {
      q1: "Telemedicine features",
      q2: "Pet insurance integration",
      q3: "Wearable device support",
      q4: "Expand to cats",
    },
  },
]

// Chart data for each app with projections
export const chartData: Record<
  number,
  { revenue: any[]; users: any[]; projectedRevenue: any[]; projectedUsers: any[] }
> = {
  1: {
    // MindfulMoments - High growth trajectory
    revenue: [
      { month: "Jan", revenue: 250000, type: "actual" },
      { month: "Feb", revenue: 320000, type: "actual" },
      { month: "Mar", revenue: 410000, type: "actual" },
      { month: "Apr", revenue: 580000, type: "actual" },
      { month: "May", revenue: 720000, type: "actual" },
      { month: "Jun", revenue: 950000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 12000, type: "actual" },
      { month: "Feb", users: 18500, type: "actual" },
      { month: "Mar", users: 26000, type: "actual" },
      { month: "Apr", users: 35000, type: "actual" },
      { month: "May", users: 44000, type: "actual" },
      { month: "Jun", users: 52000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 950000, type: "actual" },
      { month: "Jul", revenue: 1250000, type: "projected" },
      { month: "Aug", revenue: 1620000, type: "projected" },
      { month: "Sep", revenue: 2100000, type: "projected" },
      { month: "Oct", revenue: 2730000, type: "projected" },
      { month: "Nov", revenue: 3550000, type: "projected" },
      { month: "Dec", revenue: 4620000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 52000, type: "actual" },
      { month: "Jul", users: 68000, type: "projected" },
      { month: "Aug", users: 88000, type: "projected" },
      { month: "Sep", users: 114000, type: "projected" },
      { month: "Oct", users: 148000, type: "projected" },
      { month: "Nov", users: 192000, type: "projected" },
      { month: "Dec", users: 250000, type: "projected" },
    ],
  },
  2: {
    // TaskFlow Pro - Stable growth
    revenue: [
      { month: "Jan", revenue: 3800000, type: "actual" },
      { month: "Feb", revenue: 4100000, type: "actual" },
      { month: "Mar", revenue: 4350000, type: "actual" },
      { month: "Apr", revenue: 4500000, type: "actual" },
      { month: "May", revenue: 4500000, type: "actual" },
      { month: "Jun", revenue: 4500000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 24000, type: "actual" },
      { month: "Feb", users: 25500, type: "actual" },
      { month: "Mar", users: 26800, type: "actual" },
      { month: "Apr", users: 27500, type: "actual" },
      { month: "May", users: 28000, type: "actual" },
      { month: "Jun", users: 28000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 4500000, type: "actual" },
      { month: "Jul", revenue: 4650000, type: "projected" },
      { month: "Aug", revenue: 4800000, type: "projected" },
      { month: "Sep", revenue: 4950000, type: "projected" },
      { month: "Oct", revenue: 5100000, type: "projected" },
      { month: "Nov", revenue: 5250000, type: "projected" },
      { month: "Dec", revenue: 5400000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 28000, type: "actual" },
      { month: "Jul", users: 29000, type: "projected" },
      { month: "Aug", users: 30000, type: "projected" },
      { month: "Sep", users: 31000, type: "projected" },
      { month: "Oct", users: 32000, type: "projected" },
      { month: "Nov", users: 33000, type: "projected" },
      { month: "Dec", users: 34000, type: "projected" },
    ],
  },
  3: {
    // CryptoTracker - Exponential early growth
    revenue: [
      { month: "Jan", revenue: 0, type: "actual" },
      { month: "Feb", revenue: 50000, type: "actual" },
      { month: "Mar", revenue: 120000, type: "actual" },
      { month: "Apr", revenue: 280000, type: "actual" },
      { month: "May", revenue: 450000, type: "actual" },
      { month: "Jun", revenue: 620000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 2000, type: "actual" },
      { month: "Feb", users: 4500, type: "actual" },
      { month: "Mar", users: 7800, type: "actual" },
      { month: "Apr", users: 11000, type: "actual" },
      { month: "May", users: 13500, type: "actual" },
      { month: "Jun", users: 15000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 620000, type: "actual" },
      { month: "Jul", revenue: 980000, type: "projected" },
      { month: "Aug", revenue: 1520000, type: "projected" },
      { month: "Sep", revenue: 2350000, type: "projected" },
      { month: "Oct", revenue: 3600000, type: "projected" },
      { month: "Nov", revenue: 5500000, type: "projected" },
      { month: "Dec", revenue: 8400000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 15000, type: "actual" },
      { month: "Jul", users: 19500, type: "projected" },
      { month: "Aug", users: 25500, type: "projected" },
      { month: "Sep", users: 33000, type: "projected" },
      { month: "Oct", users: 43000, type: "projected" },
      { month: "Nov", users: 56000, type: "projected" },
      { month: "Dec", users: 73000, type: "projected" },
    ],
  },
  4: {
    // FoodieFinds - Moderate steady growth
    revenue: [
      { month: "Jan", revenue: 850000, type: "actual" },
      { month: "Feb", revenue: 920000, type: "actual" },
      { month: "Mar", revenue: 1010000, type: "actual" },
      { month: "Apr", revenue: 1120000, type: "actual" },
      { month: "May", revenue: 1180000, type: "actual" },
      { month: "Jun", revenue: 1200000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 18000, type: "actual" },
      { month: "Feb", users: 20500, type: "actual" },
      { month: "Mar", users: 22000, type: "actual" },
      { month: "Apr", users: 23500, type: "actual" },
      { month: "May", users: 24500, type: "actual" },
      { month: "Jun", users: 25000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 1200000, type: "actual" },
      { month: "Jul", revenue: 1320000, type: "projected" },
      { month: "Aug", revenue: 1450000, type: "projected" },
      { month: "Sep", revenue: 1600000, type: "projected" },
      { month: "Oct", revenue: 1760000, type: "projected" },
      { month: "Nov", revenue: 1940000, type: "projected" },
      { month: "Dec", revenue: 2130000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 25000, type: "actual" },
      { month: "Jul", users: 27500, type: "projected" },
      { month: "Aug", users: 30000, type: "projected" },
      { month: "Sep", users: 33000, type: "projected" },
      { month: "Oct", users: 36000, type: "projected" },
      { month: "Nov", users: 39500, type: "projected" },
      { month: "Dec", users: 43000, type: "projected" },
    ],
  },
  5: {
    // StudyBuddy AI - Viral growth
    revenue: [
      { month: "Jan", revenue: 120000, type: "actual" },
      { month: "Feb", revenue: 280000, type: "actual" },
      { month: "Mar", revenue: 550000, type: "actual" },
      { month: "Apr", revenue: 1200000, type: "actual" },
      { month: "May", revenue: 1850000, type: "actual" },
      { month: "Jun", revenue: 2400000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 15000, type: "actual" },
      { month: "Feb", users: 28000, type: "actual" },
      { month: "Mar", users: 42000, type: "actual" },
      { month: "Apr", users: 58000, type: "actual" },
      { month: "May", users: 68000, type: "actual" },
      { month: "Jun", users: 78000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 2400000, type: "actual" },
      { month: "Jul", revenue: 3200000, type: "projected" },
      { month: "Aug", revenue: 4250000, type: "projected" },
      { month: "Sep", revenue: 5650000, type: "projected" },
      { month: "Oct", revenue: 7500000, type: "projected" },
      { month: "Nov", revenue: 9950000, type: "projected" },
      { month: "Dec", revenue: 13200000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 78000, type: "actual" },
      { month: "Jul", users: 95000, type: "projected" },
      { month: "Aug", users: 115000, type: "projected" },
      { month: "Sep", users: 140000, type: "projected" },
      { month: "Oct", users: 170000, type: "projected" },
      { month: "Nov", users: 206000, type: "projected" },
      { month: "Dec", users: 250000, type: "projected" },
    ],
  },
  6: {
    // PetCare Plus - Slow steady growth
    revenue: [
      { month: "Jan", revenue: 720000, type: "actual" },
      { month: "Feb", revenue: 780000, type: "actual" },
      { month: "Mar", revenue: 810000, type: "actual" },
      { month: "Apr", revenue: 830000, type: "actual" },
      { month: "May", revenue: 840000, type: "actual" },
      { month: "Jun", revenue: 850000, type: "actual" },
    ],
    users: [
      { month: "Jan", users: 10500, type: "actual" },
      { month: "Feb", users: 11200, type: "actual" },
      { month: "Mar", users: 11600, type: "actual" },
      { month: "Apr", users: 11800, type: "actual" },
      { month: "May", users: 12000, type: "actual" },
      { month: "Jun", users: 12000, type: "actual" },
    ],
    projectedRevenue: [
      { month: "Jun", revenue: 850000, type: "actual" },
      { month: "Jul", revenue: 880000, type: "projected" },
      { month: "Aug", revenue: 910000, type: "projected" },
      { month: "Sep", revenue: 940000, type: "projected" },
      { month: "Oct", revenue: 970000, type: "projected" },
      { month: "Nov", revenue: 1000000, type: "projected" },
      { month: "Dec", revenue: 1030000, type: "projected" },
    ],
    projectedUsers: [
      { month: "Jun", users: 12000, type: "actual" },
      { month: "Jul", users: 12500, type: "projected" },
      { month: "Aug", users: 13000, type: "projected" },
      { month: "Sep", users: 13500, type: "projected" },
      { month: "Oct", users: 14000, type: "projected" },
      { month: "Nov", users: 14500, type: "projected" },
      { month: "Dec", users: 15000, type: "projected" },
    ],
  },
}
