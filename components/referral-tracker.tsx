"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const ref = searchParams.get("ref");
    
    if (ref) {
      // Set a cookie that expires in 90 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);
      
      document.cookie = `affiliate_ref=${ref}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
      
      // Track click (optional: could hit an API here to increment a counter)
      fetch("/api/affiliate/track-click", {
        method: "POST",
        body: JSON.stringify({ ref }),
        headers: { "Content-Type": "application/json" }
      }).catch(err => console.error("Failed to track click:", err));
    }
  }, [searchParams]);

  return null;
}
