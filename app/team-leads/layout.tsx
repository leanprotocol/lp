import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaign leads | Lean Protocol",
  robots: { index: false, follow: false },
};

export default function TeamLeadsLayout({ children }: { children: React.ReactNode }) {
  return children;
}