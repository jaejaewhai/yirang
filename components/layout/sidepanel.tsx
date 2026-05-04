"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useSection } from "@/lib/context/SectionContext"
import gsap from "gsap"

export default function SidePanel() {
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const { setActiveSection } = useSection()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty("--topnav-height", "0px")
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1117)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    gsap.set(logoRef.current, { x: -600, opacity: 1 })
    gsap.set(textRef.current, { x: 600, opacity: 1 })

    gsap.to(logoRef.current, { x: 0, duration: 2, delay: 2, ease: "power3.out" })
    gsap.to(textRef.current, { x: 0, duration: 2, delay: 2, ease: "power3.out" })
  }, [])

  const goHome = () => {
    setActiveSection(null)
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  return (
    <>
      {/* Right Panel - Logo */}
      <div
        className="fixed right-0 top-0 h-full w-1/6 flex flex-col items-center justify-center gap-6 px-4"
        style={{ mixBlendMode: "difference", zIndex: 201 }}
      >
        <div
          ref={logoRef}
          onClick={goHome}
          className="relative cursor-pointer select-none"
          style={{
            width: isMobile ? "clamp(9rem, 12vw, 26vw)" : "15vw",
            height: isMobile ? "clamp(5rem, 6vw, 12vw)" : "10vw",
            transition: "width 0.3s ease, height 0.3s ease",
          }}
        >
          <Image
            src="/langlee_logo_type_white.png"
            alt="Lang Lee logo"
            fill
            className="object-cover logo-rotate"
          />
        </div>
      </div>

      {/* Left Panel - Text */}
      <div
        className="fixed left-0 top-0 h-full w-1/6 flex flex-col items-center justify-center gap-6"
        style={{ mixBlendMode: "difference", zIndex: 201 }}
      >
        <div ref={textRef} className="text-center">
          <h1
            onClick={goHome}
            className="tracking-widest uppercase text-white cursor-pointer select-none flex items-center"
            style={{
              fontSize: isMobile ? "clamp(4rem, 3vw, 4rem)" : "clamp(1.5rem, 6vw, 8rem)",
              lineHeight: 1,
              writingMode: isMobile ? "vertical-rl" : "horizontal-tb",
              textOrientation: "mixed",
              transition: "font-size 0.3s ease",
            }}
          >
            이랑
          </h1>
        </div>
      </div>
    </>
  )
}