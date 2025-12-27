"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 duration-300 transition text-primary",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 text-xs gap-1.5 px-4",
        lg: "h-10 rounded-md px-6",
        xl: "h-12 rounded-md px-8",
        xxl: "h-14 rounded-md px-10",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function GlassFilter() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter id="liquid-glass" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="3"
            seed="5"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="1.5" result="finalBlur" />
          <feMerge>
            <feMergeNode in="finalBlur" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}

interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidbuttonVariants> {
  asChild?: boolean
}

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <>
      <GlassFilter />
      <div className="relative group">
        {/* Glass blur background */}
        <div
          className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
          style={{ filter: "url(#liquid-glass)" }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-white/5" />
        
        {/* Shine effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        {/* Button content */}
        <Comp
          className={cn(
            liquidbuttonVariants({ variant, size }),
            "relative z-10 rounded-xl px-6 py-3 text-foreground font-medium",
            "bg-gradient-to-b from-white/15 to-transparent",
            "border border-white/20 backdrop-blur-sm",
            "shadow-lg shadow-black/5",
            "hover:from-white/20 hover:border-white/30",
            "active:scale-[0.98] transition-all duration-200",
            className
          )}
          {...props}
        >
          {children}
        </Comp>
        
        {/* Bottom reflection */}
        <div className="absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </>
  )
}

// Metal Button variants
type ColorVariant = "default" | "primary" | "success" | "error" | "gold" | "bronze"

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant
}

const colorVariants: Record<
  ColorVariant,
  {
    outer: string
    inner: string
    button: string
    textColor: string
    textShadow: string
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-zinc-900 to-zinc-400",
    inner: "bg-gradient-to-b from-zinc-100 via-zinc-600 to-zinc-200",
    button: "bg-gradient-to-b from-zinc-300 to-zinc-500",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]",
  },
  primary: {
    outer: "bg-gradient-to-b from-indigo-900 to-indigo-400",
    inner: "bg-gradient-to-b from-indigo-100 via-indigo-700 to-indigo-200",
    button: "bg-gradient-to-b from-indigo-400 to-indigo-600",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(30_58_138_/_100%)]",
  },
  success: {
    outer: "bg-gradient-to-b from-emerald-900 to-emerald-400",
    inner: "bg-gradient-to-b from-emerald-100 via-emerald-700 to-emerald-200",
    button: "bg-gradient-to-b from-emerald-400 to-emerald-600",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
  },
  error: {
    outer: "bg-gradient-to-b from-red-900 to-red-400",
    inner: "bg-gradient-to-b from-red-100 via-red-700 to-red-200",
    button: "bg-gradient-to-b from-red-400 to-red-600",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-yellow-700 to-yellow-300",
    inner: "bg-gradient-to-b from-yellow-100 via-yellow-600 to-yellow-200",
    button: "bg-gradient-to-b from-yellow-300 to-yellow-500",
    textColor: "text-yellow-900",
    textShadow: "[text-shadow:_0_-1px_0_rgb(178_140_2_/_100%)]",
  },
  bronze: {
    outer: "bg-gradient-to-b from-orange-800 to-orange-400",
    inner: "bg-gradient-to-b from-orange-200 via-orange-700 to-orange-300",
    button: "bg-gradient-to-b from-orange-300 to-orange-500",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]",
  },
}

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-md pointer-events-none transition-opacity duration-300",
        isPressed ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
    </div>
  )
}

const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isTouchDevice, setIsTouchDevice] = React.useState(false)

    React.useEffect(() => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    }, [])

    const colors = colorVariants[variant]
    const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)"

    return (
      <div
        className={cn(
          "relative inline-flex transform-gpu rounded-md p-[1.25px] will-change-transform",
          colors.outer
        )}
        style={{
          transform: isPressed
            ? "translateY(2.5px) scale(0.99)"
            : "translateY(0) scale(1)",
          boxShadow: isPressed
            ? "0 1px 2px rgba(0, 0, 0, 0.15)"
            : isHovered && !isTouchDevice
              ? "0 4px 12px rgba(0, 0, 0, 0.12)"
              : "0 3px 8px rgba(0, 0, 0, 0.08)",
          transition: transitionStyle,
        }}
      >
        <div
          className={cn(
            "absolute inset-[1px] transform-gpu rounded-lg will-change-transform",
            colors.inner
          )}
          style={{
            transition: transitionStyle,
            filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.05)" : "none",
          }}
        />

        <button
          ref={ref}
          className={cn(
            "relative z-10 m-[1px] rounded-md inline-flex h-11 transform-gpu cursor-pointer items-center justify-center overflow-hidden px-6 py-2 text-sm leading-none font-semibold will-change-transform outline-none",
            colors.button,
            colors.textColor,
            colors.textShadow,
            className
          )}
          style={{
            transform: isPressed ? "scale(0.97)" : "scale(1)",
            transition: transitionStyle,
            filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.02)" : "none",
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => {
            setIsPressed(false)
            setIsHovered(false)
          }}
          onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
          {...props}
        >
          <ShineEffect isPressed={isPressed} />
          {children}
          {isHovered && !isPressed && !isTouchDevice && (
            <div className="absolute inset-0 bg-white/5 rounded-md pointer-events-none" />
          )}
        </button>
      </div>
    )
  }
)

MetalButton.displayName = "MetalButton"

export { LiquidButton, liquidbuttonVariants, MetalButton }
