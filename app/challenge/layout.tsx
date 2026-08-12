import type { Metadata } from "next";
import "./challenge.css";

// Standalone marketing campaign layout.
// Deliberately does NOT import the main site's Header/Footer/nav -
// this page has zero interconnection with the rest of leanprotocol.in.
// Metadata is plain text: use "Rs", never a rupee symbol (it corrupts).

export const metadata: Metadata = {
  title: "Lean Protocol - 30 Days GLP-1 Challenge | Doctor-Led Weight Care",
  description:
    "A personalised, doctor-led GLP-1 protocol. Start with a Rs 449 doctor consultation. Eligibility is decided by a licensed doctor; individual results vary.",
};

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return <div className="challenge-page">{children}</div>;
}