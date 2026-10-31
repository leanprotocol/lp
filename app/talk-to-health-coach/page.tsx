// app/talk-to-health-coach/page.tsx
// Served at forms.leanprotocol.in/talk-to-health-coach via a beforeFiles host
// rewrite in next.config.mjs (the plain array form runs after filesystem
// routing and never fires - HANDOVER s5).
// Metadata uses "Rs", never a rupee symbol (HANDOVER s7).

import type { Metadata } from "next";
import CoachFunnel from "./coach-funnel";
import "./coach.css";

export const metadata: Metadata = {
  title: "Talk to a Senior Health Coach | Lean Protocol",
  description:
    "Answer five questions, see your BMI against Indian cut-offs, and book 20 minutes with a senior health coach for Rs 49.",
  alternates: {
    canonical: "https://forms.leanprotocol.in/talk-to-health-coach",
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CoachFunnel />;
}