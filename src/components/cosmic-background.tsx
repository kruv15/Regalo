"use client"

import { useEffect, useMemo, useState } from "react"
import { ParticleSystem } from "./particle-system"
import { SvgStarSystem } from "./svg-star-system"
import { DayNightStyles } from "./styles/day-night-styles"
import { CosmicAnimations } from "./animations/cosmic-animations"

interface CloudLayer {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

type CosmicBackgroundProps = {
  /** "HH:mm" para simular (ej. "21:30") o undefined para tiempo real */
  overrideTime?: string
}

export function CosmicBackground({ overrideTime }: CosmicBackgroundProps) {
  const [isNight, setIsNight] = useState(false)
  const [cloudLayers, setCloudLayers] = useState<CloudLayer[]>([])

  const [simHour, setSimHour] = useState<number | null>(null)
  const [simMinute, setSimMinute] = useState<number>(0)

  // Si hay prop overrideTime, tiene prioridad; si no, usa sliders si simHour != null; si no, tiempo real.
  const effectiveOverride = useMemo(() => {
    if (overrideTime) return overrideTime
    if (simHour !== null) {
      const mm = String(simMinute).padStart(2, "0")
      const hh = String(simHour).padStart(2, "0")
      return `${hh}:${mm}`
    }
    return undefined
  }, [overrideTime, simHour, simMinute])

  const getBoliviaHour = () => {
    if (effectiveOverride) {
      const [hh] = effectiveOverride.split(":")
      return Number(hh) % 24
    }
    return Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: "America/La_Paz",
      }).format(new Date()),
    )
  }

  // Nubes sólo se crean una vez
  useEffect(() => {
    const clouds: CloudLayer[] = []
    for (let i = 0; i < 8; i++) {
      clouds.push({
        id: i,
        x: Math.random() * 120 - 10,
        y: Math.random() * 40 + 10,
        size: Math.random() * 15 + 10,
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.3 + 0.1,
      })
    }
    setCloudLayers(clouds)
  }, [])

  // Día/Noche
  useEffect(() => {
    const checkTime = () => {
      const hour = getBoliviaHour()
      setIsNight(hour < 6 || hour > 18)
    }
    checkTime()
    if (!effectiveOverride) {
      const id = setInterval(checkTime, 60_000)
      return () => clearInterval(id)
    }
  }, [effectiveOverride])

  // Animación nubes (sólo de día)
  useEffect(() => {
    if (isNight) return
    const id = setInterval(() => {
      setCloudLayers(prev =>
        prev.map(c => ({
          ...c,
          x: c.x + c.speed > 110 ? -20 : c.x + c.speed,
        })),
      )
    }, 100)
    return () => clearInterval(id)
  }, [isNight])

  return (
    <CosmicAnimations>
      <DayNightStyles isNight={isNight}>
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
          {/* Cielo base */}
          <div className={`absolute inset-0 transition-all duration-2000 z-0 ${isNight ? "night-sky" : "day-sky"}`} />

          {/* --- Capas “cinematográficas” para la noche --- */}
          {isNight && (
            <>
              {/* Halo suave en el centro */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 22%, rgba(0,0,0,0) 55%)",
                  mixBlendMode: "screen",
                }}
              />

              {/* Nebulosa tenue */}
              <div className="absolute inset-0 z-[1] bg-gradient-radial from-purple-900/18 via-transparent to-blue-900/14 pointer-events-none" />

              {/* Haz lunar diagonal (muy sutil) */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 65%)",
                  transform: "translateX(6%)",
                  filter: "blur(1px)",
                }}
              />

              {/* Viñeta: solo bordes, nunca encima del contenido */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.35) 100%)",
                }}
              />
            </>
          )}

          {/* Nubes de día */}
          {!isNight &&
            cloudLayers.map(cloud => (
              <div
                key={cloud.id}
                className="absolute z-10 rounded-full bg-white transition-all duration-1000 pointer-events-none"
                style={{
                  left: `${cloud.x}%`,
                  top: `${cloud.y}%`,
                  width: `${cloud.size}vw`,
                  height: `${cloud.size * 0.6}vw`,
                  opacity: cloud.opacity,
                  filter: "blur(1px)",
                  transform: "skew(-10deg, 0deg)",
                }}
              />
            ))}

          {/* Campo de estrellas / partículas (no bloquean clicks) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {isNight && <SvgStarSystem count={320} />}
            {!isNight && <ParticleSystem type="clouds" count={15} />}
            {isNight && <ParticleSystem type="shooting-stars" count={8} />}
            <ParticleSystem type="sparkles" count={60} />
          </div>

          {/* Sol / Luna (encima de todo lo visual) */}
          {!isNight && (
            <div className="absolute top-20 right-20 z-30 transition-all duration-1000">
              <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 float relative">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-6 bg-yellow-300 rounded-full"
                    style={{
                      top: "-1.5rem",
                      left: "50%",
                      transformOrigin: "50% 2.5rem",
                      transform: `translateX(-50%) rotate(${i * 45}deg)`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {isNight && (
            <div className="absolute top-16 right-16 z-30 transition-all duration-1000">
              <div className="w-12 h-12 bg-gray-100 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.35)] float relative">
                <div className="absolute top-2 left-2 w-2 h-2 bg-gray-300 rounded-full opacity-50" />
                <div className="absolute top-4 right-2 w-1 h-1 bg-gray-300 rounded-full opacity-30" />
                <div className="absolute bottom-2 left-3 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-40" />
              </div>
            </div>
          )}
        </div>
      </DayNightStyles>
    </CosmicAnimations>
  )
}
