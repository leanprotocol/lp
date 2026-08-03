import type { Metadata } from "next";
import { PolicyShell } from "../policy-shell";
import { privacySections, policyMeta } from "../policies-content";

export const metadata: Metadata = {
  title: "Enquiry Form Privacy Policy | Lean Protocol",
  description:
    "How Lean Protocol collects, uses and protects personal information submitted through the enquiry landing page and questionnaire.",
  robots: { index: false, follow: false },
};

export default function UsersPrivacyPage() {
  return (
    <PolicyShell
      title="Privacy Policy"
      intro="This Privacy Policy applies only to personal information collected through the Lean Protocol enquiry form."
      sections={privacySections}
      contactHeading="Privacy and Grievance Contact"
      contactLines={[
        "Compliance Team",
        policyMeta.company,
        `CIN: ${policyMeta.cin}`,
        policyMeta.address,
      ]}
    />
  );
}
