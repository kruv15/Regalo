"use client";

import React, { useId } from "react";

export type OrnamentalHeaderProps = {
  title: string;
  subtitle?: string;
  /** "rose" (rosado cálido) | "sakura" (rosa suave) | "cosmic" (violeta/azul) */
  palette?: "rose" | "sakura" | "cosmic";
  /** Tamaño del medallón (px) */
  size?: number;
  showSparkles?: boolean;
  reduceMotion?: boolean;
  className?: string;
  titleVariant?: "gradient" | "solid"; 
  titleColor?: string;  
  titleClassName?: string;
};

export function OrnamentalHeader({
  title,
  subtitle,
  palette = "rose",
  size = 52,
  showSparkles = true,
  reduceMotion = false,
  className = "",
  titleVariant = "gradient",
  titleColor,
  titleClassName = "",
}: OrnamentalHeaderProps) {
  const uid = useId();
  const pal = getPalette(palette);
  const isSolid = titleVariant === "solid";
  const solidColor = titleColor ?? undefined;

  return (
    <div className={`mb-6 relative ${className}`}>

      {/* Ornamentación */}
      <div className="mt-4 relative flex items-center justify-center">
        <Swash side="left" colorA={pal.lineA} colorB={pal.lineB} uid={uid} />
        <FlowerMedallion
          size={size}
          pal={pal}
          twinkle={showSparkles}
          reduceMotion={reduceMotion}
        />
        <Swash side="right" colorA={pal.lineA} colorB={pal.lineB} uid={uid} />
      </div>
    </div>
  );
}

/* ---------------- Paletas ---------------- */

type Pal = {
  titleGrad: string;
  lineA: string; lineB: string;
  petalA: string; petalB: string;
  coreA: string; coreB: string;
  halo: string;
  sparkle: string;
};

function getPalette(kind: "rose" | "sakura" | "cosmic"): Pal {
  switch (kind) {
    case "cosmic":
      return {
        titleGrad: "linear-gradient(90deg,#0ea5e9 0%,#6366f1 50%,#7c3aed 100%)",
        lineA: "#93c5fd", lineB: "#a78bfa",
        petalA: "#8b5cf6", petalB: "#60a5fa",
        coreA: "#fff", coreB: "#a5b4fc",
        halo: "rgba(99,102,241,.35)",
        sparkle: "#ffffff",
      };
    case "sakura":
      return {
        titleGrad: "linear-gradient(90deg,#f9a8d4 0%,#f472b6 50%,#fb7185 100%)",
        lineA: "#fbcfe8", lineB: "#f9a8d4",
        petalA: "#fce7f3", petalB: "#f9a8d4",
        coreA: "#fff7f9", coreB: "#f472b6",
        halo: "rgba(249,168,212,.38)",
        sparkle: "#fff",
      };
    default:
      return {
        titleGrad: "linear-gradient(90deg,#ec4899 0%,#f472b6 45%,#fb7185 100%)",
        lineA: "#f9a8d4", lineB: "#fb7185",
        petalA: "#ff88b4", petalB: "#ff4d88",
        coreA: "#fff7fb", coreB: "#ff9ac2",
        halo: "rgba(255,77,136,.35)",
        sparkle: "#fff",
      };
  }
}

/* ---------------- Medallón floral ---------------- */

function FlowerMedallion({
  size, pal, twinkle, reduceMotion,
}: { size: number; pal: Pal; twinkle: boolean; reduceMotion: boolean }) {

  return (
    <span
      className={`relative inline-flex items-center justify-center ${reduceMotion ? "" : "animate-[float_4s_ease-in-out_infinite]"}`}
      style={{
        width: size, height: size,
        filter: `drop-shadow(0 0 10px ${pal.halo})`,
      }}
    >
      {/* halo */}
      <span
        aria-hidden
        className="absolute inset-[-14px] rounded-full"
        style={{
          background: `radial-gradient(60% 60% at 50% 50%, ${pal.halo}, transparent 70%)`,
        }}
      />

      {/* Flor SVG: 5 pétalos + centro */}
      <svg
        width={size} height={size} viewBox="0 0 100 100"
        className={reduceMotion ? "" : "animate-[bloom_2.8s_ease-in-out_infinite_alternate]"}
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="petalGrad" cx="50%" cy="35%">
            <stop offset="0%" stopColor={pal.petalA} stopOpacity="1" />
            <stop offset="100%" stopColor={pal.petalB} stopOpacity="1" />
          </radialGradient>
          <radialGradient id="coreGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor={pal.coreA} />
            <stop offset="100%" stopColor={pal.coreB} />
          </radialGradient>
        </defs>

        {/* pétalo base (clonado y rotado) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d="M50 18 C 62 20, 72 30, 70 42 C 68 56, 56 62, 50 80 C 44 62, 32 56, 30 42 C 28 30, 38 20, 50 18 Z"
            fill="url(#petalGrad)"
            transform={`rotate(${i * 72} 50 50)`}
            opacity="0.96"
            style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,.12))" }}
          />
        ))}

        {/* centro */}
        <circle cx="50" cy="50" r="14" fill="url(#coreGrad)" />
        {/* pistilos (puntos) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i * 36) * (Math.PI / 180);
          const x = 50 + Math.cos(a) * 20;
          const y = 50 + Math.sin(a) * 20;
          return <circle key={i} cx={x} cy={y} r="1.8" fill={pal.sparkle} opacity=".9" />;
        })}
        {/* brillo */}
        <ellipse cx="44" cy="44" rx="6" ry="3" fill="#fff" opacity=".45" />
      </svg>

      {/* chispas alrededor */}
      {twinkle &&
        [
          { x: "75%", y: "-8%", d: 0 },
          { x: "6%", y: "78%", d: 150 },
          { x: "92%", y: "64%", d: 300 },
        ].map((s, i) => (
          <Sparkle key={i} left={s.x} top={s.y} delay={s.d} color={pal.sparkle} paused={reduceMotion} />
        ))}
    </span>
  );
}

function Sparkle({
  left, top, delay = 0, color = "#fff", paused = false,
}: { left: string; top: string; delay?: number; color?: string; paused?: boolean; }) {
  return (
    <svg
      viewBox="0 0 24 24" width={10} height={10}
      className={paused ? "" : "animate-pulse"}
      style={{ position: "absolute", left, top, animationDuration: "1200ms", animationDelay: `${delay}ms` }}
    >
      <path d="M12 2l2.2 4.6L19 9l-4.8.9L12 15l-2.2-5.1L5 9l4.8-2.4L12 2z" fill={color} opacity=".95" />
    </svg>
  );
}

/* ---------------- Filigranas laterales ---------------- */

function Swash({
  side, colorA, colorB, uid,
}: { side: "left" | "right"; colorA: string; colorB: string; uid: string }) {
  const gradId = `sw-${side}-${uid}`;
  const flip = side === "right" ? "" : "scale(-1,1)";
  return (
    <svg
      aria-hidden width="200" height="30" viewBox="0 0 200 30"
      className="hidden sm:block" style={{ transform: flip }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="35%" stopColor={colorA} />
          <stop offset="65%" stopColor={colorB} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      <path
        d="M6 15 C 36 15, 48 15, 66 15 S 110 7, 132 15 S 168 23, 194 15"
        fill="none" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" opacity=".95"
      />
      <path
        d="M24 15c6-6 12-6 18 0M50 15c6 6 12 6 18 0M152 15c-6 6-12 6-18 0"
        fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinecap="round" opacity=".85"
      />
      {[18, 58, 98, 138, 178].map((x, i) => (
        <circle key={i} cx={x} cy="15" r="1.6" fill="white" opacity=".85" />
      ))}
    </svg>
  );
}
