"use client";

// app/privacy-policy/privacy-policy-content.tsx
// Text lives in content/legal/privacy-policy.ts, generated verbatim from the
// approved Word document. When legal revises it, replace that data file -
// this component does not change.

import { LegalDocPage } from "@/components/legal/legal-doc";
import { privacyPolicy } from "@/content/legal/privacy-policy";

export default function PrivacyPolicy() {
  return <LegalDocPage doc={privacyPolicy} />;
}
