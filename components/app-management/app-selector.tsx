"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Globe, Code, Server, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface App {
  id: string
  name: string
  type?: string
  status?: string
}

interface AppSelectorProps {
  apps: App[]
  selectedAppId: string | null
  onAppChange: (appId: string) => void
}

export function AppSelector({ apps, selectedAppId, onAppChange }: AppSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedApp = apps.find((app) => app.id === selectedAppId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[220px] justify-between">
          {selectedApp ? (
            <div className="flex items-center">
              {getAppTypeIcon(selectedApp.type)}
              <span className="ml-2 truncate">{selectedApp.name}</span>
            </div>
          ) : (
            "Select app..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search apps..." />
          <CommandEmpty>No app found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {apps.map((app) => (
                <CommandItem
                  key={app.id}
                  value={app.id}
                  onSelect={() => {
                    onAppChange(app.id)
                    setOpen(false)
                  }}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    {getAppTypeIcon(app.type)}
                    <span className="ml-2 truncate">{app.name}</span>
                  </div>
                  <Badge variant={getStatusVariant(app.status)} className="ml-2 text-xs">
                    {app.status || "Unknown"}
                  </Badge>
                  <Check className={cn("ml-2 h-4 w-4", selectedAppId === app.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function getAppTypeIcon(type?: string) {
  if (!type) return <Layers className="h-4 w-4 text-gray-500" />

  switch (type.toLowerCase()) {
    case "web":
      return <Globe className="h-4 w-4 text-blue-500" />
    case "mobile":
      return <Smartphone className="h-4 w-4 text-green-500" />
    case "api":
      return <Code className="h-4 w-4 text-purple-500" />
    case "backend":
      return <Server className="h-4 w-4 text-orange-500" />
    default:
      return <Layers className="h-4 w-4 text-gray-500" />
  }
}

function getStatusVariant(status?: string): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "outline"

  switch (status.toLowerCase()) {
    case "running":
      return "default"
    case "deploying":
      return "secondary"
    case "stopped":
      return "destructive"
    default:
      return "outline"
  }
}

// Add missing Smartphone icon
function Smartphone({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}
