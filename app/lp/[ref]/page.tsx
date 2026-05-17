import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffiliateLandingPage } from "@/components/affiliate-lp/page";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Lean Protocol | India's #1 GLP-1 Medical Weight Loss Program",
  description:
    "Semaglutide GLP-1 Pen Shot backed by Torrent Pharma. Doctor-led, science-based weight loss. Guaranteed 10% weight loss in 6 months or full refund. Plans from ₹5,999.",
};

interface Props {
  params: Promise<{ ref: string }>;
}

export default async function LPAffiliatePage({ params }: Props) {
  const { ref } = await params;

  // Validate that the affiliate referral code exists and is active
  const affiliate = await prisma.affiliate.findUnique({
    where: { referralCode: ref },
    select: { id: true, isActive: true },
  });

  if (!affiliate || !affiliate.isActive) {
    notFound();
  }

  return <AffiliateLandingPage affiliateRef={ref} />;
}
