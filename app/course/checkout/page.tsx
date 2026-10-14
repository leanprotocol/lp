// app/course/checkout/page.tsx
// Rs 99 checkout for the GLP weight loss master class. The store buttons on
// /course send people here. After payment the buyer signs in to the Lean
// Protocol app with the same mobile number; the app unlocks the course for it.
// Pure ASCII file.

import type { Metadata } from "next";
import CheckoutForm from "./checkout-form";

export const metadata: Metadata = {
  title: "Get the GLP Weight Loss Master Class | Lean Protocol",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}