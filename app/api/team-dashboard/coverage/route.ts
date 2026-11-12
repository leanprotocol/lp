export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import { TEAM_COOKIE, getCoverage, sessionUser } from "../../../../lib/team-dashboard";

/* Open /api/team-dashboard/coverage?days=30 in a browser that is signed in
   to /team-leads. Read-only: counts and campaign labels, no names or phones. */
export async function GET(request: NextRequest) {
  const user = sessionUser(request.cookies.get(TEAM_COOKIE)?.value);
  if (user === null) {
    return NextResponse.json({ error: "Not signed in. Sign in at /team-leads first, then open this page again." }, { status: 401 });
  }
  const days = Math.max(1, Math.min(365, Number(request.nextUrl.searchParams.get("days")) || 30));
  console.info(`[team-dashboard] user=${user || "shared-password"} ran coverage days=${days}`);
  try {
    const report = await getCoverage(days);
    return new NextResponse(JSON.stringify(report, null, 2), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "TeleCRM is not responding. Try again in a minute.", detail: String(e).slice(0, 200) },
      { status: 503 }
    );
  }
}
