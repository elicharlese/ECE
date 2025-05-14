"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signInWithWallet, generateNonce, createSignMessage } from "@/lib/wallet-auth"
import { ethers } from "ethers"
import { CheckCircle2 } from "lucide-react"

// Import Solana wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

type WalletType = "metamask" | "phantom" | "solflare" | null

export function WalletAuthButtons() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType>(null)
  const [preferredWallet, setPreferredWallet] = useState<WalletType>(null)
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false)
  const [autoConnecting, setAutoConnecting] = useState(false)
  const [installedWallets, setInstalledWallets] = useState<{
    metamask: boolean
    phantom: boolean
    solflare: boolean
  }>({
    metamask: false,
    phantom: false,
    solflare: false,
  })
  const { toast } = useToast()
  const router = useRouter()

  const [connectedWallets, setConnectedWallets] = useState<{
    metamask: boolean
    phantom: boolean
    solflare: boolean
  }>({
    metamask: false,
    phantom: false,
    solflare: false,
  })

  // Set up Solana wallet adapters
  const network = WalletAdapterNetwork.Mainnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  // Create memoized callbacks for setting connected status
  const setPhantomConnected = useCallback((status: boolean) => {
    setConnectedWallets((prev) => ({ ...prev, phantom: status }))
  }, [])

  const setSolflareConnected = useCallback((status: boolean) => {
    setConnectedWallets((prev) => ({ ...prev, solflare: status }))
  }, [])

  // Load preferred wallet from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWallet = localStorage.getItem("preferredWallet") as WalletType
      if (savedWallet) {
        setPreferredWallet(savedWallet)
      }
    }
  }, [])

  // Detect installed wallets
  useEffect(() => {
    const detectWallets = async () => {
      // Check for MetaMask
      const hasMetaMask =
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined" &&
        (window.ethereum.isMetaMask ||
          (window.ethereum.providers && window.ethereum.providers.some((p: any) => p.isMetaMask)))

      // Check for Phantom
      const hasPhantom =
        typeof window !== "undefined" && typeof window.solana !== "undefined" && window.solana.isPhantom

      // Check for Solflare
      const hasSolflare = typeof window !== "undefined" && typeof window.solflare !== "undefined"

      setInstalledWallets({
        metamask: hasMetaMask,
        phantom: hasPhantom,
        solflare: hasSolflare,
      })
    }

    detectWallets()
  }, [])

  // Check if wallets are connected
  useEffect(() => {
    const checkWalletConnections = async () => {
      // Check MetaMask connection
      let metamaskConnected = false
      if (installedWallets.metamask && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })
          metamaskConnected = accounts && accounts.length > 0
        } catch (error) {
          console.error("Error checking MetaMask connection:", error)
        }
      }

      // For Solana wallets, we'll check in their respective components
      setConnectedWallets((prev) => ({
        ...prev,
        metamask: metamaskConnected,
      }))
    }

    if (typeof window !== "undefined") {
      checkWalletConnections()
    }
  }, [installedWallets])

  const handleMetaMaskLogin = useCallback(
    async (autoConnect = false) => {
      if (autoConnect) {
        setAutoConnecting(true)
      } else {
        setSelectedWallet("metamask")
        setIsAuthenticating(true)
      }

      if (typeof window === "undefined" || !window.ethereum) {
        toast({
          title: "MetaMask not installed",
          description: "Please install MetaMask to use this feature.",
          variant: "destructive",
        })
        setIsAuthenticating(false)
        setAutoConnecting(false)
        return
      }

      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const address = accounts[0]

        // Generate a nonce and create a message for signing
        const nonce = generateNonce()
        const message = createSignMessage(address, nonce)

        // Create ethers provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        // Request signature from wallet
        const signature = await signer.signMessage(message)

        // Sign in with the wallet
        const { user, error } = await signInWithWallet("ethereum", address, signature)

        if (error) {
          throw error
        }

        toast({
          title: "Authentication successful",
          description: "You have been signed in with your Ethereum wallet.",
          variant: "default",
        })

        router.push("/app")
        router.refresh()
      } catch (error: any) {
        console.error("Error signing in with Ethereum wallet:", error)
        if (!autoConnect) {
          // Only show error toast if not auto-connecting
          toast({
            title: "Authentication failed",
            description: error.message || "An error occurred during wallet authentication.",
            variant: "destructive",
          })
        }
      } finally {
        setIsAuthenticating(false)
        setSelectedWallet(null)
        setAutoConnecting(false)
      }
    },
    [router, toast],
  )

  const togglePreferredWallet = (wallet: WalletType) => {
    if (preferredWallet === wallet) {
      // Remove preferred wallet
      setPreferredWallet(null)
      localStorage.removeItem("preferredWallet")
      toast({
        title: "Preferred wallet removed",
        description: `${wallet.charAt(0).toUpperCase() + wallet.slice(1)} is no longer your preferred wallet.`,
        variant: "default",
      })
    } else {
      // Set as preferred wallet
      setPreferredWallet(wallet)
      localStorage.setItem("preferredWallet", wallet)
      toast({
        title: "Preferred wallet set",
        description: `${wallet.charAt(0).toUpperCase() + wallet.slice(1)} is now your preferred wallet.`,
        variant: "default",
      })
    }
  }

  // Auto-connect logic
  useEffect(() => {
    const attemptAutoConnect = async () => {
      if (autoConnectAttempted || isAuthenticating || autoConnecting) return

      setAutoConnectAttempted(true)

      // First try to connect to an already connected wallet
      if (connectedWallets.metamask) {
        await handleMetaMaskLogin(true)
        return
      } else if (connectedWallets.phantom || connectedWallets.solflare) {
        // Solana wallets are handled in their components
        return
      }

      // If no wallet is connected, try to connect to the preferred wallet
      if (preferredWallet && installedWallets[preferredWallet]) {
        if (preferredWallet === "metamask") {
          await handleMetaMaskLogin(true)
        }
        // For Solana wallets, we'll set a flag to auto-connect
        setSelectedWallet(preferredWallet)
      }
    }

    // Wait a bit to ensure all wallet states are properly detected
    const timer = setTimeout(() => {
      if (installedWallets.metamask || installedWallets.phantom || installedWallets.solflare) {
        attemptAutoConnect()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [
    autoConnectAttempted,
    connectedWallets,
    preferredWallet,
    installedWallets,
    isAuthenticating,
    autoConnecting,
    handleMetaMaskLogin,
  ])

  return (
    <div className="w-full space-y-4 wallet-section">
      <div className="flex justify-center gap-3 md:gap-4 lg:gap-5">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Button
              variant="outline"
              className={`flex flex-col items-center justify-center w-12 h-12 p-0 rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/20 border-2 ${
                connectedWallets.metamask
                  ? "border-blue-500 shadow-md shadow-blue-200 dark:shadow-blue-900/20 ring-2 ring-blue-500 ring-offset-2 ring-offset-background"
                  : preferredWallet === "metamask"
                    ? "border-yellow-500 shadow-md shadow-yellow-200 dark:shadow-yellow-900/20"
                    : installedWallets.metamask
                      ? "border-orange-500 shadow-md shadow-orange-200 dark:shadow-orange-900/20"
                      : "hover:border-orange-500"
              } transition-all`}
              onClick={() => handleMetaMaskLogin(false)}
              disabled={isAuthenticating || autoConnecting}
            >
              <div className="w-8 h-8 relative flex items-center justify-center">
                <img src="/images/wallets/metamask-logo.png" alt="MetaMask" className="w-6 h-6 object-contain" />
              </div>
              {(isAuthenticating && selectedWallet === "metamask") ||
              (autoConnecting && preferredWallet === "metamask") ? (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-full">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : null}
            </Button>
            {installedWallets.metamask && (
              <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-950 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center mt-2">
            <span className="text-xs font-medium">MetaMask</span>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {installedWallets.metamask && (
                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  Installed
                </span>
              )}
              {preferredWallet === "metamask" && (
                <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                  Preferred
                </span>
              )}
              {connectedWallets.metamask && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  Connected
                </span>
              )}
            </div>
          </div>
        </div>

        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={false}>
            <SolanaWalletButton
              adapter="phantom"
              isAuthenticating={isAuthenticating}
              selectedWallet={selectedWallet}
              setIsAuthenticating={setIsAuthenticating}
              setSelectedWallet={setSelectedWallet}
              isInstalled={installedWallets.phantom}
              isPreferred={preferredWallet === "phantom"}
              togglePreferred={() => togglePreferredWallet("phantom")}
              setConnectedStatus={setPhantomConnected}
              isConnected={connectedWallets.phantom}
              autoConnectAttempted={autoConnectAttempted}
              autoConnecting={autoConnecting}
              setAutoConnecting={setAutoConnecting}
            />
          </WalletProvider>
        </ConnectionProvider>

        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={false}>
            <SolanaWalletButton
              adapter="solflare"
              isAuthenticating={isAuthenticating}
              selectedWallet={selectedWallet}
              setIsAuthenticating={setIsAuthenticating}
              setSelectedWallet={setSelectedWallet}
              isInstalled={installedWallets.solflare}
              isPreferred={preferredWallet === "solflare"}
              togglePreferred={() => togglePreferredWallet("solflare")}
              setConnectedStatus={setSolflareConnected}
              isConnected={connectedWallets.solflare}
              autoConnectAttempted={autoConnectAttempted}
              autoConnecting={autoConnecting}
              setAutoConnecting={setAutoConnecting}
            />
          </WalletProvider>
        </ConnectionProvider>
      </div>

      {preferredWallet && (
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>Your preferred wallet will be highlighted and automatically connected when you return.</p>
        </div>
      )}
    </div>
  )
}

function SolanaWalletButton({
  adapter,
  isAuthenticating,
  selectedWallet,
  setIsAuthenticating,
  setSelectedWallet,
  isInstalled,
  isPreferred,
  togglePreferred,
  setConnectedStatus,
  isConnected,
  autoConnectAttempted,
  autoConnecting,
  setAutoConnecting,
}: {
  adapter: "phantom" | "solflare"
  isAuthenticating: boolean
  selectedWallet: WalletType
  setIsAuthenticating: (value: boolean) => void
  setSelectedWallet: (value: WalletType) => void
  isInstalled: boolean
  isPreferred: boolean
  togglePreferred: () => void
  setConnectedStatus: (status: boolean) => void
  isConnected: boolean
  autoConnectAttempted: boolean
  autoConnecting: boolean
  setAutoConnecting: (value: boolean) => void
}) {
  // Safely access wallet properties with error handling
  const walletContext = useWallet()
  const { select, wallet, publicKey, signMessage, connected, disconnect } = walletContext || {}

  const { toast } = useToast()
  const router = useRouter()

  // Track previous connection state to avoid infinite updates
  const [prevConnectionState, setPrevConnectionState] = useState({
    hasWallet: !!wallet,
    hasPublicKey: !!publicKey,
  })

  // Check if wallet is connected - fixed to avoid infinite updates
  useEffect(() => {
    const currentState = {
      hasWallet: !!wallet,
      hasPublicKey: !!publicKey,
    }

    // Only update if the connection state has actually changed
    if (
      currentState.hasWallet !== prevConnectionState.hasWallet ||
      currentState.hasPublicKey !== prevConnectionState.hasPublicKey
    ) {
      setPrevConnectionState(currentState)

      if (wallet && publicKey) {
        setConnectedStatus(true)
      } else {
        setConnectedStatus(false)
      }
    }
  }, [wallet, publicKey, setConnectedStatus])

  // Auto-connect logic for Solana wallets
  useEffect(() => {
    const attemptAutoConnect = async () => {
      if (!isInstalled || !autoConnectAttempted) return

      // Auto-connect if this wallet is connected or preferred
      if ((isConnected || isPreferred) && selectedWallet === adapter) {
        setAutoConnecting(true)
        await handleWalletLogin(true)
      }
    }

    attemptAutoConnect()
  }, [autoConnectAttempted, selectedWallet, isConnected, isPreferred, isInstalled])

  const handleWalletLogin = async (autoConnect = false) => {
    if (!autoConnect) {
      setSelectedWallet(adapter)
      setIsAuthenticating(true)
    }

    try {
      // Select the wallet adapter
      if (select) {
        select(adapter)
      } else {
        throw new Error("Wallet adapter not available")
      }

      // Wait for connection
      setTimeout(async () => {
        if (!publicKey || !signMessage) {
          if (autoConnect) {
            // Silently fail for auto-connect
            setAutoConnecting(false)
            return
          }
          throw new Error("Failed to connect wallet")
        }

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

        toast({
          title: "Authentication successful",
          description: `You have been signed in with your ${adapter === "phantom" ? "Phantom" : "Solflare"} wallet.`,
          variant: "default",
        })

        router.push("/app")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error(`Error signing in with ${adapter} wallet:`, error)
      if (!autoConnect) {
        // Only show error toast if not auto-connecting
        toast({
          title: "Authentication failed",
          description: error.message || "An error occurred during wallet authentication.",
          variant: "destructive",
        })
      }
      if (connected && disconnect) {
        disconnect()
      }
    } finally {
      setIsAuthenticating(false)
      setSelectedWallet(null)
      setAutoConnecting(false)
    }
  }

  const getButtonStyle = () => {
    if (isConnected) {
      return "border-blue-500 shadow-md shadow-blue-200 dark:shadow-blue-900/20"
    }
    if (isPreferred) {
      return "border-yellow-500 shadow-md shadow-yellow-200 dark:shadow-yellow-900/20"
    }
    if (isInstalled) {
      return adapter === "phantom"
        ? "border-purple-500 shadow-md shadow-purple-200 dark:shadow-purple-900/20"
        : "border-orange-500 shadow-md shadow-orange-200 dark:shadow-orange-900/20"
    }
    return adapter === "phantom" ? "hover:border-purple-500" : "hover:border-orange-500"
  }

  const hoverBgClass =
    adapter === "phantom"
      ? "hover:bg-purple-50 dark:hover:bg-purple-950/20"
      : "hover:bg-orange-50 dark:hover:bg-orange-950/20"

  // Get wallet name safely
  const walletName = wallet?.adapter?.name || (adapter === "phantom" ? "Phantom" : "Solflare")

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Button
          variant="outline"
          className={`flex items-center justify-center w-12 h-12 p-0 rounded-full ${hoverBgClass} ${getButtonStyle()} transition-all border-2 relative ${
            isConnected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-background" : ""
          }`}
          onClick={() => handleWalletLogin(false)}
          disabled={isAuthenticating || autoConnecting}
        >
          <div className="w-8 h-8 relative flex items-center justify-center">
            <img
              src={`/images/wallets/${adapter}-logo.png`}
              alt={adapter === "phantom" ? "Phantom" : "Solflare"}
              className="w-6 h-6 object-contain"
            />
          </div>
          {(isAuthenticating && selectedWallet === adapter) || (autoConnecting && selectedWallet === adapter) ? (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-full">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : null}
        </Button>
        {isInstalled && (
          <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-950 rounded-full">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center mt-2">
        <span className="text-xs font-medium">{adapter === "phantom" ? "Phantom" : "Solflare"}</span>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          {isInstalled && (
            <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              Installed
            </span>
          )}
          {isPreferred && (
            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
              Preferred
            </span>
          )}
          {isConnected && (
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
              Connected
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
