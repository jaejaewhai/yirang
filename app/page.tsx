import VideoIntro from "@/components/layout/videointro"
import BottomNav from "@/components/layout/bottomnav"
import SidePanel from "@/components/layout/sidepanel"
import TopNav from "@/components/layout/topnav"

export default function Home() {
  return (
    <main className="relative">
      <VideoIntro />
      <SidePanel />
      <BottomNav />
      <TopNav />
      <div className="h-[200vh]" />
    </main>
  )
}