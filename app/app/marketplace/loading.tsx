import { AppContainer } from "@/components/app-container"
import { ProductSkeleton } from "@/components/skeletons/product-skeleton"

export default function MarketplaceLoading() {
  return (
    <AppContainer>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-full md:w-auto flex gap-2">
            <div className="h-10 w-full md:w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        <div className="h-10 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    </AppContainer>
  )
}
