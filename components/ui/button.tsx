import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors outline-none focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 btn-pulse click-feedback cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
        outline: "bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * IMPORTANT: When using asChild={true}, make sure to provide only ONE child element.
 * If you need to pass multiple elements (like an icon and text), wrap them in a single
 * element like <span> or <div>.
 *
 * CORRECT:
 * <Button asChild={true}>
 *   <span className="flex items-center gap-2">
 *     <Icon /> Text
 *   </span>
 * </Button>
 *
 * INCORRECT:
 * <Button asChild={true}>
 *   <Icon /> Text
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Filter out any toast-related props and keep demo-related props
    const { toast, showToast, toastMessage, toastType, toastPosition, toastDuration, onToast, ...filteredProps } = props

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-button-variant={variant}
        data-button-size={size}
        {...filteredProps}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
