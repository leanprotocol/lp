import { NextResponse } from "next/server";

/* Lead capture for the standalone Brides Edit page.
   It forwards the lead into your existing CRM lead handler (/api/challenge/lead)
   so brides leads land in the same CRM as your other funnels, while keeping the
   Brides page fully self-contained under /api/brides/*.

   If you'd rather give Brides its own CRM pipeline, replace the forward below
   with your own integration (webhook, DB insert, etc.). Lead capture must never
   block the funnel, so this always resolves without throwing. */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const origin = new URL(req.url).origin;
    const res = await fetch(`${origin}/api/challenge/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    // never block the funnel on lead capture
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
