'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  className?: string
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  className,
  variant = 'default',
  ...props
}, ref) => {
  const baseClasses = "relative w-full rounded-lg border border-[#75715E]/30 px-4 py-3 text-sm backdrop-blur-sm"
  
  const variants = {
    default: "bg-[#272822]/50 text-[#F8EFD6] border-[#75715E]/30",
    destructive: "bg-[#F92672]/10 text-[#F92672] border-[#F92672]/30",
    success: "bg-[#A6E22E]/10 text-[#A6E22E] border-[#A6E22E]/30",
    warning: "bg-[#E6DB74]/10 text-[#E6DB74] border-[#E6DB74]/30",
    info: "bg-[#66D9EF]/10 text-[#66D9EF] border-[#66D9EF]/30"
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  ...props
}, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
