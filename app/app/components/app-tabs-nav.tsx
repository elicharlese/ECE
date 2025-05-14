"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppTabsNav() {
  const pathname = usePathname() || "/"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Only show on app pages
  if (!pathname.startsWith("/app")) return null

  const tabs = [
    { name: "Dashboard", href: "/app" },
    { name: "Marketplace", href: "/app/marketplace" },
    { name: "Projects", href: "/app/project-dashboard" },
    { name: "Chat", href: "/app/chat" },
  ]

  return (
    <div className="border-b">
      <div className="container flex overflow-x-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/app" ? pathname === "/app" || pathname === "/app/" : pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                isActive ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
