import { Skeleton } from "@/components/ui/skeleton"

interface TextSkeletonProps {
  lines?: number
  lastLineWidth?: string
}

export function TextSkeleton({ lines = 3, lastLineWidth = "w-3/4" }: TextSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
      <Skeleton className={`h-4 ${lastLineWidth}`} />
    </div>
  )
}
