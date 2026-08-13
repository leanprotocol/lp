import Footer from "@/components/footer";
import { Header } from "@/components/header";
import RefundPolicy from "./refund-policy-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Lean Protocol Results Promise",
  description: "The Lean Protocol Six-Month Results Promise. Eligibility, adherence requirements, how results are measured, exclusions and the claim process.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <RefundPolicy />
      <Footer/>
    </section>
  );
}