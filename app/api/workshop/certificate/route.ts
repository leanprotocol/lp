// app/api/workshop/certificate/route.ts
// Records the name and email to print on the certificate. Only callable by
// a verified phone whose attempt passed - the certificate is rendered in
// the browser, so this route exists to store who claimed one.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/workshop/session";
import { getAttempt, saveCertificateDetails } from "@/lib/workshop/db";

export async function POST(request: NextRequest) {
  try {
    const phone = readSessionToken(
      request.cookies.get(SESSION_COOKIE)?.value
    );
    if (!phone) {
      return NextResponse.json({ error: "Not verified" }, { status: 401 });
    }

    const attempt = await getAttempt(phone);
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

    const body = (await request.json()) as { name?: string; email?: string };
    const name = (body.name || "").trim().replace(/\s+/g, " ");
    const email = (body.email || "").trim().toLowerCase();

    if (name.length < 2 || name.length > 60) {
      return NextResponse.json(
        { error: "Please enter your full name" },
        { status: 400 }
      );
    }
    if (!/^[\p{L}\p{M}.'\- ]+$/u.test(name)) {
      return NextResponse.json(
        { error: "Name contains unsupported characters" },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    await saveCertificateDetails(phone, name, email);

    return NextResponse.json({ success: true, name, email });
  } catch (error) {
    console.error("[workshop/certificate]", error);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}
