import type { Metadata } from "next";
import { PolicyShell } from "../policy-shell";
import { termsSections, policyMeta } from "../policies-content";

export const metadata: Metadata = {
  title: "Enquiry Form Terms & Conditions | Lean Protocol",
  description:
    "Terms and conditions governing the Lean Protocol enquiry landing page, questionnaire and lead-generation form.",
  robots: { index: false, follow: false },
};

export default function UsersTermsPage() {
  return (
    <PolicyShell
      title="Terms &amp; Conditions"
      intro="These Terms govern the Lean Protocol enquiry form only. They do not govern any paid programme, clinical consultation or healthcare service."
      sections={termsSections}
      contactHeading="Contact"
      contactLines={[policyMeta.company, `CIN: ${policyMeta.cin}`, policyMeta.address]}
    />
  );
}
