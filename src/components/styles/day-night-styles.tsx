"use client"

import type { ReactNode } from "react"

interface DayNightStylesProps {
  children: ReactNode
  isNight: boolean
}

export function DayNightStyles({ children, isNight }: DayNightStylesProps) {
  return (
    <>
      <style jsx global>{`
        /* Separated day/night specific styles for independent control */
        .day-sky {
          background: linear-gradient(135deg, #87ceeb 0%, #98d8e8 50%, #b6e5f0 100%);
        }

        .night-sky {
          background: linear-gradient(135deg, #0b1224 0%, #0f1a33 28%, #14213f 58%, #0b1224 100%);
        }

        .cosmic-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%);
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        /* Dynamic styles based on time */
        ${
          isNight
            ? `
          .cosmic-glow {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 60px rgba(245, 158, 11, 0.1);
          }

          .cosmic-glow-enhanced {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(168, 85, 247, 0.4), 0 0 60px rgba(245, 158, 11, 0.3), 0 0 80px rgba(236, 72, 153, 0.2);
          }

          .star-glow {
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.4));
          }
        `
            : `
          .cosmic-glow {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.2), 0 0 20px rgba(168, 85, 247, 0.1);
          }

          .cosmic-glow-enhanced {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.3), 0 0 25px rgba(168, 85, 247, 0.2);
          }

          .star-glow {
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
          }
        `
        }

        @media (max-width: 768px) {
          .cosmic-glow,
          .cosmic-glow-enhanced {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.4), 0 0 20px rgba(168, 85, 247, 0.2);
          }

          .star-glow {
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
          }
        }
      `}</style>
      {children}
    </>
  )
}
