import Footer from "@/components/footer";
import { Header } from "@/components/header";
import ToolsCalculator from "@/components/tools-calculator";
import WaistToHipInfo from "@/components/waist-to-hip-calculator/waist-to-hip-info";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.leanprotocol.in/waist-to-hip-calculator" },
  title: "Waist to Hip Ratio Calculator and Healthy Range | Lean Protocol",
  description: "Free waist to hip ratio calculator in cm. See how your ratio compares with the WHO cut-offs (0.90 for men, 0.85 for women) and what fat around the waist means for your health.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <ToolsCalculator defaultTab={2} />
      <WaistToHipInfo/>
      <Footer/>
    </section>
  );
}