"use client"

import Link from "next/link"
import { MatcapCard } from "@/components/3d/MatcapCard"
import { SimpleCard } from "@/components/3d/SimpleCard"
import { useState, useEffect } from "react"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  // State to track if 3D rendering is available
  const [use3D, setUse3D] = useState(true)

  // Detect if we should use 3D based on previous errors
  useEffect(() => {
    // Check if we've had errors with 3D rendering before
    const had3DErrors = localStorage.getItem("had3DErrors") === "true"
    if (had3DErrors) {
      setUse3D(false)
    }

    // Set up error handler
    const handleError = () => {
      setUse3D(false)
      localStorage.setItem("had3DErrors", "true")
    }

    // Prevent scrolling on the homepage
    document.body.style.overflow = "hidden"

    window.addEventListener("error", handleError)
    return () => {
      window.removeEventListener("error", handleError)
      // Restore scrolling when component unmounts
      document.body.style.overflow = ""
    }
  }, [])

  // Card component based on 3D availability
  const CardComponent = use3D ? MatcapCard : SimpleCard

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Hero Section - adjusted to account for header and footer */}
      <section className="w-full flex-1 flex items-center justify-center bg-background">
        <div className="container px-4 md:px-6 mx-auto flex justify-center items-center">
          <div className="flex flex-col justify-center items-center text-center max-w-3xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                Custom Blockchain Application Development Services
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-sm md:text-base mx-auto">
                Secure, scalable blockchain solutions for your business. From smart contracts to decentralized
                applications, we build the future of digital transactions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/marketplace"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Order Your App
              </Link>
              <Link
                href="/app"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Available Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Footer */}
      <div className="w-full">
        <Footer className="border-t" />
      </div>
    </div>
  )
}
