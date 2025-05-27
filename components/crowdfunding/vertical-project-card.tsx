"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BettingProject {
  id: string
  title: string
  description: string
  // ... other properties
}

interface VerticalProjectCardProps {
  project: any
  onAddToBettingSlip: (bet: BettingProject) => void
  className?: string
}

export function VerticalProjectCard({ project, onAddToBettingSlip, className }: VerticalProjectCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div>
        {/* Project Image */}
        <img src={project.imageUrl || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-gray-500">{project.description}</p>
        <button
          onClick={() => onAddToBettingSlip(project)}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Betting Slip
        </button>
      </div>
    </Card>
  )
}
