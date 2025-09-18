"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FireworksSystem } from "./fireworks-system"
import { ConfettiSystem } from "./confetti-system"
import { BalloonEffects } from "./effects/balloon-effects"
import { CosmicAnimations } from "./animations/cosmic-animations"

interface FinalSurpriseProps {
  onVideoReveal: () => void
}

export function FinalSurprise({ onVideoReveal }: FinalSurpriseProps) {
  const [showBalloon, setShowBalloon] = useState(true)
  const [isExploding, setIsExploding] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showVideoButton, setShowVideoButton] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleBalloonClick = () => {
    setIsExploding(true)
    setShowConfetti(true)

    // Hide balloon and show explosion effect
    setTimeout(() => {
      setShowBalloon(false)
      setShowMessage(true)
      setShowFireworks(true)
    }, 500)

    // Show video button after message appears
    setTimeout(() => {
      setShowVideoButton(true)
    }, 3000)
  }

  return (
    <CosmicAnimations>
      <BalloonEffects>
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
          {/* Enhanced particle effects */}
          <FireworksSystem isActive={showFireworks} intensity={8} />
          <ConfettiSystem isActive={showConfetti} duration={8000} intensity={5} />

          {/* Balloon */}
          {showBalloon && (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Tu Regalo Final
              </h2>

              <div
                className={`cursor-pointer transition-all duration-500 ${
                  isExploding ? "balloon-pop" : "balloon-3d balloon-float hover:scale-110"
                }`}
                onClick={handleBalloonClick}
              >
                {/* Enhanced balloon with 3D effect */}
                <div className="relative mx-auto w-48 h-64">
                  {/* Balloon body with enhanced gradient */}
                  <div className="w-48 h-48 bg-gradient-to-br from-pink-300 via-pink-400 to-pink-600 rounded-full shadow-2xl relative overflow-hidden">
                    <div
                      style={{
                        boxShadow:
                          "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 60px rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      {/* Multiple highlights for 3D effect */}
                      <div className="absolute top-6 left-8 w-12 h-16 bg-white/40 rounded-full blur-sm" />
                      <div className="absolute top-12 left-16 w-8 h-10 bg-white/20 rounded-full blur-sm" />
                      <div className="absolute top-20 left-6 w-6 h-8 bg-white/10 rounded-full blur-sm" />

                      {/* Animated sparkles on balloon */}
                      <div className="absolute top-8 right-8 w-2 h-2 bg-white rounded-full animate-ping" />
                      <div className="absolute top-16 right-12 w-1 h-1 bg-white rounded-full animate-ping animation-delay-500" />
                      <div className="absolute top-24 right-6 w-1.5 h-1.5 bg-white rounded-full animate-ping animation-delay-1000" />

                      {/* Gift icon in center with glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl filter drop-shadow-lg">🎁</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced balloon string with curve */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <svg width="4" height="64" className="overflow-visible">
                      <path d="M2 0 Q6 20 2 40 Q-2 50 2 64" stroke="#4a5568" strokeWidth="2" fill="none" />
                    </svg>
                  </div>

                  {/* Balloon knot with shadow */}
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-4 h-5 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-lg" />
                </div>
              </div>

              <p className="text-lg text-slate-300 max-w-md mx-auto animate-pulse">
                🎁 Toca aquí para explotar tu regalo final
              </p>
            </div>
          )}

          {/* Enhanced final message with more effects */}
          {showMessage && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-6">
                {/* Main title with enhanced gradient and glow */}
                <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 bg-clip-text text-transparent gradient-shift">
                  ¡Feliz 26, mi estrella! ✨
                </h1>

                {/* Subtitle with pulsing effect */}
                <h2 className="text-4xl font-bold text-blue-400 animate-pulse">Hoy brillas más que nunca, y el universo entero celebra que existes</h2>

                {/* Enhanced message card */}
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="text-xl text-white leading-relaxed bg-gradient-to-br from-slate-800/90 to-slate-900/70 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20 shadow-2xl">
                    <p className="font-serif text-2xl mb-4 text-yellow-400">✨ Mensaje Especial ✨</p>
                    <p className="leading-relaxed">
                      El cielo, Dios, tu familia y yo agradecemos cada instante de tus 26 años.
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="flex justify-center space-x-4 text-3xl">
                  <span className="animate-bounce animation-delay-0">🌟</span>
                  <span className="animate-bounce animation-delay-200">💖</span>
                  <span className="animate-bounce animation-delay-400">🎉</span>
                  <span className="animate-bounce animation-delay-600">✨</span>
                  <span className="animate-bounce animation-delay-800">🌟</span>
                </div>
              </div>

              {showVideoButton && (
                <div className="animate-fade-in">
                  <Button
                    onClick={onVideoReveal}
                    className="text-xl px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:via-blue-500 hover:to-purple-600 transition-all duration-500 shadow-2xl"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.9), 0 0 60px rgba(245, 158, 11, 0.6)",
                    }}
                  >
                    🎬 Ver tu video especial 🎬
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Enhanced floating hearts with different sizes and speeds */}
          {showMessage && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce opacity-70"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${1 + Math.random() * 2}rem`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                >
                  {["💖", "💕", "💗", "💝", "💘"][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>
          )}

          {/* Additional sparkle effects */}
          {showMessage && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={`sparkle-${i}`}
                  className="absolute text-yellow-300 animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${0.5 + Math.random()}rem`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}
        </div>
      </BalloonEffects>
    </CosmicAnimations>
  )
}
