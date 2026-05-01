"use client"

import { useEffect, useRef } from "react"
import { useSection } from "@/lib/context/SectionContext"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { activeSection } = useSection()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    overlay.style.transition = "none"
    overlay.style.backdropFilter = "blur(60px)"
    overlay.style.WebkitBackdropFilter = "blur(60px)"
    overlay.style.opacity = "1"

    overlay.getBoundingClientRect()

    requestAnimationFrame(() => {
      overlay.style.transition = "backdrop-filter 1.1s ease, opacity 0.4s ease 0.7s"
      overlay.style.backdropFilter = "blur(0px)"
      overlay.style.WebkitBackdropFilter = "blur(0px)"
      overlay.style.opacity = "0"
    })
  }, [activeSection]) // ← watches section switches, not URL

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          backdropFilter: "blur(60px)",
          WebkitBackdropFilter: "blur(60px)",
          background: "rgba(0,0,0,0.2)",
          opacity: 1,
          pointerEvents: "none",
        }}
      />
      {children}
    </>
  )
}