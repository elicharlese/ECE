"use client"

import { useState, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useToast } from "@/hooks/use-toast"
import { LoadingButton } from "@/components/ui/loading-button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase-client"
import { generateNonce, createSignMessage } from "@/lib/wallet-auth"

type SolanaWalletLinkingProps = {
  onSuccess: () => void
}

export function SolanaWalletLinking({ onSuccess }: SolanaWalletLinkingProps) {
  const { publicKey, signMessage, connected, wallet } = useWallet()
  const [isLinking, setIsLinking] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const linkWallet = useCallback(async () => {
    if (!publicKey || !signMessage || !user) {
      toast({
        title: "Cannot link wallet",
        description: "Please connect your Solana wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLinking(true)
      const walletAddress = publicKey.toString()

      // Check if wallet is already linked to another account
      const { data: existingWallet, error: checkError } = await supabase
        .from("wallet_users")
        .select("user_id")
        .eq("wallet_address", walletAddress)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }

      if (existingWallet && existingWallet.user_id !== user.id) {
        throw new Error("This wallet is already linked to another account.")
      }

      // Generate a nonce and create a message for signing
      const nonce = generateNonce()
      const message = createSignMessage(walletAddress, nonce)

      // Convert message to Uint8Array for Solana
      const messageBytes = new TextEncoder().encode(message)

      // Request signature from wallet
      const signature = await signMessage(messageBytes)

      // Check if this is the first wallet being linked
      const { data: walletCount, error: countError } = await supabase
        .from("wallet_users")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)

      if (countError) throw countError

      const isPrimary = walletCount === 0

      // Link the wallet to the user
      const { error: insertError } = await supabase.from("wallet_users").insert({
        wallet_address: walletAddress,
        wallet_type: "solana",
        user_id: user.id,
        is_primary: isPrimary,
      })

      if (insertError) throw insertError

      toast({
        title: "Wallet linked successfully",
        description: "Your Solana wallet has been linked to your account.",
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
  }, [publicKey, signMessage, user, toast, onSuccess])

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Link your Solana wallet (Phantom or Solflare) to your account for easier access and transactions.
      </p>

      {!connected ? (
        <div className="flex justify-center">
          <WalletMultiButton className="wallet-adapter-button" />
        </div>
      ) : (
        <>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground break-all">{publicKey?.toString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Type: {wallet?.adapter.name}</p>
          </div>

          <LoadingButton
            onClick={linkWallet}
            isLoading={isLinking}
            loadingText="Linking..."
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Link Wallet to Account
          </LoadingButton>
        </>
      )}
    </div>
  )
}
