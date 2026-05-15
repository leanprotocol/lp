import type { Metadata } from "next";
import ContactPageClient from "./client";

export const metadata: Metadata = {
  title: "Contact Us | Lean Protocol",
  description:
    "Get in touch with the Lean Protocol team. We're happy to help with questions about our GLP-1 weight loss program, support, or careers.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
