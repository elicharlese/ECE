"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { checkRecoveryEligibility, recoverAccount } from "@/lib/account-recovery"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const recoverySchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  recoveryCode: z.string().min(6, { message: "Recovery code must be at least 6 characters" }),
})

type RecoveryFormValues = z.infer<typeof recoverySchema>

export function RecoveryCodeForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isRecovering, setIsRecovering] = useState(false)
  const [eligibilityChecked, setEligibilityChecked] = useState(false)
  const [isEligible, setIsEligible] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(0)

  const form = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
      recoveryCode: "",
    },
  })

  async function checkEligibility(email: string) {
    try {
      const { eligible, daysRemaining } = await checkRecoveryEligibility(email)
      setIsEligible(eligible)
      setDaysRemaining(daysRemaining || 0)
      setEligibilityChecked(true)

      if (!eligible) {
        toast({
          title: "Account not eligible",
          description: "This account is not eligible for recovery or the recovery period has expired.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Eligibility check error:", error)
      toast({
        title: "Error",
        description: "Failed to check recovery eligibility. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(data: RecoveryFormValues) {
    if (!eligibilityChecked) {
      await checkEligibility(data.email)
      return
    }

    if (!isEligible) {
      toast({
        title: "Account not eligible",
        description: "This account is not eligible for recovery or the recovery period has expired.",
        variant: "destructive",
      })
      return
    }

    setIsRecovering(true)

    try {
      await recoverAccount(data.email, data.recoveryCode)

      toast({
        title: "Account recovered",
        description: "Your account has been successfully restored. You can now log in.",
        variant: "default",
      })

      router.push("/login")
    } catch (error) {
      console.error("Account recovery error:", error)
      toast({
        title: "Recovery failed",
        description: error instanceof Error ? error.message : "Failed to recover account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRecovering(false)
    }
  }

  const email = form.watch("email")
  const emailValid = form.getFieldState("email").isDirty && !form.getFieldState("email").error

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {eligibilityChecked && isEligible && (
          <>
            <Alert>
              <AlertTitle>Recovery Available</AlertTitle>
              <AlertDescription>
                Your account is eligible for recovery. You have {daysRemaining} days remaining before permanent
                deletion.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="recoveryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recovery Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your recovery code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <LoadingButton
          type="submit"
          className="w-full"
          isLoading={isRecovering}
          loadingText={eligibilityChecked ? "Recovering..." : "Checking..."}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {eligibilityChecked ? "Recover Account" : "Check Eligibility"}
        </LoadingButton>
      </form>
    </Form>
  )
}
