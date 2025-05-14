"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow, format } from "date-fns"
import { Gavel, Clock, Award, AlertCircle, CheckCircle, XCircle, Timer } from "lucide-react"

type Bid = {
  id: string
  userId: string
  userName: string
  userAvatar: string
  amount: number
  timestamp: Date
  status: "active" | "outbid" | "won" | "lost" | "expired"
}

type AuctionStatus = "active" | "ended" | "upcoming"

interface BiddingPlatformProps {
  productId: string
  productName: string
  startingPrice: number
  currentPrice?: number
  auctionEnd?: Date
  auctionStart?: Date
  minBidIncrement?: number
  status?: AuctionStatus
}

export function BiddingPlatform({
  productId,
  productName,
  startingPrice,
  currentPrice = startingPrice,
  auctionEnd = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
  auctionStart = new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  minBidIncrement = 500,
  status = "active",
}: BiddingPlatformProps) {
  const [bidAmount, setBidAmount] = useState<number>(currentPrice + minBidIncrement)
  const [bids, setBids] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Calculate time left
  useEffect(() => {
    if (status !== "active") return

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = auctionEnd.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft("Auction ended")
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [auctionEnd, status])

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockBids: Bid[] = [
          {
            id: "bid1",
            userId: "user1",
            userName: "Alex Johnson",
            userAvatar: "/placeholder.svg?key=d6jix",
            amount: currentPrice,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: "active",
          },
          {
            id: "bid2",
            userId: "user2",
            userName: "Samantha Lee",
            userAvatar: "/placeholder.svg?key=0jtrp",
            amount: currentPrice - minBidIncrement,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            status: "outbid",
          },
          {
            id: "bid3",
            userId: "user3",
            userName: "Michael Chen",
            userAvatar: "/placeholder.svg?key=q9g6d",
            amount: currentPrice - minBidIncrement * 2,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            status: "outbid",
          },
        ]

        setBids(mockBids)
      } catch (error) {
        console.error("Error fetching bids:", error)
        toast({
          title: "Error",
          description: "Failed to load bid history",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBids()
  }, [currentPrice, minBidIncrement, toast])

  const handleBidSubmit = () => {
    if (bidAmount <= currentPrice) {
      toast({
        title: "Invalid bid",
        description: `Your bid must be at least $${(currentPrice + minBidIncrement).toLocaleString()}`,
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    const newBid: Bid = {
      id: `bid${bids.length + 1}`,
      userId: "currentUser",
      userName: "You",
      userAvatar: "/placeholder.svg?key=y4o5f",
      amount: bidAmount,
      timestamp: new Date(),
      status: "active",
    }

    // Update previous highest bid to outbid
    const updatedBids = bids.map((bid) => (bid.status === "active" ? { ...bid, status: "outbid" } : bid))

    setBids([newBid, ...updatedBids])
    toast({
      title: "Bid placed successfully",
      description: `You've placed a bid of $${bidAmount.toLocaleString()} on ${productName}`,
    })

    setIsDialogOpen(false)
  }

  const getStatusBadge = (status: AuctionStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "ended":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Ended
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Upcoming
          </Badge>
        )
      default:
        return null
    }
  }

  const getBidStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "outbid":
        return <XCircle className="h-4 w-4 text-amber-500" />
      case "won":
        return <Award className="h-4 w-4 text-green-500" />
      case "lost":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "expired":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Auction Details
              {getStatusBadge(status)}
            </CardTitle>
            <CardDescription>
              {status === "active" && "Place your bid before the auction ends"}
              {status === "ended" && "This auction has ended"}
              {status === "upcoming" && "This auction hasn't started yet"}
            </CardDescription>
          </div>
          {status === "active" && (
            <div className="text-right">
              <div className="text-sm font-medium">Time Remaining</div>
              <div className="text-2xl font-bold text-primary flex items-center gap-1">
                <Timer className="h-5 w-5" />
                {timeLeft}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Starting Price</div>
              <div className="text-lg font-semibold">${startingPrice.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Bid</div>
              <div className="text-lg font-semibold text-primary">${currentPrice.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Auction Started</div>
              <div className="text-sm">{format(auctionStart, "MMM d, yyyy h:mm a")}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Auction Ends</div>
              <div className="text-sm">{format(auctionEnd, "MMM d, yyyy h:mm a")}</div>
            </div>
          </div>

          <Tabs defaultValue="history">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="history">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Bid History
                </span>
              </TabsTrigger>
              <TabsTrigger value="details">
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Auction Details
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[200px] p-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                              <div className="space-y-1">
                                <div className="h-3 bg-muted rounded animate-pulse w-24" />
                                <div className="h-3 bg-muted rounded animate-pulse w-16" />
                              </div>
                            </div>
                            <div className="h-4 bg-muted rounded animate-pulse w-20" />
                          </div>
                        ))}
                      </div>
                    ) : bids.length > 0 ? (
                      <div className="space-y-2">
                        {bids.map((bid) => (
                          <div
                            key={bid.id}
                            className={`flex items-center justify-between p-2 rounded-md ${
                              bid.status === "active" ? "bg-green-50 dark:bg-green-900/20" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <img src={bid.userAvatar || "/placeholder.svg"} alt={bid.userName} />
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium flex items-center gap-1">
                                  {bid.userName}
                                  {getBidStatusIcon(bid.status)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                            <div className="font-medium">${bid.amount.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No bids yet. Be the first to bid!</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Auction Rules</h4>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      <li>Minimum bid increment: ${minBidIncrement.toLocaleString()}</li>
                      <li>All bids are final and cannot be retracted</li>
                      <li>The highest bidder at the end of the auction wins</li>
                      <li>Payment must be completed within 24 hours of auction end</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Shipping & Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Digital delivery will be made immediately after payment is confirmed. Access credentials will be
                      sent to your registered email address.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {bids.length} {bids.length === 1 ? "bid" : "bids"} so far
        </div>
        {status === "active" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Gavel className="mr-2 h-4 w-4" />
                Place Bid
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Place a Bid</DialogTitle>
                <DialogDescription>
                  You're bidding on {productName}. The current highest bid is ${currentPrice.toLocaleString()}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <div className="font-medium">Your Bid Amount (USD)</div>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={currentPrice + minBidIncrement}
                    step={minBidIncrement}
                    className="text-lg"
                  />
                  <div className="text-sm text-muted-foreground">
                    Minimum bid: ${(currentPrice + minBidIncrement).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Bid Summary</div>
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span>Your bid:</span>
                      <span className="font-medium">${bidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current highest bid:</span>
                      <span>${currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your bid is higher by:</span>
                      <span className={bidAmount > currentPrice ? "text-green-600" : "text-red-600"}>
                        ${(bidAmount - currentPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBidSubmit} disabled={bidAmount <= currentPrice}>
                  Confirm Bid
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {status === "ended" && <Button disabled>Auction Ended</Button>}
        {status === "upcoming" && <Button disabled>Coming Soon</Button>}
      </CardFooter>
    </Card>
  )
}
