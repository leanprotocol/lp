import ToolsCalculator from "@/components/tools-calculator";
import ProteinInfo from "@/components/protein-calculator/protein-info";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.leanprotocol.in/protein-calculator" },
  title: "Protein Calculator India: Grams of Protein a Day | Lean Protocol",
  description: "Free protein calculator for Indian adults. See how many grams of protein you need a day to hold your weight, lose fat or build muscle, in kg and cm.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <ToolsCalculator defaultTab={3} />
      <ProteinInfo/>
      <Footer/>
    </section>
  );
}
