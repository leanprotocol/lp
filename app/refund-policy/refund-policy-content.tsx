"use client";

import { LegalDocPage } from "@/components/legal/legal-doc";
import { moneyBackGuarantee } from "@/content/legal/money-back-guarantee";

export default function RefundPolicy() {
  return <LegalDocPage doc={moneyBackGuarantee} />;
}