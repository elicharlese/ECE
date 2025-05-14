"use client"

import { useState, useCallback, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { signInWithWallet, generateNonce, createSignMessage } from "@/lib/wallet-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/ui/loading-button"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function SolanaWalletAuth() {
  // Safely access wallet properties with error handling
  const wallet = useWallet()
  const { publicKey, signMessage, connected, disconnect } = wallet || {}

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Reset error when wallet changes
  useEffect(() => {
    setAuthStatus("idle")
    setErrorMessage(null)
  }, [publicKey])

  const handleSignIn = useCallback(async () => {
    if (!publicKey || !signMessage) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAuthenticating(true)
      setAuthStatus("idle")
      setErrorMessage(null)

      // Generate a nonce and create a message for signing
      const nonce = generateNonce()
      const message = createSignMessage(publicKey.toString(), nonce)

      // Convert message to Uint8Array for Solana
      const messageBytes = new TextEncoder().encode(message)

      // Request signature from wallet
      const signature = await signMessage(messageBytes)

      // Sign in with the wallet
      const { user, error } = await signInWithWallet("solana", publicKey.toString(), signature, publicKey)

      if (error) {
        throw error
      }

      setAuthStatus("success")

      toast({
        title: "Authentication successful",
        description: "You have been signed in with your Solana wallet.",
        variant: "default",
      })

      // Short delay to show success state before redirecting
      setTimeout(() => {
        router.push("/app")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error("Error signing in with Solana wallet:", error)
      setAuthStatus("error")
      setErrorMessage(error.message || "An error occurred during wallet authentication.")

      toast({
        title: "Authentication failed",
        description: error.message || "An error occurred during wallet authentication.",
        variant: "destructive",
      })
    } finally {
      setIsAuthenticating(false)
    }
  }, [publicKey, signMessage, toast, router])

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Get wallet name safely
  const walletName = wallet?.wallet?.adapter?.name || "Solana Wallet"

  return (
    <div className="flex flex-col space-y-3">
      {!connected ? (
        <div className="flex flex-col space-y-2">
          <WalletMultiButton className="wallet-adapter-button wallet-button wallet-button-solana" />
          <p className="wallet-info-text text-sm text-muted-foreground">
            Connect your Solana wallet to sign in securely without a password
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="wallet-status-indicator wallet-status-connected w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm font-medium">Connected to {walletName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => disconnect && disconnect()} className="h-8 px-2 text-xs">
              Disconnect
            </Button>
          </div>

          {publicKey && (
            <div className="wallet-address-display bg-muted p-2 rounded text-sm font-mono text-center">
              {truncateAddress(publicKey.toString())}
            </div>
          )}

          <LoadingButton
            onClick={handleSignIn}
            isLoading={isAuthenticating}
            loadingText="Authenticating..."
            className="w-full bg-purple-600 hover:bg-purple-700 wallet-button"
            disabled={isAuthenticating || authStatus === "success"}
          >
            {authStatus === "success" ? (
              <span className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Authenticated
              </span>
            ) : authStatus === "error" ? (
              <span className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                Try Again
              </span>
            ) : (
              `Sign in with ${walletName}`
            )}
          </LoadingButton>

          {errorMessage && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
        </div>
      )}
    </div>
  )
}
