import { Play } from "lucide-react"

/**
 * Video section explaining the science behind weight loss medication
 * Features decorative gradient waves background
 */
export function ScienceVideoSection() {
  return (
    <section className="w-full bg-[#2C3E3A] py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
            The science behind medication for weight loss
          </h2>
          <p className="text-lg text-white/80">
            Think of medication as your best offense rather than your last resort. It can work with your biology instead
            of against it to unlock sustainable weight loss.
          </p>
        </div>

        {/* Video player placeholder */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-[#2C3E3A] via-[#3D5651] to-[#2C3E3A]">
          {/* Decorative gradient waves */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-[#A8B8E6] via-[#E8C5A0] to-[#A8B8E6] opacity-40 blur-3xl transform -rotate-12" />
            <div className="absolute bottom-1/4 right-0 w-full h-32 bg-gradient-to-r from-[#E8C5A0] via-[#A8B8E6] to-[#E8C5A0] opacity-40 blur-3xl transform rotate-12" />
          </div>

          {/* Play button */}
          <button className="absolute inset-0 flex items-center justify-center group">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </button>

          {/* Lean Protocol watermark */}
          <div className="absolute bottom-8 left-8">
            <span className="font-serif text-3xl text-white/60">found</span>
          </div>
        </div>
      </div>
    </section>
  )
}
