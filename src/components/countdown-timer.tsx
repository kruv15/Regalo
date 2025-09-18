"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ onComplete }: { onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Birthday date: September 17, 2024 at midnight Bolivia time (UTC-4)
    const targetDate = new Date("2025-09-17T23:55:00-04:00")

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        setIsComplete(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsComplete(true)
      }
    }, 1000)

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft()
    setTimeLeft(initialTimeLeft)
    if (
      initialTimeLeft.days === 0 &&
      initialTimeLeft.hours === 0 &&
      initialTimeLeft.minutes === 0 &&
      initialTimeLeft.seconds === 0
    ) {
      setIsComplete(true)
    }

    return () => clearInterval(timer)
  }, [])

  if (isComplete) {
    return (
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1
            className="text-6xl md:text-7xl font-extrabold text-white text-center"
            style={{ textShadow: "0 6px 24px rgba(0,0,0,0.45)" }}
          >
            ¡Es tu día especial!
          </h1>
          <p className="text-2xl text-white/85">
            Tu sorpresa está lista para ser descubierta
          </p>
        </div>

        <div className="relative inline-block">
          {/* spotlight dorado detrás del botón */}
          <div
            className="absolute -inset-x-16 -inset-y-10 pointer-events-none blur-2xl"
            style={{
              background:
                "radial-gradient(40% 60% at 50% 50%, rgba(255,204,102,0.55) 0%, rgba(255,204,102,0.25) 35%, rgba(0,0,0,0) 70%)",
              filter: "saturate(1.1)",
            }}
          />
          <Button
            onClick={onComplete}
            className="relative text-xl px-10 py-4 bg-gradient-to-r from-amber-400 via-fuchsia-500 to-violet-500 hover:from-amber-300 hover:via-fuchsia-400 hover:to-violet-400 transition-all duration-300 rounded-xl shadow-2xl"
            style={{
              boxShadow:
                "0 8px 30px rgba(245, 158, 11, 0.45), 0 0 60px rgba(236, 72, 153, 0.25)",
            }}
          >
            ✨ Ver mi cielo especial ✨
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-8">
      <section className="relative z-10 flex flex-col items-center text-center px-6 md:px-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.35)]">
            El Universo de Tu Vida
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,.25)]">Tu gran sorpresa llega en...</p>
        </div>
      </section>

      <div className="mt-10 md:mt-12" />
      
      <div className="relative z-10 max-w-md mx-auto">
        {/* Glow suave detrás del grupo (sin ::before) */}
        <div className="absolute -inset-8 rounded-[28px] bg-gradient-to-r from-[#FFC05733] via-[#FF6FD833] to-[#7C5CFF33] blur-2xl opacity-70 pointer-events-none" />

        {/* Tus tarjetas */}
        <div className="relative grid grid-cols-4 gap-4">
          {/* Días */}
          <div className="rounded-2xl bg-white/10 [background:radial-gradient(120%_120%_at_50%_10%,rgba(255,255,255,.18),rgba(255,255,255,.06))] backdrop-blur-sm px-6 py-5 md:px-7 md:py-6 text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,.25)]">
            <div className="relative flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold leading-none text-white animate-pulse" style={{animationDelay: "0s"}}>{timeLeft.days}</span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white/90 animate-ping" />
            </div>
            <div className="mt-1 text-xs md:text-sm text-white/70">Días</div>
          </div>

          {/* Horas */}
          <div className="rounded-2xl bg-white/10 [background:radial-gradient(120%_120%_at_50%_10%,rgba(255,255,255,.18),rgba(255,255,255,.06))] backdrop-blur-sm px-6 py-5 md:px-7 md:py-6 text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,.25)]">
            <div className="relative flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold leading-none text-white animate-pulse" style={{animationDelay: ".1s"}}>{timeLeft.hours}</span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white/90 animate-ping" style={{animationDelay: ".1s"}} />
            </div>
            <div className="mt-1 text-xs md:text-sm text-white/70">Horas</div>
          </div>

          {/* Minutos */}
          <div className="rounded-2xl bg-white/10 [background:radial-gradient(120%_120%_at_50%_10%,rgba(255,255,255,.18),rgba(255,255,255,.06))] backdrop-blur-sm px-6 py-5 md:px-7 md:py-6 text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,.25)]">
            <div className="relative flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold leading-none text-white animate-pulse" style={{animationDelay: ".2s"}}>{timeLeft.minutes}</span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white/90 animate-ping" style={{animationDelay: ".2s"}} />
            </div>
            <div className="mt-1 text-xs md:text-sm text-white/70">Minutos</div>
          </div>

          {/* Segundos */}
          <div className="rounded-2xl bg-white/10 [background:radial-gradient(120%_120%_at_50%_10%,rgba(255,255,255,.18),rgba(255,255,255,.06))] backdrop-blur-sm px-6 py-5 md:px-7 md:py-6 text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,.25)]">
            <div className="relative flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold leading-none text-white animate-pulse" style={{animationDelay: ".3s"}}>{timeLeft.seconds}</span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white/90 animate-ping" style={{animationDelay: ".3s"}} />
            </div>
            <div className="mt-1 text-xs md:text-sm text-white/70">Segundos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
