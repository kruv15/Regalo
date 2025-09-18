"use client"

import { useEffect, useRef, useState } from "react"

interface Star {
  x: number
  y: number
  layer: "near" | "mid" | "far"
  size: number
  opacity: number
  twinklePhase: number
  color: string
}

interface SvgStarSystemProps {
  count?: number
  isActive?: boolean
}

export function SvgStarSystem({ count = 150, isActive = true }: SvgStarSystemProps) {
  const [stars, setStars] = useState<Star[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const initStars = () => {
      const newStars: Star[] = []
      for (let i = 0; i < count; i++) {
        const layers: ("near" | "mid" | "far")[] = ["near", "mid", "far"]
        const layer = layers[Math.floor(Math.random() * layers.length)]

        newStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          layer,
          size:
            layer === "near"
              ? Math.random() * 0.8 + 0.6
              : layer === "mid"
                ? Math.random() * 0.6 + 0.4
                : Math.random() * 0.4 + 0.2,
          opacity: Math.random() * 0.8 + 0.2,
          twinklePhase: Math.random() * Math.PI * 2,
          color:
            layer === "near"
              ? `hsl(${Math.random() * 30 + 45}, 80%, 85%)`
              : layer === "mid"
                ? `hsl(${Math.random() * 60 + 200}, 70%, 80%)`
                : `hsl(${Math.random() * 40 + 220}, 60%, 75%)`,
        })
      }
      setStars(newStars)
    }

    const animate = () => {
      if (!isActive) return

      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          twinklePhase: star.twinklePhase + 0.02,
          opacity: 0.3 + Math.sin(star.twinklePhase) * 0.5,
        })),
      )

      animationRef.current = requestAnimationFrame(animate)
    }

    initStars()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [count, isActive])

  if (!isActive) return null

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
    >
      <defs>
        <filter id="star-glow">
          <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <g id="star-5">
          <path d="M0,-1 L0.3,-0.3 L1,0 L0.3,0.3 L0,1 L-0.3,0.3 L-1,0 L-0.3,-0.3 Z" fill="currentColor" />
        </g>
        <g id="star-6">
          <path
            d="M0,-1 L0.2,-0.2 L0.8,-0.6 L0.2,0 L0.8,0.6 L0.2,0.2 L0,1 L-0.2,0.2 L-0.8,0.6 L-0.2,0 L-0.8,-0.6 L-0.2,-0.2 Z"
            fill="currentColor"
          />
        </g>
        <g id="star-8">
          <path
            d="M0,-1 L0.15,-0.15 L0.7,-0.7 L0.15,0 L1,0 L0.15,0.15 L0.7,0.7 L0.15,0.15 L0,1 L-0.15,0.15 L-0.7,0.7 L-0.15,0 L-1,0 L-0.15,-0.15 L-0.7,-0.7 L-0.15,-0.15 Z"
            fill="currentColor"
          />
        </g>
      </defs>

      {stars.map((star, index) => {
        const starShape = star.layer === "near" ? "#star-8" : star.layer === "mid" ? "#star-6" : "#star-5"

        return (
          <use
            key={index}
            href={starShape}
            x={star.x}
            y={star.y}
            transform={`translate(${star.x}, ${star.y}) scale(${star.size})`}
            style={{
              color: star.color,
              opacity: star.opacity,
              filter: "url(#star-glow)",
            }}
          />
        )
      })}
    </svg>
  )
}
