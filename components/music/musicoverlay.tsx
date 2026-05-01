"use client"


import { useState, useRef, useEffect } from "react"
import widont from "widont"
import { discography, formats, years } from "@/lib/data/discography"


type Props = {
  onClose: () => void
}

export default function MusicOverlay({ onClose }: Props) {
  const [activeFormat, setActiveFormat] = useState<string | null>(null)
  const [currentYear, setCurrentYear] = useState<number>(years[0])
  const scrollRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const speedRef = useRef(0.3)
  const scrollLeftRef = useRef(0)
  const yearStartRefs = useRef<Map<number, number>>(new Map())
  const yearEndRefs = useRef<Map<number, number>>(new Map())
  const itemWidthRef = useRef<number>(0)

  const filtered = discography.filter(item => {
    if (activeFormat && item.format !== activeFormat) return false
    return true
  })

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let isDragging = false
    let dragStartX = 0
    let dragStartScroll = 0
    let velocity = 0
    let lastX = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      dragStartX = e.clientX
      dragStartScroll = scrollLeftRef.current
      lastX = e.clientX
      el.style.cursor = "grabbing"
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const delta = dragStartX - e.clientX
      scrollLeftRef.current = dragStartScroll + delta
      velocity = lastX - e.clientX
      lastX = e.clientX
    }

    const onMouseUp = () => {
      isDragging = false
      el.style.cursor = "grab"
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      scrollLeftRef.current += e.deltaY + e.deltaX
      velocity = e.deltaY + e.deltaX
    }

    const totalWidth = el.scrollWidth / 2

    const tick = () => {
      if (!isDragging) {
        velocity = lerp(velocity, 0, 0.05)
        scrollLeftRef.current += speedRef.current + velocity
      }

      if (scrollLeftRef.current >= totalWidth) scrollLeftRef.current -= totalWidth
      if (scrollLeftRef.current < 0) scrollLeftRef.current += totalWidth

      el.scrollLeft = scrollLeftRef.current

      const centerX = scrollLeftRef.current + el.clientWidth / 2
      const itemWidth = itemWidthRef.current

      let found = filtered[0]?.year
      yearStartRefs.current.forEach((startLeft, year) => {
        const endLeft = yearEndRefs.current.get(year) ?? startLeft
        if (centerX >= startLeft && centerX <= endLeft + itemWidth) found = year
      })
      if (found) setCurrentYear(found)

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    el.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    el.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(animRef.current)
      el.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      el.removeEventListener("wheel", onWheel)
    }
  }, [filtered])

  const jumpToYear = (year: number) => {
    const offset = yearStartRefs.current.get(year)
    if (offset !== undefined) {
      scrollLeftRef.current = offset
    }
  }

    return (
      <div className="fixed inset-0 bg-black flex flex-col justify-center overflow-hidden animate-fadeIn" style={{ zIndex: 1 }}>

        {/* Format filters */}
        <div
          style={{
            position: "fixed",
            top: "calc(var(--topnav-height, 80px) + 0.15rem)",
            left: 0,
            width: "100vw",
            zIndex: 60,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            padding: "0 24px",
            userSelect: "none",
          }}
        >
          <button
            onClick={() => setActiveFormat(null)}
            onMouseDown={e => e.preventDefault()}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              border: `1px solid ${activeFormat === null ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}`,
              background: activeFormat === null ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.3)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              color: activeFormat === null ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontFamily: '"pyeonghwa", sans-serif',
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            All
          </button>
          {formats.map(format => (
            <button
              key={format}
              onClick={() => setActiveFormat(format === activeFormat ? null : format)}
              onMouseDown={e => e.preventDefault()}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: `1px solid ${activeFormat === format ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}`,
                background: activeFormat === format ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.3)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                color: activeFormat === format ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                fontFamily: '"pyeonghwa", sans-serif',
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {format}
            </button>
          ))}
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-8 px-8 overflow-x-hidden cursor-grab select-none"
          style={{ paddingTop: "50px", paddingBottom: "16px" }}
        >
          {[...filtered, ...filtered].map((item, i) => (
            <div
              key={i}
              ref={el => {
                if (el && i < filtered.length) {
                  if (i === 0) itemWidthRef.current = el.offsetWidth
                  if (!yearStartRefs.current.has(item.year)) {
                    yearStartRefs.current.set(item.year, el.offsetLeft)
                  }
                  yearEndRefs.current.set(item.year, el.offsetLeft)
                }
              }}
              className="relative flex-shrink-0 w-100 border border-white/10 p-4 hover:border-white/40 transition-colors duration-300 cursor-pointer"
            >
              {item.hit && (
                <img
                  src="/assets/badge.svg"
                  alt="Hit"
                  className="absolute"
                  style={{ width: "60px", height: "60px", top: "0px", right: "0px", transform: "translate(30%, -30%)" }}
                />
              )}
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", lineHeight: "11px", marginBottom: "12px", letterSpacing: "0.08em" }}>
                {item.year}
              </p>
              <h2 style={{ color: "rgba(255,255,255,1)", fontSize: "3rem", lineHeight: "3rem", marginBottom: "4px" }}>
                {item.titleKo}
              </h2>
              {item.titleEn && (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.5rem", lineHeight: "2rem", marginBottom: "12px" }}>
                  {item.titleEn}
                </p>
              )}
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.1em" }}>
                {item.format}
              </p>
              {item.duration && (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "4px" }}>
                  {item.duration}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Year timeline */}
        <div
          className="fixed left-0 right-0 flex items-center justify-center gap-6 px-16"
          style={{ bottom: "100px" }}
        >
          {years.map(year => (
            <button
              key={year}
              onClick={() => jumpToYear(year)}
              className={`text-xs tracking-widest transition-all duration-300 ${
                currentYear === year
                  ? "text-white scale-125"
                  : "text-white/20 hover:text-white/60"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

      </div>
    )
}