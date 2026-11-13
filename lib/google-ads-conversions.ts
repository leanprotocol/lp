/* Google Ads offline conversions: "Package purchased" leads, sent back to
   Google so it learns which ad clicks became buyers.

   WHAT GOES TO GOOGLE. One row per lead whose TeleCRM status is
   "Package purchased" and that has a Google click ID (gclid, which our lead
   routes save to TeleCRM): the click ID, the conversion name and a time.
   Nothing else - no name, phone, email, BMI, weight, goal or medication.
   Decided 13 Nov 2026 (HIPAA plan, ad tracking: no health data to ad
   platforms).

   HOW. Google Ads fetches /api/google-ads/conversions once a day (a
   scheduled upload from an HTTPS source, with a username and password).
   The same rows are offered every day for 89 days; Google counts each
   one once.

   TIME. The conversion time is when the lead first came into TeleCRM
   (created_on), not the purchase moment. Google de-duplicates on click ID +
   conversion name + time, so the time must never change between daily
   uploads, and TeleCRM has no fixed purchase time (modified_on moves with
   every note or call). Google's Conversions column credits the click date
   either way. If a returning lead's gclid was replaced by a later click,
   Google rejects that row ("conversion precedes click") and nothing is
   counted twice.

   WINDOW. Google keeps click IDs for 90 days, so only leads created in the
   last 89 days are listed.

   Pure ASCII file. */

import { searchAll } from "./team-dashboard";

/* Must match the conversion action's name in Google Ads exactly. */
export const GOOGLE_CONVERSION_NAME = "Package purchase";
const PURCHASED_STATUS = "package purchased";
const DAYS = 89;

export type GoogleConversion = { gclid: string; at: number };

export async function getGooglePurchaseConversions(): Promise<GoogleConversion[]> {
  const WINDOW = 30 * 86_400_000; // TeleCRM refuses very long created_on searches
  const end = Date.now();
  const start = end - DAYS * 86_400_000;
  const byLead = new Map<string, GoogleConversion>();
  for (let to = end; to > start; to -= WINDOW) {
    const from = Math.max(start, to - WINDOW);
    for (const r of await searchAll({ created_on: { from, to } }, 20_000)) {
      if (String(r.status ?? "").trim().toLowerCase() !== PURCHASED_STATUS) continue;
      const f = r.fields || {};
      const gclid = String(f.gclid ?? "").trim();
      const at = Number(f.created_on) || 0;
      if (!/^[A-Za-z0-9_-]{10,300}$/.test(gclid) || at < start) continue;
      byLead.set(String(r.id), { gclid, at });
    }
  }
  return Array.from(byLead.values()).sort((a, b) => a.at - b.at);
}

/* India time, as Google's template expects with Parameters:TimeZone. */
function istTime(ms: number) {
  return new Date(ms + 330 * 60_000).toISOString().slice(0, 19).replace("T", " ");
}

/* Google's click-conversion template. Value and currency are left blank, so
   Google uses the value set on the conversion action. */
export function toGoogleCsv(rows: GoogleConversion[]) {
  const lines = [
    "Parameters:TimeZone=+0530",
    "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
  ];
  for (const r of rows) lines.push(`${r.gclid},${GOOGLE_CONVERSION_NAME},${istTime(r.at)},,`);
  return lines.join("\r\n") + "\r\n";
}
