"use client"

import { useEffect, useRef } from "react"

interface ConfettiPiece {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  shape: "square" | "circle" | "triangle"
  life: number
  maxLife: number
}

interface ConfettiSystemProps {
  isActive: boolean
  duration?: number
  intensity?: number
}

export function ConfettiSystem({ isActive, duration = 5000, intensity = 3 }: ConfettiSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiRef = useRef<ConfettiPiece[]>([])
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

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
    const shapes: ("square" | "circle" | "triangle")[] = ["square", "circle", "triangle"]

    const createConfetti = () => {
      const piece: ConfettiPiece = {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        life: 0,
        maxLife: 300 + Math.random() * 200,
      }
      confettiRef.current.push(piece)
    }

    const updateConfetti = (piece: ConfettiPiece) => {
      piece.x += piece.vx
      piece.y += piece.vy
      piece.vy += 0.1 // gravity
      piece.rotation += piece.rotationSpeed
      piece.life++

      // Add some air resistance
      piece.vx *= 0.99
      piece.vy *= 0.99
    }

    const drawConfetti = (piece: ConfettiPiece) => {
      ctx.save()
      ctx.translate(piece.x, piece.y)
      ctx.rotate(piece.rotation)

      const opacity = Math.max(0, 1 - piece.life / piece.maxLife)
      ctx.globalAlpha = opacity
      ctx.fillStyle = piece.color

      switch (piece.shape) {
        case "square":
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
          break
        case "circle":
          ctx.beginPath()
          ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2)
          ctx.fill()
          break
        case "triangle":
          ctx.beginPath()
          ctx.moveTo(0, -piece.size / 2)
          ctx.lineTo(-piece.size / 2, piece.size / 2)
          ctx.lineTo(piece.size / 2, piece.size / 2)
          ctx.closePath()
          ctx.fill()
          break
      }

      ctx.restore()
    }

    const animate = (currentTime: number) => {
      if (!isActive) return

      if (startTimeRef.current === 0) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const shouldCreateConfetti = elapsed < duration

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create new confetti pieces
      if (shouldCreateConfetti) {
        for (let i = 0; i < intensity; i++) {
          if (Math.random() < 0.3) {
            createConfetti()
          }
        }
      }

      // Update and draw confetti
      confettiRef.current = confettiRef.current.filter((piece) => {
        updateConfetti(piece)
        drawConfetti(piece)
        return piece.life < piece.maxLife && piece.y < canvas.height + 50
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    startTimeRef.current = 0
    animate(0)

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, duration, intensity])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }} />
}
