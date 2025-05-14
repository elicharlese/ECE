"use client"

import type React from "react"

import { useState } from "react"
import { useMedia } from "@/context/media-context"
import { FeaturedMedia } from "@/components/media/featured-media"
import { CategoryBrowser } from "@/components/media/category-browser"
import { MediaGrid } from "@/components/media/media-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Clock, Upload, Filter } from "lucide-react"
import Link from "next/link"

export default function MediaPage() {
  const { trendingMedia, recentMedia, searchMedia } = useMedia()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const results = searchMedia(searchQuery)
      setSearchResults(results)
    }
  }

  return (
    <div className="container py-6 space-y-10">
      {/* Search bar */}
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="flex-1 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search media..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <Button variant="outline" asChild>
          <Link href="/app/media/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Link>
        </Button>
      </div>

      {/* Search results */}
      {searchQuery && searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("")
                setSearchResults([])
              }}
            >
              Clear Results
            </Button>
          </div>
          <MediaGrid items={searchResults} columns={3} />
        </div>
      )}

      {/* Main content */}
      {(!searchQuery || searchResults.length === 0) && (
        <>
          {/* Featured media section */}
          <FeaturedMedia />

          {/* Categories */}
          <CategoryBrowser />

          {/* Trending and recent tabs */}
          <div className="space-y-4">
            <Tabs defaultValue="trending">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="trending">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recent">
                    <Clock className="mr-2 h-4 w-4" />
                    Recent
                  </TabsTrigger>
                </TabsList>

                <Button variant="ghost" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>

              <TabsContent value="trending" className="pt-4">
                <MediaGrid items={trendingMedia} columns={4} />
              </TabsContent>

              <TabsContent value="recent" className="pt-4">
                <MediaGrid items={recentMedia} columns={4} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}
