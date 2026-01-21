import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function MicrodoseSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - text content */}
          <div>
            <h2 className="heading">
              GLP-1 Microdose <br /> program
            </h2>
            <p className="sub-heading text-dark/70">A simpler way to start GLP-1s</p>
            <Button className="bg-[#B8CCC5] hover:bg-[#A8BDB5] text-[#3D4F4A] rounded-full w-40 px-8 h-12">
              Learn more
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right column - image with hexagonal overlay */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/woman-stretching-medication.jpg"
                alt="Woman stretching with Lean medication"
                className="w-full h-[300px] object-cover"
              />
              {/* Hexagonal accent overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 400 400" className="absolute top-0 left-0 w-32 h-32 text-[#B8CCC5] opacity-50">
                  <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
