"use client"

import { useEffect, useState, useRef } from "react"
import { useSection } from "@/lib/context/SectionContext"
import ScrambleHover from "@/components/fancy/text/scramble-hover"

const navItems = [
  { label: "( About )", id: "about", korean: "( 이랑 )" },
  { label: "( Music )", id: "music", korean: "( 음악 )" },
  { label: "( Works )", id: "works", korean: "( 작업물 )" },
  { label: "( Books )", id: "books", korean: "( 서책 )" },
]

// ─── Moon phase calculation ───────────────────────────────────────────────────
function getMoonPhase(): { emoji: string; name: string } {
  const now = new Date()
  const known = new Date(2000, 0, 6)
  const msPerDay = 86400000
  const synodicMonth = 29.53058867
  const days = (now.getTime() - known.getTime()) / msPerDay
  const phase = ((days % synodicMonth) + synodicMonth) % synodicMonth
  const p = phase / synodicMonth

  if (p < 0.033) return { emoji: "🌑", name: "New Moon" }
  if (p < 0.133) return { emoji: "🌒", name: "Waxing Crescent" }
  if (p < 0.216) return { emoji: "🌓", name: "First Quarter" }
  if (p < 0.350) return { emoji: "🌔", name: "Waxing Gibbous" }
  if (p < 0.466) return { emoji: "🌕", name: "Full Moon" }
  if (p < 0.550) return { emoji: "🌖", name: "Waning Gibbous" }
  if (p < 0.716) return { emoji: "🌗", name: "Last Quarter" }
  if (p < 0.916) return { emoji: "🌘", name: "Waning Crescent" }
  return { emoji: "🌑", name: "New Moon" }
}
// ─────────────────────────────────────────────────────────────────────────────

const NavButton = ({ item, isActive, onClick }: { item: typeof navItems[0], isActive: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      onMouseDown={e => e.preventDefault()}
      style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "0", userSelect: "none" }}
    >
      <span aria-hidden style={{ position: "absolute", inset: 0, color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", filter: "blur(12px)", userSelect: "none", fontSize: "clamp(0.875rem, 1.5vw, 1rem)", letterSpacing: "0.1em", pointerEvents: "none" }}>
        {item.label}
      </span>
      <span style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)", fontSize: "clamp(0.875rem, 1.5vw, 1rem)", letterSpacing: "0.1em", transition: "color 0.3s ease" }}>
        <ScrambleHover
          text={item.label}
          characters="하♩하♪하♫하♬하♭하♮하♯하𝄞하𝄢하}하;하!하&하#"
          scrambleSpeed={150}
          maxIterations={8}
          sequential={true}
          revealDirection="start"
        />
      </span>
    </button>
  )
}

export default function BottomNav() {
  const { activeSection, setActiveSection } = useSection()
  const [scrollOpacity, setScrollOpacity] = useState(0)
  const topNavRef = useRef<HTMLDivElement>(null)
  const [temp, setTemp] = useState<string | null>(null)
  const [time, setTime] = useState<string>("")
  const [isMobile, setIsMobile] = useState(false)
  const moon = getMoonPhase()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
      }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.978&current=temperature_2m&timezone=Asia%2FSeoul")
      .then(r => r.json())
      .then(d => setTemp(`${Math.round(d.current.temperature_2m)}°C`))
      .catch(() => setTemp(null))
  }, [])

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

  const handleClick = (item: typeof navItems[0]) => {
    const isActive = activeSection === item.id
    setActiveSection(isActive ? null : item.id)
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  return (
    <>
      {/* Top — About + Seoul info + Music */}
      <div
        ref={topNavRef}
        className="fixed top-0 left-0 right-0 px-8 pt-6 pb-3"
        style={{
          zIndex: 202,
          opacity,
          pointerEvents: opacity > 0.5 ? "auto" : "none",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <NavButton item={navItems[0]} isActive={activeSection === navItems[0].id} onClick={() => handleClick(navItems[0])} />
        </div>

        {/* Centre — moon + temp + time */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? "2px" : "6px",
          pointerEvents: "none",
          userSelect: "none",
          fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.35)",
          fontFamily: '"pyeonghwa", sans-serif',
          textAlign: "center",
        }}>
          {isMobile ? (
            <>
              <span>{moon.emoji} {moon.name}</span>
              <span>{temp ?? "—"} · Seoul · {time} KST</span>
            </>
          ) : (
            <>
              <span>{moon.emoji} {moon.name}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span>Seoul</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span>{temp ?? "—"}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span>{time} KST</span>
            </>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <NavButton item={navItems[1]} isActive={activeSection === navItems[1].id} onClick={() => handleClick(navItems[1])} />
        </div>
      </div>

      {/* Bottom — Works + Credits + Books */}
      <div
        className="fixed bottom-0 left-0 right-0 px-8 py-5"
        style={{ zIndex: 202, opacity, pointerEvents: opacity > 0.5 ? "auto" : "none" }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(180, 140, 60, 0.5) 0%, transparent 100%)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", pointerEvents: "none", zIndex: 0 }} />
        <div className="relative z-10 w-full flex flex-col items-center gap-1">
          <div className="w-full flex items-center justify-between">
            <div style={{ width: "8rem", display: "flex", justifyContent: "flex-start" }}>
              <NavButton item={navItems[2]} isActive={activeSection === navItems[2].id} onClick={() => handleClick(navItems[2])} />
            </div>
            <div style={{ pointerEvents: "none", display: isMobile ? "none" : "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>© 2026 Lang Lee. All rights reserved.</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>info.langlee@gmail.com</span>
            </div>
            <div style={{ width: "8rem", display: "flex", justifyContent: "flex-end" }}>
              <NavButton item={navItems[3]} isActive={activeSection === navItems[3].id} onClick={() => handleClick(navItems[3])} />
            </div>
          </div>
          {isMobile && (
            <div style={{ pointerEvents: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>© 2026 Lang Lee. All rights reserved.</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>info.langlee@gmail.com</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}