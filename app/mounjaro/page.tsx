import { MounjaroLandingPage } from "@/components/mounjaro-lp/page";
import { ScratchCardPopup } from "@/components/scratch-card-popup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lean Protocol | Mounjaro (Tirzepatide) Medical Weight Loss Program",
  description:
    "Tirzepatide (Mounjaro) GLP-1 program. Doctor-led, science-based weight loss. Guaranteed 10% weight loss in 6 months or full refund.",
};

export default function MounjaroPage() {
  return (
    <>
      <ScratchCardPopup />
      <MounjaroLandingPage />
    </>
  );
}