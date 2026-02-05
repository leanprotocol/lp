"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  plan.isDefault ? "lg:scale-105 border-2 border-primary" : "border border-gray-200"
                }`}
              >
                {plan.isDefault && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  {plan.description && (
                    <p className="text-gray-600 text-sm mb-6">
                      {plan.description}
                    </p>
                  )}

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      {plan.originalPrice ? (
                        <span className="text-xl text-gray-500 line-through mr-3">
                          ₹{Number(plan.originalPrice).toLocaleString()}
                        </span>
                      ) : null}
                      <span className="text-5xl font-bold text-gray-900">
                        ₹{plan.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-2">
                      {durationInMonths(plan.durationDays)}{" "}
                      {durationInMonths(plan.durationDays) === 1 ? "month" : "months"}
                    </p>
                  </div>

                  <Button
                    className={`w-full mb-6 ${
                      plan.isDefault
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    Get Started
                  </Button>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      What's included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(plan.isRefundable || plan.allowAutoRenew) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {plan.isRefundable && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            Refundable
                          </span>
                        )}
                        {plan.allowAutoRenew && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                            Auto-Renew Available
                          </span>
                        )}
                      </div>
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
    </div>
  );
}
