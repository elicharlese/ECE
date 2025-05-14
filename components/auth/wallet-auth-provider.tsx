"use client"

import type { ReactNode } from "react"
import { WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { useMemo } from "react"

interface WalletAuthProviderProps {
  children: ReactNode
}

export function WalletAuthProvider({ children }: WalletAuthProviderProps) {
  // Setup the wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <WalletProvider wallets={wallets} autoConnect>
      {children}
    </WalletProvider>
  )
}
