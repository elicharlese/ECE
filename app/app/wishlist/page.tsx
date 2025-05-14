"use client"

import { useState } from "react"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const router = useRouter()
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date")

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    } else if (sortBy === "price") {
      return a.price - b.price
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      currency: item.currency,
      image: item.image,
      seller: item.seller,
    })
    removeItem(item.id)
  }

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        currency: item.currency,
        image: item.image,
        seller: item.seller,
      })
    })
    clearWishlist()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">My Wishlist</h2>
          <span className="text-muted-foreground">({items.length} items)</span>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded-md border bg-background text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date">Sort by Date Added</option>
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>
          {items.length > 0 && (
            <>
              <Button variant="outline" onClick={clearWishlist}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button onClick={handleMoveAllToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart
              </Button>
            </>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Items added to your wishlist will appear here. Start exploring to find products you love!
          </p>
          <Button onClick={() => router.push("/app/marketplace")}>Browse Marketplace</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-card border shadow-sm">
              <div className="h-48 bg-[#0e5f59]/10 dark:bg-[#14a89d]/10 flex items-center justify-center relative">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="font-medium">
                    {item.price} {item.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-muted-foreground">
                    Added {format(new Date(item.addedAt), "MMM d, yyyy")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.seller.verified ? "✓ Verified Seller" : ""}
                  </span>
                </div>
                <Button className="w-full" onClick={() => handleMoveToCart(item)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => router.push(`/app/marketplace/${item.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
