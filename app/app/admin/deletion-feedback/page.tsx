import { DeletionFeedbackDashboard } from "@/components/admin/deletion-feedback-dashboard"

export default function DeletionFeedbackPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Deletion Feedback</h1>
        <p className="text-muted-foreground">Analyze why users are deleting their accounts to improve retention.</p>
      </div>

      <DeletionFeedbackDashboard />
    </div>
  )
}
