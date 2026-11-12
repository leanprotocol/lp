export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// The first load after a deploy reads every lead from TeleCRM in 30-day windows.
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import { TEAM_COOKIE, getLeadActivity, sessionUser } from "../../../../lib/team-dashboard";

export async function GET(request: NextRequest) {
  const user = sessionUser(request.cookies.get(TEAM_COOKIE)?.value);
  if (user === null) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id") || "";
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  }
  // Audit trail in the Vercel logs: who opened which lead's notes.
  console.info(`[team-dashboard] user=${user || "shared-password"} opened lead=${id}`);
  try {
    const items = await getLeadActivity(id);
    if (!items) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "TeleCRM is not responding. Try again in a minute." }, { status: 503 });
  }
}
