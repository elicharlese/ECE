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

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState<"email" | "wallet">("email")
  const router = useRouter()
  const { toast } = useToast()

  // Check if already in demo mode and redirect if needed
  useEffect(() => {
    if (isDemoModeEnabled()) {
      console.log("Already in demo mode, redirecting to /app")
      router.push("/app")
    }
  }, [router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
        variant: "default",
      })

      // Redirect to login page after successful signup
      router.push("/login")
    } catch (error: any) {
      console.error("Signup error:", error)

      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration. Please try again.",
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
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Enter your information to get started</p>
          </div>

          <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as "email" | "wallet")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="space-y-4 mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
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
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Password
                  </label>
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
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Confirm Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                  />
                </div>
                <LoadingButton type="submit" className="w-full" isLoading={isLoading}>
                  Create Account
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
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
