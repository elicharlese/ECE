"use client"

import { useState, useEffect } from "react"
import { Wallet } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { cn } from "@/lib/utils"

export function WalletBalance() {
  const { balance, currency } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm transition-all duration-200",
        "border border-border/50 hover:border-border bg-background/80 hover:bg-background",
        "cursor-pointer select-none",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Wallet
        className={cn("h-4 w-4 transition-colors duration-200", isHovered ? "text-primary" : "text-muted-foreground")}
      />
      <span className="font-medium">
        {currency}
        {balance.toFixed(2)}
      </span>
    </div>
  )
}
