import { formatDistanceToNow } from "date-fns"
import { Star, GitFork, Eye, AlertCircle, Lock, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Repository } from "@/types/repository"

interface RepositoryCardProps {
  repository: Repository
  isSelected: boolean
  onToggleSelect: (id: string) => void
  showCheckbox?: boolean
}

export function RepositoryCard({ repository, isSelected, onToggleSelect, showCheckbox = true }: RepositoryCardProps) {
  const lastUpdated = formatDistanceToNow(new Date(repository.updatedAt), { addSuffix: true })

  return (
    <Card className={`transition-all duration-200 ${isSelected ? "border-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{repository.name}</CardTitle>
              {repository.isPrivate ? (
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              )}
            </div>
            <CardDescription>{repository.owner}</CardDescription>
          </div>
          {showCheckbox && (
            <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(repository.id)} className="mt-1" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{repository.description}</p>
        <div className="flex flex-wrap gap-2">
          {repository.topics.slice(0, 4).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
          {repository.topics.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{repository.topics.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1" />
            {repository.stars.toLocaleString()}
          </div>
          <div className="flex items-center">
            <GitFork className="h-3.5 w-3.5 mr-1" />
            {repository.forks.toLocaleString()}
          </div>
          <div className="flex items-center">
            <Eye className="h-3.5 w-3.5 mr-1" />
            {repository.watchers.toLocaleString()}
          </div>
          <div className="flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            {repository.openIssues.toLocaleString()}
          </div>
        </div>
        <div>Updated {lastUpdated}</div>
      </CardFooter>
    </Card>
  )
}
