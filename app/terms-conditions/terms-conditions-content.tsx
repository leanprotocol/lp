"use client";

// app/terms-conditions/terms-conditions-content.tsx
// Text lives in content/legal/terms-conditions.ts, generated verbatim from
// the approved Word document. When legal revises it, replace that data file
// - this component does not change.

import { LegalDocPage } from "@/components/legal/legal-doc";
import { termsConditions } from "@/content/legal/terms-conditions";

export default function TermsConditions() {
  return <LegalDocPage doc={termsConditions} />;
}
