"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import OTPModal from "@/components/get-started/otp-modal";
import { toast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice?: number | null;
  durationDays: number;
  features: string[];
  isRefundable: boolean;
  allowAutoRenew: boolean;
  isDefault?: boolean;
}

export default function PricingClient() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<
    | { id: string; plan?: { id: string; name: string } | null }
    | null
  >(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkAuthAndActivePlan = async () => {
      try {
        const meRes = await fetch("/api/user/me?optional=1");
        const meData = await meRes.json().catch(() => null);
        if (!mounted) return;

        const loggedIn = !!meData?.user;
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          const subRes = await fetch("/api/user/subscription/active?optional=1");
          const subData = await subRes.json().catch(() => null);
          if (!mounted) return;
          setActiveSubscription(subData?.subscription ?? null);
        } else {
          setActiveSubscription(null);
        }
      } catch {
        if (!mounted) return;
        setIsLoggedIn(false);
        setActiveSubscription(null);
      } finally {
        if (!mounted) return;
        setAuthChecked(true);
      }
    };

    checkAuthAndActivePlan();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/plans");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch plans");
      }

      setPlans(data.plans);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const durationInMonths = (days: number) => {
    return Math.round(days / 30);
  };

  const hasActivePlan = useMemo(() => {
    return !!activeSubscription;
  }, [activeSubscription]);

  const handleGetStarted = async (planId: string) => {
    if (hasActivePlan) {
      toast({
        title: "You already have an active plan",
        description: "You can manage it from your dashboard.",
      });
      return;
    }

    if (!isLoggedIn) {
      setPendingPlanId(planId);
      setShowOTPModal(true);
      return;
    }

    router.push(`/quiz?planId=${encodeURIComponent(planId)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your health and wellness journey
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border px-0 pt-10 pb-8 shadow-sm bg-white/95 transition hover:-translate-y-1 hover:shadow-lg ${
                  plan.isDefault
                    ? "border-primary/70 shadow-primary/10"
                    : "border-gray-200"
                }`}
              >
                {plan.isDefault && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-white text-xs tracking-[0.3em] px-4 py-1 uppercase">
                    Popular
                  </div>
                )}

                <div className="flex h-full flex-col px-8">
                  <div className="min-h-[140px] space-y-3 text-left">
                    <h3 className="text-[1.65rem] font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-baseline gap-3">
                      {plan.originalPrice ? (
                        <span className="text-base text-gray-400 line-through">
                          ₹{Number(plan.originalPrice).toLocaleString()}
                        </span>
                      ) : null}
                      <span className="text-4xl font-semibold tracking-tight text-gray-900">
                        ₹{plan.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 uppercase tracking-[0.3em]">
                      {durationInMonths(plan.durationDays)} {durationInMonths(plan.durationDays) === 1 ? "month" : "months"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <Button
                      className={`w-full rounded-2xl py-5 text-base font-semibold ${
                        plan.isDefault
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-gray-900 text-white hover-bg-gray-800"
                      }`}
                      onClick={() => handleGetStarted(plan.id)}
                      disabled={!authChecked}
                    >
                      Get Started
                    </Button>
                  </div>

                  <div className="space-y-4 flex-1 mt-6">
                    <p className="text-xs tracking-[0.35em] text-gray-500 uppercase text-center md:text-left">
                      What's included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(plan.isRefundable || plan.allowAutoRenew) && (
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 mt-6">
                      {plan.isRefundable && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                          Refundable
                        </span>
                      )}
                      {plan.allowAutoRenew && (
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                          Auto-Renew Available
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Have questions? Contact us for personalized assistance.
          </p>
          <Button variant="outline" size="lg">
            Contact Support
          </Button>
        </div>
        </div>
    

  // (unreachable)  </div>


      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onNext={() => {
          const planId = pendingPlanId;
          setShowOTPModal(false);
          setPendingPlanId(null);
          if (planId) {
            router.push(`/quiz?planId=${encodeURIComponent(planId)}`);
          } else {
            router.push('/quiz');
          }
        }}
      />
    </>
  );
}
