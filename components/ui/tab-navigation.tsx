"use client"

import type React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type TabItem = {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

interface TabNavigationProps {
  items: TabItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function TabNavigation({
  items,
  value,
  onValueChange,
  className,
  orientation = "horizontal",
}: TabNavigationProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className={orientation === "vertical" ? "flex-col h-auto" : "grid grid-cols-5 w-full"}>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value} disabled={item.disabled}>
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Always include TabsContent for each tab to ensure proper structure */}
      {items.map((item) => (
        <TabsContent key={`content-${item.value}`} value={item.value} className="hidden" />
      ))}
    </Tabs>
  )
}
