export default function ProjectLoading() {
  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
        <div className="h-64 bg-muted rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="h-8 w-2/3 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-muted rounded mb-8"></div>
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-32 bg-muted rounded mb-8"></div>
          </div>
          <div className="md:col-span-1">
            <div className="h-40 bg-muted rounded mb-4"></div>
            <div className="h-60 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
