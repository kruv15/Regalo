"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { ParticleSystem } from "./particle-system"

interface Wish {
  id: number
  text: string
  x: number
  y: number
  isVisible: boolean
}

interface WishesSystemProps {
  onComplete: () => void
}

export function WishesSystem({ onComplete }: WishesSystemProps) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [wishCount, setWishCount] = useState(0)
  const [showFinalButton, setShowFinalButton] = useState(false)

  const wishMessages = [
    "Deseo que todos tus sueños se cumplan ✨",
    "Deseo que tengas salud y alegría 🌸",
    "Deseo que el mundo te regale sonrisas cada día 🌞",
    "Deseo que encuentres magia en cada momento 🌟",
    "Deseo que tu corazón siempre esté lleno de amor 💖",
    "Deseo que cada paso que des te lleve a la felicidad 🦋",
    "Deseo que tus días estén llenos de aventuras hermosas 🌈",
    "Deseo que la vida te sorprenda con cosas maravillosas 🎁",
    "Deseo que tengas la fuerza para alcanzar todas tus metas 💪",
    "Deseo que cada amanecer te traiga nuevas esperanzas 🌅",
    "Deseo que tu luz interior nunca deje de brillar ⭐",
    "Deseo que encuentres paz en cada momento de tu vida 🕊️",
    "Deseo que el universo conspire a tu favor siempre 🌌",
    "Deseo que cada lágrima se convierta en una sonrisa 😊",
    "Deseo que tengas el valor de ser siempre tú misma 🦄",
    "Deseo que cada día sea mejor que el anterior 📈",
    "Deseo que encuentres belleza en las pequeñas cosas 🌺",
    "Deseo que tu alma siempre esté en calma 🧘‍♀️",
    "Deseo que tengas personas que te amen incondicionalmente 👥",
    "Deseo que cada desafío te haga más fuerte 💎",
    "Deseo que tu risa sea contagiosa para todos 😄",
    "Deseo que encuentres tu propósito y lo vivas plenamente 🎯",
    "Deseo que cada noche tengas sueños hermosos 🌙",
    "Deseo que la abundancia llegue a tu vida en todas sus formas 🌾",
    "Deseo que siempre tengas motivos para celebrar 🎉",
  ]

  const generateWish = () => {
    const randomMessage = wishMessages[Math.floor(Math.random() * wishMessages.length)]
    const newWish: Wish = {
      id: Date.now(),
      text: randomMessage,
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: Math.random() * 60 + 20, // 20% to 80% of screen height
      isVisible: true,
    }

    setWishes((prev) => [...prev, newWish])
    setWishCount((prev) => prev + 1)

    // Remove wish after animation
    setTimeout(() => {
      setWishes((prev) => prev.filter((wish) => wish.id !== newWish.id))
    }, 4000)

    // Show final button after 5 wishes
    if (wishCount >= 4) {
      setTimeout(() => {
        setShowFinalButton(true)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced night sky with more shooting stars for wishes */}
      <ParticleSystem type="shooting-stars" count={8} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mis Deseos para Ti
            </h1>
            <p className="text-slate-300/90 text-base sm:text-lg">
              Cada estrella fugaz lleva un deseo especial
            </p>
          </div>

          {/* Wish button */}
          <div className="mt-8">
            <Button
              onClick={generateWish}
              onMouseMove={(e) => {
                (e.currentTarget as HTMLElement).style.setProperty("--mx", `${e.nativeEvent.offsetX}px`);
              }}
              className="relative rounded-xl px-7 sm:px-8 py-3.5 sm:py-4 text-lg sm:text-xl font-semibold text-white
                        bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                        shadow-[0_12px_36px_-10px_rgba(168,85,247,0.65)]
                        transition-all duration-300 hover:brightness-110 active:translate-y-[1px]
                        focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <span
                className="pointer-events-none absolute -inset-px rounded-xl opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(120px 120px at var(--mx,50%) 0%, rgba(168,85,247,0.45), transparent 60%)",
                }}
              />
              <span className="relative z-10">🌠 Generar un deseo 🌠</span>
            </Button>
          </div>

          {/* Wish counter */}
          <p className="mt-3 text-sm text-slate-400">
            Deseos generados: <span className="text-pink-400 font-semibold">{wishCount}</span>
          </p>

          {/* Final button */}
          {showFinalButton && (
            <div className="mt-10 animate-[wish-pop_400ms_ease-out]">
              <Button
                onClick={onComplete}
                className="rounded-xl px-7 py-3.5 text-lg font-semibold text-white
                          bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500
                          shadow-[0_12px_36px_-10px_rgba(59,130,246,0.6)]
                          hover:brightness-110"
              >
                Tu última sorpresa 💖
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Floating wishes */}
      {wishes.map((wish) => (
        <div
          key={wish.id}
          className="absolute pointer-events-none animate-fade-in"
          style={{
            left: `${wish.x}%`,
            top: `${wish.y}%`,
            transform: "translate(-50%, -50%)",
            animation: "fade-in 0.5s ease-out, float 3s ease-in-out infinite, fade-out 1s ease-in 3s forwards",
          }}
        >
          <div className="rounded-xl border border-fuchsia-400/30 bg-slate-950/70 backdrop-blur-md 
                  shadow-[0_0_30px_rgba(168,85,247,0.35)] px-4 py-3 max-w-xs">
            <p className="text-slate-100 text-center text-sm sm:text-base">{wish.text}</p>
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center animate-fade-in">
        <p className="text-sm text-muted-foreground">
          Cada deseo es único y especial, como tú. Puedes generar tantos como quieras.
        </p>
      </div>
    </div>
  )
}
