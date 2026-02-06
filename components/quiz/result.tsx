"use client";

import { AlertCircle, FileText, Microscope, ArrowRight, Zap, CheckCircle, Home } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";

type CoverageStatus = "covered" | "partial" | "not_covered" | "not_applicable";

export interface CoverageInfo {
  status?: CoverageStatus | null;
  title?: string | null;
  message?: string | null;
  supportingDetail?: string | null;
}

interface ResultProps {
  quizSubmitted?: boolean;
  submissionMessage?: string;
  submissionError?: string;
  coverage?: CoverageInfo | null;
  isPincodeAllowed?: boolean;
  planId?: string | null;
  hasExistingSubscription?: boolean;
}

export default function Result({
  quizSubmitted = false,
  submissionMessage,
  submissionError,
  coverage,
  isPincodeAllowed = true,
  planId = null,
  hasExistingSubscription = false,
}: ResultProps) {
  const isSuccess = quizSubmitted && !submissionError;
  const hasCoverage = isSuccess && !!coverage;
  const isFromPurchaseFlow = !!planId;
  const { isReady: razorpayReady, isLoading: razorpayLoading, openCheckout } = useRazorpayCheckout();

  const [defaultPlanId, setDefaultPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<
    | { id: string; price: number; originalPrice?: number | null; isDefault?: boolean }
    | null
  >(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [autoCheckoutTriggered, setAutoCheckoutTriggered] = useState(false);

  const devSkipEnabled =
    process.env.NODE_ENV === "development" &&
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("devSkipPay") === "1");

  const canPay = useMemo(() => {
    if (!defaultPlanId) return false;
    if (!razorpayReady) return false;
    return true;
  }, [defaultPlanId, razorpayReady]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchDefaultPlan = async () => {
      setPlanLoading(true);
      try {
        const res = await fetch("/api/plans", { signal: controller.signal });
        const data = await res.json();

        if (!mounted) return;

        if (!res.ok) {
          setDefaultPlanId(null);
          return;
        }

        const plans = (data?.plans ?? []) as Array<{
          id: string;
          price: number;
          originalPrice?: number | null;
          isDefault?: boolean;
        }>;
        const matched = (planId ? plans.find((p) => p.id === planId) : null) ?? plans.find((p) => p.isDefault) ?? plans[0];
        setDefaultPlanId(matched?.id ?? null);
        setSelectedPlan(matched ?? null);
      } catch {
        if (!mounted) return;
        setDefaultPlanId(null);
        setSelectedPlan(null);
      } finally {
        if (!mounted) return;
        setPlanLoading(false);
      }
    };

    fetchDefaultPlan();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [planId]);

  useEffect(() => {
    if (!devSkipEnabled) return;
    if (!defaultPlanId) return;
    if (!razorpayReady) return;
    if (razorpayLoading) return;
    if (autoCheckoutTriggered) return;

    setAutoCheckoutTriggered(true);
    openCheckout(defaultPlanId);
  }, [
    devSkipEnabled,
    defaultPlanId,
    razorpayReady,
    razorpayLoading,
    autoCheckoutTriggered,
    openCheckout,
  ]);

  useEffect(() => {
    if (!isSuccess) return;
    if (!defaultPlanId) return;
    if (!razorpayReady) return;
    if (razorpayLoading) return;
    if (autoCheckoutTriggered) return;

    setAutoCheckoutTriggered(true);
    openCheckout(defaultPlanId);
  }, [
    isSuccess,
    defaultPlanId,
    razorpayReady,
    razorpayLoading,
    autoCheckoutTriggered,
    openCheckout,
  ]);

  const renderStatusBlock = () => {
    if (isFromPurchaseFlow && isSuccess) {
      return (
        <>
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div className="space-y-2">
            <p className="text-xl font-semibold text-[#1F302B]">
              Plan Purchased Successfully!
            </p>
            <p className="text-base text-black/70 leading-relaxed max-w-2xl">
              Quiz submitted successfully. Your submission will be reviewed within 24 hours.
            </p>
            {selectedPlan && (
              <p className="text-sm text-[#5B746F]">
                Plan: {selectedPlan.id === planId ? "Selected Plan" : "Plan"} - Rs {Number(selectedPlan.price).toLocaleString()}
              </p>
            )}
          </div>
        </>
      );
    }

    if (submissionError) {
      return (
        <>
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-base text-black/80 leading-relaxed max-w-lg">
            <span className="font-semibold text-red-600">Submission Failed</span> {submissionError}
          </p>
        </>
      );
    }

    if (hasCoverage) {
      const isCovered = coverage?.status === "covered";
      const isPartial = coverage?.status === "partial";
      const iconColor = isCovered ? "text-green-600" : isPartial ? "text-amber-500" : "text-black/60";
      const IconComponent = isCovered ? CheckCircle : AlertCircle;

      return (
        <>
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
          <div className="space-y-3">
            {submissionMessage ? (
              <p className="text-base text-black/70 leading-relaxed max-w-2xl">{submissionMessage}</p>
            ) : null}

            <p className="text-base text-black/80 leading-relaxed max-w-2xl">
              {coverage?.title && (
                <span className={`font-semibold ${isCovered ? "text-green-600" : "text-black"}`}>
                  {coverage.title}
                </span>
              )}{" "}
              {coverage?.message}
            </p>
          </div>
          {coverage?.supportingDetail && (
            <p className="text-sm text-black/60 leading-relaxed max-w-2xl">
              {coverage.supportingDetail}
            </p>
          )}
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-base text-black/80 leading-relaxed max-w-2xl">
            {submissionMessage ?? null}
          </p>
        </>
      );
    }

    if (!isPincodeAllowed) {
      return (
        <>
          <AlertCircle className="w-6 h-6" />
          <p className="text-base text-black/80 leading-relaxed max-w-2xl">
            {submissionMessage ?? null}
          </p>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#191919] flex flex-col items-center py-8 px-4">
      
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        <div className="flex flex-col items-center text-center space-y-2">
            {renderStatusBlock()}
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-[1.5rem] p-6">
          
          <div className="text-center mb-12 border-b border-[#F5F5F4] pb-10">
            <h2 className="font-serif text-xl md:text-2xl text-[#1F302B] mb-2">
              No Worries
            </h2>
            <p className="text-base md:text-lg text-black/70 mb-4 max-w-2xl mx-auto leading-relaxed">
              Our treatment’s first steps begin with the at-home Advanced Blood Test, designed to give your care team a clearer starting point.
            </p>
            <div className="inline-flex flex-col  items-center justify-center gap-3 text-[#2F3A32]">
              <span className="text-sm font-medium tracking-[0.3em] uppercase text-[#8B9384]">
                {isFromPurchaseFlow ? "Purchased Plan" : "Transparent Pricing"}
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-base font-medium text-[#5B6356]">
                {selectedPlan?.originalPrice ? (
                  <span>
                    Actual Value{" "}
                    <span className="line-through text-[#A8A393]">
                      Rs {Number(selectedPlan.originalPrice).toLocaleString()}
                    </span>
                  </span>
                ) : null}
                <span className="hidden sm:block text-[#CFCABA]">|</span>
                <span className="inline-flex items-center gap-2 rounded-full  px-5 py-3 shadow-[0_4px_20px_rgba(31,48,43,0.12)]">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#1F302B]">
                    {isFromPurchaseFlow ? "Purchased" : "Our Price"}
                  </span>
                  <span className="font-serif text-3xl font-bold leading-none text-[#1F302B]">
                    Rs {selectedPlan ? Number(selectedPlan.price).toLocaleString() : "—"}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F2E9] border border-[#E3E3E3] flex items-center justify-center text-[#5B746F] mb-4">
                <Microscope className="w-7 h-7" />
              </div>
              <p className="text-sm text-[#57534E] leading-relaxed font-medium">
                This isn’t just a blood test. It’s the most complete health evaluation test to address your condition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F2E9] border border-[#E3E3E3] flex items-center justify-center text-[#5B746F] mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <p className="text-sm text-[#57534E] leading-relaxed font-medium">
                We don’t just hand you a report. We turn complex results into clear insights, guided by a 1:1 consult with Expert Doctor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F2E9] border border-[#E3E3E3] flex items-center justify-center text-[#5B746F] mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <p className="text-sm text-[#57534E] leading-relaxed font-medium">
                Turn your insights into action with the right GLP 1 plan for you.
              </p>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center">
            {isFromPurchaseFlow ? (
              <Button 
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full md:w-[160px] h-12 bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-xl text-base font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  if (!defaultPlanId) return;
                  openCheckout(defaultPlanId);
                }}
                disabled={!canPay || planLoading || razorpayLoading}
                className="w-full md:w-[160px] h-12 bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-xl text-base font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {planLoading || razorpayLoading ? "Starting..." : "Begin Now"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}