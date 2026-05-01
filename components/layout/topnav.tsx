"use client"

import { useEffect, useRef } from "react"
import { useSection } from "@/lib/context/SectionContext"

export default function TopNav() {
  const navRef = useRef<HTMLDivElement>(null)
  const { setActiveSection } = useSection()

  useEffect(() => {
    if (!navRef.current) return
    const h = navRef.current.offsetHeight
    document.documentElement.style.setProperty("--topnav-height", `${h}px`)

    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--topnav-height",
        `${navRef.current?.offsetHeight ?? h}px`
      )
    })
    ro.observe(navRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-51 flex flex-col items-center px-8 pt-5 gap-2"
      style={{ mixBlendMode: "difference", zIndex: 51 }}
    >
      <h1
        onClick={() => {
          setActiveSection(null)
          window.scrollTo({ top: 0, behavior: "instant" })
        }}
       className="font-alientz tracking-tighter text-white mt-0 leading-relaxed text-center cursor-pointer select-none"
        style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}
      >
        Lang Lee
      </h1>
    </div>
  )
}