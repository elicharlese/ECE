"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground", className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  // Ensure children is a single React element
  const wrappedChildren = (() => {
    // If children is a string, just return it
    if (typeof children === "string") {
      return children
    }

    // If children is already a valid React element, return it
    if (React.isValidElement(children)) {
      // Check if it's an array or has icon/text structure
      if (Array.isArray(children) || (children.props && (children.props.icon || children.props.text))) {
        return (
          <span className="flex flex-row items-center gap-2">
            {Array.isArray(children) ? (
              children
            ) : (
              <>
                {children.props.icon && <span>{children.props.icon}</span>}
                <span>{children.props.text}</span>
              </>
            )}
          </span>
        )
      }
      return children
    }

    // If it's an object with icon and text properties
    if (children && typeof children === "object" && "icon" in children && "text" in children) {
      return (
        <span className="flex flex-row items-center gap-2">
          <span>{children.icon}</span>
          <span>{children.text}</span>
        </span>
      )
    }

    // Default fallback
    return <span className="flex flex-row items-center gap-2">{children}</span>
  })()

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative hover:text-[#0e5f59] data-[state=active]:text-[#0e5f59]",
        className,
      )}
      {...props}
    >
      {wrappedChildren}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
