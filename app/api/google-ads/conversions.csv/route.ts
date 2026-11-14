/* Google Ads purchase feed at an address ending in .csv, which Google's
   Data Manager requires. Google's template, with the Parameters line.
   Everything is in lib/google-ads-feed.ts.

   Pure ASCII file. */

import { NextRequest } from "next/server";
import { googleAdsFeed } from "@/lib/google-ads-feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function GET(req: NextRequest) {
  return googleAdsFeed(req, "template");
}
