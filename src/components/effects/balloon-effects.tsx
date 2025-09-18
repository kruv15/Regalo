"use client"

import type { ReactNode } from "react"

interface BalloonEffectsProps {
  children: ReactNode
}

export function BalloonEffects({ children }: BalloonEffectsProps) {
  return (
    <>
      <style jsx global>{`
        /* Separated balloon-specific effects into independent component */
        .balloon-3d {
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateX(-10deg) rotateY(5deg);
          transition: transform 0.3s ease;
        }

        .balloon-3d:hover {
          transform: perspective(1000px) rotateX(-15deg) rotateY(10deg) scale(1.05);
        }

        @keyframes balloon-float {
          0%, 100% {
            transform: perspective(1000px) rotateX(-10deg) rotateY(5deg) translateY(0px);
          }
          50% {
            transform: perspective(1000px) rotateX(-10deg) rotateY(5deg) translateY(-15px);
          }
        }

        .balloon-float {
          animation: balloon-float 4s ease-in-out infinite;
        }

        @keyframes balloon-pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        .balloon-pop {
          animation: balloon-pop 0.6s ease-out forwards;
        }
      `}</style>
      {children}
    </>
  )
}
