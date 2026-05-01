"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { worksData } from "@/lib/data/works/works"
import gsap from "gsap"

interface GridItem {
  el: HTMLDivElement
  wrapper: HTMLDivElement
  img: HTMLImageElement
  x: number
  y: number
  w: number
  h: number
  extraX: number
  extraY: number
  rect: DOMRect
  ease: number
  tags: string[]
  category: string
  floatSpeed: number
  floatAmpX: number
  floatAmpY: number
  floatOffset: number
  visible: boolean
  baseIndex: number
  gatherX: number
  gatherY: number
  gatherXC: number
  gatherYC: number
}

    const widths = [400, 260, 540, 320, 200, 460, 280, 380, 220, 500, 300, 420]

    const COLS = 4
    const COL_W = 380
    const ROW_H = 500

    function generateLayout(count: number) {
    const rows = Math.ceil(count / COLS)
    const canvasW = COLS * COL_W
    const canvasH = rows * ROW_H
    const positions: { x: number; y: number; w: number; h: number }[] = []
    for (let i = 0; i < count; i++) {
    const w = widths[i % widths.length]
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const x = col * COL_W + (col % 2 === 0 ? 20 : 60)
    const randomOffsetY = (Math.sin(i * 7.3) * 0.5 + 0.5) * 120  // deterministic random per item
    const y = row * ROW_H + randomOffsetY
    positions.push({
        x: Math.min(x, canvasW - w - 20),
        y,
        w,
        h: w,
    })
    }
    return { positions, canvasW, canvasH }
    }

    const { positions: layout, canvasW: CANVAS_W, canvasH: CANVAS_H } = generateLayout(worksData.length)
    const allTags = Array.from(new Set(worksData.flatMap(s => s.tags))).sort()

export default function WorksPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef     = useRef<GridItem[]>([])
  const [tagsOpen, setTagsOpen]             = useState(false)
  const [activeTags, setActiveTags]         = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<{ src: string; caption: string } | null>(null)
  const categories = ["note", "drawing", "comics", "lyrics"]
  const gatherRef = useRef<{ trigger: boolean; active: boolean }>({ trigger: false, active: false })
  const blurOverlayRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
        const el = blurOverlayRef.current
        if (!el) return
        // force reflow so transition fires
        el.getBoundingClientRect()
        el.style.backdropFilter = "blur(0px)"
        el.style["WebkitBackdropFilter" as any] = "blur(0px)"
        el.style.opacity = "0"
        const timer = setTimeout(() => { el.style.display = "none" }, 1200)
        return () => clearTimeout(timer)
        }, [])

        useEffect(() => {
        const isFiltered = activeTags.length > 0 || activeCategory !== null

        itemsRef.current.forEach(item => {
            const tagMatch = activeTags.length === 0 || activeTags.some(tag => item.tags.includes(tag))
            const categoryMatch = !activeCategory || item.category === activeCategory
            item.visible = tagMatch && categoryMatch
            item.el.style.pointerEvents = item.visible ? "auto" : "none"
        })

        gatherRef.current = { trigger: true, active: isFiltered }
        }, [activeTags, activeCategory])

  const toggleTag = useCallback((tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let clock = 0
    let topZ = 10
    let winW = window.innerWidth
    let winH = window.innerHeight
    let rafId: number
    let isDragging = false
    let tileSizeW = 0
    let tileSizeH = 0
    let introPlaying = false
    let introItems: GridItem[] = []

    const scroll = {
      ease: 0.06,
      current: { x: 0, y: 0 },
      target:  { x: 0, y: 0 },
      last:    { x: 0, y: 0 },
      delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } },
    }

    const mouse = {
      x: { t: 0.5, c: 0.5 },
      y: { t: 0.5, c: 0.5 },
      press: { t: 0, c: 0 },
    }

    const drag = {
    startX: 0, startY: 0,
    scrollX: 0, scrollY: 0,
    velX: 0, velY: 0,          // current velocity
    prevX: 0, prevY: 0,        // previous frame position (for vel calc)
    lastTime: 0,               // timestamp of last mousemove
    }

    function build() {
      winW = window.innerWidth
      winH = window.innerHeight

    const tileW = winW
    const tileH = winW * (CANVAS_H / CANVAS_W)
    const scaleX = tileW / CANVAS_W
    const scaleY = tileH / CANVAS_H

      scroll.current = { x: 0, y: 0 }
      scroll.target  = { x: 0, y: 0 }
      scroll.last    = { x: 0, y: 0 }

      container!.innerHTML = ""
      itemsRef.current = []

      const baseItems = worksData.map((source, i) => ({
        src:      source.src,
        caption:  source.caption,
        tags:     source.tags,
        category: source.category,
        x: layout[i % layout.length].x * scaleX,
        y: layout[i % layout.length].y * scaleY,
        w: layout[i % layout.length].w * scaleX,
        h: layout[i % layout.length].h * scaleY,
      }))

      const repsX = [0, tileW]
      const repsY = [0, tileH]

      baseItems.forEach((base, baseIndex) => {
        repsX.forEach(offsetX => {
          repsY.forEach(offsetY => {
            // el — render loop writes transform here
            const el = document.createElement("div")
            el.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: ${base.w}px;
            will-change: transform;
            opacity: 0;
            transition: opacity 0.4s ease;
            `

            // wrapper — GSAP writes transform here during intro
            const wrapper = document.createElement("div")
            wrapper.style.cssText = `width: 100%;`
            el.appendChild(wrapper)

            const imageWrap = document.createElement("div")
            imageWrap.style.cssText = `
            width: ${base.w}px;
            height: ${base.w}px;
            position: relative;
            `

            const img = document.createElement("img")
            img.src = base.src
            img.style.cssText = `
              width: 110%;
              height: 110%;
              margin: -5%;
              object-fit: cover;
              will-change: transform;
              display: block;
              filter: grayscale(20%);
              transition: filter 0.4s ease;
            `

            img.onload = () => {
              const ratio = img.naturalHeight / img.naturalWidth
              imageWrap.style.height = `${base.w * ratio}px`
            }

            img.addEventListener("mouseenter", () => { img.style.filter = "grayscale(0%)" })
            img.addEventListener("mouseleave", () => { img.style.filter = "grayscale(20%)" })

            imageWrap.appendChild(img)
            wrapper.appendChild(imageWrap)

            const caption = document.createElement("div")
            caption.style.cssText = `
              margin-top: 10px;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
            `
            const title = document.createElement("span")
            title.textContent = base.caption
            title.style.cssText = `
              font-family: "pyeonghwa", sans-serif;
              font-size: 11px;
              color: rgba(255,255,255,0.35);
              letter-spacing: 0.08em;
              text-transform: uppercase;
            `
            caption.appendChild(title)
            wrapper.appendChild(caption)
            container!.appendChild(el)

            el.addEventListener("click", () => {
            topZ += 1
            el.style.zIndex = String(topZ)
            setSelectedItem({ src: base.src, caption: base.caption })
            })
            
            itemsRef.current.push({
            el,
            wrapper,
            img,
            x: base.x + offsetX,
            y: base.y + offsetY,
            w: base.w,
            h: base.h,
            extraX: 0,
            extraY: 0,
            rect: el.getBoundingClientRect(),
            ease: Math.random() * 0.5 + 0.5,
            tags: base.tags,
            category: base.category,
            // float params — unique per item
            floatSpeed: 0.4 + Math.random() * 0.6,
            floatAmpX: 4 + Math.random() * 8,
            floatAmpY: 4 + Math.random() * 8,
            floatOffset: Math.random() * Math.PI * 2,
            baseIndex,
            visible: true,
            gatherX: 0,
            gatherY: 0,
            gatherXC: 0,
            gatherYC: 0,
            })
          })
        })
      })

      tileSizeW = tileW * 2
      tileSizeH = tileH * 2

      scroll.current.x = scroll.target.x = scroll.last.x = -winW * 0.1
      scroll.current.y = scroll.target.y = scroll.last.y = -winH * 0.1
    }

    // called after render loop has placed items — reads actual screen positions
    function initIntro() {
      introItems = itemsRef.current.filter(item => {
        const rect = item.wrapper.getBoundingClientRect()
        return (
          rect.x > -rect.width &&
          rect.x < winW + rect.width &&
          rect.y > -rect.height &&
          rect.y < winH + rect.height
        )
      })

      introItems.forEach(item => {
        const rect = item.wrapper.getBoundingClientRect()
        const x = -rect.x + winW * 0.5 - rect.width * 0.5
        const y = -rect.y + winH * 0.5 - rect.height * 0.5
        gsap.set(item.wrapper, { x, y })
      })
    }

    function intro() {
      introPlaying = true
      const els = [...introItems].reverse().map(item => item.wrapper)
      gsap.to(els, {
        duration: 2,
        ease: "expo.inOut",
        x: 0,
        y: 0,
        stagger: 0.05,
        onComplete: () => {
          introItems.forEach(item => {
            gsap.set(item.wrapper, { clearProps: "x,y" })
          })
          introPlaying = false
        },
      })
    }

    function render() {
      scroll.current.x += (scroll.target.x - scroll.current.x) * scroll.ease
      scroll.current.y += (scroll.target.y - scroll.current.y) * scroll.ease

      scroll.delta.x.t = scroll.current.x - scroll.last.x
      scroll.delta.y.t = scroll.current.y - scroll.last.y
      scroll.delta.x.c += (scroll.delta.x.t - scroll.delta.x.c) * 0.04
      scroll.delta.y.c += (scroll.delta.y.t - scroll.delta.y.c) * 0.04

      mouse.x.c += (mouse.x.t - mouse.x.c) * 0.04
      mouse.y.c += (mouse.y.t - mouse.y.c) * 0.04
      mouse.press.c += (mouse.press.t - mouse.press.c) * 0.04

      const dirX = scroll.current.x > scroll.last.x ? "right" : "left"
      const dirY = scroll.current.y > scroll.last.y ? "down"  : "up"

      // render loop always writes to el — never conflicts with GSAP on wrapper
        clock += 0.008

        if (gatherRef.current.trigger) {
        gatherRef.current.trigger = false
        const isActive = gatherRef.current.active

        if (!isActive) {
            // filter cleared — return all items to natural position
            itemsRef.current.forEach(item => { item.gatherX = 0; item.gatherY = 0 })
        } else {
        const GAP_X = 24
        const GAP_Y = 24
        const visibleBaseIndices = [...new Set(
            itemsRef.current.filter(i => i.visible).map(i => i.baseIndex)
        )]
        const N = visibleBaseIndices.length
        const COLS = Math.min(N, Math.ceil(Math.sqrt(N * 1.5)))
        const ROWS = Math.ceil(N / COLS)

        // Step 1 — pick the primary copy (closest to viewport center) for each baseIndex
        const primaries: GridItem[] = []
        visibleBaseIndices.forEach(bi => {
            const copies = itemsRef.current.filter(i => i.baseIndex === bi && i.visible)
            const primary = copies.reduce((best, item) => {
            const distA = Math.abs(item.x + scroll.current.x + item.extraX + item.w / 2 - winW / 2) + Math.abs(item.y + scroll.current.y + item.extraY + item.h / 2 - winH / 2)
            const distB = Math.abs(best.x + scroll.current.x + best.extraX + best.w / 2 - winW / 2) + Math.abs(best.y + scroll.current.y + best.extraY + best.h / 2 - winH / 2)
            return distA < distB ? item : best
            })
            primaries.push(primary)
        })

        // Step 2 — compute column widths and row heights from actual item sizes
        const colWidths = Array.from({ length: COLS }, (_, col) =>
            Math.max(...primaries.filter((_, slot) => slot % COLS === col).map(i => i.w))
        )
        const rowHeights = Array.from({ length: ROWS }, (_, row) =>
            Math.max(...primaries.filter((_, slot) => Math.floor(slot / COLS) === row).map(i => i.h))
        )

        // Step 3 — cumulative x/y start positions per column/row
        const colX: number[] = []
        const rowY: number[] = []
        colWidths.forEach((w, i) => { colX[i] = i === 0 ? 0 : colX[i - 1] + colWidths[i - 1] + GAP_X })
        rowHeights.forEach((h, i) => { rowY[i] = i === 0 ? 0 : rowY[i - 1] + rowHeights[i - 1] + GAP_Y })

        const gridW = colX[COLS - 1] + colWidths[COLS - 1]
        const gridH = rowY[ROWS - 1] + rowHeights[ROWS - 1]
        const startX = winW / 2 - gridW / 2
        const startY = winH / 2 - gridH / 2

        // Step 4 — assign gather offsets
        primaries.forEach((primary, slot) => {
            const col = slot % COLS
            const row = Math.floor(slot / COLS)
            const targetX = startX + colX[col]
            const targetY = startY + rowY[row]
            const screenX = primary.x + scroll.current.x + primary.extraX
            const screenY = primary.y + scroll.current.y + primary.extraY
            primary.gatherX = targetX - screenX
            primary.gatherY = targetY - screenY

            // send all non-primary copies back to natural position
            itemsRef.current
            .filter(i => i.baseIndex === primary.baseIndex && i !== primary)
            .forEach(i => { i.gatherX = 0; i.gatherY = 0 })
        })

        // hidden items return to natural position
        itemsRef.current.filter(i => !i.visible).forEach(i => { i.gatherX = 0; i.gatherY = 0 })
        }
        }

        itemsRef.current.forEach(item => {
        const newX = 5 * scroll.delta.x.c * item.ease + (mouse.x.c - 0.5) * item.rect.width  * 0.6
        const newY = 5 * scroll.delta.y.c * item.ease + (mouse.y.c - 0.5) * item.rect.height * 0.6

        const posX = item.x + scroll.current.x + item.extraX + newX
        const posY = item.y + scroll.current.y + item.extraY + newY

        if (!gatherRef.current.active) {
        if (dirX === "right" && posX > winW)       item.extraX -= tileSizeW
        if (dirX === "left"  && posX + item.w < 0) item.extraX += tileSizeW
        if (dirY === "down"  && posY > winH)        item.extraY -= tileSizeH
        if (dirY === "up"    && posY + item.h < 0)  item.extraY += tileSizeH
        }

        const fx = item.x + scroll.current.x + item.extraX + newX
        const fy = item.y + scroll.current.y + item.extraY + newY

        // float offset — dampened while dragging
        const dragDamp = isDragging ? 0 : 1
        const floatX = Math.sin(clock * item.floatSpeed + item.floatOffset) * item.floatAmpX * dragDamp
        const floatY = Math.cos(clock * item.floatSpeed * 0.7 + item.floatOffset) * item.floatAmpY * dragDamp

        // lerp gather — slower ease for a floaty settle
        item.gatherXC += (item.gatherX - item.gatherXC) * 0.04
        item.gatherYC += (item.gatherY - item.gatherYC) * 0.04

        item.el.style.transform = `translate(${fx + floatX + item.gatherXC}px, ${fy + floatY + item.gatherYC}px)`
        item.img.style.transform = `scale(${1.05 + 0.05 * mouse.press.c * item.ease}) translate(${-mouse.x.c * item.ease * 2}%, ${-mouse.y.c * item.ease * 2}%)`

        // opacity falloff
        const cx = fx + item.gatherXC + item.w * 0.5
        const cy = fy + item.gatherYC + item.h * 0.5
        const dx = (cx - winW * 0.5) / (winW * 0.5)
        const dy = (cy - winH * 0.5) / (winH * 0.5)
        const dist = Math.sqrt(dx * dx + dy * dy)

        const mx = (mouse.x.c * winW - cx) / winW
        const my = (mouse.y.c * winH - cy) / winH
        const mouseDist = Math.sqrt(mx * mx + my * my)
        const mouseBoost = Math.max(0, 1 - mouseDist * 3)

        const baseOpacity = Math.max(0.15, 1 - dist * 0.6)
        const finalOpacity = Math.min(1, baseOpacity + mouseBoost * 0.6)

        item.el.style.opacity = item.visible === false
        ? "0"
        : String(finalOpacity)
        item.img.style.opacity = String(Math.max(0.3, finalOpacity * 0.85))
        })

      scroll.last.x = scroll.current.x
      scroll.last.y = scroll.current.y

      rafId = requestAnimationFrame(render)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      scroll.target.x -= e.deltaX * 0.4
      scroll.target.y -= e.deltaY * 0.4
    }

function onMouseDown(e: MouseEvent) {
  e.preventDefault()
  isDragging   = true
  mouse.press.t = 1
  drag.startX  = e.clientX
  drag.startY  = e.clientY
  drag.scrollX = scroll.target.x
  drag.scrollY = scroll.target.y
  drag.prevX   = e.clientX
  drag.prevY   = e.clientY
  drag.velX    = 0
  drag.velY    = 0
  drag.lastTime = performance.now()
  document.body.style.cursor    = "grabbing"
  document.body.style.userSelect = "none"
}

    function onMouseUp() {
    if (!isDragging) return   // ← ignore mouseups that aren't from a drag

    isDragging    = false
    mouse.press.t = 0
    document.body.style.cursor     = "grab"
    document.body.style.userSelect = ""

    const MOMENTUM = 14
    scroll.target.x += drag.velX * MOMENTUM
    scroll.target.y += drag.velY * MOMENTUM

    drag.velX = 0   // ← clear velocity so a stale value can't re-fire
    drag.velY = 0
    }

    function onMouseMove(e: MouseEvent) {
    mouse.x.t = e.clientX / winW
    mouse.y.t = e.clientY / winH

    if (isDragging) {
        const now = performance.now()
        const dt  = Math.max(1, now - drag.lastTime)  // ms since last move

        // smooth velocity (exponential moving average)
        drag.velX = drag.velX * 0.6 + ((e.clientX - drag.prevX) / dt) * 16 * 0.4
        drag.velY = drag.velY * 0.6 + ((e.clientY - drag.prevY) / dt) * 16 * 0.4

        drag.prevX    = e.clientX
        drag.prevY    = e.clientY
        drag.lastTime = now

        scroll.target.x = drag.scrollX + (e.clientX - drag.startX)
        scroll.target.y = drag.scrollY + (e.clientY - drag.startY)
    }
    }

let touchStartX = 0, touchStartY = 0, touchScrollX = 0, touchScrollY = 0
let touchVelX = 0, touchVelY = 0
let touchPrevX = 0, touchPrevY = 0
let touchLastTime = 0

function onTouchStart(e: TouchEvent) {
  touchStartX   = e.touches[0].clientX
  touchStartY   = e.touches[0].clientY
  touchScrollX  = scroll.target.x
  touchScrollY  = scroll.target.y
  touchPrevX    = touchStartX
  touchPrevY    = touchStartY
  touchVelX     = 0
  touchVelY     = 0
  touchLastTime = performance.now()
  mouse.press.t  = 1
  document.body.style.userSelect = "none"
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  const t   = e.touches[0]
  const now = performance.now()
  const dt  = Math.max(1, now - touchLastTime)

  touchVelX = touchVelX * 0.6 + ((t.clientX - touchPrevX) / dt) * 16 * 0.4
  touchVelY = touchVelY * 0.6 + ((t.clientY - touchPrevY) / dt) * 16 * 0.4

  touchPrevX    = t.clientX
  touchPrevY    = t.clientY
  touchLastTime = now

  scroll.target.x = touchScrollX + (t.clientX - touchStartX)
  scroll.target.y = touchScrollY + (t.clientY - touchStartY)
}

    function onTouchEnd() {
    if (mouse.press.t === 0) return   // guard against double-fire

    mouse.press.t = 0
    document.body.style.userSelect = ""

    const MOMENTUM = 14
    scroll.target.x += touchVelX * MOMENTUM
    scroll.target.y += touchVelY * MOMENTUM

    touchVelX = 0
    touchVelY = 0
    }

    window.addEventListener("resize",    build)
    window.addEventListener("wheel",     onWheel, { passive: false })
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup",   onMouseUp)
    container.addEventListener("mousedown",  onMouseDown)
    container.addEventListener("touchstart", onTouchStart, { passive: true })
    container.addEventListener("touchmove",  onTouchMove,  { passive: false })
    container.addEventListener("touchend",   onTouchEnd)

    document.body.style.cursor = "grab"

    // exact order from original: render → build → initIntro → intro
    render()
    build()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // make all items visible
        itemsRef.current.forEach(item => { item.el.style.opacity = "1" })
        initIntro()
        intro()
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      gsap.killTweensOf("*")
      window.removeEventListener("resize",    build)
      window.removeEventListener("wheel",     onWheel)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup",   onMouseUp)
      container.removeEventListener("mousedown",  onMouseDown)
      container.removeEventListener("touchstart", onTouchStart)
      container.removeEventListener("touchmove",  onTouchMove)
      container.removeEventListener("touchend",   onTouchEnd)
      document.body.style.cursor = ""
    }
  }, [])

return (
  <>

    {/* Grid */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        userSelect: "none",
        zIndex: 1,
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }}
    >
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", position: "relative", cursor: "grab" }}
      />
    </div>

    {/* Filter UI */}
    <div
      style={{
        position: "fixed",
        top: "calc(var(--topnav-height, 80px) + 0.15rem)",
        left: 0,
        width: "100vw",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
        
      {/* Row 1 — category buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(prev => prev === cat ? null : cat)}
            onMouseDown={e => e.preventDefault()}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              border: `1px solid ${activeCategory === cat ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}`,
              background: activeCategory === cat ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.3)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              color: activeCategory === cat ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: '"pyeonghwa", sans-serif',
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Row 2 — tags button + dropdown */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <button
          onClick={() => setTagsOpen(prev => !prev)}
          onMouseDown={e => e.preventDefault()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "999px",
            border: `1px solid ${tagsOpen ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}`,
            background: tagsOpen ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.3)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            color: tagsOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: '"pyeonghwa", sans-serif',
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          # Tags
          {activeTags.length > 0 && (
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "999px",
                padding: "1px 6px",
                fontSize: "10px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {activeTags.length}
            </span>
          )}
        </button>

        {tagsOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "10px",
              backdropFilter: "blur(12px)",
              minWidth: "140px",
            }}
          >
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                onMouseDown={e => e.preventDefault()}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: '"pyeonghwa", sans-serif',
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: "4px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  paddingBottom: "8px",
                  width: "100%",
                }}
              >
                Clear all
              </button>
            )}
            {allTags.map(tag => {
              const active = activeTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  onMouseDown={e => e.preventDefault()}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    border: "none",
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    fontFamily: '"pyeonghwa", sans-serif',
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    width: "100%",
                  }}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>

    {/* Lightbox overlay */}
    {selectedItem && (
      <div
        onClick={() => setSelectedItem(null)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(0,0,0,0.6)",
          animation: "fadeIn 0.3s ease",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          <img
            src={selectedItem.src}
            alt={selectedItem.caption}
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "4px",
              display: "block",
            }}
          />
          <span
            style={{
              fontFamily: '"pyeonghwa", sans-serif',
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {selectedItem.caption}
          </span>
        </div>
      </div>
    )}
  </>
)
}