import ToolsCalculator from "@/components/tools-calculator";
import BMIInfo from "@/components/bmi-calculator/bmi-info";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.leanprotocol.in/bmi-calculator" },
  title: "BMI Calculator for Indian Adults | Lean Protocol",
  description: "Calculate your BMI instantly and read it against Asian-Indian cut-offs (overweight from 23, obese from 25). Learn why BMI is only a screening tool and what else to check.",
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