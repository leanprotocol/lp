import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function MedicationsHero() {
  return (
    <section className="relative w-full bg-accent2/40 -mt-20 py-12 lg:py-18">
      <div className="container mx-auto px-4 lg:px-8 pt-20 md:pt-16">
        <div className="flex flex-col items-center text-center mb-6">
          {/* Main headline */}
          <h1 className=" heading max-w-6xl">
            If medication is valid for every other health condition, <span className="italic opacity-70">it’s valid for <span className="border-b-2 border-dark/70">fat loss too.</span></span>
          </h1>

        </div>

        {/* Hero image */}
        <div className="relative w-full max-w-4xl mx-auto aspect-[16/7] rounded-3xl overflow-hidden">
          <Image
            src="/medications-hero-mobile.jpg"
            alt="Lean Protocol weight loss medication pens"
            fill
            priority
            className="object-cover md:hidden"
            sizes="(max-width: 767px) 100vw"
          />
          <Image
            src="/medications-hero-web.jpg"
            alt="Lean Protocol weight loss medication pens"
            fill
            priority
            className="hidden object-cover md:block"
            sizes="(min-width: 768px) 100vw"
          />
        </div>

        
         <div className="flex justify-center items-center mt-6">
          <Link href="/get-started">
          <Button size="lg" className="bg-dark mt-4 hover:bg-dark/90 text-white rounded-full text-base cursor-pointer h-12 w-40 px-8">
            Get started
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          </Link>
         </div>
      </div>
    </section>
  )
}
