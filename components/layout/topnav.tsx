import Link from "next/link"

export default function TopNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-0 flex flex-col items-center px-8 py-5 gap-2">
      <p className="text-white/50 text-md mt-2 leading-relaxed max-w-xs text-center">
        Lang Lee is a multidisciplinary artist who traverses genres and mediums. <br /> Her work touches on notions of self, womanhood, belonging, culture and gender.
      </p>
    </div>
  )
}