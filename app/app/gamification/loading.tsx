import { Skeleton } from "@/components/ui/skeleton"

export default function GamificationLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-5 w-2/3" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-12 w-full rounded-lg mb-4" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
