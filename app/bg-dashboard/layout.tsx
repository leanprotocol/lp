import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BG leads | Lean Protocol",
  robots: { index: false, follow: false },
};

export default function BgDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}