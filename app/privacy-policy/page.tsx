import Footer from "@/components/footer";
import { Header } from "@/components/header";
import PrivacyPolicy from "./privacy-policy-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Lean Protocol",
  description: "Learn how Lean Protocol collects, protects, and uses your personal and health data. Covers consent, data sharing with care teams/labs, security measures, and your rights under Indian law.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <PrivacyPolicy />
      <Footer/>
    </section>
  );
}