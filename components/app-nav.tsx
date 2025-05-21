"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Home, ShoppingCart, Bell, MessageSquare, Wallet, Users, ShoppingBag } from "lucide-react"

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

  // Return null to remove the secondary navigation
  return null
}
