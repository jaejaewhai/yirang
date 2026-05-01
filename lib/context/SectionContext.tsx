"use client"

import { createContext, useContext, useState } from "react"

type SectionContextType = {
  activeSection: string | null
  setActiveSection: (section: string | null) => void
}

const SectionContext = createContext<SectionContextType>({
  activeSection: null,
  setActiveSection: () => {}
})

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  )
}

export const useSection = () => useContext(SectionContext)