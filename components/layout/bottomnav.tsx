"use client"

import { useEffect, useState } from "react"
import { useSection } from "@/lib/context/SectionContext"

const navItems = [
  { label: "( About )", id: "about" },
  { label: "( Music )", id: "music" },
  { label: "( Works )", id: "works" },
  { label: "( Books )", id: "books" },
]

export default function BottomNav() {
  const { activeSection, setActiveSection } = useSection()
  const [scrollOpacity, setScrollOpacity] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = window.innerHeight * 0.4
      setScrollOpacity(Math.min(scrollY / maxScroll, 1))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // If a section is active, always show the nav fully
  const opacity = activeSection ? 1 : scrollOpacity

  return (
      <nav
        className="fixed bottom-0 left-0 right-0 flex flex-col items-center px-8 py-5 gap-2"
        style={{
          zIndex: 200,
          opacity,
          pointerEvents: opacity > 0.5 ? "auto" : "none",
        }}
      >
        {/* Gradient background — separate from content so blur has no hard edge */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(180, 140, 60, 0.5) 0%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div className="relative z-10 flex items-center justify-center gap-5 md:gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(isActive ? null : item.id)
                  window.scrollTo({ top: 0, behavior: "instant" })
                }}
                style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "0" }}
              >
                {/* Blur glow layer */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                    filter: "blur(12px)",
                    userSelect: "none",
                    fontSize: "1.2rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {item.label}
                </span>
                {/* Visible text */}
                <span
                  style={{
                    color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    fontSize: "1.2rem",
                    letterSpacing: "0.1em",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
        <span className="relative z-10 text-md text-white/30">© 2026 Lang Lee. All rights reserved.</span>
    </nav>
  )
}