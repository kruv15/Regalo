"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { CosmicAnimations } from "./animations/cosmic-animations"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Preload critical resources
    const preloadTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(preloadTimer)
  }, [])

  if (!isLoaded) {
    return (
      <CosmicAnimations>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xl text-blue-400 font-semibold">Preparando tu universo especial...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-0" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200" />
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce animation-delay-400" />
            </div>
          </div>
        </div>
      </CosmicAnimations>
    )
  }

  return <CosmicAnimations>{children}</CosmicAnimations>
}
