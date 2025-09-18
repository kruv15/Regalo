"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { RoseCorners } from "./ui/rose-sticker";
import { OrnamentalHeader } from "./ui/ornamental-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

interface AnimatedLetterProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  message?: string;
}

type CartaEstado = "closed" | "lifting" | "opened" | "closing";

export function AnimatedLetter({
  isOpen,
  onClose,
  onComplete,
  message,
}: AnimatedLetterProps) {
  // ====== Estado sobre / carta ======
  const [flapOpen, setFlapOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<CartaEstado>("closed");
  const [bump, setBump] = useState<0 | 1 | 2>(0);

  // ====== Refs / timers ======
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  // ====== Centro (dx, dy, scale) ======
  const [centerDX, setCenterDX] = useState(0);
  const [centerDY, setCenterDY] = useState(0);
  const [centerScale, setCenterScale] = useState(1);

  // ====== Typing ======
  const [typedText, setTypedText] = useState(""); // lo que se ve
  const [isTyping, setIsTyping] = useState(false);
  const [showCTA, setShowCTA] = useState(false); // muestra botón al final

  // ====== Reduced motion ======
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // ====== Mensaje ======
  const defaultMessage = `Querida Estrella,

    Hoy celebramos tus 26 años de vida, 26 años en los que el universo se volvió más brillante gracias a tu existencia. Desde que llegaste, todo tiene más sentido y más color. Tú eres esa chispa que hace que la vida se sienta especial, la razón por la que incluso los días más simples se transforman en recuerdos que valen la pena guardar.

    Tu bondad ilumina como un faro, porque siempre encuentras la manera de dar lo mejor de ti a los demás. Tu risa es como un cometa que alegra cualquier momento y contagia a todos a tu alrededor. Tu esfuerzo, constante y valiente, es una constelación que sigues formando con cada paso que das, recordándome lo fuerte y admirable que eres.

    Cuando dudes, mira al cielo y recuerda que ahí también estás tú reflejada, porque tu luz es imposible de ocultar. Cuando alcances un triunfo, deja que el brillo de las estrellas te muestre lo lejos que has llegado y lo mucho que has crecido. Y cuando necesites descansar, permite que el universo entero te abrace con calma y te recuerde lo valiosa que eres.

    Hay recuerdos que siempre me acompañan y que me hacen sonreír al pensarlos: aquella lluvia que convertimos en baile, cuando hablamos por horas, las miradas que dicen más que cualquier palabra, y cada uno de tus logros, los que ya alcanzaste y los que aún te esperan.

    También sueño con todo lo que viene: seguir creando momentos únicos contigo, compartir pequeñas y grandes aventuras, reír hasta que nos duela la panza y multiplicar la alegría y la paz que llevas dentro y que regalas al mundo sin darte cuenta.

    Prometo estar a tu lado en cada paso, celebrar cada una de tus victorias, escucharte en tus silencios y recordarte siempre lo especial que eres. No solo hoy que cumples 26 años, sino todos los días que nos regale la vida.

    Te amo hasta el infinito y más allá.

    Con todo mi amor,`;
  const fullText = message ?? defaultMessage;


  // ====== Reset al abrir el diálogo ======
  useEffect(() => {
    if (!isOpen) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setFlapOpen(false);
    setBusy(false);
    setState("closed");
    setBump(0);
    setCenterDX(0);
    setCenterDY(0);
    setCenterScale(1);

    // reset de escritura
    setTypedText("");
    setIsTyping(false);
    setShowCTA(false);
  }, [isOpen]);

  // Auto-scroll al fondo mientras se escribe
  useEffect(() => {
    if (!isTyping) return;
    requestAnimationFrame(() => {
      // mantenemos un pequeño margen para que no “salte”
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }, [typedText, isTyping, reduceMotion]);

  // ====== Paleta local (sin globals) ======
  const colors = {
    envBg: "#FFE6EE",
    flap: "#FFD1DC",
    body: "#FFC7D6",
    text: "#083344",
    heart: "#ff4d88",
    paper: "#ffffff",
    paperEdge: "rgba(8,51,68,.12)",
    paperShade: "rgba(0,0,0,.04)",
    accent: "#0ea5e9", 
  } as const;

  // ====== Calcular cuánto mover hasta el centro del viewport ======
  function computeCenterTransform() {
    const el = letterRef.current;
    if (!el) return { dx: 0, dy: 0, scale: 1 };

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const elCx = rect.left + rect.width / 2;
    const elCy = rect.top + rect.height / 2;
    const vpCx = vw / 2;
    const vpCy = vh / 2;

    const dx = vpCx - elCx;
    const dy = vpCy - elCy;

    // Presencia en el centro (responsivo)
    const targetW = Math.min(vw * 0.9, 600);
    const scale = Math.min(1.08, Math.max(1, targetW / rect.width));

    return { dx, dy, scale };
  }

  // Recalcular al hacer resize si está abierta o en lifting
  useEffect(() => {
    if (state === "opened" || state === "lifting") {
      const onResize = () => {
        const { dx, dy, scale } = computeCenterTransform();
        setCenterDX(dx);
        setCenterDY(dy);
        setCenterScale(scale);
      };
      window.addEventListener("resize", onResize);
      onResize();
      return () => window.removeEventListener("resize", onResize);
    }
  }, [state]);

  // ====== Iniciar efecto máquina cuando queda abierta ======
  useEffect(() => {
    if (state !== "opened") return;

    if (reduceMotion) {
      // Sin animación: mostrar todo y CTA
      setTypedText(fullText);
      setShowCTA(true);
      setIsTyping(false);
      return;
    }

    // Arranca la escritura
    setIsTyping(true);
    setShowCTA(false);
    setTypedText("");

    let i = 0;
    const typeNext = () => {
      // velocidad base
      let delay = 50; // ~60 FPS para que acompañe el scroll
      const ch = fullText[i];

      // Pausas ligeras en puntuación o saltos de línea
      if (ch === "." || ch === "!" || ch === "?") delay = 220;
      if (ch === "\n") delay = 120;

      setTypedText((t) => t + ch);
      i += 1;

      if (i < fullText.length) {
        const t = window.setTimeout(typeNext, delay);
        timers.current.push(t);
      } else {
        setIsTyping(false);
        // pequeña pausa antes de mostrar el CTA
        const tEnd = window.setTimeout(() => setShowCTA(true), 220);
        timers.current.push(tEnd);
      }
    };

    // ligera pausa tras “abrir” antes de escribir
    const t0 = window.setTimeout(typeNext, 220);
    timers.current.push(t0);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [state, fullText, reduceMotion]);

  // ====== Coreografía ======
  const openEnvelope = () => {
    if (busy) return;

    setFlapOpen((v) => !v);

    if (reduceMotion) {
      const { dx, dy, scale } = computeCenterTransform();
      setCenterDX(dx);
      setCenterDY(dy);
      setCenterScale(scale);
      setState("opened");
      return;
    }

    if (state === "closed") {
      setBusy(true);

      requestAnimationFrame(() => {
        const { dx, dy, scale } = computeCenterTransform();
        setCenterDX(dx);
        setCenterDY(dy);
        setCenterScale(scale);
      });

      const t1 = window.setTimeout(() => {
        setState("lifting");
        const t2 = window.setTimeout(() => {
          setState("opened"); // << aquí arranca el efecto máquina (useEffect)
          setBump(1);
          const t3 = window.setTimeout(() => {
            setBump(2);
            const t4 = window.setTimeout(() => {
              setBump(0);
              setBusy(false);
            }, 140);
            timers.current.push(t4);
          }, 140);
          timers.current.push(t3);
        }, 520);
        timers.current.push(t2);
      }, 260);

      timers.current.push(t1);
    }
  };

  const closeEnvelope = () => {
    if (busy || reduceMotion) {
      setState("closed");
      setFlapOpen(false);
      setCenterDX(0);
      setCenterDY(0);
      setCenterScale(1);
      setTypedText("");
      setIsTyping(false);
      setShowCTA(false);
      return;
    }
    if (state === "opened") {
      setBusy(true);
      setState("closing");
      const t = window.setTimeout(() => {
        setState("closed");
        setFlapOpen(false);
        setBusy(false);
        setCenterDX(0);
        setCenterDY(0);
        setCenterScale(1);
        setTypedText("");
        setIsTyping(false);
        setShowCTA(false);
      }, 420);
      timers.current.push(t);
    }
  };

  // ====== Estilos/animación calculados ======
  const translateY =
    state === "closed"
      ? "0%"
      : state === "lifting"
      ? "-86%"
      : state === "closing"
      ? "0%"
      : bump === 1
      ? "-92%"
      : bump === 2
      ? "-84%"
      : "-88%";

  const letterTransform =
    `translateY(${translateY})` +
    (state === "lifting" || state === "opened"
      ? ` translate(${centerDX}px, ${centerDY}px) scale(${centerScale})`
      : " scale(1)") +
    (state !== "closed" ? " translateZ(1px)" : "");

  const letterTransition = reduceMotion
    ? "none"
    : "transform .6s cubic-bezier(.2,.8,.2,1)";

  const flapTransform = flapOpen ? "rotateX(178deg)" : "rotateX(0deg)";
  const flapTransition = reduceMotion
    ? "none"
    : "transform .6s cubic-bezier(.2,.8,.2,1)";

  const coverOpacity = state === "opened" || state === "lifting" ? 0 : 1;
  const coverTransition = reduceMotion ? "none" : "opacity .3s ease";
  
  const showRoses = reduceMotion ? state === "opened" : (isTyping || showCTA);

  const canClick = !busy;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[min(92vw,64rem)] w-full bg-transparent border-0 p-0 shadow-none"
        aria-describedby="animated-letter-desc"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Carta animada</DialogTitle>
          <DialogDescription id="animated-letter-desc">
            Carta con sobre y transición (sin CSS global).
          </DialogDescription>
        </DialogHeader>

        <div className="w-full grid place-items-center py-8 sm:py-10">
          {/* Contenedor con perspectiva para dar profundidad 3D */}
          <div
            className="w-[min(92vw,600px)]"
            style={{ perspective: "1200px" }}
          >
            <div
              className={`relative rounded-2xl shadow-2xl ${
                canClick ? "pointer-events-auto" : "pointer-events-none"
              }`}
              style={{
                backgroundColor: colors.envBg,
                aspectRatio: "4 / 3",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Área de trabajo */}
              <div className="absolute inset-0">
                {/* SOLAPA */}
                <button
                  aria-label={flapOpen ? "Cerrar solapa" : "Abrir solapa"}
                  onClick={openEnvelope}
                  className="absolute inset-x-0 top-0 rounded-t-2xl outline-none"
                  style={{
                    height: "60%",
                    transformOrigin: "top center",
                    transform: flapTransform,
                    transition: flapTransition,
                    backgroundColor: colors.flap,
                    clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    boxShadow:
                      "0 6px 18px rgba(0,0,0,.08), inset 0 -6px 14px rgba(255,255,255,.35)",
                    zIndex: 4,
                  }}
                />

                {/* CARTA (contenido) */}
                <div
                  ref={letterRef}
                  role="button"
                  aria-label="Abrir o cerrar carta"
                  onClick={closeEnvelope}
                  className="absolute bottom-0 left-0 right-0 rounded-md text-center"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: letterTransform,
                    transition: letterTransition,
                    willChange: reduceMotion ? undefined : "transform",
                    zIndex:
                      state === "lifting" || state === "opened" ? 6 : 1,
                  }}
                >
                  {/* 🔹 Overlay de rosas (fijo a las esquinas) */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-20"
                    style={{
                      padding: 6,                                  // margen respecto al borde
                      opacity: showRoses ? 1 : 0,                  // aparece cuando empieza el typing
                      transition: reduceMotion ? "none" : "opacity 300ms ease", // fade-in suave
                    }}
                  >
                    <RoseCorners size={30} />
                  </div>
                  <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto p-5 sm:p-6 pb-10 sm:pb-12 bg-white/95 backdrop-blur rounded-md"
                    style={{
                      // FONDO: 1) degradado radial suave  2) “grano” con repeating-linear-gradient
                      backgroundImage: `
                        radial-gradient(180% 120% at 50% 0%, #fff 0%, #fffdf7 55%, #fffaf1 100%),
                        repeating-linear-gradient(0deg, rgba(0,0,0,.015) 0px, rgba(0,0,0,.015) 1px, transparent 1px, transparent 2px),
                        repeating-linear-gradient(90deg, rgba(0,0,0,.01) 0px, rgba(0,0,0,.01) 1px, transparent 1px, transparent 3px)
                      `,
                      backgroundColor: colors.paper,

                      // BORDE + filetín exterior
                      border: `2px dashed ${colors.text}`,
                      outline: `1px solid ${colors.paperEdge}`,

                      // TEXTO
                      color: colors.text,
                      lineHeight: "1.6rem",

                      // SOMBRA exterior + “inner shadow” muy suave
                      boxShadow:
                        state === "closed"
                          ? "0 8px 18px rgba(0,0,0,.08), inset 0 0 0 1px rgba(255,255,255,.6), inset 0 -18px 32px rgba(0,0,0,.03)"
                          : "0 14px 28px rgba(0,0,0,.18), inset 0 0 0 1px rgba(255,255,255,.6), inset 0 -18px 32px rgba(0,0,0,.04)",

                      scrollbarWidth: "thin",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* CABECERA ORNAMENTAL */}
                    <div className="mb-6 relative">
                      <div className="text-center">
                        <div className="font-['Marck Script',cursive] text-3xl sm:text-4xl tracking-wide text-pink-700 drop-shadow-sm">
                          Hermosa Estrella
                        </div>
                      </div>

                      {/* Separador con corazón animado */}
                      <OrnamentalHeader
                        title="Querida Estrella"
                        palette="rose"                         // prueba "sakura" o "cosmic"
                        size={60}                              // más grande si quieres
                        showSparkles
                        reduceMotion={reduceMotion}
                        titleVariant="solid"
                        titleClassName="text-pink-700 drop-shadow-sm"
                      />
                    </div>

                    {/* MARCA DE AGUA */}
                    <div
                      aria-hidden
                      className="absolute"
                      style={{
                        right: "6%",
                        top: "22%",
                        width: 160,
                        height: 160,
                        opacity: 0.05,
                        transform: "rotate(15deg)",
                        background: colors.heart,
                        borderRadius: 18,
                        filter: "blur(0.2px)",
                      }}
                    >
                      <span
                        aria-hidden
                        className="absolute"
                        style={{
                          width: 160,
                          height: 160,
                          backgroundColor: colors.heart,
                          borderRadius: "50%",
                          top: -80,
                          left: 0,
                        }}
                      />
                      <span
                        aria-hidden
                        className="absolute"
                        style={{
                          width: 160,
                          height: 160,
                          backgroundColor: colors.heart,
                          borderRadius: "50%",
                          left: -80,
                          top: 0,
                        }}
                      />
                    </div>

                    {/* Texto: vacía mientras sale; typing al quedar abierta */}
                    <div className="text-[15.5px] sm:text-[17px] text-left whitespace-pre-wrap leading-7 sm:leading-8">
                      {state === "opened" || state === "lifting"
                        ? typedText
                        : ""} 
                    </div>

                    {/* CTA solo al terminar de escribir */}
                    {showCTA && (
                      <>
                        <div
                          className="mt-10 mb-5 h-px"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(8,51,68,.22), transparent)",
                          }}
                        />

                        <div className="flex justify-center">
                          <Button
                            onClick={onComplete}
                            className="relative group overflow-hidden px-7 sm:px-9 py-3 rounded-2xl
                                      font-semibold tracking-wide text-white
                                      transition-transform duration-300
                                      hover:scale-[1.03] active:scale-[0.99]
                                      focus:outline-none focus:ring-2 focus:ring-cyan-300/60
                                      border border-white/10 shadow-[0_12px_28px_rgba(24,64,196,.28)]"
                            style={{
                              // Nebulosa principal (más profunda y menos “dulce”)
                              background:
                                "linear-gradient(135deg,#0ea5e9 0%,#3b82f6 35%,#6366f1 65%,#7c3aed 100%)",
                            }}
                          >
                            {/* Texto */}
                            <span className="relative z-[3] flex items-center gap-2">
                              <span className="text-[15px] sm:text-[16px]">Continuar</span>
                              <span>✨</span>
                            </span>

                            {/* Borde luminoso con conic-gradient */}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 rounded-2xl"
                              style={{
                                padding: 1,
                                background:
                                  "conic-gradient(from 140deg at 50% 50%, rgba(255,255,255,.35), rgba(59,130,246,.25), rgba(124,58,237,.25), rgba(255,255,255,.35))",
                                WebkitMask:
                                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                                WebkitMaskComposite: "xor",
                                maskComposite: "exclude",
                              }}
                            />

                            {/* Bruma/aurora interior para volumen */}
                            <span
                              aria-hidden
                              className="absolute inset-0 rounded-2xl opacity-[.85] mix-blend-screen"
                              style={{
                                background:
                                  "radial-gradient(120px 80px at 25% 30%, rgba(255,255,255,.28), transparent 60%), radial-gradient(160px 110px at 80% 65%, rgba(255,255,255,.18), transparent 60%)",
                              }}
                            />

                            {/* Línea de luz (reflejo de cristal) con shimmer */}
                            <span
                              aria-hidden
                              className="absolute left-3 right-3 top-[42%] h-px rounded opacity-60"
                              style={{
                                background:
                                  "linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent)",
                                boxShadow: "0 0 12px rgba(255,255,255,.35)",
                              }}
                            />
                            <span
                              aria-hidden
                              className="absolute -left-16 top-0 w-16 h-full rotate-12 opacity-30
                                        transition-transform duration-[1400ms] ease-out
                                        group-hover:translate-x-[220%]"
                              style={{
                                background:
                                  "linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)",
                                filter: "blur(2px)",
                              }}
                            />

                            {/* “Planeta” sutil */}
                            <span
                              aria-hidden
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-[2]"
                              style={{
                                background:
                                  "radial-gradient(circle at 30% 30%,#fff 0%,#a5f3fc 40%,#60a5fa 65%,#2563eb 100%)",
                                boxShadow: "0 0 10px 3px rgba(96,165,250,.8)",
                              }}
                            />

                            {/* Estrellitas titilando */}
                            {[{x:"78%",y:"24%"},{x:"86%",y:"60%"},{x:"64%",y:"70%"}].map((s,i)=>(
                              <span
                                aria-hidden
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{
                                  left: s.x, top: s.y,
                                  background: "#fff",
                                  boxShadow: "0 0 8px 3px rgba(255,255,255,.65)",
                                  animationDuration: `${1200 + i*400}ms`,
                                }}
                              />
                            ))}

                            {/* Sombra de caída suave */}
                            <span
                              aria-hidden
                              className="absolute -z-[1] inset-0 rounded-2xl"
                              style={{ boxShadow: "0 18px 32px 0 rgba(14,165,233,.28)" }}
                            />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* FRENTE DEL SOBRE */}
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
                  style={{
                    height: "100%",
                    backgroundColor: colors.body,
                    opacity: coverOpacity,
                    transition: coverTransition,
                    pointerEvents: "none",
                    boxShadow: "inset 0 10px 20px rgba(0,0,0,.06)",
                    zIndex: 2,
                  }}
                />

                {/* CORAZÓN (sello) */}
                <button
                  aria-label="Abrir"
                  onClick={openEnvelope}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: 34,
                    height: 34,
                    transform: "translate(-50%, 0) rotate(45deg)",
                    backgroundColor: colors.heart,
                    borderRadius: 8,
                    opacity: state === "opened" || state === "lifting" ? 0 : 1,
                    transition: reduceMotion ? "none" : "opacity .4s ease",
                    zIndex: 5,
                    boxShadow:
                      "0 6px 14px rgba(0,0,0,.15), 0 0 0 6px rgba(255,77,136,.08)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      width: 34,
                      height: 34,
                      backgroundColor: colors.heart,
                      borderRadius: "50%",
                      top: -17,
                      left: 0,
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      width: 34,
                      height: 34,
                      backgroundColor: colors.heart,
                      borderRadius: "50%",
                      left: -17,
                      top: 0,
                    }}
                  />
                </button>

                {/* LATERALES DEL SOBRE */}
                <div
                  className="absolute inset-0 rounded-br-[14px] rounded-tr-[14px] rounded-bl-[14px]"
                  style={{
                    clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                    backgroundColor: colors.body,
                  }}
                />
                <div
                  className="absolute inset-0 rounded-tl-[14px] rounded-bl-[14px] rounded-br-[14px]"
                  style={{
                    clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                    backgroundColor: colors.body,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
