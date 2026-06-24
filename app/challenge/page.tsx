import { UrgencyBar } from "@/components/challenge/UrgencyBar";
import { ChallengeHeader } from "@/components/challenge/ChallengeHeader";
import { Hero } from "@/components/challenge/Hero";
import { Stats } from "@/components/challenge/Stats";
import { Press } from "@/components/challenge/Press";
import { LeadFormSection } from "@/components/challenge/LeadFormSection";
import { TestimonialsCarousel } from "@/components/challenge/TestimonialsCarousel";
import { PlansCarousel } from "@/components/challenge/PlansCarousel";
import { Partners } from "@/components/challenge/Partners";
import { GoogleReviews } from "@/components/challenge/GoogleReviews";
import { ExpertsMini } from "@/components/challenge/ExpertsMini";
import { SpinWheel } from "@/components/challenge/SpinWheel";
import { FinalCTA } from "@/components/challenge/FinalCTA";
import { ChallengeFooter } from "@/components/challenge/ChallengeFooter";
import { Confetti } from "@/components/challenge/Confetti";
import { Mascot } from "@/components/challenge/Mascot";
import { JoinerToasts } from "@/components/challenge/JoinerToasts";
import { ExitIntentModal } from "@/components/challenge/ExitIntentModal";
import { StickyCTA } from "@/components/challenge/StickyCTA";
import { ScrollReveal } from "@/components/challenge/ScrollReveal";

/**
 * Lean Protocol — 30 Days Hard Challenge marketing campaign page.
 * Standalone, isolated from the rest of leanprotocol.in: no Header,
 * no Footer, no main-site nav (see app/challenge/layout.tsx).
 */
export default function ChallengePage() {
  return (
    <>
      <UrgencyBar />
      <ChallengeHeader />
      <Hero />
      <Stats />
      <Press />
      <LeadFormSection />
      <TestimonialsCarousel />
      <PlansCarousel />
      <Partners />
      <GoogleReviews />
      <ExpertsMini />
      <SpinWheel />
      <FinalCTA />
      <ChallengeFooter />

      {/* Fixed/overlay UI — rendered once, positioned via CSS */}
      <Confetti />
      <Mascot />
      <JoinerToasts />
      <ExitIntentModal />
      <StickyCTA />

      {/* Watches all .reveal sections and fades them in on scroll —
          without this, sections using the "reveal" class stay at
          opacity:0 forever (see .reveal in challenge.css) */}
      <ScrollReveal />
    </>
  );
}
