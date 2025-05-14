"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LoadingButton } from "@/components/ui/loading-button"
import { ethers } from "ethers"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase-client"
import { generateNonce, createSignMessage } from "@/lib/wallet-auth"

type EthereumWalletLinkingProps = {
  onSuccess: () => void
}

export function EthereumWalletLinking({ onSuccess }: EthereumWalletLinkingProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this feature.",
        variant: "destructive",
      })
      return
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const address = accounts[0]
      setAddress(address)

      // Create ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
      setIsConnected(true)

      toast({
        title: "Wallet connected",
        description: "Your Ethereum wallet has been connected.",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error)
      toast({
        title: "Connection failed",
        description: error.message || "An error occurred while connecting to MetaMask.",
        variant: "destructive",
      })
    }
  }, [toast])

  const linkWallet = useCallback(async () => {
    if (!address || !provider || !user) {
      toast({
        title: "Cannot link wallet",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLinking(true)

      // Check if wallet is already linked to another account
      const { data: existingWallet, error: checkError } = await supabase
        .from("wallet_users")
        .select("user_id")
        .eq("wallet_address", address)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }

      if (existingWallet && existingWallet.user_id !== user.id) {
        throw new Error("This wallet is already linked to another account.")
      }

      // Generate a nonce and create a message for signing
      const nonce = generateNonce()
      const message = createSignMessage(address, nonce)

      // Get the signer
      const signer = await provider.getSigner()

      // Request signature from wallet
      const signature = await signer.signMessage(message)

      // Verify the signature matches the address
      const recoveredAddress = ethers.verifyMessage(message, signature)

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error("Signature verification failed")
      }

      // Check if this is the first wallet being linked
      const { data: walletCount, error: countError } = await supabase
        .from("wallet_users")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)

      if (countError) throw countError

      const isPrimary = walletCount === 0

      // Link the wallet to the user
      const { error: insertError } = await supabase.from("wallet_users").insert({
        wallet_address: address,
        wallet_type: "ethereum",
        user_id: user.id,
        is_primary: isPrimary,
      })

      if (insertError) throw insertError

      toast({
        title: "Wallet linked successfully",
        description: "Your Ethereum wallet has been linked to your account.",
        variant: "default",
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error linking wallet:", error)
      toast({
        title: "Error linking wallet",
        description: error.message || "An error occurred while linking your wallet.",
        variant: "destructive",
      })
    } finally {
      setIsLinking(false)
    }
  }, [address, provider, user, toast, onSuccess])

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Link your Ethereum wallet (MetaMask) to your account for easier access and transactions.
      </p>

      {!isConnected ? (
        <Button onClick={connectWallet} className="w-full bg-orange-500 hover:bg-orange-600">
          Connect MetaMask
        </Button>
      ) : (
        <>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground break-all">{address}</p>
          </div>

          <LoadingButton
            onClick={linkWallet}
            isLoading={isLinking}
            loadingText="Linking..."
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Link Wallet to Account
          </LoadingButton>
        </>
      )}
    </div>
  )
}
