"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface WalletDropdownProps {
  showLabel?: boolean
}

export function WalletDropdown({ showLabel = false }: WalletDropdownProps) {
  const [balance, setBalance] = useState("1,234.56")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {showLabel && <span className="hidden sm:inline">Wallet</span>}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Your Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="text-sm font-medium">Balance</div>
          <div className="text-2xl font-bold">${balance}</div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/app/wallet-management">
          <DropdownMenuItem>Manage Wallet</DropdownMenuItem>
        </Link>
        <Link href="/app/profile/wallet">
          <DropdownMenuItem>Wallet Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/app/payments">
          <DropdownMenuItem>Payment History</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
