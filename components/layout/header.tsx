"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/mobile-nav"
import { UserDropdown } from "@/components/user-dropdown"
import { ModeToggle } from "@/components/mode-toggle"
import { CartDropdown } from "@/components/cart/cart-dropdown"
import { NotificationBadge } from "@/components/notification-badge"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletDropdown } from "@/components/wallet/wallet-dropdown"
import { ErrorBoundary } from "@/components/error-boundary"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname() || ""
  const { user } = useAuth()
  const { isDemoMode, disableDemoMode } = useDemo()
  const [mounted, setMounted] = useState(false)
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0)
  const [persistentUnreadMessages, setPersistentUnreadMessages] = useState(0)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // Load persistent unread message count
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedMessageState = localStorage.getItem("messageState")
        if (storedMessageState) {
          const parsedState = JSON.parse(storedMessageState)
          if (parsedState && parsedState.unreadCount !== undefined) {
            setPersistentUnreadMessages(parsedState.unreadCount)
          }
        }
      } catch (e) {
        console.error("Error parsing message state from localStorage:", e)
      }
    }
    setMounted(true)
  }, [])

  // We'll update this value from the chat page when needed
  useEffect(() => {
    if (typeof window === "undefined") return

    // Listen for custom events from the chat page
    const handleUnreadUpdate = (e: CustomEvent) => {
      if (e && e.detail && e.detail.count !== undefined) {
        setTotalUnreadMessages(e.detail.count)

        // Store in localStorage for persistence
        try {
          localStorage.setItem(
            "messageState",
            JSON.stringify({
              unreadCount: e.detail.count,
              lastUpdated: new Date().toISOString(),
            }),
          )
          setPersistentUnreadMessages(e.detail.count)
        } catch (err) {
          console.error("Error storing message state:", err)
        }
      }
    }

    // Add event listener for custom event
    window.addEventListener("chat-unread-update" as any, handleUnreadUpdate as any)

    return () => {
      window.removeEventListener("chat-unread-update" as any, handleUnreadUpdate as any)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isAppPage = pathname?.startsWith("/app")
  const isMarketingPage = !isAppPage && !pathname?.includes("/login") && !pathname?.includes("/signup")

  // Update the showAuthButtons condition to be more explicit
  const showAuthButtons = isMarketingPage && !user && !isDemoMode

  // Add a useEffect to log authentication state for debugging
  useEffect(() => {
    console.log("Auth state:", { isMarketingPage, user: !!user, isDemoMode, showAuthButtons })
  }, [isMarketingPage, user, isDemoMode, showAuthButtons])

  // const showAuthButtons = isMarketingPage && !user && !isDemoMode && !showUserDropdown
  // Only show auth buttons on marketing pages when user is not signed in and not in demo mode
  // const showUserDropdown = user || isDemoMode

  // Use persistent unread count if the actual count is still loading
  const displayUnreadMessages = persistentUnreadMessages || totalUnreadMessages

  // App navigation items
  const appNavItems = [
    { href: "/app", label: "Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/app/marketplace", label: "Marketplace", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { href: "/app/crowdfunding", label: "Crowdfunding", icon: <Users className="h-4 w-4 mr-2" /> },
  ]

  // Marketing navigation items
  const marketingNavItems = [
    { href: "/features", label: "Features" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/crowdfunding", label: "Crowdfunding" },
  ]

  // Update the useEffect for authentication state
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for persistent auth state in localStorage
      const persistentAuth = localStorage.getItem("eceAuthState")

      if (persistentAuth) {
        try {
          const authState = JSON.parse(persistentAuth)
          // If we have a valid timestamp and it hasn't expired (24 hours)
          if (authState.timestamp && Date.now() - authState.timestamp < 24 * 60 * 60 * 1000) {
            // Use the persistent state until the actual auth state loads
            if (!user && !isDemoMode) {
              // Only use persistent state if we don't have a real user yet
              setShowUserDropdown(true)
            }
          }
        } catch (e) {
          console.error("Error parsing persistent auth state:", e)
        }
      }
    }

    // Update persistent state when auth changes
    if (typeof window !== "undefined" && (user || isDemoMode)) {
      localStorage.setItem(
        "eceAuthState",
        JSON.stringify({
          isAuthenticated: true,
          timestamp: Date.now(),
        }),
      )
      setShowUserDropdown(true)
    }
  }, [user, isDemoMode])

  if (!mounted)
    return (
      <header className="sticky top-0 z-50 w-full bg-background h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8"></div>
          <div className="w-20 h-8 bg-muted/30 animate-pulse rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted/30 animate-pulse"></div>
        </div>
      </header>
    )

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 flex h-16 items-center justify-between px-4 shrink-0",
        isScrolled ? "bg-background/95 backdrop-blur-md border-b shadow-sm" : "bg-background",
      )}
    >
      <div className="flex items-center gap-14">
        <div className="flex items-center gap-2">
          <MobileNav appNavItems={appNavItems} marketingNavItems={marketingNavItems} />
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* Desktop logo - dark version (for light mode) */}
              <Image src="/logo-dark.png" alt="Logo" width={75} height={28} className="hidden sm:block dark:hidden" />

              {/* Desktop logo - light version (for dark mode) */}
              <Image src="/logo-light.png" alt="Logo" width={75} height={28} className="hidden sm:dark:block" />

              {/* Mobile logo - dark version (for light mode) */}
              <Image src="/logo-dark.png" alt="Logo" width={55} height={21} className="block sm:hidden dark:hidden" />

              {/* Mobile logo - light version (for dark mode) */}
              <Image
                src="/logo-light.png"
                alt="Logo"
                width={55}
                height={21}
                className="hidden dark:block sm:dark:hidden"
              />
            </Link>
            {isDemoMode && isAppPage && (
              <span
                className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-800/50"
                onClick={disableDemoMode}
                title="Demo Mode Active - Click to exit"
              >
                demo
              </span>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {isMarketingPage &&
            marketingNavItems.map((item) => (
              <NavLink key={item.href} href={item.href} active={pathname?.includes(item.href)}>
                {item.label}
              </NavLink>
            ))}

          {isAppPage && (
            <Tabs
              value={
                pathname === "/app" || pathname === "/app/"
                  ? "dashboard"
                  : pathname?.includes("/app/marketplace")
                    ? "marketplace"
                    : pathname?.includes("/app/crowdfunding")
                      ? "crowdfunding"
                      : "dashboard"
              }
              className="w-auto"
            >
              <TabsList>
                <Link href="/app">
                  <TabsTrigger value="dashboard" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                </Link>
                <Link href="/app/marketplace">
                  <TabsTrigger value="marketplace" className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Marketplace
                  </TabsTrigger>
                </Link>
                <Link href="/app/crowdfunding">
                  <TabsTrigger value="crowdfunding" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Crowdfunding
                  </TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Auth buttons - only visible on marketing pages when user is not signed in */}
        {showAuthButtons && (
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-9">
                <span className="flex items-center">Log In</span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="h-9">
                <span className="flex items-center">Sign Up</span>
              </Button>
            </Link>
          </div>
        )}

        {/* User actions */}
        {(showUserDropdown || user || isDemoMode) && (
          <>
            <div className="flex items-center gap-2">
              {isAppPage && (
                <>
                  {/* Chat Button */}
                  <ErrorBoundary>
                    <Link href="/app/chat">
                      <Button variant="ghost" size="icon" className="relative hover:bg-muted/80 transition-colors">
                        <MessageSquare className="h-5 w-5" />
                        {displayUnreadMessages > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {displayUnreadMessages > 9 ? "9+" : displayUnreadMessages}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </ErrorBoundary>

                  {/* Notification Badge */}
                  <ErrorBoundary>
                    <NotificationBadge />
                  </ErrorBoundary>
                </>
              )}

              {/* Add wallet dropdown */}
              <ErrorBoundary>
                <WalletDropdown />
              </ErrorBoundary>

              <ErrorBoundary>
                <CartDropdown />
              </ErrorBoundary>
            </div>
            <ErrorBoundary>
              <UserDropdown />
            </ErrorBoundary>
          </>
        )}

        <div className="border-l h-6 mx-1 hidden sm:block" />
        <ModeToggle />
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  active: boolean
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted/50",
      )}
    >
      {children}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
    </Link>
  )
}
