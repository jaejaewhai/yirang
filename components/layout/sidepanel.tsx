import Image from "next/image"

export default function SidePanel() {
  return (
    <>
      {/* right Panel */}
      <div className="fixed right-0 top-0 h-full w-1/6 flex flex-col items-center justify-center gap-6 px-4" style={{ mixBlendMode: "difference", zIndex: 2 }}>
        <div className="relative w-60 h-40">
          <Image
            src="/langlee_logo_type_white.png"
            alt="Artist portrait"
            fill
            className="object-cover logo-rotate"
          />
        </div>
        <div className="text-center">
          <p className="text-white/50 text-xs mt-2 leading-relaxed">
            
          </p>
        </div>
      </div>

      {/* left Panel */}
        <div className="fixed left-0 top-0 h-full w-1/6 flex flex-col items-center justify-center gap-6 px-4" style={{ mixBlendMode: "difference", zIndex: 2 }}
>
        <div className="text-center">
            <h1 className="tracking-widest uppercase text-8xl h-40 flex items-center text-white">
      이랑
            </h1>
        </div>
        <div className="text-center">
            <p className="text-white/50 text-xs mt-2 leading-relaxed">
     
            </p>
  </div>
</div>
    </>
  )
}