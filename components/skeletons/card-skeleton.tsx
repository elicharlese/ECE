import { Skeleton } from "@/components/ui/skeleton"

interface CardSkeletonProps {
  hasImage?: boolean
  hasFooter?: boolean
  imageHeight?: string
}

export function CardSkeleton({ hasImage = true, hasFooter = true, imageHeight = "h-40" }: CardSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {hasImage && <Skeleton className={`w-full ${imageHeight}`} />}
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {hasFooter && (
          <div className="pt-2 flex justify-between items-center">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        )}

        {hasFooter && <Skeleton className="h-9 w-full mt-3" />}
      </div>
    </div>
  )
}
