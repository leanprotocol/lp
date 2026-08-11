"use client";

// components/campaign/campaign-page.tsx
// Orchestrator for the pro.leanprotocol.in campaign page.
// Preserves the affiliate logic from AffiliateLandingPage: 90-day cookie +
// click tracking, /api/plans, /api/user/me auth check, OTP-gated Razorpay
// checkout by plan id.
//
// Difference from /lp/[ref]: there is no ref path segment on this domain,
// so the ref is optional and comes from ?ref= when present. If absent, any
// existing affiliate_ref cookie set by a previous /lp/[ref] visit still
// applies at checkout - we neither set nor clear it here.

import { useEffect, useMemo, useState } from "react";
import OTPModal from "@/components/get-started/otp-modal";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import type { MedTrack } from "@/content/campaign";

import { CampaignHeader } from "./campaign-header";
import { PlansHero, type DbPlan } from "./plans-hero";
import { PressStrip, ProofSection } from "./proof-sections";
import { HowSection } from "./how-section";
import {
  StoriesMarquee,
  ExpertsSection,
  ConsultSection,
  SymptomsSection,
  FaqSection,
  FinalCta,
  CampaignFooter,
  StickyBuyBar,
} from "./rest-sections";

interface CampaignPageProps {
  /** Optional. Passed by a route that has a ref segment; on the pro
   *  subdomain the ref is read from ?ref= instead. */
  affiliateRef?: string;
}

const inr = (n: number) => "\u20B9" + Math.round(n).toLocaleString("en-IN");

const isConsultPlan = (p: DbPlan) =>
  p.durationDays <= 15 || p.name.toLowerCase().includes("doctor");

export function CampaignPage({ affiliateRef }: CampaignPageProps) {
  const [med, setMed] = useState<MedTrack>("SEMAGLUTIDE");
  const [plansByTrack, setPlansByTrack] = useState<Record<MedTrack, DbPlan[]>>({
    SEMAGLUTIDE: [],
    MOUNJARO: [],
  });
  const [plansLoading, setPlansLoading] = useState(true);

  const [showOTP, setShowOTP] = useState(false);
  const [pendingCheckoutPlanId, setPendingCheckoutPlanId] = useState<
    string | null
  >(null);
  const { openCheckout, isLoading: isCheckoutLoading } = useRazorpayCheckout();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setAuthChecked] = useState(false);

  const [selInfo, setSelInfo] = useState<{
    label: string;
    price: string;
    planId: string | null;
    isConsult: boolean;
  } | null>(null);

  // ?med=mounjaro deep link
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("med");
      if (q && q.toLowerCase() === "mounjaro") setMed("MOUNJARO");
    } catch {}
  }, []);

  // Affiliate cookie + click tracking. Ref comes from the prop when a route
  // supplies one, otherwise from ?ref=. No ref means no cookie write.
  useEffect(() => {
    let ref = affiliateRef || "";
    if (!ref) {
      try {
        ref = new URLSearchParams(window.location.search).get("ref") || "";
      } catch {}
    }
    if (!ref) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90);
    document.cookie =
      "affiliate_ref=" +
      ref +
      "; path=/; domain=.leanprotocol.in; expires=" +
      expiryDate.toUTCString() +
      "; SameSite=Lax";
    fetch("/api/affiliate/track-click", {
      method: "POST",
      body: JSON.stringify({ ref }),
      headers: { "Content-Type": "application/json" },
    }).catch(console.error);
  }, [affiliateRef]);

  // Plans (both tracks in parallel) + auth check
  useEffect(() => {
    const load = (type: MedTrack) =>
      fetch("/api/plans?type=" + type)
        .then((res) => res.json())
        .then((data) =>
          data.success ? (data.plans as DbPlan[]) : ([] as DbPlan[])
        )
        .catch((e) => {
          console.error(e);
          return [] as DbPlan[];
        });

    Promise.all([load("SEMAGLUTIDE"), load("MOUNJARO")])
      .then(([sema, mounjaro]) =>
        setPlansByTrack({ SEMAGLUTIDE: sema, MOUNJARO: mounjaro })
      )
      .finally(() => setPlansLoading(false));

    fetch("/api/user/me?optional=1")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setIsLoggedIn(true);
      })
      .catch(console.error)
      .finally(() => setAuthChecked(true));
  }, []);

  const handleBuyNow = (planId: string) => {
    if (!planId) return;
    if (isLoggedIn) {
      openCheckout(planId);
    } else {
      setPendingCheckoutPlanId(planId);
      setShowOTP(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowOTP(false);
    if (pendingCheckoutPlanId) {
      openCheckout(pendingCheckoutPlanId);
      setPendingCheckoutPlanId(null);
    }
  };

  const activePlans = plansByTrack[med];
  const showMedToggle = plansByTrack.MOUNJARO.length > 0;

  const consultPlan = useMemo(
    () => activePlans.find(isConsultPlan),
    [activePlans]
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1C2B22]">
      <CampaignHeader />

      <PlansHero
        med={med}
        onMedChange={setMed}
        showMedToggle={showMedToggle}
        dbPlans={activePlans}
        plansLoading={plansLoading}
        onBuyNow={handleBuyNow}
        isCheckoutLoading={isCheckoutLoading}
        onSelectedPlanChange={setSelInfo}
      />

      <PressStrip />
      <ProofSection />
      <HowSection />
      <StoriesMarquee />
      <ExpertsSection />
      <ConsultSection
        price={consultPlan ? inr(consultPlan.price) : undefined}
        was={
          consultPlan?.originalPrice ? inr(consultPlan.originalPrice) : undefined
        }
      />
      <SymptomsSection />
      <FaqSection />
      <FinalCta />
      <CampaignFooter />

      {selInfo && (
        <StickyBuyBar
          label={selInfo.label}
          price={selInfo.price}
          planId={selInfo.planId}
          isConsult={selInfo.isConsult}
          onBuyNow={handleBuyNow}
          isCheckoutLoading={isCheckoutLoading}
        />
      )}

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onNext={handleAuthSuccess}
      />
    </div>
  );
}
