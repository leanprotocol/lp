import ToolsCalculator from "@/components/tools-calculator";
import BMRInfo from "@/components/bmr-calculator/bmr-info";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.leanprotocol.in/bmr-calculator" },
  title: "BMR Calculator India: Daily Calories in kg and cm | Lean Protocol",
  description: "Free BMR calculator for Indian adults in kg and cm. Uses the Mifflin-St Jeor formula to estimate the calories your body burns at rest and your daily need, so you can plan weight loss or gain.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <ToolsCalculator defaultTab={1} />
      <BMRInfo/>
      <Footer/>
    </section>
  );
}