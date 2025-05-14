import { supabase } from "./supabase-client"

// Grace period in days
export const ACCOUNT_RECOVERY_GRACE_PERIOD = 30

export async function softDeleteAccount(userId: string): Promise<{ recoveryCode: string }> {
  // Generate a unique recovery code
  const recoveryCode = generateRecoveryCode()

  const now = new Date()
  const expiresAt = new Date()
  expiresAt.setDate(now.getDate() + ACCOUNT_RECOVERY_GRACE_PERIOD)

  // Store the deletion record with recovery information
  const { error } = await supabase.from("deleted_accounts").insert({
    user_id: userId,
    recovery_code: recoveryCode,
    deleted_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    is_recovered: false,
  })

  if (error) {
    console.error("Error creating deletion record:", error)
    throw new Error("Failed to process account deletion")
  }

  // Update user metadata to mark as soft deleted
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      is_deleted: true,
      deleted_at: now.toISOString(),
      recovery_expires_at: expiresAt.toISOString(),
    },
  })

  if (updateError) {
    console.error("Error updating user metadata:", updateError)
    throw new Error("Failed to mark account as deleted")
  }

  return { recoveryCode }
}

export async function recoverAccount(email: string, recoveryCode: string): Promise<void> {
  // First, find the user by email
  const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
    filter: {
      email: email,
    },
  })

  if (userError || !userData || userData.users.length === 0) {
    throw new Error("Account not found or recovery period has expired")
  }

  const user = userData.users[0]

  // Check if the user is actually soft deleted
  if (!user.user_metadata?.is_deleted) {
    throw new Error("This account is not pending deletion")
  }

  // Verify the recovery code
  const { data: recoveryData, error: recoveryError } = await supabase
    .from("deleted_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("recovery_code", recoveryCode)
    .eq("is_recovered", false)
    .single()

  if (recoveryError || !recoveryData) {
    throw new Error("Invalid recovery code or account not found")
  }

  // Check if the recovery period has expired
  const now = new Date()
  const expiresAt = new Date(recoveryData.expires_at)

  if (now > expiresAt) {
    throw new Error("Recovery period has expired. Account cannot be recovered")
  }

  // Mark the account as recovered
  const { error: updateRecoveryError } = await supabase
    .from("deleted_accounts")
    .update({ is_recovered: true, recovered_at: now.toISOString() })
    .eq("user_id", user.id)
    .eq("recovery_code", recoveryCode)

  if (updateRecoveryError) {
    throw new Error("Failed to process recovery")
  }

  // Update user metadata to remove deletion flags
  const { error: updateUserError } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: {
      is_deleted: null,
      deleted_at: null,
      recovery_expires_at: null,
    },
  })

  if (updateUserError) {
    throw new Error("Failed to restore account")
  }
}

export async function sendRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
  // In a real implementation, this would send an email with the recovery code
  // For this example, we'll just log it
  console.log(`Recovery email sent to ${email} with code ${recoveryCode}`)

  // This would typically use an email service like SendGrid, Mailgun, etc.
}

export async function checkRecoveryEligibility(email: string): Promise<{
  eligible: boolean
  daysRemaining?: number
}> {
  // Find the user by email
  const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
    filter: {
      email: email,
    },
  })

  if (userError || !userData || userData.users.length === 0) {
    return { eligible: false }
  }

  const user = userData.users[0]

  // Check if the user is soft deleted
  if (!user.user_metadata?.is_deleted) {
    return { eligible: false }
  }

  // Check if the recovery period is still valid
  const now = new Date()
  const expiresAt = new Date(user.user_metadata.recovery_expires_at)

  if (now > expiresAt) {
    return { eligible: false }
  }

  // Calculate days remaining
  const diffTime = Math.abs(expiresAt.getTime() - now.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    eligible: true,
    daysRemaining: diffDays,
  }
}

// Helper function to generate a random recovery code
function generateRecoveryCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
