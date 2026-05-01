export default function BlurVignette() {
  return (
    <>
      {/* Top blur */}
      <div
        className="fixed top-0 left-0 right-0 z-100 pointer-events-none"
        style={{
          height: "100px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          backdropFilter: "blur(100px)",
        }}
      />
      {/* Bottom blur */}
      <div
        className="fixed bottom-0 left-0 right-0 z-100 pointer-events-none"
        style={{
          height: "100px",
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          backdropFilter: "blur(100px)",
        }}
      />
    </>
  )
}