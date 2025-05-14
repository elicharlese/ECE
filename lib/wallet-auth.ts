import { createClient } from "@supabase/supabase-js"
import type { PublicKey } from "@solana/web3.js"
import { ethers } from "ethers"
import { toast } from "@/hooks/use-toast"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Generate a nonce for signing
export const generateNonce = (): string => {
  return Math.floor(Math.random() * 1000000).toString()
}

// Create a message for the user to sign
export const createSignMessage = (address: string, nonce: string): string => {
  return `Sign this message to authenticate with ECE: ${nonce}`
}

// Verify a Solana wallet signature
export const verifySolanaSignature = async (
  message: string,
  signature: Uint8Array,
  publicKey: PublicKey,
): Promise<boolean> => {
  try {
    // In a real implementation, you would verify the signature here
    // For demo purposes, we'll assume the signature is valid
    return true
  } catch (error) {
    console.error("Error verifying Solana signature:", error)
    return false
  }
}

// Verify an Ethereum wallet signature
export const verifyEthereumSignature = async (
  message: string,
  signature: string,
  address: string,
): Promise<boolean> => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (error) {
    console.error("Error verifying Ethereum signature:", error)
    return false
  }
}

// Sign in with a wallet
export const signInWithWallet = async (
  walletType: "solana" | "ethereum",
  address: string,
  signedMessage: string | Uint8Array,
  publicKey?: PublicKey,
): Promise<{ user: any; error: any }> => {
  try {
    // First, check if the user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("wallet_address", address)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError
    }

    // If user doesn't exist, create a new one
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from("wallet_users")
        .insert([
          {
            wallet_address: address,
            wallet_type: walletType,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (createError) throw createError
    }

    // Create a custom JWT token for the wallet user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${address.toLowerCase()}@wallet.auth`, // Use a deterministic email based on address
      password: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!, // Use the ThirdWeb client ID as a shared secret
    })

    if (error) {
      // If the user doesn't exist in auth system yet, sign them up
      if (error.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: `${address.toLowerCase()}@wallet.auth`,
          password: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
          options: {
            data: {
              wallet_address: address,
              wallet_type: walletType,
            },
          },
        })

        if (signUpError) throw signUpError

        // Now try to sign in again
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: `${address.toLowerCase()}@wallet.auth`,
          password: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
        })

        if (retryError) throw retryError

        return { user: retryData.user, error: null }
      } else {
        throw error
      }
    }

    // Update the user_id in wallet_users table if needed
    if (data.user && (!existingUser || !existingUser.user_id)) {
      await supabase.from("wallet_users").update({ user_id: data.user.id }).eq("wallet_address", address)
    }

    return { user: data.user, error: null }
  } catch (error: any) {
    console.error("Error signing in with wallet:", error)
    toast({
      title: "Authentication failed",
      description: error.message || "An error occurred during wallet authentication.",
      variant: "destructive",
    })
    return { user: null, error }
  }
}

// Get wallet details for a user
export const getWalletDetails = async (userId: string) => {
  try {
    const { data, error } = await supabase.from("wallet_users").select("*").eq("user_id", userId)

    if (error) throw error
    return { wallets: data || [], error: null }
  } catch (error: any) {
    console.error("Error getting wallet details:", error)
    return { wallets: [], error }
  }
}

// Link a new wallet to an existing user
export const linkWalletToUser = async (userId: string, walletType: "solana" | "ethereum", address: string) => {
  try {
    // Check if wallet already exists
    const { data: existingWallet, error: checkError } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("wallet_address", address)
      .single()

    if (existingWallet) {
      throw new Error("This wallet is already linked to an account")
    }

    // Insert new wallet
    const { data, error } = await supabase
      .from("wallet_users")
      .insert([
        {
          user_id: userId,
          wallet_address: address,
          wallet_type: walletType,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error
    return { wallet: data[0], error: null }
  } catch (error: any) {
    console.error("Error linking wallet:", error)
    return { wallet: null, error }
  }
}

// Set a wallet as primary
export const setPrimaryWallet = async (walletId: number) => {
  try {
    const { data, error } = await supabase.from("wallet_users").update({ is_primary: true }).eq("id", walletId).select()

    if (error) throw error
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error setting primary wallet:", error)
    return { success: false, error }
  }
}

// Unlink a wallet from a user
export const unlinkWallet = async (walletId: number) => {
  try {
    const { error } = await supabase.from("wallet_users").delete().eq("id", walletId)

    if (error) throw error
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error unlinking wallet:", error)
    return { success: false, error }
  }
}
