"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { signInWithWallet, generateNonce, createSignMessage } from "@/lib/wallet-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/ui/loading-button"
import { ethers } from "ethers"
import { Wallet, AlertCircle, CheckCircle2, LogOut } from "lucide-react"

export function EthereumWalletAuth() {
  const [isConnected, setIsConnected] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            const address = accounts[0]
            setAddress(address)
            const provider = new ethers.BrowserProvider(window.ethereum)
            setProvider(provider)
            setIsConnected(true)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  // Reset error when address changes
  useEffect(() => {
    setAuthStatus("idle")
    setErrorMessage(null)
  }, [address])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setIsConnected(false)
          setAddress(null)
          setProvider(null)
        } else {
          // User switched accounts
          setAddress(accounts[0])
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
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

  const disconnectWallet = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setProvider(null)
    setAuthStatus("idle")
    setErrorMessage(null)
  }, [])

  const handleSignIn = useCallback(async () => {
    if (!address || !provider) {
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
      const message = createSignMessage(address, nonce)

      // Get the signer
      const signer = await provider.getSigner()

      // Request signature from wallet
      const signature = await signer.signMessage(message)

      // Sign in with the wallet
      const { user, error } = await signInWithWallet("ethereum", address, signature)

      if (error) {
        throw error
      }

      setAuthStatus("success")

      toast({
        title: "Authentication successful",
        description: "You have been signed in with your Ethereum wallet.",
        variant: "default",
      })

      // Short delay to show success state before redirecting
      setTimeout(() => {
        router.push("/app")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error("Error signing in with Ethereum wallet:", error)
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
  }, [address, provider, toast, router])

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="flex flex-col space-y-3">
      {!isConnected ? (
        <div className="flex flex-col space-y-2">
          <Button
            onClick={connectWallet}
            className="w-full bg-orange-500 hover:bg-orange-600 wallet-button wallet-button-ethereum"
          >
            <Wallet className="h-5 w-5 mr-2" />
            <span>Connect MetaMask</span>
          </Button>
          <p className="wallet-info-text text-sm text-muted-foreground">
            Connect your Ethereum wallet to sign in securely without a password
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="wallet-status-indicator wallet-status-connected w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm font-medium">Connected to MetaMask</span>
            </div>
            <Button variant="ghost" size="sm" onClick={disconnectWallet} className="h-8 px-2 text-xs">
              <LogOut className="h-3 w-3 mr-1" />
              Disconnect
            </Button>
          </div>

          {address && (
            <div className="wallet-address-display bg-muted p-2 rounded text-sm font-mono text-center">
              {truncateAddress(address)}
            </div>
          )}

          <LoadingButton
            onClick={handleSignIn}
            isLoading={isAuthenticating}
            loadingText="Authenticating..."
            className="w-full bg-orange-500 hover:bg-orange-600 wallet-button"
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
              "Sign in with MetaMask"
            )}
          </LoadingButton>

          {errorMessage && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
        </div>
      )}
    </div>
  )
}
