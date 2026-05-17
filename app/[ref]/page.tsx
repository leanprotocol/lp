"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Handle short referral links like leanprotocol.in/manju
 * Sets the affiliate_ref cookie and redirects to home.
 */
export default function ReferralShortLinkPage() {
  const router = useRouter();
  const params = useParams();
  const ref = params.ref as string;

  useEffect(() => {
    if (ref) {
      // Set a cookie that expires in 90 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);
      
      document.cookie = `affiliate_ref=${ref}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
      
      // Track click
      fetch("/api/affiliate/track-click", {
        method: "POST",
        body: JSON.stringify({ ref }),
        headers: { "Content-Type": "application/json" }
      }).finally(() => {
        router.replace(`/lp/${ref}`);
      });
    } else {
      router.replace("/");
    }
  }, [ref, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FDF8EF]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-slate-500 font-medium">Redirecting you to Lean Protocol...</p>
      </div>
    </div>
  );
}
