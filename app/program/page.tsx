import Footer from "@/components/footer"
import { Header } from "@/components/header"
import ProgramCalculator from "@/components/program/program-calculator"
import ProgramComparison from "@/components/program/program-comparison"
import ProgramCTA from "@/components/program/program-cta"
import ProgramFeatures from "@/components/program/program-features"
import { ProgramHero } from "@/components/program/program-hero"
import ProgramHowItWorks from "@/components/program/program-howitworks"
import ProgramTestimonials from "@/components/program/program-testimonials"
import type { Metadata } from "next"

// An older page that is no longer in the menu. Kept reachable by link, hidden from search.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function ProgramPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ProgramHero />
      <ProgramFeatures />
      <ProgramCalculator />
      <ProgramHowItWorks />
      <ProgramComparison />
      <ProgramTestimonials />
      <ProgramCTA />
      <Footer/>
    </main>
  )
}
