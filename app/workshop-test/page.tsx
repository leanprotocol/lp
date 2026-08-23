import { notFound } from "next/navigation";
// app/workshop-test/page.tsx
// Dietitian onboarding assessment. Everything runs as one client component
// with internal states, so nothing navigates mid-test and no answers can be
// lost to a route change.
//
// Metadata uses plain text only - no rupee symbols, no em dashes.

import type { Metadata } from "next";
import { WorkshopClient } from "@/components/workshop/workshop-client";

export const metadata: Metadata = {
  title: "GLP-1 Protocol Assessment | Lean Protocol",
  description:
    "Dietitian onboarding assessment. 15 questions, 15 minutes, 80 percent to pass.",
  robots: { index: false, follow: false },
};

export default function WorkshopTestPage() {
  // Assessment closed after the 23 Aug 2026 workshop.
  // To reopen: delete the notFound() call and the import above.
  notFound();
}
