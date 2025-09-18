"use client"

import type { ReactNode } from "react"

interface CosmicAnimationsProps {
  children: ReactNode
}

export function CosmicAnimations({ children }: CosmicAnimationsProps) {
  return (
    <>
      <style jsx global>{`
        /* Moved all cosmic animations to independent component */
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(168, 85, 247, 0.4);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 40px rgba(245, 158, 11, 0.9), 0 0 60px rgba(245, 158, 11, 0.6);
            transform: scale(1.05);
          }
        }

        @keyframes shooting-star {
          0% {
            transform: translateX(-100px) translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes nebula-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        @keyframes text-pulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(245, 158, 11, 0.4);
          }
        }

        .twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .glow {
          animation: glow 2s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .shooting-star {
          animation: shooting-star 3s linear infinite;
        }

        .gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease-in-out infinite;
        }

        .nebula-pulse {
          animation: nebula-pulse 4s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 1s ease-in forwards;
        }

        .text-pulse {
          animation: text-pulse 2s ease-in-out infinite;
        }

        .animation-delay-0 { animation-delay: 0ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
      {children}
    </>
  )
}
