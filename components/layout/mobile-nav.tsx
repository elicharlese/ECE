"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface MobileNavProps {
  appNavItems: { href: string; label: string; icon: React.ReactNode }[]
  marketingNavItems: { href: string; label: string; icon?: React.ReactNode }[]
}

export function MobileNav({ appNavItems, marketingNavItems }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const { isDemoMode } = useDemo()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isAppPage = pathname?.startsWith("/app")
  const isMarketingPage = !isAppPage && !pathname?.includes("/login") && !pathname?.includes("/signup")
  const showAuthLinks = isMarketingPage && !user && !isDemoMode
  const showAppLinks = user || isDemoMode

  const handleLinkClick = () => {
    setOpen(false)
  }

  if (!mounted) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative overflow-hidden group">
          <Menu className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110" />
          <span className="sr-only">Toggle menu</span>
          <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[85%] sm:w-[350px] border-r border-border bg-background/95 backdrop-blur-sm p-0"
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center justify-between">
            <Link href="/" onClick={handleLinkClick} className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                ECE
              </span>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto py-4">
            <div className="px-2 space-y-4">
              {isMarketingPage && (
                <div className="space-y-1">
                  <h3 className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Navigation
                  </h3>
                  {marketingNavItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      active={pathname?.includes(item.href)}
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}

              {showAuthLinks && (
                <div className="space-y-1">
                  <h3 className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Account
                  </h3>
                  <NavLink href="/login" active={pathname?.includes("/login")} onClick={handleLinkClick}>
                    Log In
                  </NavLink>
                  <NavLink href="/signup" active={pathname?.includes("/signup")} onClick={handleLinkClick}>
                    Sign Up
                  </NavLink>
                </div>
              )}

              {showAppLinks && (
                <div className="space-y-1">
                  <h3 className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">App</h3>
                  {appNavItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      active={
                        pathname === item.href ||
                        (item.href.includes("?mode=") && pathname?.includes(item.href.split("?")[0]))
                      }
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-4">
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              {isDemoMode ? (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">Demo Mode Active</span>
              ) : user ? (
                <span>Logged in as {user.email}</span>
              ) : (
                <span>Not logged in</span>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
}

function NavLink({ href, children, active, onClick, icon }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-4 py-3 text-sm rounded-md transition-all duration-200 group",
        active ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:text-foreground hover:bg-muted",
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{children}</span>
      </div>
      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4 text-primary" />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} className="h-4 w-4" />
        )}
      </AnimatePresence>
    </Link>
  )
}
