// app/api/workshop/certificate/route.ts
// Records that the certificate was generated. The name and email were
// captured at sign-in and are carried in the signed session, so nothing is
// collected here.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/workshop/session";
import { getAttempt, markCertificateIssued } from "@/lib/workshop/db";

export async function POST(request: NextRequest) {
  try {
    const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      return NextResponse.json({ error: "Not verified" }, { status: 401 });
    }

    const attempt = await getAttempt(session.phone);
    if (!attempt || !attempt.submitted_at) {
      return NextResponse.json(
        { error: "Assessment not completed" },
        { status: 400 }
      );
    }
    if (!attempt.passed) {
      return NextResponse.json(
        { error: "Certificate is issued at 80% and above" },
        { status: 403 }
      );
    }

    await markCertificateIssued(session.phone);
    return NextResponse.json({ success: true, name: session.name });
  } catch (error) {
    console.error("[workshop/certificate]", error);
    return NextResponse.json({ error: "Could not issue" }, { status: 500 });
  }
}
