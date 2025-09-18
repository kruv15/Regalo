"use client"

import { useEffect, useRef } from "react"

interface Firework {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  gravity: number
  trail: { x: number; y: number; opacity: number }[]
}

interface FireworksSystemProps {
  isActive: boolean
  intensity?: number
}

export function FireworksSystem({ isActive, intensity = 5 }: FireworksSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireworksRef = useRef<Firework[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const colors = ["#3b82f6", "#a855f7", "#f59e0b", "#ec4899", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"]

    const createFirework = (x?: number, y?: number) => {
      const startX = x || Math.random() * canvas.width
      const startY = y || canvas.height

      // Create multiple particles for explosion effect
      const particleCount = 15 + Math.random() * 15
      const baseColor = colors[Math.floor(Math.random() * colors.length)]

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
        const velocity = 2 + Math.random() * 4
        const life = 60 + Math.random() * 40

        fireworksRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 0,
          maxLife: life,
          color: baseColor,
          size: 2 + Math.random() * 3,
          gravity: 0.05 + Math.random() * 0.05,
          trail: [],
        })
      }
    }

    const updateFirework = (firework: Firework) => {
      // Update position
      firework.x += firework.vx
      firework.y += firework.vy
      firework.vy += firework.gravity
      firework.life++

      // Add to trail
      firework.trail.push({
        x: firework.x,
        y: firework.y,
        opacity: 1 - firework.life / firework.maxLife,
      })

      // Limit trail length
      if (firework.trail.length > 10) {
        firework.trail.shift()
      }

      // Fade out over time
      firework.vx *= 0.98
      firework.vy *= 0.98
    }

    const drawFirework = (firework: Firework) => {
      ctx.save()

      // Draw trail
      firework.trail.forEach((point, index) => {
        const opacity = point.opacity * (1 - firework.life / firework.maxLife)
        const size = firework.size * (1 - index / firework.trail.length)

        ctx.globalAlpha = opacity
        ctx.fillStyle = firework.color
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw main particle with glow
      const opacity = 1 - firework.life / firework.maxLife
      ctx.globalAlpha = opacity

      // Glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = firework.color
      ctx.fillStyle = firework.color
      ctx.beginPath()
      ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2)
      ctx.fill()

      // Inner bright core
      ctx.shadowBlur = 5
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(firework.x, firework.y, firework.size * 0.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    const animate = () => {
      if (!isActive) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create new fireworks randomly
      if (Math.random() < 0.02 * intensity) {
        createFirework()
      }

      // Update and draw fireworks
      fireworksRef.current = fireworksRef.current.filter((firework) => {
        updateFirework(firework)
        drawFirework(firework)
        return firework.life < firework.maxLife
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, intensity])

  // Manual trigger for special moments
  const triggerFirework = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const canvasX = x - rect.left
    const canvasY = y - rect.top

    const colors = ["#3b82f6", "#a855f7", "#f59e0b", "#ec4899", "#10b981"]
    const particleCount = 25
    const baseColor = colors[Math.floor(Math.random() * colors.length)]

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3
      const velocity = 3 + Math.random() * 5
      const life = 80 + Math.random() * 40

      fireworksRef.current.push({
        x: canvasX,
        y: canvasY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 0,
        maxLife: life,
        color: baseColor,
        size: 3 + Math.random() * 2,
        gravity: 0.03,
        trail: [],
      })
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 20 }}
      onClick={(e) => triggerFirework(e.clientX, e.clientY)}
    />
  )
}
