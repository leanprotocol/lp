import Footer from "@/components/footer";
import { Header } from "@/components/header";
import TermsConditions from "./terms-conditions-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Lean Protocol",
  description: "Read the Terms & Conditions for using Lean Protocol. Covers medical disclaimers, eligibility (18-65 years), refund policies, the Results Promise (6% weight loss), telemedicine consent, and user responsibilities.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <TermsConditions />
      <Footer/>
    </section>
  );
}