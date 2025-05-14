"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTimezone, COMMON_TIMEZONES, ALL_TIMEZONES } from "@/lib/timezone-context"

interface TimezoneSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  showLabel?: boolean
  showIcon?: boolean
  className?: string
  triggerClassName?: string
  placeholder?: string
  showAllTimezones?: boolean
}

export function TimezoneSelector({
  value,
  onValueChange,
  showLabel = true,
  showIcon = true,
  className,
  triggerClassName,
  placeholder = "Select timezone",
  showAllTimezones = false,
}: TimezoneSelectorProps) {
  const { preferences } = useTimezone()
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || preferences.userTimezone)
  const [searchQuery, setSearchQuery] = useState("")

  // Update selected value when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedValue(value)
    }
  }, [value])

  // Get the list of timezones to display
  const timezones = showAllTimezones ? ALL_TIMEZONES : COMMON_TIMEZONES

  // Filter timezones based on search query
  const filteredTimezones = searchQuery
    ? timezones.filter(
        (tz) =>
          tz.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tz.value.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : timezones

  // Handle timezone selection
  const handleSelect = (timezone: string) => {
    setSelectedValue(timezone)
    if (onValueChange) {
      onValueChange(timezone)
    }
    setOpen(false)
  }

  // Get the label for the selected timezone
  const selectedTimezone = timezones.find((tz) => tz.value === selectedValue)
  const selectedLabel = selectedTimezone ? selectedTimezone.label : selectedValue

  return (
    <div className={className}>
      {showLabel && <label className="block text-sm font-medium mb-1">Timezone</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", triggerClassName)}
          >
            <div className="flex items-center gap-2 truncate">
              {showIcon && <Globe className="h-4 w-4 shrink-0 opacity-50" />}
              <span className="truncate">{selectedLabel || placeholder}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search timezone..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {filteredTimezones.map((tz) => (
                  <CommandItem
                    key={tz.value}
                    value={tz.value}
                    onSelect={() => handleSelect(tz.value)}
                    className="flex items-center gap-2"
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedValue === tz.value ? "opacity-100" : "opacity-0")} />
                    <span className="truncate">{tz.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
