import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "neo-focus neo-hover neo-press inline-flex items-center justify-center whitespace-nowrap rounded-md border-2 border-border text-sm font-medium ring-offset-background transition-[transform,box-shadow,background-color,color] duration-150 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "neo-shadow bg-primary text-primary-foreground",
        secondary: "neo-shadow bg-secondary text-secondary-foreground",
        outline: "neo-shadow bg-background text-foreground hover:bg-muted",
        ghost: "border-transparent bg-transparent text-foreground hover:border-border hover:bg-muted",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
