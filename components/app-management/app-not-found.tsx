"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Home, Plus } from "lucide-react"
import Link from "next/link"

export function AppNotFound() {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">App Not Found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The application you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Button asChild>
            <Link href="/app">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/manage">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Apps
            </Link>
          </Button>
          <Button variant="ghost">
            <Plus className="mr-2 h-4 w-4" />
            Create New App
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
