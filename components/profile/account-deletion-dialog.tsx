"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useDemo } from "@/lib/demo-context"
import { supabase } from "@/lib/supabase-client"
import { ACCOUNT_RECOVERY_GRACE_PERIOD, softDeleteAccount, sendRecoveryEmail } from "@/lib/account-recovery"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the deletion reasons
const DELETION_REASONS = [
  { id: "not-useful", label: "I don't find the platform useful" },
  { id: "too-complicated", label: "The platform is too complicated" },
  { id: "found-alternative", label: "I found a better alternative" },
  { id: "privacy-concerns", label: "I have privacy concerns" },
  { id: "too-expensive", label: "The service is too expensive" },
  { id: "bugs-issues", label: "Too many bugs or technical issues" },
  { id: "poor-support", label: "Poor customer support" },
  { id: "temporary-break", label: "I'm taking a temporary break" },
  { id: "other", label: "Other reason" },
]

// Step 1: Feedback collection schema
const feedbackSchema = z.object({
  reason: z.string().min(1, { message: "Please select a reason" }),
  additionalFeedback: z.string().optional(),
})

// Step 2: Account deletion confirmation schema
const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
  confirmation: z.string().refine((val) => val === "DELETE", {
    message: 'Please type "DELETE" to confirm',
  }),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>
type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>

interface AccountDeletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountDeletionDialog({ open, onOpenChange }: AccountDeletionDialogProps) {
  const { user, signOut } = useAuth()
  const { isDemoMode, disableDemoMode } = useDemo()
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null)
  const [step, setStep] = useState<"feedback" | "confirmation" | "recovery">("feedback")
  const [feedbackData, setFeedbackData] = useState<FeedbackFormValues | null>(null)

  // Form for feedback collection
  const feedbackForm = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      reason: "",
      additionalFeedback: "",
    },
  })

  // Form for account deletion confirmation
  const confirmationForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmation: "",
    },
  })

  // Handle feedback submission
  function onFeedbackSubmit(data: FeedbackFormValues) {
    setFeedbackData(data)
    setStep("confirmation")
  }

  // Handle final deletion confirmation
  async function onConfirmationSubmit(data: DeleteAccountFormValues) {
    if (!user || !feedbackData) return

    setIsDeleting(true)

    try {
      // Store the feedback first
      const { error: feedbackError } = await supabase.from("account_deletion_feedback").insert({
        user_id: user.id,
        reason: feedbackData.reason,
        additional_feedback: feedbackData.additionalFeedback || null,
      })

      if (feedbackError) {
        console.error("Error storing feedback:", feedbackError)
        // Continue with deletion even if feedback storage fails
      }

      if (isDemoMode) {
        // For demo mode, just simulate the process
        await new Promise((resolve) => setTimeout(resolve, 1500))
        disableDemoMode()
        onOpenChange(false)
        router.push("/")

        toast({
          title: "Demo account deleted",
          description: "Your demo session has been ended.",
          variant: "default",
        })
      } else {
        // For real accounts, verify the password first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email || "",
          password: data.password,
        })

        if (signInError) {
          throw new Error("Incorrect password. Please try again.")
        }

        // Soft delete the account and get recovery code
        const { recoveryCode } = await softDeleteAccount(user.id)
        setRecoveryCode(recoveryCode)
        setStep("recovery")

        // Send recovery email
        if (user.email) {
          await sendRecoveryEmail(user.email, recoveryCode)
        }

        // Sign out the user
        await signOut()
      }
    } catch (error) {
      console.error("Account deletion error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  function handleClose() {
    if (recoveryCode) {
      // If we have a recovery code, redirect to login
      router.push("/login")
      toast({
        title: "Account scheduled for deletion",
        description: `Your account will be permanently deleted after ${ACCOUNT_RECOVERY_GRACE_PERIOD} days. Check your email for recovery instructions.`,
        variant: "default",
      })
    }
    onOpenChange(false)
  }

  function handleBack() {
    setStep("feedback")
  }

  return (
    <Dialog open={open} onOpenChange={recoveryCode ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "feedback" && (
          <>
            <DialogHeader>
              <DialogTitle>Why are you leaving?</DialogTitle>
              <DialogDescription>
                We're sorry to see you go. Your feedback helps us improve our platform.
              </DialogDescription>
            </DialogHeader>

            <Form {...feedbackForm}>
              <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="space-y-4 py-4">
                <FormField
                  control={feedbackForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What's your primary reason for deleting your account?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {DELETION_REASONS.map((reason) => (
                            <FormItem key={reason.id} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={reason.id} />
                              </FormControl>
                              <FormLabel className="font-normal">{reason.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={feedbackForm.control}
                  name="additionalFeedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional feedback (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your experience..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Continue</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {step === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </DialogTitle>
              <DialogDescription>
                Your account will be scheduled for deletion and permanently removed after{" "}
                {ACCOUNT_RECOVERY_GRACE_PERIOD} days.
              </DialogDescription>
            </DialogHeader>

            <Form {...confirmationForm}>
              <form onSubmit={confirmationForm.handleSubmit(onConfirmationSubmit)} className="space-y-4 py-4">
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    You will have {ACCOUNT_RECOVERY_GRACE_PERIOD} days to recover your account before it is permanently
                    deleted.
                  </AlertDescription>
                </Alert>

                <FormField
                  control={confirmationForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={confirmationForm.control}
                  name="confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmation</FormLabel>
                      <FormControl>
                        <Input placeholder='Type "DELETE" to confirm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={handleBack} type="button">
                    Back
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="destructive"
                    isLoading={isDeleting}
                    loadingText="Processing..."
                    disabled={!confirmationForm.formState.isValid}
                  >
                    Delete Account
                  </LoadingButton>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {step === "recovery" && recoveryCode && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Account Scheduled for Deletion
              </DialogTitle>
              <DialogDescription>
                Your account will be permanently deleted after {ACCOUNT_RECOVERY_GRACE_PERIOD} days.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <Alert>
                <AlertTitle>Recovery Code</AlertTitle>
                <AlertDescription className="font-mono text-lg tracking-wider text-center py-2">
                  {recoveryCode}
                </AlertDescription>
              </Alert>

              <p className="text-sm text-muted-foreground">
                Please save this recovery code. You will need it if you want to restore your account within the{" "}
                {ACCOUNT_RECOVERY_GRACE_PERIOD}-day grace period.
              </p>

              <p className="text-sm text-muted-foreground">We have also sent this code to your email address.</p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>I've saved my recovery code</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
