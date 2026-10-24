/* TeleCRM updates for the master class checkout.

   recordCheckoutStarted() runs when someone clicks Pay, before Razorpay opens,
   so an abandoned payment is still a lead callers can follow up.

   - New lead: full attribution (source "course-masterclass", UTMs, click IDs,
     lead_channel, landing page).
   - Existing lead (e.g. came through the /users funnel): original source and
     UTMs are left alone; only the course fields are added.
   - A lead already marked Paid is never set back to "Checkout started".

   TeleCRM Lead Fields used (create them under Settings -> Lead Fields):
     course_payment        Dropdown: "Checkout started", "Paid"
     course_checkout_on    Date
     consent_age_18_plus   Text   (same field the /users funnel writes)
     consent_marketing     Text   (same field the /users funnel writes)
     consent_recorded_at   Text
   (course_amount, course_paid_on and razorpay_payment_id are set on payment.)

   Pure ASCII file. */

const ENT = process.env.TELECRM_ENTERPRISE_ID;
const ASYNC_TOKEN = process.env.TELECRM_API_TOKEN;
const SYNC_TOKEN = process.env.TELECRM_SYNC_TOKEN;

export type Attribution = {
  utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string;
  campaign_id?: string; gclid?: string; fbclid?: string; page_url?: string; referrer?: string;
};

const clip = (v: unknown, n = 300) => String(v ?? "").slice(0, n);

/* Same rule as the /users funnel: a click ID wins over utm_source. */
export function leadChannel(utmSource?: string, gclid?: string, fbclid?: string): string {
  const src = (utmSource || "").toLowerCase();
  if (gclid || src === "google") return "Google Ads";
  if (fbclid || ["meta", "facebook", "fb", "instagram", "ig"].includes(src)) return "Meta Ads";
  if (["chatgpt", "openai"].includes(src)) return "OpenAI Ads";
  return src || "Organic / Direct";
}

/* null = no lead with this phone; undefined = could not tell (Sync API off or down). */
async function findLead(phone91: string): Promise<{ fields?: Record<string, unknown> } | null | undefined> {
  if (!ENT || !SYNC_TOKEN) return undefined;
  try {
    const r = await fetch(`https://next.telecrm.in/autoupdate/v2/enterprise/${ENT}/lead/search?skip=0&limit=1`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${SYNC_TOKEN}` },
      body: JSON.stringify({ fields: { phone: phone91 } }),
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return undefined;
    const d = await r.json();
    return Array.isArray(d?.data) && d.data[0] ? d.data[0] : null;
  } catch {
    return undefined;
  }
}

async function pushLead(fields: Record<string, unknown>) {
  if (!ENT || !ASYNC_TOKEN) { console.log("[Course CRM] TeleCRM not configured", fields); return false; }
  const clean = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== "" && v !== null && v !== undefined));
  const r = await fetch(`https://next-api.telecrm.in/enterprise/${ENT}/autoupdatelead`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ASYNC_TOKEN}` },
    body: JSON.stringify({ fields: clean }),
    signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) { console.error("[Course CRM] rejected:", r.status, (await r.text().catch(() => "")).slice(0, 200)); return false; }
  return true;
}

export async function recordCheckoutStarted(name: string, phone10: string, a: Attribution, marketingConsent = false): Promise<boolean> {
  try {
    const phone91 = `91${phone10}`;
    const existing = await findLead(phone91);
    if (existing && String(existing.fields?.course_payment ?? "").toLowerCase() === "paid") return true;

    const fields: Record<string, unknown> = {
      phone: phone91,
      course_payment: "Checkout started",
      course_checkout_on: Date.now(),
      /* What was agreed at the point of purchase, and when. Same field names as
         the /users funnel so the two report consistently. The required tick
         covers age and the policies; marketing is the separate optional one. */
      consent_age_18_plus: "Yes",
      consent_marketing: marketingConsent ? "Yes" : "No",
      consent_recorded_at: new Date().toISOString(),
    };
    if (existing === null) {
      Object.assign(fields, {
        name,
        source: "course-masterclass",
        utm_source: clip(a.utm_source), utm_medium: clip(a.utm_medium), utm_campaign: clip(a.utm_campaign),
        utm_content: clip(a.utm_content), utm_term: clip(a.utm_term), campaign_id: clip(a.campaign_id),
        gclid: clip(a.gclid), fbclid: clip(a.fbclid),
        page_url: clip(a.page_url, 1000), referrer: clip(a.referrer, 500),
        lead_channel: leadChannel(a.utm_source, a.gclid, a.fbclid),
      });
    } else if (!existing || !existing.fields?.name) {
      fields.name = name;
    }
    return await pushLead(fields);
  } catch (e) {
    console.error("[Course CRM] checkout-started push failed:", e);
    return false;
  }
}