"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  const router = useRouter()

  const handleRetry = () => {
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <WifiOff className="h-12 w-12 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">You're offline</CardTitle>
          <CardDescription>
            It looks like you've lost your internet connection. Check your connection and try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Some features of the ECE App are available offline. You can access previously loaded content, but new data
            requires an internet connection.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
