import type React from "react"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyRouteOptions {
  loading?: React.ReactNode
  ssr?: boolean
}

export function lazyRoute<T = any>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  options: LazyRouteOptions = {},
) {
  const LazyComponent = dynamic(importFunc, {
    loading: () => <>{options.loading || <Skeleton className="w-full h-[200px]" />}</>,
    ssr: options.ssr ?? false,
  })

  return function LazyRouteWrapper(props: T) {
    return (
      <Suspense fallback={options.loading || <Skeleton className="w-full h-[200px]" />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
