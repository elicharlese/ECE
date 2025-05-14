"use client"

import { useMedia } from "@/context/media-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Music, Video, Palette, FileText, Mic, Layers, BookOpen, Film, Code, Globe, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function CategoryBrowser() {
  const { categories } = useMedia()

  // Map category IDs to icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "camera":
        return <Camera className="h-6 w-6" />
      case "music":
        return <Music className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "palette":
        return <Palette className="h-6 w-6" />
      case "file-text":
        return <FileText className="h-6 w-6" />
      case "mic":
        return <Mic className="h-6 w-6" />
      case "layers":
        return <Layers className="h-6 w-6" />
      case "book-open":
        return <BookOpen className="h-6 w-6" />
      case "film":
        return <Film className="h-6 w-6" />
      case "code":
        return <Code className="h-6 w-6" />
      case "globe":
        return <Globe className="h-6 w-6" />
      case "users":
        return <Users className="h-6 w-6" />
      default:
        return <Layers className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Browse Categories</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/app/media/category/${category.id}`}>
            <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
              <div className="relative h-24 bg-muted">
                <img
                  src={category.coverImage || `/placeholder.svg?height=300&width=600&query=${category.name}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute bottom-2 right-2">{category.count}</Badge>
              </div>
              <CardContent className={cn("p-3 flex flex-col items-center text-center")}>
                <div className="text-primary mb-2">{getCategoryIcon(category.iconName)}</div>
                <h3 className="font-medium text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
