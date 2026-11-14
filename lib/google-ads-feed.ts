/* Google Ads purchase feed, for the two addresses that end in .csv.

   Google's Data Manager only accepts an HTTPS source whose address ends in
   .csv or .tsv, so the feed is also served at:

     /api/google-ads/conversions.csv        ("template")
       Google's upload template: a Parameters:TimeZone=+0530 line, then the
       column names, then the rows. Same content as /api/google-ads/conversions.

     /api/google-ads/conversions-plain.csv  ("plain")
       For screens that take the FIRST line as the column names: no
       Parameters line, three columns, and the +0530 offset inside each time.

   Both list the same conversions with the same moments in time, so Google
   counts each one once whichever address is used.
   What is (and is not) sent: lib/google-ads-conversions.ts.
   Same username and password as the original address.

   Pure ASCII file. */

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  GOOGLE_CONVERSION_NAME,
  getGooglePurchaseConversions,
  toGoogleCsv,
  type GoogleConversion,
} from "./google-ads-conversions";

const FEED_USER = "google-ads";

function same(a: string, b: string) {
  const x = crypto.createHash("sha256").update(a).digest();
  const y = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(x, y);
}

function authorised(req: NextRequest, password: string) {
  const h = req.headers.get("authorization") || "";
  if (!/^basic /i.test(h)) return false;
  const decoded = Buffer.from(h.slice(6).trim(), "base64").toString("utf8");
  const i = decoded.indexOf(":");
  if (i < 0) return false;
  const userOk = same(decoded.slice(0, i), FEED_USER);
  const passOk = same(decoded.slice(i + 1), password);
  return userOk && passOk;
}

/* India time with its offset, for example 2026-11-11 18:07:31+0530 */
function istTimeWithOffset(ms: number) {
  return new Date(ms + 330 * 60_000).toISOString().slice(0, 19).replace("T", " ") + "+0530";
}

function toPlainCsv(rows: GoogleConversion[]) {
  const lines = ["Google Click ID,Conversion Name,Conversion Time"];
  for (const r of rows) lines.push(`${r.gclid},${GOOGLE_CONVERSION_NAME},${istTimeWithOffset(r.at)}`);
  return lines.join("\r\n") + "\r\n";
}

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function googleAdsFeed(req: NextRequest, format: "template" | "plain") {
  const password = (process.env.GOOGLE_ADS_FEED_PASSWORD || "").trim();
  if (password.length < 16 || password.toLowerCase() === "off") {
    return new NextResponse("Feed is off (GOOGLE_ADS_FEED_PASSWORD not set)\n", { status: 503, headers: NO_STORE });
  }
  if (!authorised(req, password)) {
    console.warn("[Google Ads feed] refused: wrong or missing username/password");
    return new NextResponse("Unauthorized\n", {
      status: 401,
      headers: { ...NO_STORE, "WWW-Authenticate": 'Basic realm="google-ads-feed", charset="UTF-8"' },
    });
  }
  try {
    const rows = await getGooglePurchaseConversions();
    console.log(`[Google Ads feed] served ${rows.length} purchase conversions (${format} csv)`);
    return new NextResponse(format === "plain" ? toPlainCsv(rows) : toGoogleCsv(rows), {
      headers: {
        ...NO_STORE,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'inline; filename="package-purchases.csv"',
      },
    });
  } catch (e) {
    console.error("[Google Ads feed] TeleCRM read failed:", e);
    return new NextResponse("TeleCRM read failed, try again later\n", { status: 502, headers: NO_STORE });
  }
}
