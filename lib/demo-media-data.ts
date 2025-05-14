import type { MediaItem, MediaCategory, MediaCollection } from "@/types/media"

// Helper function to generate a random date within the last 30 days
const randomRecentDate = () => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  return new Date(randomTime).toISOString()
}

// Helper function to generate random numbers for engagement metrics
const randomEngagement = (max: number) => Math.floor(Math.random() * max)

// Demo categories
export const demoMediaCategories: MediaCategory[] = [
  {
    id: "photography",
    name: "Photography",
    description: "Beautiful photographs from around the world",
    iconName: "camera",
    coverImage: "/photography-still-life.png",
    count: 42,
  },
  {
    id: "music",
    name: "Music",
    description: "Audio tracks, songs, and compositions",
    iconName: "music",
    coverImage: "/diverse-group-making-music.png",
    count: 38,
  },
  {
    id: "videos",
    name: "Videos",
    description: "Short films, animations, and video content",
    iconName: "video",
    coverImage: "/placeholder.svg?key=43j31",
    count: 27,
  },
  {
    id: "design",
    name: "Design",
    description: "Graphic design, illustrations, and digital art",
    iconName: "palette",
    coverImage: "/abstract-design-elements.png",
    count: 31,
  },
  {
    id: "documents",
    name: "Documents",
    description: "Articles, research papers, and written content",
    iconName: "file-text",
    coverImage: "/organized-documents.png",
    count: 19,
  },
  {
    id: "podcasts",
    name: "Podcasts",
    description: "Audio podcasts and spoken word content",
    iconName: "mic",
    coverImage: "/podcasts.png",
    count: 15,
  },
]

// Demo media items
export const demoMediaItems: MediaItem[] = [
  // Photography
  {
    id: "photo1",
    title: "Sunset Over Mountains",
    description: "A breathtaking sunset captured over a mountain range in Colorado.",
    type: "image",
    url: "/placeholder.svg?key=m7at5",
    creatorId: "user1",
    creatorName: "Alex Morgan",
    creatorAvatar: "/diverse-group.png",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(5000),
    likes: randomEngagement(1200),
    comments: randomEngagement(80),
    shares: randomEngagement(300),
    fileSize: 2400000,
    tags: ["nature", "sunset", "mountains", "landscape"],
    category: "photography",
    isPublic: true,
    isFeatured: true,
    isExclusive: false,
    license: "CC BY-NC",
  },
  {
    id: "photo2",
    title: "Urban Architecture",
    description: "Modern architectural marvels in the heart of Tokyo.",
    type: "image",
    url: "/urban-architecture.png",
    creatorId: "user2",
    creatorName: "Jamie Lee",
    creatorAvatar: "/diverse-group-conversation.png",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(3800),
    likes: randomEngagement(950),
    comments: randomEngagement(65),
    shares: randomEngagement(210),
    fileSize: 1800000,
    tags: ["urban", "architecture", "city", "modern"],
    category: "photography",
    isPublic: true,
    isFeatured: false,
    isExclusive: false,
    license: "CC BY",
  },

  // Videos
  {
    id: "video1",
    title: "Morning Routine Timelapse",
    description: "A day in the life: morning routine captured in a beautiful timelapse.",
    type: "video",
    url: "/diverse-morning-routine.png",
    thumbnailUrl: "/morning-routine-thumbnail.png",
    creatorId: "user3",
    creatorName: "Sam Wilson",
    creatorAvatar: "/diverse-group-meeting.png",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(12000),
    likes: randomEngagement(3400),
    comments: randomEngagement(210),
    shares: randomEngagement(850),
    duration: 183, // 3:03 in seconds
    fileSize: 78000000,
    tags: ["timelapse", "routine", "daily", "lifestyle"],
    category: "videos",
    isPublic: true,
    isFeatured: true,
    isExclusive: false,
    license: "Standard",
  },
  {
    id: "video2",
    title: "Drone Footage: Coastal Cliffs",
    description: "Stunning aerial footage of dramatic coastal cliffs and ocean waves.",
    type: "video",
    url: "/placeholder.svg?key=g27ae",
    thumbnailUrl: "/placeholder.svg?key=lsc7g",
    creatorId: "user4",
    creatorName: "Taylor Reed",
    creatorAvatar: "/diverse-group-meeting.png",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(8500),
    likes: randomEngagement(2100),
    comments: randomEngagement(145),
    shares: randomEngagement(620),
    duration: 247, // 4:07 in seconds
    fileSize: 104000000,
    tags: ["drone", "aerial", "ocean", "nature", "landscape"],
    category: "videos",
    isPublic: true,
    isFeatured: false,
    isExclusive: true,
    license: "Premium",
  },

  // Music
  {
    id: "audio1",
    title: "Ambient Meditation",
    description: "Calming ambient sounds perfect for meditation and relaxation.",
    type: "audio",
    url: "/placeholder.svg?key=wq8lb",
    thumbnailUrl: "/placeholder.svg?height=400&width=400&query=ambient%20meditation%20cover",
    creatorId: "user5",
    creatorName: "Jordan Blake",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person5",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(7200),
    likes: randomEngagement(1800),
    comments: randomEngagement(95),
    shares: randomEngagement(420),
    duration: 901, // 15:01 in seconds
    fileSize: 22000000,
    tags: ["ambient", "meditation", "relaxation", "calm"],
    category: "music",
    isPublic: true,
    isFeatured: true,
    isExclusive: false,
    license: "CC BY-NC-ND",
  },
  {
    id: "audio2",
    title: "Electronic Dance Mix",
    description: "Energetic electronic dance music mix to get you moving.",
    type: "audio",
    url: "/placeholder.svg?height=400&width=400&query=electronic%20dance",
    thumbnailUrl: "/placeholder.svg?height=400&width=400&query=electronic%20dance%20cover",
    creatorId: "user6",
    creatorName: "DJ Pulse",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person6",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(9500),
    likes: randomEngagement(2700),
    comments: randomEngagement(180),
    shares: randomEngagement(560),
    duration: 1324, // 22:04 in seconds
    fileSize: 32000000,
    tags: ["electronic", "dance", "edm", "mix", "party"],
    category: "music",
    isPublic: true,
    isFeatured: false,
    isExclusive: true,
    license: "Premium",
  },

  // Design
  {
    id: "design1",
    title: "Minimalist Logo Collection",
    description: "A collection of clean, minimalist logo designs for modern brands.",
    type: "image",
    url: "/placeholder.svg?height=800&width=1200&query=minimalist%20logos",
    creatorId: "user7",
    creatorName: "Morgan Design",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person7",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(6200),
    likes: randomEngagement(1500),
    comments: randomEngagement(110),
    shares: randomEngagement(380),
    fileSize: 3500000,
    tags: ["design", "logo", "minimalist", "branding"],
    category: "design",
    isPublic: true,
    isFeatured: true,
    isExclusive: false,
    license: "Commercial",
  },
  {
    id: "design2",
    title: "Digital Illustration: Fantasy World",
    description: "Detailed digital illustration of an imaginary fantasy landscape.",
    type: "image",
    url: "/placeholder.svg?height=800&width=1200&query=fantasy%20landscape%20illustration",
    creatorId: "user8",
    creatorName: "Aria Illustrations",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person8",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(5800),
    likes: randomEngagement(1400),
    comments: randomEngagement(85),
    shares: randomEngagement(290),
    fileSize: 4200000,
    tags: ["illustration", "fantasy", "digital art", "landscape"],
    category: "design",
    isPublic: true,
    isFeatured: false,
    isExclusive: true,
    license: "Premium",
  },

  // Documents
  {
    id: "doc1",
    title: "Guide to Modern Web Development",
    description: "Comprehensive guide covering the latest web development technologies and practices.",
    type: "document",
    url: "/placeholder.svg?height=800&width=600&query=web%20development%20guide",
    creatorId: "user9",
    creatorName: "Tech Insights",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person9",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(4200),
    likes: randomEngagement(980),
    comments: randomEngagement(75),
    shares: randomEngagement(320),
    fileSize: 1200000,
    tags: ["web development", "programming", "guide", "technology"],
    category: "documents",
    isPublic: true,
    isFeatured: true,
    isExclusive: false,
    license: "CC BY-SA",
  },
  {
    id: "doc2",
    title: "Research Paper: AI in Healthcare",
    description: "Academic research on the applications and implications of artificial intelligence in healthcare.",
    type: "document",
    url: "/placeholder.svg?height=800&width=600&query=ai%20healthcare%20research",
    creatorId: "user10",
    creatorName: "Dr. Lin Research",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person10",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(3100),
    likes: randomEngagement(720),
    comments: randomEngagement(60),
    shares: randomEngagement(280),
    fileSize: 2800000,
    tags: ["research", "AI", "healthcare", "academic", "technology"],
    category: "documents",
    isPublic: true,
    isFeatured: false,
    isExclusive: true,
    license: "Academic",
  },

  // Podcasts
  {
    id: "podcast1",
    title: "The Future of Technology",
    description: "Discussion about emerging technologies and their potential impact on society.",
    type: "audio",
    url: "/placeholder.svg?height=400&width=400&query=technology%20podcast",
    thumbnailUrl: "/placeholder.svg?height=400&width=400&query=technology%20podcast%20cover",
    creatorId: "user11",
    creatorName: "Tech Talk Podcast",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person11",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(5600),
    likes: randomEngagement(1300),
    comments: randomEngagement(110),
    shares: randomEngagement(420),
    duration: 2703, // 45:03 in seconds
    fileSize: 65000000,
    tags: ["podcast", "technology", "future", "discussion"],
    category: "podcasts",
    isPublic: true,
    isFeatured: true,
    isExclusive: false,
    license: "Standard",
  },
  {
    id: "podcast2",
    title: "Mindfulness and Productivity",
    description: "Exploring the connection between mindfulness practices and workplace productivity.",
    type: "audio",
    url: "/placeholder.svg?height=400&width=400&query=mindfulness%20podcast",
    thumbnailUrl: "/placeholder.svg?height=400&width=400&query=mindfulness%20podcast%20cover",
    creatorId: "user12",
    creatorName: "Mindful Moments",
    creatorAvatar: "/placeholder.svg?height=100&width=100&query=person12",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(4800),
    likes: randomEngagement(1100),
    comments: randomEngagement(90),
    shares: randomEngagement(350),
    duration: 3125, // 52:05 in seconds
    fileSize: 75000000,
    tags: ["podcast", "mindfulness", "productivity", "wellness"],
    category: "podcasts",
    isPublic: true,
    isFeatured: false,
    isExclusive: true,
    license: "Premium",
  },
]

// Generate more items to have a substantial collection
for (let i = 1; i <= 30; i++) {
  const categoryIndex = i % demoMediaCategories.length
  const category = demoMediaCategories[categoryIndex]

  let type: "image" | "video" | "audio" | "document"
  switch (category.id) {
    case "photography":
    case "design":
      type = "image"
      break
    case "videos":
      type = "video"
      break
    case "music":
    case "podcasts":
      type = "audio"
      break
    case "documents":
      type = "document"
      break
    default:
      type = "image"
  }

  demoMediaItems.push({
    id: `item${demoMediaItems.length + 1}`,
    title: `${category.name} Sample ${i}`,
    description: `This is a sample ${category.name.toLowerCase()} item for demonstration purposes.`,
    type,
    url: `/placeholder.svg?height=800&width=1200&query=${category.name.toLowerCase()}%20sample%20${i}`,
    thumbnailUrl:
      type !== "image"
        ? `/placeholder.svg?height=400&width=400&query=${category.name.toLowerCase()}%20thumbnail%20${i}`
        : undefined,
    creatorId: `user${(i % 12) + 1}`,
    creatorName: `Creator ${(i % 12) + 1}`,
    creatorAvatar: `/placeholder.svg?height=100&width=100&query=person${(i % 12) + 1}`,
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    views: randomEngagement(10000),
    likes: randomEngagement(2000),
    comments: randomEngagement(200),
    shares: randomEngagement(500),
    duration: type === "audio" || type === "video" ? 60 + randomEngagement(3600) : undefined, // 1 minute to 1 hour
    fileSize: 1000000 + randomEngagement(100000000),
    tags: [`tag${i}`, category.id, `sample${i}`, "demo"],
    category: category.id,
    isPublic: Math.random() > 0.1, // 90% are public
    isFeatured: Math.random() > 0.8, // 20% are featured
    isExclusive: Math.random() > 0.7, // 30% are exclusive
    license: Math.random() > 0.5 ? "Standard" : "Premium",
  })
}

// Demo collections
export const demoMediaCollections: MediaCollection[] = [
  {
    id: "collection1",
    name: "Nature Photography",
    description: "A collection of stunning nature photographs from around the world",
    creatorId: "user1",
    creatorName: "Alex Morgan",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    coverImage: "/placeholder.svg?height=600&width=800&query=nature%20collection",
    mediaItems: demoMediaItems
      .filter((item) => item.category === "photography" && item.tags.includes("nature"))
      .map((item) => item.id),
    isPublic: true,
  },
  {
    id: "collection2",
    name: "Meditation Sounds",
    description: "Calming audio tracks for meditation and relaxation",
    creatorId: "user5",
    creatorName: "Jordan Blake",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    coverImage: "/placeholder.svg?height=600&width=800&query=meditation%20collection",
    mediaItems: demoMediaItems
      .filter((item) => item.category === "music" && item.tags.includes("meditation"))
      .map((item) => item.id),
    isPublic: true,
  },
  {
    id: "collection3",
    name: "Design Inspiration",
    description: "A curated collection of inspiring design work",
    creatorId: "user7",
    creatorName: "Morgan Design",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    coverImage: "/placeholder.svg?height=600&width=800&query=design%20collection",
    mediaItems: demoMediaItems.filter((item) => item.category === "design").map((item) => item.id),
    isPublic: true,
  },
  {
    id: "collection4",
    name: "Tech Podcasts",
    description: "Informative podcasts about technology and innovation",
    creatorId: "user11",
    creatorName: "Tech Talk Podcast",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    coverImage: "/placeholder.svg?height=600&width=800&query=tech%20podcast%20collection",
    mediaItems: demoMediaItems
      .filter((item) => item.category === "podcasts" && item.tags.includes("technology"))
      .map((item) => item.id),
    isPublic: true,
  },
  {
    id: "collection5",
    name: "Urban Photography",
    description: "Photographs capturing urban life and architecture",
    creatorId: "user2",
    creatorName: "Jamie Lee",
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    coverImage: "/placeholder.svg?height=600&width=800&query=urban%20collection",
    mediaItems: demoMediaItems
      .filter((item) => item.category === "photography" && item.tags.includes("urban"))
      .map((item) => item.id),
    isPublic: true,
  },
]

// Generate a few more collections
for (let i = 1; i <= 5; i++) {
  const randomCategoryIndex = Math.floor(Math.random() * demoMediaCategories.length)
  const category = demoMediaCategories[randomCategoryIndex]

  demoMediaCollections.push({
    id: `collection${demoMediaCollections.length + 1}`,
    name: `${category.name} Collection ${i}`,
    description: `A collection of ${category.name.toLowerCase()} content`,
    creatorId: `user${(i % 12) + 1}`,
    creatorName: `Creator ${(i % 12) + 1}`,
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    coverImage: `/placeholder.svg?height=600&width=800&query=${category.name.toLowerCase()}%20collection%20${i}`,
    mediaItems: demoMediaItems
      .filter((item) => item.category === category.id)
      .slice(0, 5 + Math.floor(Math.random() * 10))
      .map((item) => item.id),
    isPublic: Math.random() > 0.2, // 80% are public
  })
}
