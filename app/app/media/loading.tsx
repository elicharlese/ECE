import { Skeleton } from "@/components/ui/skeleton"

export default function MediaLoading() {
  return (
    <div className="container py-6 space-y-10">
      {/* Search bar skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Featured media skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 lg:col-span-2" />
          <div className="grid grid-cols-1 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
        </div>
      </div>
    </div>
  )
}
