"use client"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CountdownTimer } from "@/components/countdown-timer"
import { Constellation } from "@/components/constellation"
import { AnimatedLetter } from "@/components/animated-letter"
import { WishesSystem } from "@/components/wishes-system"
import { FinalSurprise } from "@/components/final-surprise"
import { VideoExperience } from "@/components/video-experience"

type AppState = "countdown" | "constellation" | "letter" | "wishes" | "final-surprise" | "video" | "complete"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("countdown")
  const [showLetter, setShowLetter] = useState(false)
  
  const handleCountdownComplete = () => {
    setAppState("constellation")
  }

  const handleLetterClick = () => {
    setShowLetter(true)
  }

  const handleLetterComplete = () => {
    setShowLetter(false)
    setAppState("wishes")
  }

  const handleLetterClose = () => {
    setShowLetter(false)
  }

  const handleWishesComplete = () => {
    setAppState("final-surprise")
  }

  const handleVideoReveal = () => {
    setAppState("video")
  }

  const handleExperienceComplete = () => {
    setAppState("complete")
  }

  return (
    <main className="min-h-screen relative">
      <CosmicBackground overrideTime="23:48" />

      <div className="relative z-30">
        {appState === "countdown" && (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto">
              <CountdownTimer onComplete={handleCountdownComplete} />
            </div>
          </div>
        )}

        {appState === "constellation" && (
          <div className="min-h-svh">
            {/* Título arriba */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-20">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                Tu Constelación Especial
              </h2>
              <p className="text-lg text-slate-300">
                Las estrellas se han alineado para formar algo único para ti
              </p>
            </div>

            {/* Constelación (interactiva) */}
            <div className="relative z-10">
              <Constellation onLetterClick={handleLetterClick} />
            </div>
          </div>
        )}

        {appState === "wishes" && <WishesSystem onComplete={handleWishesComplete} />}

        {appState === "final-surprise" && <FinalSurprise onVideoReveal={handleVideoReveal} />}

        {appState === "video" && <VideoExperience onComplete={handleExperienceComplete} />}

        {appState === "complete" && (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-shift">
                  ¡Gracias por vivir esta experiencia cósmica!
                </h1>

                <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 border border-blue-500/30 shadow-2xl">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-yellow-400">El Universo de Tu Vida</h2>
                    <p className="text-lg text-white leading-relaxed">
                      Espero que cada instante te haya recordado lo maravillosa y valiosa que eres.
                    </p>
                    <p className="text-lg text-white leading-relaxed">
                      Que cada día de tus 26 años sea tan luminoso como las estrellas que acabas de descubrir.
                    </p>

                    <div className="flex justify-center space-x-2 text-3xl pt-4">
                      <span className="animate-bounce animation-delay-0">🌟</span>
                      <span className="animate-bounce animation-delay-200">💖</span>
                      <span className="animate-bounce animation-delay-400">🎂</span>
                      <span className="animate-bounce animation-delay-600">🎉</span>
                      <span className="animate-bounce animation-delay-800">✨</span>
                    </div>

                    <p className="text-yellow-400 font-bold text-xl pt-4">¡Feliz Cumpleaños 26! 🌟🎈</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animated Letter Modal */}
      <AnimatedLetter isOpen={showLetter} onClose={handleLetterClose} onComplete={handleLetterComplete} />
    </main>
  )
}
