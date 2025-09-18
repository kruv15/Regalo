"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { PlanetButton } from "../components/ui/PlanetButton"

interface Star {
  id: string
  x: number
  y: number
  size: number
  brightness: number
  message: string
  title: string
  isSpecial?: boolean
}

interface ConstellationProps {
  onLetterClick: () => void
}

/** 1) Define la constelación una sola vez (fuera del componente) */
const CONSTELLATION_STARS: Star[] = [
  { id: "star1",  x: 30, y: 25, size: 8, brightness: 1,   
    title: "Tu Sonrisa", 
    message: "Tu sonrisa es un amanecer: ilumina incluso los días más grises y hace que todo cobre vida." 
  },
  { id: "star2",  x: 35, y: 30, size: 6, brightness: 0.8, 
    title: "Tu Fuerza",  
    message: "Dentro de ti habita una fuerza inmensa, la que te hace levantarte siempre y brillar más fuerte." 
  },
  { id: "star3",  x: 40, y: 35, size: 7, brightness: 0.9, 
    title: "Tu Bondad",  
    message: "Tu bondad es un refugio: quien la recibe se siente en casa, protegido por tu luz." 
  },
  { id: "star4",  x: 32, y: 40, size: 5, brightness: 0.7, 
    title: "Tu Inteligencia", 
    message: "Tu mente es un universo de ideas, y cada pensamiento tuyo es una estrella nueva encendiéndose." 
  },
  { id: "star5",  x: 38, y: 45, size: 6, brightness: 0.8, 
    title: "Tu Forma de Soñar", 
    message: "Tus sueños son constelaciones que me inspiran a creer en lo imposible." 
  },
  { id: "star6",  x: 55, y: 25, size: 7, brightness: 0.9, 
    title: "26 Años de Luz", 
    message: "Hoy celebramos 26 años de tu existencia: 26 destellos que han hecho al universo más brillante." 
  },
  { id: "star7",  x: 60, y: 30, size: 6, brightness: 0.8, 
    title: "Tu Creatividad", 
    message: "Tu creatividad transforma lo simple en mágico y convierte la vida en arte." 
  },
  { id: "star8",  x: 65, y: 35, size: 8, brightness: 1,   
    title: "Tu Risa", 
    message: "Tu risa es música que hace bailar a las estrellas y llena de alegría cada rincón." 
  },
  { id: "star9",  x: 70, y: 40, size: 5, brightness: 0.7, 
    title: "Tu Energía", 
    message: "Tu energía es contagiosa, enciende a quienes te rodean y convierte cada instante en algo especial." 
  },
  { id: "star10", x: 58, y: 45, size: 6, brightness: 0.8, 
    title: "Tu Luz Interior", 
    message: "Eres dueña de una luz interior que ni el tiempo ni la distancia podrán apagar. Esa luz inspira a todos los que te rodean." 
  },
  { id: "special", x: 50, y: 60, size: 12, brightness: 1.2, 
    title: "Carta Especial", 
    message: "Aquí se guarda lo más profundo de mi corazón: una carta escrita solo para ti, porque eres única en este universo.", 
    isSpecial: true 
  },
]

const palette = [
  { base: "#9be7ff", glow: "rgba(155,231,255,0.55)" }, // azul hielo
  { base: "#c7b8ff", glow: "rgba(199,184,255,0.60)" }, // lila suave
  { base: "#ffd59b", glow: "rgba(255,213,155,0.55)" }, // dorado
  { base: "#9fffd1", glow: "rgba(159,255,209,0.55)" }, // menta
]

// Toma la paleta ligada a la estrella seleccionada
function getToneFor(starId?: string) {
  if (!starId) return palette[0]
  const i = CONSTELLATION_STARS.findIndex((s) => s.id === starId)
  return palette[(i >= 0 ? i : 0) % palette.length]
}

function getModalPlanetSize() {
  if (typeof window === "undefined") return 110
  const vw = Math.max(320, Math.min(window.innerWidth, 1600))
  // clamp(96px, ~12vw, 150px)
  const byVw = vw * 0.12
  return Math.round(Math.max(96, Math.min(byVw, 150)))
}

export function Constellation({ onLetterClick }: ConstellationProps) {
  const [stars, setStars] = useState<Star[]>([])
  const [selectedStar, setSelectedStar] = useState<Star | null>(null)
  const [isForming, setIsForming] = useState(true)
  const [modalPlanetSize, setModalPlanetSize] = useState<number>(110)

  /** 3) Guarda todos los timeouts para limpiarlos */
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    // Reinicia visual al (re)montar
    setStars([])
    setIsForming(true)

    let delay = 0
    CONSTELLATION_STARS.forEach((star, index) => {
      const t = window.setTimeout(() => {
        setStars((prev) => [...prev, star])
        if (index === CONSTELLATION_STARS.length - 1) {
          const t2 = window.setTimeout(() => setIsForming(false), 500)
          timeoutsRef.current.push(t2)
        }
      }, delay)
      timeoutsRef.current.push(t)
      delay += 300
    })

    return () => {
      // Solo limpia recursos. No hagas setState aquí (Strict Mode).
      timeoutsRef.current.forEach((id) => clearTimeout(id))
      timeoutsRef.current = []
    }
  }, [])

  useEffect(() => {
    const update = () => setModalPlanetSize(getModalPlanetSize())
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const handleStarClick = (star: Star) => {
    if (star.isSpecial) onLetterClick()
    else setSelectedStar(star)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {stars.map((star, index) => (
        <div
          key={star.id}
          className={`absolute transition-all duration-500 ${
            isForming ? "scale-0 opacity-0" : "scale-100 opacity-100"
          } ${star.isSpecial ? "animate-pulse" : ""} ${selectedStar?.id === star.id ? "drop-shadow-[0_0_24px_rgba(199,184,255,0.6)]" : ""}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: "translate(-50%, -50%)",
            transitionDelay: `${index * 100}ms`,
          }}
        >
          <PlanetButton
            size={Math.max(16, Math.round(star.size + (star.isSpecial ? 12 : 6)))}
            base={palette[index % palette.length].base}
            glow={star.isSpecial ? "rgba(199,184,255,0.8)" : palette[index % palette.length].glow}
            withRing={!!star.isSpecial}
            /** mejoras visuales */
            atmosphere={!!star.isSpecial}
            rimLight={!!star.isSpecial}
            clouds={!!star.isSpecial}       // puedes poner false si lo prefieres liso
            withMoon={!!star.isSpecial}
            ringTiltDeg={-22}               // un toque más inclinado
            brightness={star.brightness}
            title={star.title}
            onClick={() => handleStarClick(star)}
            className="focus-visible:ring-cyan-300/80"
          />

          {/* Tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-card/90 backdrop-blur-sm rounded text-xs text-card-foreground opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {star.title}
          </div>
        </div>
      ))}

      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {stars.length > 1 &&
          stars.map((star, index) => {
            if (index === stars.length - 1) return null
            const nextStar = stars[index + 1]
            return (
              <line
                key={`line-${index}`}
                x1={`${star.x}%`}
                y1={`${star.y}%`}
                x2={`${nextStar.x}%`}
                y2={`${nextStar.y}%`}
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="1"
                className="animate-pulse"
              />
            )
          })}
      </svg>

      {!isForming && (
        <div className="absolute inset-x-0 bottom-0 pb-5">
          {/* Contraste suave detrás */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f24]/95 via-[#0a0f24]/60 to-transparent" />

          <div className="mx-auto flex justify-center">
            {/* CARD compacta (se ajusta al contenido) */}
            <div className="relative inline-flex w-fit max-w-[min(92vw,920px)] flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md shadow-2xl shadow-black/40 ring-1 ring-white/10">

              {/* Esquinas brillito */}
              <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_10px_theme(colors.cyan.300)]" />
              <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-fuchsia-300/80 shadow-[0_0_10px_theme(colors.fuchsia.300)]" />
              <span className="pointer-events-none absolute -left-1.5 -bottom-1.5 h-2 w-2 rounded-full bg-indigo-300/80 shadow-[0_0_10px_theme(colors.indigo.300)]" />
              <span className="pointer-events-none absolute -right-1.5 -bottom-1.5 h-2 w-2 rounded-full bg-violet-300/80 shadow-[0_0_10px_theme(colors.violet.300)]" />

              {/* Línea 1 */}
              <div className="flex items-center justify-center gap-3 text-center">
                {/* bullets estrellas */}
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300/50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_theme(colors.cyan.300)]" />
                </span>

                <p className="text-[13px] sm:text-sm font-medium text-white/90 whitespace-pre-wrap">
                  Haz clic en cada estrella para descubrir un mensaje especial
                </p>

                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-300/50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_10px_theme(colors.fuchsia.300)]" />
                </span>
              </div>

              {/* separador finito con “meteorito” */}
              <div className="relative mx-auto h-px w-40 bg-gradient-to-r from-transparent via-white/35 to-transparent">
                <span className="absolute left-1/2 -translate-x-1/2 -top-[2px] h-[2px] w-8 animate-pulse bg-gradient-to-r from-transparent via-white to-transparent rounded-full" />
              </div>

              {/* Línea 2 */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <p className="text-[12px] sm:text-xs text-white/85">
                  <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text font-semibold text-transparent">
                    La estrella más brillante
                  </span>{" "}
                  tiene una sorpresa especial para ti
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    <Dialog open={!!selectedStar} onOpenChange={() => setSelectedStar(null)}>

  <DialogContent
    className="
      fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
      w-[min(92vw,580px)] max-h-[85vh] overflow-hidden
      rounded-3xl border border-white/10
      bg-gradient-to-b from-slate-900/70 to-slate-900/40
      backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]
      ring-1 ring-white/10
      px-6 py-7 sm:px-8 sm:py-9
    "
  >
    {/* Aura detrás del modal */}
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-10 -z-10"
      style={{
        background:
          "radial-gradient(60% 60% at 50% 0%, rgba(147,197,253,0.18) 0%, rgba(99,102,241,0.16) 40%, rgba(2,6,23,0) 70%)",
        filter: "blur(10px)",
      }}
    />

    {(() => {
      const tone = getToneFor(selectedStar?.id)
      const isSpecial = !!selectedStar?.isSpecial

      return (
        <>
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${tone.base}, #ffffff 55%, ${tone.base})`,
                textShadow: `0 0 18px ${tone.glow}`,
              }}
            >
              {selectedStar?.title}
            </DialogTitle>
            <p className="text-sm text-white/70">Toca el planeta para sentir su brillo ✨</p>
          </DialogHeader>

          {/* Planeta grande */}
          <div className="relative mx-auto mt-3 mb-4 flex items-center justify-center">
            {/* pedestal suave para que no “corte” el borde */}
            <div className="absolute bottom-2 h-4 w-40 rounded-full bg-black/40 blur-md" />
            <PlanetButton
              size={112}
              base={tone.base}
              glow={tone.glow}
              withRing={isSpecial}
              atmosphere
              rimLight
              clouds={isSpecial}
              withMoon={isSpecial}
              ringTiltDeg={-22}
              title={selectedStar?.title}
              onClick={() => {}}
              className="focus-visible:ring-cyan-300/80"
            />
          </div>

          {/* Separador cometa */}
          <div className="relative mx-auto my-2 h-px w-44 bg-gradient-to-r from-transparent via-white/25 to-transparent">
            <span className="absolute left-1/2 -translate-x-1/2 -top-[2px] h-[2px] w-12 animate-pulse bg-gradient-to-r from-transparent via-white to-transparent rounded-full" />
          </div>

          {/* Mensaje */}
          <p className="mx-auto max-w-[46ch] text-center text-base leading-relaxed text-white/90">
            {selectedStar?.message}
          </p>

          {/* Botón */}
          <div className="mt-7 flex justify-center">
            <Button
              onClick={() => setSelectedStar(null)}
              className="px-6 py-2 rounded-full text-sm font-semibold text-slate-900 shadow-[0_8px_30px_rgba(99,102,241,0.35)] transition-all"
              style={{
                backgroundImage: `linear-gradient(90deg, ${tone.base}, ${tone.glow.replace("0.55","0.95")})`,
              }}
            >
              Cerrar
            </Button>
          </div>
        </>
      )
    })()}
  </DialogContent>
</Dialog>

    </div>
  )
}
