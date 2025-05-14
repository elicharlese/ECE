"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { SolanaWalletLinking } from "./solana-wallet-linking"
import { EthereumWalletLinking } from "./ethereum-wallet-linking"

type LinkedWallet = {
  id: number
  wallet_address: string
  wallet_type: string
  created_at: string
  is_primary: boolean
}

type LinkWalletDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWalletLinked: () => void
  existingWallets: LinkedWallet[]
}

export function LinkWalletDialog({ open, onOpenChange, onWalletLinked, existingWallets }: LinkWalletDialogProps) {
  const [activeTab, setActiveTab] = useState("ethereum")

  const hasEthereumWallet = existingWallets.some((wallet) => wallet.wallet_type === "ethereum")
  const hasSolanaWallet = existingWallets.some((wallet) => wallet.wallet_type === "solana")

  const handleSuccess = () => {
    onWalletLinked()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link a New Wallet</DialogTitle>
          <DialogDescription>
            Connect a blockchain wallet to your account for easier access and transactions.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ethereum" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
          </TabsList>

          <TabsContent value="ethereum">
            {hasEthereumWallet ? (
              <Alert variant="default" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You already have an Ethereum wallet linked to your account. You can link a different type of wallet.
                </AlertDescription>
              </Alert>
            ) : (
              <EthereumWalletLinking onSuccess={handleSuccess} />
            )}
          </TabsContent>

          <TabsContent value="solana">
            {hasSolanaWallet ? (
              <Alert variant="default" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You already have a Solana wallet linked to your account. You can link a different type of wallet.
                </AlertDescription>
              </Alert>
            ) : (
              <SolanaWalletLinking onSuccess={handleSuccess} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
