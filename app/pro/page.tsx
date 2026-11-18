// app/pro/page.tsx
// Served at pro.leanprotocol.in via a beforeFiles host rewrite in
// next.config.mjs (the plain array form runs after filesystem routing and
// never fires - HANDOVER s5).
// Metadata uses "Rs", never a rupee symbol (HANDOVER s7).

import type { Metadata } from "next";
import { CampaignPage } from "@/components/campaign/campaign-page";

export const metadata: Metadata = {
  title: "Doctor-Led GLP-1 Weight Management Protocol | Lean Protocol",
  description:
    "Doctor-led, prescription-only GLP-1 weight management. At-home diagnostics, expert consultations and dietitian support. Full refund if a doctor finds you ineligible.",
  // The same page is shown at www.leanprotocol.in/programme, which is the address
  // search engines should list. This address stays the ad landing page.
  alternates: {
    canonical: "https://www.leanprotocol.in/programme",
  },
};

export default function Page() {
  return <CampaignPage />;
}
