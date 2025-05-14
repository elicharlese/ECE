export default function Loading() {
  return (
    <div className="container py-12">
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading gamification dashboard...</p>
        </div>
      </div>
    </div>
  )
}
