export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { TEAM_COOKIE, getTeamLeads, validSession } from "../../../../lib/team-dashboard";

export async function GET(request: NextRequest) {
  if (!validSession(request.cookies.get(TEAM_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    const snap = await getTeamLeads();
    return NextResponse.json(
      { syncedAt: snap.syncedAt, stale: snap.stale, leads: snap.leads },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "TeleCRM is not responding. Try again in a minute." }, { status: 503 });
  }
}