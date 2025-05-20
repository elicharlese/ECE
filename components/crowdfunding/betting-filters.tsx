"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Flame, Clock } from "lucide-react"

interface BettingFiltersProps {
  onFilter: (filters: any) => void
}

export function BettingFilters({ onFilter }: BettingFiltersProps) {
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [trending, setTrending] = useState(false)
  const [hot, setHot] = useState(false)
  const [endingSoon, setEndingSoon] = useState(false)
  const [returnRange, setReturnRange] = useState([100, 350])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategories([...categories, category])
    } else {
      setCategories(categories.filter((c) => c !== category))
    }
  }

  const handleApplyFilters = () => {
    onFilter({
      search,
      categories,
      trending,
      hot,
      endingSoon,
      returnRange,
    })
  }

  const handleResetFilters = () => {
    setSearch("")
    setCategories([])
    setTrending(false)
    setHot(false)
    setEndingSoon(false)
    setReturnRange([100, 350])
    onFilter({})
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {["DeFi", "Infrastructure", "Gaming", "Privacy", "Social"].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="trending" checked={trending} onCheckedChange={(checked) => setTrending(checked === true)} />
              <Label htmlFor="trending" className="text-sm flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="hot" checked={hot} onCheckedChange={(checked) => setHot(checked === true)} />
              <Label htmlFor="hot" className="text-sm flex items-center">
                <Flame className="h-3 w-3 mr-1" />
                Hot
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ending-soon"
                checked={endingSoon}
                onCheckedChange={(checked) => setEndingSoon(checked === true)}
              />
              <Label htmlFor="ending-soon" className="text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Ending Soon
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">Potential Return</h4>
            <span className="text-xs text-muted-foreground">
              {returnRange[0]}% - {returnRange[1]}%
            </span>
          </div>
          <Slider value={returnRange} min={100} max={350} step={5} onValueChange={setReturnRange} className="my-4" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
