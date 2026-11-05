export const runtime = "nodejs";

/* The lead, written the moment someone submits the pop-up form.
 *
 * This runs BEFORE Razorpay opens, deliberately: an abandoned payment is
 * still a lead worth calling, and most people who open a payment window do
 * not complete it. The order route does not repeat this work.
 *
 * TeleCRM fields to create under Settings -> Lead Fields:
 *   quiz_score            Text    e.g. "3/4 (75%)"
 *   course_payment        Dropdown: "Quiz lead", "Paid", "Free - full marks"
 *   consent_contact       Text
 *   consent_age_18_plus   Text
 *   consent_marketing     Text
 *   consent_recorded_at   Text
 * A misspelt name is dropped by TeleCRM without an error.
 */

import { NextRequest, NextResponse } from "next/server";
import { QUIZ_LEAD_SOURCE, QUIZ_PER_RUN } from "@/content/course-quiz";

const ENT = process.env.TELECRM_ENTERPRISE_ID;
const TOKEN = process.env.TELECRM_API_TOKEN;
const URL = ENT ? `https://next-api.telecrm.in/enterprise/${ENT}/autoupdatelead` : null;

const clip = (v: unknown, n = 300) => String(v ?? "").slice(0, n);

/* Same rule as the other funnels: a click ID beats utm_source, because the
   ad platforms add them even when nobody tagged the campaign. */
function leadChannel(utmSource?: string, gclid?: string, fbclid?: string): string {
  const src = (utmSource || "").toLowerCase();
  if (gclid || src === "google") return "Google Ads";
  if (fbclid || ["meta", "facebook", "fb", "instagram", "ig"].includes(src)) return "Meta Ads";
  if (["chatgpt", "openai"].includes(src)) return "OpenAI Ads";
  return src || "Organic / Direct";
}

export async function POST(request: NextRequest) {
  try {
    const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const name = String(b.name || "").trim().slice(0, 100);
    const phone = String(b.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!name || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "A valid name and 10-digit mobile number are required" }, { status: 400 });
    }

    const score = Math.max(0, Math.min(QUIZ_PER_RUN, Number(b.score) || 0));
    const pct = Math.round((score / QUIZ_PER_RUN) * 100);
    const full = score === QUIZ_PER_RUN;

    if (!URL || !TOKEN) {
      console.log("[course-quiz lead] TeleCRM not configured - lead not sent");
      return NextResponse.json({ success: true, full });
    }

    const fields: Record<string, unknown> = {
      phone: `91${phone}`,
      name,
      source: QUIZ_LEAD_SOURCE,
      quiz_score: `${score}/${QUIZ_PER_RUN} (${pct}%)`,
      course_payment: full ? "Free - full marks" : "Quiz lead",
      consent_contact: "Yes",
      consent_age_18_plus: "Yes",
      consent_marketing: b.marketing === true ? "Yes" : "No",
      consent_recorded_at: new Date().toISOString(),
      utm_source: clip(b.utm_source),
      utm_medium: clip(b.utm_medium),
      utm_campaign: clip(b.utm_campaign),
      utm_content: clip(b.utm_content),
      utm_term: clip(b.utm_term),
      campaign_id: clip(b.campaign_id),
      gclid: clip(b.gclid),
      fbclid: clip(b.fbclid),
      page_url: clip(b.page_url, 1000),
      referrer: clip(b.referrer, 500),
      lead_channel: leadChannel(b.utm_source as string, b.gclid as string, b.fbclid as string),
    };

    const clean = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    );

    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ fields: clean }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      console.error("[course-quiz lead] TeleCRM rejected:", res.status, (await res.text().catch(() => "")).slice(0, 200));
      return NextResponse.json({ error: "Could not save your details. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ success: true, full });
  } catch (error) {
    console.error("[course-quiz lead] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}