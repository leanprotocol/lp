// app/course/success/page.tsx
// Payment success page for the master class, on its own URL so the purchase
// can be counted as a destination conversion in Google Ads and Meta, and so
// the buyer can bookmark or revisit it.
//
// The buyer's details are NOT in the URL. The checkout writes them to
// sessionStorage and this page reads them, so no name or phone number ends up
// in server logs, analytics or referrer headers.
//
// Pure ASCII file.

import type { Metadata } from "next";
import SuccessView from "./success-view";

export const metadata: Metadata = {
  title: "You are in | Lean Protocol",
  robots: { index: false, follow: false },
};

export default function CourseSuccessPage() {
  return <SuccessView />;
}