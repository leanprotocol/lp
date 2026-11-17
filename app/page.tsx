import dynamic from "next/dynamic"
import { Header } from "@/components/header";
import { Hero, InsuranceLogos } from "@/components/hero";
import { ParallaxJourney } from "@/components/parallax-journey";
import { MicrodoseSection } from "@/components/microdose-section";
import { StatsSection } from "@/components/stats-section";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { DoctorTestimonial, DoctorsSection } from "@/components/doctor-testimonial";
import MembersServed from "@/components/members-served";
const MedicationToolkit = dynamic(() => import("@/components/medication-toolkit"))
const InsuranceCoverage = dynamic(() => import("@/components/insurance-coverage"))
const BenefitsMarquee = dynamic(() => import("@/components/benefits-marquee"))
import Footer from "@/components/footer";
import CausesSection from "@/components/causes-section";
const WeightSlider = dynamic(() => import("@/components/weight-slider").then(m => ({ default: m.WeightSlider })))
import { MobileStatsCard } from "@/components/mobile-stats-card";
import { PricingCarousel } from "@/components/pricing-carousel";
const WeightLossChart = dynamic(() => import("@/components/weight-loss-chart").then(m => ({ default: m.WeightLossChart })))
import { VideoSection } from "@/components/video-section"
import { NewsSection } from "@/components/news-section";
import { TrustedPartners } from "@/components/trusted-partners";
import type { Metadata } from "next";

const SITE = "https://www.leanprotocol.in";

/* The homepage's main address for search engines. Title and description come from app/layout.tsx. */
export const metadata: Metadata = {
  alternates: { canonical: SITE },
};

/* Tells search engines who runs this site. Every value here is already shown in the footer. */
const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lean Protocol",
  legalName: "Lean Protocol Private Limited",
  url: SITE,
  logo: `${SITE}/logo-cropped.png`,
  email: "support@leanprotocol.in",
  telephone: "+91 96504 91267",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lean Protocol",
  url: SITE,
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Header />

      {/* 1  Hero + ticker */}
      <Hero />

      {/* 2  Journey - 560vh sticky scroll */}
      <ParallaxJourney />

      {/* 3  Explainer video */}
      <VideoSection />

      {/* 4  Metric cards */}
      <StatsSection />

      {/* 5  Results film strip - 320vh sticky scroll */}
      <TestimonialsCarousel />

      {/* 6  Weight estimate */}
      <WeightSlider />

      {/* 6b  Clinical outcomes chart */}
      <WeightLossChart />

      {/* 7  Pricing - prices read live from /api/plans */}
      <div id="pricing">
        <PricingCarousel />
      </div>

      {/* 8  Press. news-section.tsx is shared with the affiliate page and
             /gip, so it has not been redesigned yet. */}
      <NewsSection />

      {/* 9  Experts marquee */}
      <DoctorsSection />

      {/* 9b  Trusted partners */}
      <TrustedPartners />

      {/* 10  Benefits marquees */}
      <BenefitsMarquee />

      <Footer />
</main>
  );
}
