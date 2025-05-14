"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Check, ExternalLink, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type WalletCardProps = {
  wallet: {
    id: number
    wallet_address: string
    wallet_type: string
    created_at: string
    is_primary: boolean
  }
  onUnlink: () => void
  onSetPrimary: () => void
}

export function WalletCard({ wallet, onUnlink, onSetPrimary }: WalletCardProps) {
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false)

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "ethereum":
        return "🦊" // MetaMask
      case "solana":
        return "👻" // Phantom
      default:
        return "💼"
    }
  }

  const getWalletExplorerUrl = (type: string, address: string) => {
    switch (type) {
      case "ethereum":
        return `https://etherscan.io/address/${address}`
      case "solana":
        return `https://explorer.solana.com/address/${address}`
      default:
        return "#"
    }
  }

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getWalletName = (type: string) => {
    switch (type) {
      case "ethereum":
        return "Ethereum (MetaMask)"
      case "solana":
        return "Solana (Phantom/Solflare)"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getWalletIcon(wallet.wallet_type)}</div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {getWalletName(wallet.wallet_type)}
                  {wallet.is_primary && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                      <Shield className="h-3 w-3 mr-1" /> Primary
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  {formatWalletAddress(wallet.wallet_address)}
                  <a
                    href={getWalletExplorerUrl(wallet.wallet_type, wallet.wallet_address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Linked {formatDistanceToNow(new Date(wallet.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!wallet.is_primary && (
                <Button variant="outline" size="sm" onClick={onSetPrimary} className="text-xs">
                  <Check className="h-3 w-3 mr-1" /> Set as Primary
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUnlinkConfirm(true)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink wallet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink this wallet from your account? You will need to re-authenticate to link it
              again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onUnlink} className="bg-red-500 hover:bg-red-600">
              Unlink Wallet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
