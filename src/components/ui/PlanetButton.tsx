"use client"

import * as React from "react"

export type PlanetButtonProps = {
  size?: number
  base?: string
  glow?: string
  withRing?: boolean
  title?: string
  brightness?: number
  onClick?: () => void
  className?: string
  style?: React.CSSProperties

  /** MEJORAS VISUALES */
  atmosphere?: boolean       // halo suave alrededor
  rimLight?: boolean         // brillo en el borde iluminado
  clouds?: boolean           // bandas/nubes sutiles
  withMoon?: boolean         // luna orbitando (ideal para especial)
  ringTiltDeg?: number       // inclinación del anillo
}

export const PlanetButton = React.memo(
  React.forwardRef<HTMLButtonElement, PlanetButtonProps>(function PlanetButton(
    {
      size = 18,
      base = "#9be7ff",
      glow = "rgba(155,231,255,0.55)",
      withRing = false,
      title = "Planeta",
      brightness = 1,
      onClick,
      className = "",
      style,
      atmosphere = false,
      rimLight = false,
      clouds = false,
      withMoon = false,
      ringTiltDeg = -18,
    },
    ref
  ) {
    const gid = React.useId()
    const rimId = React.useId()
    const blurId = React.useId()
    const shadeId = React.useId()

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        className={[
          "relative inline-flex select-none items-center justify-center rounded-full",
          "outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80",
          "transition-transform duration-300 ease-out hover:scale-110 active:scale-95",
          className,
        ].join(" ")}
        style={{
          width: size,
          height: size,
          opacity: brightness,
          filter: `drop-shadow(0 0 6px ${glow}) drop-shadow(0 0 14px ${glow})`,
          ...style,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" className="block">
          <defs>
            {/* coloración base esférica */}
            <radialGradient id={gid} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor={base} />
              <stop offset="100%" stopColor="#0b1020" />
            </radialGradient>

            {/* brillo de borde (rim) */}
            <linearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.0" />
              <stop offset="35%" stopColor="#fff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.0" />
            </linearGradient>

            {/* blur para atmósfera */}
            <filter id={blurId}>
              <feGaussianBlur stdDeviation="3" />
            </filter>

            {/* sombra (terminador) */}
            <radialGradient id={shadeId} cx="70%" cy="40%" r="70%">
              <stop offset="40%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </radialGradient>
          </defs>

          {/* ATMÓSFERA (opcional) */}
          {atmosphere && (
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke={glow}
              strokeOpacity="0.65"
              strokeWidth="3.5"
              filter={`url(#${blurId})`}
            />
          )}

          {/* ANILLO (opcional) */}
          {withRing && (
            <g transform={`rotate(${ringTiltDeg} 50 50)`}>
              <ellipse
                cx="50"
                cy="55"
                rx="60"
                ry="26"
                fill="none"
                stroke={glow}
                strokeOpacity="0.6"
                strokeWidth="6"
              />
              <ellipse
                cx="50"
                cy="55"
                rx="60"
                ry="26"
                fill="none"
                stroke="white"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
            </g>
          )}

          {/* DISCO principal */}
          <circle cx="50" cy="50" r="45" fill={`url(#${gid})`} />

          {/* SOMBRA/TERMINADOR para volumen */}
          <circle cx="50" cy="50" r="45" fill={`url(#${shadeId})`} />

          {/* NUBES / BANDAS sutiles (opcional) */}
          {clouds && (
            <>
              <ellipse cx="50" cy="38" rx="36" ry="6" fill="#fff" opacity="0.06" />
              <ellipse cx="52" cy="54" rx="30" ry="4.5" fill="#fff" opacity="0.05" />
              <ellipse cx="48" cy="66" rx="24" ry="3.5" fill="#fff" opacity="0.04" />
            </>
          )}

          {/* BRILLO ESPECULAR animado */}
          <circle cx="35" cy="30" r="10" fill="white" opacity="0.22">
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3.2s" repeatCount="indefinite" />
          </circle>

          {/* RIM LIGHT (opcional) */}
          {rimLight && (
            <path
              d="M8,50a42,42 0 0,1 84,0"
              fill="none"
              stroke={`url(#${rimId})`}
              strokeWidth="2"
              transform="translate(0,-2)"
              opacity="0.8"
            />
          )}

          {/* ARO FINO de contraste */}
          <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.25" className="mix-blend-screen" />

          {/* ANILLO/PING al hover */}
          <g className="ping-ring">
            <circle cx="50" cy="50" r="40" fill="none" stroke={glow} strokeWidth="2" opacity="0">
              <animate attributeName="r" values="40;54;40" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.35;0" dur="2.6s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* LUNA ORBITANDO (opcional) */}
          {withMoon && (
            <g>
              <circle cx="50" cy="50" r="60" fill="none" opacity="0" />
              <g>
                <circle cx="50" cy="-10" r="6" fill="#e8ecff" opacity="0.95" />
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
              </g>
            </g>
          )}
        </svg>

        {/* estilos locales */}
        <style jsx>{`
          button:hover svg { animation: planet-wobble 1.8s ease-in-out infinite; }
          .ping-ring { opacity: 0; transition: opacity .25s ease-out; }
          button:hover .ping-ring { opacity: 1; }
          @keyframes planet-wobble { 0%,100%{transform:rotate(0)} 50%{transform:rotate(2.5deg)} }
        `}</style>
      </button>
    )
  })
)
