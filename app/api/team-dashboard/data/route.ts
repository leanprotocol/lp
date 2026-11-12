export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// The first load after a deploy reads every lead from TeleCRM in 30-day windows.
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import { TEAM_COOKIE, displayName, getTeamLeads, sessionUser } from "../../../../lib/team-dashboard";

export async function GET(request: NextRequest) {
  const user = sessionUser(request.cookies.get(TEAM_COOKIE)?.value);
  if (user === null) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    const snap = await getTeamLeads();
    return NextResponse.json(
      { syncedAt: snap.syncedAt, stale: snap.stale, leads: snap.leads, user: displayName(user) || null },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "TeleCRM is not responding. Try again in a minute." }, { status: 503 });
  }
}
