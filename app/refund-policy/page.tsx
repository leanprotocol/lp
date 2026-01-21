import Footer from "@/components/footer";
import { Header } from "@/components/header";
import RefundPolicy from "./refund-policy-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Lean Protocol Results Promise",
  description: "Review our Guaranteed Refund Policy. We promise 6% weight loss in 3 months for eligible GLP-1 programs. Learn about eligibility, adherence requirements (tracking, medication, logging), and the refund review process.",
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