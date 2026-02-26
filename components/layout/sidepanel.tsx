"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function SidePanel() {
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // start both elements near the center
    gsap.set(logoRef.current, { x: -600, opacity: 1 })
    gsap.set(textRef.current, { x: 600, opacity: 1 })

    // animate to their final positions
    gsap.to(logoRef.current, {
      x: 0,
      duration: 2,
      delay: 2,
      ease: "power3.out",
    })

    gsap.to(textRef.current, {
      x: 0,
      duration: 2,
      delay: 2,
      ease: "power3.out",
    })
  }, [])

  return (
    <>
      {/* Right Panel - Logo */}
      <div
        className="fixed right-0 top-0 h-full w-1/6 flex flex-col items-center justify-center gap-6 px-4"
        style={{ mixBlendMode: "difference", zIndex: 2 }}
      >
        <div ref={logoRef} className="relative w-60 h-40">
          <Image
            src="/langlee_logo_type_white.png"
            alt="Artist logo"
            fill
            className="object-cover logo-rotate"
          />
        </div>
      </div>

      {/* Left Panel - Text */}
      <div
        className="fixed left-0 top-0 h-full w-1/6 flex flex-col items-center justify-center gap-6 px-4"
        style={{ mixBlendMode: "difference", zIndex: 2 }}
      >
        <div ref={textRef} className="text-center">
          <h1 className="tracking-widest uppercase text-8xl h-40 flex items-center text-white">
            이랑
          </h1>
        </div>
      </div>
    </>
  )
}