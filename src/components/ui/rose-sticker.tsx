"use client";

import React from "react";

/** Rosa estilo “sticker” con placa visible sobre fondos claros */
export function RoseSticker({
  size = 28,
  hue = 340,
  className = "",
  style,
  halo = true,          // ← halo detrás para separar del fondo
  elevation = 1,        // 0, 1, 2  (fuerza de sombra)
}: {
  size?: number;
  hue?: number;
  className?: string;
  style?: React.CSSProperties;
  halo?: boolean;
  elevation?: 0 | 1 | 2;
}) {
  const id = React.useId();

  const petal = `hsl(${hue} 85% 62%)`;
  const petalDark = `hsl(${hue} 85% 48%)`;
  const hl = `hsla(${hue} 100% 92% / .9)`;
  const leaf = "hsl(155 45% 35%)";
  const leafLight = "hsl(155 45% 52%)";

  // Sombra exterior según elevación
  const shadowStd = elevation === 2 ? 3.5 : elevation === 1 ? 2.6 : 0;
  const shadowDy = elevation === 2 ? 3 : elevation === 1 ? 2 : 0;
  const shadowOp = elevation === 2 ? 0.28 : elevation === 1 ? 0.22 : 0;

  return (
    <span
      className={`absolute ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
        <defs>
          {/* Placa con gradiente muy leve (blanco→marfil rosado) */}
          <radialGradient id={`${id}-plate`} cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fff4f7" />
          </radialGradient>

          {/* Halo suave detrás */}
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          {/* Sombra exterior */}
          <filter id={`${id}-drop`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy={shadowDy}
              stdDeviation={shadowStd}
              floodColor="#0b1f2a"
              floodOpacity={shadowOp}
            />
          </filter>
        </defs>

        {/* HALO (detrás de la placa) */}
        {halo && shadowStd > 0 && (
          <circle
            cx="32"
            cy="32"
            r="18"
            fill={petal}
            opacity=".10"
            filter={`url(#${id}-glow)`}
          />
        )}

        {/* PLACA / STICKER */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill={`url(#${id}-plate)`}
          stroke="rgba(8,51,68,.20)"   // contorno para separar del fondo
          strokeWidth="1.25"
          filter={shadowStd ? `url(#${id}-drop)` : undefined}
        />
        {/* filete interior brillante */}
        <circle
          cx="32"
          cy="32"
          r="27.6"
          fill="none"
          stroke="rgba(255,255,255,.9)"
          strokeWidth="1.1"
        />

        {/* tallo y hojas */}
        <path
          d="M34 36c0 8 6 12 6 12"
          stroke={leaf}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M36 44c6-2 8-6 8-6c-6-2-10 0-10 0" fill={leafLight} />
        <path d="M30 44c-6-2-8-6-8-6c6-2 10 0 10 0" fill={leafLight} />

        {/* flor */}
        <circle cx="32" cy="28" r="12" fill={petal} />
        <path
          d="M20 28c6-4 18-4 24 0c-3 8-21 8-24 0z"
          fill={petalDark}
          opacity=".35"
        />
        <path
          d="M28 22c2 2 8 2 10 0c-1-3-9-3-10 0z"
          fill={petalDark}
          opacity=".55"
        />
        <circle cx="36" cy="24" r="3.2" fill={hl} />
      </svg>
    </span>
  );
}

/** Cluster listo para esquinas */
export function RoseCorners({
  size = 30,
  hues = [340, 330, 350, 345],
  elevation = 1,
  halo = true,
}: {
  size?: number;
  hues?: [number, number, number, number];
  elevation?: 0 | 1 | 2;
  halo?: boolean;
}) {
  return (
    <>
      <RoseSticker size={size} hue={hues[0]} elevation={elevation} halo={halo}
        style={{ top: 8, left: 8, transform: "rotate(-8deg)" }} />
      <RoseSticker size={size} hue={hues[1]} elevation={elevation} halo={halo}
        style={{ top: 10, right: 13, transform: "rotate(10deg)" }} />
      <RoseSticker size={size} hue={hues[2]} elevation={elevation} halo={halo}
        style={{ bottom: 13, left: 10, transform: "rotate(6deg)" }} />
      <RoseSticker size={size} hue={hues[3]} elevation={elevation} halo={halo}
        style={{ bottom: 13, right: 13, transform: "rotate(-6deg)" }} />
    </>
  );
}
