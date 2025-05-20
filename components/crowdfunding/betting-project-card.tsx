"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Flame, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react"

export interface BettingProject {
  id: number
  title: string
  description: string
  image: string
  category: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  trending?: boolean
  hot?: boolean
  endingSoon?: boolean
  odds: string
  potentialReturn: number
  amount?: number
}

interface BettingProjectCardProps {
  project: BettingProject
  onAddToBettingSlip: (bet: BettingProject) => void
}

export function BettingProjectCard({ project, onAddToBettingSlip }: BettingProjectCardProps) {
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
    <Card className="overflow-hidden border-border/50 hover:border-border/80 transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3 h-48 md:h-auto">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
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
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{project.title}</h3>
            <div className="text-lg font-bold text-amber-500">{project.odds}</div>
          </div>

          <div className="mt-2">
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

          {expanded && <div className="mt-3 text-sm text-muted-foreground">{project.description}</div>}

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
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

            <div className="flex gap-2 flex-1">
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleAddToBettingSlip}>
                Back
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">{expanded ? "Show less" : "Show more"}</span>
              </Button>
            </div>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Potential return: {((betAmount * project.potentialReturn) / 100).toFixed(2)} ECE
          </div>
        </div>
      </div>
    </Card>
  )
}
