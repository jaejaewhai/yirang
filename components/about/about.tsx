"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import widont from "widont"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { awards, films, publications, tours, press } from "@/lib/data/about"

gsap.registerPlugin(ScrollTrigger)

const sections = ["Bio", "Film & Video", "Publications", "Live & Tours", "Press", "Awards"]
const headingText = "이랑 · 李瀧 · イ‧ラン · b. 1986, Seoul"

const leftImages  = Array.from({ length: 12 }, (_, i) => `/images/about/${i + 1}.jpg`)
const rightImages = Array.from({ length: 12 }, (_, i) => `/images/about/${i + 13}.jpg`)
const allImages   = [...leftImages, ...rightImages]

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isMobile, setIsMobile]           = useState(false)
  const headingRef     = useRef<HTMLHeadingElement>(null)
  const bioRef         = useRef<HTMLDivElement>(null)
  const bioTextRef     = useRef<HTMLDivElement>(null)
  const leftStripRef   = useRef<HTMLDivElement>(null)
  const rightStripRef  = useRef<HTMLDivElement>(null)
  const singleStripRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Background strip animations
useEffect(() => {
  const leftStrip  = leftStripRef.current
  const rightStrip = rightStripRef.current
  if (!leftStrip || !rightStrip) return

  const leftH  = window.innerHeight * leftImages.length
  const rightH = window.innerHeight * rightImages.length

  // Left: start halfway through so images are visible immediately
  gsap.set(leftStrip, { y: -(leftH * 0.5) })
  const leftTween = gsap.fromTo(leftStrip,
    { y: -(leftH * 0.5) },
    {
      y: -(leftH * 1.5),
      duration: leftImages.length * 20,
      ease: "none",
      repeat: -1,
    }
  )

  // Right: unchanged
  gsap.set(rightStrip, { y: -rightH })
  const rightTween = gsap.to(rightStrip, {
    y: 0,
    duration: rightImages.length * 20,
    ease: "none",
    repeat: -1,
  })

  return () => {
    leftTween.kill()
    rightTween.kill()
  }
}, [])

//smoothscrolling for acive section

    useEffect(() => {
    if (!activeSection) return
    const el = overlayRef.current
    if (!el) return

    let overlayLenis: any
    let rafId: number

    const init = async () => {
        const { default: Lenis } = await import("lenis")
        overlayLenis = new Lenis({
        wrapper: el,
        content: el.firstElementChild as HTMLElement,
        duration: 0.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        })

        function raf(time: number) {
        overlayLenis.raf(time)
        rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
    }

    init()

    return () => {
        cancelAnimationFrame(rafId)
        overlayLenis?.destroy()
    }
    }, [activeSection])

  // Mobile breakpoint detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Single strip animation for mobile
  useEffect(() => {
    if (!isMobile) return
    const strip = singleStripRef.current
    if (!strip) return

    const totalH = window.innerHeight * allImages.length
    const tween = gsap.to(strip, {
      y: -totalH,
      duration: allImages.length * 20,
      ease: "none",
      repeat: -1,
    })
    return () => { tween.kill() }
  }, [isMobile])

  // Text animations
  useEffect(() => {
    let rafId: number
    let lenis: any

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bioRef.current!.children,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
          stagger: 0.5,
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      )

      import("split-type").then(({ default: SplitType }) => {
        const headingEl = headingRef.current
        const bioParas = bioTextRef.current
        ? Array.from(bioTextRef.current.querySelectorAll("p:not([aria-hidden])"))
        : []
        const elements = [headingEl, ...bioParas].filter(Boolean) as HTMLElement[]
        elements.forEach(el => {
          const split = new SplitType(el, { types: "words" })
          gsap.fromTo(
            split.words,
            { filter: "blur(32px) brightness(20%)", willChange: "filter" },
            {
              filter: "blur(0px) brightness(100%)",
              ease: "none",
              stagger: 0.08,
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "center top+=50%",
                scrub: 1,
              },
            }
          )
        })
      })
    })

    const initLenis = async () => {
      const { default: Lenis } = await import("lenis")
      lenis = new Lenis()
      function raf(time: number) {
        lenis.raf(time)
        ScrollTrigger.update()
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      ctx.revert()
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

        const toggle = (section: string) => {
            if (section === "Bio") {
            setActiveSection(null)
            return
            }
            setActiveSection(prev => prev === section ? null : section)
        }

        const sectionItems: Record<string, { year: string | number; primary?: string; secondary?: string; meta?: string }[]> = {
        "Awards": awards.map(i => ({
            year: i.year,
            primary: i.award,
            secondary: i.album,
        })),
        "Film & Video": films.map(i => ({
            year: i.year,
            primary: i.titleKo,
            secondary: i.titleEn,
            meta: [i.format, i.role].filter(Boolean).join(" · "),
        })),
        "Publications": publications.map(i => ({
            year: i.year,
            primary: i.titleKo,
            secondary: i.titleEn,
            meta: [i.publisher, i.type, i.region].filter(Boolean).join(" · "),
        })),
        "Live & Tours": tours.map(i => ({
            year: i.year,
            primary: i.title,
            meta: i.location,
        })),
        "Press": press.map(i => ({
            year: i.year,
            primary: i.title,
            meta: [i.outlet, i.region].filter(Boolean).join(" · "),
        })),
}
  return (
    <main className="min-h-screen bg-black pb-16">

      {/* Fixed section buttons */}
        <div
        style={{
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            outline: "1px solid transparent",
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
            transform: "translateZ(0)",
            willChange: "transform",
        }}
        >
        {sections.map(section => (
          <button
            key={section}
            onClick={() => toggle(section)}
            onMouseDown={e => e.preventDefault()}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              border: `1px solid ${
                section === "Bio"
                  ? activeSection === null ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"
                  : activeSection === section ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"
              }`,
              background: section === "Bio"
                ? activeSection === null ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.3)"
                : activeSection === section ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.3)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              color: section === "Bio"
                ? activeSection === null ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"
                : activeSection === section ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontFamily: '"pyeonghwa", sans-serif',
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Background image strips */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          display: isMobile ? "block" : "grid",
          gridTemplateColumns: isMobile ? undefined : "1fr 1fr 1fr",
        }}
      >
        {isMobile ? (
          <div style={{ overflow: "hidden", height: "100%", position: "relative" }}>
            <div ref={singleStripRef} style={{ display: "flex", flexDirection: "column" }}>
              {[...allImages, ...allImages].map((src, i) => (
                <div key={i} style={{ width: "100%", height: "100vh", flexShrink: 0, position: "relative" }}>
                  <Image src={src} alt="" fill sizes="100vw" style={{ objectFit: "cover", opacity: 0.6 }} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
        {/* Left column — bottom to top */}
        <div style={{ position: "relative" }}>
        <div ref={leftStripRef} style={{ display: "flex", flexDirection: "column" }}>
            {[...leftImages, ...leftImages].map((src, i) => (
            <div key={i} style={{ width: "100%", height: "100vh", flexShrink: 0, position: "relative" }}>
                <Image src={src} alt="" fill sizes="33vw" style={{ objectFit: "cover", opacity: 0.6 }} priority={i < 2} />
            </div>
            ))}
        </div>
        </div>

        <div />

        {/* Right column — top to bottom */}
        <div style={{ position: "relative" }}>
        <div ref={rightStripRef} style={{ display: "flex", flexDirection: "column" }}>
            {[...rightImages, ...rightImages].map((src, i) => (
            <div key={i} style={{ width: "100%", height: "100vh", flexShrink: 0, position: "relative" }}>
                <Image src={src} alt="" fill sizes="33vw" style={{ objectFit: "cover", opacity: 0.6 }} />
            </div>
            ))}
        </div>
        </div>
          </>
        )}
      </div>

      {/* Foreground text content — hidden when section active */}
      {!activeSection && (
        <div style={{ position: "relative", zIndex: 10 }}>
            <section className="h-[150vh] flex items-end justify-center px-8 pb-32">
            <div style={{ position: "relative" }}>
                <h1 aria-hidden className="max-w-4xl text-center leading-none text-5xl md:text-5xl lg:text-8xl" style={{ position: "absolute", inset: 0, color: "rgba(255,255,255,0.5)", filter: "blur(20px)", userSelect: "none" }}>
                {headingText}
                </h1>
                <h1 ref={headingRef} className="max-w-4xl text-center text-outlined leading-none text-5xl md:text-5xl lg:text-8xl" style={{ color: "rgba(255,255,255,0.2)" }}>
                {headingText}
                </h1>
            </div>
            </section>
            <section className="pt-24 pb-32">
            <div ref={bioRef} className="max-w-4xl mx-auto flex flex-col space-y-5 px-6 md:px-0">
                <div ref={bioTextRef} className="flex flex-col space-y-5">
                    <div className="h-screen flex items-center justify-center">
                    <div style={{ display: "grid" }}>
                        <p aria-hidden className="text-center leading-none text-5xl md:text-5xl lg:text-8xl" style={{ gridArea: "1/1", color: "rgba(255,255,255,0.5)", filter: "blur(20px)", userSelect: "none", pointerEvents: "none" }}>
                        {widont("singer-songwriter, essayist, author, and filmmaker.")}
                        </p>
                        <p className="text-center text-outlined leading-none text-5xl md:text-5xl lg:text-8xl" style={{ gridArea: "1/1", color: "rgba(255,255,255,0.2)" }}>
                        {widont("singer-songwriter, essayist, author, and filmmaker.")}
                        </p>
                    </div>
                    </div>
                <div className="h-screen flex items-center justify-center">
                    <div style={{ position: "relative" }}>
                    <p aria-hidden className="text-center leading-none text-5xl md:text-5xl lg:text-8xl" style={{ position: "absolute", inset: 0, color: "rgba(255,255,255,0.5)", filter: "blur(20px)", userSelect: "none" }}>
                        {widont("With candid and unflinching approach to art,")}
                    </p>
                    <p className="text-center text-outlined leading-none text-5xl md:text-5xl lg:text-8xl" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {widont("With candid and unflinching approach to art,")}
                    </p>
                    </div>
                </div>
                <div className="h-screen flex items-center justify-center">
                    <div style={{ position: "relative" }}>
                    <p aria-hidden className="text-center leading-none text-5xl md:text-5xl lg:text-8xl" style={{ position: "absolute", inset: 0, color: "rgba(255,255,255,0.5)", filter: "blur(20px)", userSelect: "none" }}>
                        {widont("Lang faces the unbearable weight of living in all its forms, and wrestles with what words and verses can honestly hold.")}
                    </p>
                    <p className="text-center text-outlined leading-none text-5xl md:text-5xl lg:text-8xl" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {widont("Lang faces the unbearable weight of living in all its forms, and wrestles with what words and verses can honestly hold.")}
                    </p>
                    </div>
                </div>
                <div className="h-screen flex items-center justify-center">
                    <div style={{ position: "relative" }}>
                    <p aria-hidden className="text-center leading-none text-5xl md:text-5xl lg:text-8xl" style={{ position: "absolute", inset: 0, color: "rgba(255,255,255,0.5)", filter: "blur(20px)", userSelect: "none" }}>
                        {widont("Lang works fluidly across disciplines, extending her voice through comics, moving image, cinema, and writing.")}
                    </p>
                    <p className="text-center text-outlined leading-none text-5xl md:text-5xl lg:text-8xl" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {widont("Lang works fluidly across disciplines, extending her voice through comics, moving image, cinema, and writing.")}
                    </p>
                    </div>
                </div>
                <div className="h-screen flex items-center justify-center">
                    <div style={{ position: "relative" }}>
                    <p aria-hidden className="text-center leading-none text-5xl md:text-5xl lg:text-8xl" style={{ position: "absolute", inset: 0, color: "rgba(255,255,255,0.5)", filter: "blur(20px)", userSelect: "none" }}>
                        {widont("She has directed music videos, short films, and television series, and is an author to published essays and novels across Korea, Japan, and Taiwan.")}
                    </p>
                    <p className="text-center text-outlined leading-none text-5xl md:text-5xl lg:text-8xl" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {widont("She has directed music videos, short films, and television series, and is an author to published essays and novels across Korea, Japan, and Taiwan.")}
                    </p>
                    </div>
                </div>
                </div>
            </div>
          </section>
        </div>
      )}

{/* Section overlay */}
      {activeSection && (
        <div
          ref={overlayRef}
          onWheel={e => e.stopPropagation()}
          onTouchMove={e => e.stopPropagation()}
          style={{
            position: "fixed",
            top: "calc(var(--topnav-height, 80px) + 64px)",
            left: 0,
            width: "100vw",
            height: "calc(100vh - var(--topnav-height, 80px) - 48px)",
            zIndex: 50,
            overflowY: "scroll",
            padding: "48px",
            scrollbarWidth: "none" as any,
            msOverflowStyle: "none" as any,
          }}
        >
          <div 
            className="px-6 md:px-0"
            style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "4rem", paddingBottom: "calc(var(--topnav-height, 80px) + 64px)", }}>
            {sectionItems[activeSection]?.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "4rem" }}>
                <button
                style={{
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                    outline: "1px solid transparent",
                    color: "rgba(255,255,255,1)",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                    fontSize: "2rem",
                    lineHeight: "2rem",
                    letterSpacing: "0.08em",
                    fontFamily: '"pyeonghwa", sans-serif',
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,1)",
                    padding: "0.5rem 1rem",
                    background: "transparent",
                    cursor: "default",
                    width: "fit-content",
                    flexShrink: 0,
                }}
                >
                {item.year}
                </button>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {item.primary && <p style={{ color: "rgba(255,255,255,1)", fontSize: "3rem" , lineHeight: "3rem" }}>{widont(item.primary)}</p>}
                  {item.secondary && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.5rem" , lineHeight: "2rem" }}>{widont(item.secondary)}</p>}
                  {item.meta && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.5rem" , lineHeight: "2rem" }}>{widont(item.meta)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  )
}