"use client"

import { useState, useRef, useEffect } from "react"
import { books, categories, type Book } from "@/lib/data/books"

// ─── single source of truth for all card styles ───────────────────────────────
const card = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
    padding: "1.5rem 0",
  },
  year: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "1.5rem",
    lineHeight: "1.5rem",
    letterSpacing: "0.08em",
    marginBottom: "1.5rem",
    fontFamily: '"pyeonghwa", sans-serif',
  },
  titleKo: {
    color: "rgba(255,255,255,1)",
    fontSize: "2rem",
    lineHeight: "2rem",
    margin: 0,
  },
  titleEn: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "2rem",
    lineHeight: "2rem",
    margin: 0,
  },
  publisher: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "1rem",
    lineHeight: "1rem",
    letterSpacing: "0.06em",
    marginTop: "1.5rem",
  },
  info: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "1rem",
    lineHeight: "1rem",
    letterSpacing: "0.04em",
  },
}
// ─────────────────────────────────────────────────────────────────────────────

function BookCard({ book }: { book: Book }) {
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      style={card.wrapper}
      className="text-center px-8 md:px-0 md:text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor-following image — fixed to viewport */}
        {book.image && (
        <div
            style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            transform: `translate(-50%, -50%) scale(${hovered ? 1 : 0})`,
            width: "250px",
            height: "auto",
            maxHeight: "300px",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
            zIndex: 50,
            }}
        >
            <img
            src={book.image}
            alt=""
            style={{ width: "100%", height: "auto", display: "block" }}
            />
        </div>
        )}

      {/* Content */}
      <div style={{ mixBlendMode: "difference", position: "relative", zIndex: 50 }}>
        <button
        style={{
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            outline: "1px solid transparent",
            color: "rgba(255,255,255,1)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,1)",
            padding: "0.8rem 1rem",
            background: "transparent",
            cursor: "default",
            width: "fit-content",
            margin: "0 auto 1.5rem",
            fontSize: "2rem",
            lineHeight: "2rem",
            letterSpacing: "0.08em",
            fontFamily: '"pyeonghwa", sans-serif',
        }}
        >
        {book.year}
        </button>
      <p style={card.titleKo}>{book.titleKo}</p>
      {book.titleEn && <p style={card.titleEn}>{book.titleEn}</p>}
      <p style={card.publisher}>{book.publisherEn ?? book.publisher}</p>
      {book.info && <p style={card.info}>{book.info}</p>}
    </div>
    </div>
  )
}

export default function BooksPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    let lenis: any
    let rafId: number

    const init = async () => {
      const { default: Lenis } = await import("lenis")
      lenis = new Lenis()
      function raf(time: number) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    init()

    return () => {
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

    const filtered = (activeCategory
    ? books.filter(b => b.category === activeCategory)
    : books
    ).sort((a, b) => parseInt(a.year) - parseInt(b.year))
    console.log(filtered.map(b => b.year))

        const buttonStyle = (active: boolean) => ({
        padding: "6px 14px",
        borderRadius: "999px",
        border: `1px solid ${active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}`,
        background: active ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.3)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
        fontSize: "11px",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        fontFamily: '"pyeonghwa", sans-serif',
        cursor: "pointer",
        transition: "all 0.2s ease",
        })

  return (
    <main className="pb-16">

      {/* Filter buttons */}
        <div
        style={{
            position: "fixed",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            outline: "1px solid transparent",
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
          onClick={() => setActiveCategory(null)}
          onMouseDown={e => e.preventDefault()}
          style={buttonStyle(activeCategory === null)}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(prev => prev === cat ? null : cat)}
            onMouseDown={e => e.preventDefault()}
            style={buttonStyle(activeCategory === cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
        <div
        className="px-16 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-16"
        style={{
            paddingTop: "calc(var(--topnav-height, 80px) + 64px)",
            paddingBottom: "calc(var(--topnav-height, 80px))",
            maxWidth: "1200px",
            margin: "0 auto",
        }}
        >
        {filtered.map((book, i) => (
          <BookCard key={i} book={book} />
        ))}
      </div>

    </main>
  )
}