import ToolsCalculator from "@/components/tools-calculator";
import BMIInfo from "@/components/bmi-calculator/bmi-info";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.leanprotocol.in/bmi-calculator" },
  title: "BMI Calculator | Lean Protocol",
  description: "Calculate your BMI instantly. Understand weight categories (Underweight to Obesity Class 3), learn why BMI is just a screening tool (muscle vs. fat), and explore holistic health factors for the Indian context.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <ToolsCalculator defaultTab={0} />
      <BMIInfo/>
      <Footer/>
    </section>
  );
}