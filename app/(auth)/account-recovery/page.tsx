"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { RecoveryCodeForm } from "@/components/auth/recovery-code-form"

export default function AccountRecoveryPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRecoveryForm, setShowRecoveryForm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setShowRecoveryForm(true)
      toast({
        title: "Recovery code sent",
        description: "Check your email for the account recovery code.",
      })
    } catch (error) {
      console.error("Account recovery error:", error)
      toast({
        title: "Failed to send recovery code",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecoverySuccess = () => {
    toast({
      title: "Account recovered",
      description: "Your account has been recovered successfully.",
    })
    router.push("/login")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center p-4 border-b">
        <Link href="/login" className="flex items-center text-sm font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
        <div className="mx-auto flex justify-center">
          <Image src="/logo-dark.png" alt="Logo" width={75} height={28} className="dark:hidden" />
          <Image src="/logo-light.png" alt="Logo" width={75} height={28} className="hidden dark:block" />
        </div>
        <div className="w-[100px]"></div> {/* Spacer to balance the layout */}
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-lg border">
          {!showRecoveryForm ? (
            <>
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Account Recovery</h1>
                <p className="text-muted-foreground">Enter your email to recover your account</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <LoadingButton type="submit" className="w-full" isLoading={isLoading}>
                  Send Recovery Code
                </LoadingButton>
              </form>
            </>
          ) : (
            <RecoveryCodeForm email={email} onSuccess={handleRecoverySuccess} />
          )}
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
