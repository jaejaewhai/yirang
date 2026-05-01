"use client"

import VideoIntro from "@/components/layout/videointro"
import AboutPage from "@/components/about/about"
import WorksPage from "@/components/works/works"
import MusicOverlay from "@/components/music/musicoverlay"
import BooksPage from "@/components/books/books"
import { useSection } from "@/lib/context/SectionContext"

export default function Home() {
  const { activeSection } = useSection()

  const isOverlay = activeSection === "works" || activeSection === "about" || activeSection === "music" || activeSection === "books" 

  return (
    <main className="relative">
      {activeSection === "music" && <MusicOverlay onClose={() => {}} />}
      {activeSection === "about" && <AboutPage />}
      {activeSection === "works" && <WorksPage />}
      {activeSection === "books" && <BooksPage />}
      {!activeSection && <VideoIntro />}
      {!isOverlay && <div className="h-[200vh]" />}
    </main>
  )
}