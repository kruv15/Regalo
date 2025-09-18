// components/ui/button.tsx
"use client"

import * as React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: false
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className = "", ...props }, ref) => {
    // estilos base; puedes cambiarlos a tu gusto
    const base =
      "inline-flex items-center justify-center rounded-lg text-sm font-medium " +
      "px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 " +
      "focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    // borde y fondo por defecto (si no pasas clases de gradiente desde fuera)
    const fallback = "bg-primary text-primary-foreground hover:opacity-90"

    return (
      <button
        ref={ref}
        className={`${base} ${fallback} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
