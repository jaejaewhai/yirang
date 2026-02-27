"use client"

import Link from "next/link"

const navItems = [
  { label: "About", href: "/about" },
  { label: "Illustrations", href: "/illustrations" },
  { label: "Books", href: "/books" },
  { label: "Essays", href: "/essays" },
  { label: "Music", href: "/music" },
  { label: "Store", href: "/store" },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-0 flex flex-col items-center px-8 py-5 gap-2">
      <div className="flex items-center justify-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-300"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <span className="text-xs text-white/30">© 2026 Lang Lee. All rights reserved.</span>
    </nav>
  )
}