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
            backdropFilter: "blur(100px)",
            WebkitBackdropFilter: "blur(100px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div className="relative z-10 flex items-center justify-center gap-5 md:gap-6 lg:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(activeSection === item.id ? null : item.id)
                window.scrollTo({ top: 0, behavior: "instant" })
              }}
              className={`text-sm md:text-xl lg:text-2xl tracking-widest uppercase transition-colors duration-300 ${
                activeSection === item.id ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="relative z-10 text-md text-white/30">© 2026 Lang Lee. All rights reserved.</span>
    </nav>
  )
}