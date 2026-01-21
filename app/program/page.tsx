import Footer from "@/components/footer"
import { Header } from "@/components/header"
import ProgramCalculator from "@/components/program/program-calculator"
import ProgramComparison from "@/components/program/program-comparison"
import ProgramCTA from "@/components/program/program-cta"
import ProgramFeatures from "@/components/program/program-features"
import { ProgramHero } from "@/components/program/program-hero"
import ProgramHowItWorks from "@/components/program/program-howitworks"
import ProgramTestimonials from "@/components/program/program-testimonials"

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
