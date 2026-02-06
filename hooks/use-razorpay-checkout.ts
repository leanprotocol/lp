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

type CreateOrderErrorResponse = {
  error?: string;
  blockingSubscription?: {
    id: string;
    status: string;
    planName?: string | null;
    endDate?: string | null;
  };
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

  type CheckoutOptions = {
    onSuccess?: (data: VerifyPaymentResponse) => void | Promise<void>;
    onFailure?: (error: Error) => void;
    onDismiss?: () => void;
  };

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

  const openCheckout = useCallback(async (planId: string, options?: CheckoutOptions) => {
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

      const createOrderData = (await createOrderRes.json()) as
        | CreateOrderResponse
        | CreateOrderErrorResponse;

      if (!createOrderRes.ok) {
        const err = (createOrderData as CreateOrderErrorResponse)?.error || "Failed to create order";
        const blocking = (createOrderData as CreateOrderErrorResponse)?.blockingSubscription;

        if (blocking?.status) {
          const planName = blocking.planName ? ` for ${blocking.planName}` : "";
          const message = `${err}${planName} (status: ${blocking.status}).`;
          throw new Error(message);
        }

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

            await options?.onSuccess?.(verifyData as VerifyPaymentResponse);

            toast({
              title: "Payment successful",
              description:
                "Your payment is confirmed. Your subscription is pending admin approval.",
            });
          } catch (error: any) {
            options?.onFailure?.(error instanceof Error ? error : new Error(error?.message || 'Payment verification failed'));
            toast({
              title: "Verification failed",
              description: error?.message || "Payment verification failed",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            options?.onDismiss?.();
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
      options?.onFailure?.(error instanceof Error ? error : new Error(error?.message || 'Unable to start payment'));
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
