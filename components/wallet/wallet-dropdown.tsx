"use client"

import { useState, useEffect } from "react"
import { WalletIcon, Plus, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function WalletDropdown() {
  const [balance, setBalance] = useState(1234)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // This would normally come from an API or context
    const storedBalance = localStorage.getItem("walletBalance")
    if (storedBalance) {
      setBalance(Number.parseInt(storedBalance, 10))
    }
  }, [])

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <WalletIcon className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
            {balance > 9999 ? "9k+" : balance}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Your Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4">
          <div className="text-sm text-muted-foreground">Balance</div>
          <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/app/wallet-management">
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Funds</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/app/wallet-management">
            <DropdownMenuItem>
              <ArrowDown className="mr-2 h-4 w-4" />
              <span>Withdraw</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/app/wallet-management">
          <DropdownMenuItem>Manage Wallet</DropdownMenuItem>
        </Link>
        <Link href="/app/payments">
          <DropdownMenuItem>Transaction History</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
