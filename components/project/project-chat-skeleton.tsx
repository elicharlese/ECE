import { Skeleton } from "@/components/ui/skeleton"

export function ProjectChatSkeleton() {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <Skeleton className="h-[80px] w-full rounded" />
      </div>
    </div>
  )
}
