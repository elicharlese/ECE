import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean
    variant?: "default" | "elevated" | "interactive" | "outline"
    responsive?: boolean
  }
>(({ className, hover = false, variant = "default", responsive = true, ...props }, ref) => {
  const variantStyles = {
    default:
      "rounded-lg border bg-card text-card-foreground shadow-sm dark:bg-slate-800 dark:shadow-slate-dark dark:border-slate-700",
    elevated:
      "rounded-lg border bg-card text-card-foreground shadow-md dark:bg-slate-800 dark:shadow-slate-dark dark:border-slate-700",
    interactive:
      "rounded-lg border bg-card text-card-foreground shadow-sm dark:bg-slate-800 dark:shadow-slate-dark dark:border-slate-700 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20",
    outline: "rounded-lg border-2 bg-transparent text-card-foreground dark:border-slate-700",
  }

  return (
    <div
      ref={ref}
      className={cn(
        variantStyles[variant],
        hover && "transition-all duration-200 hover:shadow-md hover:border-primary/20",
        responsive && "w-full",
        className,
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    responsive?: boolean
  }
>(({ className, responsive = true, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    responsive?: boolean
  }
>(({ className, responsive = true, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight dark:text-slate-50",
      responsive ? "text-xl sm:text-2xl" : "text-2xl",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    responsive?: boolean
  }
>(({ className, responsive = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-muted-foreground dark:text-slate-300 mt-2.5",
      responsive ? "text-xs sm:text-sm" : "text-sm",
      className,
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    scrollable?: boolean
    maxHeight?: string
    responsive?: boolean
  }
>(({ className, scrollable = false, maxHeight = "300px", responsive = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pt-0 dark:text-slate-200",
      scrollable && "overflow-y-auto",
      responsive ? "p-4 sm:p-6" : "p-6",
      className,
    )}
    style={scrollable ? { maxHeight } : undefined}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    responsive?: boolean
  }
>(({ className, responsive = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0 mt-4 dark:text-slate-200", responsive ? "p-4 sm:p-6" : "p-6", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
