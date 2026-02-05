"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

type CreateOrderResponse = {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  subscriptionId: string;
  paymentId: string;
};

type VerifyPaymentResponse = {
  success: boolean;
  message?: string;
  subscriptionId?: string;
};

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Not in browser"));

    if (window.Razorpay) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function useRazorpayCheckout() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadRazorpayScript()
      .then(() => {
        if (mounted) setIsReady(true);
      })
      .catch(() => {
        if (mounted) setIsReady(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openCheckout = useCallback(async (planId: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await loadRazorpayScript();

      const createOrderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const createOrderData = (await createOrderRes.json()) as CreateOrderResponse | { error?: string };

      if (!createOrderRes.ok) {
        const err = (createOrderData as any)?.error || "Failed to create order";
        throw new Error(err);
      }

      const order = createOrderData as CreateOrderResponse;

      const razorpay = new window.Razorpay({
        key: order.keyId,
        currency: order.currency,
        amount: Math.round(order.amount * 100),
        name: "Lean Health",
        description: "Advanced Blood Test & Evaluation",
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = (await verifyRes.json()) as VerifyPaymentResponse | { error?: string };

            if (!verifyRes.ok || !(verifyData as VerifyPaymentResponse).success) {
              throw new Error((verifyData as any)?.error || "Payment verification failed");
            }

            toast({
              title: "Payment successful",
              description:
                "Your payment is confirmed. Your subscription is pending admin approval.",
            });
          } catch (error: any) {
            toast({
              title: "Verification failed",
              description: error?.message || "Payment verification failed",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment cancelled",
              description: "You can complete the payment anytime from this page.",
            });
          },
        },
        theme: {
          color: "#1F302B",
        },
      });

      razorpay.on("payment.failed", (evt: any) => {
        const description = evt?.error?.description || "Payment failed";
        toast({
          title: "Payment failed",
          description,
          variant: "destructive",
        });
      });

      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Checkout error",
        description: error?.message || "Unable to start payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return {
    isReady,
    isLoading,
    openCheckout,
  };
}
