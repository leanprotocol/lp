import type { Metadata } from "next";
import "./challenge.css";

// Standalone marketing campaign layout.
// Deliberately does NOT import the main site's Header/Footer/nav —
// this page has zero interconnection with the rest of leanprotocol.in.

export const metadata: Metadata = {
  title: "Lean Protocol — 30 Days Hard Challenge | GLP-1 Weight Loss",
  description:
    "Lose up to 22% body weight in 30 days with a personalised, doctor-led GLP-1 protocol. Start with a ₹449 doctor consultation.",
};

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return <div className="challenge-page">{children}</div>;
}
