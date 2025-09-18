"use client"

import * as React from "react"
import * as RD from "@radix-ui/react-dialog"
export function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ")
}

export const Dialog = RD.Root
export const DialogTrigger = RD.Trigger
export const DialogClose = RD.Close
export const DialogPortal = RD.Portal

export function DialogOverlay(props: React.ComponentPropsWithoutRef<typeof RD.Overlay>) {
  return (
    <RD.Overlay
      {...props}
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/60 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        props.className
      )}
    />
  )
}

export function DialogContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RD.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RD.Content
        {...props}
        className={cn(
          "fixed z-50 grid w-full max-w-lg gap-4",
          "rounded-xl border border-white/10 bg-card text-card-foreground",
          "shadow-2xl cosmic-glow",
          "p-6",
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
      />
    </DialogPortal>
  )
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RD.Title>) {
  return <RD.Title className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RD.Description>) {
  return <RD.Description className={cn("text-sm text-muted-foreground", className)} {...props} />
}

/* ---------- Si NO tienes "@/lib/utils", usa este cn minimal ----------
export function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ")
}
--------------------------------------------------------------------- */
