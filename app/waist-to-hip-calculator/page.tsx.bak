import Footer from "@/components/footer";
import { Header } from "@/components/header";
import WaistToHipCalculator from "@/components/waist-to-hip-calculator/waist-to-hip-calculator";
import WaistToHipInfo from "@/components/waist-to-hip-calculator/waist-to-hip-info";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waist-to-Hip Ratio Calculator | Lean Protocol",
  description: "Calculate your Waist-to-Hip Ratio (WHR) to assess fat distribution and metabolic health. Learn why belly fat (apple shape) indicates higher risk than BMI suggests and how to measure accurately.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <WaistToHipCalculator />
      <WaistToHipInfo/>
      <Footer/>
    </section>
  );
}