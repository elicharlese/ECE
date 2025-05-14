import type React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SwipeContainer } from "@/components/ui/swipe-container"

interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
  swipeable?: boolean
  compact?: boolean
  fullWidth?: boolean
}

export function MobileCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  header,
  footer,
  swipeable = false,
  compact = false,
  fullWidth = true,
  className,
  ...props
}: MobileCardProps) {
  const cardContent = (
    <Card className={cn("overflow-hidden", fullWidth && "w-full", className)} {...props}>
      {header && <CardHeader className={cn(compact && "p-3 sm:p-4 space-y-1")}>{header}</CardHeader>}
      <CardContent className={cn(compact && "p-3 sm:p-4 pt-0")}>{children}</CardContent>
      {footer && <CardFooter className={cn(compact && "p-3 sm:p-4 pt-0 mt-2")}>{footer}</CardFooter>}
    </Card>
  )

  if (swipeable) {
    return (
      <SwipeContainer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        {cardContent}
      </SwipeContainer>
    )
  }

  return cardContent
}
