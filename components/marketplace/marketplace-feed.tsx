"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import {
  Heart,
  MessageSquare,
  TrendingUp,
  Clock,
  Zap,
  Tag,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  Eye,
  RefreshCw,
  ArrowRight,
  Bell,
  BellOff,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

type FeedItem = {
  id: string
  type: "listing" | "bid" | "sale" | "announcement" | "trending"
  title: string
  description: string
  timestamp: Date
  user: {
    id: string
    name: string
    avatar: string
    verified?: boolean
  }
  product?: {
    id: string
    name: string
    image: string
    price: number
    tags?: string[]
  }
  bid?: {
    amount: number
    status: "active" | "outbid" | "won" | "lost" | "expired"
  }
  isNew?: boolean
}

export function MarketplaceFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const feedRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchFeedItems = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockFeedItems: FeedItem[] = [
          {
            id: "1",
            type: "listing",
            title: "New Blockchain Security Scanner",
            description:
              "Just listed a new security scanner for smart contracts with automated vulnerability detection.",
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            user: {
              id: "user1",
              name: "Alex Johnson",
              avatar: "/placeholder.svg?key=b00o0",
              verified: true,
            },
            product: {
              id: "prod1",
              name: "Blockchain Security Scanner",
              image: "/images/products/security-scanner.png",
              price: 12999,
              tags: ["Security", "Smart Contracts", "Auditing"],
            },
            isNew: true,
          },
          {
            id: "2",
            type: "bid",
            title: "Bid placed on DeFi Protocol",
            description:
              "Placed a competitive bid on the latest DeFi protocol that automatically finds and allocates assets.",
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
            user: {
              id: "user2",
              name: "Samantha Lee",
              avatar: "/placeholder.svg?key=m2co7",
            },
            product: {
              id: "prod2",
              name: "DeFi Yield Aggregator",
              image: "/images/products/defi-protocol.png",
              price: 18999,
              tags: ["DeFi", "Yield Farming", "Aggregator"],
            },
            bid: {
              amount: 17500,
              status: "active",
            },
            isNew: true,
          },
          {
            id: "3",
            type: "sale",
            title: "NFT Gaming Platform Sold",
            description:
              "Successfully sold the NFT Gaming Platform for creating and monetizing blockchain games with NFT assets.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            user: {
              id: "user3",
              name: "Michael Chen",
              avatar: "/placeholder.svg?key=7rkmv",
              verified: true,
            },
            product: {
              id: "prod3",
              name: "NFT Gaming Platform",
              image: "/images/products/nft-gaming.png",
              price: 24999,
              tags: ["NFT", "Gaming", "Marketplace"],
            },
          },
          {
            id: "4",
            type: "announcement",
            title: "New Bidding Feature",
            description:
              "We've just launched our new bidding platform! Place bids on your favorite blockchain products and get notified when you're outbid.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            user: {
              id: "admin",
              name: "ECE Team",
              avatar: "/logo-light.png",
              verified: true,
            },
          },
          {
            id: "5",
            type: "trending",
            title: "Zero Knowledge Proofs Trending",
            description:
              "Zero Knowledge applications are seeing increased demand this week. Check out our latest offerings in this category.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
            user: {
              id: "system",
              name: "Trend Analysis",
              avatar: "/placeholder.svg?key=o918i",
            },
            product: {
              id: "prod4",
              name: "Zero Knowledge Proofs",
              image: "/images/products/zero-knowledge-proofs.png",
              price: 19999,
              tags: ["Privacy", "Zero Knowledge", "Cryptography"],
            },
          },
          {
            id: "6",
            type: "bid",
            title: "Outbid on Cross-Chain Bridge",
            description:
              "Your bid has been outbid by another user on the secure bridge application for transferring assets between different blockchain networks.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
            user: {
              id: "user4",
              name: "Jordan Taylor",
              avatar: "/placeholder.svg?key=cxj45",
            },
            product: {
              id: "prod5",
              name: "Cross-Chain Bridge",
              image: "/images/products/blockchain-bridge.png",
              price: 15999,
              tags: ["Cross-Chain", "Interoperability", "Asset Transfer"],
            },
            bid: {
              amount: 14500,
              status: "outbid",
            },
          },
          {
            id: "7",
            type: "bid",
            title: "Won Auction for Analytics Dashboard",
            description:
              "Congratulations! You won the auction for the Analytics Dashboard that provides real-time insights into blockchain metrics.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            user: {
              id: "user5",
              name: "Taylor Wilson",
              avatar: "/placeholder.svg?key=mv3g9",
            },
            product: {
              id: "prod6",
              name: "Analytics Dashboard",
              image: "/images/products/analytics-dashboard.png",
              price: 9999,
              tags: ["Analytics", "Dashboard", "Metrics"],
            },
            bid: {
              amount: 10500,
              status: "won",
            },
          },
        ]

        setFeedItems(mockFeedItems)
      } catch (error) {
        console.error("Error fetching feed items:", error)
        toast({
          title: "Error",
          description: "Failed to load marketplace feed",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedItems()
  }, [toast])

  const refreshFeed = async () => {
    setIsRefreshing(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Just reuse the same items but with updated timestamps
      const updatedItems = feedItems.map((item) => ({
        ...item,
        timestamp: new Date(),
        isNew: Math.random() > 0.7, // 30% chance of being marked as new
      }))

      setFeedItems(updatedItems)
      toast({
        title: "Feed refreshed",
        description: "Latest marketplace activity loaded",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh feed",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    toast({
      title: notificationsEnabled ? "Notifications disabled" : "Notifications enabled",
      description: notificationsEnabled
        ? "You will no longer receive marketplace activity notifications"
        : "You will now receive marketplace activity notifications",
    })
  }

  const filteredItems = feedItems.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "listings" && item.type === "listing") return true
    if (activeTab === "bids" && item.type === "bid") return true
    if (activeTab === "sales" && item.type === "sale") return true
    if (activeTab === "announcements" && (item.type === "announcement" || item.type === "trending")) return true
    return false
  })

  const getItemIcon = (type: string) => {
    switch (type) {
      case "listing":
        return <Tag className="h-4 w-4 text-blue-500" />
      case "bid":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "sale":
        return <Zap className="h-4 w-4 text-green-500" />
      case "announcement":
        return <AlertCircle className="h-4 w-4 text-purple-500" />
      case "trending":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Active
          </Badge>
        )
      case "outbid":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Outbid
          </Badge>
        )
      case "won":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Won
          </Badge>
        )
      case "lost":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Lost
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Expired
          </Badge>
        )
      default:
        return null
    }
  }

  const scrollToNextItem = () => {
    if (currentItemIndex < filteredItems.length - 1) {
      setIsScrolling(true)
      setCurrentItemIndex(currentItemIndex + 1)
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  const scrollToPreviousItem = () => {
    if (currentItemIndex > 0) {
      setIsScrolling(true)
      setCurrentItemIndex(currentItemIndex - 1)
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  // Reset current item index when tab changes or items are filtered
  useEffect(() => {
    setCurrentItemIndex(0)
  }, [activeTab, feedItems.length])

  return (
    <Card className="w-full shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="pb-0 pt-4 sm:pt-6 px-4 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl sm:text-2xl font-bold">Marketplace Activity</CardTitle>
            {feedItems.some((item) => item.isNew) && (
              <Badge className="bg-primary text-primary-foreground animate-pulse">New</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="h-8 w-8 rounded-full"
              title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshFeed}
              disabled={isRefreshing}
              className="gap-1 h-8 px-2 sm:px-3"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          Stay updated with the latest marketplace listings, bids, and sales
        </CardDescription>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-5 w-full mb-2 p-1 h-auto">
            <TabsTrigger value="all" className="py-1.5 sm:py-2">
              <span className="flex items-center gap-1 sm:gap-2">
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">All</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="listings" className="py-1.5 sm:py-2">
              <span className="flex items-center gap-1 sm:gap-2">
                <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Listings</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="bids" className="py-1.5 sm:py-2">
              <span className="flex items-center gap-1 sm:gap-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Bids</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="py-1.5 sm:py-2">
              <span className="flex items-center gap-1 sm:gap-2">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sales</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="py-1.5 sm:py-2">
              <span className="flex items-center gap-1 sm:gap-2">
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">News</span>
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
          {/* Navigation Controls */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 z-10 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToPreviousItem}
              disabled={currentItemIndex === 0 || isLoading}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full shadow-sm"
              aria-label="Previous item"
            >
              <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            {!isLoading && filteredItems.length > 0 && (
              <span className="text-xs bg-muted px-2.5 sm:px-3 py-1.5 rounded-full shadow-sm font-medium">
                {currentItemIndex + 1} / {filteredItems.length}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToNextItem}
              disabled={currentItemIndex === filteredItems.length - 1 || isLoading}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full shadow-sm"
              aria-label="Next item"
            >
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Feed Items */}
          <div ref={feedRef} className="h-full overflow-hidden" aria-live="polite">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6 w-full max-w-md">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1.5 sm:space-y-2 flex-1">
                      <div className="h-4 sm:h-5 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-full" />
                      <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                  <div className="h-48 sm:h-64 bg-muted rounded-lg animate-pulse w-full" />
                  <div className="flex justify-between">
                    <div className="h-7 sm:h-8 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-7 sm:h-8 bg-muted rounded animate-pulse w-1/3" />
                  </div>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div
                className="flex flex-col transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateY(-${currentItemIndex * 100}%)` }}
              >
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex flex-col p-4 sm:p-6 h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] shrink-0",
                      index === currentItemIndex ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden={index !== currentItemIndex}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border shadow-sm">
                        <img src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                        {item.user.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 border-2 border-background">
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </Avatar>
                      <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-y-1">
                          <div className="font-medium flex items-center gap-1.5 sm:gap-2">
                            <span className="truncate">{item.user.name}</span>
                            <div className="flex items-center gap-1.5">
                              {getItemIcon(item.type)}
                              {item.bid && getBidStatusBadge(item.bid.status)}
                              {item.isNew && (
                                <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5">New</Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-medium">{item.title}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>

                    {item.product && (
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1 rounded-xl bg-muted overflow-hidden mb-4 sm:mb-6 shadow-md border border-muted relative group">
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                            <div className="text-white">
                              <h3 className="font-bold text-lg">{item.product.name}</h3>
                              <p className="text-sm opacity-90">
                                ${item.bid ? item.bid.amount.toLocaleString() : item.product.price.toLocaleString()}
                              </p>
                            </div>
                            <Button size="sm" variant="secondary" className="opacity-90" asChild>
                              <Link href={`/app/marketplace/${item.product.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-5">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <Link
                              href={`/app/marketplace/${item.product.id}`}
                              className="text-lg sm:text-xl font-bold hover:text-primary transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <div className="text-lg sm:text-xl font-bold">
                              {item.bid ? (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-amber-500" />
                                  <span>${item.bid.amount.toLocaleString()}</span>
                                </span>
                              ) : (
                                <span>${item.product.price.toLocaleString()}</span>
                              )}
                            </div>
                          </div>

                          {/* Tags */}
                          {item.product.tags && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {item.product.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9">
                              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>Save</span>
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9">
                              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>Share</span>
                            </Button>
                            {!isMobile && (
                              <Button size="sm" variant="outline" className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9">
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>Quick View</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              asChild
                              className={cn(
                                "gap-1.5 text-xs sm:text-sm h-8 sm:h-9",
                                isMobile ? "mt-2 w-full" : "ml-auto",
                              )}
                            >
                              <Link href={`/app/marketplace/${item.product.id}`}>
                                <span>View Details</span>
                                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {!item.product && (
                      <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl border border-muted">
                        <div className="text-center p-4 sm:p-8 max-w-md">
                          <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-primary/70" />
                          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{item.description}</p>
                          <Button size="sm" className="sm:text-sm">
                            Learn More
                            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <CardFooter className="px-0 pt-4 mt-4 border-t flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Posted by</span>
                        <span className="font-medium text-foreground">{item.user.name}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4 sm:p-6">
                <div className="text-center py-6 sm:py-8 max-w-md">
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">No activity found</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                    There are no items matching your current filter. Try selecting a different category or check back
                    later.
                  </p>
                  <Button onClick={() => setActiveTab("all")}>View All Activity</Button>
                </div>
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          {!isLoading && filteredItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-background/80 backdrop-blur-sm rounded-full shadow-sm">
              {filteredItems.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "rounded-full transition-all",
                    index === currentItemIndex
                      ? "bg-primary w-4 sm:w-6 h-1.5 sm:h-2"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5 sm:w-2 h-1.5 sm:h-2",
                  )}
                  onClick={() => {
                    setIsScrolling(true)
                    setCurrentItemIndex(index)
                    setTimeout(() => setIsScrolling(false), 500)
                  }}
                  aria-label={`Go to item ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
