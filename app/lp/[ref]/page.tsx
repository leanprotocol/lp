import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffiliateLandingPage } from "@/components/affiliate-lp/page";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Lean Protocol | Doctor-Led GLP-1 Weight Management",
  description:
    "Doctor-led, science-based weight care with semaglutide where clinically appropriate. Eligible six-month members may qualify for a refund review; terms apply. Results vary. Plans from Rs 4,999.",
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

  return (
    <>
      <AffiliateLandingPage affiliateRef={ref} />
    </>
  );
}
