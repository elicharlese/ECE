"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search, Filter } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FilterTagsProps {
  onFilter: (filters: any) => void
  activeFilters: any
}

export function FilterTags({ onFilter, activeFilters }: FilterTagsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState(activeFilters.search || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(activeFilters.categories || [])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  if (activeFilters.trending) selectedStatuses.push("trending")
  if (activeFilters.hot) selectedStatuses.push("hot")
  if (activeFilters.endingSoon) selectedStatuses.push("endingSoon")

  const categories = ["DeFi", "Infrastructure", "Gaming", "Privacy", "Social"]
  const statuses = [
    { id: "trending", label: "Trending" },
    { id: "hot", label: "Hot" },
    { id: "endingSoon", label: "Ending Soon" },
  ]

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  const applyFilters = () => {
    onFilter({
      search,
      categories: selectedCategories,
      trending: selectedStatuses.includes("trending"),
      hot: selectedStatuses.includes("hot"),
      endingSoon: selectedStatuses.includes("endingSoon"),
    })
    setIsOpen(false)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setSelectedStatuses([])
    onFilter({})
    setIsOpen(false)
  }

  const removeFilter = (type: string, value: string) => {
    if (type === "category") {
      const newCategories = selectedCategories.filter((c) => c !== value)
      setSelectedCategories(newCategories)
      onFilter({
        ...activeFilters,
        categories: newCategories,
      })
    } else if (type === "status") {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== value))
      onFilter({
        ...activeFilters,
        [value]: false,
      })
    } else if (type === "search") {
      setSearch("")
      onFilter({
        ...activeFilters,
        search: "",
      })
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9 pr-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onFilter({ ...activeFilters, search })
              }
            }}
          />
        </div>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Filters</h3>

              <div>
                <h4 className="font-medium text-sm mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Badge
                      key={status.id}
                      variant={selectedStatuses.includes(status.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleStatusToggle(status.id)}
                    >
                      {status.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filters */}
      {(selectedCategories.length > 0 || selectedStatuses.length > 0 || activeFilters.search) && (
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-2 w-max">
            {activeFilters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {activeFilters.search}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("search", "")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove search filter</span>
                </Button>
              </Badge>
            )}

            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("category", category)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {category} filter</span>
                </Button>
              </Badge>
            ))}

            {selectedStatuses.map((status) => {
              const statusLabel = statuses.find((s) => s.id === status)?.label || status
              return (
                <Badge key={status} variant="secondary" className="flex items-center gap-1">
                  {statusLabel}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeFilter("status", status)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {statusLabel} filter</span>
                  </Button>
                </Badge>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
