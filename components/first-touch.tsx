"use client";

/* Remembers where a visit came from, so a lead can be marked "Organic search"
   in TeleCRM. Read on the server by lib/lead-touch.ts.

   On each full page load that comes from outside the site, it saves three
   things in a first-party cookie for 30 days: the site that sent the visitor,
   the page they landed on, and whether the link was an ad or a tagged campaign
   link. Moving between pages of the site, and coming back from a payment page,
   keep what was saved. Nothing about the person is stored. Renders nothing.

   Pure ASCII file. */

import { useEffect } from "react";

const COOKIE = "lp_touch"; // the same name as TOUCH_COOKIE in lib/lead-touch.ts
const DAYS = 30;
const TAG_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"];
const OWN_SITE = /(^|\.)leanprotocol\.in$/;
/* Coming back from a payment page is not a new visit. */
const NOT_A_VISIT = /razorpay|paytm|phonepe|payu|cashfree|ccavenue|billdesk|stripe/;

export function FirstTouch() {
  useEffect(() => {
    try {
      let host = "";
      try {
        host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
      } catch {
        host = "";
      }
      const here = window.location.hostname.toLowerCase();
      if (host && (host === here || OWN_SITE.test(host) || NOT_A_VISIT.test(host))) return;

      const q = new URLSearchParams(window.location.search);
      const tagged = TAG_PARAMS.some((k) => Boolean(q.get(k)));
      if (!host && !tagged) return; // a direct visit: keep the last source

      const value = encodeURIComponent(
        JSON.stringify({ r: host.slice(0, 100), l: window.location.pathname.slice(0, 120), p: tagged ? 1 : 0 })
      );
      document.cookie =
        `${COOKIE}=${value}; path=/; max-age=${DAYS * 86400}; samesite=lax` +
        (OWN_SITE.test(here) ? "; domain=.leanprotocol.in" : "") +
        (window.location.protocol === "https:" ? "; secure" : "");
    } catch {
      /* cookies blocked: the lead is still saved, with the channel it had before */
    }
  }, []);
  return null;
}
