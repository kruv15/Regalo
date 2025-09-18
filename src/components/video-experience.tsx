"use client";

import { useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { ParticleSystem } from "./particle-system";
import { FireworksSystem } from "./fireworks-system";

interface VideoExperienceProps {
  onComplete?: () => void;
}

export function VideoExperience({ onComplete }: VideoExperienceProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const MEGA_URL ="https://mega.nz/file/dnhy1AgQ#B33hC-KbMLSdM4mnk_FgHIdAcOBE7LzbRBFidR2kedg";

  const handleVideoReveal = () => {
    setShowVideo(true);
    // No mostramos el mensaje automáticamente.
  };

  const handleVideoEnded = () => {
    setShowFinalMessage(true);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo */}
      <ParticleSystem type="sparkles" count={50} />
      <FireworksSystem isActive={showFinalMessage} intensity={3} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Título */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Tu Video Especial
            </h1>
            <p className="text-base sm:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
              Un mensaje nacido del corazón, viajando por el universo hasta ti en tu día más especial.
            </p>
          </div>

          {/* Botón reproducir */}
          {!showVideo && (
            <div className="space-y-4 mt-8">
              <Button
                onClick={handleVideoReveal}
                onMouseMove={(e) => {
                  (e.currentTarget as HTMLElement).style.setProperty(
                    "--mx",
                    `${e.nativeEvent.offsetX}px`
                  );
                }}
                className="relative rounded-2xl px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold text-white
                           bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                           shadow-[0_18px_50px_-15px_rgba(245,158,11,0.55)]
                           transition-all duration-300 hover:brightness-110 active:translate-y-[1px]
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <span
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(140px 140px at var(--mx,50%) 0%, rgba(245,158,11,0.35), transparent 60%)",
                  }}
                />
                <span className="relative z-10">🎥 Reproducir Video Especial 🎥</span>
              </Button>

              <p className="text-sm text-slate-400">Este es mi regalo más sincero para ti</p>
            </div>
          )}

          {/* Contenedor del video */}
          {showVideo && (
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.45)]">
                <video
                  ref={videoRef}
                  className="h-full w-full object-contain bg-black cursor-pointer"
                  src={MEGA_URL}
                  controls
                  playsInline
                  preload="metadata"
                  onLoadedData={handleVideoLoad}
                  onEnded={handleVideoEnded}
                  onClick={() => {
                    window.open(MEGA_URL, "_blank"); // 👈 si hace click, abre MEGA
                  }}
                />
                {!videoLoaded && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-white/90">Cargando tu sorpresa...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón para abrir el popup del mensaje final */}
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => window.open(MEGA_URL, "_blank")}
                  className="mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl px-5 py-2"
                >
                  🔗 Ver en MEGA
                </Button>
                <Button
                  onClick={() => setShowFinalMessage(true)}
                  onMouseMove={(e) => {
                    (e.currentTarget as HTMLElement).style.setProperty(
                      "--mx",
                      `${e.nativeEvent.offsetX}px`
                    );
                  }}
                  className="relative rounded-2xl px-6 py-3 text-sm sm:text-base font-semibold text-white
                             bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                             shadow-[0_18px_50px_-15px_rgba(245,158,11,0.55)]
                             transition-all duration-300 hover:brightness-110 active:translate-y-[1px]
                             focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  <span
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(120px 120px at var(--mx,50%) 0%, rgba(245,158,11,0.35), transparent 60%)",
                    }}
                  />
                  <span className="relative z-10">✨ Mostrar Mensaje Final ✨</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL del mensaje final */}
      {showFinalMessage && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          {/* Backdrop clicable */}
          <button
            aria-label="Cerrar"
            onClick={() => setShowFinalMessage(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-3xl">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md p-8 sm:p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transform transition-all duration-200">
              <h2 className="text-center text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Feliz Cumpleaños 26
              </h2>

              <div className="mt-5 space-y-4 text-center">
                <p className="text-slate-100/90 text-base sm:text-lg leading-relaxed">
                  Que este nuevo año de vida esté lleno de momentos mágicos, sueños
                  cumplidos y todo el amor que mereces.
                </p>
                <p className="text-slate-100/90 text-base sm:text-lg leading-relaxed">
                  Eres una estrella brillante en este universo, y hoy celebramos la
                  luz única que aportas al mundo.
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-2 text-2xl">
                <span className="animate-bounce">🌟</span>
                <span className="animate-bounce" style={{ animationDelay: "120ms" }}>
                  💖
                </span>
                <span className="animate-bounce" style={{ animationDelay: "240ms" }}>
                  🎂
                </span>
                <span className="animate-bounce" style={{ animationDelay: "360ms" }}>
                  🎉
                </span>
                <span className="animate-bounce" style={{ animationDelay: "480ms" }}>
                  ✨
                </span>
              </div>

              <p className="mt-6 text-center text-slate-200/90 font-semibold">
                Con todo mi amor en tu día especial 💕
              </p>

              {onComplete && (
                <div className="mt-10 flex justify-center">
                  <Button
                    onClick={() => {
                      onComplete();
                      setShowFinalMessage(false);
                    }}
                    onMouseMove={(e) => {
                      (e.currentTarget as HTMLElement).style.setProperty(
                        "--mx",
                        `${e.nativeEvent.offsetX}px`
                      );
                    }}
                    className="relative rounded-2xl px-8 sm:px-10 py-4 sm:py-5
                               text-lg sm:text-xl font-semibold text-white
                               bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                               shadow-[0_18px_50px_-15px_rgba(245,158,11,0.55)]
                               transition-all duration-300 hover:brightness-110 active:translate-y-[1px]
                               focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-transparent"
                  >
                    <span
                      className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(140px 140px at var(--mx,50%) 0%, rgba(245,158,11,0.35), transparent 60%)",
                      }}
                    />
                    <span className="relative z-10">🌟 Finalizar Experiencia 🌟</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
