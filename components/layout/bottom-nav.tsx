"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, MessageSquare, Bell, Wallet } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname() || "/"
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Don't render anything on server or if not mobile
  if (!mounted || !isMobile) return null

  // Only show on app pages
  if (!pathname.startsWith("/app")) return null

  const navItems = [
    { href: "/app", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/app/marketplace", label: "Market", icon: <ShoppingBag className="h-5 w-5" /> },
    { href: "/app/chat", label: "Chat", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/app/notifications", label: "Alerts", icon: <Bell className="h-5 w-5" /> },
    { href: "/app/wallet-management", label: "Wallet", icon: <Wallet className="h-5 w-5" /> },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app" || pathname === "/app/"
              : pathname.startsWith(item.href) && item.href !== "/app"

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full px-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
