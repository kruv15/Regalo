// app/layout.tsx
import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { LayoutWrapper } from "../components/layout-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "El Universo de Tu Vida - Cumpleaños 26",
  description: "Una experiencia mágica y cósmica para celebrar tu cumpleaños especial. Creado con amor.",
  keywords: ["cumpleaños", "universo", "estrellas", "experiencia", "mágico", "26 años"],
  authors: [{ name: "Tu Persona Especial" }],
  creator: "El Universo de Tu Vida",
  publisher: "Amor Cósmico",
  robots: "noindex, nofollow",
  generator: "v0.app",
  // ⚠️ OJO: aquí ya NO pongas viewport / themeColor / colorScheme
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <LayoutWrapper>
          <Suspense
            fallback={
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-lg text-primary">Cargando magia...</p>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
        </LayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
