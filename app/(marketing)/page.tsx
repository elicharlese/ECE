"use client"
import { useState } from "react"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  // State to track if 3D rendering is available
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [splineError, setSplineError] = useState(false)

  // Handle iframe load event
  const handleSplineLoad = () => {
    setSplineLoaded(true)
  }

  // Handle iframe error
  const handleSplineError = () => {
    setSplineError(true)
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Hero Section with Spline 3D embed */}
      <section className="w-full flex-1 flex items-center justify-center bg-background relative overflow-hidden">
        {/* Spline iframe as background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://my.spline.design/eceparallaxpath-R7tEBQLwK8tlOKZWIglFU75G/"
            frameBorder="0"
            width="100%"
            height="100%"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            title="ECE 3D Experience"
            style={{ opacity: splineLoaded ? 1 : 0 }}
            className="transition-opacity duration-500"
          />

          {/* Loading state */}
          {!splineLoaded && !splineError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error fallback */}
          {splineError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <p className="text-muted-foreground">Unable to load 3D experience</p>
            </div>
          )}
        </div>

        {/* Content overlay */}
      </section>

      {/* Fixed Footer */}
      <div className="w-full">
        <Footer className="border-t" />
      </div>
    </div>
  )
}
