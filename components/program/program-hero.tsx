import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function ProgramHero() {
  return (
   <div className="bg-background">
       <section className="max-w-7xl mx-auto relative w-full overflow-hidden">
      <div className="container mx-auto px-6 lg:px-14 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl py-10">
            <h1 className="font-serif text-5xl lg:text-[3.5rem] leading-[1.2] text-[#191919] mb-6">
              Weight care that <br />
              <span className="italic opacity-70">works</span>
            </h1>
            
            <p className="text-[#4A4A4A] text-sm mb-10 leading-relaxed max-w-md">
              Everyone has a different path to health, and we&apos;re here to help you find yours.
            </p>

            <Button 
              asChild 
              className="bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-full w-48 px-8 py-6 text-base font-medium transition-all"
            >
              <Link href="/quiz">
                Take the quiz
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Right Content: Organic Shape Image */}
<div className="relative w-full aspect-4/5 lg:aspect-square">
            <div className="relative w-full h-full rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden transform transition-transform duration-500 ease-out">
              <Image
                src="https://cdn.prod.website-files.com/65d8ac86401a1ef9f1915fdb/664f62612ca080de623786ad_Program%20-%20hero%20-%20desktop.webp" // Make sure to add this image to your public folder
                alt="Lean Protocol weight care app and medication"
                fill
                className="object-cover"
                priority
              />
            </div>
            </div>

        </div>
      </div>
    </section>
   </div>
  )
}