import type { Metadata } from "next";
import "./users.css";

export const metadata: Metadata = {
  title: "Get Your Personalised Plan | Lean Protocol",
  description:
    "Answer six quick questions and a Lean Protocol expert will call you with a personalised, doctor-guided weight-management plan.",
  robots: { index: false, follow: false },
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <div className="users-page">{children}</div>;
}
