"use client";

// app/course/attribution.tsx
// Remembers where a visitor came from (UTMs, click IDs, landing URL,
// referrer) for this browser session, so the checkout can send it to TeleCRM
// with the lead. First touch wins within a session. Renders nothing.
// Pure ASCII file.

import { useEffect } from "react";

export const ATTR_KEY = "lp_course_attr";
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];

export function readAttribution(): Record<string, string> {
  try {
    const saved = JSON.parse(sessionStorage.getItem(ATTR_KEY) || "null");
    if (saved) return saved;
  } catch { /* storage blocked */ }
  return {};
}

export default function AttributionCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ATTR_KEY)) return;
      const q = new URLSearchParams(window.location.search);
      const a: Record<string, string> = {};
      for (const k of KEYS) { const v = q.get(k); if (v) a[k] = v.slice(0, 200); }
      const cid = q.get("utm_id") || q.get("gad_campaignid");
      if (cid) a.campaign_id = cid.slice(0, 100);
      a.page_url = window.location.href.slice(0, 1000);
      if (document.referrer) a.referrer = document.referrer.slice(0, 500);
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(a));
    } catch { /* storage blocked: the lead is still saved, without attribution */ }
  }, []);
  return null;
}