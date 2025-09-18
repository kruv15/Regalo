"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

interface ParticleSystemProps {
  type: "stars" | "clouds" | "sparkles" | "shooting-stars"
  count?: number
  isActive?: boolean
}

export function ParticleSystem({ type, count = 100, isActive = true }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
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

    const createParticle = (): Particle => {
      switch (type) {
        case "stars":
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: 0,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            color: `hsl(${Math.random() * 60 + 200}, 70%, 80%)`,
            life: Math.random() * 100,
            maxLife: 100,
          }

        case "clouds":
          return {
            x: Math.random() * (canvas.width + 200) - 100,
            y: Math.random() * canvas.height * 0.6,
            vx: Math.random() * 0.5 + 0.1,
            vy: Math.random() * 0.1 - 0.05,
            size: Math.random() * 60 + 40,
            opacity: Math.random() * 0.3 + 0.1,
            color: "rgba(255, 255, 255, 0.8)",
            life: 0,
            maxLife: 1000,
          }

        case "sparkles":
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: 1,
            color: `hsl(${Math.random() * 60 + 40}, 80%, 70%)`,
            life: 0,
            maxLife: 60,
          }

        case "shooting-stars":
          return {
            x: -50,
            y: Math.random() * canvas.height * 0.5,
            vx: Math.random() * 8 + 4,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 2 + 1,
            opacity: 1,
            color: "rgba(255, 255, 255, 0.9)",
            life: 0,
            maxLife: 120,
          }

        default:
          return createParticle()
      }
    }

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle())
      }
    }

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      switch (type) {
        case "stars":
          // Twinkling effect
          particle.opacity = 0.3 + Math.sin(particle.life * 0.05) * 0.5
          break

        case "clouds":
          // Slow drift
          if (particle.x > canvas.width + 100) {
            particle.x = -100
            particle.y = Math.random() * canvas.height * 0.6
          }
          break

        case "sparkles":
          // Fade out over time
          particle.opacity = 1 - particle.life / particle.maxLife
          if (particle.life >= particle.maxLife) {
            Object.assign(particle, createParticle())
          }
          break

        case "shooting-stars":
          // Trail effect and reset when off screen
          particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)
          if (particle.x > canvas.width + 50 || particle.life >= particle.maxLife) {
            Object.assign(particle, createParticle())
          }
          break
      }
    }

    const drawParticle = (particle: Particle) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity

      switch (type) {
        case "stars":
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          // Add glow effect
          ctx.shadowBlur = 10
          ctx.shadowColor = particle.color
          ctx.fill()
          break

        case "clouds":
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.arc(particle.x + particle.size * 0.5, particle.y, particle.size * 0.8, 0, Math.PI * 2)
          ctx.arc(particle.x - particle.size * 0.5, particle.y, particle.size * 0.8, 0, Math.PI * 2)
          ctx.fill()
          break

        case "sparkles":
          ctx.fillStyle = particle.color
          ctx.beginPath()
          // Draw sparkle as a star shape
          const spikes = 4
          const outerRadius = particle.size
          const innerRadius = particle.size * 0.5
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            const angle = (i * Math.PI) / spikes
            const x = particle.x + Math.cos(angle) * radius
            const y = particle.y + Math.sin(angle) * radius
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
          break

        case "shooting-stars":
          // Draw trail
          const gradient = ctx.createLinearGradient(
            particle.x - particle.vx * 10,
            particle.y - particle.vy * 10,
            particle.x,
            particle.y,
          )
          gradient.addColorStop(0, "rgba(255, 255, 255, 0)")
          gradient.addColorStop(1, particle.color)

          ctx.strokeStyle = gradient
          ctx.lineWidth = particle.size
          ctx.beginPath()
          ctx.moveTo(particle.x - particle.vx * 10, particle.y - particle.vy * 10)
          ctx.lineTo(particle.x, particle.y)
          ctx.stroke()

          // Draw head
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          break
      }

      ctx.restore()
    }

    const animate = () => {
      if (!isActive) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        updateParticle(particle)
        drawParticle(particle)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [type, count, isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: type === "shooting-stars" ? 15 : 5 }}
    />
  )
}
