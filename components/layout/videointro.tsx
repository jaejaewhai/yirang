"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

const videos = [
  "/videos/intro/imjingang.mp4",
  "/videos/intro/everyonehatesme.mov",
  "/videos/intro/playinggod.mov",
]

export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    video.src = videos[Math.floor(Math.random() * videos.length)]
    video.play()

    let animId: number
    const draw = () => {
      if (video.readyState >= 2) {
        const vw = video.videoWidth
        const vh = video.videoHeight
        const cw = canvas.width
        const ch = canvas.height
        const scale = Math.max(cw / vw, ch / vh)
        const x = (cw - vw * scale) / 2
        const y = (ch - vh * scale) / 2
        ctx.drawImage(video, x, y, vw * scale, vh * scale)
      }
      animId = requestAnimationFrame(draw)
    }

    video.addEventListener("play", draw)

    const lenis = new Lenis()
    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      lenis.destroy()
    }
  }, [])

  const handleClick = () => {
    if (!videoRef.current) return
    if (videoRef.current.muted) {
      videoRef.current.muted = false
      return
    }
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause()
  }

  return (
    <div className="fixed inset-0 video-shrink-container" style={{ zIndex: 1 }}>
      <video ref={videoRef} className="hidden" loop muted playsInline />
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full cursor-pointer"
      />
    </div>
  )
}