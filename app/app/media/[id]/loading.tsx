import { Skeleton } from "@/components/ui/skeleton"

export default function MediaDetailLoading() {
  return (
    <div className="container py-6">
      <Skeleton className="h-8 w-20 mb-4" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Media player skeleton */}
          <Skeleton className="aspect-video w-full" />

          {/* Media info skeleton */}
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex items-center justify-between mt-2">
              <Skeleton className="h-4 w-40" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Creator info skeleton */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Tabs skeleton */}
          <div>
            <div className="flex space-x-2 mb-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
