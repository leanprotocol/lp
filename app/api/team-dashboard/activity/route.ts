export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { TEAM_COOKIE, getLeadActivity, validSession } from "../../../../lib/team-dashboard";

export async function GET(request: NextRequest) {
  if (!validSession(request.cookies.get(TEAM_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id") || "";
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  }
  try {
    const items = await getLeadActivity(id);
    if (!items) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "TeleCRM is not responding. Try again in a minute." }, { status: 503 });
  }
}