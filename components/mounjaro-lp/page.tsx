"use client";
import { useState, useEffect } from "react";
import OTPModal from "@/components/get-started/otp-modal";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { HeroSection } from "@/components/affiliate-lp/hero-section";
import { SocialProof } from "@/components/affiliate-lp/social-proof";
import { ProcessGuarantee } from "@/components/affiliate-lp/process-guarantee";
import { SocialTrust } from "@/components/affiliate-lp/social-trust";
import { EligibilityFAQ } from "@/components/affiliate-lp/eligibility-faq";
import { NewsSection } from "@/components/news-section";

function SemaglutideBanner() {
  return (
    <a href="/lp/ABHI" className="w-full bg-[#0A2422] text-white py-3 px-4 flex items-center justify-center gap-3 text-sm hover:bg-[#0d2e2b] transition-colors">
      <span className="text-white/70">Looking for GLP-1 (Semaglutide) plans?</span>
      <span className="font-semibold text-[#14B8A6]">Click here →</span>
    </a>
  );
}

export function MounjaroLandingPage() {
  const [showOTP, setShowOTP] = useState(false);
  const [pendingCheckoutPlanId, setPendingCheckoutPlanId] = useState<string | null>(null);
  const { openCheckout, isLoading: isCheckoutLoading } = useRazorpayCheckout();
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/plans?type=MOUNJARO")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDbPlans(data.plans);
        }
      })
      .catch(console.error);

    fetch("/api/user/me?optional=1")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setIsLoggedIn(true);
        }
      })
      .catch(console.error)
      .finally(() => setAuthChecked(true));
  }, []);

  const handleBuyNow = (planTitle: string) => {
    const dbPlan = dbPlans.find(p =>
      p.name.toLowerCase().includes(planTitle.toLowerCase().split(" ")[0])
    );
    const planId = dbPlan ? dbPlan.id : dbPlans[0]?.id;

    if (planId) {
      if (isLoggedIn) {
        openCheckout(planId);
      } else {
        setPendingCheckoutPlanId(planId);
        setShowOTP(true);
      }
    } else {
      alert("Plans are currently being updated. Please try again later.");
    }
  };

  const handleAuthSuccess = () => {
    setShowOTP(false);
    if (pendingCheckoutPlanId) {
      openCheckout(pendingCheckoutPlanId);
      setPendingCheckoutPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-lp-bg">
      <SemaglutideBanner />
      <div id="pricing">
        <HeroSection
          onBuyNow={handleBuyNow}
          isCheckoutLoading={isCheckoutLoading}
          dbPlans={dbPlans}
          pageTitle="Mounjaro Based Complete Transformation Plan"
          medicationType="MOUNJARO"
        />
      </div>
      <NewsSection />
      <SocialProof />
      <ProcessGuarantee />
      <SocialTrust />
      <EligibilityFAQ />
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onNext={handleAuthSuccess}
      />
    </div>
  );
}