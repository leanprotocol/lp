import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

/**
 * Final CTA section for medications page
 * Encourages users to get started with their health journey
 */
export function FinalCTA() {
  return (
    <section className="py-10 md:py-24 px-4 bg-[#D4E5C4]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center gap-6 md:gap-10">
          {/* Hero image */}
          <div className="order-1 relative w-full max-w-3xl aspect-[16/8] rounded-3xl overflow-hidden">
            <Image
              src="/medication-cta.png"
              alt="Two friends laughing together"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Heading */}
          <div className="order-2">
            <div className="max-w-4xl ">
              <h2 className="heading">
                Lean Protocol <br />
                Not just medication, a <span className="italic opacity-70">complete medical ecosystem.</span>
              </h2>
            </div>
          </div>

          <div className="order-3 flex justify-center items-center pt-2 md:pt-0">
            <Link href="/get-started">
              <button className="bg-dark mt-2 md:mt-4 text-white h-12 w-40 flex justify-center items-center rounded-full font-medium hover:bg-dark/90 cursor-pointer transition-colors flex items-center gap-2 group">
                Get started
                <ArrowRight className="w-4 h-4 " />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
