import { Header } from "@/components/header"
import Footer from "@/components/footer"
import PricingClient from "./PricingClient "
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing | Lean Healthcare Weight Loss Plans from ₹2,299",
  description: "Choose your Lean Protocol plan...",
  openGraph: { images: ["/og-image.jpg"] },
}

export default function PricingPage() {
  return (
    <section>
      <Header />
      <PricingClient />
      <Footer />
    </section>
  )
}
