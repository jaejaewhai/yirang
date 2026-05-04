"use client"

import { useEffect, useState, useRef } from "react"
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
  const topNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = topNavRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty("--topnav-height", `${el.offsetHeight}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = window.innerHeight * 0.4
      setScrollOpacity(Math.min(scrollY / maxScroll, 1))
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const opacity = activeSection ? 1 : scrollOpacity

  return (
    <>
      {/* Top nav buttons */}
      <div
        ref={topNavRef}
        className="fixed top-0 left-0 right-0 flex items-center justify-center px-8 pt-8 pb-3 gap-2 md:gap-5 lg:gap-6"
        style={{ zIndex: 200, opacity, pointerEvents: opacity > 0.5 ? "auto" : "none" }}
      >
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
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                  filter: "blur(12px)",
                  userSelect: "none",
                  fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                  letterSpacing: "0.1em",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                  fontSize: "clamp(0.875rem, 1.5vw, 1rem",
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

      {/* Bottom credits */}
      <div
        className="fixed bottom-0 left-0 right-0 px-8 py-5"
        style={{ zIndex: 200, opacity, pointerEvents: "none" }}
      >
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
          <div className="relative z-10 flex flex-col items-center gap-1">
            <span className="text-sm text-white/30">info.langlee@gmail.com</span>
            <span className="text-sm text-white/30">© 2026 Lang Lee. All rights reserved.</span>
          </div>
      </div>
    </>
  )
}