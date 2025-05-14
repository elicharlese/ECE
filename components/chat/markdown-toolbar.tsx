"use client"

import { Bold, Italic, Code, Link, List, ListOrdered, Heading, Quote, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MarkdownToolbarProps {
  onInsert: (markdown: string, selectionOffset?: number) => void
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  const tools = [
    {
      name: "Bold",
      icon: <Bold className="h-4 w-4" />,
      markdown: "**text**",
      selectionOffset: 2,
    },
    {
      name: "Italic",
      icon: <Italic className="h-4 w-4" />,
      markdown: "*text*",
      selectionOffset: 1,
    },
    {
      name: "Code",
      icon: <Code className="h-4 w-4" />,
      markdown: "`text`",
      selectionOffset: 1,
    },
    {
      name: "Link",
      icon: <Link className="h-4 w-4" />,
      markdown: "[link text](url)",
      selectionOffset: 1,
    },
    {
      name: "Image",
      icon: <ImageIcon className="h-4 w-4" />,
      markdown: "![alt text](url)",
      selectionOffset: 2,
    },
    {
      name: "Bullet List",
      icon: <List className="h-4 w-4" />,
      markdown: "- item\n- item\n- item",
    },
    {
      name: "Numbered List",
      icon: <ListOrdered className="h-4 w-4" />,
      markdown: "1. item\n2. item\n3. item",
    },
    {
      name: "Heading",
      icon: <Heading className="h-4 w-4" />,
      markdown: "## Heading",
      selectionOffset: 3,
    },
    {
      name: "Quote",
      icon: <Quote className="h-4 w-4" />,
      markdown: "> quote",
      selectionOffset: 2,
    },
  ]

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b">
      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onInsert(tool.markdown, tool.selectionOffset)}
              >
                {tool.icon}
                <span className="sr-only">{tool.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
