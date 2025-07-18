'use client'

import { cn } from './utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type = "text",
  ...props
}, ref) => {
  const baseClasses = "flex h-11 w-full rounded-lg border border-[#75715E]/30 bg-[#272822]/50 px-3 py-2 text-sm text-[#F8EFD6] placeholder:text-[#75715E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66D9EF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#272822] disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm"

  return (
    <input
      type={type}
      className={cn(baseClasses, className)}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"
