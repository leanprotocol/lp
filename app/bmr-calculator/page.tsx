import BMRCalculator from "@/components/bmr-calculator/bmr-calculator";
import BMRInfo from "@/components/bmr-calculator/bmr-info";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMR Calculator for Weight Loss | Lean Protocol",
  description: "Calculate your BMR to find your body's 'idle mode' calorie needs. Learn how muscle mass impacts metabolism, explore formulas like Mifflin-St Jeor, and plan your diet for weight loss or muscle gain.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function Page() {
  return (
    <section>
      <Header/>
      <BMRCalculator />
      <BMRInfo/>
      <Footer/>
    </section>
  );
}