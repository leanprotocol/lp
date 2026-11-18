// app/programme/page.tsx
// The programme and plans page of the main site: www.leanprotocol.in/programme.
// It shows the same page as pro.leanprotocol.in (app/pro), which stays the ad
// landing page. Search engines are pointed here from both addresses.
//
// Plans are read on the server, so the heading, the plan names and the prices are
// in the page that search engines first read. The browser still loads them again
// from /api/plans, exactly as on the pro page, so checkout always uses live plans.
// Metadata uses "Rs", never a rupee symbol.

import type { Metadata } from "next";
import { CampaignPage } from "@/components/campaign/campaign-page";
import type { DbPlan } from "@/components/campaign/plans-hero";
import type { MedTrack } from "@/content/campaign";
import { prisma } from "@/lib/prisma";

const SITE = "https://www.leanprotocol.in";

// Rebuilt at most every five minutes, so a price change shows up without a deploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Weight Care Programme, Plans and Pricing | Lean Protocol",
  description:
    "Doctor-led, prescription-only weight care: at-home diagnostics, doctor consultations and dietitian support. See each plan and its price.",
  alternates: { canonical: `${SITE}/programme` },
};

/* The same query as /api/plans. */
async function loadPlans(type: MedTrack): Promise<DbPlan[]> {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true, medicationType: type },
    orderBy: [{ displayOrder: "asc" }] as any,
  });
  return plans.map((plan: any) => ({
    id: String(plan.id),
    name: String(plan.name),
    price: Number(plan.price),
    originalPrice: plan.originalPrice == null ? null : Number(plan.originalPrice),
    durationDays: Number(plan.durationDays),
  }));
}

/* Any failure returns undefined. The page then loads plans in the browser,
   exactly as the pro page does, so nothing breaks if the database is slow. */
async function loadInitialPlans(): Promise<Record<MedTrack, DbPlan[]> | undefined> {
  try {
    const [sema, mounjaro] = await Promise.all([
      loadPlans("SEMAGLUTIDE"),
      loadPlans("MOUNJARO"),
    ]);
    if (sema.length === 0 && mounjaro.length === 0) return undefined;
    return { SEMAGLUTIDE: sema, MOUNJARO: mounjaro };
  } catch (err) {
    console.error("[/programme] could not read plans on the server", err);
    return undefined;
  }
}

export default async function Page() {
  const initialPlans = await loadInitialPlans();
  return <CampaignPage initialPlans={initialPlans} />;
}
