import { MounjaroLandingPage } from "@/components/mounjaro-lp/page";
import { ScratchCardPopup } from "@/components/scratch-card-popup";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Set to true to make the Mounjaro page live again
const PAGE_ENABLED = false;

export const metadata: Metadata = {
  title: "Lean Protocol | Mounjaro (Tirzepatide) Medical Weight Loss Program",
  description:
    "Tirzepatide (Mounjaro) GLP-1 programme. Doctor-led, science-based weight care. Eligible six-month members may qualify for a refund review; terms apply. Results vary.",
};

export default function MounjaroPage() {
  if (!PAGE_ENABLED) {
    notFound();
  }

  return (
    <>
      <ScratchCardPopup />
      <MounjaroLandingPage />
    </>
  );
}