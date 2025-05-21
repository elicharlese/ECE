"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingCart, Bell, MessageSquare, Wallet, Users, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AppNav() {
  const pathname = usePathname() || ""
  const [mounted, setMounted] = useState(false)

  // Demo data for notification counts
  const [cartItems, setCartItems] = useState(3)
  const [unreadNotifications, setUnreadNotifications] = useState(5)
  const [unreadMessages, setUnreadMessages] = useState(2)
  const [walletBalance, setWalletBalance] = useState(1250)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Only show on app pages
  if (!pathname.startsWith("/app")) return null

  const navItems = [
    {
      href: "/app",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/app" || pathname === "/app/",
    },
    {
      href: "/app/marketplace",
      label: "Marketplace",
      icon: <ShoppingBag className="h-5 w-5" />,
      active: pathname.startsWith("/app/marketplace"),
    },
    {
      href: "/app/crowdfunding",
      label: "Projects",
      icon: <Users className="h-5 w-5" />,
      active: pathname.startsWith("/app/crowdfunding"),
    },
    {
      href: "/app/chat",
      label: "Chat",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: unreadMessages > 0 ? unreadMessages : null,
      active: pathname.startsWith("/app/chat"),
    },
    {
      href: "/app/notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: unreadNotifications > 0 ? unreadNotifications : null,
      active: pathname.startsWith("/app/notifications"),
    },
    {
      href: "/app/wallet-management",
      label: "Wallet",
      icon: <Wallet className="h-5 w-5" />,
      badge: walletBalance,
      badgeVariant: "outline",
      active: pathname.startsWith("/app/wallet-management"),
    },
    {
      href: "/app/cart",
      label: "Cart",
      icon: <ShoppingCart className="h-5 w-5" />,
      badge: cartItems > 0 ? cartItems : null,
      active: pathname.startsWith("/app/cart"),
    },
  ]

  return (
    <div className="bg-background border-b py-2 px-4 sticky top-16 z-40">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-hide">
          {/* Main navigation items */}
          {navItems
            .filter((item) => !["Chat", "Notifications", "Wallet", "Cart"].includes(item.label))
            .map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2 relative h-9"
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge !== null && (
                    <Badge
                      variant={item.badgeVariant || "destructive"}
                      className={`absolute -top-1 -right-1 ${item.label === "Wallet" ? "px-1.5 py-0.5 bg-primary text-primary-foreground" : ""}`}
                    >
                      {item.label === "Wallet" ? `${walletBalance}` : item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
        </div>

        {/* Utility buttons - chat, notifications, wallet, cart */}
        <div className="flex items-center space-x-1">
          {navItems
            .filter((item) => ["Chat", "Notifications", "Wallet", "Cart"].includes(item.label))
            .map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={item.active ? "default" : "ghost"} size="sm" className="relative w-9 h-9 p-0">
                  {item.icon}
                  {item.badge !== null && (
                    <Badge
                      variant={item.badgeVariant || (item.label === "Wallet" ? "outline" : "destructive")}
                      className="absolute -top-1 -right-1 text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0"
                    >
                      {item.label === "Wallet" ? `${walletBalance}` : item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
        </div>
      </nav>
    </div>
  )
}
