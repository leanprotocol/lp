/* Daily feed for Google Ads: Package purchased leads that came from a Google
   ad click, in the CSV format of Google's scheduled conversion upload.
   What is (and is not) sent: lib/google-ads-conversions.ts.

   Google Ads > Goals > Conversions > Uploads > Schedules, source HTTPS:
     URL       https://<site>/api/google-ads/conversions
     Username  google-ads
     Password  the value of the Vercel variable GOOGLE_ADS_FEED_PASSWORD
   Without that variable (or set to  off ) the feed is switched off.

   Pure ASCII file. */

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getGooglePurchaseConversions, toGoogleCsv } from "@/lib/google-ads-conversions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export async function GET(req: NextRequest) {
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
    console.log(`[Google Ads feed] served ${rows.length} purchase conversions`);
    return new NextResponse(toGoogleCsv(rows), {
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
