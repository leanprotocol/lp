import Footer from "@/components/footer"
import { Header } from "@/components/header"
import BenefitsRotating from "@/components/reviews/benefits"
import ReviewHero from "@/components/reviews/review-hero"

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ReviewHero />
      <BenefitsRotating />
      <Footer/>
    </main>
  )
}
