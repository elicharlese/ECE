"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Sparkles, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client" // Import the supabase instance directly
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletAuthProvider } from "@/components/auth/wallet-auth-provider"
import { WalletAuthButtons } from "@/components/auth/wallet-auth-buttons"
import { isDemoModeEnabled, enableDemoMode, navigateTo } from "@/lib/demo-utils"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState<"email" | "wallet">("email")
  const router = useRouter()
  const { toast } = useToast()

  // Check if we're in demo mode
  useEffect(() => {
    if (isDemoModeEnabled()) {
      console.log("Already in demo mode, redirecting to /app")
      router.push("/app")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      router.push("/app")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    setDemoLoading(true)

    try {
      // Show toast before enabling demo mode
      toast({
        title: "Demo Mode Activating",
        description: "Loading demo environment...",
        variant: "default",
      })

      // Enable demo mode directly
      const success = enableDemoMode()

      if (success) {
        // Use direct navigation instead of router
        setTimeout(() => {
          navigateTo("/app")
        }, 500)
      } else {
        throw new Error("Failed to enable demo mode")
      }
    } catch (error) {
      console.error("Demo mode error:", error)
      toast({
        title: "Demo Mode Failed",
        description: "Could not activate demo mode. Please try again.",
        variant: "destructive",
      })
      setDemoLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="flex items-center text-sm font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <div className="mx-auto flex justify-center">
          <Image src="/logo-dark.png" alt="Logo" width={75} height={28} className="dark:hidden" />
          <Image src="/logo-light.png" alt="Logo" width={75} height={28} className="hidden dark:block" />
        </div>
        <div className="w-[60px]"></div> {/* Spacer to balance the layout */}
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-lg border">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as "email" | "wallet")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                  />
                </div>
                <LoadingButton type="submit" className="w-full" isLoading={isLoading}>
                  Sign In
                </LoadingButton>
              </form>
            </TabsContent>
            <TabsContent value="wallet" className="space-y-4 mt-4">
              <WalletAuthProvider>
                <WalletAuthButtons />
              </WalletAuthProvider>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleDemoMode}
            disabled={demoLoading}
            className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-950"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {demoLoading ? "Loading Demo..." : "Try Demo Mode"}
          </Button>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
