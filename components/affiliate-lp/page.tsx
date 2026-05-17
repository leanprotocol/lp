"use client";

import { useState, useEffect } from "react";
import OTPModal from "@/components/get-started/otp-modal";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { SpinToWin } from "@/components/spin-to-win";

// Section Components
import { HeroSection } from "./hero-section";
import { SocialProof } from "./social-proof";
import { ProcessGuarantee } from "./process-guarantee";
import { SocialTrust } from "./social-trust";
import { EligibilityFAQ } from "./eligibility-faq";
import { NewsRibbon } from "@/components/news-ribbon";

interface AffiliateLandingPageProps {
  affiliateRef: string;
}

export function AffiliateLandingPage({ affiliateRef }: AffiliateLandingPageProps) {
  const [showOTP, setShowOTP] = useState(false);
  const [pendingCheckoutPlanId, setPendingCheckoutPlanId] = useState<string | null>(null);
  const { openCheckout, isLoading: isCheckoutLoading } = useRazorpayCheckout();
  const [dbPlans, setDbPlans] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Set the affiliate cookie on load
  useEffect(() => {
    if (affiliateRef) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);
      document.cookie = `affiliate_ref=${affiliateRef}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
      
      // Track click
      fetch("/api/affiliate/track-click", {
        method: "POST",
        body: JSON.stringify({ ref: affiliateRef }),
        headers: { "Content-Type": "application/json" }
      }).catch(console.error);
    }
  }, [affiliateRef]);

  // Load real plans from API
  useEffect(() => {
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
         if (data.success) {
            setDbPlans(data.plans);
         }
      })
      .catch(console.error);
      
    // Check auth status
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
    // Map to db plan if possible, else just use the first active plan as fallback
    const dbPlan = dbPlans.find(p => p.name.toLowerCase().includes(planTitle.toLowerCase().split(' ')[0]));
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
      <HeroSection 
        onBuyNow={handleBuyNow} 
        isCheckoutLoading={isCheckoutLoading} 
        dbPlans={dbPlans} 
      />
      
      <SocialProof />
      
      <ProcessGuarantee />
      
      <SocialTrust />

      <NewsRibbon />

      <EligibilityFAQ />

      {/* Modal for Authentication */}
      <OTPModal 
        isOpen={showOTP} 
        onClose={() => setShowOTP(false)} 
        onNext={handleAuthSuccess}
      />

      {/* Spin to win - Disabled */}
      <SpinToWin enabled={false} />
    </div>
  );
}
