// app/course-quiz/page.tsx
// Served at forms.leanprotocol.in/course via a beforeFiles host rewrite in
// next.config.mjs. leanprotocol.in/course is a different page and still
// sells the same master class at Rs 99.
// Metadata uses "Rs", never a rupee symbol (HANDOVER s7).

import type { Metadata } from "next";
import QuizFunnel from "./quiz-funnel";
import "./quiz.css";

export const metadata: Metadata = {
  title: "How much do you know about GLP weight loss? | Lean Protocol",
  description:
    "Four questions on GLP weight loss. See your score, then unlock the 13-chapter master class from Rs 49.",
  alternates: { canonical: "https://forms.leanprotocol.in/course" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <QuizFunnel />;
}