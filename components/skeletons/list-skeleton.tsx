import { Skeleton } from "@/components/ui/skeleton"

interface ListSkeletonProps {
  items?: number
  hasImage?: boolean
}

export function ListSkeleton({ items = 5, hasImage = false }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border-b last:border-0">
          {hasImage && <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-4 w-16 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}
