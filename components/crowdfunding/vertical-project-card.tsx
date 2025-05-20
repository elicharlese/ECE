"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Flame, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react"
import type { BettingProject } from "@/components/crowdfunding/betting-project-card"

interface VerticalProjectCardProps {
  project: BettingProject
  onAddToBettingSlip: (bet: BettingProject) => void
}

export function VerticalProjectCard({ project, onAddToBettingSlip }: VerticalProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [betAmount, setBetAmount] = useState(50)

  const progressPercentage = Math.min(100, Math.round((project.raised / project.goal) * 100))

  const handleAddToBettingSlip = () => {
    onAddToBettingSlip({
      ...project,
      amount: betAmount,
    })
  }

  const increaseBet = () => {
    setBetAmount((prev) => Math.min(prev + 50, 1000))
  }

  const decreaseBet = () => {
    setBetAmount((prev) => Math.max(prev - 50, 50))
  }

  return (
    <Card className="w-full border-border/50 hover:border-border/80 transition-all overflow-hidden">
      <div className="relative w-full h-48 sm:h-64 md:h-80">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {project.category}
          </Badge>
          {project.trending && (
            <Badge className="bg-blue-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {project.hot && (
            <Badge className="bg-red-500 text-white">
              <Flame className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
          {project.endingSoon && (
            <Badge className="bg-amber-500 text-white">
              <Clock className="h-3 w-3 mr-1" />
              Ending Soon
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <div className="text-lg font-bold bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-amber-500">
            {project.odds}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-xl md:text-2xl">{project.title}</h3>
          <p className="text-sm md:text-base text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>
              {project.raised.toLocaleString()} / {project.goal.toLocaleString()} ECE
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>{progressPercentage}% Funded</span>
            <span>{project.daysLeft} days left</span>
          </div>
        </div>

        {expanded && (
          <div className="text-sm md:text-base text-muted-foreground border-t pt-3">
            <p className="mb-2">{project.description}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              <div>
                <span className="text-xs text-muted-foreground">Backers</span>
                <p className="font-medium">{project.backers}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Category</span>
                <p className="font-medium">{project.category}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Potential Return</span>
                <p className="font-medium">{project.potentialReturn}%</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Time Left</span>
                <p className="font-medium">{project.daysLeft} days</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={decreaseBet}
                disabled={betAmount <= 50}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease bet</span>
              </Button>
              <div className="px-3 font-medium">{betAmount} ECE</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={increaseBet}
                disabled={betAmount >= 1000}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase bet</span>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Return:{" "}
              <span className="text-green-600 font-medium">
                {((betAmount * project.potentialReturn) / 100).toFixed(2)} ECE
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleAddToBettingSlip}>
              Back Project
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">{expanded ? "Show less" : "Show more"}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
