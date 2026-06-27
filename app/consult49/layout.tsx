import type { Metadata } from "next";
import "./consult49.css";

export const metadata: Metadata = {
  title: "GLP-1 Doctor Consultation at Just ₹49 | Lean Protocol",
  description:
    "Book a live 1:1 video consultation with a GLP-1 expert doctor for just ₹49. Root cause analysis, personalised fat-loss plan, prescription delivered.",
};

export default function Consult49Layout({ children }: { children: React.ReactNode }) {
  return <div className="consult49-page">{children}</div>;
}
